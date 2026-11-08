import SEOHead from '@/components/SEOHead';
import { SEO_PAGES } from "@/config/seo";
import { useState, useEffect } from 'react';
import { Smartphone, Monitor, Apple, Download, Bell, CheckCircle, ArrowRight, Chrome, Share, Plus, X, MessageCircleHeart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import saraAvatar from '@/assets/sara-avatar.webp';
import { L, isEn } from '@/i18n';

// ─── Step definitions per platform ───────────────────────────────────────────

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  position: 'center' | 'top-right' | 'mid-right' | 'bottom-center';
  pointer?: 'up' | 'left' | 'none';
}

const getTutorialSteps = (): Record<'android' | 'ios' | 'pc', TutorialStep[]> => ({
  android: [
    {
      title: L('¡Hola! Soy Sara 👋', 'Hi! I’m Sara 👋'),
      description: L(
        'Voy a guiarte para instalar la app de Nova en tu dispositivo Android. Es muy sencillo, solo sigue mis indicaciones.',
        'I’ll guide you through installing the NOVA app on your Android device. It’s super simple, just follow along.'
      ),
      icon: <Smartphone className="w-5 h-5 text-primary" />,
      position: 'center',
      pointer: 'none',
    },
    {
      title: L('Abre Google Chrome', 'Open Google Chrome'),
      description: L(
        'Asegúrate de estar usando Google Chrome. Si usas otro navegador, ábrelo en Chrome para continuar.',
        'Make sure you are using Google Chrome. If you are in another browser, switch to Chrome to continue.'
      ),
      icon: <Chrome className="w-5 h-5 text-primary" />,
      position: 'center',
      pointer: 'none',
    },
    {
      title: L('Toca los tres puntos ⋮', 'Tap the three dots ⋮'),
      description: L(
        'Mira la esquina superior derecha de tu pantalla. Ahí verás el menú con tres puntos verticales. ¡Tócalos!',
        'Look at the top-right corner of your screen. Tap the three vertical dots menu.'
      ),
      icon: <Share className="w-5 h-5 text-primary" />,
      position: 'top-right',
      pointer: 'up',
    },
    {
      title: L('Selecciona "Instalar app"', 'Select "Install app"'),
      description: L(
        'En el menú que aparece, busca "Añadir a pantalla de inicio" o "Instalar app" y tócalo.',
        'In the dropdown menu, tap "Add to Home screen" or "Install app".'
      ),
      icon: <Plus className="w-5 h-5 text-primary" />,
      position: 'mid-right',
      pointer: 'left',
    },
    {
      title: L('¡Instalada! 🎉', 'Installed! 🎉'),
      description: L(
        'Nova ya aparece como app en tu pantalla de inicio. Tócala como cualquier otra app. ¡Ya puedes cerrar este tutorial!',
        'NOVA is now saved on your home screen like a native app. You can now close this guide!'
      ),
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
      position: 'bottom-center',
      pointer: 'none',
    },
  ],
  ios: [
    {
      title: L('¡Hola! Soy Sara 👋', 'Hi! I’m Sara 👋'),
      description: L(
        'Voy a guiarte para instalar la app de Nova en tu iPhone o iPad. Necesitarás usar Safari.',
        'I’ll walk you through adding NOVA to your iPhone or iPad home screen. You will need to use Safari.'
      ),
      icon: <Apple className="w-5 h-5 text-primary" />,
      position: 'center',
      pointer: 'none',
    },
    {
      title: L('Abre en Safari', 'Open in Safari'),
      description: L(
        'En iOS, solo Safari permite instalar apps PWA. Si estás en Chrome u otro navegador, cópiala en Safari.',
        'On iOS, only Safari supports web app installation. If you are in Chrome, copy and open the link in Safari.'
      ),
      icon: <Apple className="w-5 h-5 text-primary" />,
      position: 'center',
      pointer: 'none',
    },
    {
      title: L('Toca el ícono Compartir', 'Tap the Share Button'),
      description: L(
        'Mira la barra inferior de Safari. Verás un cuadrado con una flecha hacia arriba (□↑). ¡Tócalo!',
        'Look at the bottom toolbar in Safari. Tap the Share icon (square with upward arrow).'
      ),
      icon: <Share className="w-5 h-5 text-primary" />,
      position: 'bottom-center',
      pointer: 'none',
    },
    {
      title: L('"Añadir a pantalla de inicio"', '"Add to Home Screen"'),
      description: L(
        'En el menú que se despliega, desliza hacia abajo y toca "Añadir a pantalla de inicio".',
        'In the share sheet, scroll down and tap "Add to Home Screen".'
      ),
      icon: <Plus className="w-5 h-5 text-primary" />,
      position: 'mid-right',
      pointer: 'left',
    },
    {
      title: L('¡Instalada! 🎉', 'Installed! 🎉'),
      description: L(
        'Nova ya aparece en tu pantalla de inicio como cualquier app. ¡Perfecto, ya puedes cerrar este tutorial!',
        'NOVA now lives on your home screen with its own icon. You are all set!'
      ),
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
      position: 'bottom-center',
      pointer: 'none',
    },
  ],
  pc: [
    {
      title: L('¡Hola! Soy Sara 👋', 'Hi! I’m Sara 👋'),
      description: L(
        'Voy a guiarte para instalar la app de Nova en tu ordenador. Funciona en Chrome y Edge.',
        'I’ll guide you to install NOVA on your computer desktop. Works best in Chrome and Edge.'
      ),
      icon: <Monitor className="w-5 h-5 text-primary" />,
      position: 'center',
      pointer: 'none',
    },
    {
      title: L('Usa Chrome o Edge', 'Use Chrome or Edge'),
      description: L(
        'Asegúrate de usar Google Chrome o Microsoft Edge. En Firefox y Safari para Mac no está disponible esta función.',
        'Make sure you are browsing in Google Chrome or Microsoft Edge for native PWA installation.'
      ),
      icon: <Chrome className="w-5 h-5 text-primary" />,
      position: 'center',
      pointer: 'none',
    },
    {
      title: L('Busca el ícono ⊕ en la barra', 'Click the ⊕ Icon in Address Bar'),
      description: L(
        'Mira la esquina superior derecha de la barra de direcciones. Verás un pequeño ícono de instalación (⊕ o una pantalla con flecha). ¡Haz clic en él!',
        'Look at the right side of your browser address bar. Click the small install icon (⊕ or computer display).'
      ),
      icon: <Download className="w-5 h-5 text-primary" />,
      position: 'top-right',
      pointer: 'up',
    },
    {
      title: L('Confirma la instalación', 'Confirm Installation'),
      description: L(
        'Aparecerá un diálogo preguntando si quieres instalar la app. Haz clic en "Instalar" para confirmar.',
        'A browser popup will ask if you want to install the app. Click "Install" to confirm.'
      ),
      icon: <Plus className="w-5 h-5 text-primary" />,
      position: 'mid-right',
      pointer: 'left',
    },
    {
      title: L('¡Instalada! 🎉', 'Installed! 🎉'),
      description: L(
        'Nova se ha añadido como app de escritorio con su propio icono. La encontrarás en tu menú de aplicaciones. ¡Listo!',
        'NOVA is installed as a standalone desktop app. You will find it in your applications menu!'
      ),
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
      position: 'bottom-center',
      pointer: 'none',
    },
  ],
});

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

  const steps = getTutorialSteps()[platform];
  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStep((prev) => prev - 1);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const posClass = POSITION_CLASSES[step.position];

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Dim backdrop */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Sara Card */}
      <div
        className={`fixed z-[202] w-[90vw] max-w-xs transition-all duration-300 ${posClass} ${
          visible ? 'scale-100' : 'scale-95'
        }`}
      >
        <div className="rounded-2xl border border-primary/30 bg-card shadow-2xl p-5">
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground z-10"
            aria-label={L('Cerrar', 'Close')}
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
              {L('Anterior', 'Previous')}
            </Button>
            <span className="text-xs text-muted-foreground">{currentStep + 1}/{steps.length}</span>
            <Button size="sm" onClick={handleNext} className="gap-1 text-xs h-8">
              {isLast ? L('Cerrar', 'Finish') : L('Siguiente', 'Next')}
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
    { icon: <Chrome className="w-5 h-5" />, title: L('Abre en Chrome', 'Open in Chrome'), desc: L('Asegúrate de usar Google Chrome en tu Android.', 'Ensure you are browsing in Chrome on Android.') },
    { icon: <Share className="w-5 h-5" />, title: L('Menú de opciones', 'Options Menu'), desc: L('Toca los tres puntos (⋮) en la esquina superior derecha.', 'Tap the three dots (⋮) in the top-right corner.') },
    { icon: <Plus className="w-5 h-5" />, title: L('Añadir a inicio', 'Add to Home'), desc: L('Selecciona "Añadir a pantalla de inicio" o "Instalar app".', 'Select "Add to Home screen" or "Install app".') },
    { icon: <CheckCircle className="w-5 h-5" />, title: L('¡Listo!', 'All Done!'), desc: L('Nova aparecerá como una app nativa en tu pantalla de inicio.', 'NOVA will live as an app icon on your home screen.') },
  ];

  const iosSteps = [
    { icon: <Apple className="w-5 h-5" />, title: L('Abre en Safari', 'Open in Safari'), desc: L('Usa Safari para instalar apps PWA en iPhone/iPad.', 'Use Safari to add PWAs on iPhone & iPad.') },
    { icon: <Share className="w-5 h-5" />, title: L('Botón Compartir', 'Share Button'), desc: L('Toca el ícono de compartir (cuadrado con flecha) en la barra inferior.', 'Tap the share button (square with arrow) at the bottom.') },
    { icon: <Plus className="w-5 h-5" />, title: L('Añadir a inicio', 'Add to Home Screen'), desc: L('Desliza hacia abajo y selecciona "Añadir a pantalla de inicio".', 'Scroll down and tap "Add to Home Screen".') },
    { icon: <CheckCircle className="w-5 h-5" />, title: L('¡Listo!', 'All Done!'), desc: L('La app de Nova aparece en tu pantalla de inicio como cualquier app.', 'NOVA appears on your home screen ready to launch.') },
  ];

  const pcSteps = [
    { icon: <Chrome className="w-5 h-5" />, title: L('Abre en Chrome / Edge', 'Open in Chrome / Edge'), desc: L('Accede a la web desde Google Chrome o Microsoft Edge.', 'Access the site from Google Chrome or Microsoft Edge.') },
    { icon: <Monitor className="w-5 h-5" />, title: L('Ícono de instalación', 'Install Icon'), desc: L('Busca el ícono de instalar (⊕) en la barra de direcciones.', 'Click the install icon (⊕) in the browser address bar.') },
    { icon: <Download className="w-5 h-5" />, title: L('Instalar aplicación', 'Install Application'), desc: L('Haz clic en "Instalar" en el diálogo que aparece.', 'Click "Install" in the confirmation popup.') },
    { icon: <CheckCircle className="w-5 h-5" />, title: L('¡Listo!', 'All Done!'), desc: L('Nova se añade como app de escritorio con acceso directo.', 'NOVA opens in its own window as a desktop app.') },
  ];

  const stepsMap = { android: androidSteps, ios: iosSteps, pc: pcSteps };
  const currentSteps = stepsMap[activeOS];

  const platformButtons = [
    {
      id: 'android' as const,
      label: 'Android',
      sublabel: 'Google Chrome',
      icon: <Smartphone className="w-6 h-6" />,
      badge: deferredPrompt && activeOS === 'android' ? L('Instalar directo', 'Direct Install') : L('Tutorial con Sara', 'Interactive Guide'),
    },
    {
      id: 'ios' as const,
      label: 'iPhone / iPad',
      sublabel: 'Safari',
      icon: <Apple className="w-6 h-6" />,
      badge: L('Tutorial con Sara', 'Interactive Guide'),
    },
    {
      id: 'pc' as const,
      label: 'PC / Mac',
      sublabel: 'Chrome / Edge',
      icon: <Monitor className="w-6 h-6" />,
      badge: deferredPrompt && activeOS === 'pc' ? L('Instalar directo', 'Direct Install') : L('Tutorial con Sara', 'Interactive Guide'),
    },
  ];

  return (
    <>
    <SEOHead {...SEO_PAGES["/instalar-app"]} />
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Sara interactive tutorial overlay */}
      {saraPlatform && (
        <SaraInstallTutorial platform={saraPlatform} onClose={() => setSaraPlatform(null)} />
      )}

      <main id="contenido" className="pt-20 pb-16">
        {/* Hero */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">App · PWA</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {L('Instala la app de', 'Install the App for')}{' '}
              <span className="text-primary">NOVA</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              {L(
                'Accede a tu portal de cliente, recibe notificaciones y gestiona tu proyecto directamente desde tu móvil o PC. Sin App Store, sin pasos extra.',
                'Access your client dashboard, receive project updates, and message our team directly from your phone or desktop with zero app store friction.'
              )}
            </p>

            {isInstalled && (
              <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 border border-green-500/30 rounded-full px-6 py-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{L('¡App ya instalada!', 'App already installed!')}</span>
              </div>
            )}
          </div>
        </section>

        {/* Platform Download Buttons */}
        <section className="px-4 pb-10">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-sm text-muted-foreground mb-5">
              {L('Elige tu dispositivo y Sara te guiará paso a paso:', 'Select your device and Sara will guide you step by step:')}
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
                { icon: <Bell className="w-6 h-6 text-primary" />, title: L('Notificaciones', 'Real-Time Alerts'), desc: L('Recibe alertas de tu proyecto, mensajes y actualizaciones en tiempo real.', 'Stay updated on project milestones and messages in real time.') },
                { icon: <Smartphone className="w-6 h-6 text-primary" />, title: L('Acceso rápido', 'Instant Launch'), desc: L('Un toque desde tu pantalla de inicio. Sin abrir el navegador.', 'Launch straight from your home screen without opening a browser.') },
                { icon: <CheckCircle className="w-6 h-6 text-primary" />, title: L('Sin App Store', 'Zero App Store Hassle'), desc: L('Instala directamente desde el navegador. Gratis y sin pasos extra.', 'Install directly from your web browser with zero download friction.') },
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
                <CardTitle className="text-center">{L('Guía de instalación paso a paso', 'Step-by-Step Installation Guide')}</CardTitle>
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
                        <div className="text-xs font-bold text-primary mb-0.5">{L('Paso', 'Step')} {i + 1}</div>
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
                    <strong>{L('Nota:', 'Note:')}</strong> {L('En iPhone/iPad, la instalación solo funciona desde Safari. Chrome y otros navegadores no permiten instalar PWAs en iOS.', 'On iPhone & iPad, adding to home screen is supported via Safari. Chrome and third-party browsers on iOS do not support PWA installation.')}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default InstalarApp;
