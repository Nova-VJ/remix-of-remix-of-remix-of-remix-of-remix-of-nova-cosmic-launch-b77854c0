import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { L } from '@/i18n';

const passwordSchema = z.string().min(8, { message: L("La contraseña debe tener al menos 8 caracteres", "Password must be at least 8 characters") }).max(100);

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      // Also listen for auth state change in case session is being established
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
          setIsChecking(false);
          setInvalidLink(false);
        }
      });

      // Give it a moment to process the URL hash
      setTimeout(async () => {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          setInvalidLink(true);
        }
        setIsChecking(false);
      }, 1000);

      return () => {
        subscription.unsubscribe();
      };
    };
    
    checkSession();
  }, []);

  const validateForm = () => {
    const newErrors: { password?: string; confirm?: string } = {};

    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      newErrors.password = result.error.errors[0].message;
    }

    if (password !== confirmPassword) {
      newErrors.confirm = L("Las contraseñas no coinciden", "Passwords do not match");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        toast({
          title: L("Error", "Error"),
          description: error.message,
          variant: "destructive"
        });
      } else {
        setSuccess(true);
        // Sign out and redirect to login
        await supabase.auth.signOut();
        setTimeout(() => navigate('/auth'), 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Invalid link state
  if (invalidLink) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="p-6">
          <Link to="/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {L('Volver al login', 'Back to Login')}
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <img alt="NOVA Marketing Solutions" className="h-12 w-auto mx-auto mb-4" src="/images/logo-nova.png" />
            </div>

            <div className="glass-card p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">
                {L('Enlace inválido o caducado', 'Invalid or Expired Link')}
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                {L(
                  'El enlace de recuperación ha expirado o no es válido. Por favor, solicita uno nuevo.',
                  'This password reset link has expired or is invalid. Please request a new link.'
                )}
              </p>
              <Link 
                to="/forgot-password" 
                className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                {L('Solicitar nuevo enlace', 'Request New Link')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6">
        <Link to="/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {L('Volver al login', 'Back to Login')}
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img alt="NOVA Marketing Solutions" className="h-12 w-auto mx-auto mb-4" src="/images/logo-nova.png" />
            <h1 className="text-2xl font-bold text-foreground">
              {L('Nueva contraseña', 'New Password')}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {L('Introduce tu nueva contraseña', 'Enter your new secure password')}
            </p>
          </div>

          {success ? (
            <div className="glass-card p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">
                {L('¡Contraseña actualizada!', 'Password Updated!')}
              </p>
              <p className="text-muted-foreground text-sm">
                {L('Redirigiendo al login...', 'Redirecting to login...')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {L('Nueva contraseña', 'New Password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {L('Confirmar contraseña', 'Confirm Password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-background/50 border border-border/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {errors.confirm && <p className="text-destructive text-sm mt-1">{errors.confirm}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? L('Guardando...', 'Saving...') : L('Guardar contraseña', 'Save New Password')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
