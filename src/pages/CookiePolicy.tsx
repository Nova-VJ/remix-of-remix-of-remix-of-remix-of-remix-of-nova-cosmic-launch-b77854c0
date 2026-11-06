import SEOHead from '@/components/SEOHead';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SEO_PAGES } from "@/config/seo";
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';
import { LEGAL_UPDATED } from '@/config/legal';

const CookiePolicy = () => {
  const { isEn } = useTranslation();

  const openCookieSettings = () => {
    window.dispatchEvent(new CustomEvent('openCookieSettings'));
  };

  return (
    <>
      <SEOHead {...SEO_PAGES["/politica-de-cookies"]} />
      <Navbar />
      <main id="contenido" className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-3">
            {isEn ? "Legal Information" : "Información legal"}
          </p>

          <h1 className="text-3xl font-bold mb-8">
            {isEn ? "Cookie Policy" : "Política de Cookies"}
          </h1>

          {isEn ? (
            /* REVISAR: US Cookie & tracking disclosure to be reviewed by counsel */
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. What are cookies?</h2>
                <p className="text-muted-foreground">
                  Cookies are small text files that websites store on your device when you visit. They help the website remember your preferences, provide security, understand how the site is used, and improve your overall experience.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Why do we use cookies?</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar browser storage technologies to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2">
                  <li>Ensure the essential technical operation and security of the website</li>
                  <li>Remember your preferences (such as cookie consent and user interface states)</li>
                  <li>Analyze aggregated website traffic to improve performance</li>
                  <li>Measure the effectiveness of our growth campaigns</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Categories of cookies we use</h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Strictly Necessary Cookies (Always Active)</h3>
                    <p className="text-muted-foreground text-sm">
                      Essential for core website functionality, authentication, and security. These cannot be disabled in our systems.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Analytics & Performance Cookies</h3>
                    <p className="text-muted-foreground text-sm">
                      Allow us to count visits and traffic sources so we can measure and improve the performance of our site.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Marketing & Attribution Cookies</h3>
                    <p className="text-muted-foreground text-sm">
                      Help us understand which referral sources bring visitors to our platform and evaluate advertising campaigns.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Managing Your Preferences</h2>
                <p className="text-muted-foreground mb-4">
                  You can change your cookie preferences at any time by clicking the button below:
                </p>
                <Button onClick={openCookieSettings} variant="outline">
                  Open Cookie Settings
                </Button>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Updates to this policy</h2>
                <p className="text-muted-foreground">
                  We may periodically update this Cookie Policy. Any updates will be posted directly to this page.
                </p>
                <p className="text-muted-foreground mt-2">
                  <strong>Last updated:</strong> {LEGAL_UPDATED}
                </p>
              </section>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. ¿Qué son las cookies?</h2>
                <p className="text-muted-foreground">
                  Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas. Sirven para recordar tus preferencias, mejorar tu experiencia de navegación y, en algunos casos, mostrar publicidad relevante.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. ¿Por qué usamos cookies?</h2>
                <p className="text-muted-foreground">
                  Utilizamos cookies para:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2">
                  <li>Garantizar el funcionamiento técnico de la web</li>
                  <li>Analizar cómo los usuarios navegan por nuestra web</li>
                  <li>Mostrar anuncios relevantes en otras plataformas</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Tipos de cookies que utilizamos</h2>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Cookies Necesarias (siempre activas)</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Imprescindibles para el funcionamiento básico de la web. No se pueden desactivar.
                  </p>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Cookies Analíticas</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Nos permiten analizar el uso de la web para medir y mejorar el rendimiento.
                  </p>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Cookies de Marketing</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Utilizadas para mostrar anuncios personalizados en otras plataformas y medir campañas.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Cómo gestionar las cookies</h2>
                <p className="text-muted-foreground mb-4">
                  Puedes configurar tus preferencias de cookies en cualquier momento pulsando el siguiente botón:
                </p>
                <Button onClick={openCookieSettings} variant="outline">
                  Configurar cookies
                </Button>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Modificaciones</h2>
                <p className="text-muted-foreground">
                  Esta política puede modificarse para adaptarse a novedades legislativas o cambios en los servicios.
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

export default CookiePolicy;
