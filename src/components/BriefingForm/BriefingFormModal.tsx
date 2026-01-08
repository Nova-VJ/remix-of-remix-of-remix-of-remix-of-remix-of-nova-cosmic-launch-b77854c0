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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface BriefingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedServices?: ServiceType[];
  fromCart?: boolean;
}

const FORMSPREE_URL = 'https://formspree.io/f/mojvgloz';

// Helper to generate readable summary
const generateSummary = (data: BriefingFormData): string => {
  const lines: string[] = [];
  
  lines.push('═══════════════════════════════════════');
  lines.push('📋 RESUMEN DEL FORMULARIO DE BRIEFING');
  lines.push('═══════════════════════════════════════');
  
  // CONTACTO
  lines.push('\n📞 DATOS DE CONTACTO');
  lines.push('───────────────────');
  lines.push(`• Nombre: ${data.contacto_nombre || '-'}`);
  lines.push(`• Email: ${data.contacto_email || '-'}`);
  lines.push(`• Teléfono: ${data.contacto_telefono || '-'}`);
  lines.push(`• Negocio: ${data.contacto_negocio || '-'}`);
  lines.push(`• Sector: ${data.contacto_sector || '-'}`);
  lines.push(`• Web actual: ${data.contacto_web || '-'}`);
  lines.push(`• Redes sociales: ${data.contacto_rrss || '-'}`);
  lines.push(`• App actual: ${data.contacto_app || '-'}`);
  
  // SERVICIOS
  const serviciosMap: Record<string, string> = {
    'branding': 'Branding',
    'web': 'Páginas Web',
    'apps': 'Aplicaciones',
    'rrss': 'Redes Sociales'
  };
  const serviciosTexto = data.servicios.map(s => serviciosMap[s] || s).join(', ');
  lines.push('\n🎯 SERVICIOS SELECCIONADOS');
  lines.push('───────────────────');
  lines.push(`• ${serviciosTexto || 'Ninguno'}`);
  if (data.cart_services) {
    lines.push(`• Desde carrito: ${data.cart_services}`);
  }
  
  // GENERAL
  lines.push('\n📊 INFORMACIÓN GENERAL');
  lines.push('───────────────────');
  lines.push(`• Etapa del proyecto: ${data.gen_etapa}${data.gen_etapa_otro ? ` (${data.gen_etapa_otro})` : ''}`);
  lines.push(`• Objetivo principal: ${data.gen_objetivo}${data.gen_objetivo_otro ? ` (${data.gen_objetivo_otro})` : ''}`);
  lines.push(`• Tipo de cliente: ${data.gen_tipo_cliente}${data.gen_tipo_cliente_otro ? ` (${data.gen_tipo_cliente_otro})` : ''}`);
  lines.push(`• Urgencia: ${data.gen_urgencia}${data.gen_urgencia_otro ? ` (${data.gen_urgencia_otro})` : ''}`);
  lines.push(`• Presupuesto: ${data.gen_presupuesto}${data.gen_presupuesto_otro ? ` (${data.gen_presupuesto_otro})` : ''}`);
  lines.push(`• Contenido disponible: ${data.gen_contenido}${data.gen_contenido_otro ? ` (${data.gen_contenido_otro})` : ''}`);
  lines.push(`• Competencia analizada: ${data.gen_competencia}${data.gen_competencia_otro ? ` (${data.gen_competencia_otro})` : ''}`);
  lines.push(`• Canal principal: ${data.gen_canal}${data.gen_canal_otro ? ` (${data.gen_canal_otro})` : ''}`);
  lines.push(`• Prioridad de marca: ${data.gen_prioridad_marca}${data.gen_prioridad_marca_otro ? ` (${data.gen_prioridad_marca_otro})` : ''}`);
  lines.push(`• Siguiente paso deseado: ${data.gen_siguiente_paso}${data.gen_siguiente_paso_otro ? ` (${data.gen_siguiente_paso_otro})` : ''}`);
  
  // BRANDING
  if (data.servicios.includes('branding')) {
    lines.push('\n🎨 BRANDING');
    lines.push('───────────────────');
    lines.push(`• Tipo de trabajo: ${data.branding_tipo}${data.branding_tipo_otro ? ` (${data.branding_tipo_otro})` : ''}`);
    lines.push(`• Urgencia: ${data.branding_urgencia}${data.branding_urgencia_otro ? ` (${data.branding_urgencia_otro})` : ''}`);
    lines.push(`• Estilo visual: ${data.branding_estilo}${data.branding_estilo_otro ? ` (${data.branding_estilo_otro})` : ''}`);
    lines.push(`• Personalidad: ${data.branding_personalidad}${data.branding_personalidad_otro ? ` (${data.branding_personalidad_otro})` : ''}`);
    lines.push(`• Público principal: ${data.branding_publico}${data.branding_publico_otro ? ` (${data.branding_publico_otro})` : ''}`);
    lines.push(`• Diferenciación: ${data.branding_diferenciacion}${data.branding_diferenciacion_otro ? ` (${data.branding_diferenciacion_otro})` : ''}`);
    lines.push(`• Uso principal: ${data.branding_uso}${data.branding_uso_otro ? ` (${data.branding_uso_otro})` : ''}`);
    lines.push(`• Colores preferidos: ${data.branding_colores}${data.branding_colores_otro ? ` (${data.branding_colores_otro})` : ''}`);
    lines.push(`• Entregables: ${data.branding_entregables}${data.branding_entregables_otro ? ` (${data.branding_entregables_otro})` : ''}`);
    lines.push(`• Referencias: ${data.branding_referencias}${data.branding_referencias_otro ? ` (${data.branding_referencias_otro})` : ''}`);
  }
  
  // WEB
  if (data.servicios.includes('web')) {
    lines.push('\n🌐 PÁGINAS WEB');
    lines.push('───────────────────');
    lines.push(`• Tipo de web: ${data.web_tipo}${data.web_tipo_otro ? ` (${data.web_tipo_otro})` : ''}`);
    lines.push(`• Objetivo: ${data.web_objetivo}${data.web_objetivo_otro ? ` (${data.web_objetivo_otro})` : ''}`);
    lines.push(`• Contenidos: ${data.web_contenidos}${data.web_contenidos_otro ? ` (${data.web_contenidos_otro})` : ''}`);
    lines.push(`• Diseño: ${data.web_diseno}${data.web_diseno_otro ? ` (${data.web_diseno_otro})` : ''}`);
    lines.push(`• SEO: ${data.web_seo}${data.web_seo_otro ? ` (${data.web_seo_otro})` : ''}`);
    lines.push(`• Funcionalidad clave: ${data.web_funcion}${data.web_funcion_otro ? ` (${data.web_funcion_otro})` : ''}`);
    lines.push(`• Idiomas: ${data.web_idiomas}${data.web_idiomas_otro ? ` (${data.web_idiomas_otro})` : ''}`);
    lines.push(`• Hosting: ${data.web_hosting}${data.web_hosting_otro ? ` (${data.web_hosting_otro})` : ''}`);
    lines.push(`• Mantenimiento: ${data.web_mantenimiento}${data.web_mantenimiento_otro ? ` (${data.web_mantenimiento_otro})` : ''}`);
    lines.push(`• Urgencia: ${data.web_urgencia}${data.web_urgencia_otro ? ` (${data.web_urgencia_otro})` : ''}`);
  }
  
  // APPS
  if (data.servicios.includes('apps')) {
    lines.push('\n📱 APLICACIONES');
    lines.push('───────────────────');
    lines.push(`• Plataforma: ${data.app_plataforma}${data.app_plataforma_otro ? ` (${data.app_plataforma_otro})` : ''}`);
    lines.push(`• Etapa: ${data.app_etapa}${data.app_etapa_otro ? ` (${data.app_etapa_otro})` : ''}`);
    lines.push(`• Login: ${data.app_login}${data.app_login_otro ? ` (${data.app_login_otro})` : ''}`);
    lines.push(`• Pagos: ${data.app_pagos}${data.app_pagos_otro ? ` (${data.app_pagos_otro})` : ''}`);
    lines.push(`• Panel admin: ${data.app_admin}${data.app_admin_otro ? ` (${data.app_admin_otro})` : ''}`);
    lines.push(`• Notificaciones: ${data.app_notif}${data.app_notif_otro ? ` (${data.app_notif_otro})` : ''}`);
    lines.push(`• Complejidad: ${data.app_complejidad}${data.app_complejidad_otro ? ` (${data.app_complejidad_otro})` : ''}`);
    lines.push(`• Usuarios esperados: ${data.app_usuarios}${data.app_usuarios_otro ? ` (${data.app_usuarios_otro})` : ''}`);
    lines.push(`• Referencias: ${data.app_refs}${data.app_refs_otro ? ` (${data.app_refs_otro})` : ''}`);
    lines.push(`• Mantenimiento: ${data.app_mant}${data.app_mant_otro ? ` (${data.app_mant_otro})` : ''}`);
  }
  
  // RRSS
  if (data.servicios.includes('rrss')) {
    lines.push('\n📲 REDES SOCIALES');
    lines.push('───────────────────');
    lines.push(`• Redes a trabajar: ${data.rrss_redes}${data.rrss_redes_otro ? ` (${data.rrss_redes_otro})` : ''}`);
    lines.push(`• Objetivo: ${data.rrss_objetivo}${data.rrss_objetivo_otro ? ` (${data.rrss_objetivo_otro})` : ''}`);
    lines.push(`• Estado actual: ${data.rrss_estado}${data.rrss_estado_otro ? ` (${data.rrss_estado_otro})` : ''}`);
    lines.push(`• Formato: ${data.rrss_formato}${data.rrss_formato_otro ? ` (${data.rrss_formato_otro})` : ''}`);
    lines.push(`• Frecuencia: ${data.rrss_freq}${data.rrss_freq_otro ? ` (${data.rrss_freq_otro})` : ''}`);
    lines.push(`• Material: ${data.rrss_material}${data.rrss_material_otro ? ` (${data.rrss_material_otro})` : ''}`);
    lines.push(`• Estilo: ${data.rrss_estilo}${data.rrss_estilo_otro ? ` (${data.rrss_estilo_otro})` : ''}`);
    lines.push(`• Ads: ${data.rrss_ads}${data.rrss_ads_otro ? ` (${data.rrss_ads_otro})` : ''}`);
    lines.push(`• Competencia: ${data.rrss_competencia}${data.rrss_competencia_otro ? ` (${data.rrss_competencia_otro})` : ''}`);
    lines.push(`• Entrega: ${data.rrss_entrega}${data.rrss_entrega_otro ? ` (${data.rrss_entrega_otro})` : ''}`);
  }
  
  // NOTAS
  lines.push('\n📝 NOTAS FINALES');
  lines.push('───────────────────');
  lines.push(`• Nota de cierre: ${data.cierre_nota}${data.cierre_nota_otro ? ` - ${data.cierre_nota_otro}` : ''}`);
  
  lines.push('\n═══════════════════════════════════════');
  
  return lines.join('\n');
};

