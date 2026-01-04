import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft, Users, Ticket, FolderOpen, Mail, Calendar, Plus, Milestone, Wrench, Bell, Gift, FileText, Send } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service_type: string;
  business_type: string | null;
  goal: string | null;
  budget_range: string | null;
  urgency: string;
  message: string | null;
  status: string;
  created_at: string;
}

interface TicketType {
  id: string;
  ticket_number: number;
  user_id: string | null;
  name: string | null;
  email: string | null;
  category: string;
  priority: string;
  subject: string;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

interface Project {
  id: string;
  user_id: string | null;
  name: string;
  service_type: string;
  status: string;
  start_date: string | null;
  estimated_end_date: string | null;
  notes: string | null;
  maintenance_active: boolean;
  next_maintenance_date: string | null;
  created_at: string;
}

interface MilestoneType {
  id: string;
  project_id: string;
  title: string;
  milestone_type: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
}

interface MaintenanceLog {
  id: string;
  project_id: string;
  type: string;
  date: string;
  notes: string | null;
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [emails, setEmails] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<MilestoneType[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);

  // Budget creation dialog
  const [showCreateBudget, setShowCreateBudget] = useState(false);
  const [budgetData, setBudgetData] = useState({
    clientEmail: '',
    clientName: '',
    selectedServices: [] as { id: string; name: string; price: number }[],
    customPrice: '',
    notes: ''
  });

