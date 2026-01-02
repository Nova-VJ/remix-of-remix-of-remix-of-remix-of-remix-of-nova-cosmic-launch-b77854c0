import { Link } from 'react-router-dom';

const Footer = () => {
  const openCookieSettings = () => {
    window.dispatchEvent(new CustomEvent('openCookieSettings'));
  };

  return (
    <footer className="relative py-12 px-6 border-t border-border/30">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <img alt="NOVA Marketing Solutions" src="/lovable-uploads/e3229bd0-0856-4bcb-8a85-66feaafa1f92.png" className="w-32 opacity-95 rounded-full shadow-none" />

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
            <a href="mailto:hola@solutionsnova.es" className="hover:text-primary transition-colors">hola@solutionsnova.es</a>
            <span className="hidden sm:block">·</span>
            <a href="https://wa.me/34659343822" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+34 659 343 822</a>
            <span className="hidden sm:block">·</span>
            <span>España</span>
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
            <Link to="/aviso-legal" className="hover:text-primary transition-colors">Aviso legal</Link>
            <span>·</span>
            <Link to="/politica-de-privacidad" className="hover:text-primary transition-colors">Política de privacidad</Link>
            <span>·</span>
            <Link to="/politica-de-cookies" className="hover:text-primary transition-colors">Cookies</Link>
            <span>·</span>
            <button onClick={openCookieSettings} className="hover:text-primary transition-colors">Configurar cookies</button>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} NOVA Marketing Solutions · Valladolid, España
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;