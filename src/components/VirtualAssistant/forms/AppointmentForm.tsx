import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CALENDLY_LINK } from '@/data/chatFlowData';
import { ExternalLink } from 'lucide-react';
import { L, isEn } from '@/i18n';

interface AppointmentFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

const AppointmentForm = ({ onComplete, onCancel }: AppointmentFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: ''
  });

  const handleCalendly = () => {
    window.open(CALENDLY_LINK, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('appointments').insert([{
        ...formData,
        status: 'pending'
      }]);

      if (error) throw error;

      toast({
        title: L("¡Cita solicitada!", "Appointment Requested!"),
        description: L("Te contactaremos para confirmar fecha y hora.", "We will contact you to confirm the date and time.")
      });
      onComplete();
    } catch {
      toast({
        title: L("Error", "Error"),
        description: L("No se pudo solicitar la cita. Inténtalo de nuevo.", "Could not request appointment. Please try again."),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const topics = [
    { id: 'Web', label: L('Web', 'Websites') },
    { id: 'App', label: L('App', 'Mobile Apps') },
    { id: 'Redes', label: L('Redes', 'Social / Ads') },
    { id: 'Branding', label: 'Branding' },
    { id: 'Ciberseguridad', label: L('Ciberseguridad', 'Cybersecurity') },
    { id: 'Growth Benefits', label: L('Ventajas y Créditos', 'Growth Benefits') }
  ];

  return (
    <div className="p-2 space-y-4">
      <Button
        onClick={handleCalendly}
        className="w-full h-12 text-sm"
        variant="default"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        {L('Reservar en Calendly', 'Book on Calendly')}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {L('O solicita una cita', 'Or request a callback')}
          </span>
        </div>
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
          <Label htmlFor="phone" className="text-xs">{L('WhatsApp / Teléfono', 'WhatsApp / Phone')}</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="h-9 text-sm"
            placeholder={isEn ? "+1 (555) 000-0000" : "+34 600 000 000"}
          />
        </div>

        <div>
          <Label className="text-xs">{L('Tema *', 'Topic *')}</Label>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {topics.map((t) => (
              <Button
                key={t.id}
                type="button"
                variant={formData.topic === t.id ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setFormData({ ...formData, topic: t.id })}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-9 text-xs">
            {L('Cancelar', 'Cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting || !formData.topic || !formData.name || !formData.email} className="flex-1 h-9 text-xs">
            {isSubmitting ? L('Enviando...', 'Submitting...') : L('Solicitar cita', 'Request Call')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
