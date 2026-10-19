import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Check, Globe, Mail, MessageCircle, Palette, ShieldCheck, Wrench } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

// Plan Web por suscripción (19-10-2026): el gancho principal de la web y de las propuestas.
// No se contrata en el carrito (no hay pasarela): primero evaluamos el proyecto, por el formulario o por WhatsApp.
// Si cambia algo aquí, cambiarlo también en el conocimiento de Sara (supabase/functions/sara-chat/knowledge.ts) y en Lupa.
const WHATSAPP_PLAN = "https://wa.me/34659343822?text=" + encodeURIComponent('Hola NOVA, me interesa el Plan Web de 25,99 €/mes. Mi negocio es: _____');

const includes = [
  { icon: Globe, title: 'Tu web profesional a medida', text: 'Personalizada, adaptada al móvil y preparada para Google.' },
  { icon: Bot, title: 'Asistente virtual 24/7', text: 'Atiende a tus clientes, resuelve dudas y recoge sus datos a cualquier hora, también de noche y en festivos.' },
  { icon: Palette, title: 'Branding de tu marca', text: 'Tu logo, tus colores y tu estilo propios.' },
  { icon: Mail, title: 'Correo profesional', text: 'Con tu dominio: info@tunegocio.es, en vez de un Gmail.' },
  { icon: ShieldCheck, title: 'Dominio, alojamiento y seguridad', text: 'Incluidos, con certificado de seguridad: sin avisos de «No es seguro».' },
  { icon: Wrench, title: 'Mantenimiento y 1 cambio al mes', text: 'Copias de seguridad, actualizaciones y un cambio de contenido cada mes.' },
];

const steps = [
  { n: '1', title: 'Cuéntanos tu negocio', text: 'Por el formulario o por WhatsApp, en dos minutos.' },
  { n: '2', title: 'Evaluamos tu proyecto', text: 'Sin compromiso: te decimos cómo sería tu web y tu asistente.' },
  { n: '3', title: 'Te la creamos y la cuidamos', text: 'Tú te ocupas de tu negocio; nosotros, de que tu web trabaje para ti.' },
];

const SubscriptionSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const navigate = useNavigate();

  return (
    <section id="plan-web" ref={ref} className="relative scroll-mt-24 py-16 sm:py-20">
      <div className={`mx-auto max-w-6xl px-4 transition-all duration-700 sm:px-6 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-card shadow-[0_30px_80px_-30px_hsl(262_60%_30%/0.45)]">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,hsl(262_85%_68%/0.25),transparent_65%)]" aria-hidden="true" />

          <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                Nuevo · sin pagar de golpe
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
                Plan Web: tu web y tu asistente 24/7, <span className="text-gradient">todo incluido</span>
              </h2>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-5xl font-extrabold text-foreground sm:text-6xl">25,99 €</span>
                <span className="pb-2 text-lg font-semibold text-muted-foreground">al mes</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-primary">Menos de lo que cuesta un café al día.</p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Te creamos tu web con tu marca, ponemos a trabajar un asistente virtual que atiende a tus clientes día y noche,
                y lo mantenemos todo al día por ti. Tú solo te ocupas de tu negocio.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => navigate('/?openBriefing=true')} className="btn-glow inline-flex items-center justify-center gap-2 text-primary-foreground">
                  Quiero mi Plan Web
                  <ArrowRight className="h-5 w-5" />
                </button>
                <a
                  href={WHATSAPP_PLAN}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-accent"
                >
                  <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  Pregúntanos por WhatsApp
                </a>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Primero evaluamos tu proyecto, sin compromiso; por eso el Plan Web no se contrata desde el presupuesto online.
                El cambio mensual no es acumulable. El código NOVA20 no se aplica a la suscripción.
              </p>
            </div>

            <div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {includes.map((item) => (
                  <li key={item.title} className="flex gap-3 rounded-2xl border border-border bg-background/60 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        <Check className="h-4 w-4 text-emerald-500" />
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <ol className="mt-6 grid gap-3 sm:grid-cols-3">
                {steps.map((s) => (
                  <li key={s.n} className="rounded-2xl bg-accent/60 p-4">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{s.n}</span>
                    <p className="mt-2 text-sm font-semibold text-foreground">{s.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
