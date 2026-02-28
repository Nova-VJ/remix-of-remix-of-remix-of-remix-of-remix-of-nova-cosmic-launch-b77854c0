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

const SaraVoiceCallMode = ({ onEnd }: SaraVoiceCallModeProps) => {
  const [callState, setCallState] = useState<CallState>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [statusText, setStatusText] = useState('Conectando...');
  const [elapsedTime, setElapsedTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeRef = useRef(true);

  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
  const { session } = useAuth();
  const { toast } = useToast();

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedTime(t => t + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeRef.current = false;
      cancelAnimationFrame(animFrameRef.current);
      audioContextRef.current?.close();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // TTS playback with analyser
  const playTTS = useCallback(async (text: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ text }),
          }
        );

        if (!response.ok) throw new Error('TTS failed');

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        // Set up Web Audio analyser
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
          audioContextRef.current = new AudioContext();
        }
        const ctx = audioContextRef.current;
        const source = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        analyserRef.current = analyser;

        // Animate based on frequency data
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const animate = () => {
          if (!activeRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setAudioLevel(avg / 255);
          animFrameRef.current = requestAnimationFrame(animate);
        };

        audio.onplay = () => animate();
        audio.onended = () => {
          cancelAnimationFrame(animFrameRef.current);
          setAudioLevel(0);
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Audio playback failed'));
        };

        await audio.play();
      } catch (err) {
        reject(err);
      }
    });
  }, []);

  // STT transcription
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

    if (!response.ok) throw new Error('STT failed');
    const data = await response.json();
    return data.text || '';
  }, []);

  // Main conversation loop
  const converse = useCallback(async (text: string) => {
    if (!activeRef.current) return;

    setCallState('processing');
    setStatusText('Sara está pensando...');

    try {
      const accessToken = session?.access_token;
      let sid = localStorage.getItem(SARA_SESSION_KEY);
      if (!sid) {
        sid = crypto.randomUUID();
        localStorage.setItem(SARA_SESSION_KEY, sid);
      }

      const { reply } = await sendToSara(text, accessToken, sid);

      if (!activeRef.current) return;

      // Clean reply for TTS (remove cart proposals, placeholders)
      const cleanReply = reply
        .replace(/\[PROPUESTA_CARRITO:[^\]]*\]/g, '')
        .replace(/\[LINK_WHATSAPP\]/gi, '')
        .replace(/\[LINK_FORMULARIO\]/gi, '')
        .replace(/##OPEN_FORM##/g, '')
        .replace(/https?:\/\/[^\s]+/g, '')
        .trim();

      setCallState('speaking');
      setStatusText('Sara está hablando...');
      await playTTS(cleanReply || 'No pude procesar tu mensaje.');

      if (!activeRef.current) return;

      // Start listening again
      startListening();
    } catch (err) {
      console.error('Conversation error:', err);
      if (activeRef.current) {
        setCallState('idle');
        setStatusText('Error. Toca el micrófono para reintentar.');
      }
    }
  }, [session, playTTS]);

  // Start listening
  const startListening = useCallback(async () => {
    if (!activeRef.current || isMuted) {
      setCallState('idle');
      setStatusText('Micrófono silenciado');
      return;
    }

    setCallState('listening');
    setStatusText('Escuchando...');
    await startRecording();

    // Auto-stop after 15 seconds
    setTimeout(async () => {
      if (!activeRef.current) return;
      const blob = await stopRecording();
      if (!blob || !activeRef.current) return;

      setCallState('processing');
      setStatusText('Transcribiendo...');

      try {
        const text = await transcribe(blob);
        if (text.trim()) {
          await converse(text.trim());
        } else {
          // No speech detected, listen again
          startListening();
        }
      } catch (err) {
        console.error('Transcription error:', err);
        if (activeRef.current) startListening();
      }
    }, 8000);
  }, [isMuted, startRecording, stopRecording, transcribe, converse]);

  // Initial greeting
  useEffect(() => {
    const init = async () => {
      try {
        setCallState('greeting');
        setStatusText('Sara está hablando...');
        await playTTS('¡Hola! Soy Sara, tu asistente de Nova. ¿En qué puedo ayudarte?');
        if (activeRef.current) {
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
    if (audioRef.current) {
      audioRef.current.pause();
    }
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
          if (text.trim()) {
            await converse(text.trim());
          } else {
            startListening();
          }
        } catch {
          startListening();
        }
      }
    } else if (callState === 'idle') {
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
  };

  // Orb scale based on state
  const getOrbScale = () => {
    switch (callState) {
      case 'speaking':
        return 1 + audioLevel * 0.6;
      case 'listening':
        return 1.05;
      case 'processing':
        return 0.95;
      default:
        return 1;
    }
  };

  const getOrbColor = () => {
    switch (callState) {
      case 'listening':
        return 'from-blue-500 to-cyan-400';
      case 'speaking':
        return 'from-violet-500 to-purple-400';
      case 'processing':
        return 'from-amber-400 to-orange-400';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full bg-background p-6">
      {/* Timer */}
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">{formatTime(elapsedTime)}</p>
        <p className="text-xs text-muted-foreground mt-1">Llamada con Sara</p>
      </div>

      {/* Animated Orb */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Outer glow */}
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${getOrbColor()} blur-2xl opacity-30`}
            animate={{
              scale: [getOrbScale() * 1.2, getOrbScale() * 1.4, getOrbScale() * 1.2],
            }}
            transition={{
              duration: callState === 'speaking' ? 0.3 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ width: 180, height: 180 }}
          />

          {/* Main orb */}
          <motion.div
            className={`relative w-[140px] h-[140px] rounded-full bg-gradient-to-br ${getOrbColor()} shadow-2xl flex items-center justify-center`}
            animate={{
              scale: getOrbScale(),
            }}
            transition={{
              duration: callState === 'speaking' ? 0.15 : 0.6,
              ease: 'easeOut',
            }}
          >
            {/* Inner pulse ring */}
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

            {/* Icon */}
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

      {/* Status */}
      <p className="text-sm text-muted-foreground mb-4">{statusText}</p>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-4">
        {/* Mute */}
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
          onClick={handleMuteToggle}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>

        {/* End call */}
        <Button
          variant="destructive"
          size="icon"
          className="w-14 h-14 rounded-full"
          onClick={handleEndCall}
        >
          <PhoneOff className="w-6 h-6" />
        </Button>

        {/* Manual mic toggle */}
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
          onClick={handleMicToggle}
          disabled={callState === 'processing' || callState === 'speaking'}
        >
          <Phone className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default SaraVoiceCallMode;
