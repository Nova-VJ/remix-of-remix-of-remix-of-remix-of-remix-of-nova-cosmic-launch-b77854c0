import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Shield, Bell, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { scrollToSectionId } from '@/lib/scroll';
import metodoNovaIcon from '@/assets/metodo-nova-icon.webp';

const ADMIN_EMAIL = 'info@solutionsnova.es';

type NavItem =
  | { label: string; section: string }
  | { label: string; to: string; novaIcon?: boolean };

const NAV_ITEMS: NavItem[] = [
  { label: 'Servicios', section: 'servicios' },
  { label: 'Precios', section: 'paquetes' },
  { label: 'Proceso', section: 'proceso' },
  { label: 'Casos de éxito', to: '/casos-exito' },
  { label: 'Método NOVA', to: '/metodo-nova', novaIcon: true },
  { label: 'Contacto', section: 'contacto' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    // Read the scroll position on the next frame so it doesn't force a layout during the first render
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Highlight the menu entry of the section currently on screen (home page only)
  const [activeSection, setActiveSection] = useState<string | null>(null);
  useEffect(() => {
    if (!isHome) {
      setActiveSection(null);
      return;
    }
    const ids = NAV_ITEMS.flatMap((item) => ('section' in item ? [item.section] : []));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      // A thin band just below the menu decides which section is "current"
      { rootMargin: '-30% 0px -65% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  // Fetch unread admin notifications count
  useEffect(() => {
    if (!isAdmin) {
      setUnreadCount(0);
      return;
    }

    let cancelled = false;
    let removeChannel: (() => void) | undefined;

    // Supabase is loaded on demand (only the admin needs it here)
    import('@/integrations/supabase/client').then(({ supabase }) => {
      if (cancelled) return;

      const fetchUnread = async () => {
        const { count } = await supabase
          .from('admin_notifications')
          .select('*', { count: 'exact', head: true })
          .eq('read', false);
        if (!cancelled) setUnreadCount(count || 0);
      };

      fetchUnread();

      // Realtime subscription
      const channel = supabase
        .channel('admin-notif-badge')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'admin_notifications' },
          () => fetchUnread()
        )
        .subscribe();

      removeChannel = () => supabase.removeChannel(channel);
    });

    return () => {
      cancelled = true;
      removeChannel?.();
    };
  }, [isAdmin]);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    scrollToSectionId(id);
  };

  const openBriefing = () => {
    setIsOpen(false);
    navigate('/?openBriefing=true');
  };

  const NotificationBadge = () => {
    if (!isAdmin || unreadCount === 0) return null;
    return (
      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    );
  };

  const linkClass = "text-sm font-medium text-foreground/70 hover:text-foreground transition-colors";

  const renderItem = (item: NavItem, mobile = false) => {
    const className = cn(linkClass, mobile && "block w-full py-2.5 text-left text-base");
    if ('to' in item) {
      return (
        <Link
          key={item.label}
          to={item.to}
          onClick={() => setIsOpen(false)}
          className={cn(className, item.novaIcon && "group inline-flex items-center gap-1.5")}
        >
          {item.novaIcon && (
            <img
              src={metodoNovaIcon}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 -my-2 object-contain motion-safe:animate-nova-float transition-transform duration-500 group-hover:rotate-[24deg] group-hover:scale-110"
            />
          )}
          {item.label}
        </Link>
      );
    }
    const active = activeSection === item.section;
    return (
      <button
        key={item.label}
        type="button"
        onClick={() => scrollToSection(item.section)}
        aria-current={active ? 'true' : undefined}
        className={cn(
          className,
          active && 'text-foreground',
          !mobile && 'relative after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300',
          !mobile && active && 'after:scale-x-100'
        )}
      >
        {item.label}
      </button>
    );
  };

  // Keyboard users can jump past the menu straight to the page's main heading
  const skipToContent = (event: React.MouseEvent) => {
    event.preventDefault();
    const target = document.getElementById('contenido') ?? document.querySelector<HTMLElement>('h1');
    if (!target) return;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start' });
  };

  return (
    <>
    <a
      href="#contenido"
      onClick={skipToContent}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-foreground"
    >
      Saltar al contenido
    </a>
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || isOpen
          ? "bg-background/90 backdrop-blur-xl border-b border-border lg:bg-transparent lg:backdrop-blur-none lg:border-transparent"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* On desktop the bar turns into a floating pill once the page scrolls */}
        <div
          className={cn(
            "flex items-center justify-between h-16 transition-all duration-300 lg:border lg:border-transparent",
            scrolled && !isOpen &&
              "lg:mt-3 lg:h-14 lg:-mx-3 lg:rounded-2xl lg:border-border/70 lg:bg-background/80 lg:px-3 lg:shadow-[0_8px_30px_-12px_hsl(224_40%_12%/0.18)] lg:backdrop-blur-xl"
          )}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" aria-label="NOVA Marketing Solutions, inicio">
            <img alt="NOVA Marketing Solutions" width={86} height={40} className="h-10 w-auto" src="/images/logo-nova-light.webp" />
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_ITEMS.map((item) => renderItem(item))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {isAdmin && (
              <Link to="/admin" className="relative flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                <Shield className="w-4 h-4" />
                Admin
                <NotificationBadge />
              </Link>
            )}

            {user ? (
              <Link to="/dashboard" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                <User className="w-4 h-4" />
                Mi cuenta
              </Link>
            ) : (
              <Link to="/auth" className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                Acceder
              </Link>
            )}

            <button
              type="button"
              onClick={openBriefing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-[hsl(var(--nova-purple-dark))]"
            >
              Pide presupuesto
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="relative p-2 text-foreground/80 hover:text-primary transition-colors"
                aria-label="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                <NotificationBadge />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-border pb-5 pt-2">
            <div className="flex flex-col">
              {NAV_ITEMS.map((item) => renderItem(item, true))}

              {isAdmin && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2.5 text-base font-medium text-primary">
                  <Shield className="w-4 h-4" />
                  Admin
                  {unreadCount > 0 && (
                    <span className="flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  to={user ? '/dashboard' : '/auth'}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground"
                >
                  <User className="w-4 h-4" />
                  {user ? 'Mi cuenta' : 'Acceder'}
                </Link>
                <button
                  type="button"
                  onClick={openBriefing}
                  className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Pide presupuesto
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};

export default Navbar;
