import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, MapPin, Clock, ShieldCheck, Globe, Smartphone, Palette, Share2, TrendingUp } from 'lucide-react';

const WHATSAPP_GENERAL = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20pedir%20un%20presupuesto%20gratuito.%20Mi%20proyecto%20es%3A%20_____%20y%20me%20gustar%C3%ADa%20recibir%20asesoramiento.";

const trustPoints = [
  { icon: MapPin, text: "Agencia en Valladolid" },
  { icon: Clock, text: "Respuesta en 24 h" },
  { icon: ShieldCheck, text: "Presupuesto sin compromiso" },
];

const serviceChips = [
  { icon: Globe, label: "Webs" },
  { icon: Smartphone, label: "Apps" },
  { icon: Palette, label: "Branding" },
  { icon: Share2, label: "Redes sociales" },
];

// Decorative website mock-up drawn with CSS: no image to download
const BrowserMockup = () => (
  <div className="relative mx-auto w-full max-w-lg" aria-hidden="true">
    <div className="rounded-2xl border border-border bg-card shadow-[0_30px_80px_-30px_hsl(262_60%_30%/0.35)] overflow-hidden">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/60 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 h-5 flex-1 rounded-md bg-background text-[10px] leading-5 text-muted-foreground px-2">tunegocio.es</span>
      </div>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 rounded bg-foreground/80" />
          <div className="flex gap-3">
            <div className="h-2 w-10 rounded bg-muted-foreground/30" />
            <div className="h-2 w-10 rounded bg-muted-foreground/30" />
            <div className="h-2 w-10 rounded bg-muted-foreground/30" />
          </div>
        </div>
        <div className="space-y-2.5 pt-2">
          <div className="h-4 w-4/5 rounded bg-foreground/85" />
          <div className="h-4 w-3/5 rounded bg-foreground/85" />
          <div className="h-2.5 w-2/3 rounded bg-muted-foreground/30" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-28 rounded-lg bg-primary" />
          <div className="h-8 w-24 rounded-lg border border-border" />
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border p-3 space-y-2">
              <div className="h-6 w-6 rounded-md bg-accent" />
              <div className="h-2 w-full rounded bg-muted-foreground/25" />
              <div className="h-2 w-2/3 rounded bg-muted-foreground/25" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Floating cards */}
    <div className="absolute -left-4 sm:-left-10 bottom-10 rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <TrendingUp className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">Diseñada para</p>
          <p className="text-sm font-semibold text-foreground">captar clientes</p>
        </div>
      </div>
    </div>
    <div className="absolute -right-2 sm:-right-6 -top-5 rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
      <p className="text-xs text-muted-foreground">Web profesional</p>
      <p className="text-sm font-semibold text-foreground">lista en 2–4 semanas</p>
    </div>
  </div>
);

const HeroSection = () => {
  const navigate = useNavigate();

  const openBriefing = () => navigate('/?openBriefing=true');

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32 lg:pt-36 lg:pb-28">
      {/* Soft background */}
      <div className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent_85%)] opacity-70" aria-hidden="true" />
      <div className="absolute -top-40 right-0 h-[480px] w-[480px] rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <span className="eyebrow mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Agencia de marketing digital
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.08] text-foreground sm:text-5xl lg:text-[3.6rem]">
            Webs, apps y marketing que convierten visitas en{' '}
            <span className="text-primary">clientes</span>.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Diseñamos, desarrollamos y medimos tu presencia digital para que tu negocio crezca.
            Un solo equipo para tu web, tu app, tu marca y tus redes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openBriefing}
              className="btn-glow inline-flex items-center justify-center gap-2 text-primary-foreground"
            >
              Pide presupuesto
              <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href={WHATSAPP_GENERAL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
              Escríbenos por WhatsApp
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

          <div className="mt-10 flex flex-wrap gap-2">
            {serviceChips.map((chip) => (
              <span key={chip.label} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/80">
                <chip.icon className="h-3.5 w-3.5 text-primary" />
                {chip.label}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden sm:block">
          <BrowserMockup />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
