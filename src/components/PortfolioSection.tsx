import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Lightbulb } from 'lucide-react';
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
          {project.demoUrl ? project.demoUrl.replace(/^https?:\/\//, '') : project.frameLabel ?? project.title}
        </span>
      </div>
      {media}
    </div>
  );
};

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
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-[hsl(var(--nova-purple-dark))]"
          >
            Probar la demo en vivo
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
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
          subtitle="Sistemas a medida para negocios y también proyectos personales. Si lo puedes imaginar, lo diseñamos y lo construimos."
        />

        <div className="space-y-20 md:space-y-28">
          {PORTFOLIO_PROJECTS.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Personal projects call to action */}
        <div className="mt-20 flex flex-col items-start gap-5 rounded-3xl border border-dashed border-primary/30 bg-accent/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
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
