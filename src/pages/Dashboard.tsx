import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, ArrowLeft, CreditCard, FolderOpen, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';

interface Payment {
  id: string;
  service_type: string;
  amount: number;
  discount_applied: number;
  promo_code: string | null;
  payment_method: string;
  status: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  service_type: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
}

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (profileData) {
        setProfile(profileData);
      }

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (paymentsData) {
        setPayments(paymentsData);
      }

      // Fetch projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (projectsData) {
        setProjects(projectsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente"
    });
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    
    const statusLabels: Record<string, string> = {
      pending: 'Pendiente',
      completed: 'Completado',
      in_progress: 'En progreso',
      cancelled: 'Cancelado'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${statusClasses[status] || statusClasses.pending}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <img src={logo} alt="Solutions Nova" className="h-8 w-auto" />
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Panel de usuario</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Hola, {profile?.full_name || profile?.email?.split('@')[0] || 'Usuario'}
          </h1>
          <p className="text-muted-foreground">
            Aquí puedes ver el estado de tus proyectos y pagos.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                <p className="text-sm text-muted-foreground">Proyectos</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{payments.length}</p>
                <p className="text-sm text-muted-foreground">Pagos</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground truncate max-w-[150px]">
                  {profile?.email}
                </p>
                <p className="text-sm text-muted-foreground">Tu cuenta</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Mis proyectos
          </h2>
          
          {projects.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-muted-foreground mb-4">Aún no tienes proyectos activos.</p>
              <Link
                to="/#servicios"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Ver servicios disponibles
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <div key={project.id} className="glass-card p-6">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                      <p className="text-muted-foreground text-sm">{project.service_type}</p>
                      {project.notes && (
                        <p className="text-foreground/70 text-sm mt-2">{project.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {getStatusBadge(project.status)}
                      <p className="text-xs text-muted-foreground mt-2">
                        Actualizado: {formatDate(project.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Payments section */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Historial de pagos
          </h2>
          
          {payments.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-muted-foreground mb-4">Aún no has realizado ningún pago.</p>
              <Link
                to="/#pagos"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Ir a la sección de pagos
              </Link>
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Servicio</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Cantidad</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Método</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-border/20 last:border-0">
                        <td className="p-4 text-foreground">{payment.service_type}</td>
                        <td className="p-4">
                          <span className="text-foreground font-medium">{payment.amount}€</span>
                          {payment.discount_applied > 0 && (
                            <span className="text-xs text-primary ml-2">
                              -{payment.discount_applied}% ({payment.promo_code})
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-muted-foreground capitalize">{payment.payment_method}</td>
                        <td className="p-4">{getStatusBadge(payment.status)}</td>
                        <td className="p-4 text-muted-foreground">{formatDate(payment.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
