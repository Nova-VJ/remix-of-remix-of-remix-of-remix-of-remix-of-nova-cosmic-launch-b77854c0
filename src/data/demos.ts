import type { LucideIcon } from 'lucide-react';
import {
  Building2, Calculator, Car, ConciergeBell, Dumbbell, Flower2, Hammer, KeyRound, Leaf,
  PawPrint, Scale, Scissors, Smile, SprayCan, Stethoscope, Utensils, Wrench,
} from 'lucide-react';

// Demos por sector publicadas en /demos (páginas estáticas de public/demos, generadas en Nova-VJ/LupaNova → demos/).
// Los negocios son ficticios y cada demo lo dice arriba. La foto es /demos/comun/fondos/<carpeta>.webp, creada con IA.
// Súbelo cuando se cambie alguna foto, para que nadie siga viendo la anterior guardada en su navegador.
export const FOTOS_VERSION = 2;

export interface SectorDemo {
  carpeta: string;
  sector: string;
  icon: LucideIcon;
}

export const SECTOR_DEMOS: SectorDemo[] = [
  { carpeta: 'clinica-dental', sector: 'Clínica dental', icon: Smile },
  { carpeta: 'clinica-medica', sector: 'Clínica médica', icon: Stethoscope },
  { carpeta: 'medicina-estetica', sector: 'Medicina estética', icon: Flower2 },
  { carpeta: 'peluqueria', sector: 'Peluquería', icon: Scissors },
  { carpeta: 'gimnasio', sector: 'Gimnasio', icon: Dumbbell },
  { carpeta: 'restaurante', sector: 'Restaurante', icon: Utensils },
  { carpeta: 'inmobiliaria', sector: 'Inmobiliaria', icon: KeyRound },
  { carpeta: 'administracion-fincas', sector: 'Administración de fincas', icon: Building2 },
  { carpeta: 'abogados', sector: 'Abogados', icon: Scale },
  { carpeta: 'asesoria', sector: 'Asesoría', icon: Calculator },
  { carpeta: 'reformas', sector: 'Reformas', icon: Hammer },
  { carpeta: 'oficios-hogar', sector: 'Servicios del hogar', icon: Wrench },
  { carpeta: 'jardineria', sector: 'Jardinería', icon: Leaf },
  { carpeta: 'limpieza', sector: 'Limpieza', icon: SprayCan },
  { carpeta: 'taller', sector: 'Taller mecánico', icon: Car },
  { carpeta: 'veterinaria', sector: 'Veterinaria', icon: PawPrint },
  { carpeta: 'hotel', sector: 'Hotel', icon: ConciergeBell },
];
