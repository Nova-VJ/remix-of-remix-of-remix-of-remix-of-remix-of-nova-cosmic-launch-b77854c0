import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Check, Globe, Mail, MessageCircle, Palette, ShieldCheck, Sparkles, Star, Wrench } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

// Plan Web por suscripción (19-10-2026): el producto estrella y el gancho principal de la web y de las propuestas.
// No se contrata en el carrito (no hay pasarela): primero evaluamos el proyecto, por el formulario o por WhatsApp.
// 25,99 € al mes con IVA incluido y sin permanencia (decisión del usuario, 19-10-2026: a particulares se les muestra
// siempre el precio total). Si cambia algo aquí, cambiarlo también en
// el conocimiento de Sara (supabase/functions/sara-chat/knowledge.ts) y en Lupa (worker/systems.js).
const WHATSAPP_PLAN = "https://wa.me/34659343822?text=" + encodeURIComponent('Hola NOVA, me interesa el Plan Web de 25,99 €/mes. Mi negocio es: _____');

const includes = [
  { icon: Globe, title: 'Web profesional a medida', text: 'Diseñada para tu negocio, rápida en el móvil y preparada para Google.' },
  { icon: Bot, title: 'Asistente virtual 24/7', text: 'Responde dudas y recoge los datos de tus clientes, también de noche y en festivos.' },
  { icon: Palette, title: 'Branding de tu marca', text: 'Logo, colores y estilo propios para que te reconozcan a la primera.' },
  { icon: Mail, title: 'Correo profesional', text: 'info@tunegocio.es: la imagen seria que tu negocio merece.' },
  { icon: ShieldCheck, title: 'Dominio, alojamiento y seguridad', text: 'Todo incluido, con certificado de seguridad y sin avisos de «No es seguro».' },
  { icon: Wrench, title: 'Mantenimiento y 1 cambio al mes', text: 'Copias de seguridad, actualizaciones y un cambio de contenido cada mes.' },
];

const steps = [
  { title: 'Cuéntanos tu negocio', text: 'Por el formulario o por WhatsApp, en dos minutos.' },
  { title: 'Evaluamos tu proyecto', text: 'Sin compromiso: te enseñamos cómo sería tu web y tu asistente.' },
  { title: 'Lo creamos y lo cuidamos', text: 'Tú te ocupas de tu negocio; tu web trabaja para ti.' },
];

// Vista decorativa del producto: la web del cliente con su asistente respondiendo de noche (ilustración, no un caso real)
const ProductPreview = () => (
  <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
    <div className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,hsl(262_85%_68%/0.45),transparent_60%)] blur-2xl" />
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] shadow-2xl backdrop-blur">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="ml-3 flex-1 rounded-md bg-white/10 px-2 text-[10px] leading-5 text-white/60">tunegocio.es</span>
      </div>
      <div className="space-y-2 px-5 pt-5">
        <div className="h-3 w-3/4 rounded bg-white/80" />
        <div className="h-3 w-1/2 rounded bg-white/80" />
        <div className="h-2 w-2/3 rounded bg-white/25" />
        <div className="mt-3 h-6 w-24 rounded-md bg-[hsl(262_80%_62%)]" />
      </div>
      <div className="m-4 mt-6 rounded-xl border border-white/10 bg-[hsl(245_40%_9%/0.85)] p-3">
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(262_80%_62%)] text-white"><Bot className="h-4 w-4" /></span>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-white">Tu asistente</p>
            <p className="flex items-center gap-1 text-[10px] text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />En línea · 23:47</p>
          </div>
        </div>
        <div className="mt-3 space-y-2 text-[11px] leading-snug">
          <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-white/90 px-3 py-2 text-slate-900">Hola, ¿tenéis hueco mañana?</p>
          <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-[hsl(262_80%_62%)] px-3 py-2 text-white">¡Hola! Mañana tenemos a las 10:30 o a las 17:00. ¿Te dejo la cita reservada?</p>
        </div>
      </div>
    </div>
    <div className="absolute -bottom-4 -left-4 rounded-xl border border-white/15 bg-white px-3 py-2 shadow-xl motion-safe:animate-nova-float">
      <p className="text-[10px] font-medium text-slate-500">Mientras tú descansas</p>
      <p className="text-xs font-bold text-slate-900">tu web sigue atendiendo</p>
    </div>
  </div>
);

const SubscriptionSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const navigate = useNavigate();

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
                  Nuestro producto estrella
                </span>

                <h2 className="mt-5 text-3xl font-extrabold leading-[1.1] sm:text-[2.75rem]">
                  Tu negocio, abierto las 24 horas.
                  <span className="mt-1 block pb-[0.15em] bg-gradient-to-r from-[hsl(270_95%_80%)] via-[hsl(300_90%_80%)] to-[hsl(215_95%_78%)] bg-clip-text text-transparent">
                    Sin pagar de golpe.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                  Te creamos una web a medida con tu marca y ponemos a trabajar un asistente virtual que atiende a tus clientes
                  mientras tú descansas. Tú te ocupas de tu negocio; nosotros, de que todo funcione y esté al día.
                </p>

                <div className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-6xl font-extrabold tracking-tight">25,99 €</span>
                    <span className="text-lg font-medium text-white/60">/mes</span>
                    <span className="text-sm font-medium text-white/60">IVA incluido</span>
                  </div>
                  <p className="pb-2 text-sm text-white/70">
                    <span className="font-semibold text-white">Menos de lo que cuesta un café al día.</span><br />
                    Web, asistente, marca, correo y alojamiento en una sola cuota.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate('/?openBriefing=true')}
                    className="group inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full bg-white py-2 pl-7 pr-2 text-base font-semibold text-slate-900 shadow-[0_10px_30px_-10px_hsl(0_0%_100%/0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_hsl(0_0%_100%/0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(245_40%_11%)]"
                  >
                    Quiero mi Plan Web
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
                    Hablar por WhatsApp
                  </a>
                </div>

                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/70">
                  {['Sin permanencia', 'Evaluación sin compromiso', 'Respuesta en 24 h'].map((t) => (
                    <li key={t} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-300" />{t}</li>
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
                <Sparkles className="h-4 w-4 text-[hsl(270_95%_80%)]" /> Todo incluido en tu cuota
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {includes.map((item) => (
                  <li key={item.title} className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors duration-200 hover:border-white/25 hover:bg-white/[0.07]">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(262_80%_62%)] to-[hsl(225_85%_58%)] text-white shadow-lg">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/65">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Cómo empezar */}
              <ol className="mt-10 grid gap-6 sm:grid-cols-3">
                {steps.map((s, i) => (
                  <li key={s.title} className="relative">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-sm font-bold">{i + 1}</span>
                      {i < steps.length - 1 && <span className="hidden h-px flex-1 bg-gradient-to-r from-white/30 to-transparent sm:block" aria-hidden="true" />}
                    </div>
                    <p className="mt-3 font-semibold text-white">{s.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/65">{s.text}</p>
                  </li>
                ))}
              </ol>

              <p className="mt-10 text-xs leading-relaxed text-white/45">
                Primero evaluamos tu proyecto, sin compromiso; por eso el Plan Web se pide por el formulario o por WhatsApp,
                no desde el presupuesto online. El cambio mensual no es acumulable. El código NOVA20 no se aplica a la suscripción.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
