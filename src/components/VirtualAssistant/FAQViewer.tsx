import { Button } from '@/components/ui/button';
import { FAQ_CATEGORIES } from '@/data/chatFlowData';
import { ArrowLeft, ChevronDown, ChevronUp, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { WHATSAPP_NUMBER } from '@/data/chatFlowData';

interface FAQViewerProps {
  categoryKey?: string;
  onBack: () => void;
  onAgent: () => void;
}

const FAQViewer = ({ categoryKey, onBack, onAgent }: FAQViewerProps) => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hola Nova, tengo una pregunta.');
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
          Volver
        </Button>

        <p className="text-sm font-medium">Selecciona una categoría:</p>

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
        Volver
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
                <ChevronUp className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              )}
            </button>
            {expandedQuestion === idx && (
              <div className="px-3 pb-3 pt-0">
                <p className="text-xs text-muted-foreground">{faq.a}</p>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={onAgent}
                    className="h-7 text-xs flex-1"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Agente
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleWhatsApp}
                    className="h-7 text-xs flex-1"
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQViewer;
