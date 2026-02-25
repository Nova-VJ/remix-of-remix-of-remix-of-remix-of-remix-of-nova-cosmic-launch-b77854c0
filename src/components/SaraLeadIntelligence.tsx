import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, Search,
  Zap, AlertTriangle, Target,
  Brain, CalendarDays
} from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO } from 'date-fns';

interface SaraConversation {
  id: string;
  anon_id: string;
  anon_number: number;
  created_at: string;
  updated_at: string;
  message_count: number;
  ai_title: string | null;
  ai_service: string | null;
  ai_stage: string | null;
  ai_urgency: string | null;
  ai_quality: string | null;
  ai_score: number | null;
  ai_summary: string | null;
  ai_next_action: string | null;
  lead_status: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_city: string | null;
  classified_at: string | null;
}

interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  read: boolean;
  created_at: string;
}

const COLORS = ['hsl(270,80%,60%)', 'hsl(235,80%,55%)', 'hsl(180,60%,50%)', 'hsl(45,90%,60%)', 'hsl(0,70%,55%)', 'hsl(300,60%,55%)'];

const SCORE_COLORS = {
  high: 'text-green-400',
  medium: 'text-yellow-400',
  low: 'text-red-400',
};

const getScoreColor = (score: number | null) => {
  if (!score) return 'text-muted-foreground';
  if (score >= 70) return 'text-green-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
};

const getScoreBg = (score: number | null) => {
  if (!score) return 'bg-muted/30';
  if (score >= 70) return 'bg-green-500/10 border-green-500/30';
  if (score >= 40) return 'bg-yellow-500/10 border-yellow-500/30';
  return 'bg-red-500/10 border-red-500/30';
};

