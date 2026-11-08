import QuestionField from '../QuestionField';
import { FormData } from '../types';
import { L } from '@/i18n';

interface AppsSectionProps {
  data: FormData;
  onChange: (name: string, value: string) => void;
}

const AppsSection = ({ data, onChange }: AppsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {L('📱 Aplicaciones', '📱 Applications & Software')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {L('Detalles sobre tu app', 'Details about your mobile or web app vision')}
        </p>
      </div>

      <QuestionField
        label={L('1. ¿Para qué plataforma?', '1. Which platform(s) are you targeting?')}
        name="app_plataforma"
        options={L(
          ['iOS', 'Android', 'WebApp', 'Multiplataforma'],
          ['iOS (Apple App Store)', 'Android (Google Play)', 'Modern Web App (PWA)', 'Cross-platform (iOS + Android + Web)']
        )}
        value={data.app_plataforma}
        otroValue={data.app_plataforma_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('2. ¿En qué etapa está el proyecto?', '2. What stage is the app development in?')}
        name="app_etapa"
        options={L(
          ['Solo idea', 'Tengo prototipo', 'MVP', 'App existente'],
          ['Idea / Concept phase', 'Wireframes / Prototype ready', 'MVP ready to scale', 'Existing app to redesign/refactor']
        )}
        value={data.app_etapa}
        otroValue={data.app_etapa_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('3. ¿Necesitas sistema de login?', '3. Do you need user accounts & authentication?')}
        name="app_login"
        options={L(
          ['Sí', 'No', 'Social login (Google, etc.)', 'No lo sé'],
          ['Yes (Email/Password)', 'No accounts needed', 'Social Login (Google, Apple, etc.)', 'Not sure yet']
        )}
        value={data.app_login}
        otroValue={data.app_login_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('4. ¿Habrá pagos en la app?', '4. Will the app process in-app transactions?')}
        name="app_pagos"
        options={L(
          ['No', 'Suscripción', 'Pago único', 'Marketplace'],
          ['No payments', 'Recurring subscriptions (SaaS)', 'One-time purchases / Checkout', 'Multi-vendor marketplace']
        )}
        value={data.app_pagos}
        otroValue={data.app_pagos_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('5. ¿Necesitas panel de administración?', '5. Do you need a custom admin dashboard?')}
        name="app_admin"
        options={L(
          ['Sí, completo', 'Básico', 'No', 'No lo sé'],
          ['Yes, full management backoffice', 'Basic stats & controls', 'No dashboard required', 'Need advice']
        )}
        value={data.app_admin}
        otroValue={data.app_admin_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('6. ¿Qué tipo de notificaciones?', '6. What notification channels are needed?')}
        name="app_notif"
        options={L(
          ['Push', 'Email', 'WhatsApp', 'No necesito'],
          ['Mobile Push Notifications', 'Automated Emails', 'SMS / Direct Messaging', 'No notifications needed']
        )}
        value={data.app_notif}
        otroValue={data.app_notif_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('7. ¿Nivel de complejidad?', '7. Estimated technical complexity?')}
        name="app_complejidad"
        options={L(
          ['Simple', 'Media', 'Alta', 'No lo sé'],
          ['Simple (Content / Informational)', 'Medium (Interactive / Bookings / User data)', 'High (Custom logic / AI / Real-time)', 'Not sure']
        )}
        value={data.app_complejidad}
        otroValue={data.app_complejidad_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('8. ¿Cuántos usuarios esperas?', '8. Expected user volume in year 1?')}
        name="app_usuarios"
        options={L(
          ['Menos de 100', '100 - 1.000', '1.000 - 10.000', 'Más de 10.000'],
          ['Under 500 users', '500 – 2,500 users', '2,500 – 10,000 users', '10,000+ users']
        )}
        value={data.app_usuarios}
        otroValue={data.app_usuarios_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('9. ¿Tienes apps de referencia?', '9. Do you have benchmark apps you love?')}
        name="app_refs"
        options={L(
          ['Tengo apps similares', 'Tengo idea', 'No', 'Quiero propuesta'],
          ['Yes, specific benchmark apps', 'General conceptual idea', 'No references yet', 'I want NOVA to architect from scratch']
        )}
        value={data.app_refs}
        otroValue={data.app_refs_otro}
        onChange={onChange}
      />

      <QuestionField
        label={L('10. ¿Necesitas mantenimiento?', '10. Will you need ongoing DevOps & maintenance?')}
        name="app_mant"
        options={L(
          ['No', 'Sí, mensual', 'Sí, por horas', 'No lo sé'],
          ['No, handoff upon delivery', 'Yes, monthly SLA & maintenance', 'On-demand hourly block', 'Not sure']
        )}
        value={data.app_mant}
        otroValue={data.app_mant_otro}
        onChange={onChange}
      />
    </div>
  );
};

export default AppsSection;
