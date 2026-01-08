import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';
import { LogOut, Folder, CreditCard, Bell, Calendar, Ticket, Gift, Download, Shield, Server, Globe, Lock, RefreshCw, CheckCircle, Clock, FileText, Copy, Send, DollarSign, Check, Settings, User } from 'lucide-react';
const ADMIN_EMAIL = 'info@solutionsnova.es';
interface Payment {
  id: string;
  service_type: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  promo_code: string | null;
  discount_applied: number | null;
}
interface Project {
  id: string;
  name: string;
  service_type: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  start_date: string | null;
  estimated_end_date: string | null;
  revisions_used: number;
  max_revisions: number;
  maintenance_active: boolean;
  next_maintenance_date: string | null;
  hosting_status: string | null;
  domain_status: string | null;
  ssl_status: string | null;
  last_backup_date: string | null;
}
interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  referral_code: string | null;
}
interface Milestone {
  id: string;
  project_id: string;
  title: string;
  milestone_type: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  completed_at: string | null;
}
interface TicketType {
  id: string;
  ticket_number: number;
  subject: string;
  category: string;
  priority: string;
  status: string;
  message: string;
  created_at: string;
}
interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}
interface Referral {
  id: string;
  referral_code: string;
  referred_email: string | null;
  status: string;
  discount_earned: number;
  free_marketing_earned: boolean;
  created_at: string;
}
interface SecurityAssessment {
  id: string;
  type: string;
  status: string;
  scope_summary: string | null;
  report_date: string | null;
  report_url: string | null;
  checklist: unknown;
}
interface AssetLink {
  id: string;
  project_id: string;
  label: string;
  url: string;
  type: string;
}
interface Budget {
  id: string;
  client_email: string;
  client_name: string | null;
  services: unknown;
  total_amount: number;
  notes: string | null;
  status: string;
  created_at: string;
}
const PROJECT_STATUSES = [{
  key: 'review',
  label: 'Proyecto en revisión'
}, {
  key: 'quote_done',
  label: 'Presupuesto finalizado'
}, {
  key: 'in_progress',
  label: 'Inicio del Proyecto'
}, {
  key: 'revision',
  label: 'Fase de revisión'
}, {
  key: 'delivered',
  label: 'Entrega'
}];
const Dashboard = () => {
  const {
    user,
    signOut,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [securityAssessments, setSecurityAssessments] = useState<SecurityAssessment[]>([]);
  const [assetLinks, setAssetLinks] = useState<AssetLink[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'consulta',
    priority: 'normal',
    message: ''
  });
  const [revisionDescription, setRevisionDescription] = useState('');
  const [selectedProjectForRevision, setSelectedProjectForRevision] = useState<string | null>(null);
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);
  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [profileRes, paymentsRes, projectsRes, milestonesRes, ticketsRes, notificationsRes, referralsRes, securityRes, assetsRes, budgetsRes] = await Promise.all([supabase.from('profiles').select('*').eq('user_id', user.id).single(), supabase.from('payments').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      }), supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      }), supabase.from('project_milestones').select('*').order('created_at', {
        ascending: true
      }), supabase.from('tickets').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      }), supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      }), supabase.from('referrals').select('*').or(`referrer_id.eq.${user.id},referred_user_id.eq.${user.id}`), supabase.from('security_assessments').select('*').eq('user_id', user.id), supabase.from('assets_links').select('*'), supabase.from('budgets').select('*').order('created_at', {
        ascending: false
      })]);
      if (profileRes.data) setProfile(profileRes.data);
      if (paymentsRes.data) setPayments(paymentsRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (milestonesRes.data) setMilestones(milestonesRes.data);
      if (ticketsRes.data) setTickets(ticketsRes.data);
      if (notificationsRes.data) setNotifications(notificationsRes.data);
      if (referralsRes.data) setReferrals(referralsRes.data);
      if (securityRes.data) setSecurityAssessments(securityRes.data);
      if (assetsRes.data) setAssetLinks(assetsRes.data);
      if (budgetsRes.data) setBudgets(budgetsRes.data as Budget[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const getStatusProgress = (status: string) => {
    const index = PROJECT_STATUSES.findIndex(s => s.key === status);
    if (index === -1) return 20;
    return (index + 1) / PROJECT_STATUSES.length * 100;
  };
  const getStatusLabel = (status: string) => {
    const found = PROJECT_STATUSES.find(s => s.key === status);
    return found ? found.label : status;
  };
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'delivered':
      case 'completed':
      case 'resolved':
        return 'default';
      case 'in_progress':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  const calculateDayProgress = (startDate: string | null, endDate: string | null) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    if (now <= start) return 0;
    if (now >= end) return 100;
    return Math.round((now - start) / (end - start) * 100);
  };
  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      toast({
        title: 'Código copiado',
        description: 'Compártelo con tus amigos.'
      });
    }
  };
  const handleCreateTicket = async () => {
    if (!user || !newTicket.subject || !newTicket.message) {
      toast({
        title: 'Error',
        description: 'Completa todos los campos.',
        variant: 'destructive'
      });
      return;
    }
    const {
      error
    } = await supabase.from('tickets').insert({
      user_id: user.id,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      message: newTicket.message,
      name: profile?.full_name,
      email: profile?.email
    });
    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el ticket.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Ticket creado',
        description: 'Te responderemos pronto.'
      });
      setNewTicket({
        subject: '',
        category: 'consulta',
        priority: 'normal',
        message: ''
      });
      fetchData();
    }
  };
  const handleRequestRevision = async () => {
    if (!user || !selectedProjectForRevision || !revisionDescription) {
      toast({
        title: 'Error',
        description: 'Selecciona un proyecto y describe los cambios.',
        variant: 'destructive'
      });
      return;
    }
    const project = projects.find(p => p.id === selectedProjectForRevision);
    if (project && project.revisions_used >= project.max_revisions) {
      toast({
        title: 'Sin revisiones',
        description: 'Has usado todas tus revisiones.',
        variant: 'destructive'
      });
      return;
    }
    const {
      error
    } = await supabase.from('revision_requests').insert({
      user_id: user.id,
      project_id: selectedProjectForRevision,
      description: revisionDescription
    });
    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo enviar la solicitud.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Solicitud enviada'
      });
      setRevisionDescription('');
      setSelectedProjectForRevision(null);
    }
  };
  const markNotificationRead = async (notificationId: string) => {
    await supabase.from('notifications').update({
      read: true
    }).eq('id', notificationId);
    setNotifications(prev => prev.map(n => n.id === notificationId ? {
      ...n,
      read: true
    } : n));
  };
  const approveBudget = async (budgetId: string) => {
    const {
      error
    } = await supabase.from('budgets').update({
      status: 'approved',
      approved_at: new Date().toISOString()
    }).eq('id', budgetId);
    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo aprobar el presupuesto.',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Presupuesto aprobado',
        description: 'Procede al pago para confirmar tu servicio.'
      });
      fetchData();
      // Navigate to payment or show payment option
    }
  };
  const pendingBudgets = budgets.filter(b => b.status === 'pending');
  const unreadCount = notifications.filter(n => !n.read).length;
  if (authLoading || loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img alt="Nova" className="h-8" src="/lovable-uploads/88c38dcf-6220-422a-8e76-722a26d10429.png" />
            <span className="font-bold text-foreground">Mi Panel</span>
          </Link>
          <div className="flex items-center gap-4">
            {user?.email === ADMIN_EMAIL && <Link to="/admin">
                <Button variant="outline" size="sm" className="gap-2 text-primary border-primary/30 hover:bg-primary/10">
                  <Settings className="w-4 h-4" />
                  Admin
                </Button>
              </Link>}
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                Mi Perfil
              </Button>
            </Link>
            <div className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>}
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Hola, {profile?.full_name || user?.email}</h1>
          <p className="text-muted-foreground">Bienvenido a tu panel de cliente</p>
        </div>

        <Tabs defaultValue={pendingBudgets.length > 0 ? "budgets" : "projects"} className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1">
            {pendingBudgets.length > 0 && <TabsTrigger value="budgets" className="gap-2">
                <DollarSign className="w-4 h-4" />Presupuestos
                <Badge variant="destructive" className="ml-1 h-5 px-1">{pendingBudgets.length}</Badge>
              </TabsTrigger>}
            <TabsTrigger value="projects" className="gap-2"><Folder className="w-4 h-4" />Proyectos</TabsTrigger>
            <TabsTrigger value="tickets" className="gap-2"><Ticket className="w-4 h-4" />Soporte</TabsTrigger>
            <TabsTrigger value="referrals" className="gap-2"><Gift className="w-4 h-4" />Referidos</TabsTrigger>
            <TabsTrigger value="security" className="gap-2"><Shield className="w-4 h-4" />Seguridad</TabsTrigger>
            <TabsTrigger value="payments" className="gap-2"><CreditCard className="w-4 h-4" />Pagos</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 relative">
              <Bell className="w-4 h-4" />Notificaciones
              {unreadCount > 0 && <Badge variant="destructive" className="ml-1 h-5 px-1">{unreadCount}</Badge>}
            </TabsTrigger>
          </TabsList>

          {/* Budgets Tab */}
          <TabsContent value="budgets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />Presupuestos pendientes
                </CardTitle>
                <CardDescription>Revisa y aprueba los presupuestos para comenzar tu proyecto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingBudgets.length === 0 ? <p className="text-muted-foreground text-center py-8">No tienes presupuestos pendientes</p> : pendingBudgets.map(budget => {
                const services = Array.isArray(budget.services) ? budget.services as {
                  name: string;
                  price: number;
                }[] : [];
                return <div key={budget.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-lg">Propuesta de servicios</p>
                          <p className="text-sm text-muted-foreground">{formatDate(budget.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">€{budget.total_amount.toFixed(2)}</p>
                          <Badge variant="secondary">Pendiente de aprobación</Badge>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <p className="font-medium text-sm mb-2">Servicios incluidos:</p>
                        {services.map((service, index) => <div key={index} className="flex justify-between text-sm">
                            <span>{service.name}</span>
                            <span className="font-medium">€{service.price.toFixed(2)}</span>
                          </div>)}
                        <div className="flex justify-between pt-2 border-t font-bold">
                          <span>Total</span>
                          <span>€{budget.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {budget.notes && <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                          <p className="font-medium mb-1">Notas:</p>
                          {budget.notes}
                        </div>}
                      
                      <div className="flex gap-3 pt-2">
                        <Button onClick={() => approveBudget(budget.id)} className="flex-1">
                          <Check className="w-4 h-4 mr-2" />Aprobar y proceder al pago
                        </Button>
                      </div>
                    </div>;
              })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            {projects.length === 0 ? <Card><CardContent className="py-12 text-center text-muted-foreground"><Folder className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No tienes proyectos activos</p></CardContent></Card> : projects.map(project => {
            const projectMilestones = milestones.filter(m => m.project_id === project.id);
            const projectAssets = assetLinks.filter(a => a.project_id === project.id);
            const dayProgress = calculateDayProgress(project.start_date, project.estimated_end_date);
            return <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div><CardTitle className="text-lg">{project.name}</CardTitle><CardDescription>{project.service_type}</CardDescription></div>
                      <Badge variant={getStatusBadgeVariant(project.status)}>{getStatusLabel(project.status)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progreso del proyecto</span>
                        <span className="font-medium">{Math.round(getStatusProgress(project.status))}%</span>
                      </div>
                      <Progress value={getStatusProgress(project.status)} className="h-2" />
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        {PROJECT_STATUSES.map((s, i) => <span key={s.key} className={project.status === s.key ? 'text-primary font-medium' : ''}>{i + 1}</span>)}
                      </div>
                    </div>

                    {project.status === 'in_progress' && project.start_date && project.estimated_end_date && <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-primary" /><span className="font-medium text-sm">Timeline</span></div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                          <span>Inicio: {formatDate(project.start_date)}</span>
                          <span>Entrega: {formatDate(project.estimated_end_date)}</span>
                        </div>
                        <Progress value={dayProgress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{dayProgress}% del tiempo</p>
                      </div>}

                    {projectMilestones.length > 0 && <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" />Hitos</h4>
                        <div className="space-y-2">
                          {projectMilestones.map(m => <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                              <div><p className="font-medium text-sm">{m.title}</p><p className="text-xs text-muted-foreground">{m.milestone_type}</p></div>
                              <Badge variant={m.status === 'completed' ? 'default' : 'outline'}>{m.status === 'completed' ? 'Completado' : 'Pendiente'}</Badge>
                            </div>)}
                        </div>
                      </div>}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg bg-muted/30 text-center">
                        <RefreshCw className="w-5 h-5 mx-auto mb-1 text-primary" />
                        <p className="text-lg font-bold">{project.revisions_used}/{project.max_revisions}</p>
                        <p className="text-xs text-muted-foreground">Revisiones</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 text-center">
                        <Server className={`w-5 h-5 mx-auto mb-1 ${project.hosting_status === 'active' ? 'text-green-500' : 'text-yellow-500'}`} />
                        <p className="text-sm font-medium">{project.hosting_status === 'active' ? 'Activo' : 'Revisar'}</p>
                        <p className="text-xs text-muted-foreground">Hosting</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 text-center">
                        <Globe className={`w-5 h-5 mx-auto mb-1 ${project.domain_status === 'active' ? 'text-green-500' : 'text-yellow-500'}`} />
                        <p className="text-sm font-medium">{project.domain_status === 'active' ? 'Activo' : 'Revisar'}</p>
                        <p className="text-xs text-muted-foreground">Dominio</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 text-center">
                        <Lock className={`w-5 h-5 mx-auto mb-1 ${project.ssl_status === 'active' ? 'text-green-500' : 'text-yellow-500'}`} />
                        <p className="text-sm font-medium">{project.ssl_status === 'active' ? 'Activo' : 'Revisar'}</p>
                        <p className="text-xs text-muted-foreground">SSL</p>
                      </div>
                    </div>

                    {project.maintenance_active && <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4 text-primary" /><span className="font-medium text-sm">Mantenimiento activo</span></div>
                        <p className="text-sm text-muted-foreground">Próximo: {formatDate(project.next_maintenance_date)}</p>
                        {project.last_backup_date && <p className="text-xs text-muted-foreground mt-1">Último backup: {formatDate(project.last_backup_date)}</p>}
                      </div>}

                    {projectAssets.length > 0 && <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2"><Download className="w-4 h-4 text-primary" />Entregables</h4>
                        <div className="flex flex-wrap gap-2">
                          {projectAssets.map(asset => <Button key={asset.id} variant="outline" size="sm" asChild>
                              <a href={asset.url} target="_blank" rel="noopener noreferrer"><FileText className="w-4 h-4 mr-2" />{asset.label}</a>
                            </Button>)}
                        </div>
                      </div>}

                    {project.revisions_used < project.max_revisions && (project.status === 'revision' || project.status === 'in_progress') && <div className="p-4 rounded-lg border border-border">
                        <h4 className="font-medium mb-3">Solicitar cambios</h4>
                        <Textarea placeholder="Describe los cambios..." value={selectedProjectForRevision === project.id ? revisionDescription : ''} onChange={e => {
                    setSelectedProjectForRevision(project.id);
                    setRevisionDescription(e.target.value);
                  }} rows={3} />
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-muted-foreground">{project.max_revisions - project.revisions_used} revisiones restantes</p>
                          <Button size="sm" onClick={handleRequestRevision} disabled={selectedProjectForRevision !== project.id || !revisionDescription}><Send className="w-4 h-4 mr-2" />Enviar</Button>
                        </div>
                      </div>}
                  </CardContent>
                </Card>;
          })}
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Crear nuevo ticket</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Asunto" value={newTicket.subject} onChange={e => setNewTicket(prev => ({
                ...prev,
                subject: e.target.value
              }))} />
                <div className="grid grid-cols-2 gap-4">
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newTicket.category} onChange={e => setNewTicket(prev => ({
                  ...prev,
                  category: e.target.value
                }))}>
                    <option value="consulta">Consulta</option>
                    <option value="bug">Bug</option>
                    <option value="cambio">Cambio</option>
                    <option value="facturacion">Facturación</option>
                  </select>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newTicket.priority} onChange={e => setNewTicket(prev => ({
                  ...prev,
                  priority: e.target.value
                }))}>
                    <option value="low">Baja</option>
                    <option value="normal">Normal</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
                <Textarea placeholder="Describe tu problema..." value={newTicket.message} onChange={e => setNewTicket(prev => ({
                ...prev,
                message: e.target.value
              }))} rows={4} />
                <Button onClick={handleCreateTicket}><Ticket className="w-4 h-4 mr-2" />Crear ticket</Button>
              </CardContent>
            </Card>
            {tickets.length > 0 && <Card>
                <CardHeader><CardTitle className="text-lg">Mis tickets</CardTitle></CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-[400px]">
                    <div className="space-y-3">
                      {tickets.map(ticket => <div key={ticket.id} className="p-4 rounded-lg border border-border">
                          <div className="flex items-start justify-between mb-2">
                            <div><p className="font-medium">#{ticket.ticket_number} - {ticket.subject}</p><p className="text-xs text-muted-foreground">{ticket.category} · {formatDate(ticket.created_at)}</p></div>
                            <Badge variant={ticket.status === 'resolved' ? 'default' : ticket.status === 'in_progress' ? 'secondary' : 'outline'}>{ticket.status === 'open' ? 'Abierto' : ticket.status === 'in_progress' ? 'En proceso' : 'Resuelto'}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{ticket.message}</p>
                        </div>)}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>}
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Gift className="w-5 h-5 text-primary" />Sistema de referidos</CardTitle>
                <CardDescription>Invita amigos y gana recompensas. Si tu referido contrata web o app, ganas:</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-2xl font-bold text-primary">10%</p>
                    <p className="text-sm text-muted-foreground">Descuento adicional</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-2xl font-bold text-primary">GRATIS</p>
                    <p className="text-sm text-muted-foreground">Estrategia de marketing</p>
                  </div>
                </div>
                {profile?.referral_code && <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Tu código:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-3 rounded bg-background font-mono text-lg">{profile.referral_code}</code>
                      <Button onClick={copyReferralCode} variant="outline"><Copy className="w-4 h-4" /></Button>
                    </div>
                  </div>}
                {referrals.length > 0 && <div>
                    <h4 className="font-medium mb-3">Tus referidos</h4>
                    <div className="space-y-2">
                      {referrals.map(ref => <div key={ref.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div><p className="font-medium">{ref.referred_email || 'Pendiente'}</p><p className="text-xs text-muted-foreground">{formatDate(ref.created_at)}</p></div>
                          <Badge variant={ref.status === 'converted' ? 'default' : 'outline'}>{ref.status === 'converted' ? 'Convertido' : 'Pendiente'}</Badge>
                        </div>)}
                    </div>
                  </div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {securityAssessments.length === 0 ? <Card><CardContent className="py-12 text-center text-muted-foreground"><Shield className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No tienes auditorías de seguridad</p></CardContent></Card> : securityAssessments.map(assessment => <Card key={assessment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div><CardTitle className="text-lg">{assessment.type === 'pentest' ? 'Pentesting' : 'Auditoría'}</CardTitle><CardDescription>{assessment.scope_summary}</CardDescription></div>
                    <Badge>{assessment.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assessment.report_date && <p className="text-sm text-muted-foreground">Fecha del informe: {formatDate(assessment.report_date)}</p>}
                  {assessment.report_url && <Button asChild variant="outline"><a href={assessment.report_url} target="_blank" rel="noopener noreferrer"><Download className="w-4 h-4 mr-2" />Descargar informe</a></Button>}
                  {assessment.checklist && Array.isArray(assessment.checklist) && (assessment.checklist as Array<{
                completed: boolean;
                label: string;
              }>).length > 0 && <div>
                      <h4 className="font-medium mb-2">Checklist</h4>
                      <div className="space-y-1">
                        {(assessment.checklist as Array<{
                    completed: boolean;
                    label: string;
                  }>).map((item, i) => <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className={`w-4 h-4 ${item.completed ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <span>{item.label}</span>
                          </div>)}
                      </div>
                    </div>}
                </CardContent>
              </Card>)}
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {payments.length === 0 ? <Card><CardContent className="py-12 text-center text-muted-foreground"><CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No tienes pagos registrados</p></CardContent></Card> : <Card>
                <CardHeader><CardTitle className="text-lg">Historial de pagos</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payments.map(payment => <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div><p className="font-medium">{payment.service_type}</p><p className="text-xs text-muted-foreground">{payment.payment_method} · {formatDate(payment.created_at)}</p></div>
                        <div className="text-right"><p className="font-bold text-primary">{payment.amount}€</p><Badge variant={payment.status === 'completed' ? 'default' : 'outline'}>{payment.status}</Badge></div>
                      </div>)}
                  </div>
                </CardContent>
              </Card>}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {notifications.length === 0 ? <Card><CardContent className="py-12 text-center text-muted-foreground"><Bell className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>No tienes notificaciones</p></CardContent></Card> : <Card>
                <CardContent className="py-4">
                  <div className="space-y-3">
                    {notifications.map(notification => <div key={notification.id} className={`p-4 rounded-lg border cursor-pointer ${notification.read ? 'border-border bg-muted/30' : 'border-primary/30 bg-primary/5'}`} onClick={() => !notification.read && markNotificationRead(notification.id)}>
                        <div className="flex items-start justify-between">
                          <div><p className="font-medium">{notification.title}</p><p className="text-sm text-muted-foreground">{notification.message}</p></div>
                          {!notification.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.created_at)}</p>
                      </div>)}
                  </div>
                </CardContent>
              </Card>}
          </TabsContent>
        </Tabs>
      </main>
    </div>;
};
export default Dashboard;