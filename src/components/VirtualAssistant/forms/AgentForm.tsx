import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock, Phone } from 'lucide-react';

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

  // Check if within business hours (L-V 10:00-18:00 Spain time)
  const isWithinBusinessHours = () => {
    const now = new Date();
    const spainTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
    const day = spainTime.getDay();
    const hour = spainTime.getHours();
    return day >= 1 && day <= 5 && hour >= 10 && hour < 18;
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
        subject: 'Solicitud de llamada',
        message: withinHours 
          ? 'Cliente solicita hablar con un agente (dentro de horario)'
          : 'Cliente solicita que le llamen (fuera de horario)',
        status: 'open'
      }]);

      if (error) throw error;

      toast({
        title: withinHours ? "¡Recibido!" : "¡Solicitud registrada!",
        description: withinHours 
          ? "Un agente te contactará en breve."
          : "Te llamaremos en el próximo horario laboral (L-V 10:00-18:00)."
      });
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud. Inténtalo de nuevo.",
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
            ? 'Estamos disponibles ahora (L-V 10:00-18:00)'
            : 'Fuera de horario. Te contactaremos el próximo día laboral.'}
        </span>
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
          <Label htmlFor="phone" className="text-xs">Teléfono *</Label>
          <Input
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="h-9 text-sm"
            placeholder="+34 600 000 000"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-9">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1 h-9">
            <Phone className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Enviando...' : withinHours ? 'Solicitar llamada' : 'Te llamamos'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AgentForm;
