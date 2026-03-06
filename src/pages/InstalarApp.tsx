import SEOHead from '@/components/SEOHead';
import { useState, useEffect } from 'react';
import { Smartphone, Monitor, Apple, Download, Bell, CheckCircle, ArrowRight, Chrome, Share, Plus, X, MessageCircleHeart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import saraAvatar from '@/assets/sara-avatar.png';

// ─── Step definitions per platform ───────────────────────────────────────────

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  // Where Sara's card should appear: 'center' | 'top-right' | 'mid-right' | 'bottom-center'
  position: 'center' | 'top-right' | 'mid-right' | 'bottom-center';
  // Optional pointer direction shown as an animated arrow
  pointer?: 'up' | 'left' | 'none';
}

const STEPS: Record<'android' | 'ios' | 'pc', TutorialStep[]> = {
  android: [
    {
      title: '¡Hola! Soy Sara 👋',
      description: 'Voy a guiarte para instalar la app de Nova en tu dispositivo Android. Es muy sencillo, solo sigue mis indicaciones.',
      icon: <Smartphone className="w-5 h-5 text-primary" />,
      position: 'center',
      pointer: 'none',
    },
    {
      title: 'Abre Google Chrome',
      description: 'Asegúrate de estar usando Google Chrome. Si usas otro navegador, ábrelo en Chrome para continuar.',
      icon: <Chrome className="w-5 h-5 text-primary" />,
      position: 'center',
      pointer: 'none',
    },
    {
      title: 'Toca los tres puntos ⋮',
      description: 'Mira la esquina superior derecha de tu pantalla. Ahí verás el menú con tres puntos verticales. ¡Tócalos!',
      icon: <Share className="w-5 h-5 text-primary" />,
      position: 'top-right',
      pointer: 'up',
    },
    {
      title: 'Selecciona "Instalar app"',
      description: 'En el menú que aparece, busca "Añadir a pantalla de inicio" o "Instalar app" y tócalo.',
      icon: <Plus className="w-5 h-5 text-primary" />,
      position: 'mid-right',
      pointer: 'left',
    },
    {
      title: '¡Instalada! 🎉',
      description: 'Nova ya aparece como app en tu pantalla de inicio. Tócala como cualquier otra app. ¡Ya puedes cerrar este tutorial!',
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
      position: 'bottom-center',
      pointer: 'none',
    },
  ],
  ios: [
    {
      title: '¡Hola! Soy Sara 👋',
      description: 'Voy a guiarte para instalar la app de Nova en tu iPhone o iPad. Necesitarás usar Safari.',
      icon: <Apple className="w-5 h-5 text-primary" />,
      position: 'center',
      pointer: 'none',
    },
    {
      title: 'Abre en Safari',
      description: 'En iOS, solo Safari permite instalar apps PWA. Si estás en Chrome u otro navegador, cópiala en Safari.',
      icon: <Apple className="w-5 h-5 text-primary" />,
      position: 'center',
      pointer: 'none',
    },
    {
      title: 'Toca el ícono Compartir',
      description: 'Mira la barra inferior de Safari. Verás un cuadrado con una flecha hacia arriba (□↑). ¡Tócalo!',
      icon: <Share className="w-5 h-5 text-primary" />,
      position: 'bottom-center',
      pointer: 'none',
    },
    {
      title: '"Añadir a pantalla de inicio"',
      description: 'En el menú que se despliega, desliza hacia abajo y toca "Añadir a pantalla de inicio".',
      icon: <Plus className="w-5 h-5 text-primary" />,
      position: 'mid-right',
      pointer: 'left',
    },
    {
      title: '¡Instalada! 🎉',
      description: 'Nova ya aparece en tu pantalla de inicio como cualquier app. ¡Perfecto, ya puedes cerrar este tutorial!',
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
      position: 'bottom-center',
      pointer: 'none',
    },
  ],
  pc: [
    {
      title: '¡Hola! Soy Sara 👋',
      description: 'Voy a guiarte para instalar la app de Nova en tu ordenador. Funciona en Chrome y Edge.',
      icon: <Monitor className="w-5 h-5 text-primary" />,
      position: 'center',
      pointer: 'none',
    },
    {
      title: 'Usa Chrome o Edge',
      description: 'Asegúrate de usar Google Chrome o Microsoft Edge. En Firefox y Safari para Mac no está disponible esta función.',
      icon: <Chrome className="w-5 h-5 text-primary" />,
      position: 'center',
      pointer: 'none',
    },
    {
      title: 'Busca el ícono ⊕ en la barra',
      description: 'Mira la esquina superior derecha de la barra de direcciones. Verás un pequeño ícono de instalación (⊕ o una pantalla con flecha). ¡Haz clic en él!',
      icon: <Download className="w-5 h-5 text-primary" />,
      position: 'top-right',
      pointer: 'up',
    },
    {
      title: 'Confirma la instalación',
      description: 'Aparecerá un diálogo preguntando si quieres instalar la app. Haz clic en "Instalar" para confirmar.',
      icon: <Plus className="w-5 h-5 text-primary" />,
      position: 'mid-right',
      pointer: 'left',
    },
    {
      title: '¡Instalada! 🎉',
      description: 'Nova se ha añadido como app de escritorio con su propio icono. La encontrarás en tu menú de aplicaciones. ¡Listo!',
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
      position: 'bottom-center',
      pointer: 'none',
    },
  ],
};

