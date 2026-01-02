import { Button } from '@/components/ui/button';
import { SERVICES_DATA } from '@/data/chatFlowData';
import { ArrowLeft, Calendar, MessageCircle, Clock, Check } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/data/chatFlowData';

interface ServicePackViewerProps {
  serviceKey: keyof typeof SERVICES_DATA;
  packId?: string;
  onBack: () => void;
  onRequestQuote: (packName: string) => void;
  onSchedule: () => void;
}

const ServicePackViewer = ({ 
  serviceKey, 
  packId, 
  onBack, 
  onRequestQuote,
  onSchedule 
}: ServicePackViewerProps) => {
  const service = SERVICES_DATA[serviceKey];
  const pack = packId ? service.packs.find(p => p.id === packId) : null;

  const handleWhatsApp = (packName: string) => {
    const message = encodeURIComponent(
      `Hola Nova, me interesa el ${packName}. Me gustaría recibir más información.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  if (pack) {
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

        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold text-sm text-primary">{pack.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{pack.copy}</p>
          
          <div className="mt-3 space-y-1">
            <p className="text-xs font-medium">Incluye:</p>
            {pack.includes.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {'timeline' in pack && pack.timeline && (
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Plazo: {pack.timeline as string}</span>
            </div>
          )}

          <p className="mt-3 text-lg font-bold text-primary">{pack.price}</p>
          
          {'note' in pack && pack.note && (
            <p className="text-xs text-muted-foreground mt-1 italic">{pack.note as string}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button 
            onClick={() => onRequestQuote(pack.name)}
            className="h-10 text-sm"
          >
            Quiero presupuesto
          </Button>
          <Button 
            variant="outline" 
            onClick={onSchedule}
            className="h-10 text-sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Agendar cita
          </Button>
          <Button 
            variant="secondary"
            onClick={() => handleWhatsApp(pack.name)}
            className="h-10 text-sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </div>
      </div>
    );
  }

  // Show all packs for this service
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

      <h3 className="font-semibold text-sm">{service.title}</h3>

      <div className="space-y-2">
        {service.packs.map((pack) => (
          <div 
            key={pack.id}
            className="bg-muted/50 rounded-lg p-3 cursor-pointer hover:bg-muted transition-colors"
            onClick={() => onRequestQuote(pack.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-sm">{pack.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{pack.copy}</p>
              </div>
              <span className="text-xs font-semibold text-primary whitespace-nowrap ml-2">
                {pack.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicePackViewer;
