import QuestionField from '../QuestionField';
import { FormData } from '../types';
import { L } from '@/i18n';

interface GeneralSectionProps {
  data: FormData;
  onChange: (name: string, value: string) => void;
}

const GeneralSection = ({ data, onChange }: GeneralSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {L('Información general del proyecto', 'General Project Overview')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {L('Para entender mejor tus necesidades', 'To better understand your goals and scope')}
        </p>
      </div>

      <QuestionField
        label={L('1. ¿En qué etapa está tu proyecto?', '1. What stage is your project currently in?')}
        name="gen_etapa"
        options={L(
          ['Idea', 'Lanzamiento', 'En crecimiento', 'Consolidado'],
          ['Idea / Concept', 'Launch / Early stage', 'Growth phase', 'Established business']
        )}
        value={data.gen_etapa}
        otroValue={data.gen_etapa_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('2. ¿Cuál es tu objetivo principal?', '2. What is your primary objective?')}
        name="gen_objetivo"
        options={L(
          ['Vender más', 'Conseguir leads', 'Mejorar imagen de marca', 'Automatizar procesos'],
          ['Increase sales & revenue', 'Generate qualified leads', 'Elevate brand positioning', 'Automate operations & funnels']
        )}
        value={data.gen_objetivo}
        otroValue={data.gen_objetivo_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('3. ¿Cuál es tu tipo de cliente?', '3. Who is your target customer?')}
        name="gen_tipo_cliente"
        options={L(
          ['B2C (consumidor final)', 'B2B (empresas)', 'Ambos', 'No lo sé'],
          ['B2C (Consumers)', 'B2B (Companies)', 'Both B2B and B2C', 'Not sure yet']
        )}
        value={data.gen_tipo_cliente}
        otroValue={data.gen_tipo_cliente_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('4. ¿Cuánta urgencia tienes?', '4. What is your estimated timeline?')}
        name="gen_urgencia"
        options={L(
          ['1-2 semanas', '1 mes', '2-3 meses', 'Sin prisa'],
          ['1–2 weeks (urgent)', 'Within 1 month', '2–3 months', 'Flexible / Planning ahead']
        )}
        value={data.gen_urgencia}
        otroValue={data.gen_urgencia_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('5. ¿Cuál es tu rango de presupuesto?', '5. What is your estimated budget?')}
        name="gen_presupuesto"
        options={L(
          ['Menos de 500€', '500€ - 1.500€', '1.500€ - 3.000€', 'Más de 3.000€'],
          ['Under $500', '$500 – $1,500', '$1,500 – $3,000', 'Over $3,000']
        )}
        value={data.gen_presupuesto}
        otroValue={data.gen_presupuesto_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('6. ¿Tienes el contenido disponible?', '6. Do you have ready content (copy, photos)?')}
        name="gen_contenido"
        options={L(
          ['Todo listo', 'Parcialmente', 'Nada todavía', 'Que lo cree Nova'],
          ['Everything ready', 'Partially ready', 'Starting from scratch', 'I need NOVA to create it']
        )}
        value={data.gen_contenido}
        otroValue={data.gen_contenido_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('7. ¿Has analizado a tu competencia?', '7. Have you analyzed key competitors?')}
        name="gen_competencia"
        options={L(
          ['Sí, tengo lista', 'Sí, algunos', 'No', 'No sé cómo hacerlo'],
          ['Yes, I have a clear list', 'Yes, a few reference brands', 'Not yet', 'I need strategic guidance']
        )}
        value={data.gen_competencia}
        otroValue={data.gen_competencia_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('8. ¿Cuál es tu canal principal hoy?', '8. What is your main customer acquisition channel?')}
        name="gen_canal"
        options={L(
          ['Redes sociales', 'Recomendaciones', 'Web', 'Marketplaces'],
          ['Social media', 'Word of mouth / Referrals', 'Website / Google', 'Marketplaces']
        )}
        value={data.gen_canal}
        otroValue={data.gen_canal_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('9. ¿Qué prioridad tiene la marca para ti?', '9. How critical is brand identity for you?')}
        name="gen_prioridad_marca"
        options={L(
          ['Alta', 'Media', 'Baja', 'No lo sé'],
          ['High priority', 'Medium priority', 'Low priority', 'Not sure']
        )}
        value={data.gen_prioridad_marca}
        otroValue={data.gen_prioridad_marca_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('10. ¿Cuál sería el siguiente paso ideal?', '10. What is your preferred next step?')}
        name="gen_siguiente_paso"
        options={L(
          ['Llamada', 'Presupuesto por email', 'Propuesta + plan', 'Asesoría inicial'],
          ['Intro discovery call', 'Quote via email', 'Full proposal & timeline', 'Strategy consultation']
        )}
        value={data.gen_siguiente_paso}
        otroValue={data.gen_siguiente_paso_otro}
        onChange={onChange}
      />
    </div>
  );
};

export default GeneralSection;
