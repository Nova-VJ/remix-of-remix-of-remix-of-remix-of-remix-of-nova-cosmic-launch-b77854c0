import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import referralPopupImage from '@/assets/referral-popup.svg';

const POPUP_CLOSED_KEY = 'referral_popup_closed';
const POPUP_CTA_KEY = 'referral_popup_cta_clicked';

const ReferralPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already dismissed or clicked CTA
    const closedAt = localStorage.getItem(POPUP_CLOSED_KEY);
    const ctaClickedAt = localStorage.getItem(POPUP_CTA_KEY);

    const now = Date.now();

    // If CTA clicked within 30 days, don't show
    if (ctaClickedAt) {
      const ctaDate = parseInt(ctaClickedAt);
      if (now - ctaDate < 30 * 24 * 60 * 60 * 1000) return;
    }

    // If closed within 7 days, don't show
    if (closedAt) {
      const closeDate = parseInt(closedAt);
      if (now - closeDate < 7 * 24 * 60 * 60 * 1000) return;
    }

    // Show popup after 10 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    localStorage.setItem(POPUP_CLOSED_KEY, Date.now().toString());
    setIsOpen(false);
  };

  const handleCTAClick = () => {
    localStorage.setItem(POPUP_CTA_KEY, Date.now().toString());
    setIsOpen(false);
    navigate('/invita-a-un-amigo');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex flex-col items-center">
          <img 
            src={referralPopupImage} 
            alt="Gana un 10% de descuento invitando amigos" 
            className="w-full max-w-sm rounded-t-lg"
          />
          
          <div className="w-full bg-background p-4 rounded-b-lg">
            <Button 
              onClick={handleCTAClick}
              className="w-full"
              size="lg"
            >
              Conoce más de esta promoción
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralPopup;
