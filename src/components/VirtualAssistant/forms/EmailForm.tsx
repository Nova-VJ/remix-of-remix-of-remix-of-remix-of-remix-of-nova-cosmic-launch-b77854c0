import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { L } from '@/i18n';

interface EmailFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

const EmailForm = ({ onComplete, onCancel }: EmailFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('email_messages').insert([formData]);

      if (error) throw error;

      toast({
        title: L("¡Mensaje enviado!", "Message Sent!"),
        description: L("Te responderemos a la mayor brevedad posible.", "We will reply to your email as soon as possible.")
      });
      onComplete();
    } catch {
      toast({
        title: L("Error", "Error"),
        description: L("No se pudo enviar el mensaje. Inténtalo de nuevo.", "Could not send message. Please try again."),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-2">
      <div>
        <Label htmlFor="name" className="text-xs">{L('Nombre *', 'Full Name *')}</Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="h-9 text-sm"
          placeholder={L('Tu nombre', 'Your name')}
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-xs">{L('Email *', 'Email *')}</Label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="h-9 text-sm"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <Label htmlFor="subject" className="text-xs">{L('Asunto *', 'Subject *')}</Label>
        <Input
          id="subject"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="h-9 text-sm"
          placeholder={L('¿De qué trata tu consulta?', 'What is your inquiry about?')}
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-xs">{L('Mensaje *', 'Message *')}</Label>
        <Textarea
          id="message"
          required
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="text-sm resize-none"
          placeholder={L('Escribe tu mensaje aquí...', 'Write your message here...')}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="flex-1 text-xs"
        >
          {L('Cancelar', 'Cancel')}
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
          className="flex-1 text-xs"
        >
          {isSubmitting ? L('Enviando...', 'Sending...') : L('Enviar correo', 'Send Email')}
        </Button>
      </div>
    </form>
  );
};

export default EmailForm;
