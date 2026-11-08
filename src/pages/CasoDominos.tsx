import SEOHead from "@/components/SEOHead";
import { SEO_PAGES } from "@/config/seo";
import React, { useEffect, useMemo, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  BookOpen,
  Flag,
  BadgeCheck,
  House,
  Send,
  AlertTriangle,
  Lightbulb,
  Brain,
  Trophy,
  TrendingUp,
  Heart,
  Globe,
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
  Play,
  ArrowLeft,
  Smartphone,
  Building,
  Target,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useTranslation } from "@/i18n";

// Images
import YouTubeFacade from "@/components/YouTubeFacade";
import dominosImage from "@/assets/dominos-presentation.webp";
import dominosHistorica1 from "@/assets/dominos-historica-1.webp";
import dominosHistorica2 from "@/assets/dominos-historica-2.webp";

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

function Chip({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
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
    <motion.div variants={fadeUp} className={cn("relative overflow-hidden rounded-2xl border p-5 backdrop-blur", toneClasses)}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl border border-border/50 bg-muted/50 p-2">
          <Icon className="h-5 w-5 text-foreground/85" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <div className="mt-2 text-sm leading-relaxed text-foreground/75">{children}</div>
        </div>
      </div>
      <div className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="rounded-2xl border border-border/50 bg-muted/30 p-5 backdrop-blur"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-foreground/70">{label}</p>
          <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-muted/50 p-3">
          <Icon className="h-5 w-5 text-foreground/85" />
        </div>
      </div>
    </motion.div>
  );
}

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
  const { isEn } = useTranslation();
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
            <BookOpen className="h-4 w-4 text-foreground/85" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{isEn ? "Want your own success story?" : "¿Quieres tu propia historia de éxito?"}</p>
            <p className="truncate text-xs text-foreground/65">{isEn ? "Brand + website + clear growth strategy." : "Marca + web + estrategia para crecer."}</p>
          </div>
        </div>
        <a href="#cta" className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border/50 bg-muted/50 px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted">
          {isEn ? "Get Started" : "Empezar"} <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    </div>
  );
}

function TypingLine({ text, speed = 18, className = "" }: { text: string; speed?: number; className?: string }) {
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
      <motion.span aria-hidden initial={{ opacity: 0.2 }} animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 0.9, repeat: Infinity }} className="ml-0.5 inline-block w-[10px]">|</motion.span>
    </div>
  );
}

function ScrollToTop({ show }: { show: boolean }) {
  const { isEn } = useTranslation();
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
          {isEn ? "Top" : "Arriba"}
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function ReadingModeToggle({ readingMode, setReadingMode }: { readingMode: boolean; setReadingMode: (v: boolean) => void }) {
  const { isEn } = useTranslation();
  return (
    <button
      onClick={() => setReadingMode(!readingMode)}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition",
        readingMode ? "border-border bg-foreground text-background hover:bg-foreground/90" : "border-border/50 bg-muted/50 text-foreground hover:bg-muted"
      )}
    >
      {readingMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      {readingMode ? (isEn ? "Exit" : "Salir") : (isEn ? "Reader" : "Lectura")}
    </button>
  );
}

