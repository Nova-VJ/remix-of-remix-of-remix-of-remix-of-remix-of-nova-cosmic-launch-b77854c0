import { Check, ShoppingCart, Crown, Gem, Gift } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const packages = [
  {
    id: 'pkg-pro',
    name: "Paquete Pro",
    price: 800,
    priceLabel: "800€",
    icon: Crown,
    description: "Ideal para emprendedores que quieren presencia web y redes.",
    includes: [
      "Página web profesional",
      "Contenido para redes sociales (1 mes)",
    ],
    freeItems: ["Marketing Digital GRATIS"],
    highlight: false,
    note: "Ahorra vs compra individual",
  },
  {
    id: 'pkg-plus',
    name: "Paquete Plus",
    price: 1900,
    priceLabel: "1.900€",
    icon: Gem,
    description: "El pack completo para transformar tu negocio digitalmente.",
    includes: [
      "Página web profesional",
      "Contenido para redes sociales (1 mes)",
      "Branding profesional",
      "Aplicación móvil MVP",
    ],
    freeItems: ["Marketing Digital GRATIS", "1 mes de SEM GRATIS"],
    highlight: true,
    note: "No acumulable con código NOVA20",
  }
];

const PackagesSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const { addItem, items, isPromoApplied } = useCart();

  const handleAddPackage = (pkg: typeof packages[0]) => {
    // Check if already has items
    if (items.length > 0) {
      toast.error('Vacía tu carrito antes de añadir un paquete');
      return;
    }
    
    // Check if Paquete Plus and NOVA30 applied
    if (pkg.id === 'pkg-plus' && isPromoApplied) {
      toast.error('Paquete Plus no es compatible con el código NOVA30');
      return;
    }

    const cartItem = {
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      type: 'package' as const,
    };
    addItem(cartItem);
    toast.success(`${pkg.name} añadido al carrito`);
  };

  const isInCart = (id: string) => items.some(item => item.id === id);
  const hasPackage = items.some(item => item.type === 'package');

  return (
    <section id="paquetes" ref={ref as React.RefObject<HTMLElement>} className="relative py-20 px-6">
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3 text-glow">
            Paquetes especiales
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Combina servicios y ahorra. Incluyen beneficios exclusivos.
          </p>
        </div>

        {/* Packages grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative glass-card p-6 flex flex-col transition-all duration-700 hover-lift overflow-visible ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${pkg.highlight ? 'border-primary/50 ring-2 ring-primary/20' : ''}`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {pkg.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full whitespace-nowrap shadow-lg shadow-primary/30 z-20">
                  ⭐ MEJOR VALOR
                </div>
              )}

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <pkg.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                  <p className="text-2xl font-bold text-primary">{pkg.priceLabel}</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{pkg.description}</p>

              {/* Includes */}
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground mb-2">Incluye:</p>
                <ul className="space-y-2">
                  {pkg.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Free items */}
              <div className="mb-6 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Bonificaciones incluidas:
                </p>
                <ul className="space-y-1">
                  {pkg.freeItems.map((item, i) => (
                    <li key={i} className="text-sm text-primary/80">• {item}</li>
                  ))}
                </ul>
              </div>

              {pkg.note && (
                <p className="text-xs text-muted-foreground mb-4 text-center">* {pkg.note}</p>
              )}

              {/* Add to cart button */}
              <Button
                onClick={() => handleAddPackage(pkg)}
                disabled={isInCart(pkg.id) || (hasPackage && !isInCart(pkg.id))}
                variant={pkg.highlight ? "default" : "outline"}
                className={`w-full mt-auto ${pkg.highlight ? 'shadow-lg shadow-primary/40 hover:shadow-primary/60 hover:scale-[1.02] transition-all' : ''}`}
                size="lg"
              >
                {isInCart(pkg.id) ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    En tu carrito
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Seleccionar paquete
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Individual services note */}
        <p className="text-center text-muted-foreground text-sm mt-8">
          ¿Prefieres servicios individuales? Selecciónalos arriba en "Nuestros servicios"
        </p>
      </div>
    </section>
  );
};

export default PackagesSection;
