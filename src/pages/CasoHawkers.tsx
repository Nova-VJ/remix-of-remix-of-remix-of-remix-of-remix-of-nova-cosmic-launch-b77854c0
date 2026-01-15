import React, { useEffect, useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Flame,
  Brain,
  Trophy,
  TrendingUp,
  Heart,
  Globe,
  Repeat,
  Quote,
  ArrowRight,
  CheckCircle2,
  ChevronUp,
  ListOrdered,
  Eye,
  EyeOff,
  X,
  Menu,
  ChevronRight,
  Zap,
  RefreshCw,
  BarChart3,
  Play,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

// Images
import hawkersPortada from "@/assets/hawkers-portada.jpg";
import hawkersMessi1 from "@/assets/hawkers-messi-1.webp";
import hawkersMessi2 from "@/assets/hawkers-messi-2.jpg";

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

/* -------------------- UI atoms -------------------- */

function Chip({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-xs text-foreground/80 backdrop-blur">
      <Icon className="h-3.5 w-3.5 text-foreground/80" />
      {children}
    </span>
  );
}

function Callout({
  icon: Icon,
  title,
  children,
  tone = "default",
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  tone?: "default" | "warning" | "success" | "info";
}) {
  const toneClasses =
    tone === "warning"
      ? "border-yellow-400/20 bg-yellow-500/10"
      : tone === "success"
      ? "border-emerald-400/20 bg-emerald-500/10"
      : tone === "info"
      ? "border-sky-400/20 bg-sky-500/10"
      : "border-border/50 bg-muted/30";

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 backdrop-blur",
        toneClasses
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl border border-border/50 bg-muted/50 p-2">
          <Icon className="h-5 w-5 text-foreground/85" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <div className="mt-2 text-sm leading-relaxed text-foreground/75">
            {children}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
    </motion.div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="rounded-2xl border border-border/50 bg-muted/30 p-5 backdrop-blur"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-foreground/55">
            {label}
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-muted/50 p-3">
          <Icon className="h-5 w-5 text-foreground/85" />
        </div>
      </div>
    </motion.div>
  );
}

function Lesson({
  index,
  title,
  icon: Icon,
  bullets,
  highlight,
}: {
  index: string;
  title: string;
  icon: React.ElementType;
  bullets: string[];
  highlight: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/30 p-6 backdrop-blur"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-border/50 bg-muted/50 p-2.5">
          <Icon className="h-5 w-5 text-foreground/85" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground/55">
            <span className="font-semibold text-foreground/80">{index}</span>{" "}
            <span className="mx-2 text-foreground/25">•</span> Lección
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">{title}</h3>
          <ul className="mt-4 space-y-2 text-sm text-foreground/75">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-foreground/55" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl border border-border/50 bg-background/50 p-4">
            <p className="text-sm font-semibold text-foreground/90">Idea clave</p>
            <p className="mt-1 text-sm text-foreground/75">{highlight}</p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}

/* -------------------- utilities -------------------- */

function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 30 });
  const width = useTransform(smooth, (v) => `${Math.round(v * 100)}%`);

  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full bg-muted/50">
      <motion.div className="h-full bg-primary/60" style={{ width }} />
    </div>
  );
}

function StickyCTA() {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-2xl border border-border/50 bg-background/80 p-3 backdrop-blur"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="rounded-xl border border-border/50 bg-muted/50 p-2">
            <Sparkles className="h-4 w-4 text-foreground/85" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              ¿Quieres tu propia historia de éxito?
            </p>
            <p className="truncate text-xs text-foreground/65">
              Marca + web + estrategia para crecer.
            </p>
          </div>
        </div>
        <a
          href="#cta"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border/50 bg-muted/50 px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
        >
          Empezar <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    </div>
  );
}

