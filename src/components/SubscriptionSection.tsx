import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Check, Globe, Mail, MessageCircle, Palette, ShieldCheck, Sparkles, Star, Wrench } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { useTranslation, L } from '@/i18n';
import { WHATSAPP_URL } from '@/config/env';

const INCLUDE_ICONS = [Globe, Bot, Palette, Mail, ShieldCheck, Wrench];

// Vista decorativa del producto: la web del cliente con su asistente respondiendo de noche
const ProductPreview = () => {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
      <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,hsl(262_85%_68%/0.45),transparent_60%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] shadow-2xl backdrop-blur">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="ml-3 flex-1 rounded-md bg-white/10 px-2 text-[10px] leading-5 text-white/60">
            {t.hero.mockupBusiness}
          </span>
        </div>
        <div className="space-y-2 px-5 pt-5">
          <div className="h-3 w-3/4 rounded bg-white/80" />
          <div className="h-3 w-1/2 rounded bg-white/80" />
          <div className="h-2 w-2/3 rounded bg-white/25" />
          <div className="mt-3 h-6 w-24 rounded-md bg-[hsl(262_80%_62%)]" />
        </div>
        <div className="m-4 mt-6 rounded-xl border border-white/10 bg-[hsl(245_40%_9%/0.85)] p-3">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(262_80%_62%)] text-white">
              <Bot className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-xs font-semibold text-white">{t.subscription.mockupAssistant}</p>
              <p className="flex items-center gap-1 text-[10px] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
                {t.subscription.mockupOnline}
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-2 text-[11px] leading-snug">
            <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-white/90 px-3 py-2 text-slate-900">
              {t.subscription.mockupUserMsg}
            </p>
            <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-[hsl(262_80%_62%)] px-3 py-2 text-white">
              {t.subscription.mockupBotMsg}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -left-4 rounded-xl border border-white/15 bg-white px-3 py-2 shadow-xl motion-safe:animate-nova-float">
        <p className="text-[10px] font-medium text-slate-500">{t.subscription.mockupCardTitle}</p>
        <p className="text-xs font-bold text-slate-900">{t.subscription.mockupCardSub}</p>
      </div>
    </div>
  );
};

const SubscriptionSection = () => {
  const { t, isEn } = useTranslation();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const navigate = useNavigate();

  const whatsappMessage = isEn
    ? "Hi NOVA, I'm interested in the $25.99/mo Website Plan. My business is: _____"
    : "Hola NOVA, me interesa el Plan Web de 25,99 €/mes. Mi negocio es: _____";

  const WHATSAPP_PLAN = `${WHATSAPP_URL}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="plan-web" ref={ref} className="relative scroll-mt-24 py-16 sm:py-24">
      <div className={`mx-auto max-w-6xl px-4 transition-all duration-700 sm:px-6 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {/* Borde con degradado de la marca */}
        <div className="rounded-[2rem] bg-gradient-to-br from-[hsl(262_80%_65%)] via-[hsl(290_70%_60%/0.6)] to-[hsl(225_85%_60%/0.7)] p-px shadow-[0_40px_100px_-40px_hsl(262_70%_35%/0.8)]">
          <div className="relative overflow-hidden rounded-[calc(2rem-1px)] text-white" style={{ backgroundImage: 'var(--gradient-cosmic)' }}>
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <div className="absolute -right-32 -top-40 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,hsl(262_85%_65%/0.35),transparent_65%)] motion-safe:animate-aurora" />
              <div className="absolute -bottom-48 -left-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,hsl(225_90%_62%/0.22),transparent_65%)] motion-safe:animate-aurora [animation-delay:-8s]" />
            </div>

            <div className="relative grid items-center gap-12 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.15fr_1fr] lg:px-14">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white/90 backdrop-blur">
                  <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                  {t.subscription.starBadge}
                </span>

                <h2 className="mt-5 text-3xl font-extrabold leading-[1.1] sm:text-[2.75rem]">
                  {t.subscription.titleStart}
                  <span className="mt-1 block pb-[0.15em] bg-gradient-to-r from-[hsl(270_95%_80%)] via-[hsl(300_90%_80%)] to-[hsl(215_95%_78%)] bg-clip-text text-transparent">
                    {t.subscription.titleGradient}
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                  {t.subscription.description}
                </p>

                <div className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-6xl font-extrabold tracking-tight">{t.subscription.price}</span>
                    <span className="text-lg font-medium text-white/60">{t.subscription.period}</span>
                    {t.subscription.taxNote && (
                      <span className="text-sm font-medium text-white/60">{t.subscription.taxNote}</span>
                    )}
                  </div>
                  <p className="pb-2 text-sm text-white/70">
                    <span className="font-semibold text-white">{t.subscription.coffeeLine}</span><br />
                    {t.subscription.coffeeSub}
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate('/?openBriefing=true')}
                    className="group inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full bg-white py-2 pl-7 pr-2 text-base font-semibold text-slate-900 shadow-[0_10px_30px_-10px_hsl(0_0%_100%/0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_hsl(0_0%_100%/0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(245_40%_11%)]"
                  >
                    {t.subscription.ctaPrimary}
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(262_78%_54%)] text-white transition-transform duration-200 group-hover:translate-x-0.5">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </button>
                  <a
                    href={WHATSAPP_PLAN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors duration-200 hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <MessageCircle className="h-5 w-5 text-[#25D366]" />
                    {t.subscription.ctaWhatsapp}
                  </a>
                </div>

                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
                  {t.subscription.guarantees.map((item) => (
                    <li key={item} className="flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-emerald-300" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hidden sm:block">
                <ProductPreview />
              </div>
            </div>

            {/* Lo que incluye */}
            <div className="relative border-t border-white/10 px-6 py-10 sm:px-10 lg:px-14">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                <Sparkles className="h-4 w-4 text-[hsl(270_95%_80%)]" /> {t.subscription.includesEyebrow}
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {t.subscription.includes.map((item, index) => {
                  const Icon = INCLUDE_ICONS[index] || Globe;
                  return (
                    <li key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                        <Icon className="h-5 w-5 text-[hsl(270_95%_80%)]" />
                      </span>
                      <p className="mt-3.5 font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/70">{item.text}</p>
                    </li>
                  );
                })}
              </ul>

              {/* Pasos */}
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  {t.subscription.stepsEyebrow}
                </p>
                <ol className="mt-4 grid gap-5 sm:grid-cols-3">
                  {t.subscription.steps.map((step, i) => (
                    <li key={step.title} className="relative">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white ring-1 ring-white/20">
                        {i + 1}
                      </span>
                      <p className="mt-2.5 font-semibold text-white">{step.title}</p>
                      <p className="mt-0.5 text-sm text-white/65">{step.text}</p>
                    </li>
                  ))}
                </ol>

                <p className="mt-10 text-xs leading-relaxed text-white/45">
                  {L(
                    'Primero evaluamos tu proyecto, sin compromiso; por eso el Plan Web se pide por el formulario o por WhatsApp, no desde el presupuesto online. El cambio mensual no es acumulable. El código NOVA20 no se aplica a la suscripción.',
                    'We review your project first, with no commitment, which is why the Website Plan is requested through the form or WhatsApp, not the online quote. The monthly change does not roll over. The NOVA20 code does not apply to the subscription.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
