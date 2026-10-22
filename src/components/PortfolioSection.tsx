import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lightbulb, Quote, Sparkles, Star } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import DemoVideo from '@/components/DemoVideo';
import { PORTFOLIO_PROJECTS, type PortfolioProject } from '@/data/portfolio';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';

const MediaFrame = ({ project }: { project: PortfolioProject }) => {
  const media = project.video ? (
    <DemoVideo src={project.video} poster={project.poster} aspect={project.aspect} label={project.title} />
  ) : (
    <img src={project.poster} alt={project.title} loading="lazy" decoding="async" className="w-full" style={{ aspectRatio: String(project.aspect) }} />
  );

  if (project.frame === 'game') {
    return (
      <div className="relative rounded-2xl bg-gradient-to-br from-amber-300/70 via-amber-600/40 to-stone-900 p-[3px] shadow-[0_30px_80px_-30px_rgba(120,72,20,0.55)]">
        <div className="overflow-hidden rounded-[14px] ring-1 ring-black/40">{media}</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_80px_-30px_hsl(262_60%_30%/0.4)]">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/60 px-4 py-2.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 h-5 flex-1 truncate rounded-md bg-background px-2 text-[10px] leading-5 text-muted-foreground">
          {project.frameLabel ?? project.title}
        </span>
      </div>
      {media}
    </div>
  );
};

const TestimonialCard = ({ t }: { t: NonNullable<PortfolioProject['testimonial']> }) => (
  <figure className="relative mt-6 rounded-2xl border border-primary/20 bg-accent/40 p-5">
    <Quote className="absolute right-4 top-4 h-6 w-6 text-primary/25" aria-hidden="true" />
    <div className="flex gap-0.5" role="img" aria-label={`${t.rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn('h-4 w-4', i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30')} aria-hidden="true" />
      ))}
    </div>
    <blockquote className="mt-3 text-[15px] leading-relaxed text-foreground">“{t.quote}”</blockquote>
    <figcaption className="mt-4 flex items-center gap-3">
      {t.photo ? (
        <img src={t.photo} alt={t.name} loading="lazy" decoding="async" className="h-11 w-11 rounded-full object-cover ring-2 ring-background" />
      ) : (
        <span className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundImage: 'var(--gradient-purple)' }} aria-hidden="true">
          {t.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
        </span>
      )}
      <span className="text-sm">
        <span className="block font-semibold text-foreground">{t.name}</span>
        <span className="block text-muted-foreground">{t.business}</span>
      </span>
    </figcaption>
  </figure>
);

const ProjectRow = ({ project, index }: { project: PortfolioProject; index: number }) => {
  const { ref, isVisible } = useScrollReveal();
  const flip = index % 2 === 1;

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className={cn(
        'grid items-center gap-8 transition-all duration-700 lg:grid-cols-[1.25fr_1fr] lg:gap-14',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      )}
    >
      <div className={cn(flip && 'lg:order-2')}>
        <MediaFrame project={project} />
      </div>
      <div className={cn(flip && 'lg:order-1')}>
        <p className="eyebrow">{project.kind}</p>
        <h3 className="mt-3 text-2xl font-bold leading-tight text-foreground md:text-3xl">{project.title}</h3>
        <p className="mt-4 leading-relaxed text-muted-foreground">{project.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {project.highlights.map((h) => (
            <li key={h} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80">
              {h}
            </li>
          ))}
        </ul>
        {project.note && <p className="mt-3 text-xs text-muted-foreground">{project.note}</p>}
        {project.testimonial && <TestimonialCard t={project.testimonial} />}
      </div>
    </article>
  );
};

const PortfolioSection = () => {
  const navigate = useNavigate();
  if (PORTFOLIO_PROJECTS.length === 0) return null;

  return (
    <section id="proyectos" className="cv-auto relative px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Proyectos"
          title="Software real, funcionando"
          subtitle="Herramientas que usamos nosotros mismos, sistemas a medida para negocios y también proyectos personales. Si lo puedes imaginar, lo diseñamos y lo construimos."
        />

        <div className="space-y-20 md:space-y-28">
          {PORTFOLIO_PROJECTS.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Older client websites: set expectations and invite a redesign */}
        <div className="mt-20 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-10">
            <div>
              <p className="eyebrow">Nuestra trayectoria</p>
              <h3 className="mt-3 text-2xl font-bold leading-tight text-foreground md:text-3xl">Decenas de páginas web y clientes satisfechos</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Muchas de las webs que hemos hecho se crearon hace años. Desde entonces, nuestros estándares de diseño y despliegue han evolucionado al
                ritmo de la industria, tanto en diseño como en estructura: webs más rápidas, pensadas primero para el móvil y preparadas para Google.
                Los proyectos de esta página son el reflejo de cómo trabajamos hoy.
              </p>
            </div>
            <div className="rounded-2xl bg-accent/50 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg" style={{ backgroundImage: 'var(--gradient-purple)' }}>
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-4 font-semibold text-foreground">¿Tu web ya tiene unos años?</p>
              <p className="mt-1 text-sm text-muted-foreground">Le damos un cambio de imagen y la ponemos al día. Te decimos qué mejorar, sin compromiso.</p>
              <button
                type="button"
                onClick={() => navigate('/?openBriefing=true')}
                className="btn-glow-sm mt-5 inline-flex items-center gap-2 whitespace-nowrap text-primary-foreground"
              >
                Moderniza tu web
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Personal projects call to action */}
        <div className="mt-8 flex flex-col items-start gap-5 rounded-3xl border border-dashed border-primary/30 bg-accent/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundImage: 'var(--gradient-purple)' }}>
              <Lightbulb className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-foreground">¿Tienes una idea propia?</h3>
              <p className="mt-1 text-muted-foreground">Una app, una herramienta interna, un juego… Cuéntanosla y te decimos cómo hacerla realidad.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/?openBriefing=true')}
            className="btn-glow-sm inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-primary-foreground"
          >
            Cuéntanos tu idea
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
