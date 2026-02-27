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
import { ArrowLeft, Users, Ticket, FolderOpen, Mail, Calendar, Plus, Milestone, Wrench, Bell, Gift, FileText, Send, DollarSign, Star, Trash2, Image, MessageSquare, BarChart3, TrendingUp, UserCheck, Clock, Brain, Download } from 'lucide-react';
import SaraLeadIntelligence from '@/components/SaraLeadIntelligence';
import { usePushNotifications } from '@/hooks/usePushNotifications';

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
  current_stage: string | null;
  start_date: string | null;
  estimated_end_date: string | null;
  notes: string | null;
  maintenance_active: boolean;
  next_maintenance_date: string | null;
  hosting_status: string | null;
  domain_status: string | null;
  ssl_status: string | null;
  revisions_used: number | null;
  max_revisions: number | null;
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

interface Budget {
  id: string;
  client_email: string;
  client_name: string | null;
  client_user_id: string | null;
  services: unknown;
  total_amount: number;
  notes: string | null;
  status: string;
  created_at: string;
}

interface SuccessStory {
  id: string;
  title: string;
  description: string;
  content: string | null;
  image_url: string | null;
  featured: boolean;
  published: boolean;
  slug: string | null;
  created_at: string;
}

// Helper: send push notification to a specific user after admin actions
const sendUserPush = async (userId: string, title: string, body: string, url: string = '/dashboard') => {
  try {
    await supabase.functions.invoke('send-push-notification', {
      body: { title, body, url, type: 'user-notification', target: userId }
    });
  } catch (e) {
    console.error('Push to user failed:', e);
  }
};

