import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowRight, ArrowLeft, Folder, Ticket, Gift, Shield, CreditCard, Bell, MessageCircleHeart } from 'lucide-react';
import saraAvatar from '@/assets/sara-avatar.png';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: '¡Bienvenido a tu Panel! 🎉',
    description: 'Soy Sara, tu asistente virtual. Te guiaré por las funciones principales de tu panel para que puedas sacarle el máximo provecho.',
    icon: <MessageCircleHeart className="w-5 h-5 text-primary" />,
  },
  {
    title: 'Tus Proyectos',
    description: 'Aquí verás todos tus proyectos activos con su progreso, timeline, hitos y estado del hosting, dominio y SSL. También podrás solicitar revisiones.',
    icon: <Folder className="w-5 h-5 text-primary" />,
    highlight: 'projects',
  },
  {
    title: 'Soporte Técnico',
    description: 'Crea tickets de soporte para reportar problemas, solicitar cambios o hacer consultas. Nuestro equipo responderá lo antes posible.',
    icon: <Ticket className="w-5 h-5 text-primary" />,
    highlight: 'tickets',
  },
  {
    title: 'Programa de Referidos',
    description: '¡Invita amigos y gana recompensas! Obtén un 10% de descuento y una estrategia de marketing gratis cuando tu referido contrate.',
    icon: <Gift className="w-5 h-5 text-primary" />,
    highlight: 'referrals',
  },
  {
    title: 'Seguridad',
    description: 'Consulta el estado de las auditorías de seguridad y pentesting de tus proyectos para mantener todo protegido.',
    icon: <Shield className="w-5 h-5 text-primary" />,
    highlight: 'security',
  },
  {
    title: 'Pagos y Notificaciones',
    description: 'Revisa tu historial de pagos y mantente al día con las notificaciones en tiempo real sobre actualizaciones de tus proyectos.',
    icon: <Bell className="w-5 h-5 text-primary" />,
    highlight: 'notifications',
  },
];

interface WelcomeTutorialProps {
  onComplete: () => void;
}

const WelcomeTutorial = ({ onComplete }: WelcomeTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const step = TUTORIAL_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Tutorial Card */}
      <Card
        className={`relative z-10 w-[90vw] max-w-md mx-4 border-primary/20 shadow-2xl transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 text-muted-foreground hover:text-foreground z-10"
          onClick={handleClose}
        >
          <X className="w-4 h-4" />
        </Button>

        <CardContent className="pt-6 pb-4 px-6">
          {/* Sara Avatar + Speech bubble */}
          <div className="flex items-start gap-4 mb-5">
            <div className="relative flex-shrink-0">
              <img
                src={saraAvatar}
                alt="Sara"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/30 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <MessageCircleHeart className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {step.icon}
                <h3 className="font-bold text-foreground text-base">{step.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {TUTORIAL_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'w-6 bg-primary'
                    : i < currentStep
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              disabled={isFirst}
              className="gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            <span className="text-xs text-muted-foreground">
              {currentStep + 1} / {TUTORIAL_STEPS.length}
            </span>

            <Button
              size="sm"
              onClick={handleNext}
              className="gap-1"
            >
              {isLast ? 'Empezar' : 'Siguiente'}
              {!isLast && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeTutorial;
