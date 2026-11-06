import SEOHead from '@/components/SEOHead';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SEO_PAGES } from "@/config/seo";
import { LEGAL_ENTITY, LEGAL_UPDATED, legalIdentityRows } from '@/config/legal';
import { useTranslation } from '@/i18n';

const PrivacyPolicy = () => {
  const { isEn } = useTranslation();

  return (
    <>
      <SEOHead {...SEO_PAGES["/politica-de-privacidad"]} />
      <Navbar />
      <main id="contenido" className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-3">
            {isEn ? "Legal Information" : "Información legal"}
          </p>

          <h1 className="text-3xl font-bold mb-8">
            {isEn ? "Privacy Policy" : "Política de Privacidad"}
          </h1>

          {isEn ? (
            /* REVISAR: Legal counsel should review US state privacy disclosures (e.g., CCPA/CPRA, VCDPA) */
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
              <p className="text-muted-foreground">
                This Privacy Policy describes how Nova Marketing Solutions ("we", "us", or "our") collects, uses, and shares your personal information when you visit or interact with our website at novasolutionsmkt.com.
              </p>

              <section>
                <h2 className="text-xl font-semibold mb-3">1. Data Controller & Business Information</h2>
                <ul className="list-none space-y-1 text-muted-foreground">
                  {legalIdentityRows().map(([label, value]) => (
                    <li key={label}><strong>{label}:</strong> {value}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
                <p className="text-muted-foreground">
                  We collect information that you voluntarily provide directly to us, including:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Contact and project inquiry forms (full name, email address, phone number, business name, and project scope)</li>
                  <li>Inquiries and messages sent to our AI virtual assistant, Sara</li>
                  <li>Client portal registration and account details</li>
                  <li>Direct communications via email or messaging platforms</li>
                  <li>Technical data such as IP address, browser type, and operating system collected for operational security</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  We do not solicit or intentionally collect sensitive personal information (such as health data, biometric data, or government IDs) through our public forms or chat.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>To respond to your inquiries and schedule consultations</li>
                  <li>To prepare customized service proposals and cost estimates</li>
                  <li>To provide, maintain, and improve our digital services</li>
                  <li>To manage client relationships and project deliverables</li>
                  <li>To prevent fraud, spam, and technical abuse</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Information Sharing & Third-Party Disclosure</h2>
                <p className="text-muted-foreground">
                  We do not sell, rent, or trade your personal information. We may share necessary data with trusted service providers who assist us in operating our website, hosting databases, and sending communications, under strict confidentiality agreements.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Your Privacy Rights</h2>
                <p className="text-muted-foreground">
                  /* REVISAR: Consumer privacy rights under US state laws (California, Texas, Virginia, etc.) */
                  Depending on your jurisdiction, you may have rights regarding your personal information, including:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>The right to know what personal information we collect and how it is used</li>
                  <li>The right to request deletion of your personal information</li>
                  <li>The right to correct inaccurate personal data</li>
                  <li>The right to non-discrimination for exercising your privacy rights</li>
                </ul>
                <p className="text-muted-foreground mt-2">
                  To exercise any of these rights, please email us at <strong>info@novasolutionsmkt.com</strong>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Data Security & Retention</h2>
                <p className="text-muted-foreground">
                  We implement industry-standard administrative, technical, and physical safeguards to protect your personal information against unauthorized access, alteration, or disclosure. We retain your information only as long as necessary to fulfill the purposes outlined in this policy or to comply with applicable legal obligations.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Updates to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Last updated:</strong> {LEGAL_UPDATED}
                </p>
              </section>
            </div>
          ) : (
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
                <h2 className="text-xl font-semibold mb-3">4. Legitimación</h2>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li><strong>Consentimiento (art. 6.1.a RGPD):</strong> al rellenar un formulario, escribirnos por el chat o suscribirte a comunicaciones comerciales. Puedes retirarlo en cualquier momento.</li>
                  <li><strong>Ejecución de un contrato o medidas precontractuales (art. 6.1.b RGPD):</strong> para preparar tu presupuesto o prestarte los servicios contratados.</li>
                  <li><strong>Interés legítimo (art. 6.1.f RGPD):</strong> para garantizar la seguridad de la web y prevenir el fraude.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Conservación de los Datos</h2>
                <p className="text-muted-foreground">
                  Conservamos tus datos mientras se mantenga la relación comercial o durante el tiempo necesario para responder a tu consulta y cumplir las obligaciones legales aplicables.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Destinatarios</h2>
                <p className="text-muted-foreground">
                  No vendemos ni cedemos tus datos a terceros, salvo obligación legal. Para prestarte servicio utilizamos proveedores tecnológicos de confianza con las debidas garantías de confidencialidad y seguridad.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Derechos</h2>
                <p className="text-muted-foreground">
                  Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad enviando un correo a <strong>info@solutionsnova.es</strong> indicando el derecho que deseas ejercer.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Modificaciones</h2>
                <p className="text-muted-foreground">
                  Nos reservamos el derecho a modificar esta política para adaptarla a novedades legislativas o jurisprudenciales.
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Última actualización:</strong> {LEGAL_UPDATED}
                </p>
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
