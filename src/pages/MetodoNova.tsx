import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
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
import ThemeToggle from "@/components/ThemeToggle";
import InteractiveStars from "@/components/InteractiveStars";
import metodoNovaIcon from "@/assets/metodo-nova-icon.png";

const WHATSAPP_LINK = "https://wa.me/34604948362?text=Hola%20NOVA%2C%20quiero%20información%20sobre%20el%20Método%20NOVA.";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function BenefitCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-border/50 bg-muted/30 p-5 backdrop-blur"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-xl border border-border/50 bg-primary/10 p-3">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-sm text-foreground/70">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function MethodStep({ number, title, description, items, icon: Icon }: { number: string; title: string; description: string; items: string[]; icon: React.ElementType }) {
  return (
    <motion.div variants={fadeUp} className="relative pl-12">
      <div className="absolute left-2 top-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
        {number}
      </div>
      <div className="rounded-2xl border border-border/50 bg-muted/30 p-5 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-border/50 bg-muted/50 p-2">
            <Icon className="h-5 w-5 text-foreground/85" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-foreground/70">{description}</p>
            {items.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MetodoNova() {
  const benefits = [
    { icon: Smartphone, title: "Accesibilidad total", description: "Tu negocio disponible 24/7, desde cualquier lugar y dispositivo. Comprar, reservar o contactar en segundos. Menos fricción = Más ventas." },
    { icon: TrendingUp, title: "Sistema de ventas escalable", description: "Automatizaciones, embudos de venta, integraciones con WhatsApp, pagos y reservas. Tu negocio crece incluso cuando tú no estás." },
    { icon: Brain, title: "Estrategia real", description: "No hacemos páginas bonitas. Creamos máquinas de conversión. Cada elemento está pensado para atraer, convencer y convertir." },
    { icon: Globe, title: "Presencia profesional", description: "Tu marca transmite confianza, autoridad y calidad. Un negocio profesional vende más." },
    { icon: BarChart3, title: "Datos y optimización", description: "Analizamos, medimos y mejoramos continuamente. Decisiones basadas en datos, no en suposiciones." },
    { icon: DollarSign, title: "Más rentabilidad", description: "Menos procesos manuales. Más eficiencia. Más beneficio." },
    { icon: Trophy, title: "Ventaja competitiva", description: "Mientras otros improvisan, tú tienes un sistema sólido." },
  ];

  const methodSteps = [
    { number: "1", title: "Diagnóstico Estratégico", description: "Analizamos tu negocio, tu mercado y tus clientes.", items: ["Oportunidades ocultas", "Puntos de fuga de ventas", "Ventajas competitivas"], icon: Target },
    { number: "2", title: "Arquitectura Digital", description: "Diseñamos tu ecosistema digital.", items: ["Web optimizada", "Embudos de venta", "Automatizaciones", "Canales de contacto", "Integraciones clave"], icon: Layers },
    { number: "3", title: "Experiencia que convierte", description: "Creamos una experiencia clara, rápida y persuasiva. Menos pasos. Más conversiones.", items: [], icon: Zap },
    { number: "4", title: "Activación de ventas", description: "Ponemos el sistema a trabajar.", items: ["Captación de tráfico", "Estrategia de contenidos", "Publicidad optimizada", "Seguimiento de leads"], icon: TrendingUp },
    { number: "5", title: "Optimización constante", description: "Medimos resultados y mejoramos cada fase. Más rendimiento. Más beneficios. Más crecimiento.", items: [], icon: Repeat },
  ];

  const results = [
    { icon: Zap, text: "Un sistema escalable" },
    { icon: DollarSign, text: "Una máquina de ventas" },
    { icon: Globe, text: "Una marca profesional" },
    { icon: TrendingUp, text: "Un proyecto preparado para el futuro" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Interactive Stars - behind everything */}
      <InteractiveStars />

      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0" style={{ zIndex: 1 }}>
        <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.1),transparent_45%),radial-gradient(circle_at_80%_30%,hsl(var(--primary)/0.08),transparent_45%),radial-gradient(circle_at_50%_85%,hsl(var(--primary)/0.05),transparent_50%)" }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Método Nova</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-3xl px-4 pb-20 pt-24" style={{ zIndex: 10 }}>
        {/* HERO */}
        <motion.header variants={stagger} initial="hidden" animate="show" className="space-y-6 text-center">
          <motion.div 
            variants={fadeUp} 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 }}
          >
            <motion.img 
              src={metodoNovaIcon} 
              alt="Método Nova" 
              className="w-28 h-28 object-contain"
              animate={{ 
                y: [0, -8, 0],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-foreground">
            LA VENTAJA NOVA
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xl text-foreground/80">
            Convierte tu negocio en un sistema digital que vende, escala y crece contigo.
          </motion.p>

          <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 bg-muted/30 p-6 backdrop-blur text-left">
            <p className="text-foreground/80">
              Hoy no gana quien tiene el mejor producto.<br />
              <span className="font-semibold text-foreground">Gana quien hace más fácil comprar.</span>
            </p>
            <p className="mt-4 text-foreground/70">
              La digitalización ya no es una opción.<br />
              Es la diferencia entre crecer o quedarse atrás.
            </p>
          </motion.div>
        </motion.header>

        {/* Benefits */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-16 space-y-6">
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-foreground text-center">
            ¿Qué consigue tu negocio al digitalizarse con NOVA?
          </motion.h2>

          <div className="grid gap-4">
            {benefits.map((b, i) => (
              <BenefitCard key={i} icon={b.icon} title={b.title} description={b.description} />
            ))}
          </div>
        </motion.section>

        {/* Results Preview */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-16 space-y-6">
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-foreground text-center">
            El resultado
          </motion.h2>

          <motion.div variants={fadeUp} className="rounded-2xl border border-primary/30 bg-primary/5 p-6 backdrop-blur">
            <p className="text-foreground/80 mb-4">Un negocio que:</p>
            <div className="grid gap-2">
              {["✔ Vende más", "✔ Crece más rápido", "✔ Funciona mejor", "✔ Se ve más profesional", "✔ Está preparado para el futuro"].map((item, i) => (
                <p key={i} className="text-foreground font-semibold">{item}</p>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Method */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-16 space-y-6">
          <motion.div variants={fadeUp} className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={metodoNovaIcon} alt="Método Nova" className="w-16 h-16 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">El Método NOVA</h2>
            <p className="text-foreground/70">Nuestro sistema para hacer crecer tu negocio</p>
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 bg-muted/30 p-5 text-center">
            <p className="text-foreground/80">
              No trabajamos al azar.<br />
              Seguimos un proceso probado que convierte negocios tradicionales en <span className="font-semibold text-foreground">máquinas digitales de ventas</span>.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
            <div className="space-y-4">
              {methodSteps.map((step) => (
                <MethodStep key={step.number} {...step} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Summary */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-16 space-y-6">
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-foreground text-center">
            En resumen
          </motion.h2>

          <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 bg-muted/30 p-6 backdrop-blur">
            <p className="text-foreground/80 mb-4">El Método NOVA convierte tu negocio en:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-foreground font-semibold">
                  <r.icon className="h-4 w-4 text-primary" />
                  <span>{r.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* CTA */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-16">
          <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-8 backdrop-blur text-center">
            <h2 className="text-2xl font-bold text-foreground">
              ⚡ Tu negocio puede crecer más
            </h2>
            <p className="mt-2 text-foreground/80">Nosotros te mostramos cómo</p>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                Cuéntanos tu proyecto
              </a>
              <Link
                to="/#servicios"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-muted/50 px-6 py-3 text-foreground font-semibold hover:bg-muted transition-colors"
              >
                <ArrowRight className="h-5 w-5" />
                Haz crecer tu negocio hoy
              </Link>
            </div>

            <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
          </motion.div>
        </motion.section>
      </main>

      <ThemeToggle variant="floating" />
    </div>
  );
}
