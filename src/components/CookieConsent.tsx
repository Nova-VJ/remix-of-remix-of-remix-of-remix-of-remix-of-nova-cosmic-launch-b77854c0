import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { loadAnalytics, loadMarketing } from '@/lib/tracking';
import { useTranslation } from '@/i18n';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

const COOKIE_CONSENT_KEY = 'cookie_consent';
const CONSENT_VERSION = '1.0';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: '',
    version: CONSENT_VERSION
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (savedConsent) {
      const parsed = JSON.parse(savedConsent);
      setPreferences(parsed);
      loadScripts(parsed);
    } else {
      setShowBanner(true);
    }

    // Listen for settings open event
    const handleOpenSettings = () => {
      setShowSettings(true);
    };
    window.addEventListener('openCookieSettings', handleOpenSettings);
    return () => window.removeEventListener('openCookieSettings', handleOpenSettings);
  }, []);

  const loadScripts = (prefs: CookiePreferences) => {
    if (prefs.analytics) {
      loadAnalytics();
    }
    if (prefs.marketing) {
      loadMarketing();
    }
  };

  const saveConsent = (prefs: CookiePreferences) => {
    const consentData = {
      ...prefs,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    setPreferences(consentData);
    loadScripts(consentData);
  };

  const handleAcceptAll = () => {
    const newPrefs = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION
    };
    saveConsent(newPrefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const newPrefs = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION
    };
    saveConsent(newPrefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSaveSettings = () => {
    saveConsent(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Main Banner */}
      {showBanner && !showSettings && (
        <div className="cookie-banner fixed bottom-0 left-0 right-0 z-[100] bg-background border-t border-border p-4 md:p-6 shadow-lg animate-in slide-in-from-bottom duration-300">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {t.cookieConsent.bannerText} 
                  <Link to="/politica-de-cookies" className="ml-1 text-primary underline underline-offset-2 hover:no-underline">
                    {t.cookieConsent.moreInfo}
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRejectAll}
                >
                  {t.cookieConsent.rejectAll}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowSettings(true)}
                >
                  {t.cookieConsent.configure}
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAcceptAll}
                >
                  {t.cookieConsent.acceptAll}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">{t.cookieConsent.settingsTitle}</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setShowSettings(false);
                  if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
                    setShowBanner(true);
                  }
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 space-y-6">
              {/* Necessary */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">{t.cookieConsent.necessaryTitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.cookieConsent.necessaryDesc}
                  </p>
                </div>
                <Switch checked disabled className="data-[state=checked]:bg-primary" />
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">{t.cookieConsent.analyticsTitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.cookieConsent.analyticsDesc}
                  </p>
                </div>
                <Switch 
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
                />
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">{t.cookieConsent.marketingTitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.cookieConsent.marketingDesc}
                  </p>
                </div>
                <Switch 
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
                />
              </div>

              <div className="text-xs text-muted-foreground">
                <Link to="/politica-de-cookies" className="text-primary hover:underline">
                  {t.cookieConsent.moreInfo}
                </Link>
              </div>
            </div>

            <div className="flex gap-2 p-4 border-t">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleRejectAll}
              >
                {t.cookieConsent.rejectAll}
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSaveSettings}
              >
                {t.cookieConsent.savePreferences}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
