import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>
        
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Responsable del Tratamiento</h2>
            <ul className="list-none space-y-1 text-muted-foreground">
              <li><strong>NIF:</strong> 71164077F</li>
              <li><strong>Dirección:</strong> Calle Recondo 7</li>
              <li><strong>Email:</strong> info@solutionsnova.es</li>
              <li><strong>Nombre comercial:</strong> Nova Marketing Solutions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Datos que Recogemos</h2>
            <p className="text-muted-foreground">
              Recogemos los datos que nos proporcionas voluntariamente a través de:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2">
              <li>Formularios de contacto (nombre, email, teléfono, mensaje)</li>
              <li>Solicitudes de presupuesto</li>
              <li>Registro de cuenta en nuestro portal</li>
              <li>Contacto por WhatsApp o email</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Finalidad del Tratamiento</h2>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Responder a tus solicitudes y consultas</li>
              <li>Enviarte presupuestos personalizados</li>
              <li>Gestionar la relación comercial si contratas nuestros servicios</li>
              <li>Proporcionarte soporte técnico</li>
              <li>Permitirte acceder al portal de cliente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Base Jurídica</h2>
            <ul className="list-disc list-inside text-muted-foreground">
              <li><strong>Consentimiento:</strong> Al enviar formularios o contactarnos</li>
              <li><strong>Ejecución de contrato:</strong> Para gestionar servicios contratados</li>
              <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Conservación de Datos</h2>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Solicitudes de contacto: hasta 12 meses si no hay relación comercial</li>
              <li>Datos de clientes: durante la relación comercial + plazo legal</li>
              <li>Datos de facturación: 6 años (obligación fiscal)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. Destinatarios y Encargados</h2>
            <p className="text-muted-foreground">Tus datos pueden ser tratados por:</p>
            <ul className="list-disc list-inside text-muted-foreground mt-2">
              <li><strong>Cloudflare:</strong> Infraestructura y CDN</li>
              <li><strong>Supabase:</strong> Base de datos y autenticación</li>
              <li><strong>Google Analytics:</strong> Analítica web (si aceptas cookies)</li>
              <li><strong>Meta (Facebook/Instagram):</strong> Publicidad (si aceptas cookies)</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              Algunos de estos proveedores pueden estar fuera del EEE, pero cuentan con garantías adecuadas (Cláusulas Contractuales Tipo, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. Tus Derechos (ARSULIPO)</h2>
            <p className="text-muted-foreground">Puedes ejercer los siguientes derechos:</p>
            <ul className="list-disc list-inside text-muted-foreground mt-2">
              <li><strong>Acceso:</strong> Saber qué datos tenemos sobre ti</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos</li>
              <li><strong>Supresión:</strong> Eliminar tus datos</li>
              <li><strong>Limitación:</strong> Restringir el tratamiento</li>
              <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
              <li><strong>Oposición:</strong> Oponerte al tratamiento</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              Para ejercer estos derechos, contacta con nosotros en <strong>info@solutionsnova.es</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. Reclamaciones</h2>
            <p className="text-muted-foreground">
              Si consideras que no hemos tratado tus datos correctamente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD): <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aepd.es</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">9. Menores</h2>
            <p className="text-muted-foreground">
              Nuestros servicios no están dirigidos a menores de 18 años. No recogemos datos de menores intencionadamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">10. Actualizaciones</h2>
            <p className="text-muted-foreground">
              Esta política puede actualizarse. Te recomendamos revisarla periódicamente.
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

export default PrivacyPolicy;
