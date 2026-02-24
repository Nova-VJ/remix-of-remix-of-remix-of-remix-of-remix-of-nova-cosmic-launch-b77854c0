import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Trophy, Gift, Shield, Download, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import metodoNovaIcon from '@/assets/metodo-nova-icon.png';

const ADMIN_EMAIL = 'info@solutionsnova.es';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Fetch unread admin notifications count
  useEffect(() => {
    if (!isAdmin) {
      setUnreadCount(0);
      return;
    }

    const fetchUnread = async () => {
      const { count } = await supabase
        .from('admin_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);
      setUnreadCount(count || 0);
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const scrollToSection = (id: string) => {
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const NotificationBadge = () => {
    if (!isAdmin || unreadCount === 0) return null;
    return (
      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1 animate-pulse">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img alt="SolutionsNova" className="h-8 w-auto" src="/lovable-uploads/23cbcec3-61dc-4e89-aebc-d743d8b36be1.png" />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => scrollToSection('servicios')} className="text-foreground/80 hover:text-primary transition-colors text-sm">
              Servicios
            </button>
            <button onClick={() => scrollToSection('paquetes')} className="text-foreground/80 hover:text-primary transition-colors text-sm">
              Paquetes
            </button>
            <Link to="/casos-exito" className="flex items-center gap-1.5 text-foreground/80 hover:text-primary transition-colors text-sm">
              <Trophy className="w-4 h-4" />
              Casos de éxito
            </Link>
            <Link to="/metodo-nova" className="flex items-center gap-1.5 text-foreground/80 hover:text-primary transition-colors text-sm">
              <img src={metodoNovaIcon} alt="" className="w-10 h-10 object-contain" />
              Método Nova
            </Link>
            <Link to="/invita-a-un-amigo" className="flex items-center gap-1.5 text-foreground/80 hover:text-primary transition-colors text-sm">
              <Gift className="w-4 h-4" />
              Invita a un amigo
            </Link>
            <Link to="/instalar-app" className="flex items-center gap-1.5 text-foreground/80 hover:text-primary transition-colors text-sm">
              <Download className="w-4 h-4" />
              Instalar App
            </Link>
            <button onClick={() => scrollToSection('contacto')} className="text-foreground/80 hover:text-primary transition-colors text-sm">
              Contacto
            </button>

            {isAdmin && (
              <Link to="/admin" className="relative flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                <Shield className="w-4 h-4" />
                Admin
                <NotificationBadge />
              </Link>
            )}

            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="relative p-2 text-foreground/80 hover:text-primary transition-colors"
                title="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                <NotificationBadge />
              </button>
            )}
            
            {user ? (
              <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all text-sm">
                <User className="w-4 h-4" />
                Mi cuenta
              </Link>
            ) : (
              <Link to="/auth" className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all text-sm">
                <User className="w-4 h-4" />
                Acceder
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="relative p-2 text-foreground/80 hover:text-primary transition-colors"
              >
                <Bell className="w-5 h-5" />
                <NotificationBadge />
              </button>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <button onClick={() => scrollToSection('servicios')} className="text-foreground/80 hover:text-primary transition-colors py-2 text-left">
                Servicios
              </button>
              <button onClick={() => scrollToSection('paquetes')} className="text-foreground/80 hover:text-primary transition-colors py-2 text-left">
                Paquetes
              </button>
              <Link to="/casos-exito" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors py-2">
                <Trophy className="w-4 h-4" />
                Casos de éxito
              </Link>
              <Link to="/metodo-nova" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors py-2">
                <img src={metodoNovaIcon} alt="" className="w-10 h-10 object-contain" />
                Método Nova
              </Link>
              <Link to="/invita-a-un-amigo" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors py-2">
                <Gift className="w-4 h-4" />
                Invita a un amigo
              </Link>
              <Link to="/instalar-app" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors py-2">
                <Download className="w-4 h-4" />
                Instalar App
              </Link>
              <button onClick={() => scrollToSection('contacto')} className="text-foreground/80 hover:text-primary transition-colors py-2 text-left">
                Contacto
              </button>

              {isAdmin && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="relative flex items-center gap-2 text-primary hover:text-primary/80 transition-colors py-2 font-medium">
                  <Shield className="w-4 h-4" />
                  Admin
                  {unreadCount > 0 && (
                    <span className="flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}
              
              {user ? (
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all w-fit">
                  <User className="w-4 h-4" />
                  Mi cuenta
                </Link>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all w-fit">
                  <User className="w-4 h-4" />
                  Acceder
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
