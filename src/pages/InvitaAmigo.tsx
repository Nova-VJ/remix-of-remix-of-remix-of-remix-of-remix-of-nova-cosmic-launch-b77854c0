import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Mail, Link2, Copy, Check, Share2, Gift, Users, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import referralHeroBg from '@/assets/invita-hero-bg.png';
import invitaBottomBg from '@/assets/invita-bottom-bg.png';

// Configuración centralizada
const referralConfig = {
  whatsappNumber: '34659343822',
  contactEmail: 'info@solutionsnova.es',
  webUrl: 'https://solutionsnova.es',
};

const steps = [
  {
    icon: Share2,
    title: 'Comparte Nova',
    description: 'Envía tu enlace único'
  },
  {
    icon: Users,
    title: 'Tu amigo contacta',
    description: 'Menciona tu código'
  },
  {
    icon: Gift,
    title: '¡Ambos ganan!',
    description: '-10% para cada uno'
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copiedMessage, setCopiedMessage] = useState<'link' | 'whatsapp' | 'email' | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (user) {
      fetchReferralCode();
    }
  }, [user]);

  const fetchReferralCode = async () => {
    if (!user) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('user_id', user.id)
      .single();

    if (profile?.referral_code) {
      setReferralCode(profile.referral_code);
      setReferralLink(`${referralConfig.webUrl}?ref=${profile.referral_code}`);
    }
  };

  const messageWhatsApp = referralCode 
    ? `Ey! Te paso Nova Marketing Solutions: hacen webs que convierten, apps y branding premium. Si pides presupuesto con mi código ${referralCode}, te dan -10% en tu primera contratación y a mí me aplican -10% extra. Mira: ${referralLink}`
    : '';

  const emailSubject = 'Te comparto una agencia que puede ayudarte (+10% descuento)';
  const emailBody = referralCode 
    ? `Hola!

Te recomiendo Nova Marketing Solutions. Hacen páginas web rápidas y con SEO, apps y branding para negocios.

Si solicitas presupuesto con mi código ${referralCode}, te aplican un 10% de descuento en tu primera contratación. Y a mí me aplican un 10% adicional en mi próximo servicio.

Web: ${referralLink}
Contacto: +34659343822

— ¡Gracias!`
    : '';

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
    if (!user) {
      toast.error('Inicia sesión para compartir tu código');
      return;
    }
    const url = `https://wa.me/?text=${encodeURIComponent(messageWhatsApp)}`;
    window.open(url, '_blank');
  };

  const openEmail = () => {
    if (!user) {
      toast.error('Inicia sesión para compartir tu código');
      return;
    }
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;
  };

  const handleCopyLink = () => {
    if (!user) {
      toast.error('Inicia sesión para obtener tu enlace');
      return;
    }
    copyToClipboard(referralLink, 'link');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Background Image - Full width */}
        <section className="w-full">
          <img 
            src={referralHeroBg} 
            alt="Programa de referidos - Invita a un amigo y gana 10% de descuento acumulable" 
            className="w-full h-auto object-contain"
          />
        </section>

        {/* Main Content */}
        <section className="py-8 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            
            {/* Login prompt if not authenticated */}
            {!user ? (
              <Card className="glass-card mb-8">
                <CardContent className="pt-6 text-center">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Crea tu cuenta para empezar
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Necesitas una cuenta para obtener tu código único de referidos y empezar a ganar descuentos.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => navigate('/auth')} size="lg">
                      Crear cuenta
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/auth')} size="lg">
                      Iniciar sesión
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* User's referral code */}
                <Card className="glass-card mb-8 border-primary/30">
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Tu código de referido:</p>
                    <p className="text-2xl font-bold text-primary mb-2">{referralCode || 'Cargando...'}</p>
                    <p className="text-xs text-muted-foreground">Compártelo con tus amigos</p>
                  </CardContent>
                </Card>

                {/* 3 Main Buttons - Minimalist for mobile */}
                <div className="grid grid-cols-1 gap-3 mb-8">
                  <Button 
                    onClick={openWhatsApp}
                    size="lg"
                    className="h-12 bg-[#25D366] hover:bg-[#20BD5A] text-white"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Invitar por WhatsApp
                  </Button>

                  <Button 
                    onClick={openEmail}
                    size="lg"
                    variant="outline"
                    className="h-12 border-primary/50 text-foreground hover:bg-primary/10"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Invitar por correo
                  </Button>

                  <Button 
                    onClick={handleCopyLink}
                    size="lg"
                    variant="secondary"
                    className="h-12"
                  >
                    {copiedMessage === 'link' ? (
                      <Check className="w-5 h-5 mr-2" />
                    ) : (
                      <Link2 className="w-5 h-5 mr-2" />
                    )}
                    {copiedMessage === 'link' ? '¡Enlace copiado!' : 'Copiar mi enlace'}
                  </Button>
                </div>
              </>
            )}

            {/* How it works - Compact */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-foreground text-center mb-4">
                ¿Cómo funciona?
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {steps.map((step, index) => (
                  <div key={index} className="text-center p-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-xs mb-1">{step.title}</h3>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy Message Box - Only for logged in users */}
            {user && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-foreground text-center mb-4">
                  Mensaje listo para compartir
                </h2>
                
                <Card className="glass-card">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => copyToClipboard(messageWhatsApp, 'whatsapp')}
                      >
                        {copiedMessage === 'whatsapp' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                    <p className="text-xs text-foreground/80 bg-muted p-2 rounded-lg">
                      {messageWhatsApp}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Conditions - Compact */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-foreground text-center mb-4">
                Condiciones
              </h2>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                  El descuento se aplica cuando tu amigo contrata.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                  Tu amigo recibe -10% en su primera contratación.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                  Tú recibes -10% adicional tras validación.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                  Acumulable con otras promociones.
                </li>
              </ul>
            </div>

            {/* FAQ - Compact */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground text-center mb-4">
                Preguntas frecuentes
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left text-sm py-3">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-xs">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Back button */}
            <div className="text-center mb-6">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom promotional image - Full width background */}
        <section className="w-full">
          <img 
            src={invitaBottomBg} 
            alt="¡Digitaliza tu comercio ya!" 
            className="w-full h-auto object-cover"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default InvitaAmigo;