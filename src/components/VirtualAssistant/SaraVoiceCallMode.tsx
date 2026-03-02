import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Phone, Mic, MicOff, Loader2 } from 'lucide-react';
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
const LISTEN_DURATION_MS = 5000;

/** Browser TTS fallback */
const playBrowserTTS = (text: string): Promise<void> =>
  new Promise((resolve, reject) => {
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

/* ── Waveform Visualizer ── */
const WaveformBars = ({ active, level }: { active: boolean; level: number }) => {
  const NUM_BARS = 5;
  const bars = useMemo(() => Array.from({ length: NUM_BARS }, (_, i) => ({
    delay: i * 0.08,
    baseHeight: 4 + Math.abs(i - Math.floor(NUM_BARS / 2)) * 2,
  })), []);

  return (
    <div className="flex items-center justify-center gap-[3px] h-6">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: 3,
            backgroundColor: active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.3)',
          }}
          animate={{
            height: active
              ? bar.baseHeight + level * 20 + Math.sin(Date.now() / 150 + i * 1.2) * 6
              : 4,
          }}
          transition={{ duration: 0.1, delay: bar.delay }}
        />
      ))}
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

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const stopCurrentAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; audioRef.current = null; }
    if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null; }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setAudioLevel(0);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    return () => { activeRef.current = false; stopCurrentAudio(); };
  }, [stopCurrentAudio]);

  const playGoogleTTS = useCallback((text: string): Promise<void> =>
    new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-tts`,
          { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY }, body: JSON.stringify({ text }) }
        );
        if (!res.ok) throw new Error(`TTS ${res.status}`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        const animateLevel = () => {
          if (!activeRef.current || audio.paused) { setAudioLevel(0); return; }
          setAudioLevel(0.2 + Math.random() * 0.5);
          animFrameRef.current = requestAnimationFrame(animateLevel);
        };
        audio.onplay = animateLevel;
        audio.onended = () => { setAudioLevel(0); URL.revokeObjectURL(url); audioRef.current = null; resolve(); };
        audio.onerror = () => { setAudioLevel(0); URL.revokeObjectURL(url); audioRef.current = null; reject(new Error('playback')); };
        await audio.play();
      } catch (err) { reject(err); }
    }), []);

  const playTTS = useCallback(async (text: string) => {
    try { await playGoogleTTS(text); } catch (err) {
      console.warn('Google TTS fallback:', err);
      await playBrowserTTS(text);
    }
  }, [playGoogleTTS]);

  const processQueue = useCallback(async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0 || !activeRef.current) return;
    isPlayingRef.current = true;
    while (audioQueueRef.current.length > 0 && activeRef.current) {
      const nextText = audioQueueRef.current.shift()!;
      setCallState('speaking');
      setStatusText('Sara');
      try { await playTTS(nextText); } catch { break; }
    }
    isPlayingRef.current = false;
  }, [playTTS]);

  const transcribe = useCallback(async (blob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-stt`,
      { method: 'POST', headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` }, body: formData }
    );
    if (!response.ok) throw new Error(`STT ${response.status}`);
    const data = await response.json();
    return data.text || '';
  }, []);

  const converse = useCallback(async (text: string) => {
    if (!activeRef.current) return;
    emptyRetriesRef.current = 0;
    setCallState('processing');
    setStatusText('Pensando...');
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
        .replace(/\*+/g, '')
        .replace(/#{1,6}\s?/g, '')
        .replace(/-{2,}/g, '')
        .trim();
      audioQueueRef.current.push(cleanReply || 'No pude procesar tu mensaje.');
      await processQueue();
      if (activeRef.current) startListening();
    } catch (err) {
      console.error('Conversation error:', err);
      if (activeRef.current) { setCallState('idle'); setStatusText('Error. Toca para reintentar.'); }
    }
  }, [session, processQueue]);

  const startListening = useCallback(async () => {
    if (!activeRef.current || isMuted) { setCallState('idle'); setStatusText('Silenciado'); return; }
    stopCurrentAudio();
    setCallState('listening');
    setStatusText('Escuchando...');
    await startRecording();
    setTimeout(async () => {
      if (!activeRef.current) return;
      const blob = await stopRecording();
      if (!blob || !activeRef.current) return;
      setCallState('processing');
      setStatusText('Procesando...');
      try {
        const text = await transcribe(blob);
        if (text.trim()) { emptyRetriesRef.current = 0; await converse(text.trim()); }
        else {
          emptyRetriesRef.current++;
          if (emptyRetriesRef.current >= MAX_EMPTY_RETRIES) {
            emptyRetriesRef.current = 0; setCallState('idle'); setStatusText('No te escucho. Toca el micrófono.');
          } else { setStatusText('Intentando de nuevo...'); startListening(); }
        }
      } catch (err) {
        console.error('Transcription error:', err);
        if (activeRef.current) { toast({ title: 'Error', description: 'No se pudo procesar el audio.', variant: 'destructive' }); setCallState('idle'); setStatusText('Error. Toca para reintentar.'); }
      }
    }, LISTEN_DURATION_MS);
  }, [isMuted, startRecording, stopRecording, transcribe, converse, toast, stopCurrentAudio]);

  useEffect(() => {
    const init = async () => {
      try {
        setCallState('greeting');
        setStatusText('Sara');
        await playTTS('¡Hola! Soy Sara, tu asistente de Nova. ¿En qué puedo ayudarte?');
        if (activeRef.current) { await new Promise(r => setTimeout(r, 400)); startListening(); }
      } catch (err) {
        console.error('Greeting error:', err);
        if (activeRef.current) { setCallState('idle'); setStatusText('Toca el micrófono para empezar'); }
      }
    };
    init();
  }, []);

  const handleEndCall = () => { activeRef.current = false; stopCurrentAudio(); stopRecording(); onEnd(); };

  const handleMicToggle = async () => {
    if (isRecording) {
      const blob = await stopRecording();
      if (blob && activeRef.current) {
        setCallState('processing'); setStatusText('Procesando...');
        try {
          const text = await transcribe(blob);
          if (text.trim()) await converse(text.trim()); else startListening();
        } catch { startListening(); }
      }
    } else if (callState === 'idle') { emptyRetriesRef.current = 0; startListening(); }
  };

  const handleMuteToggle = () => {
    setIsMuted(m => !m);
    if (isRecording) { stopRecording(); setCallState('idle'); setStatusText('Silenciado'); }
    stopCurrentAudio();
  };

  const isSpeaking = callState === 'speaking' || callState === 'greeting';
  const isListening = callState === 'listening';
  const isProcessing = callState === 'processing';

  // Ring pulse colors
  const ringColor = isListening
    ? 'hsl(var(--primary) / 0.4)'
    : isSpeaking
      ? 'hsl(var(--primary) / 0.25)'
      : 'transparent';

  return (
    <div className="relative flex flex-col items-center justify-between h-full bg-background select-none overflow-hidden">
      {/* Subtle top gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.06) 0%, transparent 60%)',
      }} />

      {/* Header */}
      <div className="relative z-10 pt-8 pb-2 text-center">
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground/60">
          {isListening ? 'Escuchando' : isSpeaking ? 'Hablando' : isProcessing ? 'Procesando' : 'Llamada en curso'}
        </p>
        <p className="text-sm font-light tracking-wider text-muted-foreground/80 mt-0.5 tabular-nums">
          {formatTime(elapsedTime)}
        </p>
      </div>

      {/* Central area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-5">
        {/* Avatar with rings */}
        <div className="relative" style={{ width: 160, height: 160 }}>
          {/* Outer ring pulse */}
          <motion.div
            className="absolute rounded-full"
            style={{ inset: -16, border: `1.5px solid ${ringColor}` }}
            animate={{
              scale: isListening ? [1, 1.12, 1] : isSpeaking ? [1, 1.06 + audioLevel * 0.08, 1] : 1,
              opacity: isListening || isSpeaking ? [0.8, 0.2, 0.8] : 0,
            }}
            transition={{ duration: isListening ? 1.8 : 0.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Inner ring */}
          <motion.div
            className="absolute rounded-full"
            style={{ inset: -6, border: `1px solid ${ringColor}` }}
            animate={{
              scale: isListening ? [1, 1.06, 1] : isSpeaking ? [1, 1.03 + audioLevel * 0.04, 1] : 1,
              opacity: isListening || isSpeaking ? 0.5 : 0,
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Avatar container */}
          <motion.div
            className="w-full h-full rounded-full overflow-hidden flex items-center justify-center shadow-lg"
            style={{
              background: 'hsl(var(--muted))',
              border: '2px solid hsl(var(--border))',
            }}
            animate={{
              scale: isSpeaking ? 1 + audioLevel * 0.06 : isProcessing ? [1, 0.97, 1] : 1,
            }}
            transition={{ duration: isSpeaking ? 0.1 : 1.5, repeat: isProcessing ? Infinity : 0, ease: 'easeInOut' }}
          >
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 className="w-10 h-10 animate-spin text-muted-foreground/60" />
                </motion.div>
              ) : (
                <motion.img
                  key="avatar"
                  src={saraAvatar}
                  alt="Sara"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Name */}
        <div className="text-center">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Sara</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={statusText}
              className="flex items-center justify-center gap-2 mt-1.5 min-h-[28px]"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {isSpeaking && <WaveformBars active level={audioLevel} />}
              {isListening && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
              )}
              <p className="text-sm text-muted-foreground">{statusText}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 w-full px-6 pb-8">
        <div
          className="flex items-center justify-center gap-6 py-4 px-6 rounded-2xl mx-auto max-w-xs"
          style={{
            background: 'hsl(var(--muted) / 0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid hsl(var(--border) / 0.5)',
          }}
        >
          {/* Mute */}
          <motion.button
            className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: isMuted ? 'hsl(var(--destructive) / 0.15)' : 'hsl(var(--background) / 0.8)',
              border: `1px solid ${isMuted ? 'hsl(var(--destructive) / 0.3)' : 'hsl(var(--border))'}`,
            }}
            whileTap={{ scale: 0.92 }}
            onClick={handleMuteToggle}
            aria-label={isMuted ? 'Activar micrófono' : 'Silenciar'}
          >
            {isMuted
              ? <MicOff className="w-[18px] h-[18px] text-destructive" />
              : <Mic className="w-[18px] h-[18px] text-muted-foreground" />}
          </motion.button>

          {/* End call */}
          <motion.button
            className="w-14 h-14 rounded-full flex items-center justify-center bg-destructive shadow-md"
            whileTap={{ scale: 0.88 }}
            onClick={handleEndCall}
            aria-label="Finalizar llamada"
          >
            <Phone className="w-5 h-5 text-destructive-foreground rotate-[135deg]" />
          </motion.button>

          {/* Tap to talk */}
          <motion.button
            className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: callState === 'idle'
                ? 'hsl(var(--primary) / 0.15)'
                : 'hsl(var(--background) / 0.8)',
              border: `1px solid ${callState === 'idle' ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--border))'}`,
              opacity: isProcessing || isSpeaking ? 0.4 : 1,
            }}
            whileTap={{ scale: 0.92 }}
            onClick={handleMicToggle}
            disabled={isProcessing || isSpeaking}
            aria-label="Pulsar para hablar"
          >
            <Mic className="w-[18px] h-[18px]" style={{
              color: callState === 'idle' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
            }} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SaraVoiceCallMode;
