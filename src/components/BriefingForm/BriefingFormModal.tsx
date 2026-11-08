import { useState, useEffect } from 'react';
import { trackLead } from '@/lib/tracking';
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
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { L } from '@/i18n';

interface BriefingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedServices?: ServiceType[];
  fromCart?: boolean;
}

// Each site sends its form to its own inbox. Formspree decides the destination address:
// Spain → form mojvgloz; USA → the form linked to info@novasolutionsmkt.com (VITE_FORMSPREE_URL_EN).
const FORMSPREE_URL = L('https://formspree.io/f/mojvgloz', import.meta.env.VITE_FORMSPREE_URL_EN || 'https://formspree.io/f/mojvgloz');

// Helper to generate readable summary
const generateSummary = (data: BriefingFormData): string => {
  const lines: string[] = [];
  
  lines.push('═══════════════════════════════════════');
  lines.push(L('📋 RESUMEN DEL FORMULARIO DE BRIEFING', '📋 PROJECT BRIEFING SUMMARY'));
  lines.push('═══════════════════════════════════════');
  
  // CONTACTO
  lines.push(L('\n📞 DATOS DE CONTACTO', '\n📞 CONTACT DETAILS'));
  lines.push('───────────────────');
  lines.push(`${L('• Nombre', '• Name')}: ${data.contacto_nombre || '-'}`);
  lines.push(`${L('• Email', '• Email')}: ${data.contacto_email || '-'}`);
  lines.push(`${L('• Teléfono', '• Phone')}: ${data.contacto_telefono || '-'}`);
  lines.push(`${L('• Negocio', '• Business')}: ${data.contacto_negocio || '-'}`);
  lines.push(`${L('• Sector', '• Industry')}: ${data.contacto_sector || '-'}`);
  lines.push(`${L('• Web actual', '• Current Website')}: ${data.contacto_web || '-'}`);
  lines.push(`${L('• Redes sociales', '• Social Media')}: ${data.contacto_rrss || '-'}`);
  lines.push(`${L('• App actual', '• Current App')}: ${data.contacto_app || '-'}`);
  
  // SERVICIOS
  const serviciosMap: Record<string, string> = {
    'branding': 'Branding',
    'web': L('Páginas Web', 'Websites'),
    'apps': L('Aplicaciones', 'Applications'),
    'rrss': L('Redes Sociales', 'Social Media'),
    'content': L('Elaboración de Contenido', 'Content Creation'),
  };
  const serviciosTexto = data.servicios.map(s => serviciosMap[s] || s).join(', ');
  lines.push(L('\n🎯 SERVICIOS SELECCIONADOS', '\n🎯 SELECTED SERVICES'));
  lines.push('───────────────────');
  lines.push(`• ${serviciosTexto || L('Ninguno', 'None')}`);
  if (data.cart_services) {
    lines.push(`• ${L('Desde carrito', 'From cart')}: ${data.cart_services}`);
  }
  
  // GENERAL
  lines.push(L('\n📊 INFORMACIÓN GENERAL', '\n📊 GENERAL OVERVIEW'));
  lines.push('───────────────────');
  lines.push(`• ${L('Etapa del proyecto', 'Project stage')}: ${data.gen_etapa}${data.gen_etapa_otro ? ` (${data.gen_etapa_otro})` : ''}`);
  lines.push(`• ${L('Objetivo principal', 'Primary objective')}: ${data.gen_objetivo}${data.gen_objetivo_otro ? ` (${data.gen_objetivo_otro})` : ''}`);
  lines.push(`• ${L('Tipo de cliente', 'Target customer')}: ${data.gen_tipo_cliente}${data.gen_tipo_cliente_otro ? ` (${data.gen_tipo_cliente_otro})` : ''}`);
  lines.push(`• ${L('Urgencia', 'Timeline')}: ${data.gen_urgencia}${data.gen_urgencia_otro ? ` (${data.gen_urgencia_otro})` : ''}`);
  lines.push(`• ${L('Presupuesto', 'Budget range')}: ${data.gen_presupuesto}${data.gen_presupuesto_otro ? ` (${data.gen_presupuesto_otro})` : ''}`);
  lines.push(`• ${L('Contenido disponible', 'Content ready')}: ${data.gen_contenido}${data.gen_contenido_otro ? ` (${data.gen_contenido_otro})` : ''}`);
  lines.push(`• ${L('Competencia analizada', 'Competitor analysis')}: ${data.gen_competencia}${data.gen_competencia_otro ? ` (${data.gen_competencia_otro})` : ''}`);
  lines.push(`• ${L('Canal principal', 'Primary channel')}: ${data.gen_canal}${data.gen_canal_otro ? ` (${data.gen_canal_otro})` : ''}`);
  lines.push(`• ${L('Prioridad de marca', 'Brand priority')}: ${data.gen_prioridad_marca}${data.gen_prioridad_marca_otro ? ` (${data.gen_prioridad_marca_otro})` : ''}`);
  lines.push(`• ${L('Siguiente paso deseado', 'Preferred next step')}: ${data.gen_siguiente_paso}${data.gen_siguiente_paso_otro ? ` (${data.gen_siguiente_paso_otro})` : ''}`);
  
  // BRANDING
  if (data.servicios.includes('branding')) {
    lines.push(L('\n🎨 BRANDING', '\n🎨 BRANDING'));
    lines.push('───────────────────');
    lines.push(`• ${L('Tipo de trabajo', 'Project type')}: ${data.branding_tipo}${data.branding_tipo_otro ? ` (${data.branding_tipo_otro})` : ''}`);
    lines.push(`• ${L('Urgencia', 'Timeline')}: ${data.branding_urgencia}${data.branding_urgencia_otro ? ` (${data.branding_urgencia_otro})` : ''}`);
    lines.push(`• ${L('Estilo visual', 'Aesthetic')}: ${data.branding_estilo}${data.branding_estilo_otro ? ` (${data.branding_estilo_otro})` : ''}`);
    lines.push(`• ${L('Personalidad', 'Tone & voice')}: ${data.branding_personalidad}${data.branding_personalidad_otro ? ` (${data.branding_personalidad_otro})` : ''}`);
    lines.push(`• ${L('Público principal', 'Audience')}: ${data.branding_publico}${data.branding_publico_otro ? ` (${data.branding_publico_otro})` : ''}`);
    lines.push(`• ${L('Diferenciación', 'Differentiator')}: ${data.branding_diferenciacion}${data.branding_diferenciacion_otro ? ` (${data.branding_diferenciacion_otro})` : ''}`);
    lines.push(`• ${L('Uso principal', 'Primary use')}: ${data.branding_uso}${data.branding_uso_otro ? ` (${data.branding_uso_otro})` : ''}`);
    lines.push(`• ${L('Colores preferidos', 'Preferred colors')}: ${data.branding_colores}${data.branding_colores_otro ? ` (${data.branding_colores_otro})` : ''}`);
    lines.push(`• ${L('Entregables', 'Deliverables')}: ${data.branding_entregables}${data.branding_entregables_otro ? ` (${data.branding_entregables_otro})` : ''}`);
    lines.push(`• ${L('Referencias', 'References')}: ${data.branding_referencias}${data.branding_referencias_otro ? ` (${data.branding_referencias_otro})` : ''}`);
  }
  
  // WEB
  if (data.servicios.includes('web')) {
    lines.push(L('\n🌐 PÁGINAS WEB', '\n🌐 WEBSITES'));
    lines.push('───────────────────');
    lines.push(`• ${L('Tipo de web', 'Website type')}: ${data.web_tipo}${data.web_tipo_otro ? ` (${data.web_tipo_otro})` : ''}`);
    lines.push(`• ${L('Objetivo', 'Objective')}: ${data.web_objetivo}${data.web_objetivo_otro ? ` (${data.web_objetivo_otro})` : ''}`);
    lines.push(`• ${L('Contenidos', 'Content ready')}: ${data.web_contenidos}${data.web_contenidos_otro ? ` (${data.web_contenidos_otro})` : ''}`);
    lines.push(`• ${L('Diseño', 'Design preference')}: ${data.web_diseno}${data.web_diseno_otro ? ` (${data.web_diseno_otro})` : ''}`);
    lines.push(`• ${L('SEO', 'SEO priority')}: ${data.web_seo}${data.web_seo_otro ? ` (${data.web_seo_otro})` : ''}`);
    lines.push(`• ${L('Funcionalidad clave', 'Core feature')}: ${data.web_funcion}${data.web_funcion_otro ? ` (${data.web_funcion_otro})` : ''}`);
    lines.push(`• ${L('Idiomas', 'Languages')}: ${data.web_idiomas}${data.web_idiomas_otro ? ` (${data.web_idiomas_otro})` : ''}`);
    lines.push(`• ${L('Hosting', 'Hosting & domain')}: ${data.web_hosting}${data.web_hosting_otro ? ` (${data.web_hosting_otro})` : ''}`);
    lines.push(`• ${L('Mantenimiento', 'Maintenance')}: ${data.web_mantenimiento}${data.web_mantenimiento_otro ? ` (${data.web_mantenimiento_otro})` : ''}`);
    lines.push(`• ${L('Urgencia', 'Timeline')}: ${data.web_urgencia}${data.web_urgencia_otro ? ` (${data.web_urgencia_otro})` : ''}`);
  }
  
  // APPS
  if (data.servicios.includes('apps')) {
    lines.push(L('\n📱 APLICACIONES', '\n📱 APPLICATIONS'));
    lines.push('───────────────────');
    lines.push(`• ${L('Plataforma', 'Platform')}: ${data.app_plataforma}${data.app_plataforma_otro ? ` (${data.app_plataforma_otro})` : ''}`);
    lines.push(`• ${L('Etapa', 'Stage')}: ${data.app_etapa}${data.app_etapa_otro ? ` (${data.app_etapa_otro})` : ''}`);
    lines.push(`• ${L('Login', 'Authentication')}: ${data.app_login}${data.app_login_otro ? ` (${data.app_login_otro})` : ''}`);
    lines.push(`• ${L('Pagos', 'Payments')}: ${data.app_pagos}${data.app_pagos_otro ? ` (${data.app_pagos_otro})` : ''}`);
    lines.push(`• ${L('Panel admin', 'Admin panel')}: ${data.app_admin}${data.app_admin_otro ? ` (${data.app_admin_otro})` : ''}`);
    lines.push(`• ${L('Notificaciones', 'Notifications')}: ${data.app_notif}${data.app_notif_otro ? ` (${data.app_notif_otro})` : ''}`);
    lines.push(`• ${L('Complejidad', 'Complexity')}: ${data.app_complejidad}${data.app_complejidad_otro ? ` (${data.app_complejidad_otro})` : ''}`);
    lines.push(`• ${L('Usuarios esperados', 'Expected users')}: ${data.app_usuarios}${data.app_usuarios_otro ? ` (${data.app_usuarios_otro})` : ''}`);
    lines.push(`• ${L('Referencias', 'References')}: ${data.app_refs}${data.app_refs_otro ? ` (${data.app_refs_otro})` : ''}`);
    lines.push(`• ${L('Mantenimiento', 'Maintenance')}: ${data.app_mant}${data.app_mant_otro ? ` (${data.app_mant_otro})` : ''}`);
  }
  
  // RRSS
  if (data.servicios.includes('rrss')) {
    lines.push(L('\n📲 REDES SOCIALES', '\n📲 SOCIAL MEDIA'));
    lines.push('───────────────────');
    lines.push(`• ${L('Redes a trabajar', 'Channels')}: ${data.rrss_redes}${data.rrss_redes_otro ? ` (${data.rrss_redes_otro})` : ''}`);
    lines.push(`• ${L('Objetivo', 'Objective')}: ${data.rrss_objetivo}${data.rrss_objetivo_otro ? ` (${data.rrss_objetivo_otro})` : ''}`);
    lines.push(`• ${L('Estado actual', 'Current status')}: ${data.rrss_estado}${data.rrss_estado_otro ? ` (${data.rrss_estado_otro})` : ''}`);
    lines.push(`• ${L('Formato', 'Formats')}: ${data.rrss_formato}${data.rrss_formato_otro ? ` (${data.rrss_formato_otro})` : ''}`);
    lines.push(`• ${L('Frecuencia', 'Frequency')}: ${data.rrss_freq}${data.rrss_freq_otro ? ` (${data.rrss_freq_otro})` : ''}`);
    lines.push(`• ${L('Material', 'Assets')}: ${data.rrss_material}${data.rrss_material_otro ? ` (${data.rrss_material_otro})` : ''}`);
    lines.push(`• ${L('Estilo', 'Tone/Style')}: ${data.rrss_estilo}${data.rrss_estilo_otro ? ` (${data.rrss_estilo_otro})` : ''}`);
    lines.push(`• ${L('Ads', 'Paid Ads')}: ${data.rrss_ads}${data.rrss_ads_otro ? ` (${data.rrss_ads_otro})` : ''}`);
    lines.push(`• ${L('Competencia', 'Competitors')}: ${data.rrss_competencia}${data.rrss_competencia_otro ? ` (${data.rrss_competencia_otro})` : ''}`);
    lines.push(`• ${L('Entrega', 'Scope')}: ${data.rrss_entrega}${data.rrss_entrega_otro ? ` (${data.rrss_entrega_otro})` : ''}`);
  }
  
  // NOTAS
  lines.push(L('\n📝 NOTAS FINALES', '\n📝 FINAL NOTES'));
  lines.push('───────────────────');
  lines.push(`• ${L('Nota de cierre', 'Closing remarks')}: ${data.cierre_nota}${data.cierre_nota_otro ? ` - ${data.cierre_nota_otro}` : ''}`);
  
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
      { key: 'services', label: L('Servicios', 'Services'), component: (
        <ServiceSelector 
          selected={formData.servicios} 
          onChange={(services) => handleChange('servicios', services)}
          preselected={preselectedServices}
        />
      )},
      { key: 'contact', label: L('Contacto', 'Contact'), component: (
        <ContactSection data={formData} onChange={handleChange} />
      )},
      { key: 'general', label: L('General', 'Overview'), component: (
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
      steps.push({ key: 'web', label: L('Web', 'Websites'), component: (
        <WebSection data={formData} onChange={handleChange} />
      )});
    }
    if (formData.servicios.includes('apps')) {
      steps.push({ key: 'apps', label: 'Apps', component: (
        <AppsSection data={formData} onChange={handleChange} />
      )});
    }
    if (formData.servicios.includes('rrss')) {
      steps.push({ key: 'rrss', label: L('Redes', 'Social'), component: (
        <SocialSection data={formData} onChange={handleChange} />
      )});
    }

    steps.push({ key: 'closing', label: L('Cierre', 'Submit'), component: (
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
      return Boolean(formData.contacto_nombre && formData.contacto_email && formData.contacto_negocio);
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

      // Keep a copy in the admin panel (Leads tab). Best effort: never blocks the visitor
      supabase
        .from('leads')
        .insert([{
          name: formData.contacto_nombre || 'Sin nombre',
          email: formData.contacto_email,
          phone: formData.contacto_telefono || null,
          service_type: formData.servicios.join(', ') || 'Formulario de presupuesto',
          business_type: formData.contacto_sector || formData.contacto_negocio || null,
          budget_range: formData.gen_presupuesto || null,
          urgency: 'normal',
          message: resumen.slice(0, 4000),
          source: L('formulario_presupuesto', 'quote_form_usa'),
        }])
        .then(({ error }) => {
          if (error) console.warn('Lead copy not saved:', error.message);
        });
      
      // Prepare form data for Formspree
      const submitData = new FormData();
      
      // Add summary as first field for readability
      submitData.append('resumen_formulario', resumen);
      submitData.append('enviado_desde', typeof window !== 'undefined' ? window.location.hostname : 'novasolutions');
      submitData.append('_replyto', contact.email || '');
      submitData.append('_to', isEn ? 'info@novasolutionsmkt.com' : 'info@solutionsnova.es');
      submitData.append('_subject', isEn ? `[novasolutionsmkt.com] New Quote Request from ${contact.name}` : `[solutionsnova.es] Solicitud de Presupuesto - ${contact.name}`);
      submitData.append('email_destino', isEn ? 'info@novasolutionsmkt.com' : 'info@solutionsnova.es');
      
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
        trackLead('formulario_presupuesto');
        
        // If from cart, add briefing to cart
        if (fromCart) {
          const briefingItem = {
            id: 'briefing-completed',
            name: L('Formulario de briefing completado', 'Project Briefing Completed'),
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
            <h2 className="text-xl font-bold text-foreground mb-2">
              {L('¡Formulario enviado!', 'Form Submitted!')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {L(
                'Gracias por confiar en nosotros. Te contactaremos pronto con un presupuesto personalizado.',
                'Thank you for reaching out! Our team will review your project details and get back to you with a custom proposal.'
              )}
            </p>
            <Button onClick={handleClose}>{L('Cerrar', 'Close')}</Button>
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
            <h2 className="text-xl font-bold text-foreground mb-2">
              {L('Error al enviar', 'Submission Failed')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {L('Ha ocurrido un error. Por favor, inténtalo de nuevo.', 'An unexpected error occurred. Please try again.')}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose}>
                {L('Cerrar', 'Close')}
              </Button>
              <Button onClick={() => { setSubmitStatus('idle'); handleSubmit(); }}>
                {L('Reintentar', 'Retry')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold">
            {L('Cuéntanos sobre tu proyecto', 'Tell Us About Your Project')}
          </DialogTitle>
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {L(`Paso ${currentStep + 1} de ${steps.length}`, `Step ${currentStep + 1} of ${steps.length}`)}
              </span>
              <span>{steps[currentStep]?.label}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="py-6 min-h-0">
            {steps[currentStep]?.component}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {L('Anterior', 'Previous')}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {L('Enviando...', 'Submitting...')}
              </>
            ) : currentStep === steps.length - 1 ? (
              L('Enviar formulario', 'Submit Request')
            ) : (
              <>
                {L('Siguiente', 'Next')}
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
