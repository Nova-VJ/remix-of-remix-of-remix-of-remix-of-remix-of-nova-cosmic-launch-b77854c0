import { useState, useRef, useCallback, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useAuth } from '@/contexts/AuthContext';
import { sendToSara } from '@/lib/saraApi';
import { useToast } from '@/hooks/use-toast';

interface SaraVoiceCallModeProps {
  onEnd: () => void;
}

type CallState = 'connecting' | 'greeting' | 'listening' | 'processing' | 'speaking' | 'idle';

const SARA_SESSION_KEY = 'nova_chat_session_id';
const MAX_EMPTY_RETRIES = 3;
const LISTEN_DURATION_MS = 8000;

/** Browser TTS fallback */
const playBrowserTTS = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) { reject(new Error('no speechSynthesis')); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-ES'; u.rate = 1.05; u.pitch = 1.1; u.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.filter(v => v.lang.startsWith('es'))
      .find(v => /female|femenin|lucia|elena|monica|paula|conchita|ines/i.test(v.name)) || voices.find(v => v.lang.startsWith('es'));
    if (esVoice) u.voice = esVoice;
    u.onend = () => resolve();
    u.onerror = () => reject(new Error('TTS failed'));
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  });
};

const SaraVoiceCallMode = ({ onEnd }: SaraVoiceCallModeProps) => {
  const [callState, setCallState] = useState<CallState>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [statusText, setStatusText] = useState('Conectando...');
  const [elapsedTime, setElapsedTime] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeRef = useRef(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const emptyRetriesRef = useRef(0);

  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
  const { session } = useAuth();
  const { toast } = useToast();

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Stop current audio helper
  const stopCurrentAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setAudioLevel(0);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      activeRef.current = false;
      stopCurrentAudio();
    };
  }, [stopCurrentAudio]);

  // Google TTS
  const playGoogleTTS = useCallback((text: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({ text }),
          }
        );

        if (!res.ok) {
          const errData = await res.text();
          throw new Error(`Google TTS failed (${res.status}): ${errData}`);
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        const animateLevel = () => {
          if (!activeRef.current || audio.paused) { setAudioLevel(0); return; }
          setAudioLevel(0.2 + Math.random() * 0.5);
          animFrameRef.current = requestAnimationFrame(animateLevel);
        };

        audio.onplay = () => animateLevel();
        audio.onended = () => {
          setAudioLevel(0);
          URL.revokeObjectURL(url);
          audioRef.current = null;
          resolve();
        };
        audio.onerror = () => {
          setAudioLevel(0);
          URL.revokeObjectURL(url);
          audioRef.current = null;
          reject(new Error('Audio playback failed'));
        };

        await audio.play();
      } catch (err) {
        reject(err);
      }
    });
  }, []);

  // Play with fallback
  const playTTS = useCallback(async (text: string) => {
    try {
      await playGoogleTTS(text);
    } catch (err) {
      console.warn('Google TTS failed, falling back to browser:', err);
      toast({ title: 'Usando voz del navegador', description: 'La voz de Google no está disponible temporalmente.' });
      await playBrowserTTS(text);
    }
  }, [playGoogleTTS, toast]);

  // Audio queue processor
  const processQueue = useCallback(async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0 || !activeRef.current) return;
    isPlayingRef.current = true;
    while (audioQueueRef.current.length > 0 && activeRef.current) {
      const nextText = audioQueueRef.current.shift()!;
      setCallState('speaking');
      setStatusText('Sara está hablando...');
      try {
        await playTTS(nextText);
      } catch { break; }
    }
    isPlayingRef.current = false;
  }, [playTTS]);

  // Deepgram STT
  const transcribe = useCallback(async (blob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-stt`,
      {
        method: 'POST',
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: formData,
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`STT failed (${response.status}): ${errorText}`);
    }
    const data = await response.json();
    return data.text || '';
  }, []);

  // Conversation loop
  const converse = useCallback(async (text: string) => {
    if (!activeRef.current) return;
    emptyRetriesRef.current = 0; // Reset on successful speech
    setCallState('processing');
    setStatusText('Sara está pensando...');

    try {
      const accessToken = session?.access_token;
      let sid = localStorage.getItem(SARA_SESSION_KEY);
      if (!sid) { sid = crypto.randomUUID(); localStorage.setItem(SARA_SESSION_KEY, sid); }

      const { reply } = await sendToSara(text, accessToken, sid);
      if (!activeRef.current) return;

      const cleanReply = reply
        .replace(/\[PROPUESTA_CARRITO:[^\]]*\]/g, '')
        .replace(/\[LINK_WHATSAPP\]/gi, '')
        .replace(/\[LINK_FORMULARIO\]/gi, '')
        .replace(/##OPEN_FORM##/g, '')
        .replace(/https?:\/\/[^\s]+/g, '')
        .trim();

      audioQueueRef.current.push(cleanReply || 'No pude procesar tu mensaje.');
      await processQueue();

      if (activeRef.current) startListening();
    } catch (err) {
      console.error('Conversation error:', err);
      if (activeRef.current) {
        setCallState('idle');
        setStatusText('Error. Toca el micrófono para reintentar.');
      }
    }
  }, [session, processQueue]);

  // Start listening
  const startListening = useCallback(async () => {
    if (!activeRef.current || isMuted) {
      setCallState('idle');
      setStatusText('Micrófono silenciado');
      return;
    }

    // Stop any ongoing audio when user starts listening
    stopCurrentAudio();

    setCallState('listening');
    setStatusText('Escuchando...');
    await startRecording();

    setTimeout(async () => {
      if (!activeRef.current) return;
      const blob = await stopRecording();
      if (!blob || !activeRef.current) return;

      setCallState('processing');
      setStatusText('Transcribiendo...');

      try {
        const text = await transcribe(blob);
        if (text.trim()) {
          emptyRetriesRef.current = 0;
          await converse(text.trim());
        } else {
          // Empty transcript - retry with limit
          emptyRetriesRef.current++;
          if (emptyRetriesRef.current >= MAX_EMPTY_RETRIES) {
            emptyRetriesRef.current = 0;
            setCallState('idle');
            setStatusText('No te escucho. Toca el micrófono para hablar.');
          } else {
            setStatusText('No te he escuchado, intentando de nuevo...');
            startListening();
          }
        }
      } catch (err) {
        console.error('Transcription error:', err);
        if (activeRef.current) {
          toast({ title: 'Error de transcripción', description: 'No se pudo procesar el audio.', variant: 'destructive' });
          setCallState('idle');
          setStatusText('Error. Toca el micrófono para reintentar.');
        }
      }
    }, LISTEN_DURATION_MS);
  }, [isMuted, startRecording, stopRecording, transcribe, converse, toast, stopCurrentAudio]);

  // Initial greeting
  useEffect(() => {
    const init = async () => {
      try {
        setCallState('greeting');
        setStatusText('Sara está hablando...');
        await playTTS('¡Hola! Soy Sara, tu asistente de Nova. ¿En qué puedo ayudarte?');
        if (activeRef.current) {
          // Small delay after greeting to ensure audio system is ready
          await new Promise(r => setTimeout(r, 500));
          startListening();
        }
      } catch (err) {
        console.error('Greeting error:', err);
        if (activeRef.current) {
          setCallState('idle');
          setStatusText('Toca el micrófono para empezar');
        }
      }
    };
    init();
  }, []);

  const handleEndCall = () => {
    activeRef.current = false;
    stopCurrentAudio();
    stopRecording();
    onEnd();
  };

  const handleMicToggle = async () => {
    if (isRecording) {
      const blob = await stopRecording();
      if (blob && activeRef.current) {
        setCallState('processing');
        setStatusText('Transcribiendo...');
        try {
          const text = await transcribe(blob);
          if (text.trim()) { await converse(text.trim()); } else { startListening(); }
        } catch { startListening(); }
      }
    } else if (callState === 'idle') {
      emptyRetriesRef.current = 0;
      startListening();
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(m => !m);
    if (isRecording) {
      stopRecording();
      setCallState('idle');
      setStatusText('Micrófono silenciado');
    }
    stopCurrentAudio();
  };

  const getOrbScale = () => {
    switch (callState) {
      case 'speaking': return 1 + audioLevel * 0.6;
      case 'listening': return 1.05;
      case 'processing': return 0.95;
      default: return 1;
    }
  };

  const getOrbColor = () => {
    switch (callState) {
      case 'listening': return 'from-blue-500 to-cyan-400';
      case 'speaking': return 'from-violet-500 to-purple-400';
      case 'processing': return 'from-amber-400 to-orange-400';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full bg-background p-6">
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">{formatTime(elapsedTime)}</p>
        <p className="text-xs text-muted-foreground mt-1">Llamada con Sara</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${getOrbColor()} blur-2xl opacity-30`}
            animate={{ scale: [getOrbScale() * 1.2, getOrbScale() * 1.4, getOrbScale() * 1.2] }}
            transition={{ duration: callState === 'speaking' ? 0.3 : 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 180, height: 180 }}
          />
          <motion.div
            className={`relative w-[140px] h-[140px] rounded-full bg-gradient-to-br ${getOrbColor()} shadow-2xl flex items-center justify-center`}
            animate={{ scale: getOrbScale() }}
            transition={{ duration: callState === 'speaking' ? 0.15 : 0.6, ease: 'easeOut' }}
          >
            <AnimatePresence>
              {(callState === 'listening' || callState === 'speaking') && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </AnimatePresence>
            {callState === 'processing' ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : callState === 'listening' ? (
              <Mic className="w-10 h-10 text-white" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-white/40" />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{statusText}</p>

      <div className="flex items-center gap-6 mb-4">
        <Button variant="outline" size="icon" className="w-12 h-12 rounded-full" onClick={handleMuteToggle}>
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
        <Button variant="destructive" size="icon" className="w-14 h-14 rounded-full" onClick={handleEndCall}>
          <PhoneOff className="w-6 h-6" />
        </Button>
        <Button variant="outline" size="icon" className="w-12 h-12 rounded-full" onClick={handleMicToggle} disabled={callState === 'processing' || callState === 'speaking'}>
          <Phone className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default SaraVoiceCallMode;
