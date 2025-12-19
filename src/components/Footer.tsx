import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="relative py-12 px-6 border-t border-border/30">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <img 
            src={logo} 
            alt="NOVA Marketing Solutions" 
            className="w-32 opacity-70"
          />

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
