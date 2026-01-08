import QuestionField from '../QuestionField';
import { FormData } from '../types';

interface SocialSectionProps {
  data: FormData;
  onChange: (name: string, value: string) => void;
}

const SocialSection = ({ data, onChange }: SocialSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">📲 Redes Sociales</h3>
        <p className="text-sm text-muted-foreground">Tu estrategia en redes</p>
      </div>

      <QuestionField
        label="1. ¿Qué redes quieres trabajar?"
        name="rrss_redes"
        options={['Instagram', 'TikTok', 'LinkedIn', 'Facebook']}
        value={data.rrss_redes}
        otroValue={data.rrss_redes_otro}
        onChange={onChange}
      />

      <QuestionField
        label="2. ¿Cuál es tu objetivo principal?"
        name="rrss_objetivo"
        options={['Ventas', 'Captar leads', 'Visibilidad de marca', 'Comunidad']}
        value={data.rrss_objetivo}
        otroValue={data.rrss_objetivo_otro}
        onChange={onChange}
      />

      <QuestionField
        label="3. ¿Estado actual de tus redes?"
        name="rrss_estado"
        options={['No tengo', 'Inactivo', 'Publico sin estrategia', 'Publico con estrategia']}
        value={data.rrss_estado}
        otroValue={data.rrss_estado_otro}
        onChange={onChange}
      />

      <QuestionField
        label="4. ¿Qué formato te interesa más?"
        name="rrss_formato"
        options={['Reels/vídeos', 'Carruseles', 'Stories', 'Mixto']}
        value={data.rrss_formato}
        otroValue={data.rrss_formato_otro}
        onChange={onChange}
      />

      <QuestionField
        label="5. ¿Con qué frecuencia publicar?"
        name="rrss_freq"
        options={['2-3 por semana', '4-5 por semana', 'Diario', 'A definir']}
        value={data.rrss_freq}
        otroValue={data.rrss_freq_otro}
        onChange={onChange}
      />

      <QuestionField
        label="6. ¿Tienes material (fotos, vídeos)?"
        name="rrss_material"
        options={['Sí', 'No', 'Parcialmente', 'Que lo cree Nova']}
        value={data.rrss_material}
        otroValue={data.rrss_material_otro}
        onChange={onChange}
      />

      <QuestionField
        label="7. ¿Qué estilo de comunicación?"
        name="rrss_estilo"
        options={['Profesional', 'Cercano', 'Viral/tendencias', 'Educativo']}
        value={data.rrss_estilo}
        otroValue={data.rrss_estilo_otro}
        onChange={onChange}
      />

      <QuestionField
        label="8. ¿Interesa publicidad pagada (Ads)?"
        name="rrss_ads"
        options={['Sí', 'No', 'Más adelante', 'No lo sé']}
        value={data.rrss_ads}
        otroValue={data.rrss_ads_otro}
        onChange={onChange}
      />

      <QuestionField
        label="9. ¿Has analizado competencia en redes?"
        name="rrss_competencia"
        options={['Tengo referentes', 'Algunos', 'No', 'Quiero análisis']}
        value={data.rrss_competencia}
        otroValue={data.rrss_competencia_otro}
        onChange={onChange}
      />

      <QuestionField
        label="10. ¿Qué tipo de servicio buscas?"
        name="rrss_entrega"
        options={['Solo gestión', 'Gestión + contenido', 'Estrategia completa', 'UGC/Creadores']}
        value={data.rrss_entrega}
        otroValue={data.rrss_entrega_otro}
        onChange={onChange}
      />
    </div>
  );
};

export default SocialSection;
