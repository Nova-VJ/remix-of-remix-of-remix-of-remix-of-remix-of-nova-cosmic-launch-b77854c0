import QuestionField from '../QuestionField';
import { FormData } from '../types';
import { L } from '@/i18n';

interface BrandingSectionProps {
  data: FormData;
  onChange: (name: string, value: string) => void;
}

const BrandingSection = ({ data, onChange }: BrandingSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {L('🎨 Branding', '🎨 Brand Identity')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {L('Cuéntanos sobre tu identidad de marca', 'Tell us about your visual identity and positioning')}
        </p>
      </div>

      <QuestionField
        label={L('1. ¿Qué tipo de trabajo necesitas?', '1. What type of branding work do you need?')}
        name="branding_tipo"
        options={L(
          ['Logo nuevo', 'Rebranding', 'Identidad completa', 'Naming'],
          ['New logo design', 'Rebranding / Refresh', 'Full visual identity', 'Brand naming']
        )}
        value={data.branding_tipo}
        otroValue={data.branding_tipo_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('2. ¿Nivel de urgencia?', '2. What is your timeline?')}
        name="branding_urgencia"
        options={L(
          ['Inmediato', '2-4 semanas', '1-2 meses', 'Flexible'],
          ['Immediate (1–2 weeks)', '2–4 weeks', '1–2 months', 'Flexible']
        )}
        value={data.branding_urgencia}
        otroValue={data.branding_urgencia_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('3. ¿Qué estilo visual te atrae?', '3. What visual aesthetic resonates with your brand?')}
        name="branding_estilo"
        options={L(
          ['Minimalista', 'Moderno', 'Elegante', 'Divertido'],
          ['Minimalist & Clean', 'Modern & Bold', 'Luxury & Elegant', 'Playful & Vibrant']
        )}
        value={data.branding_estilo}
        otroValue={data.branding_estilo_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('4. ¿Qué personalidad quieres transmitir?', '4. What brand tone do you want to project?')}
        name="branding_personalidad"
        options={L(
          ['Premium', 'Cercana', 'Tecnológica', 'Artesanal'],
          ['Premium / High-end', 'Approachable & Warm', 'Tech-forward & Innovative', 'Artisanal & Craft']
        )}
        value={data.branding_personalidad}
        otroValue={data.branding_personalidad_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('5. ¿Cuál es tu público principal?', '5. Who is your primary audience?')}
        name="branding_publico"
        options={L(
          ['Jóvenes', 'Adultos', 'Profesional', 'Familiar'],
          ['Gen Z / Young adults', 'Adult consumers (25–50)', 'Corporate / B2B executives', 'Family / All ages']
        )}
        value={data.branding_publico}
        otroValue={data.branding_publico_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('6. ¿Cómo te diferencias de la competencia?', '6. What sets you apart from competitors?')}
        name="branding_diferenciacion"
        options={L(
          ['Precio', 'Calidad', 'Rapidez', 'Experiencia'],
          ['Price value', 'Superior quality', 'Speed & efficiency', 'Customer experience']
        )}
        value={data.branding_diferenciacion}
        otroValue={data.branding_diferenciacion_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('7. ¿Dónde usarás principalmente la marca?', '7. Where will the brand be showcased most?')}
        name="branding_uso"
        options={L(
          ['Web', 'Redes sociales', 'Impresión', 'Packaging'],
          ['Website & digital', 'Social media channels', 'Print & merchandising', 'Product packaging']
        )}
        value={data.branding_uso}
        otroValue={data.branding_uso_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('8. ¿Tienes preferencia de colores?', '8. Do you have preferred color palettes?')}
        name="branding_colores"
        options={L(
          ['Naturales', 'Neutros', 'Vibrantes', 'Sin preferencia'],
          ['Earthy / Natural tones', 'Neutral / Monochromatic', 'Vibrant & Bold', 'No preference / Open to ideas']
        )}
        value={data.branding_colores}
        otroValue={data.branding_colores_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('9. ¿Qué entregables necesitas?', '9. What brand assets do you need delivered?')}
        name="branding_entregables"
        options={L(
          ['Solo logo', 'Logo + variantes', 'Identidad completa', 'Manual de marca'],
          ['Primary logo only', 'Logo + submarks & variants', 'Full identity kit', 'Comprehensive brand guidelines book']
        )}
        value={data.branding_entregables}
        otroValue={data.branding_entregables_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('10. ¿Tienes referencias de marcas que te gusten?', '10. Do you have reference brands you admire?')}
        name="branding_referencias"
        options={L(
          ['Tengo links', 'Tengo ideas', 'No', 'Quiero que me guíen'],
          ['Yes, I have links/moodboards', 'I have rough concepts', 'Not yet', 'I want full strategic guidance']
        )}
        value={data.branding_referencias}
        otroValue={data.branding_referencias_otro}
        onChange={onChange}
      />
    </div>
  );
};

export default BrandingSection;
