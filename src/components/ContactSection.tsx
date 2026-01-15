import { useState } from 'react';
import { Send, Mail, User, MessageSquare, Briefcase, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const WHATSAPP_NUMBER = '34604948362';
const EMAIL = 'info@solutionsnova.es';

const ContactSection = () => {
  const { toast } = useToast();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    message: '',
  });

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola NOVA Marketing, me llamo ${formData.name || '[tu nombre]'}. ` +
      `Mi negocio es: ${formData.business || '[tu negocio]'}. ` +
      `${formData.message || 'Quiero información sobre vuestros servicios.'}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa nombre, email y mensaje.",
        variant: "destructive"
      });
      return;
    }
    
    const subject = encodeURIComponent(`Contacto desde web - ${formData.business || 'Consulta'}`);
    const body = encodeURIComponent(
      `Nombre: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Negocio: ${formData.business}\n\n` +
      `Mensaje:\n${formData.message}`
    );
    window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`, '_blank');
    
    toast({
      title: "¡Correo preparado!",
      description: "Se abrirá tu cliente de correo para enviar el mensaje.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (contactMethod === 'whatsapp') {
      handleWhatsApp();
    } else {
      handleEmail();
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contacto" ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 text-glow">
            Contacto
          </h2>
          <p className="text-muted-foreground text-lg">
            Elige cómo prefieres contactarnos
          </p>
        </div>

        {/* Contact options */}
        {!showForm ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: '200ms' }}>
            <Button
              onClick={() => {
                setContactMethod('whatsapp');
                setShowForm(true);
              }}
              className="h-auto py-8 flex flex-col gap-3"
              size="lg"
            >
              <MessageCircle className="w-8 h-8" />
              <span className="text-lg font-semibold">WhatsApp</span>
              <span className="text-sm opacity-80">Respuesta inmediata</span>
            </Button>
            
            <Button
              onClick={() => {
                setContactMethod('email');
                setShowForm(true);
              }}
              variant="outline"
              className="h-auto py-8 flex flex-col gap-3"
              size="lg"
            >
              <Mail className="w-8 h-8" />
              <span className="text-lg font-semibold">Correo electrónico</span>
              <span className="text-sm opacity-80">Te respondemos en 24h</span>
            </Button>
          </div>
        ) : (
          <form 
            onSubmit={handleSubmit} 
            className={`glass-card p-8 space-y-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                {contactMethod === 'whatsapp' ? (
                  <><MessageCircle className="w-5 h-5 text-primary" /> Contactar por WhatsApp</>
                ) : (
                  <><Mail className="w-5 h-5 text-primary" /> Enviar correo</>
                )}
              </h3>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                Cambiar
              </Button>
            </div>

            {/* Name field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Nombre
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
                className="bg-background/50 border-border/50 focus:border-primary"
              />
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required={contactMethod === 'email'}
                className="bg-background/50 border-border/50 focus:border-primary"
              />
            </div>

            {/* Business field */}
            <div className="space-y-2">
              <label htmlFor="business" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Nombre del negocio
              </label>
              <Input
                id="business"
                name="business"
                value={formData.business}
                onChange={handleChange}
                placeholder="Tu empresa o proyecto"
                className="bg-background/50 border-border/50 focus:border-primary"
              />
            </div>

            {/* Message field */}
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                ¿En qué podemos ayudarte?
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Cuéntanos tu idea o proyecto..."
                required
                rows={4}
                className="bg-background/50 border-border/50 focus:border-primary resize-none"
              />
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cta-button text-lg py-6"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {contactMethod === 'whatsapp' ? <MessageCircle className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                  {contactMethod === 'whatsapp' ? 'Abrir WhatsApp' : 'Enviar correo'}
                </span>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Al enviar, aceptas que te contactemos para responder tu consulta.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
