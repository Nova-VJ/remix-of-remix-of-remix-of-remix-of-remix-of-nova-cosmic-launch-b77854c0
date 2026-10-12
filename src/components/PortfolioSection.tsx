import { ArrowUpRight } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { PORTFOLIO_PROJECTS } from '@/data/portfolio';

const PortfolioSection = () => {
  if (PORTFOLIO_PROJECTS.length === 0) return null;

  return (
    <section id="trabajos" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Trabajos"
          title="Proyectos que hemos hecho"
          subtitle="Algunos de los negocios a los que hemos ayudado a crecer online."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO_PROJECTS.map((project) => {
            const content = (
              <>
                <div className="aspect-[16/10] overflow-hidden border-b border-border bg-muted">
                  <img
                    src={project.image}
                    alt={`Proyecto ${project.title}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{project.category}</p>
                  <h3 className="mt-1.5 flex items-center gap-1 text-lg font-bold text-foreground">
                    {project.title}
                    {project.url && <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{project.description}</p>
                </div>
              </>
            );

            return project.url ? (
              <a key={project.title} href={project.url} target="_blank" rel="noopener noreferrer" className="group glass-card hover-lift block">
                {content}
              </a>
            ) : (
              <article key={project.title} className="group glass-card">
                {content}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
