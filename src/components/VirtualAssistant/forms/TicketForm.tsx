import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface TicketFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  { id: 'bug', label: 'Bug / Error' },
  { id: 'cambio', label: 'Cambio' },
  { id: 'consulta', label: 'Consulta' },
  { id: 'soporte', label: 'Soporte' }
];

const PRIORITIES = [
  { id: 'baja', label: 'Baja' },
  { id: 'normal', label: 'Normal' },
  { id: 'alta', label: 'Alta' },
  { id: 'urgente', label: 'Urgente' }
];

const TicketForm = ({ onComplete, onCancel }: TicketFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        title: "¡Ticket creado!",
        description: "Te responderemos lo antes posible."
      });
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el ticket. Inténtalo de nuevo.",
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
            <Label htmlFor="phone" className="text-xs">Teléfono</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-9 text-sm"
              placeholder="+34 600 000 000"
            />
          </div>
        </>
      )}

      <div>
        <Label className="text-xs">Categoría *</Label>
        <div className="grid grid-cols-2 gap-1 mt-1">
          {CATEGORIES.map((cat) => (
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
        <Label className="text-xs">Prioridad</Label>
        <div className="grid grid-cols-4 gap-1 mt-1">
          {PRIORITIES.map((pri) => (
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
        <Label htmlFor="subject" className="text-xs">Asunto *</Label>
        <Input
          id="subject"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="h-9 text-sm"
          placeholder="Describe brevemente el problema"
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-xs">Descripción *</Label>
        <Textarea
          id="message"
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="text-sm min-h-[80px]"
          placeholder="Explica el problema con detalle..."
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-9">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || !formData.category} className="flex-1 h-9">
          {isSubmitting ? 'Creando...' : 'Crear ticket'}
        </Button>
      </div>
    </form>
  );
};

export default TicketForm;
