import QuestionField from '../QuestionField';
import { FormData } from '../types';

interface GeneralSectionProps {
  data: FormData;
  onChange: (name: string, value: string) => void;
}

const GeneralSection = ({ data, onChange }: GeneralSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">Información general del proyecto</h3>
        <p className="text-sm text-muted-foreground">Para entender mejor tus necesidades</p>
      </div>

      <QuestionField
        label="1. ¿En qué etapa está tu proyecto?"
        name="gen_etapa"
        options={['Idea', 'Lanzamiento', 'En crecimiento', 'Consolidado']}
        value={data.gen_etapa}
        otroValue={data.gen_etapa_otro}
        onChange={onChange}
      />

      <QuestionField
        label="2. ¿Cuál es tu objetivo principal?"
        name="gen_objetivo"
        options={['Vender más', 'Conseguir leads', 'Mejorar imagen de marca', 'Automatizar procesos']}
        value={data.gen_objetivo}
        otroValue={data.gen_objetivo_otro}
        onChange={onChange}
      />

      <QuestionField
        label="3. ¿Cuál es tu tipo de cliente?"
        name="gen_tipo_cliente"
        options={['B2C (consumidor final)', 'B2B (empresas)', 'Ambos', 'No lo sé']}
        value={data.gen_tipo_cliente}
        otroValue={data.gen_tipo_cliente_otro}
        onChange={onChange}
      />

      <QuestionField
        label="4. ¿Cuánta urgencia tienes?"
        name="gen_urgencia"
        options={['1-2 semanas', '1 mes', '2-3 meses', 'Sin prisa']}
        value={data.gen_urgencia}
        otroValue={data.gen_urgencia_otro}
        onChange={onChange}
      />

      <QuestionField
        label="5. ¿Cuál es tu rango de presupuesto?"
        name="gen_presupuesto"
        options={['Menos de 500€', '500€ - 1.500€', '1.500€ - 3.000€', 'Más de 3.000€']}
        value={data.gen_presupuesto}
        otroValue={data.gen_presupuesto_otro}
        onChange={onChange}
      />

      <QuestionField
        label="6. ¿Tienes el contenido disponible?"
        name="gen_contenido"
        options={['Todo listo', 'Parcialmente', 'Nada todavía', 'Que lo cree Nova']}
        value={data.gen_contenido}
        otroValue={data.gen_contenido_otro}
        onChange={onChange}
      />

      <QuestionField
        label="7. ¿Has analizado a tu competencia?"
        name="gen_competencia"
        options={['Sí, tengo lista', 'Sí, algunos', 'No', 'No sé cómo hacerlo']}
        value={data.gen_competencia}
        otroValue={data.gen_competencia_otro}
        onChange={onChange}
      />

      <QuestionField
        label="8. ¿Cuál es tu canal principal hoy?"
        name="gen_canal"
        options={['Redes sociales', 'Recomendaciones', 'Web', 'Marketplaces']}
        value={data.gen_canal}
        otroValue={data.gen_canal_otro}
        onChange={onChange}
      />

      <QuestionField
        label="9. ¿Qué prioridad tiene la marca para ti?"
        name="gen_prioridad_marca"
        options={['Alta', 'Media', 'Baja', 'No lo sé']}
        value={data.gen_prioridad_marca}
        otroValue={data.gen_prioridad_marca_otro}
        onChange={onChange}
      />

      <QuestionField
        label="10. ¿Cuál sería el siguiente paso ideal?"
        name="gen_siguiente_paso"
        options={['Llamada', 'Presupuesto por email', 'Propuesta + plan', 'Asesoría inicial']}
        value={data.gen_siguiente_paso}
        otroValue={data.gen_siguiente_paso_otro}
        onChange={onChange}
      />
    </div>
  );
};

export default GeneralSection;
