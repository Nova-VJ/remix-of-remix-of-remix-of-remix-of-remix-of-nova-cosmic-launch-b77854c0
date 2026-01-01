import { useState } from 'react';
import { ShoppingCart as CartIcon, X, Trash2, Tag, Check, Mail, MessageCircle, ChevronRight, Gift } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const WHATSAPP_NUMBER = '34659343822';
const EMAIL = 'info@solutionsnova.es';

const ShoppingCart = () => {
  const { 
    items, 
    removeItem, 
    clearCart, 
    promoCode, 
    setPromoCode, 
    isPromoApplied, 
    applyPromo, 
    getTotal, 
    getDiscount,
    itemCount,
    freeItems
  } = useCart();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = () => {
    if (applyPromo()) {
      setPromoError('');
    } else {
      setPromoError('Código no válido');
    }
  };

  const generateBudgetMessage = () => {
    const allItems = [...items, ...freeItems];
    let message = '🛒 *PRESUPUESTO SOLICITADO*\n\n';
    message += '*Servicios seleccionados:*\n';
    
    allItems.forEach(item => {
      const priceText = item.isFree ? '(GRATIS)' : `${item.price}€${item.isMonthly ? '/mes' : ''}`;
      message += `• ${item.name}: ${priceText}\n`;
    });
    
    message += '\n';
    
    if (isPromoApplied) {
      message += `*Código aplicado:* NOVA30 (-30%)\n`;
      message += `*Descuento:* -${getDiscount().toFixed(0)}€\n`;
    }
    
    message += `\n*TOTAL:* ${getTotal().toFixed(0)}€`;
    
    if (freeItems.length > 0) {
      message += '\n\n🎁 *Beneficios incluidos:*\n';
      freeItems.forEach(item => {
        message += `• ${item.name} (GRATIS)\n`;
      });
    }
    
    return message;
  };

  const handleSendWhatsApp = () => {
    const message = encodeURIComponent(generateBudgetMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    setIsSent(true);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent('Solicitud de Presupuesto - SolutionsNova');
    const body = encodeURIComponent(generateBudgetMessage().replace(/\*/g, ''));
    window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`, '_blank');
    setIsSent(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (isSent) {
      clearCart();
      setShowCheckout(false);
      setIsSent(false);
    }
  };

  if (isSent) {
    return (
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetTrigger asChild>
          <button className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all">
            <CartIcon className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="bg-background text-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md bg-background/95 backdrop-blur-xl border-border">
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Presupuesto enviado</h2>
            <p className="text-muted-foreground mb-8">
              Gracias por confiar en nosotros.<br />
              Pronto te contactaremos.
            </p>
            <p className="text-sm text-muted-foreground/70 mb-8">
              Un agente pronto te contactará para evaluar tu presupuesto en medida del proyecto.
            </p>
            <Button onClick={handleClose} className="w-full">
              Cerrar
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all">
          <CartIcon className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="bg-background text-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-background/95 backdrop-blur-xl border-border flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-foreground flex items-center gap-2">
            <CartIcon className="w-5 h-5" />
            Tu carrito
          </SheetTitle>
        </SheetHeader>

        {!showCheckout ? (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              {items.length === 0 && freeItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CartIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Tu carrito está vacío</p>
                  <p className="text-sm mt-2">Añade servicios para comenzar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50">
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{item.name}</p>
                        <p className="text-primary font-bold">
                          {item.price}€{item.isMonthly && <span className="text-xs font-normal text-muted-foreground">/mes</span>}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Free items */}
                  {freeItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/30">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-primary" />
                          <p className="font-medium text-foreground text-sm">{item.name}</p>
                        </div>
                        <p className="text-primary font-bold">
                          GRATIS
                          <span className="text-xs font-normal text-muted-foreground ml-2 line-through">{item.price}€{item.isMonthly && '/mes'}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Promo code section */}
            {items.length > 0 && (
              <div className="border-t border-border pt-4">
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Código promocional"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="pl-10 bg-muted/50"
                      disabled={isPromoApplied}
                    />
                  </div>
                  <Button 
                    onClick={handleApplyPromo} 
                    variant="outline"
                    disabled={isPromoApplied || !promoCode}
                  >
                    {isPromoApplied ? <Check className="w-4 h-4" /> : 'Aplicar'}
                  </Button>
                </div>
                {promoError && <p className="text-destructive text-sm mb-2">{promoError}</p>}
                {isPromoApplied && (
                  <p className="text-primary text-sm mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    ¡Código NOVA30 aplicado! -30% de descuento
                  </p>
                )}
                {isPromoApplied && freeItems.length === 0 && (
                  <p className="text-muted-foreground text-xs mb-2">
                    * Con el código NOVA30 no se aplican servicios gratuitos adicionales
                  </p>
                )}

                {/* Totals */}
                <div className="space-y-2 mb-4">
                  {isPromoApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Descuento (30%)</span>
                      <span className="text-primary">-{getDiscount().toFixed(0)}€</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">{getTotal().toFixed(0)}€</span>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowCheckout(true)} 
                  className="w-full"
                  size="lg"
                >
                  Solicitar presupuesto
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center px-4">
            <h3 className="text-xl font-bold text-foreground text-center mb-2">
              Enviar presupuesto
            </h3>
            <p className="text-muted-foreground text-center mb-8 text-sm">
              Un agente pronto te contactará para evaluar tu presupuesto en medida del proyecto.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleSendWhatsApp}
                className="w-full h-14 text-base"
                variant="default"
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Enviar por WhatsApp
              </Button>
              
              <Button 
                onClick={handleSendEmail}
                className="w-full h-14 text-base"
                variant="outline"
              >
                <Mail className="w-5 h-5 mr-3" />
                Enviar por correo
              </Button>
            </div>
            
            <Button 
              onClick={() => setShowCheckout(false)}
              variant="ghost"
              className="mt-6"
            >
              Volver al carrito
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;