// ─── Position classes map ─────────────────────────────────────────────────────

const POSITION_CLASSES: Record<TutorialStep['position'], string> = {
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'top-right': 'top-20 right-4',
  'mid-right': 'top-1/2 right-4 -translate-y-1/2',
  'bottom-center': 'bottom-24 left-1/2 -translate-x-1/2',
};

// ─── Sara Install Tutorial Overlay ───────────────────────────────────────────

const SaraInstallTutorial = ({
  platform,
  onClose,
}: {
  platform: 'android' | 'ios' | 'pc';
  onClose: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const steps = STEPS[platform];
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleClose();
    } else {
      setCurrentStep(p => p + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStep(p => p - 1);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const posClass = POSITION_CLASSES[step.position];

  return (
    <div
      className={`fixed inset-0 z-[200] transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/75 backdrop-blur-sm" onClick={handleClose} />

      {/* Pointer arrow for top-right */}
      {step.pointer === 'up' && step.position === 'top-right' && (
        <div className="fixed top-14 right-6 z-[201] animate-bounce">
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-[16px] border-l-transparent border-r-transparent border-b-primary" />
        </div>
      )}

      {/* Pointer arrow for mid-right */}
      {step.pointer === 'left' && step.position === 'mid-right' && (
        <div className="fixed top-1/2 right-[calc(var(--card-width,320px)+16px)] z-[201] animate-pulse"
          style={{ transform: 'translateY(-50%) translateX(100%)' }}>
          <div className="w-0 h-0 border-t-8 border-b-8 border-l-[16px] border-t-transparent border-b-transparent border-l-primary" />
        </div>
      )}

      {/* Sara Card — dynamically positioned */}
      <div
        className={`fixed z-[202] w-[90vw] max-w-xs transition-all duration-300 ${posClass} ${
          visible ? 'scale-100' : 'scale-95'
        }`}
      >
        {/* Arrow indicator for top-right: show below the card pointing up-right */}
        {step.pointer === 'up' && step.position === 'top-right' && (
          <div className="flex justify-end pr-2 mb-1">
            <span className="text-xs text-primary font-semibold animate-pulse">↑ Aquí</span>
          </div>
        )}
        {step.pointer === 'left' && step.position === 'mid-right' && (
          <div className="flex justify-end pr-2 mb-1">
            <span className="text-xs text-primary font-semibold animate-pulse">→ Aquí</span>
          </div>
        )}

        <div className="rounded-2xl border border-primary/30 bg-card shadow-2xl p-5">
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Sara header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="relative flex-shrink-0">
              <img
                src={saraAvatar}
                alt="Sara"
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/30 shadow"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <MessageCircleHeart className="w-2.5 h-2.5 text-primary-foreground" />
              </div>
            </div>
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1.5 mb-0.5">
                {step.icon}
                <h3 className="font-bold text-sm text-foreground">{step.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mb-4">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep ? 'w-5 bg-primary' : i < currentStep ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" size="sm" onClick={handlePrev} disabled={isFirst} className="gap-1 text-xs h-8">
              <ArrowLeft className="w-3 h-3" />
              Anterior
            </Button>
            <span className="text-xs text-muted-foreground">{currentStep + 1}/{steps.length}</span>
            <Button size="sm" onClick={handleNext} className="gap-1 text-xs h-8">
              {isLast ? 'Cerrar' : 'Siguiente'}
              {!isLast && <ArrowRight className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const InstalarApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeOS, setActiveOS] = useState<'android' | 'ios' | 'pc'>('android');
  const [saraPlatform, setSaraPlatform] = useState<'android' | 'ios' | 'pc' | null>(null);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) setActiveOS('ios');
    else if (/android/i.test(ua)) setActiveOS('android');
    else setActiveOS('pc');

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const handlePlatformClick = async (platform: 'android' | 'ios' | 'pc') => {
    if ((platform === 'android' || platform === 'pc') && deferredPrompt) {
      await handleInstallClick();
      return;
    }
    setSaraPlatform(platform);
  };

  const androidSteps = [
    { icon: <Chrome className="w-5 h-5" />, title: 'Abre en Chrome', desc: 'Asegúrate de usar Google Chrome en tu Android.' },
    { icon: <Share className="w-5 h-5" />, title: 'Menú de opciones', desc: 'Toca los tres puntos (⋮) en la esquina superior derecha.' },
    { icon: <Plus className="w-5 h-5" />, title: 'Añadir a inicio', desc: 'Selecciona "Añadir a pantalla de inicio" o "Instalar app".' },
    { icon: <CheckCircle className="w-5 h-5" />, title: '¡Listo!', desc: 'Nova aparecerá como una app nativa en tu pantalla de inicio.' },
  ];

  const iosSteps = [
    { icon: <Apple className="w-5 h-5" />, title: 'Abre en Safari', desc: 'Usa Safari para instalar apps PWA en iPhone/iPad.' },
    { icon: <Share className="w-5 h-5" />, title: 'Botón Compartir', desc: 'Toca el ícono de compartir (cuadrado con flecha) en la barra inferior.' },
    { icon: <Plus className="w-5 h-5" />, title: 'Añadir a inicio', desc: 'Desliza hacia abajo y selecciona "Añadir a pantalla de inicio".' },
    { icon: <CheckCircle className="w-5 h-5" />, title: '¡Listo!', desc: 'La app de Nova aparece en tu pantalla de inicio como cualquier app.' },
  ];

  const pcSteps = [
    { icon: <Chrome className="w-5 h-5" />, title: 'Abre en Chrome / Edge', desc: 'Accede a la web desde Google Chrome o Microsoft Edge.' },
    { icon: <Monitor className="w-5 h-5" />, title: 'Ícono de instalación', desc: 'Busca el ícono de instalar (⊕) en la barra de direcciones.' },
    { icon: <Download className="w-5 h-5" />, title: 'Instalar aplicación', desc: 'Haz clic en "Instalar" en el diálogo que aparece.' },
    { icon: <CheckCircle className="w-5 h-5" />, title: '¡Listo!', desc: 'Nova se añade como app de escritorio con acceso directo.' },
  ];

  const stepsMap = { android: androidSteps, ios: iosSteps, pc: pcSteps };
  const currentSteps = stepsMap[activeOS];

  const platformButtons = [
    {
      id: 'android' as const,
      label: 'Android',
      sublabel: 'Google Chrome',
      icon: <Smartphone className="w-6 h-6" />,
      badge: deferredPrompt && activeOS === 'android' ? 'Instalar directo' : 'Tutorial con Sara',
    },
    {
      id: 'ios' as const,
      label: 'iPhone / iPad',
      sublabel: 'Safari',
      icon: <Apple className="w-6 h-6" />,
      badge: 'Tutorial con Sara',
    },
    {
      id: 'pc' as const,
      label: 'PC / Mac',
      sublabel: 'Chrome o Edge',
      icon: <Monitor className="w-6 h-6" />,
      badge: deferredPrompt && activeOS === 'pc' ? 'Instalar directo' : 'Tutorial con Sara',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Sara interactive tutorial overlay */}
      {saraPlatform && (
        <SaraInstallTutorial platform={saraPlatform} onClose={() => setSaraPlatform(null)} />
      )}

      <main className="pt-20 pb-16">
        {/* Hero */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">App · PWA</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Instala la app de{' '}
              <span className="text-primary">Nova</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Accede a tu portal de cliente, recibe notificaciones y gestiona tu proyecto directamente desde tu móvil o PC. Sin App Store, sin pasos extra.
            </p>

            {isInstalled && (
              <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 border border-green-500/30 rounded-full px-6 py-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">¡App ya instalada!</span>
              </div>
            )}
          </div>
        </section>

        {/* Platform Download Buttons */}
        <section className="px-4 pb-10">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-sm text-muted-foreground mb-5">
              Elige tu dispositivo y Sara te guiará paso a paso:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {platformButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => handlePlatformClick(btn.id)}
                  className={`group relative flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all cursor-pointer text-left
                    ${saraPlatform === btn.id
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm'
                    }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
                    ${saraPlatform === btn.id ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
                    {btn.icon}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">{btn.label}</p>
                    <p className="text-xs text-muted-foreground">{btn.sublabel}</p>
                  </div>
                  <Badge variant={saraPlatform === btn.id ? 'default' : 'secondary'} className="text-xs">
                    {btn.badge}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {[
                { icon: <Bell className="w-6 h-6 text-primary" />, title: 'Notificaciones', desc: 'Recibe alertas de tu proyecto, mensajes y actualizaciones en tiempo real.' },
                { icon: <Smartphone className="w-6 h-6 text-primary" />, title: 'Acceso rápido', desc: 'Un toque desde tu pantalla de inicio. Sin abrir el navegador.' },
                { icon: <CheckCircle className="w-6 h-6 text-primary" />, title: 'Sin App Store', desc: 'Instala directamente desde el navegador. Gratis y sin pasos extra.' },
              ].map((b, i) => (
                <Card key={i} className="text-center p-6 border-primary/20 bg-primary/5 hover:border-primary/40 transition-colors">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      {b.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </Card>
              ))}
            </div>

            {/* OS Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Guía de instalación paso a paso</CardTitle>
                <div className="flex justify-center gap-2 mt-2 flex-wrap">
                  {([
                    { id: 'android', label: 'Android', icon: <Smartphone className="w-4 h-4" /> },
                    { id: 'ios', label: 'iPhone / iPad', icon: <Apple className="w-4 h-4" /> },
                    { id: 'pc', label: 'PC / Mac', icon: <Monitor className="w-4 h-4" /> },
                  ] as const).map(os => (
                    <Button
                      key={os.id}
                      variant={activeOS === os.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setActiveOS(os.id)}
                      className="gap-1.5"
                    >
                      {os.icon}
                      {os.label}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {currentSteps.map((step, i) => (
                    <div key={i} className="relative">
                      <div className="flex flex-col items-center text-center p-4 rounded-xl border border-border bg-muted/20 h-full">
                        <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center mb-3 flex-shrink-0">
                          {step.icon}
                        </div>
                        <div className="text-xs font-bold text-primary mb-0.5">Paso {i + 1}</div>
                        <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                      {i < currentSteps.length - 1 && (
                        <ArrowRight className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                      )}
                    </div>
                  ))}
                </div>

                {activeOS === 'ios' && (
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-600 dark:text-yellow-400">
                    <strong>Nota:</strong> En iPhone/iPad, la instalación solo funciona desde Safari. Chrome y otros navegadores no permiten instalar PWAs en iOS.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications info */}
            <Card className="mt-6 bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">¿Cómo funcionan las notificaciones?</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Una vez instalada la app e iniciada sesión, recibirás notificaciones automáticas cuando:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Tu proyecto avance a una nueva etapa</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> El equipo de Nova te envíe un mensaje</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Tu presupuesto sea aprobado o actualizado</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Haya actualizaciones importantes en tu cuenta</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default InstalarApp;
