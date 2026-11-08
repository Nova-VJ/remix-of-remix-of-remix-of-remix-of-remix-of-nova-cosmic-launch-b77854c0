import QuestionField from '../QuestionField';
import { FormData } from '../types';
import { L } from '@/i18n';

interface WebSectionProps {
  data: FormData;
  onChange: (name: string, value: string) => void;
}

const WebSection = ({ data, onChange }: WebSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {L('🌐 Páginas Web', '🌐 Websites')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {L('Detalles sobre tu proyecto web', 'Details about your website architecture and goals')}
        </p>
      </div>

      <QuestionField
        label={L('1. ¿Qué tipo de web necesitas?', '1. What type of website do you need?')}
        name="web_tipo"
        options={L(
          ['Landing page', 'Corporativa', 'Ecommerce', 'Con usuarios/login'],
          ['High-converting Landing Page', 'Corporate / Business Site', 'E-commerce Store', 'Web App / Portal with Login']
        )}
        value={data.web_tipo}
        otroValue={data.web_tipo_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('2. ¿Cuál es el objetivo principal?', '2. What is the primary purpose of the site?')}
        name="web_objetivo"
        options={L(
          ['Captar leads', 'Vender online', 'Informar', 'Reservas/citas'],
          ['Generate inbound leads', 'Sell products online', 'Corporate authority & info', 'Online bookings / Appointments']
        )}
        value={data.web_objetivo}
        otroValue={data.web_objetivo_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('3. ¿Tienes los contenidos listos?', '3. Do you have ready site content (copy, media)?')}
        name="web_contenidos"
        options={L(
          ['Todo listo', 'Parcialmente', 'Nada', 'Que los cree Nova'],
          ['Everything ready', 'Partially ready', 'Starting from scratch', 'I need NOVA to write & design it']
        )}
        value={data.web_contenidos}
        otroValue={data.web_contenidos_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('4. ¿Tienes una idea de diseño?', '4. Do you have design preferences?')}
        name="web_diseno"
        options={L(
          ['Tengo referencia', 'Quiero propuesta', 'Minimalista', 'Muy visual'],
          ['I have reference sites', 'I want NOVA to propose concepts', 'Ultra-clean & Minimalist', 'High-impact & Visual']
        )}
        value={data.web_diseno}
        otroValue={data.web_diseno_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('5. ¿Qué importancia tiene el SEO?', '5. How important is SEO ranking for Google?')}
        name="web_seo"
        options={L(
          ['Prioridad alta', 'Básico', 'No me interesa', 'No sé qué es'],
          ['Top priority (search engine traffic)', 'Standard best practices', 'Not a focus right now', 'Need advice']
        )}
        value={data.web_seo}
        otroValue={data.web_seo_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('6. ¿Qué funcionalidad es clave?', '6. What is a key functionality you require?')}
        name="web_funcion"
        options={L(
          ['Formulario de contacto', 'WhatsApp/chat', 'Pagos online', 'Reservas'],
          ['Contact / Lead forms', 'Direct messaging / Live chat', 'Online checkout / Payments', 'Online scheduling']
        )}
        value={data.web_funcion}
        otroValue={data.web_funcion_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('7. ¿Cuántos idiomas necesitas?', '7. How many languages should the site support?')}
        name="web_idiomas"
        options={L(
          ['1 idioma', '2 idiomas', '3 o más', 'No lo sé'],
          ['1 language (English)', '2 languages (e.g. EN + ES)', '3 or more', 'Not sure yet']
        )}
        value={data.web_idiomas}
        otroValue={data.web_idiomas_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('8. ¿Tienes dominio y hosting?', '8. Do you already have a domain and hosting?')}
        name="web_hosting"
        options={L(
          ['Ya tengo', 'No tengo', 'Quiero que lo gestionen', 'No sé qué es'],
          ['I already own them', 'Do not have them yet', 'I want NOVA to handle setup', 'Not sure what is needed']
        )}
        value={data.web_hosting}
        otroValue={data.web_hosting_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('9. ¿Necesitas mantenimiento?', '9. Will you need ongoing technical maintenance?')}
        name="web_mantenimiento"
        options={L(
          ['No', 'Sí, mensual', 'Sí, puntual', 'No lo sé'],
          ['No, one-off build', 'Yes, monthly maintenance plan', 'As needed on-demand', 'Not sure']
        )}
        value={data.web_mantenimiento}
        otroValue={data.web_mantenimiento_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('10. ¿Nivel de urgencia?', '10. What is your delivery timeline?')}
        name="web_urgencia"
        options={L(
          ['1-2 semanas', '1 mes', '2-3 meses', 'Flexible'],
          ['1–2 weeks (express)', 'Within 1 month', '2–3 months', 'Flexible']
        )}
        value={data.web_urgencia}
        otroValue={data.web_urgencia_otro}
        onChange={onChange}
      />
    </div>
  );
};

export default WebSection;
