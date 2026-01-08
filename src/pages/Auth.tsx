import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, Building, Phone, Globe, AtSign, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import logo from '@/assets/logo.png';

const emailSchema = z.string().email({
  message: "Email inválido"
}).max(255);
const passwordSchema = z.string().min(6, {
  message: "La contraseña debe tener al menos 6 caracteres"
}).max(100);
const nameSchema = z.string().max(100, {
  message: "El nombre es demasiado largo"
}).optional();

const Auth = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  
  // Optional profile fields
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [sector, setSector] = useState('');
  const [website, setWebsite] = useState('');
  const [socialMedia, setSocialMedia] = useState('');
  const [hasApp, setHasApp] = useState('');
  
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});
  const {
    signIn,
    signUp,
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  
  useEffect(() => {
    if (!loading && user) {
      // If coming from briefing form, go back to home with briefing flag
      if (redirectTo === 'briefing') {
        navigate('/?openBriefing=true');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate, redirectTo]);

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      name?: string;
    } = {};
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    if (!isLogin && fullName) {
      const nameResult = nameSchema.safeParse(fullName);
      if (!nameResult.success) {
        newErrors.name = nameResult.error.errors[0].message;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveOptionalProfileData = async (userId: string, userEmail?: string | null) => {
    // Create/ensure profile row exists, then apply optional fields if provided
    const payload: any = {
      user_id: userId,
      email: userEmail ?? null,
      full_name: fullName || null,
      phone: phone || null,
      business_name: businessName || null,
      sector: sector || null,
      website: website || null,
      social_media: socialMedia || null,
      has_app: hasApp || null,
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) throw error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (isLogin) {
        const {
          error
        } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Error de acceso",
              description: "Email o contraseña incorrectos",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión correctamente"
          });
          navigate('/dashboard');
        }
      } else {
        const {
          error
        } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: "Usuario existente",
              description: "Este email ya está registrado. Inicia sesión.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          try {
            const { data: { user: newUser } } = await supabase.auth.getUser();
            if (newUser) {
              await saveOptionalProfileData(newUser.id, newUser.email);
            }
          } catch (e) {
            console.error('Error saving optional profile data:', e);
          }

          toast({
            title: "¡Cuenta creada!",
            description: "Tu cuenta ha sido creada correctamente"
          });
          navigate('/dashboard');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>;
  }

  return <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img alt="Solutions Nova" className="h-12 w-auto mx-auto mb-4" src="/lovable-uploads/17c987fe-5397-4a68-b9b0-ad2444852c78.png" />
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? 'Accede para ver tus proyectos y pagos' : 'Regístrate para hacer seguimiento de tus proyectos'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
            {!isLogin && <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre completo (opcional)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder="Tu nombre" />
                </div>
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
              </div>}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder="tu@email.com" required />
              </div>
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-11 pr-12 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Optional fields for signup */}
            {!isLogin && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setShowOptionalFields(!showOptionalFields)}
                  className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  <span>Datos de tu negocio (opcional)</span>
                  {showOptionalFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                {showOptionalFields && (
                  <div className="space-y-4 pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground">
                      Rellena estos datos ahora para no tener que hacerlo en cada formulario. Puedes editarlos en tu perfil.
                    </p>
                    
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder="Teléfono" />
                    </div>
                    
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder="Nombre del negocio" />
                    </div>
                    
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="text" value={sector} onChange={e => setSector(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder="Sector (ej: Hostelería, Moda...)" />
                    </div>
                    
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="url" value={website} onChange={e => setWebsite(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder="Web actual (si tienes)" />
                    </div>
                    
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="text" value={socialMedia} onChange={e => setSocialMedia(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder="Redes sociales actuales" />
                    </div>
                    
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="text" value={hasApp} onChange={e => setHasApp(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder="App actual (si tienes)" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Cargando...' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>

            <div className="text-center space-y-2">
              {isLogin && (
                <Link to="/forgot-password" className="block text-muted-foreground hover:text-primary text-sm transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              )}
              <button type="button" onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
              setShowOptionalFields(false);
            }} className="text-primary hover:underline text-sm">
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>;
};
export default Auth;