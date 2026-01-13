import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight, MessageCircle, TrendingUp, Smartphone, Zap } from 'lucide-react';
import dominosImage from '@/assets/dominos-presentation.jpg';

const WHATSAPP_DIAGNOSTICO = "https://wa.me/34659343822?text=Hola%20NOVA%20Marketing%2C%20quiero%20solicitar%20mi%20diagn%C3%B3stico%20gratuito.%20Mi%20negocio%20es%3A%20_____";

const CasoDominos = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/casos-exito" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </Link>
          <span className="text-sm text-muted-foreground">Caso de estudio</span>
        </div>
      </header>

      {/* Article */}
      <article className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <header className="mb-12">
            <div className="text-sm text-primary font-medium mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Caso de estudio
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Presencia no es igual a escalar un sistema.
            </h1>
            <p className="text-xl text-muted-foreground">
              Caso: Domino's Pizza
            </p>
          </header>

          {/* Featured image */}
          <figure className="mb-12 rounded-2xl overflow-hidden">
            <img 
              src={dominosImage} 
              alt="Domino's Pizza presentación - 15 formas de pedir"
              className="w-full h-auto"
            />
            <figcaption className="text-sm text-muted-foreground mt-3 text-center">
              Domino's: "15 Ways to Get Your Slice" - Múltiples canales digitales de venta
            </figcaption>
          </figure>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-foreground/90 leading-relaxed mb-8">
              En 2008, Domino's Pizza era una cadena de pizzerías con problemas de imagen y ventas estancadas.
            </p>

            <p className="text-foreground/80 leading-relaxed mb-8">
              Los dirigentes de esta conocida compañía vieron una oportunidad de evolucionar y expandir el negocio haciendo una propuesta clara digital, y al final la apuesta no salió mal: <strong className="text-primary">Más del 90% de ventas hoy día son de vía digital</strong>, y el 76,4% de los pedidos digitales son en su app. La propuesta es clara: Facilitación del producto y fidelización.
            </p>

            <blockquote className="border-l-4 border-primary pl-6 my-10 py-4 bg-primary/5 rounded-r-xl">
              <p className="text-xl font-medium text-foreground italic">
                "Domino's no ganó por hacer mejor pizza. Ganó por hacer más fácil comprarla."
              </p>
            </blockquote>

            <p className="text-foreground/80 leading-relaxed mb-8">
              En un mercado donde todos compiten por precio, promociones y sabor, Domino's decidió competir con algo más silencioso (y más poderoso): <strong>la fricción</strong>. Esa sensación de "qué pereza", "tengo que llamar", "me lío", "tardo", "mejor lo dejo para otro día".
            </p>

            <p className="text-foreground/80 leading-relaxed mb-8">
              Ellos entendieron una verdad simple: <strong className="text-primary">cuando comprar es fácil, el cliente vuelve</strong>. Y cuando vuelve, el negocio se expande.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">La idea que lo cambió todo</h2>

            <p className="text-foreground/80 leading-relaxed mb-6">
              Existe una frase que se repite en el mundo del emprendimiento:
            </p>

            <blockquote className="border-l-4 border-primary/50 pl-6 my-6">
              <p className="text-lg text-foreground/90 italic">
                "Cada compañía es una compañía tecnológica."
              </p>
            </blockquote>

            <p className="text-foreground/80 leading-relaxed mb-8">
              Domino's lo llevó aún más lejos. Ellos mismos se describen como: <strong>"Una compañía de tecnología que hace pizzas."</strong>
            </p>

            <p className="text-foreground/80 leading-relaxed mb-8">
              No lo dicen por postureo. Lo dicen porque construyeron un sistema que convierte una venta aislada en un hábito.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Contexto: el verdadero problema no era la competencia… era la repetición</h2>

            <p className="text-foreground/80 leading-relaxed mb-6">
              El mercado de comida rápida es brutal. Hay opciones por todos lados. La pregunta no es "¿quién tiene mejor producto?" sino:
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-foreground/80">
                <ChevronRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>¿Quién consigue que el cliente te elija otra vez?</span>
              </li>
              <li className="flex items-start gap-3 text-foreground/80">
                <ChevronRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>¿Quién hace que pedir sea tan sencillo que parezca automático?</span>
              </li>
            </ul>

            <p className="text-foreground/80 leading-relaxed mb-8">
              Domino's necesitaba aumentar: <strong>frecuencia</strong> (que te acuerdes más de ellos), <strong>valor por cliente</strong> (upsells sin molestar), y <strong>consistencia</strong> (que en móvil funcione perfecto siempre).
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">La estrategia: convertir el pedido en una experiencia rápida y repetible</h2>

            <p className="text-foreground/80 leading-relaxed mb-8">
              Domino's no "hizo una app". Hizo un <strong>producto digital</strong>. Y eso es un mundo aparte.
            </p>

            <h3 className="text-xl font-bold text-foreground mt-10 mb-4">Acciones clave que marcaron la diferencia</h3>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-foreground/80">
                <Smartphone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Inversión sostenida en su producto digital:</strong> la app como canal principal, no como "extra".</span>
              </li>
              <li className="flex items-start gap-3 text-foreground/80">
                <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Optimización del "momento compra":</strong> menos pasos, más claridad, menos fricción.</span>
              </li>
              <li className="flex items-start gap-3 text-foreground/80">
                <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Reordenar rápido:</strong> cuando ya confías, quieres repetir sin pensar.</span>
              </li>
              <li className="flex items-start gap-3 text-foreground/80">
                <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Personalización basada en datos:</strong> recomendaciones y mejoras constantes.</span>
              </li>
            </ul>

            <p className="text-foreground/80 leading-relaxed mb-8">
              Nada de esto es una acción puntual. Es una cultura: <strong>iterar, medir, mejorar, repetir</strong>.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Resultados (y por qué importan)</h2>

            <div className="grid grid-cols-2 gap-4 my-10">
              <div className="glass-card p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">90%+</p>
                <p className="text-sm text-muted-foreground">Ventas digitales</p>
              </div>
              <div className="glass-card p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">76.3%</p>
                <p className="text-sm text-muted-foreground">Pedidos desde la app</p>
              </div>
            </div>

            <p className="text-foreground/80 leading-relaxed mb-8">
              ¿Lo importante? No es el porcentaje. Es lo que significa: <strong className="text-primary">Domino's convirtió el canal digital en su motor central de ventas y fidelización.</strong>
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Por qué funcionó (la parte que te interesa si tienes un negocio)</h2>

            <p className="text-foreground/80 leading-relaxed mb-6">
              Porque el cliente no compra solo por ganas: <strong>compra por facilidad</strong>.
            </p>

            <div className="space-y-6 my-8">
              <div className="glass-card p-6">
                <h4 className="font-bold text-foreground mb-2">1) Menos pasos = menos abandono</h4>
                <p className="text-muted-foreground">Cada clic de más es un cliente menos.</p>
              </div>
              <div className="glass-card p-6">
                <h4 className="font-bold text-foreground mb-2">2) La app crea hábito (y hábito = ingresos estables)</h4>
                <p className="text-muted-foreground">Cuando la compra es cómoda, repetir se vuelve natural. Eso aumenta el LTV (valor de vida del cliente).</p>
              </div>
              <div className="glass-card p-6">
                <h4 className="font-bold text-foreground mb-2">3) La mejora continua crea ventaja compuesta</h4>
                <p className="text-muted-foreground">Cada sprint, cada ajuste, cada mejora… suma. Y esa suma, con el tiempo, se vuelve inalcanzable para quien "solo hace presencia".</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Lo que esto revela: tu negocio no compite solo con otros negocios</h2>

            <p className="text-foreground/80 leading-relaxed mb-6">
              Compites con:
            </p>

            <ul className="space-y-2 mb-8">
              <li className="text-foreground/80">• la falta de tiempo,</li>
              <li className="text-foreground/80">• la distracción,</li>
              <li className="text-foreground/80">• la indecisión,</li>
              <li className="text-foreground/80">• y la fricción.</li>
            </ul>

            <p className="text-foreground/80 leading-relaxed mb-8">
              Y si tu sistema digital no guía al cliente como una autopista, lo pierdes.
            </p>

            <blockquote className="border-l-4 border-destructive/50 pl-6 my-10 py-4 bg-destructive/5 rounded-r-xl">
              <p className="text-lg text-foreground">
                La mayoría de empresas creen que el problema es "no tener marketing". El problema real suele ser: <strong>no tener un sistema que convierta la atención en ventas</strong>.
              </p>
            </blockquote>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Playbook replicable (lo que haría SolutionsNova)</h2>

            <p className="text-foreground/80 leading-relaxed mb-8">
              No necesitas ser Domino's para aplicar el principio. Necesitas pensar como ellos: <strong className="text-primary">reduce fricción, aumenta repetición</strong>.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-foreground">Definir 3 acciones core</h4>
                  <p className="text-muted-foreground text-sm">Contactar / pedir presupuesto • Pagar / reservar • Seguimiento (WhatsApp / email / recordatorio)</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-foreground">Checkout o solicitud en máximo 3 pasos</h4>
                  <p className="text-muted-foreground text-sm">Y, si se puede: "repetir" en 1 clic (o un formulario ultra rápido)</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-foreground">Upsells inteligentes (sin interrumpir)</h4>
                  <p className="text-muted-foreground text-sm">Sugerencias que suman, no que molestan.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">4</span>
                <div>
                  <h4 className="font-bold text-foreground">Medición completa del embudo</h4>
                  <p className="text-muted-foreground text-sm">Desde el anuncio o contenido → hasta la conversión. Y optimización quincenal.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">La conclusión incómoda (pero real)</h2>

            <p className="text-foreground/80 leading-relaxed mb-6">
              Si hoy tu negocio depende de: recomendaciones, temporadas, "cuando tengo tiempo publico", y la suerte…
            </p>

            <p className="text-foreground/80 leading-relaxed mb-8">
              Entonces no tienes un sistema. <strong>Tienes presencia</strong>. Y presencia sin sistema no escala.
            </p>

            <div className="glass-card p-8 my-10 text-center">
              <h3 className="text-xl font-bold text-foreground mb-4">El salto digital no es "tener una web"</h3>
              <p className="text-lg text-muted-foreground mb-4">
                Es tener un camino claro que haga esto:
              </p>
              <p className="text-2xl font-bold text-primary">
                Atraer → Convencer → Convertir → Repetir
              </p>
              <p className="text-muted-foreground mt-4">
                Eso es lo que crea negocios estables.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Si quieres aplicar esto en tu negocio</h2>

            <p className="text-foreground/80 leading-relaxed mb-8">
              En SolutionsNova no vendemos piezas sueltas. Diseñamos un sistema conectado:
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-foreground/80">
                <ChevronRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Branding</strong> para confianza inmediata</span>
              </li>
              <li className="flex items-start gap-3 text-foreground/80">
                <ChevronRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Contenido</strong> para atraer atención real</span>
              </li>
              <li className="flex items-start gap-3 text-foreground/80">
                <ChevronRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Web/Landing</strong> para convertir visitas en clientes</span>
              </li>
              <li className="flex items-start gap-3 text-foreground/80">
                <ChevronRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span><strong>Optimización</strong> para mejorar cada mes</span>
              </li>
            </ul>

            <blockquote className="border-l-4 border-primary pl-6 my-10 py-4 bg-primary/5 rounded-r-xl">
              <p className="text-xl font-medium text-foreground italic">
                Si Domino's demostró algo, es esto: Cuando comprar es fácil, el cliente vuelve. Y cuando el cliente vuelve, el negocio crece.
              </p>
            </blockquote>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <a
              href={WHATSAPP_DIAGNOSTICO}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-flex items-center gap-3 text-primary-foreground px-8 py-4"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Solicita tu diagnóstico gratuito ahora mismo</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
};

export default CasoDominos;
