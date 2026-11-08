import { Link } from 'react-router-dom';
import { Mail, MessageCircle, MapPin } from 'lucide-react';
import { scrollToSectionId } from '@/lib/scroll';
import { useTranslation } from '@/i18n';
import { CONTACT_EMAIL, CONTACT_PHONE, WHATSAPP_NUMBER } from '@/config/env';

const goToSection = (id: string) => {
  if (window.location.pathname !== '/') {
    window.location.href = `/#${id}`;
    return;
  }
  scrollToSectionId(id);
};

const Footer = () => {
  const { t, isEn } = useTranslation();

  const openCookieSettings = () => {
    window.dispatchEvent(new CustomEvent('openCookieSettings'));
  };

  const linkClass = "text-sm text-muted-foreground hover:text-foreground transition-colors";

  return (
    <footer className="cv-auto border-t border-border bg-muted/40 px-4 sm:px-6 pt-16 pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <img alt="NOVA Marketing Solutions" loading="lazy" decoding="async" width={103} height={48} src="/images/logo-nova-light.webp" className="h-12 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.footer.brandDesc}
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="text-sm font-semibold text-foreground">{t.footer.servicesTitle}</p>
            <ul className="mt-4 space-y-2.5">
              <li><button type="button" onClick={() => goToSection('servicios')} className={linkClass}>{t.nav.services}</button></li>
              <li><button type="button" onClick={() => goToSection('servicios')} className={linkClass}>{t.hero.chips.web.label}</button></li>
              <li><button type="button" onClick={() => goToSection('servicios')} className={linkClass}>{t.hero.chips.apps.label}</button></li>
              <li><button type="button" onClick={() => goToSection('servicios')} className={linkClass}>{t.hero.chips.branding.label}</button></li>
              <li><button type="button" onClick={() => goToSection('paquetes')} className={linkClass}>{t.nav.pricing}</button></li>
              <li><Link to={isEn ? "/growth-benefits" : "/beneficios-empresas"} className={linkClass}>{isEn ? "Growth Benefits & Credits" : "Beneficios y Créditos"}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold text-foreground">{t.footer.companyTitle}</p>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/metodo-nova" className={linkClass}>{t.nav.novaMethod}</Link></li>
              <li><Link to="/casos-exito" className={linkClass}>{t.nav.caseStudies}</Link></li>
              <li><Link to="/instalar-app" className={linkClass}>{isEn ? "Install the App" : "Instalar la app"}</Link></li>
              <li><Link to="/auth" className={linkClass}>{isEn ? "Client Portal" : "Área de clientes"}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold text-foreground">{t.footer.contactTitle}</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className={`${linkClass} inline-flex items-center gap-2`}>
                  <Mail className="h-4 w-4" />
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center gap-2`}>
                  <MessageCircle className="h-4 w-4" />
                  {CONTACT_PHONE}
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {t.meta.agencyLocation}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/aviso-legal" className="hover:text-foreground transition-colors">{t.footer.legalNotice}</Link>
            <Link to="/politica-de-privacidad" className="hover:text-foreground transition-colors">{t.footer.privacyPolicy}</Link>
            <Link to="/politica-de-cookies" className="hover:text-foreground transition-colors">{t.footer.cookiePolicy}</Link>
            <button type="button" onClick={openCookieSettings} className="hover:text-foreground transition-colors">{t.footer.configureCookies}</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
