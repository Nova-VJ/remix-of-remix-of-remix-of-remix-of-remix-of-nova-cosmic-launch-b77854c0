import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';
import { L, isEn } from '@/i18n';

interface AgentFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

const AgentForm = ({ onComplete, onCancel }: AgentFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Business hours check
  const isWithinBusinessHours = () => {
    const now = new Date();
    const tz = isEn ? 'America/New_York' : 'Europe/Madrid';
    const targetTime = new Date(now.toLocaleString('en-US', { timeZone: tz }));
    const day = targetTime.getDay();
    const hour = targetTime.getHours();
    return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
  };

  const withinHours = isWithinBusinessHours();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('tickets').insert([{
        ...formData,
        category: 'llamada',
        priority: 'alta',
        subject: isEn ? 'Call Request (US)' : 'Solicitud de llamada',
        message: withinHours 
          ? (isEn ? 'Client requested to speak with an agent (during business hours)' : 'Cliente solicita hablar con un agente (dentro de horario)')
          : (isEn ? 'Client requested a callback (after hours)' : 'Cliente solicita que le llamen (fuera de horario)'),
        status: 'open'
      }]);

      if (error) throw error;

      toast({
        title: withinHours ? L("¡Recibido!", "Request Received!") : L("¡Solicitud registrada!", "Request Registered!"),
        description: withinHours 
          ? L("Un agente te contactará en breve.", "An advisor will reach out shortly.")
          : L("Te llamaremos en el próximo horario laboral (L-V 10:00-18:00).", "We will contact you during our next business hours (Mon-Fri 9am-6pm EST).")
      });
      onComplete();
    } catch {
      toast({
        title: L("Error", "Error"),
        description: L("No se pudo enviar la solicitud. Inténtalo de nuevo.", "Could not submit your request. Please try again."),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2 space-y-4">
      <div className={`flex items-center gap-2 p-3 rounded-lg ${withinHours ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
        <Clock className="w-4 h-4" />
        <span className="text-xs">
          {withinHours 
            ? L('Estamos disponibles ahora (L-V 10:00-18:00)', 'We are available now (Mon-Fri 9:00 AM - 6:00 PM EST)')
            : L('Fuera de horario. Te contactaremos el próximo día laboral.', 'Currently outside business hours. We will reach out the next business day.')}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
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
          <Label htmlFor="phone" className="text-xs">{L('Teléfono *', 'Phone Number *')}</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="h-9 text-sm"
            placeholder={isEn ? "+1 (555) 000-0000" : "+34 600 000 000"}
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
            disabled={isSubmitting || !formData.name || !formData.email || !formData.phone}
            className="flex-1 text-xs"
          >
            {isSubmitting ? L('Enviando...', 'Submitting...') : L('Solicitar llamada', 'Request Call')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgentForm;
