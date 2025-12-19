import logo from '@/assets/logo.png';
const Footer = () => {
  return <footer className="relative py-12 px-6 border-t border-border/30">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          {/* Logo */}
          <img alt="NOVA Marketing Solutions" src="/lovable-uploads/e3229bd0-0856-4bcb-8a85-66feaafa1f92.png" className="w-32 opacity-95 rounded-full shadow-none" />

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} NOVA Marketing Solutions · Valladolid, España
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;