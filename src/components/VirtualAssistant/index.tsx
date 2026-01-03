import { useState, useRef, useEffect } from 'react';
import { X, ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { FAQ_CATEGORIES, SERVICES_DATA, WHATSAPP_NUMBER } from '@/data/chatFlowData';
import { 
  HelpCircle, 
  Briefcase, 
  Wrench, 
  Calendar, 
  MessageCircle, 
  Mail, 
  Phone, 
  Shield,
  Globe,
  Smartphone,
  Share2,
  Palette
} from 'lucide-react';

type FlowState = 
  | 'welcome'
  | 'faq'
  | 'faq-category'
  | 'services'
  | 'service-category'
  | 'service-pack'
  | 'support'
  | 'schedule'
  | 'whatsapp'
  | 'email'
  | 'agent'
  | 'quote'
  | 'ticket'
  | 'client-portal';

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
      addBotMessage('Hola 👋 Soy el asistente virtual de Nova Marketing Solutions.\n\nPuedo ayudarte a resolver dudas, ver servicios y precios, o hacer seguimiento de tu proyecto.');
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
      case 'faq':
        addUserMessage('Asistente virtual (FAQ)');
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
      case 'schedule':
        addUserMessage('Agendar una cita');
        setFlowState('schedule');
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
      case 'schedule':
      case 'email':
      case 'agent':
      case 'client-portal':
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

  const mainOptions: ChatOption[] = [
    { id: 'faq', label: 'Asistente virtual (FAQ)', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'services', label: 'Ver servicios y precios', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'support', label: 'Soporte y mantenimiento', icon: <Wrench className="w-4 h-4" /> },
    { id: 'schedule', label: 'Agendar una cita', icon: <Calendar className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'email', label: 'Enviar correo', icon: <Mail className="w-4 h-4" /> },
    { id: 'agent', label: 'Hablar con un agente', icon: <Phone className="w-4 h-4" /> },
    { id: 'cybersecurity', label: 'Ciberseguridad / Pentesting', icon: <Shield className="w-4 h-4" /> },
  ];

  if (user) {
    mainOptions.push({ id: 'client-portal', label: 'Mi Portal', icon: <User className="w-4 h-4" /> });
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
          <ChatOptions 
            options={mainOptions} 
            onSelect={handleMainOption}
          />
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
            onSchedule={() => setFlowState('schedule')}
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
            onSchedule={() => setFlowState('schedule')}
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
            onSchedule={() => setFlowState('schedule')}
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

      case 'schedule':
        return (
          <AppointmentForm
            onComplete={handleFormComplete}
            onCancel={handleFormCancel}
          />
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

      default:
        return null;
    }
  };

  return (
    <>
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Asistente Nova</h3>
                <p className="text-xs opacity-80">Siempre disponible</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
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
          </ScrollArea>
        </div>
      )}
    </>
  );
};

export default VirtualAssistant;
