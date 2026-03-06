import SEOHead from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CookiePolicy = () => {
  const openCookieSettings = () => {
    window.dispatchEvent(new CustomEvent('openCookieSettings'));
  };

  return (
    <>
    <SEOHead
      title="Política de Cookies | NOVA Marketing Solutions"
      description="Información sobre el uso de cookies en solutionsnova.es. Tipos de cookies, finalidad y cómo gestionarlas."
      path="/politica-de-cookies"
    />
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Política de Cookies</h1>
        
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
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Cookie</th>
                      <th className="p-2 text-left">Proveedor</th>
                      <th className="p-2 text-left">Finalidad</th>
                      <th className="p-2 text-left">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-2">cookie_consent</td>
                      <td className="p-2">Nova</td>
                      <td className="p-2">Guardar preferencias de cookies</td>
                      <td className="p-2">1 año</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2">sb-*</td>
                      <td className="p-2">Supabase</td>
                      <td className="p-2">Autenticación de usuarios</td>
                      <td className="p-2">Sesión</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Cookies Analíticas</h3>
              <p className="text-muted-foreground text-sm mb-2">
                Nos ayudan a entender cómo los usuarios interactúan con la web.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Cookie</th>
                      <th className="p-2 text-left">Proveedor</th>
                      <th className="p-2 text-left">Finalidad</th>
                      <th className="p-2 text-left">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-2">_ga</td>
                      <td className="p-2">Google Analytics</td>
                      <td className="p-2">Distinguir usuarios</td>
                      <td className="p-2">2 años</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2">_ga_*</td>
                      <td className="p-2">Google Analytics</td>
                      <td className="p-2">Mantener estado de sesión</td>
                      <td className="p-2">2 años</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Cookies de Marketing</h3>
              <p className="text-muted-foreground text-sm mb-2">
                Utilizadas para mostrar anuncios relevantes.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Cookie</th>
                      <th className="p-2 text-left">Proveedor</th>
                      <th className="p-2 text-left">Finalidad</th>
                      <th className="p-2 text-left">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-2">_gcl_*</td>
                      <td className="p-2">Google Ads</td>
                      <td className="p-2">Conversiones publicitarias</td>
                      <td className="p-2">90 días</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2">_fbp</td>
                      <td className="p-2">Meta (Facebook)</td>
                      <td className="p-2">Publicidad y remarketing</td>
                      <td className="p-2">90 días</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Cómo gestionar las cookies</h2>
            <p className="text-muted-foreground">
              Puedes cambiar tus preferencias de cookies en cualquier momento:
            </p>
            <Button 
              variant="outline" 
              onClick={openCookieSettings}
              className="mt-3"
            >
              Configurar cookies
            </Button>
            <p className="text-muted-foreground mt-4">
              También puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que esto puede afectar al funcionamiento de algunas partes de la web.
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 text-sm">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Actualizaciones</h2>
            <p className="text-muted-foreground">
              Esta política puede actualizarse. Te recomendamos revisarla periódicamente.
            </p>
            <p className="text-muted-foreground mt-2">
              <strong>Última actualización:</strong> Enero 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
