import { useState } from 'react';
import { Send, Mail, User, MessageSquare, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const ContactSection = () => {
  const { toast } = useToast();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create WhatsApp message with form data
    const whatsappText = encodeURIComponent(
      `Hola NOVA Marketing, me llamo ${formData.name}. ` +
      `Mi negocio es: ${formData.business}. ` +
      `Email: ${formData.email}. ` +
      `Mensaje: ${formData.message}`
    );
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/34659343822?text=${whatsappText}`, '_blank');

    toast({
      title: "¡Mensaje preparado!",
      description: "Te redirigimos a WhatsApp para enviar tu consulta.",
    });

    setIsSubmitting(false);
    setFormData({ name: '', email: '', business: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 text-glow">
            ¿Prefieres email?
          </h2>
          <p className="text-muted-foreground text-lg">
            Cuéntanos tu proyecto y te respondemos en menos de 24h
          </p>
        </div>

        {/* Contact form */}
        <form 
          onSubmit={handleSubmit} 
          className={`glass-card p-8 space-y-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          style={{ transitionDelay: '200ms' }}
        >
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
              required
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
                <Send className="w-5 h-5" />
                Enviar mensaje
              </span>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Al enviar, aceptas que te contactemos para responder tu consulta.
          </p>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
