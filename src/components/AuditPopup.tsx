import { useState, useEffect } from 'react';
import { X, Rocket, CheckCircle2, Zap, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { WHATSAPP_URL, CONTACT_EMAIL } from '@/config/env';
import { useTranslation } from '@/i18n';

const POPUP_CLOSED_KEY = 'audit_popup_closed';
const POPUP_CTA_KEY = 'audit_popup_cta_clicked';

const AuditPopup = () => {
  const { t } = useTranslation();
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
      `${WHATSAPP_URL}?text=${encodeURIComponent(t.auditPopup.whatsappMessage)}`,
      '_blank'
    );
  };

  const handleEmail = () => {
    localStorage.setItem(POPUP_CTA_KEY, Date.now().toString());
    setIsOpen(false);
    window.open(
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.auditPopup.emailSubject)}&body=${encodeURIComponent(t.auditPopup.emailBody)}`,
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
              <span className="text-xs font-semibold text-[hsl(var(--nova-purple-light))] uppercase tracking-wider">
                {t.auditPopup.badge}
              </span>
            </div>

            {/* Main heading */}
            <h2 className="text-2xl font-bold text-white leading-snug mb-2">
              {t.auditPopup.titleLine1}<br />
              <span className="bg-gradient-to-r from-[hsl(270,90%,75%)] to-[hsl(235,80%,70%)] bg-clip-text text-transparent">
                {t.auditPopup.titleGradient}
              </span>
            </h2>
            <p className="text-sm text-white/50 mb-5">{t.auditPopup.subtitle}</p>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              {t.auditPopup.benefits.map((benefit, i) => (
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
                <p className="text-xs text-white/70 mb-0.5">{t.auditPopup.exclusiveCode}</p>
                <p className="text-xl font-bold tracking-widest text-white font-mono">NOVA20</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[hsl(270,80%,60%,0.25)] hover:bg-[hsl(270,80%,60%,0.4)] border border-[hsl(270,80%,60%,0.4)] rounded-lg text-xs font-medium text-[hsl(var(--nova-purple-light))] transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                {copied ? t.auditPopup.copied : t.auditPopup.copy}
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleWhatsApp}
                className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-sm"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {t.auditPopup.whatsappBtn}
              </Button>
              <Button
                onClick={handleEmail}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10 font-semibold text-sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                {t.auditPopup.emailBtn}
              </Button>
            </div>

            {/* Footer note */}
            <p className="text-center text-xs text-white/30 mt-4">
              {t.auditPopup.footerText}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuditPopup;
