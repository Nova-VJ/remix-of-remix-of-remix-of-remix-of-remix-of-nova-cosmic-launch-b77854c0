import QuestionField from '../QuestionField';
import { FormData } from '../types';

interface WebSectionProps {
  data: FormData;
  onChange: (name: string, value: string) => void;
}

const WebSection = ({ data, onChange }: WebSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">🌐 Páginas Web</h3>
        <p className="text-sm text-muted-foreground">Detalles sobre tu proyecto web</p>
      </div>

      <QuestionField
        label="1. ¿Qué tipo de web necesitas?"
        name="web_tipo"
        options={['Landing page', 'Corporativa', 'Ecommerce', 'Con usuarios/login']}
        value={data.web_tipo}
        otroValue={data.web_tipo_otro}
        onChange={onChange}
      />

      <QuestionField
        label="2. ¿Cuál es el objetivo principal?"
        name="web_objetivo"
        options={['Captar leads', 'Vender online', 'Informar', 'Reservas/citas']}
        value={data.web_objetivo}
        otroValue={data.web_objetivo_otro}
        onChange={onChange}
      />

      <QuestionField
        label="3. ¿Tienes los contenidos listos?"
        name="web_contenidos"
        options={['Todo listo', 'Parcialmente', 'Nada', 'Que los cree Nova']}
        value={data.web_contenidos}
        otroValue={data.web_contenidos_otro}
        onChange={onChange}
      />

      <QuestionField
        label="4. ¿Tienes una idea de diseño?"
        name="web_diseno"
        options={['Tengo referencia', 'Quiero propuesta', 'Minimalista', 'Muy visual']}
        value={data.web_diseno}
        otroValue={data.web_diseno_otro}
        onChange={onChange}
      />

      <QuestionField
        label="5. ¿Qué importancia tiene el SEO?"
        name="web_seo"
        options={['Prioridad alta', 'Básico', 'No me interesa', 'No sé qué es']}
        value={data.web_seo}
        otroValue={data.web_seo_otro}
        onChange={onChange}
      />

      <QuestionField
        label="6. ¿Qué funcionalidad es clave?"
        name="web_funcion"
        options={['Formulario de contacto', 'WhatsApp/chat', 'Pagos online', 'Reservas']}
        value={data.web_funcion}
        otroValue={data.web_funcion_otro}
        onChange={onChange}
      />

      <QuestionField
        label="7. ¿Cuántos idiomas necesitas?"
        name="web_idiomas"
        options={['1 idioma', '2 idiomas', '3 o más', 'No lo sé']}
        value={data.web_idiomas}
        otroValue={data.web_idiomas_otro}
        onChange={onChange}
      />

      <QuestionField
        label="8. ¿Tienes dominio y hosting?"
        name="web_hosting"
        options={['Ya tengo', 'No tengo', 'Quiero que lo gestionen', 'No sé qué es']}
        value={data.web_hosting}
        otroValue={data.web_hosting_otro}
        onChange={onChange}
      />

      <QuestionField
        label="9. ¿Necesitas mantenimiento?"
        name="web_mantenimiento"
        options={['No', 'Sí, mensual', 'Sí, puntual', 'No lo sé']}
        value={data.web_mantenimiento}
        otroValue={data.web_mantenimiento_otro}
        onChange={onChange}
      />

      <QuestionField
        label="10. ¿Nivel de urgencia?"
        name="web_urgencia"
        options={['1-2 semanas', '1 mes', '2-3 meses', 'Flexible']}
        value={data.web_urgencia}
        otroValue={data.web_urgencia_otro}
        onChange={onChange}
      />
    </div>
  );
};

export default WebSection;
