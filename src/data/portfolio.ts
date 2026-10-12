// Trabajos propios que aparecen en la sección "Trabajos" de la portada.
// La sección se oculta sola mientras esta lista esté vacía.
//
// Para añadir un proyecto:
//   1. Guarda una captura (1600x1000 aprox., .webp o .jpg) en public/images/trabajos/
//   2. Añade un objeto como este:
//      {
//        title: 'Clínica Ejemplo',
//        category: 'Web + SEO',
//        description: 'Web nueva con reservas online y posicionamiento local.',
//        image: '/images/trabajos/clinica-ejemplo.webp',
//        url: 'https://clinica-ejemplo.es', // opcional
//      },

export interface PortfolioProject {
  title: string;
  category: string;
  description: string;
  image: string;
  url?: string;
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [];
