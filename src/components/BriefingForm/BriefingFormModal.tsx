import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Loader2, Check, X } from 'lucide-react';
import { FormData as BriefingFormData, initialFormData, ServiceType } from './types';
import ServiceSelector from './sections/ServiceSelector';
import ContactSection from './sections/ContactSection';
import GeneralSection from './sections/GeneralSection';
import BrandingSection from './sections/BrandingSection';
import WebSection from './sections/WebSection';
import AppsSection from './sections/AppsSection';
import SocialSection from './sections/SocialSection';
import ClosingSection from './sections/ClosingSection';
import { useCart } from '@/contexts/CartContext';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BriefingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedServices?: ServiceType[];
  fromCart?: boolean;
}

const FORMSPREE_URL = 'https://formspree.io/f/mojvgloz';

const BriefingFormModal = ({ 
  open, 
  onOpenChange, 
  preselectedServices = [],
  fromCart = false 
}: BriefingFormModalProps) => {
  const { items } = useCart();
  const [formData, setFormData] = useState<BriefingFormData>({
    ...initialFormData,
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    servicios: preselectedServices,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Calculate cart services
  useEffect(() => {
    if (fromCart && items.length > 0) {
      const cartServiceNames = items.map(item => item.name).join(', ');
      setFormData(prev => ({ ...prev, cart_services: cartServiceNames }));
    }
  }, [fromCart, items]);

  // Set preselected services
  useEffect(() => {
    if (preselectedServices.length > 0) {
      setFormData(prev => ({ ...prev, servicios: preselectedServices }));
    }
  }, [preselectedServices]);

  const handleChange = (name: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Build steps based on selected services
  const buildSteps = () => {
    const steps: { key: string; label: string; component: React.ReactNode }[] = [
      { key: 'services', label: 'Servicios', component: (
        <ServiceSelector 
          selected={formData.servicios} 
          onChange={(services) => handleChange('servicios', services)}
          preselected={preselectedServices}
        />
      )},
      { key: 'contact', label: 'Contacto', component: (
        <ContactSection data={formData} onChange={handleChange} />
      )},
      { key: 'general', label: 'General', component: (
        <GeneralSection data={formData} onChange={handleChange} />
      )},
    ];

    // Add service-specific sections
    if (formData.servicios.includes('branding')) {
      steps.push({ key: 'branding', label: 'Branding', component: (
        <BrandingSection data={formData} onChange={handleChange} />
      )});
    }
    if (formData.servicios.includes('web')) {
      steps.push({ key: 'web', label: 'Web', component: (
        <WebSection data={formData} onChange={handleChange} />
      )});
    }
    if (formData.servicios.includes('apps')) {
      steps.push({ key: 'apps', label: 'Apps', component: (
        <AppsSection data={formData} onChange={handleChange} />
      )});
    }
    if (formData.servicios.includes('rrss')) {
      steps.push({ key: 'rrss', label: 'Redes', component: (
        <SocialSection data={formData} onChange={handleChange} />
      )});
    }

    steps.push({ key: 'closing', label: 'Cierre', component: (
      <ClosingSection data={formData} onChange={handleChange} />
    )});

    return steps;
  };

  const steps = buildSteps();
  const progress = ((currentStep + 1) / steps.length) * 100;

  const canProceed = () => {
    if (currentStep === 0) {
      return formData.servicios.length > 0;
    }
    if (currentStep === 1) {
      return formData.contacto_nombre && formData.contacto_email && formData.contacto_negocio;
    }
    if (steps[currentStep]?.key === 'closing') {
      return formData.privacidad;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!formData.privacidad) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Prepare form data for Formspree
      const submitData = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          submitData.append(key, value.join(', '));
        } else if (typeof value === 'boolean') {
          submitData.append(key, value ? 'Sí' : 'No');
        } else {
          submitData.append(key, value);
        }
      });

      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: submitData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitStatus === 'success') {
      // Reset form on successful submit
      setFormData({ ...initialFormData, servicios: [] });
      setCurrentStep(0);
      setSubmitStatus('idle');
    }
    onOpenChange(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Success screen
  if (submitStatus === 'success') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">¡Formulario enviado!</h2>
            <p className="text-muted-foreground mb-6">
              Gracias por confiar en nosotros. Te contactaremos pronto con un presupuesto personalizado.
            </p>
            <Button onClick={handleClose}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error screen
  if (submitStatus === 'error') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Error al enviar</h2>
            <p className="text-muted-foreground mb-6">
              Ha ocurrido un error. Por favor, inténtalo de nuevo.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose}>Cerrar</Button>
              <Button onClick={() => { setSubmitStatus('idle'); handleSubmit(); }}>
                Reintentar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold">
            Cuéntanos sobre tu proyecto
          </DialogTitle>
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Paso {currentStep + 1} de {steps.length}</span>
              <span>{steps[currentStep]?.label}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-6">
            {steps[currentStep]?.component}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t border-border flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : currentStep === steps.length - 1 ? (
              'Enviar formulario'
            ) : (
              <>
                Siguiente
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BriefingFormModal;
