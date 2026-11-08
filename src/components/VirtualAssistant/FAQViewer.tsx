import { Button } from '@/components/ui/button';
import { FAQ_CATEGORIES } from '@/data/chatFlowData';
import { ArrowLeft, ChevronDown, ChevronUp, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { WHATSAPP_NUMBER } from '@/data/chatFlowData';
import { L } from '@/i18n';

interface FAQViewerProps {
  categoryKey?: string;
  onBack: () => void;
  onAgent: () => void;
}

const FAQViewer = ({ categoryKey, onBack, onAgent }: FAQViewerProps) => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      L('Hola Nova, tengo una pregunta sobre vuestros servicios.', 'Hi Nova, I have a question about your services.')
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  if (!categoryKey) {
    // Show categories
    return (
      <div className="p-2 space-y-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="h-8 px-2 text-xs"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          {L('Volver', 'Back')}
        </Button>

        <p className="text-sm font-medium">{L('Selecciona una categoría:', 'Choose a category:')}</p>

        <div className="space-y-1">
          {Object.entries(FAQ_CATEGORIES).map(([key, category]) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => onBack()}
              data-category={key}
              className="w-full justify-start h-auto py-2 text-xs font-normal"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const category = FAQ_CATEGORIES[categoryKey as keyof typeof FAQ_CATEGORIES];
  if (!category) return null;

  return (
    <div className="p-2 space-y-3">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBack}
        className="h-8 px-2 text-xs"
      >
        <ArrowLeft className="w-3 h-3 mr-1" />
        {L('Volver', 'Back')}
      </Button>

      <p className="text-sm font-medium">{category.label}</p>

      <div className="space-y-2">
        {category.questions.map((faq, idx) => (
          <div 
            key={idx}
            className="bg-muted/50 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedQuestion(expandedQuestion === idx ? null : idx)}
              className="w-full flex items-center justify-between p-3 text-left"
            >
              <span className="text-xs font-medium pr-2">{faq.q}</span>
              {expandedQuestion === idx ? (
                <ChevronUp className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
              )}
            </button>
            {expandedQuestion === idx && (
              <div className="px-3 pb-3 pt-0">
                <p className="text-xs text-muted-foreground whitespace-pre-wrap">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border/50 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleWhatsApp}
          className="flex-1 text-xs h-8"
        >
          <MessageCircle className="w-3 h-3 mr-1" />
          WhatsApp
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onAgent}
          className="flex-1 text-xs h-8"
        >
          <Phone className="w-3 h-3 mr-1" />
          {L('Hablar con un agente', 'Talk to a Person')}
        </Button>
      </div>
    </div>
  );
};

export default FAQViewer;
