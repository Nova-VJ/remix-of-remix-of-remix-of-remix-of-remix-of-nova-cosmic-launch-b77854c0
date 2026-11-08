import { useState } from 'react';
import { X, CheckCircle, Sparkles, ArrowRight, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { L, isEn } from '@/i18n';
import { GROWTH_BENEFITS, GrowthBenefit } from '@/data/growthBenefits';

interface BenefitFinderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FORMSPREE_URL = L(
  'https://formspree.io/f/mojvgloz',
  import.meta.env.VITE_FORMSPREE_URL_EN || 'https://formspree.io/f/mojvgloz'
);

const BenefitFinderModal = ({ open, onOpenChange }: BenefitFinderModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [country, setCountry] = useState<'US' | 'ES'>(isEn ? 'US' : 'ES');
  const [businessType, setBusinessType] = useState('local');
  const [age, setAge] = useState('new');
  const [goal, setGoal] = useState('clients');
  const [budget, setBudget] = useState('moderate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [matchedBenefits, setMatchedBenefits] = useState<GrowthBenefit[]>([]);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);

    // Calculate matched benefits based on answers
    const filtered = GROWTH_BENEFITS.filter((b) => {
      // Country match
      if (b.country !== 'ALL' && b.country !== country) return false;

      // Business type filtering
      if (businessType === 'nonprofit') return b.category === 'nonprofit' || b.category === 'tools';
      if (businessType === 'startup') return b.category === 'cloud' || b.category === 'ads' || b.category === 'tools';
      if (businessType === 'ecommerce') return b.category === 'ecommerce' || b.category === 'ads' || b.category === 'tools';
      if (businessType === 'local') return b.id === 'google-ads' || b.id === 'apple-maps-ads' || b.id === 'google-business-profile' || b.id === 'microsoft-clarity';

      return true;
    }).slice(0, 5);

    setMatchedBenefits(filtered);

    // Send lead to database and email
    const summaryText = `[DIAGNÓSTICO NOVA GROWTH BENEFITS]
País: ${country}
Tipo de negocio: ${businessType}
Antigüedad: ${age}
Objetivo: ${goal}
Presupuesto mensual estimado: ${budget}
Nombre: ${name}
Email: ${email}
Teléfono: ${phone || 'No especificado'}
Beneficios preliminares sugeridos: ${filtered.map((b) => b.platform).join(', ')}`;

    try {
      // 1. Supabase copy
      supabase
        .from('leads')
        .insert([{
          name,
          email,
          phone: phone || null,
          business_type: businessType,
          goal,
          message: summaryText,
          source: isEn ? 'growth_benefits_finder_us' : 'growth_benefits_finder_es',
        }])
        .then(() => {});

      // 2. Formspree email
      const formData = new FormData();
      formData.append('servicio', 'NOVA Growth Benefits Finder');
      formData.append('resumen', summaryText);
      formData.append('pais', country);
      formData.append('tipo_negocio', businessType);
      formData.append('nombre', name);
      formData.append('email', email);
      formData.append('telefono', phone);
      formData.append('_replyto', email);
      formData.append('_to', isEn ? 'info@novasolutionsmkt.com' : 'info@solutionsnova.es');
      formData.append(
        '_subject',
        isEn
          ? `[NOVA US] Benefit Finder Inquiry from ${name}`
          : `[NOVA ES] Diagnóstico Growth Benefits - ${name}`
      );

      fetch(FORMSPREE_URL, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      }).catch(() => {});
    } catch {
      // Non-blocking
    } finally {
      setIsSubmitting(false);
      setStep('results');
    }
  };

  const handleReset = () => {
    setStep('form');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-background/98 backdrop-blur-xl border-border/80">
        <DialogHeader className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            NOVA Growth Benefits Finder
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
            {step === 'form'
              ? L('Descubre qué ventajas podría conseguir tu negocio', 'Find Out What Your Business May Qualify For')
              : L('Tu diagnóstico preliminar de ventajas', 'Your Preliminary Benefits Match')}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {step === 'form'
              ? L(
                  'Analizamos promociones publicitarias oficiales, herramientas gratuitas y programas tecnológicos aplicables a tu caso.',
                  'We scan official advertising promotional credits, free business tools, and technology programs tailored to your profile.'
                )
              : L(
                  'Hemos identificado las siguientes oportunidades potenciales. NOVA te ayuda a revisar requisitos y activarlas.',
                  'We identified the following potential opportunities. NOVA helps you audit requirements and claim them seamlessly.'
                )}
          </DialogDescription>
        </DialogHeader>

        {step === 'form' ? (
          <form onSubmit={handleDiagnose} className="space-y-4 pt-2">
            {/* Country Selector */}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {L('1. ¿Dónde opera tu negocio?', '1. Where is your business based?')}
              </Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <Button
                  type="button"
                  variant={country === 'US' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCountry('US')}
                  className="h-10 text-sm justify-start px-3"
                >
                  🇺🇸 United States
                </Button>
                <Button
                  type="button"
                  variant={country === 'ES' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCountry('ES')}
                  className="h-10 text-sm justify-start px-3"
                >
                  🇪🇸 España
                </Button>
              </div>
            </div>

            {/* Business Type */}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {L('2. Tipo de negocio', '2. Business Type')}
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                {[
                  { id: 'local', es: 'Comercio local / Restaurante', en: 'Local Business / Restaurant' },
                  { id: 'ecommerce', es: 'Tienda Online / E-commerce', en: 'Online Store / E-commerce' },
                  { id: 'services', es: 'Servicios Profesionales / B2B', en: 'Professional Services / B2B' },
                  { id: 'startup', es: 'Startup Tecnológica / SaaS', en: 'Tech Startup / SaaS' },
                  { id: 'nonprofit', es: 'Organización sin ánimo de lucro', en: 'Nonprofit / Foundation' },
                ].map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    variant={businessType === item.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBusinessType(item.id)}
                    className="h-9 text-xs justify-start px-3"
                  >
                    {isEn ? item.en : item.es}
                  </Button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {L('3. Principal objetivo digital', '3. Primary Digital Goal')}
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1.5">
                {[
                  { id: 'clients', es: 'Conseguir más clientes', en: 'Acquire New Clients' },
                  { id: 'ads', es: 'Empezar publicidad con créditos', en: 'Start Paid Ads with Credits' },
                  { id: 'ecommerce', es: 'Vender productos online', en: 'Sell Products Online' },
                  { id: 'software', es: 'Crear app o software a medida', en: 'Build Custom App / Software' },
                  { id: 'savings', es: 'Ahorro en herramientas', en: 'Cut Software & Tool Costs' },
                  { id: 'all', es: 'Renovación completa', en: 'Full Digital Transformation' },
                ].map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    variant={goal === item.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGoal(item.id)}
                    className="h-9 text-xs justify-start px-3"
                  >
                    {isEn ? item.en : item.es}
                  </Button>
                ))}
              </div>
            </div>

            {/* Contact Inputs */}
            <div className="pt-2 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="benefit-name" className="text-xs">
                  {L('Tu Nombre *', 'Your Name *')}
                </Label>
                <Input
                  id="benefit-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={L('Nombre y apellidos', 'Full name')}
                  className="h-9 text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="benefit-email" className="text-xs">
                  {L('Tu Email *', 'Your Email *')}
                </Label>
                <Input
                  id="benefit-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-9 text-sm mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="benefit-phone" className="text-xs">
                  {L('WhatsApp / Teléfono (opcional para recibir diagnóstico)', 'WhatsApp / Phone (optional for quick brief)')}
                </Label>
                <Input
                  id="benefit-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={isEn ? "+1 (555) 000-0000" : "+34 600 000 000"}
                  className="h-9 text-sm mt-1"
                />
              </div>
            </div>

            {/* Legal Notice */}
            <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
              {L(
                'Las promociones de terceros están sujetas a disponibilidad, requisitos y condiciones de cada proveedor. NOVA actúa como consultor y no garantiza la concesión de créditos por plataformas externas.',
                'Third-party promotional offers are subject to availability, eligibility, spending requirements, and provider terms. NOVA acts as a digital advisor and does not guarantee approval by third-party platforms.'
              )}
            </p>

            <Button
              type="submit"
              disabled={isSubmitting || !name || !email}
              className="w-full h-11 text-sm font-semibold shadow-md shadow-primary/20"
            >
              {isSubmitting
                ? L('Analizando oportunidades...', 'Analyzing Opportunities...')
                : L('Ver mis ventajas elegibles →', 'View My Eligible Benefits →')}
            </Button>
          </form>
        ) : (
          <div className="space-y-5 pt-2">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">{L('¡Diagnóstico completado con éxito!', 'Diagnosis Complete!')}</span>{' '}
                {L(
                  'Hemos encontrado estas oportunidades verificadas para tu perfil. Un especialista de NOVA revisará tus datos para ayudarte a solicitarlas.',
                  'We identified these verified opportunities for your profile. A NOVA specialist will review your details to help you activate them.'
                )}
              </div>
            </div>

            <div className="space-y-3">
              {matchedBenefits.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-border bg-card/70 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{b.platform}</span>
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                          {isEn ? b.valueFormatted.en : b.valueFormatted.es}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground mt-1">
                        {isEn ? b.title.en : b.title.es}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {isEn ? b.description.en : b.description.es}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex flex-wrap items-center justify-between gap-2">
                    <span>
                      <strong className="text-foreground">{L('Cómo te ayuda NOVA:', 'How NOVA helps:')}</strong>{' '}
                      {isEn ? b.novaRole.en : b.novaRole.es}
                    </span>
                    <a
                      href={b.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-[11px]"
                    >
                      {L('Ver términos oficiales', 'Official Terms')}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button onClick={handleReset} className="flex-1 h-10 text-sm">
                {L('Entendido, volver a la web', 'Done, Back to Website')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('nova:open-sara'));
                  onOpenChange(false);
                }}
                className="h-10 text-sm"
              >
                {L('Hablar con Sara sobre estos beneficios', 'Ask Sara About These Benefits')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BenefitFinderModal;
