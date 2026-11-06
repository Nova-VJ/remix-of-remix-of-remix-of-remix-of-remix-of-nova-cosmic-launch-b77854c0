import SEOHead from '@/components/SEOHead';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SEO_PAGES } from "@/config/seo";
import { LEGAL_ENTITY, LEGAL_UPDATED, legalIdentityRows } from '@/config/legal';
import { useTranslation } from '@/i18n';

const LegalNotice = () => {
  const { isEn } = useTranslation();

  return (
    <>
      <SEOHead {...SEO_PAGES["/aviso-legal"]} />
      <Navbar />
      <main id="contenido" className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-3">
            {isEn ? "Legal Information" : "Información legal"}
          </p>

          <h1 className="text-3xl font-bold mb-8">
            {isEn ? "Terms of Service & Legal Notice" : "Aviso Legal"}
          </h1>

          {isEn ? (
            /* REVISAR: Legal counsel should confirm US Terms of Service and state-specific disclaimers */
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Identification & Contact</h2>
                <p className="text-muted-foreground">
                  This website is operated by Nova Marketing Solutions. Throughout the site, the terms "we", "us" and "our" refer to Nova Marketing Solutions.
                </p>
                <ul className="list-none space-y-1 text-muted-foreground mt-3">
                  {legalIdentityRows().map(([label, value]) => (
                    <li key={label}><strong>{label}:</strong> {value}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using novasolutionsmkt.com (the "Website"), you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, you may not access the Website or use any services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Intellectual Property Rights</h2>
                <p className="text-muted-foreground">
                  All content included on this Website—such as text, graphics, logos, images, digital downloads, data compilations, and software—is the property of Nova Marketing Solutions or its content suppliers and is protected by United States and international copyright, trademark, and intellectual property laws.
                </p>
                <p className="text-muted-foreground mt-2">
                  Unauthorized reproduction, distribution, modification, or commercial exploitation is strictly prohibited without prior written consent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Permitted Use</h2>
                <p className="text-muted-foreground">
                  You agree to use this Website only for lawful purposes. You agree not to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Use the Website in any manner that could disable, overburden, or impair site performance</li>
                  <li>Introduce viruses, trojans, worms, or other malicious computer code</li>
                  <li>Attempt to gain unauthorized access to any accounts, computer systems, or networks</li>
                  <li>Transmit unsolicited commercial messages (spam)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground">
                  /* REVISAR: Standard UCC disclaimer for US commercial websites */
                  THE WEBSITE AND ALL SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  /* REVISAR: Limitation of liability clause for commercial contracts in the United States */
                  IN NO EVENT SHALL NOVA MARKETING SOLUTIONS, ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE WEBSITE OR SERVICES.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Third-Party Links</h2>
                <p className="text-muted-foreground">
                  Our Website may contain links to third-party web sites or services that are not owned or controlled by Nova Marketing Solutions. We assume no responsibility for the content, privacy policies, or practices of any third-party sites.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Governing Law & Dispute Resolution</h2>
                <p className="text-muted-foreground">
                  /* REVISAR: Governing state law — default set to Delaware, USA */
                  These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any dispute arising out of these Terms shall be resolved in the state or federal courts located in the United States.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Modifications to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. Changes become effective immediately upon posting to the Website.
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Last updated:</strong> {LEGAL_UPDATED}
                </p>
              </section>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Datos Identificativos</h2>
                <p className="text-muted-foreground">
                  En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, se exponen los siguientes datos:
                </p>
                <ul className="list-none space-y-1 text-muted-foreground mt-3">
                  {legalIdentityRows().map(([label, value]) => (
                    <li key={label}><strong>{label}:</strong> {value}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Objeto</h2>
                <p className="text-muted-foreground">
                  El presente Aviso Legal regula el uso del sitio web solutionsnova.es (en adelante, "la Web").
                </p>
                <p className="text-muted-foreground mt-2">
                  La navegación por la Web atribuye la condición de usuario de la misma e implica la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Propiedad Intelectual e Industrial</h2>
                <p className="text-muted-foreground">
                  Los contenidos de esta Web, incluyendo pero no limitándose a textos, imágenes, gráficos, diseños, bases de datos, software, logotipos, marcas y demás elementos, están protegidos por derechos de propiedad intelectual e industrial.
                </p>
                <p className="text-muted-foreground mt-2">
                  Queda prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra forma de explotación de los contenidos sin autorización expresa del titular.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Condiciones de Uso</h2>
                <p className="text-muted-foreground">
                  El usuario se compromete a:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2">
                  <li>Utilizar la Web de forma diligente, correcta y lícita</li>
                  <li>No realizar actividades ilícitas o contrarias a la buena fe</li>
                  <li>No difundir contenidos de carácter racista, xenófobo, pornográfico, ilegal o atentatorio contra los derechos humanos</li>
                  <li>No introducir virus informáticos o realizar acciones que puedan alterar, dañar, interrumpir o generar errores en los sistemas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Exclusión de Responsabilidad</h2>
                <p className="text-muted-foreground">
                  El titular no se hace responsable de:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2">
                  <li>Errores u omisiones en los contenidos</li>
                  <li>Falta de disponibilidad del sitio web</li>
                  <li>Transmisión de virus o programas maliciosos</li>
                  <li>Uso indebido de los contenidos por parte de los usuarios</li>
                  <li>Contenidos de sitios web enlazados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Enlaces</h2>
                <p className="text-muted-foreground">
                  Esta Web puede contener enlaces a sitios web de terceros. El titular no se hace responsable del contenido, exactitud o funcionamiento de dichos sitios.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Legislación Aplicable y Jurisdicción</h2>
                <p className="text-muted-foreground">
                  Las presentes condiciones se rigen por la legislación española. Para cualquier controversia derivada de su interpretación o aplicación, las partes se someten a los Juzgados y Tribunales del domicilio del usuario, si este tiene la condición de consumidor.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Modificaciones</h2>
                <p className="text-muted-foreground">
                  El titular se reserva el derecho a modificar el presente Aviso Legal para adaptarlo a novedades legislativas o jurisprudenciales.
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

export default LegalNotice;
