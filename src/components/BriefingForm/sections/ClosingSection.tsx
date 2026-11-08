import QuestionField from '../QuestionField';
import { FormData } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { L } from '@/i18n';

interface ClosingSectionProps {
  data: FormData;
  onChange: (name: string, value: string | boolean) => void;
}

const ClosingSection = ({ data, onChange }: ClosingSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {L('¡Casi terminamos!', 'Almost Done!')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {L('Una última pregunta', 'One final detail before submitting')}
        </p>
      </div>

      <QuestionField
        label={L('¿Algo importante que debamos saber?', 'Any special notes, requirements or context?')}
        name="cierre_nota"
        options={L(
          ['Nada más', 'Tengo restricciones', 'Tengo referencias', 'Necesito guía total'],
          ['Nothing else, all covered', 'Specific technical constraints', 'I have reference links to share', 'I need comprehensive strategic advice']
        )}
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
              {L('Acepto la política de privacidad *', 'I accept the privacy policy *')}
            </Label>
            <p className="text-xs text-muted-foreground">
              {L('He leído y acepto la ', 'I have read and agree to the ')}
              <Link to="/politica-de-privacidad" className="text-primary hover:underline" target="_blank">
                {L('política de privacidad', 'privacy policy')}
              </Link>{' '}
              {L('y el tratamiento de mis datos.', 'and the processing of my contact information.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClosingSection;
