import { Button } from '@/components/ui/button';
import { SERVICES_DATA } from '@/data/chatFlowData';
import { ArrowLeft, MessageCircle, Clock, Check } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/data/chatFlowData';
import { L } from '@/i18n';

interface ServicePackViewerProps {
  serviceKey: keyof typeof SERVICES_DATA;
  packId?: string;
  onBack: () => void;
  onRequestQuote: (packName: string) => void;
}

const ServicePackViewer = ({ 
  serviceKey, 
  packId, 
  onBack, 
  onRequestQuote 
}: ServicePackViewerProps) => {
  const service = SERVICES_DATA[serviceKey];
  const pack = packId ? service.packs.find(p => p.id === packId) : null;

  const handleWhatsApp = (packName: string) => {
    const message = encodeURIComponent(
      L(
        `Hola Nova, me interesa el ${packName}. Me gustaría recibir más información.`,
        `Hi Nova, I am interested in the ${packName}. I would like more information.`
      )
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
          {L('Volver', 'Back')}
        </Button>

        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold text-sm text-primary">{pack.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{pack.copy}</p>
          
          <div className="mt-3 space-y-1">
            <p className="text-xs font-medium">{L('Incluye:', 'Includes:')}</p>
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
              <span>{L('Plazo:', 'Timeline:')} {pack.timeline as string}</span>
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
            {L('Quiero presupuesto', 'Get a Quote')}
          </Button>
          <Button 
            variant="secondary"
            onClick={() => handleWhatsApp(pack.name)}
            className="h-10 text-sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {L('Consultar por WhatsApp', 'Ask via WhatsApp')}
          </Button>
        </div>
      </div>
    );
  }

  // Show list of packs for this service
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

      <p className="text-sm font-medium">{service.title}</p>

      <div className="space-y-2">
        {service.packs.map((p) => (
          <div 
            key={p.id}
            onClick={() => onRequestQuote(p.id)}
            className="bg-muted/50 hover:bg-muted p-3 rounded-lg cursor-pointer transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-xs text-foreground">{p.name}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{p.copy}</p>
              </div>
              <span className="text-xs font-bold text-primary shrink-0 ml-2">{p.price}</span>
            </div>
            {'timeline' in p && p.timeline && (
              <span className="inline-block mt-2 text-[10px] text-muted-foreground bg-background/50 px-2 py-0.5 rounded">
                ⏱ {p.timeline as string}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicePackViewer;
