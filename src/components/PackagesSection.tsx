import { Check, Plus, Crown, Gem, Gift } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import SectionHeader from '@/components/SectionHeader';

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
      toast.error('Vacía tu presupuesto antes de añadir un paquete');
      return;
    }
    
    // Check if Paquete Plus and NOVA30 applied
    if (pkg.id === 'pkg-plus' && isPromoApplied) {
      toast.error('Paquete Plus no es compatible con el código NOVA20');
      return;
    }

    const cartItem = {
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      type: 'package' as const,
    };
    addItem(cartItem);
    toast.success(`${pkg.name} añadido a tu presupuesto`);
  };

  const isInCart = (id: string) => items.some(item => item.id === id);
  const hasPackage = items.some(item => item.type === 'package');

  return (
    <section id="paquetes" ref={ref as React.RefObject<HTMLElement>} className="relative py-20 md:py-28 px-4 sm:px-6">
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section header */}
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SectionHeader
            eyebrow="Precios"
            title="Paquetes para empezar con todo"
            subtitle="Combina servicios y ahorra. Incluyen bonificaciones que no tendrías comprándolos por separado."
          />
        </div>

        {/* Packages grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative glass-card p-7 flex flex-col transition-all duration-700 hover-lift overflow-visible ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${pkg.highlight ? 'gradient-border' : ''} spotlight`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {pkg.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 text-white text-xs font-semibold rounded-full whitespace-nowrap z-20 shadow-[0_6px_16px_-6px_hsl(262_78%_45%/0.6)]" style={{ backgroundImage: 'var(--gradient-purple)' }}>
                  Recomendado
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
                className="w-full mt-auto"
                size="lg"
              >
                {isInCart(pkg.id) ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    En tu presupuesto
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Elegir este paquete
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Individual services note */}
        <p className="text-center text-muted-foreground text-sm mt-8">
          ¿Prefieres servicios sueltos? Añádelos desde la sección de servicios.
        </p>
      </div>
    </section>
  );
};

export default PackagesSection;
