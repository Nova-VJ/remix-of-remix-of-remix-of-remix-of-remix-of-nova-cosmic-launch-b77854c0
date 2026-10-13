import SEOHead from "@/components/SEOHead";
import { SEO_PAGES } from "@/config/seo";
import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  Smartphone,
  TrendingUp,
  Brain,
  Globe,
  BarChart3,
  DollarSign,
  Trophy,
  CheckCircle2,
  Target,
  Layers,
  Zap,
  Repeat,
  MessageCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import NovaMethodIcon from "@/components/NovaMethodIcon";
import { useSpotlight } from "@/hooks/use-spotlight";

const WHATSAPP_LINK = "https://wa.me/34659343822?text=Hola%20NOVA%2C%20quiero%20información%20sobre%20el%20Método%20NOVA.";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.15 } } as const;

const benefits = [
  { icon: Smartphone, title: "Accesibilidad total", description: "Tu negocio disponible 24/7, desde cualquier lugar y dispositivo. Comprar, reservar o contactar en segundos. Menos fricción = Más ventas." },
  { icon: TrendingUp, title: "Sistema de ventas escalable", description: "Automatizaciones, embudos de venta, integraciones con WhatsApp, pagos y reservas. Tu negocio crece incluso cuando tú no estás." },
  { icon: Brain, title: "Estrategia real", description: "No hacemos páginas bonitas. Creamos máquinas de conversión. Cada elemento está pensado para atraer, convencer y convertir." },
  { icon: Globe, title: "Presencia profesional", description: "Tu marca transmite confianza, autoridad y calidad. Un negocio profesional vende más." },
  { icon: BarChart3, title: "Datos y optimización", description: "Analizamos, medimos y mejoramos continuamente. Decisiones basadas en datos, no en suposiciones." },
  { icon: DollarSign, title: "Más rentabilidad", description: "Menos procesos manuales. Más eficiencia. Más beneficio." },
];

const competitiveEdge = { icon: Trophy, title: "Ventaja competitiva", description: "Mientras otros improvisan, tú tienes un sistema sólido." };

const methodSteps = [
  { number: "1", title: "Diagnóstico Estratégico", description: "Analizamos tu negocio, tu mercado y tus clientes.", items: ["Oportunidades ocultas", "Puntos de fuga de ventas", "Ventajas competitivas"], icon: Target },
  { number: "2", title: "Arquitectura Digital", description: "Diseñamos tu ecosistema digital.", items: ["Web optimizada", "Embudos de venta", "Automatizaciones", "Canales de contacto", "Integraciones clave"], icon: Layers },
  { number: "3", title: "Experiencia que convierte", description: "Creamos una experiencia clara, rápida y persuasiva. Menos pasos. Más conversiones.", items: [], icon: Zap },
  { number: "4", title: "Activación de ventas", description: "Ponemos el sistema a trabajar.", items: ["Captación de tráfico", "Estrategia de contenidos", "Publicidad optimizada", "Seguimiento de leads"], icon: TrendingUp },
  { number: "5", title: "Optimización constante", description: "Medimos resultados y mejoramos cada fase. Más rendimiento. Más beneficios. Más crecimiento.", items: [], icon: Repeat },
];

const outcomes = ["Vende más", "Crece más rápido", "Funciona mejor", "Se ve más profesional", "Está preparado para el futuro"];

const results = [
  { icon: Zap, text: "Un sistema escalable" },
  { icon: DollarSign, text: "Una máquina de ventas" },
  { icon: Globe, text: "Una marca profesional" },
  { icon: TrendingUp, text: "Un proyecto preparado para el futuro" },
];

function BenefitCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <motion.div variants={fadeUp} className="glass-card spotlight hover-lift p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </motion.div>
  );
}

