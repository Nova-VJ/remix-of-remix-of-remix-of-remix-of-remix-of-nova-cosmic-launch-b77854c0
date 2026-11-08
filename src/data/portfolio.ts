import { isEn } from '@/i18n';

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
  /** Small print under the chips (e.g. "example data") */
  note?: string;
  /** A real client's words about this project */
  testimonial?: { quote: string; name: string; business: string; photo?: string; rating: number };
}

const PROJECTS_ES: PortfolioProject[] = [
  {
    id: 'novasystem',
    kind: 'Software de gestión · Comercio minorista · Nueva versión',
    title: 'NovaStock: tu tienda, tu stock y tus cuentas, ahora también desde el móvil',
    description:
      'Caja (TPV) con lector de código de barras, inventario con alertas de stock mínimo, clientes, facturación con IVA español, informes y contabilidad con asientos del PGC. La nueva versión suma lo que más tiempo ahorra en el día a día: escanea los albaranes con el móvil y los productos entran solos en el inventario, compara proveedores cada semana para que compres mejor y te avisa antes de que algo se agote.',
    highlights: ['Nuevo: albaranes con el móvil', 'Nuevo: búsqueda de proveedores', 'Nuevo: previsión de stock', 'TPV', 'Facturación e IVA', 'Contabilidad PGC'],
    testimonial: {
      quote:
        'Desde que comencé a utilizar NovaStock puedo escanear los albaranes con mi móvil y agregarlos directamente al inventario, busco nuevos y mejores proveedores cada semana, controlo mi stock para ampliarlo y que nunca falte nada. ¡Es una maravilla!',
      name: 'Patricia Velasco',
      business: 'Ecoland',
      rating: 5,
    },
    poster: '/videos/novasystem.webp',
    video: '/videos/novasystem.mp4',
    aspect: 1200 / 750,
    frameLabel: 'novastock · gestión integral',
    frame: 'browser',
  },
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

// English texts for novasolutionsmkt.com (same projects, same media)
const EN: Record<string, Partial<PortfolioProject>> = {
  novasystem: {
    kind: 'Business software · Retail · New version',
    title: 'NovaStock: your store, your stock and your books, now from your phone too',
    description:
      'Point of sale with barcode scanner, inventory with low-stock alerts, customers, invoicing, reports and accounting. The new version adds what saves the most time day to day: scan delivery notes with your phone and the products go straight into your inventory, compare suppliers every week to buy better, and get alerted before anything runs out.',
    highlights: ['New: delivery notes from your phone', 'New: supplier search', 'New: stock forecasting', 'Point of sale', 'Invoicing', 'Accounting'],
    frameLabel: 'novastock · all-in-one management',
  },
  valetos: {
    kind: 'SaaS platform · Real time',
    title: 'ValetOS: the operating system for a valet parking business',
    description:
      'Cars, keys, staff, customers and money on one platform. Five connected views that update instantly: supervision, the team’s mobile app, a customer portal by QR code, finances and an AI assistant that answers by text or voice.',
    highlights: ['Web app + mobile', 'Real time', 'AI assistant', 'Roles & permissions', 'Payments & tips'],
    frameLabel: 'valetos · operations dashboard',
  },
  freshpooch: {
    kind: 'Website + client portal · Home services',
    title: 'A service business, automated end to end',
    description:
      'An exact quote in under 90 seconds, online booking, a client portal with full history, an app for the professional on the road, an owner dashboard with revenue and a bilingual AI concierge that sells 24/7.',
    highlights: ['Instant quotes', 'Bookings', 'Client portal', 'Owner dashboard', 'Bilingual AI'],
    frameLabel: 'bookings · client portal',
  },
  cardgame: {
    kind: 'Personal project · Video game',
    title: 'A strategy card game, from idea to game board',
    description:
      'Two factions, heroes with powers, an animated turn-based board and a compendium to build decks. Game design, interface and logic: proof that we also bring personal projects to life.',
    highlights: ['Game design', 'Animated interface', 'Deck builder', 'Turn-based logic'],
  },
};

export const getPortfolioProjects = (en: boolean): PortfolioProject[] =>
  en
    ? PROJECTS_ES.map((p) => ({
        ...p,
        ...EN[p.id],
        // Real client words, translated; the original Spanish stays on solutionsnova.es
        testimonial: p.testimonial && {
          ...p.testimonial,
          quote:
            'Since I started using NovaStock I can scan delivery notes with my phone and add them straight to my inventory, I find new and better suppliers every week, and I keep my stock under control so I can grow it and never run out of anything. It’s wonderful! (translated from Spanish)',
        },
      }))
    : PROJECTS_ES;

export const PORTFOLIO_PROJECTS: PortfolioProject[] = getPortfolioProjects(isEn);
