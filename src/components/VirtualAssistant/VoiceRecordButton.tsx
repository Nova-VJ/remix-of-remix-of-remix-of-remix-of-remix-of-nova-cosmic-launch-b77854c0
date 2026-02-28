import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecordButtonProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

const VoiceRecordButton = ({ onTranscription, disabled }: VoiceRecordButtonProps) => {
  const { isRecording, startRecording, stopRecording, error } = useVoiceRecorder();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    if (isRecording) {
      const blob = await stopRecording();
      if (!blob) return;

      setIsTranscribing(true);
      try {
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

        if (!response.ok) throw new Error('Transcription failed');
        const data = await response.json();
        
        if (data.text && data.text.trim()) {
          onTranscription(data.text.trim());
        } else {
          toast({
            title: 'No se detectó voz',
            description: 'Intenta hablar más fuerte o más cerca del micrófono.',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error('Transcription error:', err);
        toast({
          title: 'Error al transcribir',
          description: 'No se pudo procesar el audio. Inténtalo de nuevo.',
          variant: 'destructive',
        });
      } finally {
        setIsTranscribing(false);
      }
    } else {
      await startRecording();
    }
  };

  if (error) {
    return (
      <Button
        type="button"
        size="icon"
        variant="ghost"
        disabled
        title={error}
        className="text-destructive"
      >
        <Mic className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="icon"
      variant={isRecording ? 'destructive' : 'ghost'}
      onClick={handleToggle}
      disabled={disabled || isTranscribing}
      title={isRecording ? 'Detener grabación' : 'Grabar nota de voz'}
      className="relative"
    >
      {isTranscribing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isRecording ? (
        <>
          <Square className="w-3.5 h-3.5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
        </>
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </Button>
  );
};

export default VoiceRecordButton;
