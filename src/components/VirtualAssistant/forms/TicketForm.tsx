import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { L, isEn } from '@/i18n';

interface TicketFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

const TicketForm = ({ onComplete, onCancel }: TicketFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'bug', label: L('Bug / Error', 'Bug / Issue') },
    { id: 'cambio', label: L('Cambio', 'Change Request') },
    { id: 'consulta', label: L('Consulta', 'General Question') },
    { id: 'soporte', label: L('Soporte', 'Technical Support') }
  ];

  const priorities = [
    { id: 'baja', label: L('Baja', 'Low') },
    { id: 'normal', label: L('Normal', 'Medium') },
    { id: 'alta', label: L('Alta', 'High') },
    { id: 'urgente', label: L('Urgente', 'Urgent') }
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    category: '',
    priority: 'normal',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('tickets').insert([{
        ...formData,
        user_id: user?.id || null,
        status: 'open'
      }]);

      if (error) throw error;

      toast({
        title: L("¡Ticket creado!", "Ticket Created!"),
        description: L("Te responderemos lo antes posible.", "Our support team will reply as soon as possible.")
      });
      onComplete();
    } catch {
      toast({
        title: L("Error", "Error"),
        description: L("No se pudo crear el ticket. Inténtalo de nuevo.", "Could not create ticket. Please try again."),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-2">
      {!user && (
        <>
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
            <Label htmlFor="phone" className="text-xs">{L('Teléfono', 'Phone Number')}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-9 text-sm"
              placeholder={isEn ? "+1 (555) 000-0000" : "+34 600 000 000"}
            />
          </div>
        </>
      )}

      <div>
        <Label className="text-xs">{L('Categoría *', 'Category *')}</Label>
        <div className="grid grid-cols-2 gap-1 mt-1">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              type="button"
              variant={formData.category === cat.id ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setFormData({ ...formData, category: cat.id })}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-xs">{L('Prioridad', 'Priority')}</Label>
        <div className="grid grid-cols-4 gap-1 mt-1">
          {priorities.map((pri) => (
            <Button
              key={pri.id}
              type="button"
              variant={formData.priority === pri.id ? 'default' : 'outline'}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setFormData({ ...formData, priority: pri.id })}
            >
              {pri.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="subject" className="text-xs">{L('Asunto *', 'Subject *')}</Label>
        <Input
          id="subject"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="h-9 text-sm"
          placeholder={L('Describe brevemente el problema', 'Brief summary of the issue')}
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-xs">{L('Descripción *', 'Description *')}</Label>
        <Textarea
          id="message"
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="text-sm min-h-[80px]"
          placeholder={L('Explica el problema con detalle...', 'Explain the issue in detail...')}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-9 text-xs">
          {L('Cancelar', 'Cancel')}
        </Button>
        <Button type="submit" disabled={isSubmitting || !formData.category} className="flex-1 h-9 text-xs">
          {isSubmitting ? L('Creando...', 'Creating...') : L('Crear ticket', 'Submit Ticket')}
        </Button>
      </div>
    </form>
  );
};

export default TicketForm;
