import { useState, useMemo } from 'react';
import { Sparkles, DollarSign, Wrench, Rocket, ShoppingBag, HeartHandshake, ShieldCheck, ExternalLink, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { L, isEn } from '@/i18n';
import { GROWTH_BENEFITS, BenefitCategory, BenefitCountry } from '@/data/growthBenefits';
import BenefitFinderModal from '@/components/BenefitFinderModal';

const GrowthBenefits = () => {
  const [finderOpen, setFinderOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BenefitCategory | 'all'>('all');
  const [countryFilter, setCountryFilter] = useState<BenefitCountry | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories: { id: BenefitCategory | 'all'; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: L('Todas las oportunidades', 'All Opportunities'), icon: Sparkles },
    { id: 'ads', label: L('Créditos Publicitarios', 'Advertising Credits'), icon: DollarSign },
    { id: 'tools', label: L('Herramientas Gratuitas', 'Free Tools'), icon: Wrench },
    { id: 'cloud', label: L('Cloud & Startups', 'Cloud & Startups'), icon: Rocket },
    { id: 'ecommerce', label: L('Comercio Electrónico', 'E-Commerce'), icon: ShoppingBag },
    { id: 'nonprofit', label: L('ONG & Sin Ánimo de Lucro', 'Nonprofits'), icon: HeartHandshake },
  ];

  const filteredBenefits = useMemo(() => {
    return GROWTH_BENEFITS.filter((b) => {
      // Category filter
      if (selectedCategory !== 'all' && b.category !== selectedCategory) return false;

      // Country filter
      if (countryFilter !== 'ALL' && b.country !== 'ALL' && b.country !== countryFilter) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (isEn ? b.title.en : b.title.es).toLowerCase();
        const platform = b.platform.toLowerCase();
        const desc = (isEn ? b.description.en : b.description.es).toLowerCase();
        if (!title.includes(q) && !platform.includes(q) && !desc.includes(q)) return false;
      }

      return true;
    });
  }, [selectedCategory, countryFilter, searchQuery]);

  const faqs = [
    {
      q: L('¿Los créditos publicitarios son dinero en efectivo?', 'Are promotional advertising credits withdrawable cash?'),
      a: L(
        'No. Los créditos promocionales son fondos en especie que las plataformas (Google, TikTok, Microsoft, etc.) aplican directamente en tu cuenta publicitaria para descontar el coste de tus futuros clics o visualizaciones. No son dinero transferible ni reembolsable.',
        'No. Promotional credits are in-kind advertising credits applied directly to your ad account by providers (Google, TikTok, Microsoft, etc.) to offset future ad clicks or impressions. They cannot be withdrawn, transferred, or refunded as cash.'
      ),
    },
    {
      q: L('¿NOVA regala directamente estos créditos?', 'Does NOVA directly provide or issue these credits?'),
      a: L(
        'No. NOVA es una consultora de desarrollo web y marketing digital. No somos los emisores de los créditos. Nuestro servicio consiste en identificar a qué programas calificas, revisar los requisitos oficiales, estructurar tus campañas y configurarlo todo correctamente para que aproveches las ventajas al máximo.',
        'No. NOVA is a digital design and growth consultancy. We are not the issuers of third-party incentives. Our advisory role is to identify eligible promotions for your business, verify compliance rules, configure technical assets, and build high-converting campaigns to make the most of each credit.'
      ),
    },
    {
      q: L('¿Garantizáis la aprobación de los créditos?', 'Do you guarantee approval of promotional credits?'),
      a: L(
        'La concesión y aprobación final dependen exclusivamente de las políticas y verificaciones de cada plataforma (Google, TikTok, Amazon, etc.). Lo que garantizamos en NOVA es un trabajo técnico y estratégico profesional para cumplir con todos los estándares solicitados por los proveedores.',
        'Final grant approval rests entirely with the respective provider (Google, TikTok, Amazon, etc.) and their verification criteria. NOVA guarantees rigorous technical setup and campaign compliance to meet provider guidelines.'
      ),
    },
    {
      q: L('¿Puedo combinar varias promociones para mi negocio?', 'Can my business combine multiple promotional offers?'),
      a: L(
        'Sí. Es muy habitual activar el crédito de Google Ads junto con la ficha gratuita de Google Maps, instalar Microsoft Clarity para analítica e incluso solicitar créditos de TikTok o Apple Maps según el tipo de cliente al que te dirijas.',
        'Yes. It is standard to pair a Google Ads credit with a claimed Google Business Profile, implement Microsoft Clarity for zero-cost analytics, and unlock TikTok or Apple Maps credits depending on your target customer profile.'
      ),
    },
  ];

  return (
    <>
      <SEOHead
        title={
          isEn
            ? 'NOVA Growth Benefits — Ad Credits, Startup Perks & Business Tools'
            : 'NOVA Growth Benefits — Créditos Publicitarios y Ventajas Empresariales'
        }
        description={
          isEn
            ? 'Discover verified advertising credits from Google, TikTok, and Microsoft, free business tools, and startup programs to grow your business.'
            : 'Descubre créditos publicitarios de Google, TikTok y Microsoft, herramientas gratuitas y programas tecnológicos para hacer crecer tu empresa.'
        }
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-28 pb-20 px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* ─── Hero Section ──────────────────────────────────────────────── */}
            <div className="text-center max-w-3xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                NOVA Growth Benefits
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
                {L(
                  'Tu negocio merece mucho más que una página web.',
                  'Your Business Deserves More Than a Website.'
                )}
              </h1>

              <p className="text-lg sm:text-2xl font-semibold text-primary">
                {L(
                  'Te ayudamos a conseguir créditos publicitarios, promociones y ventajas para impulsar tu empresa.',
                  'We Help You Unlock Advertising Credits, Exclusive Offers & Growth Opportunities.'
                )}
              </p>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {L(
                  'En NOVA Marketing Solutions no solo desarrollamos páginas web, aplicaciones y soluciones digitales. También te ayudamos a descubrir oportunidades que pueden reducir tus costes, mejorar tu presencia online y acelerar el crecimiento de tu negocio.',
                  'At NOVA Marketing Solutions, we go beyond websites and business apps. We help you discover eligible advertising credits, promotional offers, free business tools, and technology programs designed to help your business grow.'
                )}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => setFinderOpen(true)}
                  className="w-full sm:w-auto h-12 px-8 text-sm font-bold shadow-lg shadow-primary/25 rounded-xl"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {L('Descubre tus ventajas gratis', 'Check Your Benefits — Free')}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto h-12 px-8 text-sm font-semibold rounded-xl"
                >
                  {L('Ver catálogo de oportunidades ↓', 'View Opportunities Catalog ↓')}
                </Button>
              </div>

              {/* Trust Badge */}
              <div className="pt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>
                  {L(
                    'Identificamos las oportunidades. Te ayudamos a aprovecharlas.',
                    'We identify the opportunities. We help you take advantage of them.'
                  )}
                </span>
              </div>
            </div>

            {/* ─── How It Works (3 Steps) ────────────────────────────────────── */}
            <div className="rounded-3xl border border-border/80 bg-card/60 p-8 sm:p-10 backdrop-blur-sm">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {L('Cómo te ayuda NOVA en 3 pasos', 'How NOVA Helps in 3 Steps')}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  {L(
                    'Convertimos incentivos complejos en clientes reales para tu negocio.',
                    'Turning complex platform incentives into tangible paying customers.'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    step: '01',
                    title: L('Diagnóstico personalizado', 'Targeted Opportunity Audit'),
                    desc: L(
                      'Revisamos tu país, sector y estado actual para identificar qué créditos publicitarios y herramientas gratuitas encajan exactamente con tus objetivos.',
                      'We analyze your target market, industry, and assets to identify the highest-value ad credits and free growth tools available.'
                    ),
                  },
                  {
                    step: '02',
                    title: L('Auditoría de elegibilidad', 'Eligibility & Rules Verification'),
                    desc: L(
                      'Revisamos la letra pequeña, fechas de caducidad y requisitos de gasto de cada plataforma para que no pierdas tiempo ni dinero en opciones no aplicables.',
                      'We examine official terms, spend tiers, and compliance rules to ensure your business meets provider qualifications.'
                    ),
                  },
                  {
                    step: '03',
                    title: L('Implementación y lanzamiento', 'Implementation & Live Launch'),
                    desc: L(
                      'Construimos tu web o app con los estándares requeridos, configuramos el seguimiento de conversiones y activamos las campañas para maximizar el retorno.',
                      'We build your high-converting website or app, set up conversion tracking, and manage ad campaigns to maximize your return.'
                    ),
                  },
                ].map((s, idx) => (
                  <div key={idx} className="space-y-3 p-5 rounded-2xl bg-background/50 border border-border/50">
                    <span className="text-2xl font-black text-primary/40 font-mono">{s.step}</span>
                    <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Catalog Filter & Search ───────────────────────────────────── */}
            <div id="catalogo" className="space-y-6 pt-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {L('Catálogo de Oportunidades Verificadas', 'Verified Opportunities Catalog')}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {L(
                      'Actualizado al 8 de noviembre de 2026 · Estados Unidos y España',
                      'Updated as of November 8, 2026 · United States & Spain'
                    )}
                  </p>
                </div>

                {/* Country filter buttons */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-accent border border-border/60">
                  <Button
                    type="button"
                    variant={countryFilter === 'ALL' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCountryFilter('ALL')}
                    className="h-8 text-xs px-3"
                  >
                    {L('Todos', 'All')}
                  </Button>
                  <Button
                    type="button"
                    variant={countryFilter === 'US' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCountryFilter('US')}
                    className="h-8 text-xs px-3"
                  >
                    🇺🇸 USA
                  </Button>
                  <Button
                    type="button"
                    variant={countryFilter === 'ES' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCountryFilter('ES')}
                    className="h-8 text-xs px-3"
                  >
                    🇪🇸 España
                  </Button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    type="button"
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="h-9 text-xs rounded-xl shrink-0"
                  >
                    <cat.icon className="w-3.5 h-3.5 mr-1.5" />
                    {cat.label}
                  </Button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={L('Buscar por plataforma o beneficio (ej: Google, TikTok, AWS, Maps)...', 'Search by platform or benefit (e.g. Google, TikTok, AWS, Maps)...')}
                  className="pl-10 h-11 bg-card/50"
                />
              </div>

              {/* Benefits Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredBenefits.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-2xl border border-border/80 bg-card/80 p-6 flex flex-col justify-between hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{b.platform}</span>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-accent text-muted-foreground border border-border/40">
                            {b.country === 'ALL' ? 'US & ES' : b.country}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                          {isEn ? b.valueFormatted.en : b.valueFormatted.es}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="text-base font-bold text-foreground">
                          {isEn ? b.title.en : b.title.es}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                          {isEn ? b.description.en : b.description.es}
                        </p>
                      </div>

                      {/* Requirement & Eligibility */}
                      <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
                        <div className="text-foreground/90">
                          <strong className="text-foreground">{L('Requisito de gasto / inversión:', 'Spend Requirement:')}</strong>{' '}
                          <span className="text-muted-foreground">{isEn ? b.spendRequirement.en : b.spendRequirement.es}</span>
                        </div>

                        <div>
                          <p className="font-semibold text-foreground mb-1">{L('Requisitos de elegibilidad:', 'Eligibility Criteria:')}</p>
                          <ul className="space-y-1">
                            {(isEn ? b.eligibility.en : b.eligibility.es).map((item, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-muted-foreground text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* NOVA Role */}
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 text-[11px] text-foreground">
                        <strong className="text-primary">{L('Cómo te ayuda NOVA:', 'How NOVA Helps:')}</strong>{' '}
                        <span className="text-muted-foreground">{isEn ? b.novaRole.en : b.novaRole.es}</span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-5 pt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                      <Button
                        size="sm"
                        onClick={() => setFinderOpen(true)}
                        className="text-xs h-9 px-4 font-semibold"
                      >
                        {L('Solicitar con NOVA', 'Claim With NOVA')}
                      </Button>

                      <a
                        href={b.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground underline transition-colors"
                      >
                        {L('Fuente y términos oficiales', 'Official Terms & Source')}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {filteredBenefits.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  {L('No se encontraron oportunidades con los filtros seleccionados.', 'No opportunities match your current filters.')}
                </div>
              )}
            </div>

            {/* ─── FAQ Section ───────────────────────────────────────────────── */}
            <div className="rounded-3xl border border-border/80 bg-card/60 p-8 sm:p-10 backdrop-blur-sm space-y-6">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {L('Preguntas Frecuentes sobre Beneficios', 'Frequently Asked Questions')}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  {L(
                    'Transparencia total sobre condiciones, créditos y cómo trabajamos.',
                    'Full transparency regarding terms, ad credits, and how we collaborate.'
                  )}
                </p>
              </div>

              <div className="space-y-3 max-w-3xl mx-auto">
                {faqs.map((faq, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-background/60 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-foreground hover:text-primary transition-colors"
                    >
                      <span>{faq.q}</span>
                      {expandedFaq === i ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                      )}
                    </button>
                    {expandedFaq === i && (
                      <div className="px-4 pb-4 pt-0 text-xs text-muted-foreground leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Final CTA & Legal Notice ───────────────────────────────────── */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-primary/15 via-background to-accent/40 border border-primary/20 text-center space-y-5">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground">
                {L(
                  '¿Preparado para desbloquear ventajas para tu empresa?',
                  'Ready to Unlock Growth Benefits for Your Business?'
                )}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {L(
                  'Rellena nuestro diagnóstico de 2 minutos. Evaluamos sin coste las ofertas que mejor encajan con tu proyecto y te preparamos un plan de implementación claro.',
                  'Complete our 2-minute diagnostic assessment. We evaluate eligible offers for your profile at zero cost and deliver an actionable execution plan.'
                )}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => setFinderOpen(true)}
                  className="h-12 px-8 text-sm font-bold shadow-lg shadow-primary/25 rounded-xl"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {L('Comenzar diagnóstico gratuito', 'Start Free Diagnostic Assessment')}
                </Button>
              </div>

              {/* Mandatory Legal Notice */}
              <div className="pt-6 border-t border-border/40 max-w-3xl mx-auto text-[11px] text-muted-foreground leading-relaxed">
                <strong>{L('Aviso legal y transparencia:', 'Legal Notice & Transparency:')}</strong>{' '}
                {L(
                  'Las promociones de terceros están sujetas a disponibilidad, requisitos y condiciones de cada proveedor. NOVA no garantiza la aprobación ni la concesión de créditos o ayudas.',
                  'Third-party promotional offers are subject to availability, eligibility, spending requirements, and provider terms. NOVA does not guarantee approval or promotional credits.'
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <BenefitFinderModal open={finderOpen} onOpenChange={setFinderOpen} />
      </div>
    </>
  );
};

export default GrowthBenefits;
