import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, User, Mail, Phone, Building, Send } from 'lucide-react';
import ContentSection, { ContentFormData } from './BriefingForm/sections/ContentSection';

interface ContentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ContactInfo {
  full_name: string;
  email: string;
  phone: string;
  business_name: string;
}

const ContentFormModal = ({ isOpen, onClose }: ContentFormModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    full_name: '',
    email: '',
    phone: '',
    business_name: '',
  });
  const [contentData, setContentData] = useState<ContentFormData>({
    platforms: [],
    goal: '',
    service_type: '',
    style: [],
    details: '',
    links: '',
    budget: '',
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Auto-fill from profile if logged in
  useEffect(() => {
    if (user && isOpen) {
      fetchProfile();
    }
  }, [user, isOpen]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email, phone, business_name')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profile) {
      setContactInfo({
        full_name: profile.full_name || '',
        email: profile.email || user.email || '',
        phone: profile.phone || '',
        business_name: profile.business_name || '',
      });
    } else {
      setContactInfo((prev) => ({
        ...prev,
        email: user.email || '',
      }));
    }
  };

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (field: keyof ContentFormData, value: string | string[]) => {
    setContentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!contactInfo.full_name || !contactInfo.email) {
      toast.error('Por favor completa nombre y email');
      return;
    }

    if (!contentData.platforms.length || !contentData.goal || !contentData.service_type) {
      toast.error('Por favor completa los campos requeridos del servicio');
      return;
    }

    if (!privacyAccepted) {
      toast.error('Debes aceptar la política de privacidad');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('content_requests').insert({
        user_id: user?.id || null,
        full_name: contactInfo.full_name,
        email: contactInfo.email,
        phone: contactInfo.phone || null,
        business_name: contactInfo.business_name || null,
        platforms: contentData.platforms,
        goal: contentData.goal,
        service_type: contentData.service_type,
        style: contentData.style,
        details: contentData.details || null,
        links: contentData.links || null,
        budget: contentData.budget || null,
      });

      if (error) throw error;

      toast.success('¡Solicitud enviada! Te contactamos en menos de 24h.');
      onClose();
      // Reset form
      setStep(1);
      setContentData({
        platforms: [],
        goal: '',
        service_type: '',
        style: [],
        details: '',
        links: '',
        budget: '',
      });
    } catch (error) {
      console.error('Error submitting content request:', error);
      toast.error('Error al enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            {step === 1 ? 'Información de contacto' : 'Detalles del contenido'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          {step === 1 ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nombre completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="full_name"
                    value={contactInfo.full_name}
                    onChange={(e) => handleContactChange('full_name', e.target.value)}
                    placeholder="Tu nombre"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    placeholder="tu@email.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    placeholder="+34 600 000 000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_name">Negocio / Proyecto</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="business_name"
                    value={contactInfo.business_name}
                    onChange={(e) => handleContactChange('business_name', e.target.value)}
                    placeholder="Tu empresa o proyecto"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button onClick={() => setStep(2)} className="w-full mt-4">
                Siguiente
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <ContentSection formData={contentData} onChange={handleContentChange} />

              {/* Privacy checkbox */}
              <div className="flex items-start gap-2 pt-4 border-t border-border">
                <Checkbox
                  id="privacy"
                  checked={privacyAccepted}
                  onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                />
                <Label htmlFor="privacy" className="text-xs text-muted-foreground cursor-pointer">
                  Acepto la{' '}
                  <a href="/politica-de-privacidad" target="_blank" className="text-primary underline">
                    política de privacidad
                  </a>
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Atrás
                </Button>
                <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar solicitud
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentFormModal;