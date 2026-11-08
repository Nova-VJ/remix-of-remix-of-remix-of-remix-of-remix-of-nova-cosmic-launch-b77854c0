import QuestionField from '../QuestionField';
import { FormData } from '../types';
import { L } from '@/i18n';

interface SocialSectionProps {
  data: FormData;
  onChange: (name: string, value: string) => void;
}

const SocialSection = ({ data, onChange }: SocialSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {L('📲 Redes Sociales', '📲 Social Media & Growth')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {L('Tu estrategia en redes', 'Your audience, content, and distribution strategy')}
        </p>
      </div>

      <QuestionField
        label={L('1. ¿Qué redes quieres trabajar?', '1. Which channels do you want to prioritize?')}
        name="rrss_redes"
        options={L(
          ['Instagram', 'TikTok', 'LinkedIn', 'Facebook'],
          ['Instagram', 'TikTok', 'LinkedIn', 'YouTube / Facebook']
        )}
        value={data.rrss_redes}
        otroValue={data.rrss_redes_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('2. ¿Cuál es tu objetivo principal?', '2. What is your primary growth goal?')}
        name="rrss_objetivo"
        options={L(
          ['Ventas', 'Captar leads', 'Visibilidad de marca', 'Comunidad'],
          ['Direct sales & conversions', 'Lead generation', 'Brand awareness & authority', 'Community engagement']
        )}
        value={data.rrss_objetivo}
        otroValue={data.rrss_objetivo_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('3. ¿Estado actual de tus redes?', '3. Current state of your social channels?')}
        name="rrss_estado"
        options={L(
          ['No tengo', 'Inactivo', 'Publico sin estrategia', 'Publico con estrategia'],
          ['Starting fresh / No accounts', 'Existing but dormant', 'Posting without clear strategy', 'Active with basic strategy']
        )}
        value={data.rrss_estado}
        otroValue={data.rrss_estado_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('4. ¿Qué formato te interesa más?', '4. Which creative formats do you prefer?')}
        name="rrss_formato"
        options={L(
          ['Reels/vídeos', 'Carruseles', 'Stories', 'Mixto'],
          ['Short-form video (Reels / TikTok)', 'Educational Carousels', 'Daily Stories', 'Full-spectrum Mix']
        )}
        value={data.rrss_formato}
        otroValue={data.rrss_formato_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('5. ¿Con qué frecuencia publicar?', '5. What publishing frequency are you aiming for?')}
        name="rrss_freq"
        options={L(
          ['2-3 por semana', '4-5 por semana', 'Diario', 'A definir'],
          ['2–3 posts per week', '4–5 posts per week', 'Daily content (6–7/wk)', 'To be recommended']
        )}
        value={data.rrss_freq}
        otroValue={data.rrss_freq_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('6. ¿Tienes material (fotos, vídeos)?', '6. Do you have ready visual assets (photos, raw video)?')}
        name="rrss_material"
        options={L(
          ['Sí', 'No', 'Parcialmente', 'Que lo cree Nova'],
          ['Yes, high-res library ready', 'No assets yet', 'Partially available', 'I want NOVA to produce/source everything']
        )}
        value={data.rrss_material}
        otroValue={data.rrss_material_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('7. ¿Qué estilo de comunicación?', '7. What communication tone reflects your brand?')}
        name="rrss_estilo"
        options={L(
          ['Profesional', 'Cercano', 'Viral/tendencias', 'Educativo'],
          ['Authoritative / Professional', 'Warm & Conversational', 'Trend-driven / Viral', 'Insightful / Educational']
        )}
        value={data.rrss_estilo}
        otroValue={data.rrss_estilo_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('8. ¿Interesa publicidad pagada (Ads)?', '8. Are you interested in Paid Social Ads?')}
        name="rrss_ads"
        options={L(
          ['Sí', 'No', 'Más adelante', 'No lo sé'],
          ['Yes, immediate ad spend', 'Organic only for now', 'Later once brand scales', 'Need consultation']
        )}
        value={data.rrss_ads}
        otroValue={data.rrss_ads_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('9. ¿Has analizado competencia en redes?', '9. Have you identified inspiring benchmark competitors?')}
        name="rrss_competencia"
        options={L(
          ['Tengo referentes', 'Algunos', 'No', 'Quiero análisis'],
          ['Yes, specific benchmark accounts', 'A few rough accounts', 'None yet', 'I want NOVA to conduct competitor audit']
        )}
        value={data.rrss_competencia}
        otroValue={data.rrss_competencia_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('10. ¿Qué tipo de servicio buscas?', '10. What level of partnership are you seeking?')}
        name="rrss_entrega"
        options={L(
          ['Solo gestión', 'Gestión + contenido', 'Estrategia completa', 'UGC/Creadores'],
          ['Community management only', 'Content creation + Publishing', 'End-to-end Growth Strategy', 'Creator / UGC campaigns']
        )}
        value={data.rrss_entrega}
        otroValue={data.rrss_entrega_otro}
        onChange={onChange}
      />
    </div>
  );
};

export default SocialSection;
