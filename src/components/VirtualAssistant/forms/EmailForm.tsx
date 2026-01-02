import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  { id: 'ventas', label: 'Ventas' },
  { id: 'soporte', label: 'Soporte' },
  { id: 'presupuesto', label: 'Presupuesto' },
  { id: 'ciberseguridad', label: 'Ciberseguridad' },
  { id: 'otro', label: 'Otro' }
];

const EmailForm = ({ onComplete, onCancel }: EmailFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('email_messages').insert([formData]);

      if (error) throw error;

      toast({
        title: "¡Mensaje enviado!",
        description: "Te responderemos lo antes posible."
      });
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
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
        <Label className="text-xs">Asunto *</Label>
        <div className="grid grid-cols-3 gap-1 mt-1">
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
        <Label htmlFor="subject" className="text-xs">Título del mensaje *</Label>
        <Input
          id="subject"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="h-9 text-sm"
          placeholder="Asunto de tu mensaje"
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-xs">Mensaje *</Label>
        <Textarea
          id="message"
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="text-sm min-h-[80px]"
          placeholder="Cuéntanos en qué podemos ayudarte..."
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-9">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || !formData.category} className="flex-1 h-9">
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
    </form>
  );
};

export default EmailForm;
