import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { L, isEn } from '@/i18n';

interface LeadFormProps {
  serviceType?: string;
  onComplete: () => void;
  onCancel: () => void;
}

const BUDGET_RANGES_ES = [
  '< 500 €',
  '500 – 1.000 €',
  '1.000 – 2.500 €',
  '2.500 – 5.000 €',
  '> 5.000 €'
];

const BUDGET_RANGES_EN = [
  '< $500',
  '$500 – $1,000',
  '$1,000 – $2,500',
  '$2,500 – $5,000',
  '> $5,000'
];

const LeadForm = ({ serviceType, onComplete, onCancel }: LeadFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const budgetRanges = isEn ? BUDGET_RANGES_EN : BUDGET_RANGES_ES;

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
        source: isEn ? 'chat_us' : 'chat'
      }]);

      if (error) throw error;

      toast({
        title: L("¡Gracias! 🙌", "Thank You! 🙌"),
        description: L("Nuestro equipo te contactará en breve.", "Our team will contact you shortly.")
      });
      onComplete();
    } catch {
      toast({
        title: L("Error", "Error"),
        description: L("No se pudo enviar el formulario. Inténtalo de nuevo.", "Could not submit form. Please try again."),
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
        <Label htmlFor="phone" className="text-xs">{L('Teléfono / WhatsApp (opcional)', 'Phone / WhatsApp (optional)')}</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="h-9 text-sm"
          placeholder={isEn ? "+1 (555) 000-0000" : "+34 600 000 000"}
        />
      </div>

      <div>
        <Label htmlFor="business_type" className="text-xs">{L('Tipo de negocio / Sector', 'Business Type / Industry')}</Label>
        <Input
          id="business_type"
          value={formData.business_type}
          onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
          className="h-9 text-sm"
          placeholder={L('Ej: Clínica dental, Restaurante, E-commerce...', 'e.g. Dental clinic, E-commerce, SaaS, Contractor...')}
        />
      </div>

      <div>
        <Label htmlFor="goal" className="text-xs">{L('Objetivo principal', 'Primary Goal')}</Label>
        <Input
          id="goal"
          value={formData.goal}
          onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
          className="h-9 text-sm"
          placeholder={L('Ej: Conseguir más clientes, vender online...', 'e.g. Generate inbound leads, sell online, automate operations...')}
        />
      </div>

      <div>
        <Label className="text-xs">{L('Presupuesto aproximado', 'Approximate Budget')}</Label>
        <div className="grid grid-cols-2 gap-1.5 mt-1">
          {budgetRanges.map((range) => (
            <Button
              key={range}
              type="button"
              variant={formData.budget_range === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFormData({ ...formData, budget_range: range })}
              className="text-xs h-8"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs">{L('¿Cuándo lo necesitas?', 'Timeline / Urgency')}</Label>
        <div className="flex gap-2 mt-1">
          {[
            { id: 'urgent', label: L('Urgente', 'Urgent') },
            { id: 'normal', label: L('1-2 meses', '1-2 months') },
            { id: 'flexible', label: L('Flexible', 'Flexible') }
          ].map((item) => (
            <Button
              key={item.id}
              type="button"
              variant={formData.urgency === item.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFormData({ ...formData, urgency: item.id })}
              className="flex-1 text-xs h-8"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="message" className="text-xs">{L('Cuéntanos más sobre el proyecto', 'Tell us more about your project')}</Label>
        <Textarea
          id="message"
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="text-sm resize-none"
          placeholder={L('Detalles, ideas, funcionalidades necesarias...', 'Details, core requirements, integrations needed...')}
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
          disabled={isSubmitting || !formData.name || !formData.email}
          className="flex-1 text-xs"
        >
          {isSubmitting ? L('Enviando...', 'Submitting...') : L('Enviar solicitud', 'Submit Request')}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
