import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const passwordSchema = z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }).max(100);

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Enlace inválido",
          description: "El enlace ha expirado o no es válido. Solicita uno nuevo.",
          variant: "destructive"
        });
        navigate('/forgot-password');
      }
    };
    checkSession();
  }, [navigate, toast]);

  const validateForm = () => {
    const newErrors: { password?: string; confirm?: string } = {};

    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      newErrors.password = result.error.errors[0].message;
    }

    if (password !== confirmPassword) {
      newErrors.confirm = "Las contraseñas no coinciden";
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
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/auth'), 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6">
        <Link to="/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver al login
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img alt="Solutions Nova" className="h-12 w-auto mx-auto mb-4" src="/lovable-uploads/17c987fe-5397-4a68-b9b0-ad2444852c78.png" />
            <h1 className="text-2xl font-bold text-foreground">
              Nueva contraseña
            </h1>
            <p className="text-muted-foreground mt-2">
              Introduce tu nueva contraseña
            </p>
          </div>

          {success ? (
            <div className="glass-card p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">
                ¡Contraseña actualizada!
              </p>
              <p className="text-muted-foreground text-sm">
                Redirigiendo al login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nueva contraseña
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
                  Confirmar contraseña
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
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
