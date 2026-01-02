import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LeadFormProps {
  serviceType?: string;
  onComplete: () => void;
  onCancel: () => void;
}

const BUDGET_RANGES = [
  '< 500 €',
  '500 – 1.000 €',
  '1.000 – 2.500 €',
  '2.500 – 5.000 €',
  '> 5.000 €'
];

const LeadForm = ({ serviceType, onComplete, onCancel }: LeadFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: serviceType || '',
    business_type: '',
    goal: '',
    budget_range: '',
    urgency: 'normal',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('leads').insert([{
        ...formData,
        source: 'chat'
      }]);

      if (error) throw error;

      toast({
        title: "¡Gracias! 🙌",
        description: "Nuestro equipo te contactará en breve."
      });
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el formulario. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-2">
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
        <Label htmlFor="phone" className="text-xs">WhatsApp (opcional)</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="h-9 text-sm"
          placeholder="+34 600 000 000"
        />
      </div>

      <div>
        <Label className="text-xs">Servicio de interés *</Label>
        <div className="grid grid-cols-2 gap-1 mt-1">
          {['Web', 'App', 'Redes', 'Branding', 'Ciberseguridad'].map((service) => (
            <Button
              key={service}
              type="button"
              variant={formData.service_type === service ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setFormData({ ...formData, service_type: service })}
            >
              {service}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="business" className="text-xs">Tipo de negocio</Label>
        <Input
          id="business"
          value={formData.business_type}
          onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
          className="h-9 text-sm"
          placeholder="Ej: Restaurante, Tienda online..."
        />
      </div>

      <div>
        <Label htmlFor="goal" className="text-xs">Objetivo principal</Label>
        <Input
          id="goal"
          value={formData.goal}
          onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
          className="h-9 text-sm"
          placeholder="Ej: Vender más, captar leads..."
        />
      </div>

      <div>
        <Label className="text-xs">Presupuesto estimado</Label>
        <div className="grid grid-cols-2 gap-1 mt-1">
          {BUDGET_RANGES.map((range) => (
            <Button
              key={range}
              type="button"
              variant={formData.budget_range === range ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setFormData({ ...formData, budget_range: range })}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs">Urgencia</Label>
        <div className="flex gap-2 mt-1">
          {['normal', 'urgente'].map((urg) => (
            <Button
              key={urg}
              type="button"
              variant={formData.urgency === urg ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs flex-1 capitalize"
              onClick={() => setFormData({ ...formData, urgency: urg })}
            >
              {urg}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="message" className="text-xs">Mensaje (opcional)</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="text-sm min-h-[60px]"
          placeholder="Cuéntanos más sobre tu proyecto..."
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-9">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1 h-9">
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