const BriefingFormModal = ({ 
  open, 
  onOpenChange, 
  preselectedServices = [],
  fromCart = false 
}: BriefingFormModalProps) => {
  const { items, addItem } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState<BriefingFormData>({
    ...initialFormData,
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    servicios: preselectedServices,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Pre-fill user data if logged in
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        // First set email from auth user
        setFormData(prev => ({
          ...prev,
          contacto_email: user.email || prev.contacto_email,
          contacto_nombre: user.user_metadata?.full_name || prev.contacto_nombre,
        }));
        
        // Then fetch profile for additional data
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email, phone, business_name, sector, website, social_media, has_app')
          .eq('user_id', user.id)
          .single();
        
        if (profile) {
          setFormData(prev => ({
            ...prev,
            contacto_nombre: profile.full_name || prev.contacto_nombre,
            contacto_email: profile.email || user.email || prev.contacto_email,
            contacto_telefono: profile.phone || prev.contacto_telefono,
            contacto_negocio: profile.business_name || prev.contacto_negocio,
            contacto_sector: profile.sector || prev.contacto_sector,
            contacto_web: profile.website || prev.contacto_web,
            contacto_rrss: profile.social_media || prev.contacto_rrss,
            contacto_app: profile.has_app || prev.contacto_app,
          }));
        }
      }
    };
    
    if (open && user) {
      fetchUserProfile();
    }
  }, [user, open]);

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
      // Save profile data if user is logged in
      if (user) {
        await supabase
          .from('profiles')
          .update({
            phone: formData.contacto_telefono || null,
            business_name: formData.contacto_negocio || null,
            sector: formData.contacto_sector || null,
            website: formData.contacto_web || null,
            social_media: formData.contacto_rrss || null,
            has_app: formData.contacto_app || null,
          })
          .eq('user_id', user.id);
      }

      // Generate readable summary
      const resumen = generateSummary(formData);
      
      // Prepare form data for Formspree
      const submitData = new FormData();
      
      // Add summary as first field for readability
      submitData.append('resumen_formulario', resumen);
      
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
        
        // If from cart, add briefing to cart
        if (fromCart) {
          const briefingItem = {
            id: 'briefing-completed',
            name: 'Formulario de briefing completado',
            price: 0,
            type: 'service' as const,
          };
          // Only add if not already in cart
          if (!items.some(item => item.id === 'briefing-completed')) {
            addItem(briefingItem);
          }
        }
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
