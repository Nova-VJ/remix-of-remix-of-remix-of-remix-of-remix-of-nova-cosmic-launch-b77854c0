import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles } from 'lucide-react';
import BriefingFormModal from './BriefingForm/BriefingFormModal';

const BriefingCTASection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section id="formulario" className="py-16 sm:py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Presupuesto personalizado</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              ¿Nos cuentas sobre tu proyecto?
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Responde este formulario en 2 minutos y podremos enviarte un presupuesto más preciso y adaptado a tus necesidades.
            </p>
            
            <Button 
              size="lg" 
              onClick={() => setIsModalOpen(true)}
              className="gap-2 text-base px-8 py-6"
            >
              <FileText className="w-5 h-5" />
              Completar formulario
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              Sin compromiso · Respuesta en 24h
            </p>
          </div>
        </div>
      </section>

      <BriefingFormModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  );
};

export default BriefingCTASection;