  // Create project dialog
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    service_type: 'web',
    user_email: '',
    notes: '',
    start_date: '',
    estimated_end_date: ''
  });

  // Create milestone dialog
  const [showCreateMilestone, setShowCreateMilestone] = useState(false);
  const [selectedProjectForMilestone, setSelectedProjectForMilestone] = useState('');
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    milestone_type: 'design',
    status: 'pending',
    start_date: '',
    end_date: '',
    notes: ''
  });

  // Create maintenance log dialog
  const [showCreateMaintenance, setShowCreateMaintenance] = useState(false);
  const [selectedProjectForMaintenance, setSelectedProjectForMaintenance] = useState('');
  const [newMaintenance, setNewMaintenance] = useState({
    type: 'routine',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();

    if (!profile?.is_admin) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos de administrador.",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }

    setIsAdmin(true);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    
    const [leadsRes, ticketsRes, projectsRes, emailsRes, appointmentsRes, milestonesRes, maintenanceRes, profilesRes, referralsRes] = await Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('tickets').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('email_messages').select('*').order('created_at', { ascending: false }),
      supabase.from('appointments').select('*').order('created_at', { ascending: false }),
      supabase.from('project_milestones').select('*').order('created_at', { ascending: false }),
      supabase.from('maintenance_logs').select('*').order('date', { ascending: false }),
      supabase.from('profiles').select('*'),
      supabase.from('referrals').select('*').order('created_at', { ascending: false })
    ]);

    if (leadsRes.data) setLeads(leadsRes.data);
    if (ticketsRes.data) setTickets(ticketsRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);
    if (emailsRes.data) setEmails(emailsRes.data);
    if (appointmentsRes.data) setAppointments(appointmentsRes.data);
    if (milestonesRes.data) setMilestones(milestonesRes.data as MilestoneType[]);
    if (maintenanceRes.data) setMaintenanceLogs(maintenanceRes.data as MaintenanceLog[]);
    if (profilesRes.data) setProfiles(profilesRes.data);
    if (referralsRes.data) setReferrals(referralsRes.data);

    setLoading(false);
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    const { error } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', ticketId);

    if (error) {
      toast({ title: "Error", description: "No se pudo actualizar el ticket", variant: "destructive" });
    } else {
      // Create notification for user
      const ticket = tickets.find(t => t.id === ticketId);
      if (ticket?.user_id) {
        await supabase.from('notifications').insert({
          user_id: ticket.user_id,
          title: 'Actualización de ticket',
          message: `Tu ticket #${ticket.ticket_number} ha sido actualizado a: ${status}`,
          type: 'ticket',
          link: '/dashboard'
        });
      }
      toast({ title: "Actualizado", description: "Estado del ticket actualizado" });
      fetchData();
    }
  };

  const updateProjectStatus = async (projectId: string, status: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', projectId);

    if (error) {
      toast({ title: "Error", description: "No se pudo actualizar el proyecto", variant: "destructive" });
    } else {
      // Create notification for user
      const project = projects.find(p => p.id === projectId);
      if (project?.user_id) {
        const statusLabels: Record<string, string> = {
          review: 'Proyecto en revisión',
          quote_done: 'Presupuesto finalizado',
          in_progress: 'Inicio del proyecto',
          revision: 'Fase de revisión',
          delivered: 'Entregado'
        };
        await supabase.from('notifications').insert({
          user_id: project.user_id,
          title: 'Actualización de proyecto',
          message: `Tu proyecto "${project.name}" ha cambiado a: ${statusLabels[status] || status}`,
          type: 'project',
          link: '/dashboard'
        });
      }
      toast({ title: "Actualizado", description: "Estado del proyecto actualizado" });
      fetchData();
    }
  };

  const createProject = async () => {
    // Find user by email
    const profile = profiles.find(p => p.email === newProject.user_email);
    
    const { error } = await supabase.from('projects').insert({
      name: newProject.name,
      service_type: newProject.service_type,
      user_id: profile?.user_id || null,
      notes: newProject.notes || null,
      start_date: newProject.start_date || null,
      estimated_end_date: newProject.estimated_end_date || null,
      status: 'review'
    });

    if (error) {
      toast({ title: "Error", description: "No se pudo crear el proyecto", variant: "destructive" });
    } else {
      toast({ title: "Creado", description: "Proyecto creado correctamente" });
      setShowCreateProject(false);
      setNewProject({ name: '', service_type: 'web', user_email: '', notes: '', start_date: '', estimated_end_date: '' });
      fetchData();
    }
  };

  const createMilestone = async () => {
    if (!selectedProjectForMilestone) return;

    const { error } = await supabase.from('project_milestones').insert({
      project_id: selectedProjectForMilestone,
      title: newMilestone.title,
      milestone_type: newMilestone.milestone_type,
      status: newMilestone.status,
      start_date: newMilestone.start_date || null,
      end_date: newMilestone.end_date || null,
      notes: newMilestone.notes || null
    });

    if (error) {
      toast({ title: "Error", description: "No se pudo crear el hito", variant: "destructive" });
    } else {
      // Notify user
      const project = projects.find(p => p.id === selectedProjectForMilestone);
      if (project?.user_id) {
        await supabase.from('notifications').insert({
          user_id: project.user_id,
          title: 'Nuevo hito en tu proyecto',
          message: `Se ha añadido un nuevo hito "${newMilestone.title}" a tu proyecto "${project.name}"`,
          type: 'milestone',
          link: '/dashboard'
        });
      }
      toast({ title: "Creado", description: "Hito creado correctamente" });
      setShowCreateMilestone(false);
      setSelectedProjectForMilestone('');
      setNewMilestone({ title: '', milestone_type: 'design', status: 'pending', start_date: '', end_date: '', notes: '' });
      fetchData();
    }
  };

  const createMaintenanceLog = async () => {
    if (!selectedProjectForMaintenance) return;

    const { error } = await supabase.from('maintenance_logs').insert({
      project_id: selectedProjectForMaintenance,
      type: newMaintenance.type,
      date: newMaintenance.date,
      notes: newMaintenance.notes || null
    });

    if (error) {
      toast({ title: "Error", description: "No se pudo crear el log", variant: "destructive" });
    } else {
      // Notify user
      const project = projects.find(p => p.id === selectedProjectForMaintenance);
      if (project?.user_id) {
        await supabase.from('notifications').insert({
          user_id: project.user_id,
          title: 'Mantenimiento realizado',
          message: `Se ha realizado mantenimiento ${newMaintenance.type} en tu proyecto "${project.name}"`,
          type: 'maintenance',
          link: '/dashboard'
        });
      }
      toast({ title: "Creado", description: "Log de mantenimiento creado" });
      setShowCreateMaintenance(false);
      setSelectedProjectForMaintenance('');
      setNewMaintenance({ type: 'routine', date: new Date().toISOString().split('T')[0], notes: '' });
      fetchData();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      new: 'default',
      open: 'default',
      pending: 'secondary',
      in_progress: 'default',
      resolved: 'outline',
      closed: 'outline',
      completed: 'outline'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <p className="text-muted-foreground">Nova Marketing Solutions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" /> Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{leads.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Ticket className="w-4 h-4" /> Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'open').length}</p>
              <p className="text-xs text-muted-foreground">abiertos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FolderOpen className="w-4 h-4" /> Proyectos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{projects.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" /> Emails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{emails.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Citas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{appointments.length}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects">
          <TabsList className="mb-4 flex-wrap h-auto gap-1">
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="milestones">Hitos</TabsTrigger>
            <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
            <TabsTrigger value="referrals">Referidos</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
            <TabsTrigger value="appointments">Citas</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Proyectos ({projects.length})</CardTitle>
                  <CardDescription>Gestiona los proyectos de clientes</CardDescription>
                </div>
                <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" /> Nuevo proyecto
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear nuevo proyecto</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Nombre del proyecto</Label>
                        <Input 
                          value={newProject.name} 
                          onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                          placeholder="Ej: Web para Restaurante Sol"
                        />
                      </div>
                      <div>
                        <Label>Tipo de servicio</Label>
                        <Select value={newProject.service_type} onValueChange={(v) => setNewProject({...newProject, service_type: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="web">Página Web</SelectItem>
                            <SelectItem value="app">Aplicación Móvil</SelectItem>
                            <SelectItem value="branding">Branding</SelectItem>
                            <SelectItem value="social">Redes Sociales</SelectItem>
                            <SelectItem value="marketing">Marketing Digital</SelectItem>
                            <SelectItem value="sem">SEM</SelectItem>
                            <SelectItem value="pkg-pro">Paquete Pro</SelectItem>
                            <SelectItem value="pkg-plus">Paquete Plus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Email del cliente (opcional)</Label>
                        <Input 
                          value={newProject.user_email} 
                          onChange={(e) => setNewProject({...newProject, user_email: e.target.value})}
                          placeholder="cliente@email.com"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Fecha inicio</Label>
                          <Input 
                            type="date"
                            value={newProject.start_date} 
                            onChange={(e) => setNewProject({...newProject, start_date: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Fecha estimada fin</Label>
                          <Input 
                            type="date"
                            value={newProject.estimated_end_date} 
                            onChange={(e) => setNewProject({...newProject, estimated_end_date: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Notas</Label>
                        <Textarea 
                          value={newProject.notes} 
                          onChange={(e) => setNewProject({...newProject, notes: e.target.value})}
                          placeholder="Notas adicionales..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCreateProject(false)}>Cancelar</Button>
                      <Button onClick={createProject} disabled={!newProject.name}>Crear proyecto</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-muted-foreground">{project.service_type}</p>
                          {project.start_date && (
                            <p className="text-xs text-muted-foreground">
                              Inicio: {new Date(project.start_date).toLocaleDateString('es-ES')}
                              {project.estimated_end_date && ` → Fin: ${new Date(project.estimated_end_date).toLocaleDateString('es-ES')}`}
                            </p>
                          )}
                        </div>
                        <Select 
                          value={project.status} 
                          onValueChange={(value) => updateProjectStatus(project.id, value)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="review">Proyecto en revisión</SelectItem>
                            <SelectItem value="quote_done">Presupuesto finalizado</SelectItem>
                            <SelectItem value="in_progress">Inicio del Proyecto</SelectItem>
                            <SelectItem value="revision">Fase de revisión</SelectItem>
                            <SelectItem value="delivered">Entrega</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {project.notes && <p className="text-sm bg-muted p-2 rounded mt-2">{project.notes}</p>}
                      
                      {/* Show milestones for this project */}
                      {milestones.filter(m => m.project_id === project.id).length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Hitos:</p>
                          <div className="flex flex-wrap gap-2">
                            {milestones.filter(m => m.project_id === project.id).map(m => (
                              <Badge key={m.id} variant={m.status === 'completed' ? 'default' : 'secondary'}>
                                {m.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {projects.length === 0 && <p className="text-muted-foreground">No hay proyectos aún.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Milestone className="w-5 h-5" /> Hitos</CardTitle>
                  <CardDescription>Gestiona los hitos de cada proyecto</CardDescription>
                </div>
                <Dialog open={showCreateMilestone} onOpenChange={setShowCreateMilestone}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" /> Nuevo hito
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear nuevo hito</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Proyecto</Label>
                        <Select value={selectedProjectForMilestone} onValueChange={setSelectedProjectForMilestone}>
                          <SelectTrigger><SelectValue placeholder="Selecciona proyecto" /></SelectTrigger>
                          <SelectContent>
                            {projects.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Título</Label>
                        <Input 
                          value={newMilestone.title} 
                          onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                          placeholder="Ej: Diseño aprobado"
                        />
                      </div>
                      <div>
                        <Label>Tipo</Label>
                        <Select value={newMilestone.milestone_type} onValueChange={(v) => setNewMilestone({...newMilestone, milestone_type: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="design">Diseño</SelectItem>
                            <SelectItem value="development">Desarrollo</SelectItem>
                            <SelectItem value="testing">Testing</SelectItem>
                            <SelectItem value="review">Revisión</SelectItem>
                            <SelectItem value="deployment">Despliegue</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Estado</Label>
                        <Select value={newMilestone.status} onValueChange={(v) => setNewMilestone({...newMilestone, status: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="in_progress">En progreso</SelectItem>
                            <SelectItem value="completed">Completado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Fecha inicio</Label>
                          <Input 
                            type="date"
                            value={newMilestone.start_date} 
                            onChange={(e) => setNewMilestone({...newMilestone, start_date: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Fecha fin</Label>
                          <Input 
                            type="date"
                            value={newMilestone.end_date} 
                            onChange={(e) => setNewMilestone({...newMilestone, end_date: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Notas</Label>
                        <Textarea 
                          value={newMilestone.notes} 
                          onChange={(e) => setNewMilestone({...newMilestone, notes: e.target.value})}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCreateMilestone(false)}>Cancelar</Button>
                      <Button onClick={createMilestone} disabled={!selectedProjectForMilestone || !newMilestone.title}>Crear hito</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {milestones.map((milestone) => {
                    const project = projects.find(p => p.id === milestone.project_id);
                    return (
                      <div key={milestone.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{milestone.title}</p>
                            <p className="text-sm text-muted-foreground">{project?.name || 'Proyecto no encontrado'}</p>
                          </div>
                          {getStatusBadge(milestone.status || 'pending')}
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Tipo: {milestone.milestone_type}</span>
                          {milestone.start_date && <span>Inicio: {new Date(milestone.start_date).toLocaleDateString('es-ES')}</span>}
                          {milestone.end_date && <span>Fin: {new Date(milestone.end_date).toLocaleDateString('es-ES')}</span>}
                        </div>
                      </div>
                    );
                  })}
                  {milestones.length === 0 && <p className="text-muted-foreground">No hay hitos aún.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Wrench className="w-5 h-5" /> Mantenimiento</CardTitle>
                  <CardDescription>Registra los mantenimientos realizados</CardDescription>
                </div>
                <Dialog open={showCreateMaintenance} onOpenChange={setShowCreateMaintenance}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" /> Nuevo log
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear log de mantenimiento</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Proyecto</Label>
                        <Select value={selectedProjectForMaintenance} onValueChange={setSelectedProjectForMaintenance}>
                          <SelectTrigger><SelectValue placeholder="Selecciona proyecto" /></SelectTrigger>
                          <SelectContent>
                            {projects.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Tipo</Label>
                        <Select value={newMaintenance.type} onValueChange={(v) => setNewMaintenance({...newMaintenance, type: v})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="routine">Rutinario</SelectItem>
                            <SelectItem value="security">Seguridad</SelectItem>
                            <SelectItem value="backup">Backup</SelectItem>
                            <SelectItem value="update">Actualización</SelectItem>
                            <SelectItem value="emergency">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Fecha</Label>
                        <Input 
                          type="date"
                          value={newMaintenance.date} 
                          onChange={(e) => setNewMaintenance({...newMaintenance, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Notas</Label>
                        <Textarea 
                          value={newMaintenance.notes} 
                          onChange={(e) => setNewMaintenance({...newMaintenance, notes: e.target.value})}
                          placeholder="Describe el mantenimiento realizado..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCreateMaintenance(false)}>Cancelar</Button>
                      <Button onClick={createMaintenanceLog} disabled={!selectedProjectForMaintenance}>Crear log</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {maintenanceLogs.map((log) => {
                    const project = projects.find(p => p.id === log.project_id);
                    return (
                      <div key={log.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{project?.name || 'Proyecto no encontrado'}</p>
                            <p className="text-sm text-muted-foreground capitalize">{log.type}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">{new Date(log.date).toLocaleDateString('es-ES')}</span>
                        </div>
                        {log.notes && <p className="text-sm bg-muted p-2 rounded mt-2">{log.notes}</p>}
                      </div>
                    );
                  })}
                  {maintenanceLogs.length === 0 && <p className="text-muted-foreground">No hay logs de mantenimiento.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" /> Referidos ({referrals.length})
                </CardTitle>
                <CardDescription>Usuarios que se registraron por referencia de otros</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referrals.map((referral) => {
                    const referrer = profiles.find(p => p.user_id === referral.referrer_id);
                    const referred = profiles.find(p => p.user_id === referral.referred_user_id);
                    return (
                      <div key={referral.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Código usado:</p>
                            <p className="font-mono font-bold text-primary">{referral.referral_code}</p>
                          </div>
                          <Badge variant={referral.status === 'converted' ? 'default' : 'secondary'}>
                            {referral.status === 'converted' ? 'Convertido' : 'Pendiente'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Referidor:</p>
                            <p className="font-medium">{referrer?.full_name || referrer?.email || 'Desconocido'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Referido:</p>
                            <p className="font-medium">{referred?.full_name || referral.referred_email || 'Pendiente de registro'}</p>
                          </div>
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Creado: {formatDate(referral.created_at)}</span>
                          {referral.converted_at && <span>Convertido: {formatDate(referral.converted_at)}</span>}
                          {referral.discount_earned && <span>Descuento: {referral.discount_earned}%</span>}
                        </div>
                      </div>
                    );
                  })}
                  {referrals.length === 0 && <p className="text-muted-foreground">No hay referidos aún.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Tickets ({tickets.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">#{ticket.ticket_number} - {ticket.subject}</p>
                          <p className="text-sm text-muted-foreground">{ticket.email || ticket.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select 
                            value={ticket.status} 
                            onValueChange={(value) => updateTicketStatus(ticket.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Abierto</SelectItem>
                              <SelectItem value="in_progress">En progreso</SelectItem>
                              <SelectItem value="resolved">Resuelto</SelectItem>
                              <SelectItem value="closed">Cerrado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm mb-2">
                        <span className="text-muted-foreground">Categoría: {ticket.category}</span>
                        <span className="text-muted-foreground">Prioridad: {ticket.priority}</span>
                        <span className="text-muted-foreground">{formatDate(ticket.created_at)}</span>
                      </div>
                      <p className="text-sm bg-muted p-2 rounded">{ticket.message}</p>
                    </div>
                  ))}
                  {tickets.length === 0 && <p className="text-muted-foreground">No hay tickets aún.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Leads ({leads.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div key={lead.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">{lead.email}</p>
                          {lead.phone && <p className="text-sm text-muted-foreground">{lead.phone}</p>}
                        </div>
                        <div className="text-right">
                          {getStatusBadge(lead.status)}
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(lead.created_at)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Servicio:</span> {lead.service_type}</div>
                        <div><span className="text-muted-foreground">Negocio:</span> {lead.business_type || '-'}</div>
                        <div><span className="text-muted-foreground">Presupuesto:</span> {lead.budget_range || '-'}</div>
                        <div><span className="text-muted-foreground">Urgencia:</span> {lead.urgency}</div>
                      </div>
                      {lead.message && <p className="text-sm mt-2 bg-muted p-2 rounded">{lead.message}</p>}
                    </div>
                  ))}
                  {leads.length === 0 && <p className="text-muted-foreground">No hay leads aún.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emails Tab */}
          <TabsContent value="emails">
            <Card>
              <CardHeader>
                <CardTitle>Emails ({emails.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emails.map((email) => (
                    <div key={email.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{email.subject}</p>
                          <p className="text-sm text-muted-foreground">{email.name} - {email.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{email.category}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(email.created_at)}</p>
                        </div>
                      </div>
                      <p className="text-sm bg-muted p-2 rounded">{email.message}</p>
                    </div>
                  ))}
                  {emails.length === 0 && <p className="text-muted-foreground">No hay emails aún.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Citas ({appointments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{apt.name}</p>
                          <p className="text-sm text-muted-foreground">{apt.email}</p>
                          {apt.phone && <p className="text-sm text-muted-foreground">{apt.phone}</p>}
                        </div>
                        <div className="text-right">
                          <Badge>{apt.topic}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(apt.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {appointments.length === 0 && <p className="text-muted-foreground">No hay citas aún.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
