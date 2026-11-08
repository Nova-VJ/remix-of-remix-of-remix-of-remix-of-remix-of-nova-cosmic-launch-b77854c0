import { Link, useNavigate } from 'react-router-dom';
import metodoNovaIcon from '@/assets/metodo-nova-icon.webp';
import { ArrowRight, MessageCircle, MapPin, Clock, ShieldCheck, Globe, Smartphone, Palette, Share2, TrendingUp, Star, Sparkles } from 'lucide-react';
import { useTranslation, L } from '@/i18n';
import { WHATSAPP_URL } from '@/config/env';

// Decorative website mock-up drawn with CSS/SVG: no image to download
const BrowserMockup = () => {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto w-full max-w-lg" aria-hidden="true">
      <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-fuchsia-300/10 to-sky-300/20 blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_80px_-30px_hsl(262_60%_30%/0.45)]">
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/60 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 h-5 flex-1 rounded-md bg-background px-2 text-[10px] leading-5 text-muted-foreground">
            {t.hero.mockupBusiness}
          </span>
        </div>

        {/* Mini landing page */}
        <div className="relative overflow-hidden px-6 pb-6 pt-5" style={{ backgroundImage: 'var(--gradient-cosmic)' }}>
          <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-primary/50 blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div className="h-2.5 w-14 rounded bg-white/90" />
            <div className="flex gap-2.5">
              <div className="h-1.5 w-8 rounded bg-white/40" />
              <div className="h-1.5 w-8 rounded bg-white/40" />
              <div className="h-1.5 w-8 rounded bg-white/40" />
            </div>
          </div>
          <div className="relative mt-6 space-y-2">
            <div className="h-3.5 w-4/5 rounded bg-white" />
            <div className="h-3.5 w-3/5 rounded bg-white" />
            <div className="h-2 w-2/3 rounded bg-white/45" />
          </div>
          <div className="relative mt-5 flex gap-2">
            <div className="h-7 w-24 rounded-lg bg-primary shadow-[0_6px_20px_-6px_hsl(262_78%_60%)]" />
            <div className="h-7 w-20 rounded-lg border border-white/30" />
          </div>
        </div>

        {/* Mini dashboard */}
        <div className="grid grid-cols-5 gap-3 p-5">
          <div className="col-span-3 rounded-xl border border-border p-3">
            <div className="flex items-center justify-between">
              <div className="h-2 w-14 rounded bg-foreground/70" />
              <div className="h-2 w-6 rounded bg-emerald-400/70" />
            </div>
            <svg viewBox="0 0 160 60" className="mt-3 h-16 w-full">
              <defs>
                <linearGradient id="hero-area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(262 78% 54%)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="hsl(262 78% 54%)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 50 C 20 46, 30 40, 45 42 S 70 30, 85 32 S 110 18, 125 20 S 150 8, 160 6 L160 60 L0 60 Z" fill="url(#hero-area)" />
              <path d="M0 50 C 20 46, 30 40, 45 42 S 70 30, 85 32 S 110 18, 125 20 S 150 8, 160 6" fill="none" stroke="hsl(262 78% 54%)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="col-span-2 flex flex-col gap-3">
            {['bg-accent', 'bg-emerald-50'].map((tone) => (
              <div key={tone} className="flex-1 rounded-xl border border-border p-3">
                <div className={`h-5 w-5 rounded-md ${tone}`} />
                <div className="mt-2 h-2 w-full rounded bg-muted-foreground/25" />
                <div className="mt-1.5 h-2 w-2/3 rounded bg-muted-foreground/25" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating cards */}
      <div className="absolute -left-4 bottom-12 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-xl backdrop-blur sm:-left-10 motion-safe:animate-nova-float">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">{t.hero.mockupCardConversionTitle}</p>
            <p className="text-sm font-semibold text-foreground">{t.hero.mockupCardConversionSub}</p>
          </div>
        </div>
      </div>
      <div className="absolute -right-2 -top-5 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-xl backdrop-blur sm:-right-6">
        <p className="text-xs text-muted-foreground">{t.hero.mockupCardDeliveryTitle}</p>
        <p className="text-sm font-semibold text-foreground">{t.hero.mockupCardDeliverySub}</p>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const openBriefing = () => navigate('/?openBriefing=true');

  const trustPoints = [
    { icon: MapPin, text: t.hero.trustAgencia },
    { icon: Clock, text: t.hero.trustResponse },
    { icon: ShieldCheck, text: t.hero.trustNoCommitment },
  ];

  const serviceChips = [
    { icon: Globe, label: t.hero.chips.web.label, hint: t.hero.chips.web.hint },
    { icon: Smartphone, label: t.hero.chips.apps.label, hint: t.hero.chips.apps.hint },
    { icon: Palette, label: t.hero.chips.branding.label, hint: t.hero.chips.branding.hint },
    { icon: Share2, label: t.hero.chips.social.label, hint: t.hero.chips.social.hint },
  ];

  return (
    <section id="contenido" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-20">
      {/* Soft background */}
      <div className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent_85%)] opacity-70" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-56 right-[-12%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,hsl(262_85%_68%/0.30),transparent_65%)] motion-safe:animate-aurora" />
        <div className="absolute -top-32 right-[22%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,hsl(292_85%_72%/0.20),transparent_65%)] motion-safe:animate-aurora [animation-delay:-6s]" />
        <div className="absolute top-48 right-[-6%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,hsl(215_90%_68%/0.18),transparent_65%)] motion-safe:animate-aurora [animation-delay:-12s]" />
        <div className="absolute inset-0 bg-grain opacity-[0.04] mix-blend-multiply" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Link
            to="/metodo-nova"
            className="group mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent/70 py-1 pl-1 pr-3.5 text-xs font-semibold text-accent-foreground transition-colors hover:border-primary/40 hover:bg-accent"
          >
            <img
              src={metodoNovaIcon}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain motion-safe:animate-nova-float transition-transform duration-500 group-hover:rotate-[24deg]"
            />
            <span>{t.hero.badge}<span className="hidden sm:inline"> · {t.hero.badgeSubtitle}</span></span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <h1 className="text-4xl font-extrabold leading-[1.08] text-foreground sm:text-5xl lg:text-[3.6rem]">
            {t.hero.titleStart}
            <span className="relative inline-block text-gradient">
              {t.hero.titleGradient}
              <svg viewBox="0 0 220 14" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-3 w-full text-primary/35" aria-hidden="true">
                <path d="M2 10 C 50 3, 120 2, 218 8" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
            {t.hero.titleEnd}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {t.hero.description}
          </p>

          {/* Gancho principal: Plan Web por suscripción */}
          <a
            href="#plan-web"
            className="group mt-7 flex max-w-xl items-center gap-4 rounded-2xl p-1.5 pr-4 text-white shadow-[0_18px_40px_-18px_hsl(262_70%_35%/0.9)] ring-1 ring-white/10 transition-transform duration-200 hover:-translate-y-0.5"
            style={{ backgroundImage: 'var(--gradient-cosmic)' }}
          >
            <span className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-white/10 px-3.5 py-2 text-center leading-none ring-1 ring-white/15">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">{t.hero.planPillTitle}</span>
              <span className="mt-1 text-lg font-extrabold">{t.hero.planPillPrice}</span>
              <span className="mt-0.5 text-[10px] text-white/70">{t.hero.planPillPeriod}</span>
            </span>
            <span className="text-sm leading-snug">
              <span className="mb-0.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                <Star className="h-3 w-3 fill-amber-300" /> {t.hero.planPillStar}
              </span>
              {t.hero.planPillDesc}<b className="font-semibold">{t.hero.planPillBold}</b>{t.hero.planPillEnd}
            </span>
            <span className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[hsl(262_78%_54%)] transition-transform duration-200 group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </span>
          </a>

          {/* NOVA Benefit Finder Diagnostic CTA */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('nova:open-finder'))}
            className="group mt-3 flex max-w-xl w-full items-center justify-between rounded-xl border border-primary/25 bg-primary/5 px-4 py-2.5 text-left text-xs font-medium text-foreground transition-all hover:border-primary/50 hover:bg-primary/10"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span>
                <strong className="font-semibold text-primary">
                  {L('NOVA Benefit Finder:', 'NOVA Benefit Finder:')}
                </strong>{' '}
                {L(
                  'Comprueba en 1 min si calificas a créditos de Google/TikTok y herramientas gratis.',
                  'Find out in 1 min if you qualify for Google/TikTok ad credits & free tools.'
                )}
              </span>
            </span>
            <span className="hidden sm:inline-flex items-center text-primary font-semibold text-[11px] shrink-0 ml-2">
              {L('Hacer diagnóstico →', 'Start Diagnostic →')}
            </span>
          </button>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openBriefing}
              className="btn-glow inline-flex items-center justify-center gap-2 text-primary-foreground"
            >
              {t.hero.ctaQuote}
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
              {t.hero.ctaWhatsapp}
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {trustPoints.map((point) => (
              <li key={point.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <point.icon className="h-4 w-4 text-primary" />
                {point.text}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden sm:block">
          <BrowserMockup />
        </div>
      </div>

      {/* What we do, at a glance */}
      <div className="relative z-10 mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:mt-20">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-card md:grid-cols-4">
          {serviceChips.map((chip) => (
            <div key={chip.label} className="flex items-center gap-3 bg-card px-4 py-4 sm:px-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <chip.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{chip.label}</p>
                <p className="hidden text-xs text-muted-foreground sm:block">{chip.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
