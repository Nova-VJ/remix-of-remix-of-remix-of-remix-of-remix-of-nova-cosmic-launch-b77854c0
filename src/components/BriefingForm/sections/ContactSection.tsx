import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormData } from '../types';
import { Link } from 'react-router-dom';
import { UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ContactSectionProps {
  data: FormData;
  onChange: (name: string, value: string) => void;
}

const ContactSection = ({ data, onChange }: ContactSectionProps) => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">Datos de contacto</h3>
        <p className="text-sm text-muted-foreground">Para poder enviarte el presupuesto</p>
      </div>

      {/* Logged in confirmation */}
      {isLoggedIn ? (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-foreground font-medium">
              Sesión iniciada
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Tus datos de contacto están pre-rellenados. Puedes modificarlos si lo necesitas.
            </p>
          </div>
        </div>
      ) : (
        /* Account prompt for non-logged users */
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-3">
          <UserPlus className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-foreground font-medium">
              ¿Sabías que puedes crear una cuenta?
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Así solo tendrás que rellenar los datos del contacto una vez.{' '}
              <Link 
                to="/auth?redirect=briefing" 
                className="text-primary hover:underline"
              >
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="contacto_nombre">Nombre *</Label>
          <Input
            id="contacto_nombre"
            name="contacto_nombre"
            value={data.contacto_nombre}
            onChange={(e) => onChange('contacto_nombre', e.target.value)}
            placeholder="Tu nombre"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contacto_email">Email *</Label>
          <Input
            id="contacto_email"
            name="contacto_email"
            type="email"
            value={data.contacto_email}
            onChange={(e) => onChange('contacto_email', e.target.value)}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contacto_telefono">Teléfono</Label>
          <Input
            id="contacto_telefono"
            name="contacto_telefono"
            type="tel"
            value={data.contacto_telefono}
            onChange={(e) => onChange('contacto_telefono', e.target.value)}
            placeholder="+34 600 000 000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contacto_negocio">Nombre del negocio *</Label>
          <Input
            id="contacto_negocio"
            name="contacto_negocio"
            value={data.contacto_negocio}
            onChange={(e) => onChange('contacto_negocio', e.target.value)}
            placeholder="Tu empresa o proyecto"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contacto_sector">Sector</Label>
          <Input
            id="contacto_sector"
            name="contacto_sector"
            value={data.contacto_sector}
            onChange={(e) => onChange('contacto_sector', e.target.value)}
            placeholder="Ej: Hostelería, Tecnología, Moda..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contacto_web">Web actual (si tienes)</Label>
          <Input
            id="contacto_web"
            name="contacto_web"
            type="url"
            value={data.contacto_web}
            onChange={(e) => onChange('contacto_web', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
