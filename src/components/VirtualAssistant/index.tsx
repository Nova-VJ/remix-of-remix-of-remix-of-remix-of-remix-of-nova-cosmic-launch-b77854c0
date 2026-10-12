import { useState, useRef, useEffect } from 'react';
import { X, ArrowLeft, User, MessageSquare, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChatButton from './ChatButton';
import ChatMessage from './ChatMessage';
import ChatOptions, { ChatOption } from './ChatOptions';
import LeadForm from './forms/LeadForm';
import AppointmentForm from './forms/AppointmentForm';
import EmailForm from './forms/EmailForm';
import TicketForm from './forms/TicketForm';
import AgentForm from './forms/AgentForm';
import ServicePackViewer from './ServicePackViewer';
import FAQViewer from './FAQViewer';
import AIChatMode from './AIChatMode';
import SaraVoiceCallMode from './SaraVoiceCallMode';
import { FAQ_CATEGORIES, SERVICES_DATA, WHATSAPP_NUMBER } from '@/data/chatFlowData';
import saraAvatar from '@/assets/sara-avatar.webp';
import { 
  HelpCircle, 
  Briefcase, 
  Wrench, 
  MessageCircle, 
  Mail, 
  Phone, 
  Shield,
  Globe,
  Smartphone,
  Share2,
  Palette,
  Download,
  PhoneCall
} from 'lucide-react';

type FlowState = 
  | 'welcome'
  | 'faq'
  | 'faq-category'
  | 'services'
  | 'service-category'
  | 'service-pack'
  | 'support'
  | 'whatsapp'
  | 'email'
  | 'agent'
  | 'quote'
  | 'ticket'
  | 'client-portal'
  | 'ai-chat'
  | 'voice-call'
  | 'install-app';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const VirtualAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [flowState, setFlowState] = useState<FlowState>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedService, setSelectedService] = useState<keyof typeof SERVICES_DATA | null>(null);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string | null>(null);
  const [quoteServiceType, setQuoteServiceType] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage('¡Hola! 👋 Soy Sara, tu asistente virtual de Nova Marketing Solutions.\n\nPuedo ayudarte a resolver dudas, ver servicios y precios, o hacer seguimiento de tu proyecto.');
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      // On the opening menu keep Sara's greeting in view; elsewhere follow the newest message
      const atStart = flowState === 'welcome' && messages.length <= 1;
      scrollRef.current.scrollTop = atStart ? 0 : scrollRef.current.scrollHeight;
    }
  }, [messages, flowState]);

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    }]);
  };

  const handleMainOption = (optionId: string) => {
    switch (optionId) {
      case 'ai-chat':
        addUserMessage('Chat con Sara (IA)');
        setFlowState('ai-chat');
        break;
      case 'faq':
        addUserMessage('Preguntas frecuentes');
        addBotMessage('Selecciona una categoría para ver las preguntas frecuentes:');
        setFlowState('faq');
        break;
      case 'services':
        addUserMessage('Ver servicios y precios');
        addBotMessage('¿Qué tipo de servicio te interesa?');
        setFlowState('services');
        break;
      case 'support':
        addUserMessage('Soporte y mantenimiento');
        addBotMessage('¿Cómo podemos ayudarte?');
        setFlowState('support');
        break;
      case 'whatsapp':
        addUserMessage('WhatsApp');
        handleWhatsApp();
        break;
      case 'email':
        addUserMessage('Enviar correo');
        setFlowState('email');
        break;
      case 'agent':
        addUserMessage('Hablar con un agente');
        setFlowState('agent');
        break;
      case 'cybersecurity':
        addUserMessage('Ciberseguridad / Pentesting');
        setSelectedService('cybersecurity');
        setFlowState('service-category');
        break;
      case 'voice-call':
        addUserMessage('Llamar a Sara');
        setFlowState('voice-call');
        break;
      case 'install-app':
        addUserMessage('Instalar App');
        navigate('/instalar-app');
        setIsOpen(false);
        break;
      case 'client-portal':
        if (user) {
          navigate('/dashboard');
          setIsOpen(false);
        } else {
          addUserMessage('Portal de cliente');
          addBotMessage('Para acceder al portal de cliente, necesitas iniciar sesión o crear una cuenta.');
          setFlowState('client-portal');
        }
        break;
    }
  };

  const handleWhatsApp = (customMessage?: string) => {
    const message = customMessage || 'Hola Nova, quiero información sobre vuestros servicios.';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleServiceSelect = (serviceKey: string) => {
    setSelectedService(serviceKey as keyof typeof SERVICES_DATA);
    const service = SERVICES_DATA[serviceKey as keyof typeof SERVICES_DATA];
    addUserMessage(service.title);
    addBotMessage(`Estos son nuestros packs de ${service.title}:`);
    setFlowState('service-category');
  };

  const handleFaqCategorySelect = (categoryKey: string) => {
    setSelectedFaqCategory(categoryKey);
    const category = FAQ_CATEGORIES[categoryKey as keyof typeof FAQ_CATEGORIES];
    addUserMessage(category.label);
    setFlowState('faq-category');
  };

  const handlePackSelect = (packId: string) => {
    setSelectedPack(packId);
    setFlowState('service-pack');
  };

  const handleRequestQuote = (packName: string) => {
    setQuoteServiceType(packName);
    addBotMessage('¡Perfecto! Completa este formulario y te enviaremos un presupuesto personalizado.');
    setFlowState('quote');
  };

  const handleBack = () => {
    switch (flowState) {
      case 'faq':
      case 'services':
      case 'support':
      case 'email':
      case 'agent':
      case 'client-portal':
      case 'ai-chat':
      case 'voice-call':
      case 'install-app':
        setFlowState('welcome');
        break;
      case 'faq-category':
        setSelectedFaqCategory(null);
        setFlowState('faq');
        break;
      case 'service-category':
        setSelectedService(null);
        setFlowState('services');
        break;
      case 'service-pack':
        setSelectedPack(null);
        setFlowState('service-category');
        break;
      case 'quote':
      case 'ticket':
        setFlowState('welcome');
        break;
      default:
        setFlowState('welcome');
    }
  };

  const handleFormComplete = () => {
    addBotMessage('¡Gracias! 🙌 Nuestro equipo te contactará en breve. ¿Hay algo más en lo que pueda ayudarte?');
    setFlowState('welcome');
  };

  const handleFormCancel = () => {
    addBotMessage('Sin problema. ¿Hay algo más en lo que pueda ayudarte?');
    setFlowState('welcome');
  };

  // 'ai-chat' is rendered as the highlighted card above these
  const quickOptions: ChatOption[] = [
    { id: 'services', label: 'Servicios y precios', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'faq', label: 'Preguntas frecuentes', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'agent', label: 'Hablar con un agente', icon: <Phone className="w-4 h-4" /> },
  ];

  const moreOptions: ChatOption[] = [
    // { id: 'voice-call', label: 'Llamar a Sara 🎙️', icon: <PhoneCall className="w-4 h-4" /> },
    { id: 'support', label: 'Soporte y mantenimiento', icon: <Wrench className="w-4 h-4" /> },
    { id: 'email', label: 'Enviar correo', icon: <Mail className="w-4 h-4" /> },
    { id: 'cybersecurity', label: 'Ciberseguridad / Pentesting', icon: <Shield className="w-4 h-4" /> },
    { id: 'install-app', label: 'Instalar App', icon: <Download className="w-4 h-4" /> },
  ];

  if (user) {
    moreOptions.unshift({ id: 'client-portal', label: 'Mi Portal', icon: <User className="w-4 h-4" /> });
  }

  const serviceOptions: ChatOption[] = [
    { id: 'web', label: 'Páginas Web', icon: <Globe className="w-4 h-4" /> },
    { id: 'apps', label: 'Aplicaciones Móviles', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'social', label: 'Redes Sociales', icon: <Share2 className="w-4 h-4" /> },
    { id: 'branding', label: 'Branding', icon: <Palette className="w-4 h-4" /> },
    { id: 'cybersecurity', label: 'Ciberseguridad', icon: <Shield className="w-4 h-4" /> },
  ];

  const faqOptions: ChatOption[] = Object.entries(FAQ_CATEGORIES).map(([key, cat]) => ({
    id: key,
    label: cat.label
  }));

  const supportOptions: ChatOption[] = [
    { id: 'ticket', label: 'Crear ticket de soporte' },
    { id: 'maintenance', label: 'Consultar mantenimiento' },
    { id: 'whatsapp', label: 'WhatsApp directo' },
  ];

  const renderContent = () => {
    switch (flowState) {
      case 'welcome':
        return (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => handleMainOption('ai-chat')}
              className="group flex w-full items-center gap-3 rounded-2xl p-3.5 text-left text-white shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              style={{ backgroundImage: 'var(--gradient-purple)' }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">Habla con Sara</span>
                <span className="block text-xs text-white/80">Resuelve tus dudas y recibe un presupuesto orientativo al momento</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 opacity-80 transition-transform group-hover:translate-x-0.5" />
            </button>

            <ChatOptions options={quickOptions} onSelect={handleMainOption} columns={2} />

            <div>
              <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Más opciones</p>
              <ChatOptions options={moreOptions} onSelect={handleMainOption} />
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="h-8 px-2 text-xs"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Volver
            </Button>
            <ChatOptions 
              options={faqOptions} 
              onSelect={handleFaqCategorySelect}
            />
          </div>
        );

      case 'faq-category':
        return (
          <FAQViewer
            categoryKey={selectedFaqCategory || undefined}
            onBack={handleBack}
            onAgent={() => setFlowState('agent')}
          />
        );

      case 'services':
        return (
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="h-8 px-2 text-xs"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Volver
            </Button>
            <ChatOptions 
              options={serviceOptions} 
              onSelect={handleServiceSelect}
            />
          </div>
        );

      case 'service-category':
        if (!selectedService) return null;
        return (
          <ServicePackViewer
            serviceKey={selectedService}
            onBack={handleBack}
            onRequestQuote={handlePackSelect}
          />
        );

      case 'service-pack':
        if (!selectedService || !selectedPack) return null;
        return (
          <ServicePackViewer
            serviceKey={selectedService}
            packId={selectedPack}
            onBack={() => {
              setSelectedPack(null);
              setFlowState('service-category');
            }}
            onRequestQuote={(packName) => handleRequestQuote(packName)}
          />
        );

      case 'support':
        return (
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="h-8 px-2 text-xs"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Volver
            </Button>
            <ChatOptions 
              options={supportOptions} 
              onSelect={(id) => {
                if (id === 'ticket') {
                  setFlowState('ticket');
                } else if (id === 'whatsapp') {
                  handleWhatsApp('Hola Nova, necesito soporte técnico.');
                } else {
                  addBotMessage('Para consultar el estado de tu mantenimiento, accede a tu portal de cliente o contacta con nosotros.');
                }
              }}
            />
          </div>
        );

      case 'email':
        return (
          <EmailForm
            onComplete={handleFormComplete}
            onCancel={handleFormCancel}
          />
        );

      case 'agent':
        return (
          <AgentForm
            onComplete={handleFormComplete}
            onCancel={handleFormCancel}
          />
        );

      case 'quote':
        return (
          <LeadForm
            serviceType={quoteServiceType}
            onComplete={handleFormComplete}
            onCancel={handleFormCancel}
          />
        );

      case 'ticket':
        return (
          <TicketForm
            onComplete={handleFormComplete}
            onCancel={handleFormCancel}
          />
        );

      case 'client-portal':
        return (
          <div className="p-4 space-y-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="h-8 px-2 text-xs"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              Volver
            </Button>
            <div className="text-center space-y-3">
              <User className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-sm">Accede a tu portal para ver:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Estado de tu proyecto</li>
                <li>• Calendario de mantenimientos</li>
                <li>• Tickets de soporte</li>
                <li>• Entregables y descargas</li>
                <li>• Sistema de referidos</li>
              </ul>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    navigate('/auth');
                    setIsOpen(false);
                  }}
                  className="flex-1"
                >
                  Iniciar sesión
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    navigate('/auth');
                    setIsOpen(false);
                  }}
                  className="flex-1"
                >
                  Crear cuenta
                </Button>
              </div>
            </div>
          </div>
        );

      case 'ai-chat':
      case 'voice-call':
        return null; // Rendered outside ScrollArea

      default:
        return null;
    }
  };

  return (
    <>
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat con Sara, asistente virtual de NOVA"
          className="fixed bottom-40 sm:bottom-24 right-4 z-50 w-[380px] sm:w-[400px] max-w-[calc(100vw-2rem)] bg-background/95 backdrop-blur-xl border border-border/60 rounded-3xl shadow-[0_24px_64px_-12px_rgba(0,0,0,0.55)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col"
          style={{ maxHeight: 'min(620px, calc(100dvh - 10rem))' }}
        >
          {/* Header with Sara avatar */}
          <div className="relative shrink-0 px-4 py-3 text-white" style={{ backgroundImage: 'var(--gradient-purple)' }}>
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={saraAvatar}
                  alt="Sara"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-white/30"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[hsl(275_75%_55%)]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-semibold leading-tight">Sara</h3>
                <p className="text-xs text-white/80">Asistente de NOVA · En línea</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {flowState === 'voice-call' ? (
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col" style={{ height: '500px', maxHeight: '60vh' }}>
              <SaraVoiceCallMode onEnd={handleBack} />
            </div>
          ) : flowState === 'ai-chat' ? (
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col" style={{ height: '500px', maxHeight: '60vh' }}>
              <AIChatMode onBack={handleBack} />
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4" ref={scrollRef} style={{ maxHeight: '460px', WebkitOverflowScrolling: 'touch' as any, touchAction: 'pan-y' }}>
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg.text}
                  isBot={msg.isBot}
                  timestamp={msg.timestamp}
                />
              ))}
              
              {/* Current flow content */}
              <div className="mt-2">
                {renderContent()}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VirtualAssistant;