const getUrgencyBadge = (urgency: string | null) => {
  if (!urgency) return null;
  const styles: Record<string, string> = {
    'Alta': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Media': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Baja': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full border ${styles[urgency] || 'bg-muted/50'}`}>{urgency}</span>;
};

interface SaraLeadIntelligenceProps {
  conversations: SaraConversation[];
  messages: any[];
  notifications: AdminNotification[];
  onRefresh: () => void;
  formatDate: (d: string) => string;
}

const SaraLeadIntelligence = ({ conversations, messages, notifications, onRefresh, formatDate }: SaraLeadIntelligenceProps) => {
  const [selectedConv, setSelectedConv] = useState<SaraConversation | null>(null);
  const [search, setSearch] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [filterScore, setFilterScore] = useState('all');
  const [activeTab, setActiveTab] = useState<'conversations' | 'analytics' | 'notifications'>('conversations');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Auto-mark all notifications as read when viewing the notifications tab
  useEffect(() => {
    if (activeTab !== 'notifications') return;
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) return;

    const markAllRead = async () => {
      await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('read', false);
      onRefresh();
    };
    markAllRead();
  }, [activeTab, notifications, onRefresh]);

  // Quick date range presets
  const setPreset = (preset: 'today' | 'week' | 'month' | '3months') => {
    const now = new Date();
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    if (preset === 'today') {
      setDateFrom(fmt(startOfDay(now)));
      setDateTo(fmt(endOfDay(now)));
    } else if (preset === 'week') {
      setDateFrom(fmt(startOfWeek(now, { weekStartsOn: 1 })));
      setDateTo(fmt(endOfWeek(now, { weekStartsOn: 1 })));
    } else if (preset === 'month') {
      setDateFrom(fmt(startOfMonth(now)));
      setDateTo(fmt(endOfMonth(now)));
    } else if (preset === '3months') {
      setDateFrom(fmt(subMonths(now, 3)));
      setDateTo(fmt(now));
    }
  };

  const clearDates = () => { setDateFrom(''); setDateTo(''); };

  // Date-filtered conversations (for analytics)
  const dateFilteredConversations = useMemo(() => {
    if (!dateFrom && !dateTo) return conversations;
    return conversations.filter(conv => {
      try {
        const d = parseISO(conv.created_at);
        const from = dateFrom ? startOfDay(parseISO(dateFrom)) : null;
        const to = dateTo ? endOfDay(parseISO(dateTo)) : null;
        if (from && to) return isWithinInterval(d, { start: from, end: to });
        if (from) return d >= from;
        if (to) return d <= to;
        return true;
      } catch { return true; }
    });
  }, [conversations, dateFrom, dateTo]);

  const filtered = dateFilteredConversations.filter(conv => {
    const matchSearch = !search || 
      (conv.ai_title || '').toLowerCase().includes(search.toLowerCase()) ||
      (conv.contact_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (conv.ai_service || '').toLowerCase().includes(search.toLowerCase());
    const matchService = filterService === 'all' || conv.ai_service === filterService;
    const matchScore = filterScore === 'all' || 
      (filterScore === 'high' && (conv.ai_score || 0) >= 70) ||
      (filterScore === 'medium' && (conv.ai_score || 0) >= 40 && (conv.ai_score || 0) < 70) ||
      (filterScore === 'low' && (conv.ai_score || 0) < 40);
    return matchSearch && matchService && matchScore;
  });

  const sorted = [...filtered].sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0));

  // Analytics data
  const serviceData = dateFilteredConversations.reduce((acc: any[], conv) => {
    const svc = conv.ai_service || 'Sin clasificar';
    const existing = acc.find(a => a.name === svc);
    if (existing) existing.value++;
    else acc.push({ name: svc, value: 1 });
    return acc;
  }, []);

  const stageData = dateFilteredConversations.reduce((acc: any[], conv) => {
    const stage = conv.ai_stage || 'Sin clasificar';
    const existing = acc.find(a => a.name === stage);
    if (existing) existing.count++;
    else acc.push({ name: stage, count: 1 });
    return acc;
  }, []);

  // Weekly trend using dateFilteredConversations
  const now = new Date();
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString('es-ES', { weekday: 'short' });
    const count = dateFilteredConversations.filter(c => {
      const cd = new Date(c.created_at);
      return cd.toDateString() === d.toDateString();
    }).length;
    return { day: dayStr, leads: count };
  });

  const highPriority = dateFilteredConversations.filter(c => (c.ai_score || 0) >= 70).length;
  const avgScore = dateFilteredConversations.length > 0 
    ? Math.round(dateFilteredConversations.reduce((s, c) => s + (c.ai_score || 0), 0) / dateFilteredConversations.length) 
    : 0;
  const classified = dateFilteredConversations.filter(c => c.ai_title).length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const convMessages = selectedConv
    ? messages.filter(m => m.conversation_id === selectedConv.id)
    : [];

  const markAsContacted = async (convId: string) => {
    await supabase
      .from('sara_anonymous_conversations')
      .update({ lead_status: 'contacted' })
      .eq('id', convId);
    onRefresh();
  };

  return (
    <div className="space-y-4">
      {/* Date range filter */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/20 rounded-xl border border-border">
        <CalendarDays className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'Hoy', preset: 'today' as const },
            { label: 'Esta semana', preset: 'week' as const },
            { label: 'Este mes', preset: 'month' as const },
            { label: '3 meses', preset: '3months' as const },
          ].map(({ label, preset }) => (
            <Button key={preset} variant="outline" size="sm" className="h-7 text-xs px-2.5" onClick={() => setPreset(preset)}>
              {label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-7 text-xs w-36" />
          <span className="text-xs text-muted-foreground">–</span>
          <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-7 text-xs w-36" />
          {(dateFrom || dateTo) && (
            <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={clearDates}>✕</Button>
          )}
        </div>
        {(dateFrom || dateTo) && (
          <span className="text-xs text-primary ml-1">
            Mostrando {dateFilteredConversations.length} de {conversations.length} conversaciones
          </span>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-primary/15 to-primary/5 border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-[hsl(var(--nova-purple-light))]" />
              <span className="text-xs text-muted-foreground">Total Sara</span>
            </div>
            <p className="text-3xl font-bold">{conversations.length}</p>
            <p className="text-xs text-muted-foreground">{classified} clasificadas por IA</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/15 to-green-700/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-xs text-muted-foreground">Alta Prioridad</span>
            </div>
            <p className="text-3xl font-bold text-green-400">{highPriority}</p>
            <p className="text-xs text-muted-foreground">Score ≥ 70</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/15 to-yellow-700/10 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-muted-foreground">Score Promedio</span>
            </div>
            <p className="text-3xl font-bold text-yellow-400">{avgScore}</p>
            <p className="text-xs text-muted-foreground">de 100 puntos</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/15 to-red-700/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-muted-foreground">Alertas Admin</span>
            </div>
            <p className="text-3xl font-bold text-red-400">{unreadNotifs}</p>
            <p className="text-xs text-muted-foreground">sin leer</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-muted/30 p-1 rounded-lg w-fit">
        {(['conversations', 'analytics', 'notifications'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm rounded-md transition-all font-medium ${
              activeTab === tab 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'conversations' ? '💬 Conversaciones' : tab === 'analytics' ? '📊 Analítica' : '🔔 Alertas'}
            {tab === 'notifications' && unreadNotifs > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{unreadNotifs}</span>
            )}
          </button>
        ))}
      </div>

      {/* CONVERSATIONS TAB */}
      {activeTab === 'conversations' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* List panel */}
          <div className="lg:col-span-2 space-y-3">
            {/* Filters */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar..." 
                  className="pl-8 h-8 text-sm"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Select value={filterScore} onValueChange={setFilterScore}>
                <SelectTrigger className="h-8 w-28 text-xs">
                  <SelectValue placeholder="Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="high">Alta (70+)</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-[520px]">
              <div className="space-y-2 pr-2">
                {sorted.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-12">
                    <Brain className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No hay conversaciones aún</p>
                    <p className="text-xs mt-1">Las conversaciones de Sara aparecerán aquí</p>
                  </div>
                )}
                {sorted.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      selectedConv?.id === conv.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="font-medium text-sm leading-tight line-clamp-2">
                        {conv.ai_title || `Anónimo #${conv.anon_number}`}
                      </p>
                      {conv.ai_score !== null && (
                        <span className={`text-lg font-bold flex-shrink-0 ${getScoreColor(conv.ai_score)}`}>
                          {conv.ai_score}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {conv.ai_service && (
                        <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                          {conv.ai_service}
                        </span>
                      )}
                      {getUrgencyBadge(conv.ai_urgency)}
                      {conv.lead_status === 'contacted' && (
                        <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                          Contactado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-xs text-muted-foreground">{conv.message_count || 0} mensajes</p>
                      <p className="text-xs text-muted-foreground">{formatDate(conv.updated_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            {selectedConv ? (
              <div className="space-y-3">
                {/* AI Summary Card */}
                <Card className={`border ${getScoreBg(selectedConv.ai_score)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-bold text-base">
                          {selectedConv.ai_title || `Anónimo #${selectedConv.anon_number}`}
                        </h3>
                        {selectedConv.contact_name && (
                          <p className="text-sm text-muted-foreground mt-0.5">{selectedConv.contact_name}</p>
                        )}
                      </div>
                      {selectedConv.ai_score !== null && (
                        <div className={`text-center px-3 py-1 rounded-lg border ${getScoreBg(selectedConv.ai_score)}`}>
                          <p className={`text-2xl font-bold ${getScoreColor(selectedConv.ai_score)}`}>
                            {selectedConv.ai_score}
                          </p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedConv.ai_service && <Badge variant="secondary">{selectedConv.ai_service}</Badge>}
                      {selectedConv.ai_stage && <Badge variant="outline">{selectedConv.ai_stage}</Badge>}
                      {selectedConv.ai_urgency && getUrgencyBadge(selectedConv.ai_urgency)}
                      {selectedConv.ai_quality && (
                        <span className="text-xs bg-muted/50 px-2 py-0.5 rounded-full border border-border">
                          Calidad: {selectedConv.ai_quality}
                        </span>
                      )}
                    </div>

                    {/* AI Summary */}
                    {selectedConv.ai_summary && (
                      <div className="bg-muted/30 rounded-lg p-3 mb-3">
                        <p className="text-xs text-muted-foreground mb-1 font-medium flex items-center gap-1">
                          <Brain className="w-3 h-3" /> Resumen IA
                        </p>
                        <p className="text-sm">{selectedConv.ai_summary}</p>
                      </div>
                    )}

                    {/* Next action */}
                    {selectedConv.ai_next_action && (
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-2.5 mb-3">
                        <p className="text-xs text-primary font-medium flex items-center gap-1 mb-0.5">
                          <Zap className="w-3 h-3" /> Próxima acción
                        </p>
                        <p className="text-sm">{selectedConv.ai_next_action}</p>
                      </div>
                    )}

                    {/* Contact info */}
                    {(selectedConv.contact_email || selectedConv.contact_phone || selectedConv.contact_city) && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {selectedConv.contact_email && (
                          <div className="bg-muted/30 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="text-xs font-medium truncate">{selectedConv.contact_email}</p>
                          </div>
                        )}
                        {selectedConv.contact_phone && (
                          <div className="bg-muted/30 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Teléfono</p>
                            <p className="text-xs font-medium">{selectedConv.contact_phone}</p>
                          </div>
                        )}
                        {selectedConv.contact_city && (
                          <div className="bg-muted/30 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground">Ciudad</p>
                            <p className="text-xs font-medium">{selectedConv.contact_city}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs"
                        onClick={() => markAsContacted(selectedConv.id)}
                        disabled={selectedConv.lead_status === 'contacted'}
                      >
                        ✓ Marcar como contactado
                      </Button>
                      {selectedConv.contact_phone && (
                        <Button size="sm" variant="outline" className="text-xs" asChild>
                          <a href={`https://wa.me/${selectedConv.contact_phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">
                            WhatsApp
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Conversation */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Conversación completa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[240px]">
                      <div className="space-y-2 pr-2">
                        {convMessages.length === 0 && (
                          <p className="text-muted-foreground text-sm text-center py-4">Sin mensajes cargados</p>
                        )}
                        {convMessages.map((msg: any) => (
                          <div 
                            key={msg.id} 
                            className={`p-2.5 rounded-lg text-sm ${
                              msg.role === 'user' 
                                ? 'bg-primary/10 ml-6 border border-primary/20' 
                                : 'bg-muted/50 mr-6'
                            }`}
                          >
                            <p className="text-xs text-muted-foreground mb-1">
                              {msg.role === 'user' ? '👤 Usuario' : '🤖 Sara'} · {formatDate(msg.created_at)}
                            </p>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                  <p className="text-muted-foreground">Selecciona una conversación para ver el análisis IA</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service distribution */}
            <Card>
              <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" /> Leads por Servicio
                </CardTitle>
              </CardHeader>
              <CardContent>
                {serviceData.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm py-8">Sin datos aún</p>
                ) : (
                  <div className="flex items-center gap-4">
                    <ResponsiveContainer width={140} height={140}>
                      <RePieChart>
                        <Pie data={serviceData} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                          {serviceData.map((_: any, i: number) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-1.5">
                      {serviceData.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-xs">{item.name}</span>
                          </div>
                          <span className="text-xs font-bold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly trend */}
            <Card>
              <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-400" /> Tendencia Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(240 10% 70%)' }} />
                    <YAxis tick={{ fontSize: 10, fill: 'hsl(240 10% 70%)' }} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ background: 'hsl(235 45% 12%)', border: '1px solid hsl(270 30% 25%)', borderRadius: 8 }}
                      labelStyle={{ color: 'hsl(0 0% 98%)' }}
                    />
                    <Bar dataKey="leads" fill="hsl(270,80%,60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Stage funnel */}
          <Card>
            <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Etapas del Lead
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stageData.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-4">Sin datos clasificados aún</p>
              ) : (
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={stageData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(240 10% 70%)' }} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fill: 'hsl(240 10% 70%)' }} />
                    <Tooltip 
                      contentStyle={{ background: 'hsl(235 45% 12%)', border: '1px solid hsl(270 30% 25%)', borderRadius: 8 }}
                    />
                    <Bar dataKey="count" fill="hsl(270,80%,60%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Score distribution */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '🚀 Alta Prioridad', desc: 'Score 70+', count: conversations.filter(c => (c.ai_score || 0) >= 70).length, color: 'text-green-400', bg: 'border-green-500/30 bg-green-500/5' },
              { label: '⚡ Media', desc: 'Score 40-69', count: conversations.filter(c => (c.ai_score || 0) >= 40 && (c.ai_score || 0) < 70).length, color: 'text-yellow-400', bg: 'border-yellow-500/30 bg-yellow-500/5' },
              { label: '💤 Baja', desc: 'Score 0-39', count: conversations.filter(c => (c.ai_score || 0) < 40 && c.ai_score !== null).length, color: 'text-muted-foreground', bg: 'border-border bg-muted/10' },
            ].map((item, i) => (
              <Card key={i} className={`border ${item.bg}`}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium mb-1">{item.label}</p>
                  <p className={`text-4xl font-bold ${item.color}`}>{item.count}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Servicio más demandado insight */}
          {serviceData.length > 0 && (
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
              <CardContent className="p-4">
                <p className="text-xs text-primary font-medium mb-2 flex items-center gap-1">
                  <Brain className="w-3.5 h-3.5" /> Insight Inteligente
                </p>
                <p className="text-sm">
                  El servicio más demandado es{' '}
                  <strong>{[...serviceData].sort((a: any, b: any) => b.value - a.value)[0]?.name}</strong>{' '}
                  con {[...serviceData].sort((a: any, b: any) => b.value - a.value)[0]?.value} conversaciones.
                  {highPriority > 0 && ` Hay ${highPriority} lead${highPriority > 1 ? 's' : ''} de alta prioridad que requieren atención inmediata.`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div className="space-y-2">
          {notifications.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-muted-foreground">Sin alertas aún. Las notificaciones de Sara aparecerán aquí.</p>
              </CardContent>
            </Card>
          )}
          {notifications.map(notif => (
            <Card 
              key={notif.id} 
              className={`border transition-all cursor-pointer hover:opacity-80 ${
                !notif.read ? 'border-primary/40 bg-primary/5' : 'border-border'
              } ${notif.type === 'high_priority_lead' ? 'border-green-500/40 bg-green-500/5' : ''}`}
              onClick={async () => {
                if (!notif.read) {
                  await supabase.from('admin_notifications').update({ read: true }).eq('id', notif.id);
                  onRefresh();
                }
              }}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                    <span className="text-xs text-muted-foreground">{formatDate(notif.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SaraLeadIntelligence;
