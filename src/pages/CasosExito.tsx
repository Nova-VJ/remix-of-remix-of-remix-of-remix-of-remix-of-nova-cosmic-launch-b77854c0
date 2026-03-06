import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, TrendingUp, Sparkles, Eye } from 'lucide-react';
import dominosImage from '@/assets/dominos-presentation.jpg';
import hawkersLogo from '@/assets/hawkers-logo.jpg';
import ThemeToggle from '@/components/ThemeToggle';
import SEOHead from '@/components/SEOHead';

const CasosExito = () => {
  const casos = [
    {
      id: 'hawkers',
      title: 'Hawkers: de una idea simple a una marca global',
      description: 'Un artículo para emprendedores que quieren empezar pero sienten que les falta el mapa. Descubre cómo Hawkers construyó una marca global con marketing digital.',
      image: hawkersLogo,
      tags: ['Caso real', 'Crecimiento', 'Lecciones prácticas'],
      featured: true,
      isNew: true,
      link: '/casos-exito/hawkers',
    },
    {
      id: 'dominos',
      title: 'Domino\'s Pizza: Presencia no es igual a escalar',
      description: 'Más del 90% de ventas hoy día son digitales. Descubre cómo Domino\'s convirtió el canal digital en su motor central de ventas y fidelización.',
      image: dominosImage,
      tags: ['Sistema digital', 'Fidelización', 'App móvil'],
      featured: true,
      isNew: false,
      link: '/casos-exito/dominos',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Casos de éxito</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Casos de estudio
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Historias reales de <span className="text-primary">crecimiento digital</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analizamos marcas que transformaron su negocio con estrategia digital. 
            Cada caso incluye lecciones prácticas que puedes aplicar hoy.
          </p>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2">
            {casos.map((caso) => (
              <Link
                key={caso.id}
                to={caso.link}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
              >
                {/* Image or Gradient */}
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                  {caso.image ? (
                    <img 
                      src={caso.image} 
                      alt={caso.title}
                      className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-primary/40" />
                    </div>
                  )}
                  
                  {/* New badge */}
                  {caso.isNew && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      NUEVO
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {caso.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {caso.title}
                  </h2>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {caso.description}
                  </p>

                  <div className="flex items-center gap-2 text-primary font-medium text-sm">
                    <Eye className="w-4 h-4" />
                    Leer caso completo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Coming soon */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-dashed border-border bg-muted/30">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
              <p className="text-muted-foreground">
                Más casos de éxito <span className="text-foreground font-medium">próximamente</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CasosExito;
