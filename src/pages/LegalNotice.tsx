import SEOHead from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LegalNotice = () => {
  return (
    <>
    <SEOHead
      title="Aviso Legal | NOVA Marketing Solutions"
      description="Aviso legal y condiciones de uso del sitio web solutionsnova.es. Información legal conforme a la LSSI-CE."
      path="/aviso-legal"
    />
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Aviso Legal</h1>
        
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Datos Identificativos</h2>
            <p className="text-muted-foreground">
              En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, se exponen los siguientes datos:
            </p>
            <ul className="list-none space-y-1 text-muted-foreground mt-3">
              <li><strong>NIF:</strong> 71164077F</li>
              <li><strong>Domicilio:</strong> Calle Recondo 7</li>
              <li><strong>Email:</strong> info@solutionsnova.es</li>
              <li><strong>Nombre comercial:</strong> Nova Marketing Solutions</li>
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
              <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
