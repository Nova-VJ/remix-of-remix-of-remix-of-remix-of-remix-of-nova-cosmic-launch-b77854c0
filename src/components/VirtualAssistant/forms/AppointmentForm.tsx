import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CALENDLY_LINK } from '@/data/chatFlowData';
import { ExternalLink } from 'lucide-react';

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
        title: "¡Cita solicitada!",
        description: "Te contactaremos para confirmar fecha y hora."
      });
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo solicitar la cita. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2 space-y-4">
      <Button
        onClick={handleCalendly}
        className="w-full h-12 text-sm"
        variant="default"
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        Reservar en Calendly
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            O solicita una cita
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="name" className="text-xs">Nombre *</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-9 text-sm"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-xs">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="h-9 text-sm"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-xs">WhatsApp</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="h-9 text-sm"
            placeholder="+34 600 000 000"
          />
        </div>

        <div>
          <Label className="text-xs">Tema *</Label>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {['Web', 'App', 'Redes', 'Branding', 'Ciberseguridad'].map((topic) => (
              <Button
                key={topic}
                type="button"
                variant={formData.topic === topic ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => setFormData({ ...formData, topic })}
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-9">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || !formData.topic} className="flex-1 h-9">
            {isSubmitting ? 'Enviando...' : 'Solicitar cita'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