function MethodStep({ number, title, description, items, icon: Icon, last }: (typeof methodSteps)[number] & { last: boolean }) {
  return (
    <motion.li variants={fadeUp} className="relative grid grid-cols-[3rem_1fr] gap-4 sm:gap-6">
      <div className="relative flex justify-center">
        <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
          {number}
        </span>
        {!last && <span className="absolute bottom-[-1.5rem] top-12 w-px bg-gradient-to-b from-primary/50 to-border" aria-hidden="true" />}
      </div>
      <div className="glass-card mb-6 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
        </div>
        <p className="mt-2 text-muted-foreground">{description}</p>
        {items.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {items.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-foreground/80">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.li>
  );
}

export default function MetodoNova() {
  useSpotlight();

  return (
    // Skip motion animations for visitors who ask for reduced motion
    <MotionConfig reducedMotion="user">
      <SEOHead {...SEO_PAGES["/metodo-nova"]} />
      <Navbar />

      <main className="bg-background text-foreground">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 md:pb-24 md:pt-36">
          <div className="absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden="true" />
          <div className="absolute left-1/2 top-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />

          <motion.div variants={stagger} initial="hidden" animate="show" className="relative mx-auto max-w-3xl text-center">
            <div className="flex justify-center">
              <NovaMethodIcon size={104} />
            </div>

            <motion.p variants={fadeUp} className="eyebrow mt-8">Método NOVA</motion.p>
            <motion.h1 variants={fadeUp} className="mt-3 text-4xl font-extrabold leading-[1.1] text-foreground sm:text-5xl md:text-6xl">
              La ventaja <span className="text-primary">NOVA</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Convierte tu negocio en un sistema digital que vende, escala y crece contigo.
            </motion.p>

            <motion.figure variants={fadeUp} className="glass-card mx-auto mt-10 max-w-2xl p-6 text-left sm:p-8">
              <div className="absolute inset-y-0 left-0 w-1 bg-primary" aria-hidden="true" />
              <p className="text-lg text-foreground/80">
                Hoy no gana quien tiene el mejor producto.{" "}
                <span className="font-semibold text-foreground">Gana quien hace más fácil comprar.</span>
              </p>
              <p className="mt-3 text-muted-foreground">
                La digitalización ya no es una opción. Es la diferencia entre crecer o quedarse atrás.
              </p>
            </motion.figure>
          </motion.div>
        </section>

        {/* Benefits */}
        <section className="px-4 py-20 sm:px-6 md:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeader eyebrow="Beneficios" title="¿Qué consigue tu negocio al digitalizarse con NOVA?" />
            <motion.div variants={stagger} {...inView} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <BenefitCard key={b.title} {...b} />
              ))}
              <motion.div
                variants={fadeUp}
                className="relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl p-6 text-white sm:col-span-2 sm:flex-row sm:items-center lg:col-span-3"
                style={{ backgroundImage: "var(--gradient-purple)" }}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <competitiveEdge.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">{competitiveEdge.title}</h3>
                  <p className="mt-1 text-white/85">{competitiveEdge.description}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Method */}
        <section className="border-y border-border bg-muted/40 px-4 py-20 sm:px-6 md:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 flex flex-col items-center text-center">
              <NovaMethodIcon size={68} onView />
              <h2 className="mt-6 text-3xl font-bold leading-tight text-foreground md:text-4xl">El Método NOVA</h2>
              <p className="mt-3 text-lg text-muted-foreground">Nuestro sistema para hacer crecer tu negocio</p>
              <p className="mt-6 max-w-xl text-foreground/80">
                No trabajamos al azar. Seguimos un proceso probado que convierte negocios tradicionales en{" "}
                <span className="font-semibold text-foreground">máquinas digitales de ventas</span>.
              </p>
            </div>

            <motion.ol variants={stagger} {...inView}>
              {methodSteps.map((step, i) => (
                <MethodStep key={step.number} {...step} last={i === methodSteps.length - 1} />
              ))}
            </motion.ol>
          </div>
        </section>

        {/* Result + summary */}
        <section className="px-4 py-20 sm:px-6 md:py-24">
          <motion.div variants={stagger} {...inView} className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
            <motion.div variants={fadeUp} className="glass-card p-6 sm:p-8">
              <p className="eyebrow">El resultado</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">Un negocio que…</h2>
              <ul className="mt-5 space-y-3">
                {outcomes.map((item) => (
                  <li key={item} className="flex items-center gap-3 font-semibold text-foreground">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="glass-card p-6 sm:p-8">
              <p className="eyebrow">En resumen</p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">El Método NOVA convierte tu negocio en:</h2>
              <ul className="mt-5 space-y-3">
                {results.map((r) => (
                  <li key={r.text} className="flex items-center gap-3 font-semibold text-foreground">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                      <r.icon className="h-4 w-4" />
                    </span>
                    {r.text}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20 sm:px-6 md:pb-28">
          <motion.div
            variants={fadeUp}
            {...inView}
            className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 md:py-20"
            style={{ backgroundImage: "var(--gradient-cosmic)" }}
          >
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold text-white md:text-5xl">Tu negocio puede crecer más</h2>
              <p className="mt-4 text-lg text-white/75 md:text-xl">Nosotros te mostramos cómo.</p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-[hsl(var(--nova-ink))] shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  Cuéntanos tu proyecto
                </a>
                <Link
                  to="/#servicios"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Haz crecer tu negocio hoy
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </MotionConfig>
  );
}
