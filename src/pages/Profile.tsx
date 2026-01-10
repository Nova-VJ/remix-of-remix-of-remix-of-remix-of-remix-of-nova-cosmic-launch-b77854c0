import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Mail, Phone, Building, Globe, AtSign, Smartphone, Save, Loader2 } from 'lucide-react';
import ProjectFlow from '@/components/ProjectFlow';

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  business_name: string;
  sector: string;
  website: string;
  social_media: string;
  has_app: string;
}

interface ProjectData {
  id: string;
  name: string;
  current_stage: string;
  is_active: boolean;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: '',
    business_name: '',
    sector: '',
    website: '',
    social_media: '',
    has_app: '',
  });
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchActiveProject();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, phone, business_name, sector, website, social_media, has_app')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      // If profile doesn't exist yet, create a minimal one so updates work.
      if (!data) {
        const fullNameFromMeta = (user.user_metadata as any)?.full_name as string | undefined;
        setProfileData({
          full_name: fullNameFromMeta || '',
          email: user.email || '',
          phone: '',
          business_name: '',
          sector: '',
          website: '',
          social_media: '',
          has_app: '',
        });

        await supabase
          .from('profiles')
          .upsert(
            {
              user_id: user.id,
              email: user.email ?? null,
              full_name: fullNameFromMeta ?? null,
            },
            { onConflict: 'user_id' }
          );

        return;
      }

      setProfileData({
        full_name: data.full_name || (user.user_metadata as any)?.full_name || '',
        email: data.email || user.email || '',
        phone: data.phone || '',
        business_name: data.business_name || '',
        sector: data.sector || '',
        website: data.website || '',
        social_media: data.social_media || '',
        has_app: data.has_app || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveProject = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, current_stage, maintenance_active')
        .eq('user_id', user.id)
        .eq('status', 'in_progress')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setActiveProject({
          id: data.id,
          name: data.name,
          current_stage: data.current_stage || 'activation',
          is_active: true,
        });
      } else {
        setActiveProject(null);
      }
    } catch (error) {
      console.error('Error fetching active project:', error);
    }
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        email: user.email ?? null,
        full_name: profileData.full_name || null,
        phone: profileData.phone || null,
        business_name: profileData.business_name || null,
        sector: profileData.sector || null,
        website: profileData.website || null,
        social_media: profileData.social_media || null,
        has_app: profileData.has_app || null,
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'user_id' })
        .select('*')
        .single();

      if (error) throw error;

      console.log('Profile saved:', data);
      toast({
        title: 'Perfil actualizado',
        description: 'Tus datos se han guardado correctamente.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el perfil.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al panel
          </Link>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Mi Perfil</h1>
          <p className="text-muted-foreground">Actualiza tus datos para que se auto-rellenen en los formularios</p>
        </div>

        {/* Project Flow Section */}
        <ProjectFlow
          currentStage={activeProject?.current_stage || 'inactive'}
          isActive={!!activeProject}
          projectName={activeProject?.name}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Datos de contacto
            </CardTitle>
            <CardDescription>
              Estos datos se usarán para pre-rellenar formularios automáticamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    placeholder="Tu nombre"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={profileData.email}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
                <p className="text-xs text-muted-foreground">El email no se puede cambiar</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+34 600 000 000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_name">Nombre del negocio</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="business_name"
                    value={profileData.business_name}
                    onChange={(e) => handleChange('business_name', e.target.value)}
                    placeholder="Tu empresa o proyecto"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="sector"
                    value={profileData.sector}
                    onChange={(e) => handleChange('sector', e.target.value)}
                    placeholder="Ej: Hostelería, Tecnología..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Web actual</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="website"
                    type="url"
                    value={profileData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="https://..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="social_media">Redes sociales</Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="social_media"
                    value={profileData.social_media}
                    onChange={(e) => handleChange('social_media', e.target.value)}
                    placeholder="@tunegocio en Instagram..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="has_app">App actual</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="has_app"
                    value={profileData.has_app}
                    onChange={(e) => handleChange('has_app', e.target.value)}
                    placeholder="Nombre o link de tu app"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Actualizar datos
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;