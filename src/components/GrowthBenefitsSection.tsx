import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, DollarSign, Wrench, Rocket, TrendingUp, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { L, isEn } from '@/i18n';
import BenefitFinderModal from '@/components/BenefitFinderModal';

const GrowthBenefitsSection = () => {
  const [finderOpen, setFinderOpen] = useState(false);

  const cards = [
    {
      icon: DollarSign,
      title: L('Créditos publicitarios', 'Advertising Credits'),
      desc: L(
        'Descubre créditos promocionales en las principales plataformas de publicidad (Google Ads, TikTok, Microsoft, Apple Ads).',
        'Discover promotional ad credits from major advertising platforms (Google Ads, TikTok, Microsoft, Apple Ads).'
      ),
      badge: L('Hasta 3.000 $ match', 'Up to $3,000 Match'),
      glow: 'from-amber-500/20 via-primary/10 to-transparent',
    },
    {
      icon: Wrench,
      title: L('Herramientas gratuitas', 'Free Business Tools'),
      desc: L(
        'Aprovecha herramientas que mejoran tu visibilidad online y operativa sin coste de suscripción (Google Maps, Clarity, CRMs).',
        'Take advantage of tools that improve your online visibility and operations (Google Maps, Clarity, CRMs).'
      ),
      badge: L('100% Gratuitas', '100% Free Foundation'),
      glow: 'from-emerald-500/20 via-primary/10 to-transparent',
    },
    {
      icon: Rocket,
      title: L('Ayudas y ventajas tecnológicas', 'Startup & Technology Benefits'),
      desc: L(
        'Explora créditos cloud en AWS, Google Cloud, software con descuento y programas para proyectos innovadores.',
        'Explore cloud credits, software savings, and entrepreneurial programs designed for scalable software.'
      ),
      badge: L('Hasta 100k $ Cloud', 'Up to $100k Cloud'),
      glow: 'from-sky-500/20 via-primary/10 to-transparent',
    },
    {
      icon: TrendingUp,
      title: L('Oportunidades de crecimiento', 'Growth Opportunities'),
      desc: L(
        'Estrategias de captación, automatizaciones e incentivos oficiales para escalar tu negocio con menor inversión inicial.',
        'Find resources, automations, and official platform incentives that help your business scale efficiently.'
      ),
      badge: L('Asesoramiento Pro', 'Pro Advisory'),
      glow: 'from-purple-500/20 via-primary/10 to-transparent',
    },
  ];

  return (
    <>
      <section
        id="growth-benefits"
        className="relative py-20 px-6 overflow-hidden border-t border-border/40 bg-gradient-to-b from-background via-accent/15 to-background"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              NOVA Growth Benefits
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              {L(
                'Tu negocio merece mucho más que una página web.',
                'Your Business Deserves More Than a Website.'
              )}
            </h2>

            <p className="text-lg sm:text-xl font-medium text-primary">
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
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {cards.map((c, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <c.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-accent text-foreground/80 border border-border/40">
                      {c.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {c.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/30 flex items-center text-xs font-semibold text-primary">
                  <span>{L('Verificar elegibilidad', 'Check eligibility')}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>

          {/* Trust Statement */}
          <div className="mt-10 py-4 px-6 rounded-2xl border border-primary/20 bg-primary/5 text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-foreground">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <span className="font-semibold">
              {L(
                'Identificamos las oportunidades. Te ayudamos a aprovecharlas.',
                'We identify the opportunities. We help you take advantage of them.'
              )}
            </span>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => setFinderOpen(true)}
              className="w-full sm:w-auto h-12 px-8 text-sm font-bold shadow-lg shadow-primary/25 rounded-xl"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {L('Descubre tus ventajas gratis', 'Check Your Benefits — Free')}
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-sm font-semibold rounded-xl"
            >
              <Link to={isEn ? '/growth-benefits' : '/beneficios-empresas'}>
                {L('Explorar catálogo de oportunidades →', 'Explore Growth Opportunities →')}
              </Link>
            </Button>
          </div>

          {/* Legal Disclaimer */}
          <p className="mt-8 text-center text-[11px] text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
            {L(
              'Las promociones de terceros están sujetas a disponibilidad, requisitos y condiciones de cada proveedor. NOVA no garantiza la aprobación ni la concesión de créditos o ayudas.',
              'Third-party promotional offers are subject to availability, eligibility, spending requirements, and provider terms. NOVA does not guarantee approval or promotional credits.'
            )}
          </p>
        </div>
      </section>

      <BenefitFinderModal open={finderOpen} onOpenChange={setFinderOpen} />
    </>
  );
};

export default GrowthBenefitsSection;
