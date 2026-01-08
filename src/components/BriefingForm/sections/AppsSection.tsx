import QuestionField from '../QuestionField';
import { FormData } from '../types';

interface AppsSectionProps {
  data: FormData;
  onChange: (name: string, value: string) => void;
}

const AppsSection = ({ data, onChange }: AppsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">📱 Aplicaciones</h3>
        <p className="text-sm text-muted-foreground">Detalles sobre tu app</p>
      </div>

      <QuestionField
        label="1. ¿Para qué plataforma?"
        name="app_plataforma"
        options={['iOS', 'Android', 'WebApp', 'Multiplataforma']}
        value={data.app_plataforma}
        otroValue={data.app_plataforma_otro}
        onChange={onChange}
      />

      <QuestionField
        label="2. ¿En qué etapa está el proyecto?"
        name="app_etapa"
        options={['Solo idea', 'Tengo prototipo', 'MVP', 'App existente']}
        value={data.app_etapa}
        otroValue={data.app_etapa_otro}
        onChange={onChange}
      />

      <QuestionField
        label="3. ¿Necesitas sistema de login?"
        name="app_login"
        options={['Sí', 'No', 'Social login (Google, etc.)', 'No lo sé']}
        value={data.app_login}
        otroValue={data.app_login_otro}
        onChange={onChange}
      />

      <QuestionField
        label="4. ¿Habrá pagos en la app?"
        name="app_pagos"
        options={['No', 'Suscripción', 'Pago único', 'Marketplace']}
        value={data.app_pagos}
        otroValue={data.app_pagos_otro}
        onChange={onChange}
      />

      <QuestionField
        label="5. ¿Necesitas panel de administración?"
        name="app_admin"
        options={['Sí, completo', 'Básico', 'No', 'No lo sé']}
        value={data.app_admin}
        otroValue={data.app_admin_otro}
        onChange={onChange}
      />

      <QuestionField
        label="6. ¿Qué tipo de notificaciones?"
        name="app_notif"
        options={['Push', 'Email', 'WhatsApp', 'No necesito']}
        value={data.app_notif}
        otroValue={data.app_notif_otro}
        onChange={onChange}
      />

      <QuestionField
        label="7. ¿Nivel de complejidad?"
        name="app_complejidad"
        options={['Simple', 'Media', 'Alta', 'No lo sé']}
        value={data.app_complejidad}
        otroValue={data.app_complejidad_otro}
        onChange={onChange}
      />

      <QuestionField
        label="8. ¿Cuántos usuarios esperas?"
        name="app_usuarios"
        options={['Menos de 100', '100 - 1.000', '1.000 - 10.000', 'Más de 10.000']}
        value={data.app_usuarios}
        otroValue={data.app_usuarios_otro}
        onChange={onChange}
      />

      <QuestionField
        label="9. ¿Tienes apps de referencia?"
        name="app_refs"
        options={['Tengo apps similares', 'Tengo idea', 'No', 'Quiero propuesta']}
        value={data.app_refs}
        otroValue={data.app_refs_otro}
        onChange={onChange}
      />

      <QuestionField
        label="10. ¿Necesitas mantenimiento?"
        name="app_mant"
        options={['No', 'Sí, mensual', 'Sí, por horas', 'No lo sé']}
        value={data.app_mant}
        otroValue={data.app_mant_otro}
        onChange={onChange}
      />
    </div>
  );
};

export default AppsSection;
