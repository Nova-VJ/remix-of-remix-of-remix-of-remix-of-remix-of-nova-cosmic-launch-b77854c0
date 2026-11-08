import { useState } from 'react';
import { Check, Sparkles, ShieldCheck, ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [country, setCountry] = useState<'US' | 'ES'>(isEn ? 'US' : 'ES');
  const [businessType, setBusinessType] = useState('local');
  const [goal, setGoal] = useState('clients');
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
      if (b.country !== 'ALL' && b.country !== country) return false;

      if (businessType === 'nonprofit') return b.category === 'nonprofit' || b.category === 'tools';
      if (businessType === 'startup') return b.category === 'cloud' || b.category === 'ads' || b.category === 'tools';
      if (businessType === 'ecommerce') return b.category === 'ecommerce' || b.category === 'ads' || b.category === 'tools';
      if (businessType === 'local') return b.id === 'google-ads' || b.id === 'apple-maps-ads' || b.id === 'google-business-profile' || b.id === 'microsoft-clarity';

      return true;
    }).slice(0, 5);

    setMatchedBenefits(filtered);

    const summaryText = `[DIAGNÓSTICO NOVA GROWTH BENEFITS]
País: ${country}
Tipo de negocio: ${businessType}
Objetivo: ${goal}
Nombre: ${name}
Email: ${email}
Teléfono: ${phone || 'No especificado'}
Beneficios preliminares sugeridos: ${filtered.map((b) => b.platform).join(', ')}`;

    try {
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
      <DialogContent className="max-w-2xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-background text-foreground border border-border shadow-2xl sm:rounded-2xl">
        {/* Pinned Header */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent space-y-1.5 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            NOVA Growth Benefits Finder
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {step === 'form'
              ? L('Descubre qué ventajas podría conseguir tu negocio', 'Find Out What Your Business May Qualify For')
              : L('Tu diagnóstico preliminar de ventajas', 'Your Preliminary Benefits Match')}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
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
          <form onSubmit={handleDiagnose} className="flex flex-col flex-1 min-h-0">
            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* 1. Country Selector */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                  {L('1. ¿Dónde opera tu negocio?', '1. Where is your business based?')}
                </Label>
                <div className="grid grid-cols-2 gap-2.5 mt-1.5">
                  {[
                    { id: 'US' as const, code: 'US', label: L('Estados Unidos', 'United States') },
                    { id: 'ES' as const, code: 'ES', label: L('España', 'Spain') },
                  ].map((c) => {
                    const active = country === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCountry(c.id)}
                        className={`h-10 px-3.5 rounded-xl border text-sm font-medium flex items-center justify-between transition-all ${
                          active
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
                            : 'bg-muted/40 text-foreground border-border hover:border-primary/40 hover:bg-accent/60'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center justify-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              active ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {c.code}
                          </span>
                          <span>{c.label}</span>
                        </span>
                        {active && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Business Type */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                  {L('2. Tipo de negocio', '2. Business Type')}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                  {[
                    { id: 'local', es: 'Comercio local / Restaurante', en: 'Local Business / Restaurant' },
                    { id: 'ecommerce', es: 'Tienda Online / E-commerce', en: 'Online Store / E-commerce' },
                    { id: 'services', es: 'Servicios Profesionales / B2B', en: 'Professional Services / B2B' },
                    { id: 'startup', es: 'Startup Tecnológica / SaaS', en: 'Tech Startup / SaaS' },
                    { id: 'nonprofit', es: 'Organización sin ánimo de lucro', en: 'Nonprofit / Foundation' },
                    { id: 'other', es: 'Nuevo proyecto / Otro sector', en: 'New Venture / Other Industry' },
                  ].map((item) => {
                    const active = businessType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setBusinessType(item.id)}
                        className={`h-9 px-3 rounded-xl border text-xs font-medium flex items-center justify-between text-left transition-all ${
                          active
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
                            : 'bg-muted/40 text-foreground border-border hover:border-primary/40 hover:bg-accent/60'
                        }`}
                      >
                        <span className="truncate">{isEn ? item.en : item.es}</span>
                        {active && <Check className="w-3.5 h-3.5 shrink-0 ml-1.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Primary Digital Goal */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                  {L('3. Principal objetivo digital', '3. Primary Digital Goal')}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1.5">
                  {[
                    { id: 'clients', es: 'Conseguir más clientes', en: 'Acquire New Clients' },
                    { id: 'ads', es: 'Publicidad con créditos', en: 'Start Paid Ads with Credits' },
                    { id: 'ecommerce', es: 'Vender productos online', en: 'Sell Products Online' },
                    { id: 'software', es: 'Crear app o software', en: 'Build Custom App / Software' },
                    { id: 'savings', es: 'Ahorrar en herramientas', en: 'Cut Software & Tool Costs' },
                    { id: 'all', es: 'Renovación completa', en: 'Full Digital Transformation' },
                  ].map((item) => {
                    const active = goal === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setGoal(item.id)}
                        className={`h-9 px-3 rounded-xl border text-xs font-medium flex items-center justify-between text-left transition-all ${
                          active
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
                            : 'bg-muted/40 text-foreground border-border hover:border-primary/40 hover:bg-accent/60'
                        }`}
                      >
                        <span className="truncate">{isEn ? item.en : item.es}</span>
                        {active && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact Inputs */}
              <div className="pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="benefit-name" className="text-xs font-semibold text-foreground">
                    {L('Tu Nombre *', 'Your Name *')}
                  </Label>
                  <Input
                    id="benefit-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={L('Nombre y apellidos', 'Full name')}
                    className="h-9 text-sm mt-1 bg-background border-border text-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="benefit-email" className="text-xs font-semibold text-foreground">
                    {L('Tu Email *', 'Your Email *')}
                  </Label>
                  <Input
                    id="benefit-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="h-9 text-sm mt-1 bg-background border-border text-foreground"
                  />
                </div>

                <div>
                  <Label htmlFor="benefit-phone" className="text-xs font-semibold text-foreground">
                    {L('WhatsApp / Teléfono', 'WhatsApp / Phone')}
                  </Label>
                  <Input
                    id="benefit-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isEn ? '+1 (555) 000-0000' : '+34 600 000 000'}
                    className="h-9 text-sm mt-1 bg-background border-border text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Pinned Footer */}
            <div className="px-6 py-3.5 border-t border-border bg-muted/30 space-y-2 shrink-0">
              <Button
                type="submit"
                disabled={isSubmitting || !name || !email}
                className="w-full h-11 text-sm font-semibold rounded-xl shadow-md shadow-primary/20"
              >
                {isSubmitting
                  ? L('Analizando oportunidades...', 'Analyzing Opportunities...')
                  : L('Ver mis ventajas elegibles →', 'View My Eligible Benefits →')}
              </Button>
              <p className="text-[11px] text-muted-foreground text-center leading-snug">
                {L(
                  'Promociones sujetas a requisitos y condiciones de cada proveedor. NOVA actúa como consultor y no garantiza la aprobación externa.',
                  'Third-party offers are subject to provider terms and eligibility. NOVA acts as an advisor and does not guarantee third-party approval.'
                )}
              </p>
            </div>
          </form>
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
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
                    className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors"
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

                    <div className="mt-3 pt-3 border-t border-border/50 text-[11px] text-muted-foreground flex flex-wrap items-center justify-between gap-2">
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
            </div>

            <div className="px-6 py-4 border-t border-border bg-muted/30 flex flex-col sm:flex-row gap-2.5 shrink-0">
              <Button onClick={handleReset} className="flex-1 h-10 text-sm rounded-xl">
                {L('Entendido, volver a la web', 'Done, Back to Website')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('nova:open-sara'));
                  onOpenChange(false);
                }}
                className="h-10 text-sm rounded-xl"
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
