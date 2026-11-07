import { useState, useRef, useEffect } from 'react';
import { X, ArrowLeft, User, MessageSquare, MessageCircleMore, ChevronRight } from 'lucide-react';
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
import { L } from '@/i18n';

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

  // Other parts of the page (e.g. the welcome guide) can open Sara
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener('nova:open-sara', open);
    return () => window.removeEventListener('nova:open-sara', open);
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(L('¡Hola! 👋 Soy Sara, tu asistente virtual de Nova Marketing Solutions.\n\nPuedo ayudarte a resolver dudas, ver servicios y precios, o hacer seguimiento de tu proyecto.', 'Hi! 👋 I\'m Sara, the virtual assistant at Nova Marketing Solutions.\n\nI can answer your questions, show you our services and pricing, or help you follow up on your project.'));
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
        addUserMessage(L('Chat con Sara (IA)', 'Chat with Sara (AI)'));
        setFlowState('ai-chat');
        break;
      case 'faq':
        addUserMessage(L('Preguntas frecuentes', 'FAQ'));
        addBotMessage(L('Selecciona una categoría para ver las preguntas frecuentes:', 'Choose a category to see the frequently asked questions:'));
        setFlowState('faq');
        break;
      case 'services':
        addUserMessage(L('Ver servicios y precios', 'See services & pricing'));
        addBotMessage(L('¿Qué tipo de servicio te interesa?', 'What kind of service are you interested in?'));
        setFlowState('services');
        break;
      case 'support':
        addUserMessage(L('Soporte y mantenimiento', 'Support & maintenance'));
        addBotMessage(L('¿Cómo podemos ayudarte?', 'How can we help you?'));
        setFlowState('support');
        break;
      case 'whatsapp':
        addUserMessage('WhatsApp');
        handleWhatsApp();
        break;
      case 'email':
        addUserMessage(L('Enviar correo', 'Send an email'));
        setFlowState('email');
        break;
      case 'agent':
        addUserMessage(L('Hablar con un agente', 'Talk to a person'));
        setFlowState('agent');
        break;
      case 'cybersecurity':
        addUserMessage(L('Ciberseguridad / Pentesting', 'Cybersecurity / Pentesting'));
        setSelectedService('cybersecurity');
        setFlowState('service-category');
        break;
      case 'voice-call':
        addUserMessage(L('Llamar a Sara', 'Call Sara'));
        setFlowState('voice-call');
        break;
      case 'install-app':
        addUserMessage(L('Instalar App', 'Install the app'));
        navigate('/instalar-app');
        setIsOpen(false);
        break;
      case 'client-portal':
        if (user) {
          navigate('/dashboard');
          setIsOpen(false);
        } else {
          addUserMessage(L('Portal de cliente', 'Client portal'));
          addBotMessage(L('Para acceder al portal de cliente, necesitas iniciar sesión o crear una cuenta.', 'To access the client portal, please log in or create an account.'));
          setFlowState('client-portal');
        }
        break;
    }
  };

  const handleWhatsApp = (customMessage?: string) => {
    const message = customMessage || L('Hola Nova, quiero información sobre vuestros servicios.', 'Hi Nova, I\'d like information about your services.');
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
    addBotMessage(L('¡Perfecto! Completa este formulario y te enviaremos un presupuesto personalizado.', 'Great! Fill in this form and we\'ll send you a personalized quote.'));
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
    addBotMessage(L('¡Gracias! 🙌 Nuestro equipo te contactará en breve. ¿Hay algo más en lo que pueda ayudarte?', 'Thank you! 🙌 Our team will contact you shortly. Is there anything else I can help you with?'));
    setFlowState('welcome');
  };

  const handleFormCancel = () => {
    addBotMessage(L('Sin problema. ¿Hay algo más en lo que pueda ayudarte?', 'No problem. Is there anything else I can help you with?'));
    setFlowState('welcome');
  };

  // 'ai-chat' is rendered as the highlighted card above these
  const quickOptions: ChatOption[] = [
    { id: 'services', label: L('Servicios y precios', 'Services & pricing'), icon: <Briefcase className="w-4 h-4" /> },
    { id: 'faq', label: L('Preguntas frecuentes', 'FAQ'), icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'agent', label: L('Hablar con un agente', 'Talk to a person'), icon: <Phone className="w-4 h-4" /> },
  ];

  const moreOptions: ChatOption[] = [
    // { id: 'voice-call', label: 'Llamar a Sara 🎙️', icon: <PhoneCall className="w-4 h-4" /> },
    { id: 'support', label: L('Soporte y mantenimiento', 'Support & maintenance'), icon: <Wrench className="w-4 h-4" /> },
    { id: 'email', label: L('Enviar correo', 'Send an email'), icon: <Mail className="w-4 h-4" /> },
    { id: 'cybersecurity', label: L('Ciberseguridad / Pentesting', 'Cybersecurity / Pentesting'), icon: <Shield className="w-4 h-4" /> },
    { id: 'install-app', label: L('Instalar App', 'Install the app'), icon: <Download className="w-4 h-4" /> },
  ];

  if (user) {
    moreOptions.unshift({ id: 'client-portal', label: L('Mi Portal', 'My Portal'), icon: <User className="w-4 h-4" /> });
  }

  const serviceOptions: ChatOption[] = [
    { id: 'web', label: L('Páginas Web', 'Websites'), icon: <Globe className="w-4 h-4" /> },
    { id: 'apps', label: L('Aplicaciones Móviles', 'Mobile Apps'), icon: <Smartphone className="w-4 h-4" /> },
    { id: 'social', label: L('Redes Sociales', 'Social Media'), icon: <Share2 className="w-4 h-4" /> },
    { id: 'branding', label: 'Branding', icon: <Palette className="w-4 h-4" /> },
    { id: 'cybersecurity', label: L('Ciberseguridad', 'Cybersecurity'), icon: <Shield className="w-4 h-4" /> },
  ];

  const faqOptions: ChatOption[] = Object.entries(FAQ_CATEGORIES).map(([key, cat]) => ({
    id: key,
    label: cat.label
  }));

  const supportOptions: ChatOption[] = [
    { id: 'ticket', label: L('Crear ticket de soporte', 'Create a support ticket') },
    { id: 'maintenance', label: L('Consultar mantenimiento', 'Check maintenance') },
    { id: 'whatsapp', label: L('WhatsApp directo', 'WhatsApp us') },
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
                <MessageCircleMore className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{L('Habla con Sara', 'Chat with Sara')}</span>
                <span className="block text-xs text-white/80">{L('Resuelve tus dudas y recibe un presupuesto orientativo al momento', 'Get your questions answered and an instant estimate')}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 opacity-80 transition-transform group-hover:translate-x-0.5" />
            </button>

            <ChatOptions options={quickOptions} onSelect={handleMainOption} columns={2} />

            <div>
              <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{L('Más opciones', 'More options')}</p>
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
              {L('Volver', 'Back')}
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
              {L('Volver', 'Back')}
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
              {L('Volver', 'Back')}
            </Button>
            <ChatOptions 
              options={supportOptions} 
              onSelect={(id) => {
                if (id === 'ticket') {
                  setFlowState('ticket');
                } else if (id === 'whatsapp') {
                  handleWhatsApp(L('Hola Nova, necesito soporte técnico.', 'Hi Nova, I need technical support.'));
                } else {
                  addBotMessage(L('Para consultar el estado de tu mantenimiento, accede a tu portal de cliente o contacta con nosotros.', 'To check your maintenance status, open your client portal or contact us.'));
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
              {L('Volver', 'Back')}
            </Button>
            <div className="text-center space-y-3">
              <User className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-sm">{L('Accede a tu portal para ver:', 'Open your portal to see:')}</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>{L('• Estado de tu proyecto', '• Your project status')}</li>
                <li>{L('• Calendario de mantenimientos', '• Maintenance schedule')}</li>
                <li>{L('• Tickets de soporte', '• Support tickets')}</li>
                <li>{L('• Entregables y descargas', '• Deliverables and downloads')}</li>
                <li>{L('• Sistema de referidos', '• Referral program')}</li>
              </ul>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    navigate('/auth');
                    setIsOpen(false);
                  }}
                  className="flex-1"
                >
                  {L('Iniciar sesión', 'Log in')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    navigate('/auth');
                    setIsOpen(false);
                  }}
                  className="flex-1"
                >
                  {L('Crear cuenta', 'Create account')}
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
          aria-label={L('Chat con Sara, asistente virtual de NOVA', 'Chat with Sara, NOVA\'s virtual assistant')}
          className="fixed bottom-40 md:bottom-24 right-4 z-50 w-[380px] sm:w-[400px] max-w-[calc(100vw-2rem)] bg-background/95 backdrop-blur-xl border border-border/60 rounded-3xl shadow-[0_24px_64px_-12px_rgba(0,0,0,0.55)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 flex flex-col"
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
                <p className="text-xs text-white/80">{L('Asistente de NOVA · En línea', 'NOVA assistant · Online')}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={L('Cerrar chat', 'Close chat')}
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
