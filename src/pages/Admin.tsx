import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Ticket, FolderOpen, Mail, Calendar, Shield } from 'lucide-react';

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
    
    const [leadsRes, ticketsRes, projectsRes, emailsRes, appointmentsRes] = await Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('tickets').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('email_messages').select('*').order('created_at', { ascending: false }),
      supabase.from('appointments').select('*').order('created_at', { ascending: false })
    ]);

    if (leadsRes.data) setLeads(leadsRes.data);
    if (ticketsRes.data) setTickets(ticketsRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);
    if (emailsRes.data) setEmails(emailsRes.data);
    if (appointmentsRes.data) setAppointments(appointmentsRes.data);

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
      toast({ title: "Actualizado", description: "Estado del proyecto actualizado" });
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

        <Tabs defaultValue="leads">
          <TabsList className="mb-4">
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
            <TabsTrigger value="appointments">Citas</TabsTrigger>
          </TabsList>

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

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Proyectos ({projects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-muted-foreground">{project.service_type}</p>
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
                    </div>
                  ))}
                  {projects.length === 0 && <p className="text-muted-foreground">No hay proyectos aún.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