function TypingLine({
  text,
  speed = 18,
  className = "",
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    setI(0);
    const id = window.setInterval(() => {
      setI((prev) => {
        if (prev >= text.length) {
          window.clearInterval(id);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);

  return (
    <div className={cn("font-semibold text-foreground", className)}>
      <span>{text.slice(0, i)}</span>
      <motion.span
        aria-hidden
        initial={{ opacity: 0.2 }}
        animate={{ opacity: [0.2, 0.9, 0.2] }}
        transition={{ duration: 0.9, repeat: Infinity }}
        className="ml-0.5 inline-block w-[10px]"
      >
        |
      </motion.span>
    </div>
  );
}

function ScrollToTop({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-4 z-50 inline-flex items-center gap-2 rounded-2xl border border-border/50 bg-background/80 px-3 py-2 text-sm font-semibold text-foreground backdrop-blur hover:bg-muted"
        >
          <ChevronUp className="h-4 w-4" />
          Arriba
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function ReadingModeToggle({
  readingMode,
  setReadingMode,
}: {
  readingMode: boolean;
  setReadingMode: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => setReadingMode(!readingMode)}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition",
        readingMode
          ? "border-border bg-foreground text-background hover:bg-foreground/90"
          : "border-border/50 bg-muted/50 text-foreground hover:bg-muted"
      )}
    >
      {readingMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      {readingMode ? "Salir" : "Lectura"}
    </button>
  );
}

/* -------------------- mobile TOC drawer -------------------- */

function MobileTOC({
  open,
  onClose,
  sections,
  activeId,
  onJump,
}: {
  open: boolean;
  onClose: () => void;
  sections: { id: string; label: string; icon?: React.ElementType }[];
  activeId: string;
  onJump: (id: string) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-[70] rounded-t-3xl border border-border/50 bg-background p-4"
            style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
          >
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl border border-border/50 bg-muted/50 p-2">
                    <ListOrdered className="h-4 w-4 text-foreground/85" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Ir a sección</p>
                    <p className="text-xs text-foreground/60">La sección activa se resalta</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl border border-border/50 bg-muted/50 p-2 text-foreground/80 hover:bg-muted"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 grid gap-2 max-h-[50vh] overflow-y-auto">
                {sections.map((s) => {
                  const isActive = s.id === activeId;
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        onJump(s.id);
                        onClose();
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
                        isActive
                          ? "border-primary/30 bg-primary/10 text-foreground"
                          : "border-border/50 bg-muted/30 text-foreground/80 hover:bg-muted/50"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        {Icon ? (
                          <span className="rounded-xl border border-border/50 bg-background/50 p-2">
                            <Icon className="h-4 w-4 text-foreground/80" />
                          </span>
                        ) : null}
                        <span className="text-sm font-semibold">{s.label}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-foreground/30" />
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* -------------------- content blocks -------------------- */

function FlowTimeline() {
  const steps = useMemo(
    () => [
      { t: "Idea", d: "Detecta una oportunidad real.", i: Lightbulb },
      { t: "Marca", d: "Define identidad y promesa.", i: Sparkles },
      { t: "Redes", d: "Visibilidad constante y contenido.", i: Globe },
      { t: "Comunidad", d: "Conexión + pertenencia.", i: Heart },
      { t: "Ventas", d: "Conversión con mensajes claros.", i: TrendingUp },
      { t: "Expansión", d: "Escala lo que ya funciona.", i: Trophy },
    ],
    []
  );

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-border/50 bg-muted/30 p-6 backdrop-blur"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">Flujo Hawkers</h3>
        <Chip icon={Repeat}>Escalable</Chip>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {steps.map((s, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="relative rounded-2xl border border-border/50 bg-background/50 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-border/50 bg-muted/50 p-2">
                <s.i className="h-4 w-4 text-foreground/85" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{s.t}</p>
                <p className="mt-1 text-xs text-foreground/65">{s.d}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function TableBlock() {
  const items = [
    { k: "Producto", v: "Gafas modernas, accesibles, con estilo", i: Lightbulb },
    { k: "Canal", v: "Instagram + anuncios", i: Globe },
    { k: "Público", v: "Jóvenes digitales", i: Heart },
    { k: "Mensaje", v: "Actitud, identidad, comunidad", i: Sparkles },
  ];

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-border/50 bg-muted/30 p-6 backdrop-blur"
    >
      <h3 className="text-base font-semibold text-foreground">
        Enfoque inicial (simple y efectivo)
      </h3>
      <div className="mt-4 grid gap-3">
        {items.map((row, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 rounded-2xl border border-border/50 bg-background/50 p-4"
          >
            <div className="rounded-xl border border-border/50 bg-muted/50 p-2">
              <row.i className="h-4 w-4 text-foreground/85" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-foreground/55">
                {row.k}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">{row.v}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* -------------------- Timeline Vertical -------------------- */

function VerticalTimeline() {
  const milestones = [
    { year: "2013", title: "Nacimiento", desc: "Proyecto español, enfoque digital, cero tiendas físicas.", icon: Sparkles },
    { year: "Primeros pasos", title: "Validación online", desc: "Demostraron que se podía vender sin intermediarios.", icon: Lightbulb },
    { year: "2016", title: "Identidad", desc: "Campañas emocionales. Construcción de comunidad.", icon: Heart },
    { year: "2016", title: "Crisis", desc: "Error en redes. Aprendieron a proteger la marca.", icon: AlertTriangle },
    { year: "Escala", title: "Consolidación", desc: "Colaboraciones, expansión, autoridad.", icon: Trophy },
  ];

  return (
    <motion.div variants={fadeUp} className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-border/30 to-transparent" />
      
      <div className="space-y-6">
        {milestones.map((m, idx) => (
          <motion.div key={idx} variants={fadeUp} className="relative pl-12">
            <div className="absolute left-2 top-2 h-4 w-4 rounded-full border-2 border-primary bg-background" />
            
            <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="rounded-xl border border-border/50 bg-muted/50 p-2">
                  <m.icon className="h-4 w-4 text-foreground/85" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-primary">{m.year}</p>
                  <h4 className="mt-1 text-sm font-semibold text-foreground">{m.title}</h4>
                  <p className="mt-1 text-xs text-foreground/65">{m.desc}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div variants={fadeUp} className="mt-6 pl-12">
        <div className="rounded-xl border border-border/50 bg-background/50 px-4 py-3">
          <p className="text-sm font-semibold text-foreground/90">
            <span className="text-primary">Aprende</span> → <span className="text-primary">Ajusta</span> → <span className="text-primary">Escala</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------- Video Embed -------------------- */

function VideoEmbed({ url, title, description }: { url: string; title: string; description: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-border/50 bg-muted/30 p-5 backdrop-blur"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-xl border border-border/50 bg-muted/50 p-2">
          <Play className="h-4 w-4 text-foreground/85" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-foreground/65">{description}</p>
        </div>
      </div>
      
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/50">
        <iframe
          src={url}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </motion.div>
  );
}

/* -------------------- Messi Gallery -------------------- */

function MessiGallery() {
  return (
    <motion.div variants={fadeUp} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border/50 overflow-hidden">
          <img src={hawkersMessi1} alt="Messi con gafas Hawkers" className="w-full h-full object-cover" />
        </div>
        <div className="rounded-2xl border border-border/50 overflow-hidden">
          <img src={hawkersMessi2} alt="Messi perfil con gafas Hawkers" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-primary">Colección exclusiva Messi & Hawkers</p>
      </div>
    </motion.div>
  );
}

/* -------------------- Page -------------------- */

export default function CasoHawkers() {
  const [showSticky, setShowSticky] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const [activeId, setActiveId] = useState("hero");
  const [tocOpen, setTocOpen] = useState(false);

  const sections = useMemo(
    () => [
      { id: "hero", label: "Portada", icon: Sparkles },
      { id: "intro", label: "Introducción", icon: AlertTriangle },
      { id: "chispa", label: "La chispa", icon: Zap },
      { id: "giro", label: "El giro", icon: RefreshCw },
      { id: "origen", label: "El origen", icon: Lightbulb },
      { id: "crecimiento", label: "El crecimiento", icon: Flame },
      { id: "caidas", label: "Caídas y expansión", icon: BarChart3 },
      { id: "videos", label: "Videos", icon: Play },
      { id: "timeline", label: "Momentos clave", icon: ListOrdered },
      { id: "lecciones", label: "5 lecciones", icon: Brain },
      { id: "cierre", label: "Conclusión", icon: Trophy },
      { id: "cta", label: "CTA final", icon: ArrowRight },
    ],
    []
  );

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("cta");
      if (el) {
        const rect = el.getBoundingClientRect();
        setShowSticky(rect.top > window.innerHeight * 0.75);
      }
      setShowTop(window.scrollY > 700);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { threshold: [0.2, 0.35, 0.5, 0.65, 0.8], rootMargin: "-15% 0px -65% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  const textSize = readingMode ? "text-[16.5px] sm:text-[18px]" : "text-[14.5px] sm:text-[15.5px]";
  const lineHeight = "leading-relaxed";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgress />
      {showSticky && <StickyCTA />}
      <ScrollToTop show={showTop} />

      <MobileTOC
        open={tocOpen}
        onClose={() => setTocOpen(false)}
        sections={sections}
        activeId={activeId}
        onJump={jumpTo}
      />

      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className={cn(
            "absolute inset-0 opacity-70 transition-opacity duration-300",
            readingMode ? "opacity-35" : "opacity-70"
          )}
          style={{
            background:
              "radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.15),transparent_45%),radial-gradient(circle_at_80%_30%,hsl(var(--primary)/0.10),transparent_45%),radial-gradient(circle_at_50%_85%,hsl(var(--primary)/0.08),transparent_50%)",
          }}
        />
      </div>

      {/* Mobile-first top controls */}
      <div className="fixed inset-x-0 top-2 z-[55] px-3" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 rounded-2xl border border-border/50 bg-background/80 p-2 backdrop-blur">
          <div className="flex items-center gap-2">
            <Link
              to="/casos-exito"
              className="inline-flex items-center gap-1 rounded-xl border border-border/50 bg-muted/50 px-2 py-2 text-sm text-foreground/80 hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setTocOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-muted/50 px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              <Menu className="h-4 w-4" />
              Secciones
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-xs text-foreground/55">
              En: <span className="text-foreground/80 font-semibold">{sections.find(s => s.id === activeId)?.label}</span>
            </div>
            <ReadingModeToggle readingMode={readingMode} setReadingMode={setReadingMode} />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <main className="relative mx-auto max-w-3xl px-4 pb-28 pt-24">
        {/* HERO */}
        <motion.header id="hero" variants={stagger} initial="hidden" animate="show" className="space-y-6">
          {/* Portada Image */}
          <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 overflow-hidden">
            <img src={hawkersPortada} alt="Hawkers productos" className="w-full h-auto" />
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            <Chip icon={Sparkles}>Caso real</Chip>
            <Chip icon={TrendingUp}>Crecimiento</Chip>
            <Chip icon={Brain}>Lecciones prácticas</Chip>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-3xl font-semibold leading-tight sm:text-4xl">
            Hawkers: de una idea simple a una marca global
          </motion.h1>

          <motion.div variants={fadeUp} className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Punto de partida" value="Sin inversores" icon={AlertTriangle} />
            <StatCard label="Estrategia" value="100% digital" icon={Globe} />
            <StatCard label="Clave" value="Marca + comunidad" icon={Heart} />
          </motion.div>

          {/* Typing hook */}
          <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 bg-muted/30 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-foreground/55">Gancho (retención)</p>
            <div className="mt-2">
              <TypingLine
                text="La gente no compra productos. Compra cómo se siente al usarlos."
                speed={18}
                className="text-base sm:text-lg"
              />
            </div>
            <p className={cn("mt-3 text-foreground/70", textSize, lineHeight)}>
              Esta idea explica por qué Hawkers pudo escalar tan rápido: construyó identidad, no solo catálogo.
            </p>
          </motion.div>
        </motion.header>

        {/* INTRO */}
        <motion.section id="intro" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            🌍 Introducción: el miedo a dar el primer paso
          </motion.h2>
          <motion.div variants={fadeUp} className={cn("text-foreground/75 space-y-4", textSize, lineHeight)}>
            <p>La mayoría de proyectos no fallan por falta de ideas.</p>
            <p><span className="font-semibold text-foreground">Fallan por miedo.</span></p>
            <p>Miedo a equivocarse.<br/>Miedo a no vender.<br/>Miedo a no saber por dónde empezar.</p>
            <p>Muchos emprendedores esperan "el momento perfecto".<br/>Hawkers nació justo en el momento imperfecto.</p>
          </motion.div>

          <Callout icon={AlertTriangle} title="Verdad incómoda" tone="warning">
            No tenían inversores.<br/>No tenían contactos en moda.<br/>No tenían experiencia previa en grandes marcas.<br/><br/>
            Tenían algo más poderoso: <span className="font-semibold text-foreground">hambre, curiosidad y acción</span>.
          </Callout>

          <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 bg-background/50 p-5">
            <p className="text-sm font-semibold text-foreground">Mini-ejercicio</p>
            <p className={cn("mt-2 text-foreground/75", textSize, lineHeight)}>
              Si hoy empezaras…<br/>¿Venderías primero <span className="font-semibold text-foreground">un producto</span> o <span className="font-semibold text-foreground">una promesa clara</span>?
            </p>
          </motion.div>
        </motion.section>

        {/* LA CHISPA */}
        <motion.section id="chispa" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            ⚡ La chispa: antes de Hawkers
          </motion.h2>
          <motion.div variants={fadeUp} className={cn("text-foreground/75 space-y-4", textSize, lineHeight)}>
            <p>Esta historia no empieza con unas gafas.<br/>Empieza con un <span className="font-semibold text-foreground">fracaso</span>.</p>
            <p>Antes de Hawkers, sus fundadores intentaron lanzar otros proyectos online.<br/>Ninguno funcionó como esperaban.<br/>Hubo pérdidas.<br/>Hubo dudas.<br/>Hubo errores.</p>
            <p>La mayoría se habría rendido.</p>
            <p>Ellos hicieron lo contrario: <span className="font-semibold text-foreground">analizar, aprender y pivotar</span>.</p>
          </motion.div>

          <Callout icon={Zap} title="Lección temprana" tone="success">
            Emprender no es acertar a la primera.<br/>Es <span className="font-semibold text-foreground">ajustar sin rendirse</span>.
          </Callout>

          <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 bg-background/50 p-5">
            <p className="text-sm font-semibold text-foreground">Micro-lección</p>
            <p className={cn("mt-2 text-foreground/75", textSize, lineHeight)}>
              Si tu idea no vende, no es mala.<br/>Tu mensaje, formato o canal <span className="font-semibold text-foreground">aún no encajan</span>.
            </p>
          </motion.div>
        </motion.section>

        {/* EL GIRO */}
        <motion.section id="giro" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            🔁 El giro: cuando descubren el verdadero negocio
          </motion.h2>
          <motion.div variants={fadeUp} className={cn("text-foreground/75 space-y-4", textSize, lineHeight)}>
            <p>Al principio vendían gafas de otras marcas.<br/>No eran suyas.<br/>No controlaban el producto.</p>
            <p>Pero sí dominaban algo clave:<br/><span className="font-semibold text-foreground">el canal digital</span>.</p>
            <p>Redes sociales.<br/>Anuncios.<br/>Conversión.<br/>Storytelling.</p>
            <p>Y entonces llegó la pregunta que cambió todo:</p>
          </motion.div>
          
          <motion.blockquote variants={fadeUp} className="border-l-4 border-primary/50 pl-4 italic text-foreground/80 text-lg">
            "Si esto ya se vende… ¿por qué no crear nuestra propia marca?"
          </motion.blockquote>
          
          <motion.p variants={fadeUp} className={cn("text-foreground/75", textSize)}>
            Ahí nació Hawkers.
          </motion.p>

          <Callout icon={RefreshCw} title="El verdadero insight" tone="info">
            El negocio no eran las gafas.<br/>Era <span className="font-semibold text-foreground">saber venderlas</span>.
          </Callout>

          <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 bg-muted/30 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-foreground/55">Frase para recordar</p>
            <div className="mt-2">
              <TypingLine text="No ganaron por tener el mejor producto. Ganaron por venderlo mejor." speed={20} className="text-base sm:text-lg" />
            </div>
          </motion.div>
        </motion.section>

        {/* ORIGEN */}
        <motion.section id="origen" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            💡 El origen: una oportunidad en el caos
          </motion.h2>
          <motion.p variants={fadeUp} className={cn("text-foreground/75", textSize, lineHeight)}>
            Detectaron algo simple:
          </motion.p>

          <motion.ul variants={fadeUp} className={cn("space-y-2 text-foreground/75", textSize)}>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-foreground/55" />
              Las gafas eran caras
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-foreground/55" />
              Había demasiados intermediarios
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-foreground/55" />
              Internet permitía vender directo
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-foreground/55" />
              El marketing digital era una ventaja
            </li>
          </motion.ul>

          <TableBlock />

          <motion.p variants={fadeUp} className={cn("text-foreground/75", textSize, lineHeight)}>
            No vendían plástico y cristal.<br/>Vendían <span className="font-semibold text-foreground">pertenencia</span>.
          </motion.p>

          <Callout icon={Lightbulb} title="Moral #1" tone="success">
            No necesitas un plan perfecto.<br/>Necesitas <span className="font-semibold text-foreground">acción + mejora constante</span>.
          </Callout>
        </motion.section>

        {/* CRECIMIENTO */}
        <motion.section id="crecimiento" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            🔥 El crecimiento: vender identidad, no solo productos
          </motion.h2>
          <motion.div variants={fadeUp} className={cn("text-foreground/75 space-y-4", textSize, lineHeight)}>
            <p>Hawkers entendió algo antes que muchos:</p>
            <p><span className="font-semibold text-foreground">La gente no compra gafas.<br/>Compra quién quiere ser cuando se las pone.</span></p>
            <p>Por eso su contenido no hablaba solo de precios.<br/>Hablaba de estilo de vida.<br/>De actitud.<br/>De tribu.</p>
          </motion.div>

          <Callout icon={Flame} title="Mini-resumen visual" tone="default">
            Seguidores <span className="text-foreground/90 font-semibold">→</span> Clientes <span className="text-foreground/90 font-semibold">→</span> Comunidad <span className="text-foreground/90 font-semibold">→</span> Expansión
          </Callout>

          <FlowTimeline />

          <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 bg-muted/30 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-foreground/55">Frase para fijar la idea</p>
            <div className="mt-2">
              <TypingLine text="Tu competencia vende cosas. Tú debes vender significado." speed={20} className="text-base sm:text-lg" />
            </div>
          </motion.div>
        </motion.section>

        {/* CAÍDAS Y EXPANSIÓN */}
        <motion.section id="caidas" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            📈 Caídas y expansión: cuando creces, también fallas
          </motion.h2>
          <motion.div variants={fadeUp} className={cn("text-foreground/75 space-y-4", textSize, lineHeight)}>
            <p>El crecimiento rápido tiene un precio.</p>
            <p>Cuanto más grande es una marca,<br/>más frágil se vuelve su reputación.</p>
            <p>Hawkers vivió una <span className="font-semibold text-foreground">crisis importante</span> por un mensaje polémico en redes.<br/>La reacción fue inmediata.<br/>La polémica se viralizó.<br/>La imagen de marca se vio afectada.</p>
          </motion.div>

          <Callout icon={AlertTriangle} title="Aprendizaje crítico" tone="warning">
            Una marca fuerte necesita:<br/><br/>
            • Protocolos<br/>
            • Revisión<br/>
            • Normas<br/>
            • Control de comunicación<br/><br/>
            La reputación se construye lento…<br/>pero puede romperse en segundos.
          </Callout>
        </motion.section>

        {/* VIDEOS */}
        <motion.section id="videos" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            🎬 Publicidad real de Hawkers
          </motion.h2>
          
          <VideoEmbed 
            url="https://www.youtube.com/embed/hfgntecIEac"
            title="Publicidad Hawkers"
            description="Campaña publicitaria de Hawkers"
          />
          
          <VideoEmbed 
            url="https://www.youtube.com/embed/38IpRUsbmXU"
            title="Ejemplo real: publicidad de Hawkers (2016)"
            description="Campaña emocional de 2016"
          />
          
          <motion.p variants={fadeUp} className={cn("text-foreground/75", textSize, lineHeight)}>
            Este anuncio muestra cómo Hawkers no vendía solo gafas. Vendía <span className="font-semibold text-foreground">valores, identidad y comunidad</span>.
          </motion.p>
          
          <motion.p variants={fadeUp} className="text-sm text-foreground/55">
            📌 Importante: campaña de 2016. Prueba real de su estrategia emocional desde el inicio.
          </motion.p>

          {/* Messi Gallery */}
          <MessiGallery />
        </motion.section>

        {/* TIMELINE */}
        <motion.section id="timeline" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            🧭 Momentos clave
          </motion.h2>
          <VerticalTimeline />
        </motion.section>

        {/* LECCIONES */}
        <motion.section id="lecciones" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            🧠 Las 5 lecciones clave para emprendedores
          </motion.h2>

          <div className="grid gap-4">
            <Lesson
              index="1"
              title="No esperes el producto perfecto"
              icon={Lightbulb}
              bullets={["Empieza con algo viable.", "Mejora con feedback real."]}
              highlight="Primero valida. Luego perfecciona."
            />
            <Lesson
              index="2"
              title="La marca vale más que el producto"
              icon={Sparkles}
              bullets={["Identidad + voz + historia = recuerdo."]}
              highlight="No vendas productos: construye una historia."
            />
            <Lesson
              index="3"
              title="El marketing es el motor"
              icon={TrendingUp}
              bullets={["Si no te ven, no existes."]}
              highlight="Invierte en visibilidad."
            />
            <Lesson
              index="4"
              title="Emoción > descuento"
              icon={Heart}
              bullets={["La pertenencia convierte más que el precio."]}
              highlight="La emoción abre la puerta."
            />
            <Lesson
              index="5"
              title="Digitaliza o desaparece"
              icon={Globe}
              bullets={["El cliente decide online."]}
              highlight="Estar digital es supervivencia."
            />
          </div>
        </motion.section>

        {/* CIERRE */}
        <motion.section id="cierre" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            🎯 Conclusión: el verdadero mensaje
          </motion.h2>

          <Callout icon={Brain} title="En una frase" tone="info">
            No necesitas ser grande para empezar.<br/>Necesitas empezar para ser grande.
          </Callout>

          <motion.div variants={fadeUp} className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Lo que impulsó" value="Acción" icon={Sparkles} />
            <StatCard label="Lo que sostuvo" value="Estrategia" icon={Brain} />
            <StatCard label="Lo que escaló" value="Marketing" icon={TrendingUp} />
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 bg-background/50 p-6">
            <p className="text-sm font-semibold text-foreground">Checklist rápido para el lector</p>
            <div className="mt-3 grid gap-2">
              {[
                "Definir una promesa",
                "Crear identidad visual",
                "Publicar contenido",
                "Lanzar oferta simple",
                "Medir resultados",
                "Optimizar",
              ].map((x, i) => (
                <div key={i} className="flex gap-2 text-foreground/75">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className={cn(textSize)}>{x}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* CTA FINAL */}
        <motion.section id="cta" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-12">
          <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border/50 bg-muted/30 p-7 backdrop-blur">
            <div className="flex flex-col gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-foreground/55">🚀 Siguiente paso</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">
                  ¿Quieres tu propia historia de éxito?
                </h3>
                <p className={cn("mt-2 text-foreground/70", textSize, lineHeight)}>
                  Te ayudamos a crear marca, presencia digital y estrategia clara.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/#servicios"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-muted/50 px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  Ver servicios <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/#contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-foreground px-4 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
                >
                  Contactar <Sparkles className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="pointer-events-none absolute -top-28 right-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          </motion.div>
        </motion.section>
      </main>

      {/* Floating quick action (TOC) for thumbs */}
      <button
        onClick={() => setTocOpen(true)}
        className="fixed bottom-20 left-4 z-[58] inline-flex items-center gap-2 rounded-2xl border border-border/50 bg-background/80 px-3 py-2 text-sm font-semibold text-foreground backdrop-blur hover:bg-muted lg:hidden"
        aria-label="Abrir secciones"
      >
        <ListOrdered className="h-4 w-4" />
        Secciones
      </button>
    </div>
  );
}
