import SEOHead from '@/components/SEOHead';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SEO_PAGES } from "@/config/seo";
import { LEGAL_ENTITY, LEGAL_UPDATED, legalIdentityRows } from '@/config/legal';

const PrivacyPolicy = () => {
  return (
    <>
    <SEOHead {...SEO_PAGES["/politica-de-privacidad"]} />
    <Navbar />
    <main id="contenido" className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <p className="eyebrow mb-3">Información legal</p>

        <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            Esta política explica cómo tratamos tus datos personales conforme al Reglamento (UE) 2016/679 General de Protección de Datos (RGPD), la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD) y la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-3">1. Responsable del Tratamiento</h2>
            <ul className="list-none space-y-1 text-muted-foreground">
              {legalIdentityRows().map(([label, value]) => (
                <li key={label}><strong>{label}:</strong> {value}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Datos que Recogemos</h2>
            <p className="text-muted-foreground">
              Solo tratamos los datos que nos facilitas o que son necesarios para atenderte:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Formularios de contacto y de presupuesto (nombre, email, teléfono, sector y lo que nos cuentes de tu proyecto)</li>
              <li>Conversaciones con nuestra asistente virtual, Sara</li>
              <li>Citas, tickets de soporte y solicitudes de contenido</li>
              <li>Registro de cuenta en nuestro portal de clientes</li>
              <li>Contacto por WhatsApp o email</li>
              <li>Datos técnicos de seguridad (ver apartado 8)</li>
            </ul>
            <p className="text-muted-foreground">
              No compartas datos especialmente sensibles (salud, ideología, etc.) en los formularios ni en el chat.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Finalidad del Tratamiento</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Responder a tus solicitudes y consultas</li>
              <li>Prepararte y enviarte presupuestos personalizados</li>
              <li>Gestionar la relación comercial si contratas nuestros servicios</li>
              <li>Proporcionarte soporte técnico y acceso al portal de cliente</li>
              <li>Enviarte información comercial sobre nuestros servicios, solo si nos has dado tu consentimiento</li>
              <li>Proteger la web frente a abusos y envíos automáticos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Base Jurídica</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong>Consentimiento</strong> (art. 6.1.a RGPD): al enviar un formulario, escribir a Sara o aceptar recibir comunicaciones. Puedes retirarlo cuando quieras.</li>
              <li><strong>Ejecución de un contrato o medidas precontractuales</strong> (art. 6.1.b RGPD): presupuestos y servicios contratados.</li>
              <li><strong>Obligación legal</strong> (art. 6.1.c RGPD): facturación y obligaciones fiscales.</li>
              <li><strong>Interés legítimo</strong> (art. 6.1.f RGPD): seguridad de la web y prevención de abusos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Conservación de Datos</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Solicitudes de contacto: hasta 12 meses si no hay relación comercial</li>
              <li>Conversaciones con Sara: el tiempo necesario para darte continuidad, como máximo 12 meses</li>
              <li>Datos de clientes: durante la relación comercial y los plazos legales posteriores</li>
              <li>Datos de facturación: 6 años (obligación fiscal)</li>
              <li>Registros de seguridad de los formularios: 2 días</li>
              <li>Comunicaciones comerciales: hasta que pidas la baja</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Destinatarios y Encargados del Tratamiento</h2>
            <p className="text-muted-foreground">
              No vendemos ni cedemos tus datos a terceros, salvo obligación legal. Para prestar el servicio nos apoyamos en estos proveedores, que actúan como encargados del tratamiento:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong>Cloudflare:</strong> alojamiento de la web, red de distribución y seguridad</li>
              <li><strong>Supabase:</strong> base de datos, cuentas de usuario y funciones del servidor</li>
              <li><strong>Google (Gemini / Vertex AI):</strong> genera las respuestas de la asistente virtual Sara</li>
              <li><strong>Formspree:</strong> recepción de los formularios de presupuesto</li>
              <li><strong>Google (Gmail) y Brevo:</strong> envío de correos electrónicos</li>
              <li><strong>Google Analytics y Meta (Facebook/Instagram):</strong> analítica y publicidad, solo si aceptas las cookies correspondientes</li>
            </ul>
            <p className="text-muted-foreground">
              Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo; en ese caso lo hacen con garantías adecuadas (Marco de Privacidad de Datos UE-EE. UU. o Cláusulas Contractuales Tipo de la Comisión Europea).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Comunicaciones Comerciales</h2>
            <p className="text-muted-foreground">
              Solo te enviamos información comercial por correo si nos has dado tu consentimiento. Cada correo se identifica como publicidad e incluye cómo darte de baja: basta con responder «baja» o escribir a <strong>{LEGAL_ENTITY.email}</strong>, y no volveremos a escribirte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Seguridad</h2>
            <p className="text-muted-foreground">
              Aplicamos medidas técnicas y organizativas para proteger tus datos: conexiones cifradas, acceso restringido por roles y protección frente a envíos automáticos. Para limitar abusos guardamos una huella cifrada e irreversible de la dirección IP desde la que se envían formularios o mensajes a Sara (la de los formularios se borra a los 2 días); nunca guardamos la IP en claro.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Tus Derechos</h2>
            <p className="text-muted-foreground">Puedes ejercer en cualquier momento los derechos de:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong>Acceso:</strong> saber qué datos tenemos sobre ti</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos</li>
              <li><strong>Supresión:</strong> eliminar tus datos</li>
              <li><strong>Oposición:</strong> oponerte a un tratamiento</li>
              <li><strong>Limitación:</strong> restringir el tratamiento</li>
              <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado</li>
              <li><strong>Retirar el consentimiento</strong> que nos hayas dado, sin que afecte a lo tratado antes</li>
            </ul>
            <p className="text-muted-foreground">
              Escríbenos a <strong>{LEGAL_ENTITY.email}</strong> indicando en el asunto el derecho que quieres ejercer. Te responderemos en el plazo máximo de un mes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Reclamaciones</h2>
            <p className="text-muted-foreground">
              Si consideras que no hemos tratado tus datos correctamente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD): <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aepd.es</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">11. Menores</h2>
            <p className="text-muted-foreground">
              Nuestros servicios no están dirigidos a menores de 18 años. No recogemos datos de menores intencionadamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">12. Actualizaciones</h2>
            <p className="text-muted-foreground">
              Esta política puede actualizarse para adaptarla a cambios legales o del servicio. Te recomendamos revisarla periódicamente.
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Última actualización:</strong> {LEGAL_UPDATED}
            </p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
};

export default PrivacyPolicy;
