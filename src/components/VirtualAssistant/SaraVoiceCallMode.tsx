import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { PhoneOff, Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useAuth } from '@/contexts/AuthContext';
import { sendToSara } from '@/lib/saraApi';
import { useToast } from '@/hooks/use-toast';
import saraAvatar from '@/assets/sara-avatar.png';

interface SaraVoiceCallModeProps {
  onEnd: () => void;
}

type CallState = 'connecting' | 'greeting' | 'listening' | 'processing' | 'speaking' | 'idle';

const SARA_SESSION_KEY = 'nova_chat_session_id';
const MAX_EMPTY_RETRIES = 3;
const LISTEN_DURATION_MS = 8000;
const NUM_BARS = 24;

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

/* ── Equalizer Bars ── */
const EqualizerBars = ({ active, level }: { active: boolean; level: number }) => {
  const bars = useMemo(() => Array.from({ length: NUM_BARS }, (_, i) => {
    const angle = (i / NUM_BARS) * 360;
    return { angle, delay: i * 0.04 };
  }), []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {bars.map((bar, i) => {
        const h = active ? 18 + level * 30 + Math.sin(Date.now() / 200 + i) * 8 : 6;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2.5,
              height: h,
              background: `linear-gradient(180deg, rgba(139,92,246,0.9) 0%, rgba(56,189,248,0.7) 100%)`,
              transformOrigin: 'center 70px',
              transform: `rotate(${bar.angle}deg) translateY(-70px)`,
            }}
            animate={{ height: active ? h : 6, opacity: active ? 0.85 : 0.25 }}
            transition={{ duration: 0.12, delay: bar.delay }}
          />
        );
      })}
    </div>
  );
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
    emptyRetriesRef.current = 0;
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
        .replace(/\*+/g, '')        // Strip asterisks for TTS
        .replace(/#{1,6}\s?/g, '')   // Strip markdown headings
        .replace(/-{2,}/g, '')       // Strip hr lines
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

  const isSpeaking = callState === 'speaking';
  const isListening = callState === 'listening';
  const isProcessing = callState === 'processing';

  return (
    <div className="relative flex flex-col items-center justify-between h-full overflow-hidden select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1a103d 0%, #0c0a1a 60%, #050510 100%)',
      }}
    >
      {/* Subtle star particles (CSS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: 'rgba(200,200,255,0.4)',
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Top bar */}
      <div className="relative z-10 pt-6 text-center">
        <p className="text-xs font-medium tracking-[0.25em] uppercase" style={{ color: 'rgba(200,200,255,0.5)' }}>
          Llamada en curso
        </p>
        <p className="text-lg font-light tracking-wider mt-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
          {formatTime(elapsedTime)}
        </p>
      </div>

      {/* Central orb area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6">
        {/* Name */}
        <motion.h2
          className="text-3xl font-extralight tracking-widest"
          style={{ color: 'rgba(255,255,255,0.9)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Sara
        </motion.h2>

        {/* Orb container */}
        <div className="relative" style={{ width: 200, height: 200 }}>
          {/* Outer glow rings */}
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: -30,
              background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            }}
            animate={{
              scale: isSpeaking ? [1, 1.15, 1] : isListening ? [1, 1.08, 1] : 1,
              opacity: isSpeaking ? 0.8 : 0.4,
            }}
            transition={{ duration: isSpeaking ? 0.4 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: -15,
              background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
            }}
            animate={{
              scale: isSpeaking ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Equalizer bars (circular) */}
          <EqualizerBars active={isSpeaking} level={audioLevel} />

          {/* Concentric ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px solid rgba(139,92,246,0.2)',
            }}
            animate={{
              scale: isListening || isSpeaking ? [1, 1.3, 1] : 1,
              opacity: isListening || isSpeaking ? [0.6, 0, 0.6] : 0.15,
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Main orb with glassmorphism */}
          <motion.div
            className="absolute inset-4 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: isListening
                ? 'linear-gradient(135deg, rgba(56,189,248,0.25) 0%, rgba(99,102,241,0.3) 100%)'
                : isSpeaking
                  ? 'linear-gradient(135deg, rgba(139,92,246,0.35) 0%, rgba(56,189,248,0.25) 100%)'
                  : isProcessing
                    ? 'linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(245,158,11,0.25) 100%)'
                    : 'linear-gradient(135deg, rgba(100,100,140,0.15) 0%, rgba(60,60,90,0.2) 100%)',
              backdropFilter: 'blur(20px)',
              boxShadow: isSpeaking
                ? '0 0 60px rgba(139,92,246,0.4), inset 0 0 30px rgba(139,92,246,0.1)'
                : isListening
                  ? '0 0 40px rgba(56,189,248,0.3), inset 0 0 20px rgba(56,189,248,0.08)'
                  : '0 0 20px rgba(100,100,160,0.15)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            animate={{
              scale: isSpeaking ? 1 + audioLevel * 0.15 : isListening ? [1, 1.03, 1] : isProcessing ? 0.95 : 1,
            }}
            transition={{ duration: isSpeaking ? 0.12 : 1.5, repeat: isListening ? Infinity : 0, ease: 'easeInOut' }}
          >
            {/* Sara avatar */}
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div key="loader" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 className="w-12 h-12 animate-spin" style={{ color: 'rgba(251,191,36,0.8)' }} />
                </motion.div>
              ) : isListening ? (
                <motion.div key="mic" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <Mic className="w-10 h-10" style={{ color: 'rgba(56,189,248,0.9)' }} />
                </motion.div>
              ) : (
                <motion.img
                  key="avatar"
                  src={saraAvatar}
                  alt="Sara"
                  className="w-24 h-24 rounded-full object-cover"
                  style={{ border: '2px solid rgba(255,255,255,0.1)' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Status text */}
        <motion.p
          className="text-sm tracking-wide text-center max-w-[240px]"
          style={{ color: 'rgba(200,200,255,0.6)' }}
          key={statusText}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {statusText}
        </motion.p>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 flex items-center gap-8 pb-8">
        {/* Mute */}
        <motion.button
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: isMuted ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          whileTap={{ scale: 0.9 }}
          onClick={handleMuteToggle}
        >
          {isMuted
            ? <MicOff className="w-5 h-5" style={{ color: 'rgba(239,68,68,0.9)' }} />
            : <Mic className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.7)' }} />}
        </motion.button>

        {/* End call */}
        <motion.button
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.9) 0%, rgba(185,28,28,0.9) 100%)',
            boxShadow: '0 0 30px rgba(239,68,68,0.4)',
          }}
          whileTap={{ scale: 0.85 }}
          onClick={handleEndCall}
        >
          <PhoneOff className="w-6 h-6" style={{ color: '#fff' }} />
        </motion.button>

        {/* Tap to talk */}
        <motion.button
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: callState === 'idle' ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            opacity: (isProcessing || isSpeaking) ? 0.4 : 1,
          }}
          whileTap={{ scale: 0.9 }}
          onClick={handleMicToggle}
          disabled={isProcessing || isSpeaking}
        >
          <Mic className="w-5 h-5" style={{ color: callState === 'idle' ? 'rgba(56,189,248,0.9)' : 'rgba(255,255,255,0.7)' }} />
        </motion.button>
      </div>
    </div>
  );
};

export default SaraVoiceCallMode;