function MobileTOC({ open, onClose, sections, activeId, onJump }: { open: boolean; onClose: () => void; sections: { id: string; label: string; icon?: React.ElementType }[]; activeId: string; onJump: (id: string) => void }) {
  const { isEn } = useTranslation();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 28 }} className="fixed inset-x-0 bottom-0 z-[70] rounded-t-3xl border border-border/50 bg-background p-4" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl border border-border/50 bg-muted/50 p-2">
                    <ListOrdered className="h-4 w-4 text-foreground/85" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{isEn ? "Jump to section" : "Ir a sección"}</p>
                    <p className="text-xs text-foreground/60">{isEn ? "The active section is highlighted" : "La sección activa se resalta"}</p>
                  </div>
                </div>
                <button onClick={onClose} className="rounded-xl border border-border/50 bg-muted/50 p-2 text-foreground/80 hover:bg-muted" aria-label={isEn ? "Close" : "Cerrar"}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 grid gap-2 max-h-[50vh] overflow-y-auto">
                {sections.map((s) => {
                  const isActive = s.id === activeId;
                  const Icon = s.icon;
                  return (
                    <button key={s.id} onClick={() => { onJump(s.id); onClose(); }} className={cn("flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition", isActive ? "border-primary/30 bg-primary/10 text-foreground" : "border-border/50 bg-muted/30 text-foreground/80 hover:bg-muted/50")}>
                      <span className="flex items-center gap-3">
                        {Icon ? <span className="rounded-xl border border-border/50 bg-background/50 p-2"><Icon className="h-4 w-4 text-foreground/80" /></span> : null}
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

function VideoEmbed({ url, title, description }: { url: string; title: string; description: string }) {
  return (
    <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 bg-muted/30 p-5 backdrop-blur">
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
        <YouTubeFacade url={url} title={title} />
      </div>
    </motion.div>
  );
}

function VerticalTimeline() {
  const { isEn } = useTranslation();
  const milestones = [
    {
      year: "1960",
      title: isEn ? "Humble Beginnings" : "Orígenes humildes",
      desc: isEn ? "Tom & James Monaghan buy DomiNick's for $900." : "Tom y James Monaghan compran DomiNick's por $900.",
      icon: Building,
    },
    {
      year: "1965",
      title: isEn ? "Domino's Pizza is Born" : "Nace Domino's Pizza",
      desc: isEn ? "Brand renames. Relentless focus on delivery speed." : "Renombran la marca. Enfoque en entrega rápida.",
      icon: Flag,
    },
    {
      year: "2008",
      title: isEn ? "Turning Point" : "Punto de inflexión",
      desc: isEn ? "Brand crisis. Domino's pivots to a tech-first company." : "Crisis de imagen. Deciden apostar por lo digital.",
      icon: AlertTriangle,
    },
    {
      year: isEn ? "Today" : "Hoy",
      title: isEn ? "Digital Leader" : "Líder digital",
      desc: isEn ? "90%+ digital sales. 76.3% via mobile app." : "90%+ ventas digitales. 76.3% desde la app.",
      icon: Smartphone,
    },
    {
      year: "Global",
      title: isEn ? "Global Expansion" : "Expansión",
      desc: isEn ? "+14,000 locations across 89 countries." : "+14.000 restaurantes en 89 países.",
      icon: Globe,
    },
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
    </motion.div>
  );
}

/* -------------------- Page -------------------- */

export default function CasoDominos() {
  const { isEn } = useTranslation();
  const [showSticky, setShowSticky] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const [activeId, setActiveId] = useState("hero");
  const [tocOpen, setTocOpen] = useState(false);

  const sections = useMemo(() => [
    { id: "hero", label: isEn ? "Overview" : "Portada", icon: House },
    { id: "origenes", label: isEn ? "Origins" : "Orígenes", icon: Building },
    { id: "decisiones", label: isEn ? "Key Decisions" : "Decisiones clave", icon: Lightbulb },
    { id: "idea", label: isEn ? "The Big Idea" : "La idea", icon: Brain },
    { id: "estrategia", label: isEn ? "Strategy" : "Estrategia", icon: Target },
    { id: "resultados", label: isEn ? "Results" : "Resultados", icon: TrendingUp },
    { id: "timeline", label: isEn ? "Milestones" : "Momentos clave", icon: Clock },
    { id: "playbook", label: "Playbook", icon: Zap },
    { id: "conclusion", label: isEn ? "Conclusion" : "Conclusión", icon: Trophy },
    { id: "cta", label: isEn ? "Next Steps" : "CTA final", icon: ArrowRight },
  ], [isEn]);

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
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
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
    <>
    <SEOHead {...SEO_PAGES["/casos-exito/dominos"]} />
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgress />
      {showSticky && <StickyCTA />}
      <ScrollToTop show={showTop} />
      <MobileTOC open={tocOpen} onClose={() => setTocOpen(false)} sections={sections} activeId={activeId} onJump={jumpTo} />

      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className={cn("absolute inset-0 opacity-70 transition-opacity duration-300", readingMode ? "opacity-35" : "opacity-70")} style={{ background: "radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.15),transparent_45%),radial-gradient(circle_at_80%_30%,hsl(var(--primary)/0.10),transparent_45%),radial-gradient(circle_at_50%_85%,hsl(var(--primary)/0.08),transparent_50%)" }} />
      </div>

      {/* Top controls */}
      <div className="fixed inset-x-0 top-2 z-[55] px-3" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 rounded-2xl border border-border/50 bg-background/80 p-2 backdrop-blur">
          <div className="flex items-center gap-2">
            <Link to="/casos-exito" aria-label={isEn ? "Back to Case Studies" : "Volver a casos de éxito"} className="inline-flex items-center gap-1 rounded-xl border border-border/50 bg-muted/50 px-2 py-2 text-sm text-foreground/80 hover:bg-muted">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <button onClick={() => setTocOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-muted/50 px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted">
              <Menu className="h-4 w-4" />
              {isEn ? "Sections" : "Secciones"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-xs text-foreground/70">
              {isEn ? "In: " : "En: "}<span className="text-foreground/80 font-semibold">{sections.find(s => s.id === activeId)?.label}</span>
            </div>
            <ReadingModeToggle readingMode={readingMode} setReadingMode={setReadingMode} />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <main id="contenido" className="relative mx-auto max-w-3xl px-4 pb-28 pt-24">
        {/* HERO */}
        <motion.header id="hero" variants={stagger} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 overflow-hidden">
            <img src={dominosImage} alt="Domino's Pizza presentación" className="w-full h-auto" />
            <p className="text-sm text-foreground/60 p-3 text-center">{isEn ? 'Domino\'s: "15 Ways to Get Your Slice" - Omnichannel digital sales engine' : 'Domino\'s: "15 Ways to Get Your Slice" - Múltiples canales digitales de venta'}</p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            <Chip icon={BadgeCheck}>{isEn ? "Real Case" : "Caso real"}</Chip>
            <Chip icon={TrendingUp}>{isEn ? "Digital Transformation" : "Transformación digital"}</Chip>
            <Chip icon={Brain}>{isEn ? "Scalable System" : "Sistema escalable"}</Chip>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-3xl font-semibold leading-tight sm:text-4xl">
            {isEn ? "Online presence is not the same as scaling a system." : "Presencia no es igual a escalar un sistema."}
          </motion.h1>
          <motion.p variants={fadeUp} className={cn("text-foreground/75", textSize)}>{isEn ? "Case Study: Domino's Pizza" : "Caso: Domino's Pizza"}</motion.p>

          <motion.div variants={fadeUp} className="grid gap-3 sm:grid-cols-3">
            <StatCard label={isEn ? "Digital Sales" : "Ventas digitales"} value="90%+" icon={Smartphone} />
            <StatCard label={isEn ? "App Orders" : "Pedidos app"} value="76.3%" icon={TrendingUp} />
            <StatCard label={isEn ? "Locations" : "Restaurantes"} value={isEn ? "+14,000" : "+14.000"} icon={Globe} />
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 bg-muted/30 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-foreground/70">{isEn ? "Core Takeaway" : "Idea central"}</p>
            <div className="mt-2">
              <TypingLine text={isEn ? "Domino's didn't win by making better pizza. They won by making it effortless to order." : "Domino's no ganó por hacer mejor pizza. Ganó por hacer más fácil comprarla."} speed={18} className="text-base sm:text-lg" />
            </div>
          </motion.div>
        </motion.header>

        {/* ORÍGENES */}
        <motion.section id="origenes" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            {isEn ? "🧩 Humble Beginnings (1960)" : "🧩 Orígenes humildes (1960)"}
          </motion.h2>
          <motion.div variants={fadeUp} className={cn("text-foreground/75 space-y-4", textSize, lineHeight)}>
            {isEn ? (
              <>
                <p>This story doesn't start with cutting-edge tech or millions in venture capital.<br/>It begins with two brothers and a tiny pizzeria.</p>
                <p>In 1960, <span className="font-semibold text-foreground">Tom and James Monaghan</span>, with no capital or experience, bought a small pizzeria called DomiNick's in Ypsilanti, Michigan, for <span className="font-semibold text-foreground">$900</span>.</p>
                <p>Tom grew up through steep adversity: his father passed away when he was young, and he and his brother spent part of their childhood in an orphanage.<br/>They had no capital, no connections, and no safety net.<br/>They had <span className="font-semibold text-foreground">determination</span>.</p>
              </>
            ) : (
              <>
                <p>Esta historia no empieza con tecnología ni millones.<br/>Empieza con dos hermanos y una pequeña pizzería.</p>
                <p>En 1960, <span className="font-semibold text-foreground">Tom y James Monaghan</span>, sin dinero ni experiencia, compraron una pequeña pizzería llamada DomiNick's en Ypsilanti, Michigan, por <span className="font-semibold text-foreground">900 dólares</span>.</p>
                <p>Tom creció con dificultades: su padre murió joven y él y su hermano pasaron parte de su infancia en un orfanato.<br/>No tenían capital, ni contactos, ni respaldo.<br/>Tenían <span className="font-semibold text-foreground">determinación</span>.</p>
              </>
            )}
          </motion.div>

          {/* Historic photos */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border/50 overflow-hidden bg-muted/20">
              <img src={dominosHistorica1} alt="DomiNick's Pizza original" className="w-full h-auto object-contain" />
            </div>
            <div className="rounded-2xl border border-border/50 overflow-hidden bg-muted/20">
              <img src={dominosHistorica2} alt="Hermanos Monaghan" className="w-full h-auto object-contain" />
            </div>
          </motion.div>
        </motion.section>

        {/* DECISIONES */}
        <motion.section id="decisiones" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            {isEn ? "🧠 Early Moves and Critical Pivots" : "🧠 Primeros pasos y decisiones clave"}
          </motion.h2>
          <motion.div variants={fadeUp} className={cn("text-foreground/75 space-y-4", textSize, lineHeight)}>
            {isEn ? (
              <>
                <p>The business was not an overnight success.<br/>Sales were tight.<br/>Margins were razor-thin.</p>
                <p>James decided to exit the business, selling his half back to Tom in exchange for the used <span className="font-semibold text-foreground">Volkswagen Beetle</span> they drove to deliver pizzas.</p>
                <p>Tom simplified the menu, focused strictly on <span className="font-semibold text-foreground">home delivery</span>, and targeted nearby college campuses.<br/>He didn't try to become the fanciest restaurant.<br/>He strove to be the most <span className="font-semibold text-foreground">convenient</span>.</p>
              </>
            ) : (
              <>
                <p>El negocio no fue un éxito inmediato.<br/>Las ventas eran justas.<br/>El margen era mínimo.</p>
                <p>James decidió salir del proyecto y vendió su parte a Tom a cambio del <span className="font-semibold text-foreground">Volkswagen Beetle</span> que usaban para repartir pizzas.</p>
                <p>Tom simplificó la oferta, se centró en la <span className="font-semibold text-foreground">entrega a domicilio</span> y apuntó a los estudiantes universitarios cercanos.<br/>No intentó ser el mejor restaurante.<br/>Intentó ser el más <span className="font-semibold text-foreground">conveniente</span>.</p>
              </>
            )}
          </motion.div>

          <Callout icon={Lightbulb} title={isEn ? "Domino's Pizza is Born (1965)" : "Nace Domino's Pizza (1965)"} tone="success">
            {isEn ? (
              <>After multiple strategic pivots centered on speed, consistency, and efficient delivery, Tom rebranded the stores as: <span className="font-semibold text-foreground">Domino's Pizza</span></>
            ) : (
              <>Tras varias decisiones estratégicas enfocadas en rapidez, consistencia y reparto eficiente, Tom renombró las tiendas como: <span className="font-semibold text-foreground">Domino's Pizza</span></>
            )}
          </Callout>
        </motion.section>

        {/* LA IDEA */}
        <motion.section id="idea" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            {isEn ? "💡 The Insight That Changed Everything" : "💡 La idea que lo cambió todo"}
          </motion.h2>
          <motion.div variants={fadeUp} className={cn("text-foreground/75 space-y-4", textSize, lineHeight)}>
            {isEn ? (
              <>
                <p>In 2008, Domino's Pizza was facing public brand fatigue and flatlining sales.</p>
                <p>Leadership identified the opportunity to transform and scale the company by making a <span className="font-semibold text-foreground">crystal-clear digital commitment</span>.</p>
              </>
            ) : (
              <>
                <p>En 2008, Domino's Pizza era una cadena de pizzerías con problemas de imagen y ventas estancadas.</p>
                <p>Los dirigentes vieron una oportunidad de evolucionar y expandir el negocio haciendo una <span className="font-semibold text-foreground">propuesta clara digital</span>.</p>
              </>
            )}
          </motion.div>

          <motion.blockquote variants={fadeUp} className="border-l-4 border-primary/50 pl-4 italic text-foreground/80 text-lg">
            {isEn ? '"Every company is a technology company."' : '"Cada compañía es una compañía tecnológica."'}
          </motion.blockquote>

          <motion.p variants={fadeUp} className={cn("text-foreground/75", textSize, lineHeight)}>
            {isEn ? "Domino's pushed that conviction even further, describing themselves as:" : "Domino's lo llevó aún más lejos. Ellos mismos se describen como:"}
          </motion.p>

          <Callout icon={Brain} title={isEn ? "The True Insight" : "El verdadero insight"} tone="info">
            <span className="font-semibold text-foreground">{isEn ? '"A technology company that sells pizzas."' : '"Una compañía de tecnología que hace pizzas."'}</span><br/><br/>
            {isEn ? (
              <>They don't say this as a slogan. They say it because they built an omnichannel system that turns a one-off order into an automatic <span className="font-semibold text-foreground">habit</span>.</>
            ) : (
              <>No lo dicen por postureo. Lo dicen porque construyeron un sistema que convierte una venta aislada en un <span className="font-semibold text-foreground">hábito</span>.</>
            )}
          </Callout>

          {/* Video */}
          <VideoEmbed url="https://www.youtube.com/embed/gqJ9qB1DiQM" title={isEn ? "DomiDog: Domino's Delivery Robot" : "DomiDog el robot de Domino's"} description={isEn ? "Delivery Innovation" : "Innovación en entregas"} />
        </motion.section>

        {/* ESTRATEGIA */}
        <motion.section id="estrategia" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            {isEn ? "🎯 The Strategy: Turning Ordering into an Experience" : "🎯 La estrategia: convertir el pedido en experiencia"}
          </motion.h2>
          <motion.div variants={fadeUp} className={cn("text-foreground/75 space-y-4", textSize, lineHeight)}>
            {isEn ? (
              <>
                <p>Domino's didn't just "launch an app".<br/>They built a complete <span className="font-semibold text-foreground">digital product ecosystem</span>.</p>
                <p>The food sector is intensely competitive. Choices are everywhere. The winning question is never "who has the best recipe?", but:</p>
              </>
            ) : (
              <>
                <p>Domino's no "hizo una app".<br/>Hizo un <span className="font-semibold text-foreground">producto digital</span>.</p>
                <p>El mercado de comida rápida es brutal. Hay opciones por todos lados. La pregunta no es "¿quién tiene mejor producto?" sino:</p>
              </>
            )}
          </motion.div>

          <motion.ul variants={fadeUp} className={cn("space-y-2 text-foreground/75", textSize)}>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-foreground/70" />{isEn ? "Who makes the customer choose you a second and third time?" : "¿Quién consigue que el cliente te elija otra vez?"}</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-foreground/70" />{isEn ? "Who makes reordering so effortless it feels second nature?" : "¿Quién hace que pedir sea tan sencillo que parezca automático?"}</li>
          </motion.ul>

          <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 bg-muted/30 p-5">
            <p className="text-sm font-semibold text-foreground mb-3">{isEn ? "Key Strategic Pillars:" : "Acciones clave:"}</p>
            <div className="space-y-2">
              {(isEn
                ? ["Sustained investment in proprietary tech", "Fewer ordering steps, instant clarity", "1-click reorder from history", "Data-driven menu personalization"]
                : ["Inversión sostenida en su ecosistema digital", "Menos pasos, más claridad", "Reordenar rápido", "Personalización basada en datos"]
              ).map((item, i) => (
                <div key={i} className="flex gap-2 text-foreground/75">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className={textSize}>{item}</span>
                </div>
              ))}
            </div>
            <p className={cn("mt-4 text-foreground/75", textSize)}>
              {isEn ? <>It was never a one-off campaign. It was a lasting <span className="font-semibold text-foreground">organizational culture</span>.</> : <>No fue una acción puntual. Fue una <span className="font-semibold text-foreground">cultura</span>.</>}
            </p>
          </motion.div>
        </motion.section>

        {/* RESULTADOS */}
        <motion.section id="resultados" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            {isEn ? "📊 Measurable Results (And Why They Matter)" : "📊 Resultados (y por qué importan)"}
          </motion.h2>
          
          <motion.div variants={fadeUp} className="grid gap-3 sm:grid-cols-2">
            <StatCard label={isEn ? "Digital Sales" : "Ventas digitales"} value="90%+" icon={TrendingUp} />
            <StatCard label={isEn ? "Mobile App Orders" : "Pedidos desde app"} value="76.3%" icon={Smartphone} />
          </motion.div>

          <motion.p variants={fadeUp} className={cn("text-foreground/75", textSize, lineHeight)}>
            {isEn ? (
              <>The raw percentage isn't the biggest lesson. It's what it proves: Domino's turned their digital channel into their <span className="font-semibold text-foreground">primary engine for customer acquisition, sales, and loyalty</span>.</>
            ) : (
              <>Lo importante no es el porcentaje. Es lo que representa: Domino's convirtió el canal digital en su <span className="font-semibold text-foreground">motor central de ventas y fidelización</span>.</>
            )}
          </motion.p>

          <Callout icon={Heart} title={isEn ? "Why It Worked" : "Por qué funcionó"} tone="success">
            {isEn ? (
              <>Because customers don't buy on impulse alone: <span className="font-semibold text-foreground">they buy because it's effortless</span>.<br/><br/>
              • Fewer checkout steps = higher completion rates<br/>
              • The app creates an automatic routine<br/>
              • Ongoing iteration creates an insurmountable competitive edge</>
            ) : (
              <>Porque el cliente no compra solo por ganas: <span className="font-semibold text-foreground">compra por facilidad</span>.<br/><br/>
              • Menos pasos = menos abandono<br/>
              • La app crea hábito<br/>
              • La mejora continua crea ventaja</>
            )}
          </Callout>

          <Callout icon={AlertTriangle} title={isEn ? "The Revealing Truth" : "Lo que esto revela"} tone="warning">
            {isEn ? (
              <>Your business doesn't compete only with industry peers. You compete with:<br/><br/>
              • Customer time poverty<br/>
              • Attention distraction<br/>
              • Decision fatigue<br/>
              • Transactional friction<br/><br/>
              If your digital touchpoints don't guide prospects like a smooth highway, <span className="font-semibold text-foreground">you lose them</span>.</>
            ) : (
              <>Tu negocio no compite solo con otros negocios. Compites con:<br/><br/>
              • la falta de tiempo<br/>
              • la distracción<br/>
              • la indecisión<br/>
              • la fricción<br/><br/>
              Y si tu sistema digital no guía al cliente como una autopista, <span className="font-semibold text-foreground">lo pierdes</span>.</>
            )}
          </Callout>
        </motion.section>

        {/* TIMELINE */}
        <motion.section id="timeline" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            {isEn ? "🧭 Defining Milestones" : "🧭 Momentos clave"}
          </motion.h2>
          <VerticalTimeline />
          
          <motion.p variants={fadeUp} className={cn("text-foreground/75", textSize, lineHeight)}>
            {isEn ? (
              <>For years, their bold brand promise was: <span className="font-semibold text-foreground">"Delivered in 30 minutes or it's free"</span>. While later adapted for driver safety, they had achieved something far more valuable: <span className="font-semibold text-foreground">owning the customer purchasing experience</span>.</>
            ) : (
              <>Durante años ofrecieron la promesa: <span className="font-semibold text-foreground">"Entrega en 30 minutos o es gratis"</span>. Más tarde se ajustó por temas de seguridad, pero ya habían logrado algo más importante: <span className="font-semibold text-foreground">dominar la experiencia de compra</span>.</>
            )}
          </motion.p>
        </motion.section>

        {/* PLAYBOOK */}
        <motion.section id="playbook" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            {isEn ? "📖 Replicable Playbook" : "📖 Playbook replicable"}
          </motion.h2>
          <motion.p variants={fadeUp} className={cn("text-foreground/75", textSize, lineHeight)}>
            {isEn ? (
              <>You don't need Domino's budget to apply this philosophy. You just need their focus: <span className="font-semibold text-foreground">remove friction, drive repeat engagement</span>.</>
            ) : (
              <>No necesitas ser Domino's para aplicar el principio. Necesitas pensar como ellos: <span className="font-semibold text-foreground">reduce fricción, aumenta repetición</span>.</>
            )}
          </motion.p>

          <motion.div variants={fadeUp} className="space-y-3">
            {(isEn
              ? [
                  { n: "1", t: "Define 3 core customer actions", d: "Inquire / request quote • Pay / book • Ongoing follow-up" },
                  { n: "2", t: "Max 3-step intake", d: "Checkout or inquiry in 3 steps or fewer. Enable 1-click reorder where possible." },
                  { n: "3", t: "Smart, contextual upsells", d: "Add-ons that solve real problems rather than annoying the buyer." },
                  { n: "4", t: "End-to-end attribution", d: "From initial ad touchpoint → conversion. Bi-weekly review cycles." },
                ]
              : [
                  { n: "1", t: "Definir 3 acciones core", d: "Contactar / pedir presupuesto • Pagar / reservar • Seguimiento" },
                  { n: "2", t: "Máximo 3 pasos", d: "Checkout o solicitud en máximo 3 pasos. Si se puede: 'repetir' en 1 clic" },
                  { n: "3", t: "Upsells inteligentes", d: "Sugerencias que suman, no que molestan" },
                  { n: "4", t: "Medición completa", d: "Desde el anuncio → hasta la conversión. Optimización quincenal" },
                ]
            ).map((item) => (
              <div key={item.n} className="flex gap-4 items-start rounded-2xl border border-border/50 bg-muted/30 p-4">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">{item.n}</span>
                <div>
                  <h4 className="font-bold text-foreground">{item.t}</h4>
                  <p className="text-foreground/70 text-sm mt-1">{item.d}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* CONCLUSIÓN */}
        <motion.section id="conclusion" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-10 space-y-5">
          <motion.h2 variants={fadeUp} className="text-xl font-semibold">
            {isEn ? "🎯 Conclusion" : "🎯 Conclusión"}
          </motion.h2>

          <Callout icon={AlertTriangle} title={isEn ? "The Uncomfortable (Yet Honest) Truth" : "La conclusión incómoda (pero real)"} tone="warning">
            {isEn ? (
              <>If your business today relies on: word of mouth alone, seasons, "posting on social media when I find time", and good luck...<br/><br/>
              Then you do not have a system. <span className="font-semibold text-foreground">You only have presence</span>.<br/>And presence without an engine cannot scale.</>
            ) : (
              <>Si hoy tu negocio depende de: recomendaciones, temporadas, "cuando tengo tiempo publico", y la suerte…<br/><br/>
              Entonces no tienes un sistema. <span className="font-semibold text-foreground">Tienes presencia</span>.<br/>Y presencia sin sistema no escala.</>
            )}
          </Callout>

          <motion.div variants={fadeUp} className="rounded-2xl border border-border/50 bg-muted/30 p-6 text-center">
            <h3 className="text-xl font-bold text-foreground mb-4">{isEn ? 'A digital leap isn\'t just "having a website"' : 'El salto digital no es "tener una web"'}</h3>
            <p className={cn("text-foreground/70 mb-4", textSize)}>{isEn ? "It's establishing a clear roadmap that consistently executes:" : "Es tener un camino claro que haga esto:"}</p>
            <p className="text-xl font-bold text-primary">{isEn ? "Attract → Persuade → Convert → Retain" : "Atraer → Convencer → Convertir → Repetir"}</p>
            <p className="text-foreground/60 mt-4">{isEn ? "That is how resilient, scalable businesses are forged." : "Eso es lo que crea negocios estables."}</p>
          </motion.div>

          <Callout icon={Trophy} title={isEn ? "What Domino's Proven Beyond Doubt" : "Si Domino's demostró algo, es esto"} tone="info">
            <span className="font-semibold text-foreground">{isEn ? "When buying is frictionless, customers return." : "Cuando comprar es fácil, el cliente vuelve."}</span><br/>{isEn ? "And when customers return, business growth becomes predictable." : "Y cuando el cliente vuelve, el negocio crece."}
          </Callout>
        </motion.section>

        {/* CTA FINAL */}
        <motion.section id="cta" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="mt-12">
          <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border/50 bg-muted/30 p-7 backdrop-blur">
            <div className="flex flex-col gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-foreground/70">{isEn ? "🚀 Next Steps" : "🚀 Siguiente paso"}</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">{isEn ? "Ready to write your own success story?" : "¿Quieres tu propia historia de éxito?"}</h3>
                <p className={cn("mt-2 text-foreground/70", textSize, lineHeight)}>
                  {isEn ? "We help you build your brand, digital platform, and a clear path to scalable revenue." : "Te ayudamos a crear marca, presencia digital y estrategia clara para crecer."}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to={isEn ? "/services" : "/#servicios"} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-muted/50 px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted">
                  {isEn ? "View Services" : "Ver servicios"} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to={isEn ? "/contact" : "/#contacto"} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-foreground px-4 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90">
                  {isEn ? "Contact Us" : "Contactar"} <Send className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="pointer-events-none absolute -top-28 right-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          </motion.div>
        </motion.section>
      </main>

      {/* Floating quick action */}
      <button onClick={() => setTocOpen(true)} className="fixed bottom-20 left-4 z-[58] inline-flex items-center gap-2 rounded-2xl border border-border/50 bg-background/80 px-3 py-2 text-sm font-semibold text-foreground backdrop-blur hover:bg-muted lg:hidden" aria-label={isEn ? "Open sections" : "Abrir secciones"}>
        <ListOrdered className="h-4 w-4" />
        {isEn ? "Sections" : "Secciones"}
      </button>
    </div>
    </>
  );
}
