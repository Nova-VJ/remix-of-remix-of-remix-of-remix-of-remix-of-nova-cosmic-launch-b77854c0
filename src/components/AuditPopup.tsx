import { useState, useEffect } from 'react';
import { X, Rocket, CheckCircle2, Zap, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { WHATSAPP_URL } from '@/config/env';

const POPUP_CLOSED_KEY = 'audit_popup_closed';
const POPUP_CTA_KEY = 'audit_popup_cta_clicked';

const AuditPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctaClickedAt = localStorage.getItem(POPUP_CTA_KEY);
    const closedAt = localStorage.getItem(POPUP_CLOSED_KEY);
    const now = Date.now();

    if (ctaClickedAt && now - parseInt(ctaClickedAt) < 30 * 24 * 60 * 60 * 1000) return;
    if (closedAt && now - parseInt(closedAt) < 7 * 24 * 60 * 60 * 1000) return;

    const timer = setTimeout(() => setIsOpen(true), 120000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    localStorage.setItem(POPUP_CLOSED_KEY, Date.now().toString());
    setIsOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('NOVA20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    localStorage.setItem(POPUP_CTA_KEY, Date.now().toString());
  };

  const handleWhatsApp = () => {
    localStorage.setItem(POPUP_CTA_KEY, Date.now().toString());
    setIsOpen(false);
    window.open(
      `${WHATSAPP_URL}?text=${encodeURIComponent('Hola Nova, me interesa la auditoría gratuita. Mi código es NOVA20.')}`,
      '_blank'
    );
  };

  const handleEmail = () => {
    localStorage.setItem(POPUP_CTA_KEY, Date.now().toString());
    setIsOpen(false);
    window.open(
      `mailto:info@solutionsnova.es?subject=${encodeURIComponent('Solicitud de auditoría gratuita – NOVA20')}&body=${encodeURIComponent('Hola Nova,\n\nMe interesa recibir la auditoría gratuita de mi web/negocio.\n\nMi código promocional es NOVA20.\n\nQuedo atento/a a su respuesta.\n\nSaludos.')}`,
      '_blank'
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 bg-transparent shadow-none [&>button]:hidden">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(265,70%,12%)] via-[hsl(270,60%,16%)] to-[hsl(235,60%,10%)]" />
          {/* Glow orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(270,80%,60%,0.15)] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[hsl(235,80%,55%,0.12)] rounded-full blur-3xl" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="relative z-10 p-7">
            {/* Header badge */}
            <div className="inline-flex items-center gap-2 bg-[hsl(270,80%,60%,0.2)] border border-[hsl(270,80%,60%,0.4)] rounded-full px-3 py-1 mb-5">
              <Rocket className="w-3.5 h-3.5 text-[hsl(var(--nova-purple-light))]" />
              <span className="text-xs font-semibold text-[hsl(var(--nova-purple-light))] uppercase tracking-wider">Oferta exclusiva</span>
            </div>

            {/* Main heading */}
            <h2 className="text-2xl font-bold text-white leading-snug mb-2">
              ¿Tu web realmente está<br />
              <span className="bg-gradient-to-r from-[hsl(270,90%,75%)] to-[hsl(235,80%,70%)] bg-clip-text text-transparent">
                generando clientes?
              </span>
            </h2>
            <p className="text-sm text-white/50 mb-5">Te lo revelamos en 24h, gratis.</p>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              {[
                'Auditoría profesional personalizada e informe.',
                'Plan de automatización de reservas, ventas, inventario y mucho más.',
                '20% de descuento en tu primer proyecto.',
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[hsl(270,80%,60%,0.2)] flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--nova-purple-light))]" />
                  </div>
                  <span className="text-sm text-white/85 leading-tight">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Promo code */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-white/40 mb-0.5">Código exclusivo</p>
                <p className="text-xl font-bold tracking-widest text-white font-mono">NOVA20</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(270,80%,60%,0.25)] hover:bg-[hsl(270,80%,60%,0.4)] border border-[hsl(270,80%,60%,0.4)] rounded-lg text-xs font-medium text-[hsl(var(--nova-purple-light))] transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                {copied ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>

            {/* CTA Buttons - WhatsApp & Email */}
            <div className="space-y-2">
              <Button
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold py-5 rounded-xl shadow-lg transition-all gap-2"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="w-5 h-5" />
                Pedir auditoría por WhatsApp
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 font-semibold py-5 rounded-xl transition-all gap-2"
                onClick={handleEmail}
              >
                <Mail className="w-5 h-5" />
                Pedir auditoría por correo
              </Button>
            </div>
            <p className="text-center text-xs text-white/30 mt-3">Sin compromiso. Respuesta en 24h.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuditPopup;
