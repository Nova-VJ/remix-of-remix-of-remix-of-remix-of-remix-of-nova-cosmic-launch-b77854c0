import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Lightbulb } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { SECTOR_DEMOS } from '@/data/demos';

const DemosSection = () => (
  <section id="demos" className="cv-auto relative px-4 py-20 sm:px-6 md:py-28">
    <div className="mx-auto max-w-6xl">
      <SectionHeader
        eyebrow="Demos por sector"
        title="¿Cómo quedaría tu negocio?"
        subtitle="Elige tu sector y prueba una web de ejemplo: reserva online, asistente de chat, app en Google Play y App Store, y el panel para gestionarlo todo."
      />

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {SECTOR_DEMOS.map(({ carpeta, sector, icon: Icon }) => (
          <li key={carpeta}>
            <a
              href={`/demos/${carpeta}/`}
              target="_blank"
              rel="noopener"
              className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-neutral-900 p-4 lg:aspect-[16/9] text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <img
                src={`/demos/comun/fondos/${carpeta}.webp`}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" aria-hidden="true" />
              <span className="relative mb-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/25">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="relative text-base font-bold leading-tight sm:text-lg">{sector}</span>
              <span className="relative mt-1 inline-flex items-center gap-1 text-sm font-medium text-white/85 group-hover:text-white">
                Ver demo
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </a>
          </li>
        ))}
        <li>
          <Link
            to="/?openBriefing=true"
            className="group flex aspect-[4/3] flex-col justify-end rounded-2xl border border-dashed border-primary/40 bg-accent/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:aspect-[16/9]"
          >
            <span className="mb-auto flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg" style={{ backgroundImage: 'var(--gradient-purple)' }}>
              <Lightbulb className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-base font-bold leading-tight text-foreground sm:text-lg">¿No ves tu sector?</span>
            <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Cuéntanos tu proyecto
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        </li>
      </ul>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Son negocios inventados para enseñarte el resultado; las fotos de ambiente están creadas con IA.{' '}
        <a href="/demos/" target="_blank" rel="noopener" className="font-medium text-primary underline-offset-4 hover:underline">
          Ver todas las demos
        </a>
      </p>
    </div>
  </section>
);

export default DemosSection;
