import { useState, useEffect } from 'react';
import { Smartphone, Monitor, Apple, Download, Bell, CheckCircle, ArrowRight, Chrome, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const InstalarApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeOS, setActiveOS] = useState<'android' | 'ios' | 'pc'>('android');

  useEffect(() => {
    // Detect if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Capture install prompt (Android/PC Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Detect OS for default tab
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        {/* Hero */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">App Gratuita</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Instala la app de{' '}
              <span className="text-primary">Nova</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Accede a tu portal de cliente, recibe notificaciones y gestiona tu proyecto directamente desde tu móvil o PC.
            </p>
            
            {isInstalled ? (
              <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-6 py-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">¡App ya instalada!</span>
              </div>
            ) : deferredPrompt ? (
              <Button size="lg" onClick={handleInstallClick} className="gap-2">
                <Download className="w-5 h-5" />
                Instalar ahora
              </Button>
            ) : null}
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
                <Card key={i} className="text-center p-6">
                  <div className="flex justify-center mb-3">{b.icon}</div>
                  <h3 className="font-semibold mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </Card>
              ))}
            </div>

            {/* OS Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Guía de instalación paso a paso</CardTitle>
                <div className="flex justify-center gap-2 mt-2">
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
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-400">
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
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Tu proyecto avance a una nueva etapa</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> El equipo de Nova te envíe un mensaje</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Tu presupuesto sea aprobado o actualizado</li>
                      <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Haya actualizaciones importantes en tu cuenta</li>
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
