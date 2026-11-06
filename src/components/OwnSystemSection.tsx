import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarCheck, Database, HeartHandshake, MessageCircle, Smartphone, TrendingUp } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { trackLead } from '@/lib/tracking';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n';
import { WHATSAPP_URL } from '@/config/env';

const PILLAR_ICONS = [Smartphone, Database, HeartHandshake, TrendingUp];

interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}

const Slider = ({ id, label, value, min, max, step, display, onChange }: SliderProps) => (
  <div>
    <div className="flex items-baseline justify-between gap-3">
      <label htmlFor={id} className="text-sm text-white/75">{label}</label>
      <output htmlFor={id} className="font-display text-lg font-bold text-white">{display}</output>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="nova-range mt-2 w-full"
      style={{ ['--fill' as string]: `${((value - min) / (max - min)) * 100}%` }}
    />
  </div>
);

// "Why pay the apps for your own customers?" — the own-system pitch with a commission calculator
const OwnSystemSection = () => {
  const { t, formatCurrency, isEn } = useTranslation();
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal();
  const [orders, setOrders] = useState(400);
  const [ticket, setTicket] = useState(25);
  const [rate, setRate] = useState(25);

  const { monthly, yearly } = useMemo(() => {
    const m = orders * ticket * (rate / 100);
    return { monthly: m, yearly: m * 12 };
  }, [orders, ticket, rate]);

  const reveal = (delay: number) => ({
    className: cn('transition-all duration-700', isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'),
    style: { transitionDelay: `${delay}ms` },
  });

  const whatsappMessage = isEn
    ? "Hi NOVA, I want to build my own direct ordering/booking system and stop paying platform commissions."
    : "Hola NOVA, quiero mi propio sistema de pedidos/reservas y dejar de pagar comisiones a las apps.";

  const WHATSAPP_OWN_SYSTEM = `${WHATSAPP_URL}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="sistema-propio" ref={ref as React.RefObject<HTMLElement>} className="px-4 py-16 sm:px-6 md:py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] text-white" style={{ backgroundImage: 'var(--gradient-cosmic)' }}>
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,hsl(262_85%_65%/0.45),transparent_65%)]" aria-hidden="true" />
        <div className="absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,hsl(150_80%_50%/0.18),transparent_65%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" aria-hidden="true" />

        <div className="relative grid gap-12 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:p-14">
          {/* Pitch */}
          <div {...reveal(0)}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
              {t.ownSystem.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.08] md:text-5xl">
              {t.ownSystem.titleStart}
              <span className="text-emerald-300">{t.ownSystem.titleHighlight}</span>
              {t.ownSystem.titleEnd}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              {t.ownSystem.description}
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {t.ownSystem.pillars.map((p, index) => {
                const Icon = PILLAR_ICONS[index] || Smartphone;
                return (
                  <li key={p.title} className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                      <Icon className="h-5 w-5 text-emerald-300" />
                    </span>
                    <div>
                      <p className="font-semibold">{p.title}</p>
                      <p className="mt-0.5 text-sm text-white/65">{p.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Calculator */}
          <div {...reveal(150)}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-sm sm:p-8">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
                <CalendarCheck className="h-4 w-4 text-emerald-300" />
                {t.ownSystem.calcTitle}
              </div>

              <div className="mt-6 space-y-6">
                <Slider
                  id="calc-orders"
                  label={t.ownSystem.calcOrdersLabel}
                  value={orders}
                  min={50}
                  max={3000}
                  step={50}
                  display={new Intl.NumberFormat(isEn ? 'en-US' : 'es-ES').format(orders)}
                  onChange={setOrders}
                />
                <Slider
                  id="calc-ticket"
                  label={t.ownSystem.calcTicketLabel}
                  value={ticket}
                  min={5}
                  max={150}
                  step={1}
                  display={formatCurrency(ticket)}
                  onChange={setTicket}
                />
                <Slider
                  id="calc-rate"
                  label={t.ownSystem.calcRateLabel}
                  value={rate}
                  min={5}
                  max={35}
                  step={1}
                  display={`${rate} %`}
                  onChange={setRate}
                />
              </div>

              <div className="mt-8 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-400/5 p-5 ring-1 ring-emerald-300/25" aria-live="polite">
                <p className="text-sm text-white/75">{t.ownSystem.calcResultLabel}</p>
                <p className="mt-1 font-display text-4xl font-extrabold tracking-tight text-emerald-300 md:text-5xl">
                  {formatCurrency(yearly)}
                  <span className="text-lg font-semibold text-emerald-200/80">{t.ownSystem.calcResultPeriod}</span>
                </p>
                <p className="mt-1 text-sm text-white/65">
                  {t.ownSystem.calcResultSub(formatCurrency(monthly))}
                </p>
              </div>
              <p className="mt-3 text-xs text-white/50">{t.ownSystem.calcDisclaimer}</p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate('/?openBriefing=true')}
                  className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-5 py-3 font-semibold text-[hsl(var(--nova-ink))] shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  {t.ownSystem.ctaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href={WHATSAPP_OWN_SYSTEM}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackLead('whatsapp_sistema_propio')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t.ownSystem.ctaWhatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OwnSystemSection;