const AVAILABLE_SERVICES = [
  { id: 'web-basic', name: 'Página Web Básica', basePrice: 497 },
  { id: 'web-pro', name: 'Página Web Profesional', basePrice: 997 },
  { id: 'app-basic', name: 'Aplicación Móvil Básica', basePrice: 1497 },
  { id: 'app-pro', name: 'Aplicación Móvil Profesional', basePrice: 2997 },
  { id: 'branding', name: 'Branding Completo', basePrice: 697 },
  { id: 'social', name: 'Gestión Redes Sociales', basePrice: 297 },
  { id: 'marketing', name: 'Marketing Digital', basePrice: 497 },
  { id: 'sem', name: 'SEM/Google Ads', basePrice: 397 },
  { id: 'pkg-pro', name: 'Paquete Pro', basePrice: 1997 },
  { id: 'pkg-plus', name: 'Paquete Plus', basePrice: 2997 },
  { id: 'maintenance', name: 'Mantenimiento Mensual', basePrice: 97 },
  { id: 'seo', name: 'Optimización SEO', basePrice: 397 },
  { id: 'custom', name: 'Servicio Personalizado', basePrice: 0 },
];

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSupported, isSubscribed, subscribe } = usePushNotifications();
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
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [saraConversations, setSaraConversations] = useState<any[]>([]);
  const [saraMessages, setSaraMessages] = useState<any[]>([]);
  const [registeredConversations, setRegisteredConversations] = useState<any[]>([]);
  const [registeredMessages, setRegisteredMessages] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);
  const [revisionRequests, setRevisionRequests] = useState<any[]>([]);

  // Budget creation dialog
  const [showCreateBudget, setShowCreateBudget] = useState(false);
  const [budgetServices, setBudgetServices] = useState<{ name: string; price: number }[]>([]);
  const [budgetClientType, setBudgetClientType] = useState<'email' | 'registered'>('email');
  const [budgetClientEmail, setBudgetClientEmail] = useState('');
  const [budgetClientName, setBudgetClientName] = useState('');
  const [budgetSelectedUserId, setBudgetSelectedUserId] = useState('');
  const [budgetNotes, setBudgetNotes] = useState('');
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  // Success story dialog
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    description: '',
    content: '',
    image_url: '',
    featured: false
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

  // Auto-subscribe admin to push notifications
  useEffect(() => {
    if (isAdmin && isSupported && !isSubscribed) {
      subscribe().then((ok) => {
        if (ok) {
          console.log('Admin auto-subscribed to push notifications');
        }
      });
    }
  }, [isAdmin, isSupported, isSubscribed, subscribe]);

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
    
    const [leadsRes, ticketsRes, projectsRes, emailsRes, appointmentsRes, milestonesRes, maintenanceRes, profilesRes, referralsRes, budgetsRes, storiesRes, saraConvRes, saraMsgRes, regConvRes, regMsgRes, revisionReqRes, adminNotifsRes] = await Promise.all([
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('tickets').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('email_messages').select('*').order('created_at', { ascending: false }),
      supabase.from('appointments').select('*').order('created_at', { ascending: false }),
      supabase.from('project_milestones').select('*').order('created_at', { ascending: false }),
      supabase.from('maintenance_logs').select('*').order('date', { ascending: false }),
      supabase.from('profiles').select('*'),
      supabase.from('referrals').select('*').order('created_at', { ascending: false }),
      supabase.from('budgets').select('*').order('created_at', { ascending: false }),
      supabase.from('success_stories').select('*').order('created_at', { ascending: false }),
      supabase.from('sara_anonymous_conversations').select('*').order('updated_at', { ascending: false }),
      supabase.from('sara_anonymous_messages').select('*').order('created_at', { ascending: true }),
      supabase.from('conversations').select('*').order('updated_at', { ascending: false }),
      supabase.from('chat_messages').select('*').order('created_at', { ascending: true }),
      supabase.from('revision_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('admin_notifications').select('*').order('created_at', { ascending: false }).limit(100)
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
    if (budgetsRes.data) setBudgets(budgetsRes.data as Budget[]);
    if (storiesRes.data) setSuccessStories(storiesRes.data as SuccessStory[]);
    if (saraConvRes.data) setSaraConversations(saraConvRes.data);
    if (saraMsgRes.data) setSaraMessages(saraMsgRes.data);
    if (regConvRes.data) setRegisteredConversations(regConvRes.data);
    if (regMsgRes.data) setRegisteredMessages(regMsgRes.data);
    if (revisionReqRes.data) setRevisionRequests(revisionReqRes.data);
    if (adminNotifsRes.data) setAdminNotifications(adminNotifsRes.data);

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
        sendUserPush(ticket.user_id, 'Actualización de ticket', `Tu ticket #${ticket.ticket_number} ha sido actualizado a: ${status}`, '/dashboard');
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
        sendUserPush(project.user_id, 'Actualización de proyecto', `Tu proyecto "${project.name}" ha cambiado a: ${statusLabels[status] || status}`, '/dashboard');
      }
      toast({ title: "Actualizado", description: "Estado del proyecto actualizado" });
      fetchData();
    }
  };

  const updateProjectStage = async (projectId: string, stage: string) => {
    const isDelivered = stage === 'delivered';
    const { error } = await supabase
      .from('projects')
      .update({ 
        current_stage: stage, 
        status: isDelivered ? 'delivered' : 'in_progress',
        updated_at: new Date().toISOString() 
      })
      .eq('id', projectId);

    if (error) {
      toast({ title: "Error", description: "No se pudo actualizar la fase", variant: "destructive" });
    } else {
      const project = projects.find(p => p.id === projectId);
      if (project?.user_id) {
        const stageLabels: Record<string, string> = {
          activation: 'Activación del proyecto',
          brief: 'Brief recibido',
          strategy: 'Estrategia y planificación',
          design: 'Diseño creativo',
          development: 'Programación / Implementación',
          testing: 'Integración y pruebas',
          review: 'Revisión del cliente',
          adjustments: 'Ajustes finales',
          launch: 'Lanzamiento',
          delivered: 'Proyecto entregado'
        };
        await supabase.from('notifications').insert({
          user_id: project.user_id,
          title: 'Actualización de proyecto',
          message: `Tu proyecto "${project.name}" ha avanzado a: ${stageLabels[stage] || stage}`,
          type: 'project',
          link: '/profile'
        });
        sendUserPush(project.user_id, 'Actualización de proyecto', `Tu proyecto "${project.name}" ha avanzado a: ${stageLabels[stage] || stage}`, '/profile');
      }
      toast({ title: "Actualizado", description: "Fase del proyecto actualizada" });
      fetchData();
    }
  };

  const toggleProjectSetting = async (projectId: string, field: 'hosting_status' | 'domain_status' | 'ssl_status', currentValue: string | null) => {
    const newValue = currentValue === 'active' ? 'inactive' : 'active';
    const { error } = await supabase
      .from('projects')
      .update({ [field]: newValue, updated_at: new Date().toISOString() })
      .eq('id', projectId);

    if (error) {
      toast({ title: "Error", description: "No se pudo actualizar", variant: "destructive" });
    } else {
      toast({ title: "Actualizado", description: `${field.replace('_status', '')} ahora está ${newValue === 'active' ? 'activo' : 'inactivo'}` });
      fetchData();
    }
  };

  const updateProjectRevisions = async (projectId: string, revisionsUsed: number) => {
    const { error } = await supabase
      .from('projects')
      .update({ revisions_used: revisionsUsed, updated_at: new Date().toISOString() })
      .eq('id', projectId);

    if (error) {
      toast({ title: "Error", description: "No se pudo actualizar revisiones", variant: "destructive" });
    } else {
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
        sendUserPush(project.user_id, 'Nuevo hito en tu proyecto', `Se ha añadido un nuevo hito "${newMilestone.title}" a tu proyecto "${project.name}"`, '/dashboard');
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
        sendUserPush(project.user_id, 'Mantenimiento realizado', `Se ha realizado mantenimiento ${newMaintenance.type} en tu proyecto "${project.name}"`, '/dashboard');
      }
      toast({ title: "Creado", description: "Log de mantenimiento creado" });
      setShowCreateMaintenance(false);
      setSelectedProjectForMaintenance('');
      setNewMaintenance({ type: 'routine', date: new Date().toISOString().split('T')[0], notes: '' });
      fetchData();
    }
  };

  const addServiceToBudget = () => {
    if (!newServiceName || !newServicePrice) return;
    setBudgetServices([...budgetServices, { name: newServiceName, price: parseFloat(newServicePrice) }]);
    setNewServiceName('');
    setNewServicePrice('');
  };

  const addPresetServiceToBudget = (service: typeof AVAILABLE_SERVICES[0], customPrice?: number) => {
    const price = customPrice !== undefined ? customPrice : service.basePrice;
    setBudgetServices([...budgetServices, { name: service.name, price }]);
  };

  const removeServiceFromBudget = (index: number) => {
    setBudgetServices(budgetServices.filter((_, i) => i !== index));
  };

  const getBudgetTotal = () => budgetServices.reduce((sum, s) => sum + s.price, 0);

  const createBudget = async () => {
    if (budgetServices.length === 0) {
      toast({ title: "Error", description: "Añade al menos un servicio", variant: "destructive" });
      return;
    }

    let clientEmail = '';
    let clientName = '';
    let clientUserId: string | null = null;

    if (budgetClientType === 'registered' && budgetSelectedUserId) {
      const selectedProfile = profiles.find(p => p.user_id === budgetSelectedUserId);
      if (selectedProfile) {
        clientEmail = selectedProfile.email || '';
        clientName = selectedProfile.full_name || '';
        clientUserId = selectedProfile.user_id;
      }
    } else {
      clientEmail = budgetClientEmail;
      clientName = budgetClientName;
    }

    if (!clientEmail) {
      toast({ title: "Error", description: "Indica el email del cliente", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from('budgets').insert({
      admin_id: user?.id,
      client_email: clientEmail,
      client_name: clientName || null,
      client_user_id: clientUserId,
      services: budgetServices,
      total_amount: getBudgetTotal(),
      notes: budgetNotes || null,
      status: 'pending'
    });

    if (error) {
      toast({ title: "Error", description: "No se pudo crear el presupuesto", variant: "destructive" });
    } else {
      // Create notification for user if registered
      if (clientUserId) {
        await supabase.from('notifications').insert({
          user_id: clientUserId,
          title: 'Nuevo presupuesto disponible',
          message: `Tienes un nuevo presupuesto por €${getBudgetTotal().toFixed(2)} pendiente de aprobación`,
          type: 'budget',
          link: '/dashboard'
        });
        sendUserPush(clientUserId, 'Nuevo presupuesto disponible', `Tienes un nuevo presupuesto por €${getBudgetTotal().toFixed(2)} pendiente de aprobación`, '/dashboard');
      }
      toast({ title: "Creado", description: "Presupuesto enviado correctamente" });
      setShowCreateBudget(false);
      setBudgetServices([]);
      setBudgetClientEmail('');
      setBudgetClientName('');
      setBudgetSelectedUserId('');
      setBudgetNotes('');
      fetchData();
    }
  };

  const createSuccessStory = async () => {
    if (!newStory.title || !newStory.description) {
      toast({ title: "Error", description: "Completa título y descripción", variant: "destructive" });
      return;
    }

    const slug = newStory.title.toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const { error } = await supabase.from('success_stories').insert({
      title: newStory.title,
      description: newStory.description,
      content: newStory.content || null,
      image_url: newStory.image_url || null,
      featured: newStory.featured,
      slug
    });

    if (error) {
      toast({ title: "Error", description: "No se pudo crear el caso de éxito", variant: "destructive" });
    } else {
      toast({ title: "Creado", description: "Caso de éxito publicado" });
      setShowCreateStory(false);
      setNewStory({ title: '', description: '', content: '', image_url: '', featured: false });
      fetchData();
    }
  };

  const deleteSuccessStory = async (id: string) => {
    const { error } = await supabase.from('success_stories').delete().eq('id', id);
    if (error) {
      toast({ title: "Error", description: "No se pudo eliminar", variant: "destructive" });
    } else {
      toast({ title: "Eliminado", description: "Caso de éxito eliminado" });
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

        <Tabs defaultValue="budgets">
          <TabsList className="mb-4 flex-wrap h-auto gap-1">
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
            <TabsTrigger value="sara-history" className="relative">
              🧠 Sara IA
              {adminNotifications.filter((n: any) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {adminNotifications.filter((n: any) => !n.read).length > 9 ? '9+' : adminNotifications.filter((n: any) => !n.read).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="budgets">Presupuestos</TabsTrigger>
            <TabsTrigger value="stories">Casos de éxito</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="milestones">Hitos</TabsTrigger>
            <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
            <TabsTrigger value="referrals">Referidos</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="emails">Emails</TabsTrigger>
            <TabsTrigger value="appointments">Citas</TabsTrigger>
            <TabsTrigger value="users">👥 Usuarios</TabsTrigger>
            <TabsTrigger value="revisions">📝 Revisiones</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" />Conversión Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{leads.length > 0 ? Math.round((leads.filter(l => l.status === 'converted').length / leads.length) * 100) : 0}%</p>
                  <p className="text-xs text-muted-foreground">{leads.filter(l => l.status === 'converted').length} de {leads.length} leads</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" />Presupuestos Aprobados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">€{budgets.filter(b => b.status === 'approved' || b.status === 'paid').reduce((sum, b) => sum + b.total_amount, 0).toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">{budgets.filter(b => b.status === 'approved' || b.status === 'paid').length} aprobados</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><UserCheck className="w-4 h-4 text-blue-500" />Usuarios Registrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{profiles.length}</p>
                  <p className="text-xs text-muted-foreground">Total registrados</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-purple-500" />Conversaciones Sara</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{saraConversations.length + registeredConversations.length}</p>
                  <p className="text-xs text-muted-foreground">{saraConversations.length} anónimas, {registeredConversations.length} registradas</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />Resumen de Métricas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-primary">{leads.length}</p>
                    <p className="text-sm text-muted-foreground">Total Leads</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-green-500">{projects.length}</p>
                    <p className="text-sm text-muted-foreground">Proyectos</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-blue-500">{tickets.filter(t => t.status === 'open').length}</p>
                    <p className="text-sm text-muted-foreground">Tickets Abiertos</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-3xl font-bold text-purple-500">{referrals.filter(r => r.status === 'converted').length}</p>
                    <p className="text-sm text-muted-foreground">Referidos Convertidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sara Intelligence Tab */}
          <TabsContent value="sara-history">
            <SaraLeadIntelligence
              conversations={saraConversations}
              messages={saraMessages}
              notifications={adminNotifications}
              onRefresh={fetchData}
              formatDate={formatDate}
            />
          </TabsContent>

          {/* Budgets Tab */}
          <TabsContent value="budgets">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> Presupuestos ({budgets.length})</CardTitle>
                  <CardDescription>Crea y gestiona presupuestos para clientes</CardDescription>
                </div>
                <Dialog open={showCreateBudget} onOpenChange={setShowCreateBudget}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" /> Nuevo presupuesto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Crear presupuesto</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {/* Client selection */}
                      <div>
                        <Label>Tipo de cliente</Label>
                        <Select value={budgetClientType} onValueChange={(v: 'email' | 'registered') => setBudgetClientType(v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Nuevo cliente (email)</SelectItem>
                            <SelectItem value="registered">Usuario registrado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {budgetClientType === 'email' ? (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Email del cliente</Label>
                            <Input 
                              value={budgetClientEmail} 
                              onChange={(e) => setBudgetClientEmail(e.target.value)}
                              placeholder="cliente@email.com"
                            />
                          </div>
                          <div>
                            <Label>Nombre (opcional)</Label>
                            <Input 
                              value={budgetClientName} 
                              onChange={(e) => setBudgetClientName(e.target.value)}
                              placeholder="Nombre del cliente"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Label>Seleccionar usuario</Label>
                          <Select value={budgetSelectedUserId} onValueChange={setBudgetSelectedUserId}>
                            <SelectTrigger><SelectValue placeholder="Selecciona un usuario registrado" /></SelectTrigger>
                            <SelectContent>
                              {profiles.filter(p => p.email).map(p => (
                                <SelectItem key={p.user_id} value={p.user_id}>
                                  {p.full_name || 'Sin nombre'} - {p.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Services */}
                      <div>
                        <Label>Servicios incluidos</Label>
                        <div className="flex flex-wrap gap-2 mt-2 mb-3">
                          {AVAILABLE_SERVICES.map(service => (
                            <Button 
                              key={service.id} 
                              variant="outline" 
                              size="sm"
                              onClick={() => addPresetServiceToBudget(service)}
                            >
                              {service.name} (€{service.basePrice})
                            </Button>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <Input 
                            placeholder="Servicio personalizado" 
                            value={newServiceName}
                            onChange={(e) => setNewServiceName(e.target.value)}
                            className="flex-1"
                          />
                          <Input 
                            placeholder="Precio" 
                            type="number"
                            value={newServicePrice}
                            onChange={(e) => setNewServicePrice(e.target.value)}
                            className="w-24"
                          />
                          <Button variant="secondary" onClick={addServiceToBudget}>Añadir</Button>
                        </div>
                      </div>

                      {/* Selected services */}
                      {budgetServices.length > 0 && (
                        <div className="border rounded-lg p-3 space-y-2">
                          <Label>Servicios seleccionados:</Label>
                          {budgetServices.map((service, index) => (
                            <div key={index} className="flex justify-between items-center bg-muted/50 p-2 rounded">
                              <span>{service.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">€{service.price.toFixed(2)}</span>
                                <Button variant="ghost" size="sm" onClick={() => removeServiceFromBudget(index)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-between pt-2 border-t font-bold">
                            <span>Total:</span>
                            <span>€{getBudgetTotal().toFixed(2)}</span>
                          </div>
                        </div>
                      )}

                      <div>
                        <Label>Notas</Label>
                        <Textarea 
                          value={budgetNotes}
                          onChange={(e) => setBudgetNotes(e.target.value)}
                          placeholder="Notas adicionales para el cliente..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCreateBudget(false)}>Cancelar</Button>
                      <Button onClick={createBudget} disabled={budgetServices.length === 0}>
                        <Send className="w-4 h-4 mr-2" /> Enviar presupuesto
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgets.map((budget) => {
                    const services = Array.isArray(budget.services) ? budget.services as { name: string; price: number }[] : [];
                    return (
                      <div key={budget.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{budget.client_name || budget.client_email}</p>
                            <p className="text-sm text-muted-foreground">{budget.client_email}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={budget.status === 'approved' ? 'default' : budget.status === 'paid' ? 'outline' : 'secondary'}>
                              {budget.status === 'pending' ? 'Pendiente' : budget.status === 'approved' ? 'Aprobado' : budget.status === 'paid' ? 'Pagado' : budget.status}
                            </Badge>
                            <p className="text-lg font-bold mt-1">€{budget.total_amount.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {services.map((s, i) => (
                            <span key={i}>{s.name}{i < services.length - 1 ? ', ' : ''}</span>
                          ))}
                        </div>
                        {budget.notes && <p className="text-sm bg-muted p-2 rounded">{budget.notes}</p>}
                        <p className="text-xs text-muted-foreground mt-2">{formatDate(budget.created_at)}</p>
                      </div>
                    );
                  })}
                  {budgets.length === 0 && <p className="text-muted-foreground">No hay presupuestos aún.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Success Stories Tab */}
          <TabsContent value="stories">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Star className="w-5 h-5" /> Casos de éxito ({successStories.length})</CardTitle>
                  <CardDescription>Gestiona los casos de éxito publicados</CardDescription>
                </div>
                <Dialog open={showCreateStory} onOpenChange={setShowCreateStory}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" /> Nuevo caso
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Crear caso de éxito</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Título</Label>
                        <Input 
                          value={newStory.title} 
                          onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                          placeholder="Ej: Transformación digital de Empresa X"
                        />
                      </div>
                      <div>
                        <Label>Descripción corta</Label>
                        <Textarea 
                          value={newStory.description} 
                          onChange={(e) => setNewStory({...newStory, description: e.target.value})}
                          placeholder="Resumen del caso de éxito..."
                        />
                      </div>
                      <div>
                        <Label>Contenido completo (opcional)</Label>
                        <Textarea 
                          value={newStory.content} 
                          onChange={(e) => setNewStory({...newStory, content: e.target.value})}
                          placeholder="Historia completa del caso..."
                          className="min-h-[100px]"
                        />
                      </div>
                      <div>
                        <Label>URL de imagen (opcional)</Label>
                        <Input 
                          value={newStory.image_url} 
                          onChange={(e) => setNewStory({...newStory, image_url: e.target.value})}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={newStory.featured}
                          onChange={(e) => setNewStory({...newStory, featured: e.target.checked})}
                          className="rounded border-border"
                        />
                        <Label htmlFor="featured">Destacar en portada</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowCreateStory(false)}>Cancelar</Button>
                      <Button onClick={createSuccessStory} disabled={!newStory.title || !newStory.description}>Publicar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {successStories.map((story) => (
                    <div key={story.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          {story.image_url && (
                            <img src={story.image_url} alt={story.title} className="w-16 h-16 object-cover rounded" />
                          )}
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              {story.title}
                              {story.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                            </p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{story.description}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteSuccessStory(story.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={story.published ? 'default' : 'secondary'}>
                          {story.published ? 'Publicado' : 'Borrador'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(story.created_at)}</span>
                      </div>
                    </div>
                  ))}
                  {successStories.length === 0 && <p className="text-muted-foreground">No hay casos de éxito aún.</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
                  {projects.map((project) => {
                    const STAGE_LABELS: Record<string, string> = {
                      activation: 'Activación',
                      brief: 'Brief',
                      strategy: 'Estrategia',
                      design: 'Diseño',
                      development: 'Desarrollo',
                      testing: 'Pruebas',
                      review: 'Revisión',
                      adjustments: 'Ajustes',
                      launch: 'Lanzamiento',
                      delivered: 'Entregado'
                    };
                    const STAGES = ['activation', 'brief', 'strategy', 'design', 'development', 'testing', 'review', 'adjustments', 'launch', 'delivered'];
                    const currentStageIdx = STAGES.indexOf(project.current_stage || 'activation');
                    const stageProgress = project.current_stage ? Math.round(((currentStageIdx + 1) / STAGES.length) * 100) : 0;
                    
                    return (
                    <div key={project.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
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
                      
                      {/* Stage & Flow progress */}
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Fase del flujo:</span>
                          <Select 
                            value={project.current_stage || 'activation'} 
                            onValueChange={(value) => updateProjectStage(project.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STAGES.map(s => (
                                <SelectItem key={s} value={s}>{STAGE_LABELS[s] || s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all" style={{ width: `${stageProgress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{stageProgress}%</span>
                        </div>
                      </div>
                      
                      {/* Revisiones + Hosting/Dominio/SSL */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                        <div className="bg-muted/30 p-2 rounded">
                          <p className="text-lg font-bold">{project.revisions_used ?? 0}/{project.max_revisions ?? 2}</p>
                          <p className="text-xs text-muted-foreground">Revisiones</p>
                        </div>
                        <div 
                          className={`p-2 rounded cursor-pointer ${project.hosting_status === 'active' ? 'bg-green-500/20' : 'bg-muted/30'}`}
                          onClick={() => toggleProjectSetting(project.id, 'hosting_status', project.hosting_status)}
                        >
                          <p className="text-sm font-medium">{project.hosting_status === 'active' ? 'Activo' : 'Inactivo'}</p>
                          <p className="text-xs text-muted-foreground">Hosting</p>
                        </div>
                        <div 
                          className={`p-2 rounded cursor-pointer ${project.domain_status === 'active' ? 'bg-green-500/20' : 'bg-muted/30'}`}
                          onClick={() => toggleProjectSetting(project.id, 'domain_status', project.domain_status)}
                        >
                          <p className="text-sm font-medium">{project.domain_status === 'active' ? 'Activo' : 'Inactivo'}</p>
                          <p className="text-xs text-muted-foreground">Dominio</p>
                        </div>
                        <div 
                          className={`p-2 rounded cursor-pointer ${project.ssl_status === 'active' ? 'bg-green-500/20' : 'bg-muted/30'}`}
                          onClick={() => toggleProjectSetting(project.id, 'ssl_status', project.ssl_status)}
                        >
                          <p className="text-sm font-medium">{project.ssl_status === 'active' ? 'Activo' : 'Inactivo'}</p>
                          <p className="text-xs text-muted-foreground">SSL</p>
                        </div>
                      </div>
                      
                      {/* Update revisions */}
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Revisiones usadas:</Label>
                        <Input 
                          type="number" 
                          className="w-20 h-8" 
                          value={project.revisions_used ?? 0}
                          min={0}
                          max={project.max_revisions ?? 2}
                          onChange={(e) => updateProjectRevisions(project.id, parseInt(e.target.value) || 0)}
                        />
                        <span className="text-xs text-muted-foreground">/ {project.max_revisions ?? 2}</span>
                      </div>
                      
                      {project.notes && <p className="text-sm bg-muted p-2 rounded">{project.notes}</p>}
                      
                      {/* Show milestones for this project */}
                      {milestones.filter(m => m.project_id === project.id).length > 0 && (
                        <div className="pt-3 border-t">
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
                  );})}
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

          {/* Users Directory Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Usuarios Registrados ({profiles.length})</CardTitle>
                  <CardDescription>Directorio de todas las cuentas registradas en Nova</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => {
                  const headers = ['Nombre', 'Email', 'Teléfono', 'Empresa', 'Sector', 'Web', 'Código Referido', 'Referido Por', 'Registrado'];
                  const rows = profiles.map((p: any) => [
                    p.full_name || '', p.email || '', p.phone || '', p.business_name || '',
                    p.sector || '', p.website || '', p.referral_code || '', p.referred_by_code || '',
                    p.created_at ? new Date(p.created_at).toLocaleDateString('es-ES') : ''
                  ]);
                  const csv = [headers.join(','), ...rows.map((r: string[]) => r.map(v => `"${v}"`).join(','))].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = `usuarios-nova-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click(); URL.revokeObjectURL(url);
                  toast({ title: 'CSV descargado', description: `${profiles.length} usuarios exportados` });
                }}>
                  <Download className="w-4 h-4 mr-2" /> Exportar CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Nombre</th>
                        <th className="text-left py-2 px-3 font-medium">Email</th>
                        <th className="text-left py-2 px-3 font-medium">Teléfono</th>
                        <th className="text-left py-2 px-3 font-medium">Empresa</th>
                        <th className="text-left py-2 px-3 font-medium">Sector</th>
                        <th className="text-left py-2 px-3 font-medium">Web</th>
                        <th className="text-left py-2 px-3 font-medium">Código Ref.</th>
                        <th className="text-left py-2 px-3 font-medium">Registrado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map((p: any) => (
                        <tr key={p.id} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-3">{p.full_name || '—'}</td>
                          <td className="py-2 px-3">{p.email || '—'}</td>
                          <td className="py-2 px-3">{p.phone || '—'}</td>
                          <td className="py-2 px-3">{p.business_name || '—'}</td>
                          <td className="py-2 px-3">{p.sector || '—'}</td>
                          <td className="py-2 px-3">{p.website ? <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-primary underline">{p.website}</a> : '—'}</td>
                          <td className="py-2 px-3 font-mono text-xs">{p.referral_code || '—'}</td>
                          <td className="py-2 px-3 text-muted-foreground">{formatDate(p.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {profiles.length === 0 && <p className="text-muted-foreground mt-4">No hay usuarios registrados.</p>}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revisions Tab */}
          <TabsContent value="revisions">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes de Revisión ({revisionRequests.length})</CardTitle>
                <CardDescription>Revisiones solicitadas por los clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revisionRequests.map((rev) => {
                    const project = projects.find(p => p.id === rev.project_id);
                    const profile = profiles.find(p => p.user_id === rev.user_id);
                    return (
                      <div key={rev.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium">{project?.name || 'Proyecto no encontrado'}</p>
                            <p className="text-sm text-muted-foreground">{profile?.email || profile?.full_name || 'Usuario desconocido'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={rev.status === 'pending' ? 'default' : rev.status === 'in_progress' ? 'secondary' : 'outline'}>
                              {rev.status === 'pending' ? 'Pendiente' : rev.status === 'in_progress' ? 'En progreso' : 'Resuelto'}
                            </Badge>
                            <p className="text-xs text-muted-foreground">{formatDate(rev.created_at)}</p>
                          </div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 mb-3">
                          <p className="text-sm">{rev.description}</p>
                        </div>
                        {rev.admin_response && (
                          <div className="bg-primary/10 rounded-lg p-3 mb-3">
                            <p className="text-xs font-medium text-primary mb-1">Respuesta admin:</p>
                            <p className="text-sm">{rev.admin_response}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Select
                            value={rev.status}
                            onValueChange={async (value) => {
                              await supabase.from('revision_requests').update({ status: value, resolved_at: value === 'resolved' ? new Date().toISOString() : null }).eq('id', rev.id);
                              fetchData();
                              toast({ title: "Estado actualizado" });
                            }}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendiente</SelectItem>
                              <SelectItem value="in_progress">En progreso</SelectItem>
                              <SelectItem value="resolved">Resuelto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    );
                  })}
                  {revisionRequests.length === 0 && <p className="text-muted-foreground">No hay solicitudes de revisión.</p>}
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
