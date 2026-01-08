import QuestionField from '../QuestionField';
import { FormData } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

interface ClosingSectionProps {
  data: FormData;
  onChange: (name: string, value: string | boolean) => void;
}

const ClosingSection = ({ data, onChange }: ClosingSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">¡Casi terminamos!</h3>
        <p className="text-sm text-muted-foreground">Una última pregunta</p>
      </div>

      <QuestionField
        label="¿Algo importante que debamos saber?"
        name="cierre_nota"
        options={['Nada más', 'Tengo restricciones', 'Tengo referencias', 'Necesito guía total']}
        value={data.cierre_nota}
        otroValue={data.cierre_nota_otro}
        onChange={(name, value) => onChange(name, value)}
        useTextarea
      />

      <div className="pt-4 border-t border-border">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="privacidad"
            checked={data.privacidad}
            onCheckedChange={(checked) => onChange('privacidad', !!checked)}
            required
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="privacidad"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Acepto la política de privacidad *
            </Label>
            <p className="text-xs text-muted-foreground">
              He leído y acepto la{' '}
              <Link to="/politica-de-privacidad" className="text-primary hover:underline" target="_blank">
                política de privacidad
              </Link>{' '}
              y el tratamiento de mis datos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClosingSection;
