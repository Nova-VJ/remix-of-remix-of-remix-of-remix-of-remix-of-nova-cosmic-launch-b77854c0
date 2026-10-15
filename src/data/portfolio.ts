// Projects shown in the "Proyectos" section of the home page.
// The section hides itself while this list is empty.
//
// To add a project:
//   1. Put a short screen recording in public/videos/ (MP4, H.264, ~1200 px wide,
//      no sound, 10–15 s) and a still frame next to it (.webp) for the poster.
//   2. Add an object like the ones below. `video` is optional: without it the
//      poster image is shown.

export interface PortfolioProject {
  id: string;
  /** Small label above the title */
  kind: string;
  title: string;
  description: string;
  /** What was built, shown as chips */
  highlights: string[];
  /** Still image (also the video poster) */
  poster: string;
  video?: string;
  /** Width / height of the media, for a stable layout */
  aspect: number;
  /** Text in the browser frame's address bar (never a real demo address) */
  frameLabel?: string;
  /** Visual frame around the media */
  frame: 'browser' | 'game';
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'valetos',
    kind: 'Plataforma SaaS · Tiempo real',
    title: 'ValetOS: el sistema operativo de un valet parking',
    description:
      'Coches, llaves, equipo, clientes y dinero en una sola plataforma. Cinco vistas conectadas que se actualizan al instante: supervisión, app del equipo en el móvil, portal del cliente por QR, finanzas y un asistente de IA que responde por texto o voz.',
    highlights: ['Web app + móvil', 'Tiempo real', 'Asistente con IA', 'Roles y permisos', 'Pagos y propinas'],
    poster: '/videos/valetos.webp',
    video: '/videos/valetos.mp4',
    aspect: 1200 / 750,
    frameLabel: 'valetos · panel de operaciones',
    frame: 'browser',
  },
  {
    id: 'freshpooch',
    kind: 'Web + portal de clientes · Servicios a domicilio',
    title: 'Un negocio de servicios, automatizado de punta a punta',
    description:
      'Presupuesto exacto en menos de 90 segundos, reserva online, portal del cliente con historial, app para el profesional en ruta, panel del dueño con ingresos y un concierge con IA bilingüe que vende 24/7.',
    highlights: ['Presupuesto instantáneo', 'Reservas', 'Portal del cliente', 'Panel del dueño', 'IA bilingüe'],
    poster: '/videos/freshpooch.webp',
    video: '/videos/freshpooch.mp4',
    aspect: 1200 / 750,
    frameLabel: 'reservas · portal de clientes',
    frame: 'browser',
  },
  {
    id: 'novasystem',
    kind: 'Software de gestión · Comercio minorista',
    title: 'NovaSystem: tienda, stock y contabilidad en un solo sitio',
    description:
      'Caja (TPV) con lector de código de barras, inventario con alertas de stock mínimo, clientes, proveedores, facturación con IVA español, gastos, informes y contabilidad con asientos del PGC. Preparado para sincronizarse con la tienda online.',
    highlights: ['TPV', 'Inventario en tiempo real', 'Facturación e IVA', 'Contabilidad PGC', 'Informes'],
    poster: '/videos/novasystem.webp',
    video: '/videos/novasystem.mp4',
    aspect: 1200 / 750,
    frameLabel: 'novasystem · gestión integral',
    frame: 'browser',
  },
  {
    id: 'cardgame',
    kind: 'Proyecto personal · Videojuego',
    title: 'Un juego de cartas estratégico, de la idea al tablero',
    description:
      'Dos facciones, héroes con poderes, tablero animado por turnos y un compendio para construir mazos. Diseño de juego, interfaz y lógica: la prueba de que también hacemos realidad proyectos personales.',
    highlights: ['Diseño de juego', 'Interfaz animada', 'Constructor de mazos', 'Lógica por turnos'],
    poster: '/videos/cardgame.webp',
    video: '/videos/cardgame.mp4',
    aspect: 1200 / 675,
    frame: 'game',
  },
];
