import QuestionField from '../QuestionField';
import { FormData } from '../types';

interface BrandingSectionProps {
  data: FormData;
  onChange: (name: string, value: string) => void;
}

const BrandingSection = ({ data, onChange }: BrandingSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">🎨 Branding</h3>
        <p className="text-sm text-muted-foreground">Cuéntanos sobre tu identidad de marca</p>
      </div>

      <QuestionField
        label="1. ¿Qué tipo de trabajo necesitas?"
        name="branding_tipo"
        options={['Logo nuevo', 'Rebranding', 'Identidad completa', 'Naming']}
        value={data.branding_tipo}
        otroValue={data.branding_tipo_otro}
        onChange={onChange}
      />

      <QuestionField
        label="2. ¿Nivel de urgencia?"
        name="branding_urgencia"
        options={['Inmediato', '2-4 semanas', '1-2 meses', 'Flexible']}
        value={data.branding_urgencia}
        otroValue={data.branding_urgencia_otro}
        onChange={onChange}
      />

      <QuestionField
        label="3. ¿Qué estilo visual te atrae?"
        name="branding_estilo"
        options={['Minimalista', 'Moderno', 'Elegante', 'Divertido']}
        value={data.branding_estilo}
        otroValue={data.branding_estilo_otro}
        onChange={onChange}
      />

      <QuestionField
        label="4. ¿Qué personalidad quieres transmitir?"
        name="branding_personalidad"
        options={['Premium', 'Cercana', 'Tecnológica', 'Artesanal']}
        value={data.branding_personalidad}
        otroValue={data.branding_personalidad_otro}
        onChange={onChange}
      />

      <QuestionField
        label="5. ¿Cuál es tu público principal?"
        name="branding_publico"
        options={['Jóvenes', 'Adultos', 'Profesional', 'Familiar']}
        value={data.branding_publico}
        otroValue={data.branding_publico_otro}
        onChange={onChange}
      />

      <QuestionField
        label="6. ¿Cómo te diferencias de la competencia?"
        name="branding_diferenciacion"
        options={['Precio', 'Calidad', 'Rapidez', 'Experiencia']}
        value={data.branding_diferenciacion}
        otroValue={data.branding_diferenciacion_otro}
        onChange={onChange}
      />

      <QuestionField
        label="7. ¿Dónde usarás principalmente la marca?"
        name="branding_uso"
        options={['Web', 'Redes sociales', 'Impresión', 'Packaging']}
        value={data.branding_uso}
        otroValue={data.branding_uso_otro}
        onChange={onChange}
      />

      <QuestionField
        label="8. ¿Tienes preferencia de colores?"
        name="branding_colores"
        options={['Naturales', 'Neutros', 'Vibrantes', 'Sin preferencia']}
        value={data.branding_colores}
        otroValue={data.branding_colores_otro}
        onChange={onChange}
      />

      <QuestionField
        label="9. ¿Qué entregables necesitas?"
        name="branding_entregables"
        options={['Solo logo', 'Logo + variantes', 'Identidad completa', 'Manual de marca']}
        value={data.branding_entregables}
        otroValue={data.branding_entregables_otro}
        onChange={onChange}
      />

      <QuestionField
        label="10. ¿Tienes referencias de marcas que te gusten?"
        name="branding_referencias"
        options={['Tengo links', 'Tengo ideas', 'No', 'Quiero que me guíen']}
        value={data.branding_referencias}
        otroValue={data.branding_referencias_otro}
        onChange={onChange}
      />
    </div>
  );
};

export default BrandingSection;
