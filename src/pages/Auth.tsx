import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, Building, Phone, Globe, AtSign, Smartphone, ChevronDown, ChevronUp, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { L, isEn } from '@/i18n';

const emailSchema = z.string().email({
  message: L("Email inválido", "Invalid email address")
}).max(255);
const passwordSchema = z.string().min(6, {
  message: L("La contraseña debe tener al menos 6 caracteres", "Password must be at least 6 characters")
}).max(100);
const nameSchema = z.string().max(100, {
  message: L("El nombre es demasiado largo", "Name is too long")
}).optional();

const Auth = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const refCode = searchParams.get('ref');
  
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
  const [referralCode, setReferralCode] = useState(refCode || '');
  
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
    if (refCode && !isLogin) {
      setShowOptionalFields(true);
    }
  }, [refCode, isLogin]);

  useEffect(() => {
    if (!loading && user) {
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
      referred_by_code: referralCode || null,
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) throw error;

    // If referral code was used, create a referral record
    if (referralCode) {
      try {
        const { data: referrerProfile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('referral_code', referralCode)
          .maybeSingle();

        if (referrerProfile) {
          await supabase.from('referrals').insert({
            referral_code: referralCode,
            referrer_id: referrerProfile.user_id,
            referred_user_id: userId,
            referred_email: userEmail,
            status: 'pending',
          });
        }
      } catch (e) {
        console.error('Error creating referral:', e);
      }
    }
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
              title: L("Error de acceso", "Login Error"),
              description: L("Email o contraseña incorrectos", "Incorrect email or password"),
              variant: "destructive"
            });
          } else {
            toast({
              title: L("Error", "Error"),
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: L("¡Bienvenido!", "Welcome!"),
            description: L("Has iniciado sesión correctamente", "Signed in successfully")
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
              title: L("Usuario existente", "Account Exists"),
              description: L("Este email ya está registrado. Inicia sesión.", "This email is already registered. Please log in."),
              variant: "destructive"
            });
          } else {
            toast({
              title: L("Error", "Error"),
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
            title: L("¡Cuenta creada!", "Account Created!"),
            description: L("Tu cuenta ha sido creada correctamente", "Your account has been created successfully")
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
          {L('Volver al inicio', 'Back to Home')}
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img alt="NOVA Marketing Solutions" className="h-12 w-auto mx-auto mb-4" src="/images/logo-nova.png" />
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? L('Iniciar sesión', 'Log In') : L('Crear cuenta', 'Create Account')}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {isLogin 
                ? L('Accede para ver tus proyectos y servicios', 'Log in to view your projects and deliverables') 
                : L('Regístrate para hacer seguimiento de tus proyectos', 'Sign up to track your projects and requests')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
            {!isLogin && <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {L('Nombre completo (opcional)', 'Full Name (optional)')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder={L("Tu nombre", "Your name")} />
                </div>
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
              </div>}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder="you@company.com" required />
              </div>
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {L('Contraseña', 'Password')}
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
                  <span>{L('Datos de tu negocio (opcional)', 'Business Details (optional)')}</span>
                  {showOptionalFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                {showOptionalFields && (
                  <div className="space-y-4 pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground">
                      {L('Rellena estos datos ahora para no tener que hacerlo en cada formulario. Puedes editarlos en tu perfil.', 'Provide these details now to autofill project forms. You can edit them anytime.')}
                    </p>
                    
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder={isEn ? "+1 (555) 000-0000" : "+34 600 000 000"} />
                    </div>
                    
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder={L("Nombre del negocio", "Business Name")} />
                    </div>
                    
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="text" value={sector} onChange={e => setSector(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder={L("Sector (ej: Hostelería, Moda...)", "Industry (e.g. Retail, Health, Tech...)")} />
                    </div>
                    
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="url" value={website} onChange={e => setWebsite(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder={L("Web actual (si tienes)", "Current website (if any)")} />
                    </div>
                    
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="text" value={socialMedia} onChange={e => setSocialMedia(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder={L("Redes sociales actuales", "Social media handles")} />
                    </div>
                    
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="text" value={hasApp} onChange={e => setHasApp(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder={L("App actual (si tienes)", "Current app (if any)")} />
                    </div>

                    <div className="relative">
                      <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input type="text" value={referralCode} onChange={e => setReferralCode(e.target.value.toUpperCase())} className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" placeholder={L("Código de referido (opcional)", "Referral code (optional)")} />
                    </div>
                    {referralCode && (
                      <p className="text-xs text-primary">
                        🎁 {L('Código de referido aplicado:', 'Referral code applied:')} {referralCode}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {isSubmitting ? L('Cargando...', 'Loading...') : isLogin ? L('Iniciar sesión', 'Log In') : L('Crear cuenta', 'Create Account')}
            </button>

            <div className="text-center space-y-2">
              {isLogin && (
                <Link to="/forgot-password" className="block text-muted-foreground hover:text-primary text-sm transition-colors">
                  {L('¿Olvidaste tu contraseña?', 'Forgot your password?')}
                </Link>
              )}
              <button type="button" onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
              setShowOptionalFields(false);
            }} className="text-primary hover:underline text-sm">
                {isLogin 
                  ? L('¿No tienes cuenta? Regístrate', "Don't have an account? Sign up") 
                  : L('¿Ya tienes cuenta? Inicia sesión', 'Already have an account? Log in')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>;
};

export default Auth;
