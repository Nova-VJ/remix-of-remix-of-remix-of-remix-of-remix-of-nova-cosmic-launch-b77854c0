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
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
      <Icon className="h-3.5 w-3.5 text-white/80" />
      {children}
    </span>
  );
}

function Callout({
  icon: Icon,
  title,
  children,
  tone = "default",
  highlight = false,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  tone?: "default" | "warning" | "success" | "info";
  highlight?: boolean;
}) {
  const toneClasses =
    tone === "warning"
      ? "border-yellow-400/20 bg-yellow-500/10"
      : tone === "success"
      ? "border-emerald-400/20 bg-emerald-500/10"
      : tone === "info"
      ? "border-sky-400/20 bg-sky-500/10"
      : "border-white/10 bg-white/5";

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 backdrop-blur",
        toneClasses
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl border border-white/10 bg-white/5 p-2">
          <Icon className="h-5 w-5 text-white/85" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{title}</p>
          <div className="mt-2 text-sm leading-relaxed text-white/75">
            {children}
          </div>
          {highlight && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70">
              <Sparkles className="h-3.5 w-3.5" />
              Resaltado para retención
            </div>
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
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
      className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/55">
            {label}
          </p>
          <p className="mt-2 text-lg font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <Icon className="h-5 w-5 text-white/85" />
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
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
          <Icon className="h-5 w-5 text-white/85" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/55">
            <span className="font-semibold text-white/80">{index}</span>{" "}
            <span className="mx-2 text-white/25">•</span> Lección
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">{title}</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/55" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-white/90">Idea clave</p>
            <p className="mt-1 text-sm text-white/75">{highlight}</p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-white/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
}

/* -------------------- utilities -------------------- */

function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 30 });
  const width = useTransform(smooth, (v) => `${Math.round(v * 100)}%`);

  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full bg-white/5">
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
        className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2">
            <Sparkles className="h-4 w-4 text-white/85" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              ¿Quieres tu propia historia de éxito?
            </p>
            <p className="truncate text-xs text-white/65">
              Marca + web + estrategia para crecer.
            </p>
          </div>
        </div>
        <a
          href="#cta"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
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
    <div className={cn("font-semibold text-white", className)}>
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
          className="fixed bottom-20 right-4 z-50 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-3 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-black/70"
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
          ? "border-white/15 bg-white text-black hover:bg-white/90"
          : "border-white/10 bg-white/10 text-white hover:bg-white/15"
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-[70] rounded-t-3xl border border-white/10 bg-background p-4"
            style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
          >
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                    <ListOrdered className="h-4 w-4 text-white/85" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Ir a sección
                    </p>
                    <p className="text-xs text-white/60">
                      La sección activa se resalta
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10"
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
                          ? "border-white/20 bg-white/10 text-white"
                          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        {Icon ? (
                          <span className="rounded-xl border border-white/10 bg-black/20 p-2">
                            <Icon className="h-4 w-4 text-white/80" />
                          </span>
                        ) : null}
                        <span className="text-sm font-semibold">{s.label}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-white/30" />
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/70">
                  Tip: usa este menú para "escanear" el artículo rápido (ideal
                  para usuarios que llegan por QR).
                </p>
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
      className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white">Flujo Hawkers</h3>
        <Chip icon={Repeat}>Escalable</Chip>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {steps.map((s, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
            className="relative rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                <s.i className="h-4 w-4 text-white/85" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{s.t}</p>
                <p className="mt-1 text-xs text-white/65">{s.d}</p>
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
    { k: "Producto", v: "Gafas modernas y accesibles", i: Lightbulb },
    { k: "Canal", v: "Redes sociales + anuncios", i: Globe },
    { k: "Público", v: "Jóvenes digitales", i: Heart },
    { k: "Mensaje", v: "Estilo, actitud, comunidad", i: Sparkles },
  ];

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
    >
      <h3 className="text-base font-semibold text-white">
        Enfoque inicial (simple y efectivo)
      </h3>
      <div className="mt-4 grid gap-3">
        {items.map((row, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
          >
            <div className="rounded-xl border border-white/10 bg-white/5 p-2">
              <row.i className="h-4 w-4 text-white/85" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-white/55">
                {row.k}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{row.v}</p>
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
    { year: "2013", title: "Nacimiento en España", desc: "Enfoque 100% digital desde el inicio. Sin tiendas físicas.", icon: Sparkles },
    { year: "Primeros pasos", title: "Validación del canal", desc: "Demostrar que se podía vender online sin intermediarios.", icon: Lightbulb },
    { year: "2016", title: "Identidad de marca", desc: "Campañas emocionales, no solo precio. Construcción de comunidad.", icon: Heart },
    { year: "2016", title: "Crisis de reputación", desc: "Un mensaje polémico en redes. La importancia del control de marca.", icon: AlertTriangle },
    { year: "Escala", title: "Consolidación", desc: "Colaboraciones, autoridad y expansión internacional.", icon: Trophy },
  ];

  return (
    <motion.div variants={fadeUp} className="relative">
      {/* Línea vertical */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-white/20 to-transparent" />
      
      <div className="space-y-6">
        {milestones.map((m, idx) => (
          <motion.div
            key={idx}
            variants={fadeUp}
            className="relative pl-12"
          >
            {/* Dot */}
            <div className="absolute left-2 top-2 h-4 w-4 rounded-full border-2 border-primary bg-background" />
            
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                  <m.icon className="h-4 w-4 text-white/85" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-primary">{m.year}</p>
                  <h4 className="mt-1 text-sm font-semibold text-white">{m.title}</h4>
                  <p className="mt-1 text-xs text-white/65">{m.desc}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div variants={fadeUp} className="mt-6 pl-12">
        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
          <p className="text-sm font-semibold text-white/90">
            <span className="text-primary">Aprende</span> → <span className="text-primary">Ajusta</span> → <span className="text-primary">Escala</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------- Video Embed -------------------- */

function VideoEmbed() {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
          <Play className="h-4 w-4 text-white/85" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">
            Ejemplo real: publicidad de Hawkers (2016)
          </h3>
          <p className="text-xs text-white/65">Campaña emocional de la época</p>
        </div>
      </div>
      
      <p className="text-sm text-white/75 mb-4">
        Este anuncio muestra cómo Hawkers no vendía solo gafas, vendía <span className="font-semibold text-white">identidad, mensaje y comunidad</span>. Remarca que es una campaña de 2016.
      </p>
      
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10">
        <iframe
          src="https://www.youtube.com/embed/38IpRUsbmXU"
          title="Publicidad Hawkers 2016"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-xs text-white/55">
        <Sparkles className="h-3.5 w-3.5" />
        Prueba real de su estrategia emocional desde 2016.
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
      { id: "caidas", label: "Caídas y expansión", icon: BarChart3 },
      { id: "video", label: "Video Hawkers", icon: Play },
      { id: "timeline", label: "Momentos clave", icon: ListOrdered },
      { id: "origen", label: "El origen", icon: Lightbulb },
      { id: "crecimiento", label: "El crecimiento", icon: Flame },
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
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          );
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      {
        threshold: [0.2, 0.35, 0.5, 0.65, 0.8],
        rootMargin: "-15% 0px -65% 0px",
      }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  const textSize = readingMode
    ? "text-[16.5px] sm:text-[18px]"
    : "text-[14.5px] sm:text-[15.5px]";
  const lineHeight = "leading-relaxed";

  return (
    <div className="min-h-screen bg-background text-white">
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
              "radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.20),transparent_45%),radial-gradient(circle_at_80%_30%,hsl(var(--primary)/0.16),transparent_45%),radial-gradient(circle_at_50%_85%,hsl(var(--primary)/0.14),transparent_50%)",
          }}
        />
        <div
          className={cn(
            "absolute left-1/2 top-[-220px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl transition-opacity duration-300",
            readingMode ? "opacity-10" : "opacity-20"
          )}
        />
      </div>

      {/* Mobile-first top controls */}
      <div
        className="fixed inset-x-0 top-2 z-[55] px-3"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 rounded-2xl border border-white/10 bg-black/55 p-2 backdrop-blur">
          <div className="flex items-center gap-2">
            <Link
              to="/casos-exito"
              className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setTocOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
              <Menu className="h-4 w-4" />
              Secciones
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-xs text-white/55">
              En: <span className="text-white/80 font-semibold">{sections.find(s => s.id === activeId)?.label}</span>
            </div>
            <ReadingModeToggle
              readingMode={readingMode}
              setReadingMode={setReadingMode}
            />
          </div>
        </div>
      </div>

      <main className="relative mx-auto max-w-3xl px-4 pb-28 pt-24">
        {/* HERO */}
        <motion.header
          id="hero"
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            <Chip icon={Sparkles}>Caso real</Chip>
            <Chip icon={TrendingUp}>Crecimiento</Chip>
            <Chip icon={Brain}>Lecciones prácticas</Chip>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-3xl font-semibold leading-tight sm:text-4xl"
          >
            Hawkers: de una idea simple a una marca global
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className={cn("text-white/75", textSize, lineHeight)}
          >
            Un artículo para emprendedores que quieren empezar pero sienten que les falta el mapa.
          </motion.p>

          <motion.div variants={fadeUp} className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Punto de partida" value="Sin inversores" icon={AlertTriangle} />
            <StatCard label="Estrategia" value="100% digital" icon={Globe} />
            <StatCard label="Clave" value="Marca + comunidad" icon={Heart} />
          </motion.div>

          {/* Typing hook */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
          >
            <p className="text-xs uppercase tracking-wider text-white/55">
              Gancho (retención)
            </p>
            <div className="mt-2">
              <TypingLine
                text="La gente no compra productos. Compra cómo se siente al usarlos."
                speed={18}
                className="text-base sm:text-lg"
              />
            </div>
            <p className={cn("mt-3 text-white/70", textSize, lineHeight)}>
              Esta idea explica por qué Hawkers pudo escalar tan rápido:
              construyó identidad, no solo catálogo.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Callout icon={Quote} title="Idea central" tone="info" highlight>
              Si quieres vender más, no te obsesiones solo con el producto:
              obsesiónate con{" "}
              <span className="font-semibold text-white">la percepción</span>.
            </Callout>
          </motion.div>
        </motion.header>

        {/* INTRO */}
        <motion.section
          id="intro"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 space-y-5"
        >
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            🌍 Introducción: el miedo a dar el primer paso
          </motion.h2>
          <motion.p variants={fadeUp} className={cn("text-white/75", textSize, lineHeight)}>
            La mayoría de proyectos no fallan por falta de ideas: fallan por{" "}
            <span className="font-semibold text-white">miedo</span>. Miedo a
            equivocarse, a no vender, a no saber por dónde empezar.
          </motion.p>

          <Callout icon={AlertTriangle} title="Verdad incómoda" tone="warning">
            <span className="font-semibold text-white">
              La mayoría de los proyectos mueren antes de nacer
            </span>
            . Hawkers nació justo en ese punto: sin contactos, sin inversores y
            sin experiencia en moda.
          </Callout>

          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-white/10 bg-black/25 p-5"
          >
            <p className="text-sm font-semibold text-white">
              Mini-ejercicio (para el lector)
            </p>
            <p className={cn("mt-2 text-white/75", textSize, lineHeight)}>
              Si hoy empezaras, ¿qué venderías primero:{" "}
              <span className="font-semibold text-white">un producto</span> o{" "}
              <span className="font-semibold text-white">una promesa clara</span>?
            </p>
          </motion.div>
        </motion.section>

        {/* LA CHISPA */}
        <motion.section
          id="chispa"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 space-y-5"
        >
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            ⚡ La chispa: antes de Hawkers
          </motion.h2>
          <motion.p variants={fadeUp} className={cn("text-white/75", textSize, lineHeight)}>
            Esta historia no empieza con un gran producto.
            Empieza con un problema: querían que algo funcionara y no funcionó.
          </motion.p>
          <motion.p variants={fadeUp} className={cn("text-white/75", textSize, lineHeight)}>
            Muchos abandonan.
            Ellos hicieron lo contrario: <span className="font-semibold text-white">pivotar rápido</span>.
          </motion.p>

          <Callout icon={Zap} title="Lección temprana" tone="success">
            Emprender no es adivinar a la primera.
            Es <span className="font-semibold text-white">pivotar sin perder el foco</span>.
          </Callout>

          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-white/10 bg-black/20 p-5"
          >
            <p className="text-sm font-semibold text-white">Micro-lección</p>
            <p className={cn("mt-2 text-white/75", textSize, lineHeight)}>
              Si tu idea no vende, no es mala.
              Tu formato, tu mensaje o tu canal <span className="font-semibold text-white">aún no encajan</span>.
            </p>
          </motion.div>
        </motion.section>

        {/* EL GIRO */}
        <motion.section
          id="giro"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 space-y-5"
        >
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            🔁 El giro: cuando descubren el verdadero negocio
          </motion.h2>
          <motion.p variants={fadeUp} className={cn("text-white/75", textSize, lineHeight)}>
            Al principio vendían gafas de otra marca.
            Cuando vieron que el canal digital funcionaba, llegó el momento clave:
          </motion.p>
          <motion.blockquote
            variants={fadeUp}
            className="border-l-4 border-primary/50 pl-4 italic text-white/80"
          >
            "Si esto ya se vende… ¿por qué no crear nuestra marca?"
          </motion.blockquote>

          <Callout icon={RefreshCw} title="El verdadero insight" tone="info" highlight>
            El negocio no eran las gafas.
            Era dominar <span className="font-semibold text-white">marketing, conversión y comunidad</span>.
          </Callout>

          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
          >
            <p className="text-xs uppercase tracking-wider text-white/55">
              Frase para recordar
            </p>
            <div className="mt-2">
              <TypingLine
                text="No ganaron por tener el mejor producto. Ganaron por venderlo mejor."
                speed={20}
                className="text-base sm:text-lg"
              />
            </div>
          </motion.div>
        </motion.section>

        {/* CAÍDAS Y EXPANSIÓN */}
        <motion.section
          id="caidas"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 space-y-5"
        >
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            📈 Caídas y expansión: cuando creces, también fallas
          </motion.h2>
          <motion.p variants={fadeUp} className={cn("text-white/75", textSize, lineHeight)}>
            Cuando una marca crece rápido, todo se amplifica:
            éxitos, errores y crisis.
          </motion.p>
          <motion.p variants={fadeUp} className={cn("text-white/75", textSize, lineHeight)}>
            Hawkers vivió una <span className="font-semibold text-white">crisis de reputación</span> por un mensaje polémico en redes.
          </motion.p>

          <Callout icon={AlertTriangle} title="Aprendizaje crítico" tone="warning">
            Tu marca es frágil.
            Necesitas <span className="font-semibold text-white">normas, revisión y protocolo de crisis</span>.
          </Callout>
        </motion.section>

        {/* VIDEO */}
        <motion.section
          id="video"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 space-y-5"
        >
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            🎬 Video: publicidad real de Hawkers (2016)
          </motion.h2>
          <VideoEmbed />
        </motion.section>

        {/* TIMELINE */}
        <motion.section
          id="timeline"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 space-y-5"
        >
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            🧭 Momentos clave
          </motion.h2>
          <motion.p variants={fadeUp} className={cn("text-white/75", textSize, lineHeight)}>
            Un recorrido visual por los hitos que definieron a Hawkers.
          </motion.p>
          <VerticalTimeline />
        </motion.section>

        {/* ORIGEN */}
        <motion.section
          id="origen"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 space-y-5"
        >
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            💡 El origen: una oportunidad en el caos
          </motion.h2>
          <motion.p variants={fadeUp} className={cn("text-white/75", textSize, lineHeight)}>
            Detectaron algo simple: precios inflados, demasiados intermediarios y
            una ventaja enorme: el canal digital.
          </motion.p>

          <motion.ul variants={fadeUp} className={cn("space-y-2 text-white/75", textSize)}>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/55" />
              Las gafas de sol eran caras.
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/55" />
              Los intermediarios inflaban precios.
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/55" />
              Internet permitía vender directo al cliente.
            </li>
          </motion.ul>

          <TableBlock />

          <Callout icon={Lightbulb} title="Moral #1" tone="success" highlight>
            No necesitas un plan perfecto. Necesitas{" "}
            <span className="font-semibold text-white">acción</span> y un sistema
            para mejorar.
          </Callout>
        </motion.section>

        {/* CRECIMIENTO */}
        <motion.section
          id="crecimiento"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 space-y-5"
        >
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            🔥 El crecimiento: vender identidad, no solo productos
          </motion.h2>
          <motion.p variants={fadeUp} className={cn("text-white/75", textSize, lineHeight)}>
            Hawkers entendió una regla de oro: la gente no compra "gafas", compra{" "}
            <span className="font-semibold text-white">identidad</span>. Por eso
            construyeron comunidad con contenido, mensajes emocionales y presencia
            constante.
          </motion.p>

          <Callout icon={Flame} title="Mini-resumen visual" tone="default">
            Seguidores{" "}
            <span className="text-white/90 font-semibold">→</span> Clientes{" "}
            <span className="text-white/90 font-semibold">→</span> Comunidad{" "}
            <span className="text-white/90 font-semibold">→</span> Expansión
          </Callout>

          <FlowTimeline />

          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
          >
            <p className="text-xs uppercase tracking-wider text-white/55">
              Frase para fijar la idea
            </p>
            <div className="mt-2">
              <TypingLine
                text="Tu competencia vende cosas. Tú debes vender significado."
                speed={20}
                className="text-base sm:text-lg"
              />
            </div>
          </motion.div>
        </motion.section>

        {/* LECCIONES */}
        <motion.section
          id="lecciones"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 space-y-5"
        >
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            🧠 Las 5 lecciones clave para emprendedores
          </motion.h2>
          <motion.p variants={fadeUp} className={cn("text-white/75", textSize, lineHeight)}>
            Si solo te quedas con algo de este artículo, que sea esto: cada
            lección es un paso que puedes copiar hoy.
          </motion.p>

          <div className="grid gap-4">
            <Lesson
              index="1"
              title="No esperes el producto perfecto"
              icon={Lightbulb}
              bullets={[
                "Empieza con una versión viable y mejora con feedback.",
                "La perfección sin ventas no construye negocio.",
              ]}
              highlight="Primero valida. Luego perfecciona."
            />
            <Lesson
              index="2"
              title="La marca vale más que el producto"
              icon={Sparkles}
              bullets={[
                "Identidad + voz + estilo te diferencian.",
                "Una historia clara genera confianza y recuerdo.",
              ]}
              highlight="No vendas productos: construye una historia."
            />
            <Lesson
              index="3"
              title="El marketing es el motor del crecimiento"
              icon={TrendingUp}
              bullets={[
                "Redes + anuncios + contenido = visibilidad constante.",
                "La gente no compra lo que no ve.",
              ]}
              highlight="No esperes 'tener dinero': invierte para crecer."
            />
            <Lesson
              index="4"
              title="Conecta con emociones, no con descuentos"
              icon={Heart}
              bullets={[
                "Inspiración y pertenencia convierten mejor que 'barato'.",
                "La confianza multiplica la conversión.",
              ]}
              highlight="La emoción abre la puerta; la claridad cierra la venta."
            />
            <Lesson
              index="5"
              title="Digitaliza o desaparece"
              icon={Globe}
              bullets={[
                "Sin presencia online pierdes visibilidad.",
                "El cliente decide antes de hablar contigo.",
              ]}
              highlight="Estar online ya no es opcional: es supervivencia."
            />
          </div>
        </motion.section>

        {/* CIERRE */}
        <motion.section
          id="cierre"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-10 space-y-5"
        >
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            🎯 Conclusión: el verdadero mensaje
          </motion.h2>

          <Callout icon={Brain} title="Resumen en 1 frase" tone="info" highlight>
            No necesitas ser grande para empezar. Necesitas empezar para ser
            grande.
          </Callout>

          <motion.div variants={fadeUp} className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Lo que impulsó" value="Acción" icon={Sparkles} />
            <StatCard label="Lo que sostuvo" value="Estrategia" icon={Brain} />
            <StatCard label="Lo que escaló" value="Marketing" icon={TrendingUp} />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-white/10 bg-black/20 p-6"
          >
            <p className="text-sm font-semibold text-white">
              Checklist rápido (para el lector)
            </p>
            <div className="mt-3 grid gap-2">
              {[
                "Definir una promesa clara",
                "Crear identidad visual básica",
                "Publicar contenido semanal",
                "Lanzar una oferta simple",
                "Medir y repetir lo que funciona",
                "Optimizar con feedback real",
              ].map((x, i) => (
                <div key={i} className="flex gap-2 text-white/75">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/55" />
                  <span className={cn(textSize)}>{x}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* CTA FINAL */}
        <motion.section
          id="cta"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-12"
        >
          <motion.div
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur"
          >
            <div className="flex flex-col gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-white/55">
                  Siguiente paso
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  ¿Quieres tu propia historia de éxito?
                </h3>
                <p className={cn("mt-2 text-white/70", textSize, lineHeight)}>
                  Te ayudamos a crear marca, presencia digital y una estrategia
                  clara para crecer.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/#servicios"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Ver servicios <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/#contacto"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Contactar <Sparkles className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="pointer-events-none absolute -top-28 right-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          </motion.div>

          <motion.footer
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mt-10 text-center text-xs text-white/45"
          >
            Mobile-first: pensado para QR, lectura rápida y conversión.
          </motion.footer>
        </motion.section>
      </main>

      {/* Floating quick action (TOC) for thumbs */}
      <button
        onClick={() => setTocOpen(true)}
        className="fixed bottom-20 left-4 z-[58] inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-3 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-black/70 lg:hidden"
        aria-label="Abrir secciones"
      >
        <ListOrdered className="h-4 w-4" />
        Secciones
      </button>
    </div>
  );
}
