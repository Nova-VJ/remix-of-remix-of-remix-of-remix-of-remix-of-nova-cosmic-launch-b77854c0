import { useState, useEffect } from 'react';
import { Smartphone, Monitor, Apple, Download, Bell, CheckCircle, ArrowRight, Chrome, Share, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Sara tutorial callout per platform
const SaraTutorial = ({ platform, onClose }: { platform: 'android' | 'ios' | 'pc'; onClose: () => void }) => {
  const content = {
    android: {
      title: '¡Hola! Soy Sara 👋',
      steps: [
        { icon: <Chrome className="w-5 h-5 text-primary" />, text: 'Abre esta página en Google Chrome en tu Android.' },
        { icon: <Share className="w-5 h-5 text-primary" />, text: 'Toca los tres puntos (⋮) en la esquina superior derecha.' },
        { icon: <Plus className="w-5 h-5 text-primary" />, text: 'Selecciona "Añadir a pantalla de inicio" o "Instalar app".' },
        { icon: <CheckCircle className="w-5 h-5 text-primary" />, text: '¡Listo! Nova aparecerá como una app nativa en tu pantalla.' },
      ],
      note: 'Si ves el botón "Instalar ahora" en la parte superior de esta página, también puedes usarlo directamente.',
    },
    ios: {
      title: '¡Hola! Soy Sara 👋',
      steps: [
        { icon: <Apple className="w-5 h-5 text-primary" />, text: 'Abre esta página en Safari (no funciona en Chrome para iOS).' },
        { icon: <Share className="w-5 h-5 text-primary" />, text: 'Toca el ícono de compartir (□↑) en la barra inferior de Safari.' },
        { icon: <Plus className="w-5 h-5 text-primary" />, text: 'Desliza hacia abajo y elige "Añadir a pantalla de inicio".' },
        { icon: <CheckCircle className="w-5 h-5 text-primary" />, text: '¡Listo! La app de Nova aparece en tu pantalla de inicio.' },
      ],
      note: 'En iPhone/iPad solo funciona desde Safari. Apple no permite instalar apps PWA desde Chrome u otros navegadores.',
    },
    pc: {
      title: '¡Hola! Soy Sara 👋',
      steps: [
        { icon: <Chrome className="w-5 h-5 text-primary" />, text: 'Abre esta página en Google Chrome o Microsoft Edge.' },
        { icon: <Monitor className="w-5 h-5 text-primary" />, text: 'Busca el ícono de instalación (⊕) en la barra de direcciones.' },
        { icon: <Download className="w-5 h-5 text-primary" />, text: 'Haz clic en él y luego en "Instalar" en el diálogo que aparece.' },
        { icon: <CheckCircle className="w-5 h-5 text-primary" />, text: '¡Listo! Nova se añade como app de escritorio con acceso directo.' },
      ],
      note: 'Si ves el botón "Instalar ahora" en la parte superior, úsalo directamente. Funciona en Chrome y Edge.',
    },
  };

  const { title, steps, note } = content[platform];

  return (
    <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 relative animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Sara avatar + header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
          S
        </div>
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">Te explico cómo instalarlo paso a paso:</p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              {step.icon}
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs font-bold text-primary mt-1">{i + 1}.</span>
              <p className="text-sm text-foreground/80">{step.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="rounded-lg bg-muted/50 border border-border p-3 text-xs text-muted-foreground">
        💡 {note}
      </div>
    </div>
  );
};

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
    // For android/pc: try native prompt first, then show Sara
    if ((platform === 'android' || platform === 'pc') && deferredPrompt) {
      await handleInstallClick();
      return;
    }
    // Otherwise open Sara tutorial
    setSaraPlatform(prev => prev === platform ? null : platform);
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
      badge: deferredPrompt && activeOS === 'android' ? 'Instalar directo' : 'Ver instrucciones',
    },
    {
      id: 'ios' as const,
      label: 'iPhone / iPad',
      sublabel: 'Safari',
      icon: <Apple className="w-6 h-6" />,
      badge: 'Ver instrucciones',
    },
    {
      id: 'pc' as const,
      label: 'PC / Mac',
      sublabel: 'Chrome o Edge',
      icon: <Monitor className="w-6 h-6" />,
      badge: deferredPrompt && activeOS === 'pc' ? 'Instalar directo' : 'Ver instrucciones',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        {/* Hero */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">App Gratuita · PWA</Badge>
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
              Elige tu dispositivo y Sara te guiará:
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

            {/* Sara Tutorial Callout */}
            {saraPlatform && (
              <SaraTutorial platform={saraPlatform} onClose={() => setSaraPlatform(null)} />
            )}

            {/* Honest note */}
            <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground text-center">
              <strong className="text-foreground">¿Por qué no hay un archivo APK o IPA para descargar?</strong>
              <br />
              Esta app usa tecnología PWA, que es equivalente a una app nativa: mismo ícono, misma experiencia, sin necesidad de la App Store ni Google Play. La instalación se hace directamente desde el navegador.
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
