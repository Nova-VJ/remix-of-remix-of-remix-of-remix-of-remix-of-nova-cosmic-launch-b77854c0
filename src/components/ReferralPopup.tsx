import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import referralPopupImage from '@/assets/referral-popup-new.svg';

const POPUP_CLOSED_KEY = 'referral_popup_closed';
const POPUP_CTA_KEY = 'referral_popup_cta_clicked';

const ReferralPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const closedAt = localStorage.getItem(POPUP_CLOSED_KEY);
    const ctaClickedAt = localStorage.getItem(POPUP_CTA_KEY);

    const now = Date.now();

    if (ctaClickedAt) {
      const ctaDate = parseInt(ctaClickedAt);
      if (now - ctaDate < 30 * 24 * 60 * 60 * 1000) return;
    }

    if (closedAt) {
      const closeDate = parseInt(closedAt);
      if (now - closeDate < 7 * 24 * 60 * 60 * 1000) return;
    }

    // Show popup after 2 minutes (120 seconds)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 120000);

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
      <DialogContent className="sm:max-w-md p-0 bg-transparent border-none overflow-hidden [&>button]:hidden">
        {/* Clickable overlay to close */}
        <div 
          className="absolute inset-0 cursor-pointer" 
          onClick={handleClose}
        />
        
        <div className="relative">
          {/* The X button area in the image - top left corner */}
          <button
            onClick={handleClose}
            className="absolute left-2 top-2 z-20 w-10 h-10 cursor-pointer"
            aria-label="Cerrar"
          />
          
          <img 
            src={referralPopupImage} 
            alt="Gana un 10% de descuento invitando amigos" 
            className="w-full max-w-sm rounded-lg cursor-pointer relative z-10"
            onClick={handleCTAClick}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralPopup;
