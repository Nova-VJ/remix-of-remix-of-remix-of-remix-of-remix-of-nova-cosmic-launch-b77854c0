import { useEffect, useState } from 'react';
import { Send, Mail, MessageCircle, FileText, Check, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import BriefingFormModal from '@/components/BriefingForm/BriefingFormModal';
import { cn } from '@/lib/utils';

const WHATSAPP_NUMBER = '34659343822';
const EMAIL = 'info@solutionsnova.es';

const PROMISES = [
  'Respuesta en 24 h',
  'Presupuesto sin compromiso',
  'Precio orientativo desde el primer momento',
];

interface ContactSectionProps {
  /** Open the briefing form straight away (links with ?openBriefing=true) */
  autoOpenBriefing?: boolean;
}

// Closing section: briefing form, quick message by WhatsApp or email
const ContactSection = ({ autoOpenBriefing = false }: ContactSectionProps) => {
  const { toast } = useToast();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email'>('whatsapp');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    message: '',
  });

  // Auto-open the briefing form when arriving from a "Pide presupuesto" link
  useEffect(() => {
    if (autoOpenBriefing) {
      setIsBriefingOpen(true);
    }
  }, [autoOpenBriefing]);

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
    await new Promise(resolve => setTimeout(resolve, 300));

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

  const reveal = (delay: number) => cn(
    'transition-all duration-700',
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    delay === 1 && 'delay-150'
  );

  return (
    <section id="contacto" ref={ref as React.RefObject<HTMLElement>} className="px-4 sm:px-6 py-20 md:py-28">
      <div
        id="formulario"
        className={cn('relative mx-auto max-w-6xl overflow-hidden rounded-3xl', reveal(0))}
        style={{ backgroundImage: 'var(--gradient-cosmic)' }}
      >
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/35 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl" aria-hidden="true" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:22px_22px]" aria-hidden="true" />

        <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:p-14">
          {/* Pitch + briefing form */}
          <div className="text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-300">Contacto</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">¿Listo para empezar?</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/75">
              Cuéntanos tu proyecto en 2 minutos y te enviamos una propuesta a medida, adaptada a lo que necesitas.
            </p>

            <ul className="mt-7 space-y-3">
              {PROMISES.map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/90">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                    <Check className="h-3.5 w-3.5 text-violet-200" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setIsBriefingOpen(true)}
              className="mt-9 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-[hsl(var(--nova-ink))] shadow-lg transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              <FileText className="h-5 w-5 text-primary" />
              Completar formulario <span className="font-normal opacity-60">· 2 min</span>
            </button>

            <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/70 sm:flex-row sm:flex-wrap sm:gap-x-6">
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 transition-colors hover:text-white">
                <Mail className="h-4 w-4" />
                {EMAIL}
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-white">
                <MessageCircle className="h-4 w-4" />
                +34 659 34 38 22
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Valladolid
              </span>
            </div>
          </div>

          {/* Quick message */}
          <form onSubmit={handleSubmit} className={cn('rounded-2xl bg-card p-6 text-foreground shadow-2xl sm:p-8', reveal(1))}>
            <h3 className="text-xl font-bold">¿Prefieres escribirnos directamente?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Elige cómo quieres que te respondamos.</p>

            <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1" role="radiogroup" aria-label="Canal de contacto">
              {([
                { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                { id: 'email', label: 'Correo', icon: Mail },
              ] as const).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={contactMethod === option.id}
                  onClick={() => setContactMethod(option.id)}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all',
                    contactMethod === option.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <option.icon className={cn('h-4 w-4', contactMethod === option.id && option.id === 'whatsapp' && 'text-[#25D366]', contactMethod === option.id && option.id === 'email' && 'text-primary')} />
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium">Nombre</label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Tu nombre" required />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="business" className="text-sm font-medium">Negocio <span className="font-normal text-muted-foreground">(opcional)</span></label>
                <Input id="business" name="business" value={formData.business} onChange={handleChange} placeholder="Tu empresa o proyecto" />
              </div>
              {contactMethod === 'email' && (
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="tu@email.com" required />
                </div>
              )}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="message" className="text-sm font-medium">¿En qué podemos ayudarte?</label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Cuéntanos tu idea o proyecto..."
                  required
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} size="lg" className="mt-6 w-full">
              {contactMethod === 'whatsapp' ? <MessageCircle className="mr-2 h-5 w-5" /> : <Send className="mr-2 h-5 w-5" />}
              {contactMethod === 'whatsapp' ? 'Continuar en WhatsApp' : 'Enviar correo'}
            </Button>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Al enviar, aceptas que te contactemos para responder tu consulta.
            </p>
          </form>
        </div>
      </div>

      <BriefingFormModal open={isBriefingOpen} onOpenChange={setIsBriefingOpen} />
    </section>
  );
};

export default ContactSection;
