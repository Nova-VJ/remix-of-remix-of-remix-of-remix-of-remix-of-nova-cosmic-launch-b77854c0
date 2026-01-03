import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Link2, Copy, Check, Share2, Gift, Users, ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import referralBanner from '@/assets/referral-banner.png';

// Configuración centralizada
const referralConfig = {
  referralLink: 'https://solutionsnova.es?ref=amigo',
  whatsappNumber: '34659343822',
  contactEmail: 'info@solutionsnova.es',
  webUrl: 'https://solutionsnova.es',
  messageWhatsApp: `Ey! Te paso Nova Marketing Solutions: hacen webs que convierten, apps y branding premium. Si pides presupuesto diciendo que vas de mi parte, te dan -10% en tu primera contratación y a mí me aplican -10% extra en mi próximo servicio. Mira: https://solutionsnova.es Contacto: +34659343822`,
  emailSubject: 'Te comparto una agencia que puede ayudarte (+10% descuento)',
  emailBody: `Hola!

Te recomiendo Nova Marketing Solutions. Hacen páginas web rápidas y con SEO, apps y branding para negocios.

Si solicitas presupuesto y dices que vas de mi parte, te aplican un 10% de descuento en tu primera contratación. Y a mí me aplican un 10% adicional en mi próximo servicio.

Web: https://solutionsnova.es
Contacto: +34659343822

— ¡Gracias!`
};

const steps = [
  {
    icon: Share2,
    title: 'Comparte Nova con un amigo',
    description: 'Envía tu enlace de referido por WhatsApp, email o redes sociales'
  },
  {
    icon: Users,
    title: 'Tu amigo solicita presupuesto',
    description: 'Menciona que va de tu parte al contactar con nosotros'
  },
  {
    icon: Gift,
    title: 'Si contrata: -10% para él y -10% para ti',
    description: 'Ambos ganan cuando tu amigo se convierte en cliente'
  }
];

const faqs = [
  {
    question: '¿Cómo digo que voy de tu parte?',
    answer: 'Cuando tu amigo contacte con Nova, solo tiene que mencionar tu nombre o usar el enlace de referido que le compartiste.'
  },
  {
    question: '¿Cuándo se aplica el descuento?',
    answer: 'El descuento se aplica una vez que tu amigo contrate cualquier servicio. Recibirás tu 10% en tu próximo pedido.'
  },
  {
    question: '¿En qué servicios aplica?',
    answer: 'El descuento aplica en todos nuestros servicios: páginas web, apps, branding, marketing digital y SEM.'
  },
  {
    question: '¿Cuántos amigos puedo invitar?',
    answer: '¡Todos los que quieras! No hay límite. Cuantos más amigos invites y contraten, más descuento acumulas.'
  },
  {
    question: '¿Mi amigo también recibe descuento?',
    answer: 'Sí, tu amigo recibe un 10% de descuento en su primera contratación al usar tu referencia.'
  },
  {
    question: '¿Qué pasa si mi amigo no contrata?',
    answer: 'No pasa nada. El descuento solo se activa cuando tu amigo efectivamente contrata un servicio.'
  }
];

const InvitaAmigo = () => {
  const [copiedMessage, setCopiedMessage] = useState<'link' | 'whatsapp' | 'email' | null>(null);

  const copyToClipboard = async (text: string, type: 'link' | 'whatsapp' | 'email') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(type);
      toast.success('¡Copiado al portapapeles!');
      setTimeout(() => setCopiedMessage(null), 2000);
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(referralConfig.messageWhatsApp)}`;
    window.open(url, '_blank');
  };

  const openEmail = () => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(referralConfig.emailSubject)}&body=${encodeURIComponent(referralConfig.emailBody)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Banner Image */}
        <section className="w-full">
          <img 
            src={referralBanner} 
            alt="Programa de referidos - Invita a un amigo y gana 10% de descuento acumulable" 
            className="w-full h-auto object-contain"
          />
        </section>

        {/* Main Actions */}
        <section className="py-12 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">
              Comparte Nova y gana descuentos
            </h1>

            {/* 3 Main Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <Button 
                onClick={openWhatsApp}
                size="lg"
                className="h-auto py-6 flex flex-col items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white"
              >
                <MessageCircle className="w-8 h-8" />
                <span className="text-base font-semibold">Invitar por WhatsApp</span>
              </Button>

              <Button 
                onClick={openEmail}
                size="lg"
                variant="outline"
                className="h-auto py-6 flex flex-col items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Mail className="w-8 h-8" />
                <span className="text-base font-semibold">Invitar por correo</span>
              </Button>

              <Button 
                onClick={() => copyToClipboard(referralConfig.referralLink, 'link')}
                size="lg"
                variant="secondary"
                className="h-auto py-6 flex flex-col items-center gap-2"
              >
                {copiedMessage === 'link' ? (
                  <Check className="w-8 h-8" />
                ) : (
                  <Link2 className="w-8 h-8" />
                )}
                <span className="text-base font-semibold">
                  {copiedMessage === 'link' ? '¡Enlace copiado!' : 'Copiar mi enlace'}
                </span>
              </Button>
            </div>

            {/* How it works */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-foreground text-center mb-6">
                ¿Cómo funciona?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {steps.map((step, index) => (
                  <Card key={index} className="glass-card text-center">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Copy Message Box */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-foreground text-center mb-6">
                Mensaje listo para compartir
              </h2>
              
              <div className="space-y-4">
                {/* WhatsApp version */}
                <Card className="glass-card">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Versión WhatsApp
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(referralConfig.messageWhatsApp, 'whatsapp')}
                      >
                        {copiedMessage === 'whatsapp' ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                        Copiar
                      </Button>
                    </div>
                    <p className="text-sm text-foreground/80 bg-muted p-3 rounded-lg">
                      {referralConfig.messageWhatsApp}
                    </p>
                  </CardContent>
                </Card>

                {/* Email version */}
                <Card className="glass-card">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Versión Email
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`Asunto: ${referralConfig.emailSubject}\n\n${referralConfig.emailBody}`, 'email')}
                      >
                        {copiedMessage === 'email' ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                        Copiar
                      </Button>
                    </div>
                    <div className="text-sm text-foreground/80 bg-muted p-3 rounded-lg">
                      <p className="font-medium mb-2">Asunto: {referralConfig.emailSubject}</p>
                      <p className="whitespace-pre-line">{referralConfig.emailBody}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Conditions */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-foreground text-center mb-4">
                Condiciones
              </h2>
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      El descuento se aplica cuando tu amigo contrata un servicio.
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Tu amigo recibe -10% en su primera contratación.
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Tú recibes -10% adicional en tu próximo servicio tras validación.
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Acumulable con otras promociones activas.
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Nos reservamos el derecho de validar referencias.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-foreground text-center mb-6">
                Preguntas frecuentes
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Back button */}
            <div className="text-center">
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default InvitaAmigo;
