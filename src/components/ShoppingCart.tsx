import { useState } from 'react';
import { Trash2, Tag, Check, Mail, MessageCircle, ChevronRight, Gift, FileText } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import BriefingFormModal from '@/components/BriefingForm/LazyBriefingFormModal';
import { ServiceType } from '@/components/BriefingForm/types';
import { useTranslation } from '@/i18n';
import { WHATSAPP_NUMBER, CONTACT_EMAIL } from '@/config/env';

// Map cart item names to service types
const SERVICE_MAP: Record<string, ServiceType> = {
  'Branding profesional': 'branding',
  'Páginas web que convierten': 'web',
  'Aplicaciones móviles': 'apps',
  'Contenido para redes sociales': 'rrss',
  'Professional Branding': 'branding',
  'High-Converting Websites': 'web',
  'Custom Mobile Apps': 'apps',
  'Social Media Management': 'rrss',
};

const ShoppingCart = () => {
  const { t, formatCurrency, isEn } = useTranslation();
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
  const [showBriefingModal, setShowBriefingModal] = useState(false);

  // Detect services for briefing form
  const detectedServices = items
    .map(item => SERVICE_MAP[item.name])
    .filter((s): s is ServiceType => !!s);
  const hasRelevantServices = detectedServices.length > 0;

  const handleApplyPromo = () => {
    if (applyPromo()) {
      setPromoError('');
    } else {
      setPromoError(isEn ? 'Invalid promo code' : 'Código no válido');
    }
  };

  const generateBudgetMessage = () => {
    const allItems = [...items, ...freeItems];
    let message = isEn
      ? '🛒 *PROJECT QUOTE REQUEST*\n\n*Selected services:*\n'
      : '🛒 *PRESUPUESTO SOLICITADO*\n\n*Servicios seleccionados:*\n';
    
    allItems.forEach(item => {
      const priceText = item.isFree
        ? (isEn ? '(FREE)' : '(GRATIS)')
        : `${formatCurrency(item.price)}${item.isMonthly ? (isEn ? '/mo' : '/mes') : ''}`;
      message += `• ${item.name}: ${priceText}\n`;
    });
    
    message += '\n';
    
    if (isPromoApplied) {
      message += isEn
        ? `*Applied code:* NOVA20 (-20%)\n*Discount:* -${formatCurrency(getDiscount())}\n`
        : `*Código aplicado:* NOVA20 (-20%)\n*Descuento:* -${formatCurrency(getDiscount())}\n`;
    }
    
    message += isEn
      ? `\n*ESTIMATED TOTAL:* ${formatCurrency(getTotal())}`
      : `\n*TOTAL:* ${formatCurrency(getTotal())}`;
    
    if (freeItems.length > 0) {
      message += isEn ? '\n\n🎁 *Included Bonuses:*\n' : '\n\n🎁 *Beneficios incluidos:*\n';
      freeItems.forEach(item => {
        message += `• ${item.name} ${isEn ? '(FREE)' : '(GRATIS)'}\n`;
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
    const subject = encodeURIComponent(isEn ? 'Quote Request - Nova Marketing Solutions' : 'Solicitud de Presupuesto - SolutionsNova');
    const body = encodeURIComponent(generateBudgetMessage().replace(/\*/g, ''));
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, '_blank');
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
        {itemCount > 0 && (
          <SheetTrigger asChild>
            <button
              aria-label={`${t.cart.title} (${itemCount})`}
              className="fixed bottom-44 md:bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-card text-foreground shadow-lg hover:bg-muted transition-all border border-border"
            >
              <FileText className="w-5 h-5 text-primary" />
              <span className="hidden sm:inline text-sm font-medium">{t.cart.title}</span>
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            </button>
          </SheetTrigger>
        )}
        <SheetContent className="w-full sm:max-w-md bg-background/95 backdrop-blur-xl border-border">
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{t.cart.sentTitle}</h2>
            <p className="text-muted-foreground mb-8 whitespace-pre-line">
              {t.cart.sentDesc}
            </p>
            <p className="text-sm text-muted-foreground/70 mb-8">
              {t.cart.agentNotice}
            </p>
            <Button onClick={handleClose} className="w-full">
              {t.cart.close}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {itemCount > 0 && (
        <SheetTrigger asChild>
          <button
            aria-label={`${t.cart.title} (${itemCount})`}
            className="fixed bottom-44 md:bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-card text-foreground shadow-lg hover:bg-muted transition-all border border-border"
          >
            <FileText className="w-5 h-5 text-primary" />
            <span className="hidden sm:inline text-sm font-medium">{t.cart.title}</span>
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          </button>
        </SheetTrigger>
      )}
      <SheetContent className="w-full sm:max-w-md bg-background/95 backdrop-blur-xl border-border flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {t.cart.title}
          </SheetTitle>
        </SheetHeader>

        {!showCheckout ? (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              {items.length === 0 && freeItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t.cart.emptyTitle}</p>
                  <p className="text-sm mt-2">{t.cart.emptySubtitle}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50">
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{item.name}</p>
                        <p className="text-primary font-bold">
                          <span className="text-xs font-medium text-muted-foreground">
                            {t.services.startingFrom}
                          </span>
                          {formatCurrency(item.price)}
                          {item.isMonthly && (
                            <span className="text-xs font-normal text-muted-foreground">
                              {t.services.perMonth}
                            </span>
                          )}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove item"
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
                          {isEn ? "FREE" : "GRATIS"}
                          <span className="text-xs font-normal text-muted-foreground ml-2 line-through">
                            {formatCurrency(item.price)}{item.isMonthly && t.services.perMonth}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Briefing form CTA */}
              {hasRelevantServices && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-4 mt-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm mb-1">
                        {isEn ? "Personalized Project Brief" : "Presupuesto más personalizado"}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {isEn
                          ? "Complete our short 2-minute questionnaire so we can fine-tune your proposal."
                          : "Completa un breve formulario y afinamos el presupuesto según tus necesidades."}
                      </p>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => setShowBriefingModal(true)}
                        className="w-full"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {isEn ? "Fill Out Questionnaire" : "Responder formulario"}
                      </Button>
                    </div>
                  </div>
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
                      placeholder={t.cart.promoPlaceholder}
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
                    {isPromoApplied ? <Check className="w-4 h-4" /> : t.cart.applyCode}
                  </Button>
                </div>
                {promoError && <p className="text-destructive text-sm mb-2">{promoError}</p>}
                {isPromoApplied && (
                  <p className="text-primary text-sm mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {isEn ? "NOVA20 promo code applied! -20% discount" : "¡Código NOVA20 aplicado! -20% de descuento"}
                  </p>
                )}
                {isPromoApplied && freeItems.length === 0 && (
                  <p className="text-muted-foreground text-xs mb-2">
                    {isEn ? "* NOVA20 code cannot be combined with free add-on services" : "* Con el código NOVA20 no se aplican servicios gratuitos adicionales"}
                  </p>
                )}

                {/* Totals */}
                <div className="space-y-2 mb-4">
                  {isPromoApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.cart.discount} (20%)</span>
                      <span className="text-primary">-{formatCurrency(getDiscount())}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-foreground">{t.cart.total}</span>
                    <span className="text-primary">
                      {t.services.startingFrom} {formatCurrency(getTotal())}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isEn
                      ? "Estimated starting cost. We audit your project scope and provide a firm, final proposal with zero obligation."
                      : "Precio mínimo orientativo. Analizamos tu proyecto y te enviamos el presupuesto final, sin compromiso."}
                  </p>
                </div>

                <Button 
                  onClick={() => setShowCheckout(true)} 
                  className="w-full"
                  size="lg"
                >
                  {t.cart.proceedQuote}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center px-4">
            <h3 className="text-xl font-bold text-foreground text-center mb-2">
              {isEn ? "Send Your Project Quote" : "Enviar presupuesto"}
            </h3>
            <p className="text-muted-foreground text-center mb-8 text-sm">
              {t.cart.agentNotice}
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleSendWhatsApp}
                className="w-full h-14 text-base"
                variant="default"
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                {t.cart.sendWhatsapp}
              </Button>
              
              <Button 
                onClick={handleSendEmail}
                className="w-full h-14 text-base"
                variant="outline"
              >
                <Mail className="w-5 h-5 mr-3" />
                {t.cart.sendEmail}
              </Button>
            </div>
            
            <Button 
              onClick={() => setShowCheckout(false)}
              variant="ghost"
              className="mt-6"
            >
              {isEn ? "Back to Estimate" : "Volver al presupuesto"}
            </Button>
          </div>
        )}
      </SheetContent>

      <BriefingFormModal
        open={showBriefingModal}
        onOpenChange={setShowBriefingModal}
        preselectedServices={detectedServices}
        fromCart
      />
    </Sheet>
  );
};

export default ShoppingCart;
