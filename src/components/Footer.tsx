import { Link } from 'react-router-dom';
import { Mail, MessageCircle, MapPin } from 'lucide-react';

const goToSection = (id: string) => {
  if (window.location.pathname !== '/') {
    window.location.href = `/#${id}`;
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const Footer = () => {
  const openCookieSettings = () => {
    window.dispatchEvent(new CustomEvent('openCookieSettings'));
  };

  const linkClass = "text-sm text-muted-foreground hover:text-foreground transition-colors";

  return (
    <footer className="border-t border-border bg-muted/40 px-4 sm:px-6 pt-16 pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <img alt="NOVA Marketing Solutions" loading="lazy" decoding="async" src="/images/logo-nova.png" className="h-10 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Agencia de marketing digital en Valladolid. Webs, apps, branding y redes sociales para negocios que quieren crecer.
            </p>
          </div>

          {/* Services */}
          <div>
            <p className="text-sm font-semibold text-foreground">Servicios</p>
            <ul className="mt-4 space-y-2.5">
              <li><button type="button" onClick={() => goToSection('servicios')} className={linkClass}>Páginas web</button></li>
              <li><button type="button" onClick={() => goToSection('servicios')} className={linkClass}>Aplicaciones móviles</button></li>
              <li><button type="button" onClick={() => goToSection('servicios')} className={linkClass}>Branding</button></li>
              <li><button type="button" onClick={() => goToSection('servicios')} className={linkClass}>Redes sociales</button></li>
              <li><button type="button" onClick={() => goToSection('paquetes')} className={linkClass}>Precios y paquetes</button></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-sm font-semibold text-foreground">NOVA</p>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/metodo-nova" className={linkClass}>Método NOVA</Link></li>
              <li><Link to="/casos-exito" className={linkClass}>Casos de éxito</Link></li>
              <li><Link to="/invita-a-un-amigo" className={linkClass}>Invita a un amigo</Link></li>
              <li><Link to="/instalar-app" className={linkClass}>Instalar la app</Link></li>
              <li><Link to="/auth" className={linkClass}>Área de clientes</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold text-foreground">Contacto</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="mailto:info@solutionsnova.es" className={`${linkClass} inline-flex items-center gap-2`}>
                  <Mail className="h-4 w-4" />
                  info@solutionsnova.es
                </a>
              </li>
              <li>
                <a href="https://wa.me/34659343822" target="_blank" rel="noopener noreferrer" className={`${linkClass} inline-flex items-center gap-2`}>
                  <MessageCircle className="h-4 w-4" />
                  +34 659 34 38 22
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Valladolid, España
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NOVA Marketing Solutions</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/aviso-legal" className="hover:text-foreground transition-colors">Aviso legal</Link>
            <Link to="/politica-de-privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
            <Link to="/politica-de-cookies" className="hover:text-foreground transition-colors">Cookies</Link>
            <button type="button" onClick={openCookieSettings} className="hover:text-foreground transition-colors">Configurar cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
