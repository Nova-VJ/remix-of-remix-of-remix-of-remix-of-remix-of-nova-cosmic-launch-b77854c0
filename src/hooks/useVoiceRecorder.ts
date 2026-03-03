import { useState, useRef, useCallback, useEffect } from 'react';

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  error: string | null;
  initMicrophone: () => Promise<boolean>;
  releaseMicrophone: () => void;
}

export const useVoiceRecorder = (): UseVoiceRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  /** Pre-acquire microphone stream so it's ready for instant recording */
  const initMicrophone = useCallback(async (): Promise<boolean> => {
    if (streamRef.current) return true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      streamRef.current = stream;
      console.log('[VoiceRecorder] Microphone initialized, tracks:', stream.getAudioTracks().length);
      return true;
    } catch (err) {
      console.error('[VoiceRecorder] Microphone init error:', err);
      setError('No se pudo acceder al micrófono. Verifica los permisos.');
      return false;
    }
  }, []);

  /** Release the microphone stream */
  const releaseMicrophone = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      console.log('[VoiceRecorder] Microphone released');
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      // Ensure we have a stream
      if (!streamRef.current || streamRef.current.getAudioTracks().every(t => t.readyState === 'ended')) {
        const ok = await initMicrophone();
        if (!ok) return;
      }

      const stream = streamRef.current!;
      
      // Prefer webm/opus, fallback to webm, then any available
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : '';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250); // collect chunks every 250ms
      setIsRecording(true);
      console.log('[VoiceRecorder] Recording started, mimeType:', recorder.mimeType);
    } catch (err) {
      console.error('[VoiceRecorder] Start error:', err);
      setError('No se pudo acceder al micrófono. Verifica los permisos.');
    }
  }, [initMicrophone]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        setIsRecording(false);
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        // DON'T stop tracks here - we reuse the stream
        setIsRecording(false);
        console.log(`[VoiceRecorder] Recording stopped, chunks: ${chunksRef.current.length}, blob size: ${blob.size} bytes`);
        resolve(blob);
      };

      recorder.stop();
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseMicrophone();
    };
  }, [releaseMicrophone]);

  return { isRecording, startRecording, stopRecording, error, initMicrophone, releaseMicrophone };
};
