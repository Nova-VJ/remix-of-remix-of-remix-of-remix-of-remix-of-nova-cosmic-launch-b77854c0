import type { LucideIcon } from 'lucide-react';
import {
  Building2, Calculator, Car, ConciergeBell, Dumbbell, Flower2, Hammer, KeyRound, Leaf,
  PawPrint, Scale, Scissors, Smile, SprayCan, Stethoscope, Utensils, Wrench,
} from 'lucide-react';
import { L } from '@/i18n';

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
  { carpeta: 'clinica-dental', sector: L('Clínica dental', 'Dental clinic'), icon: Smile },
  { carpeta: 'clinica-medica', sector: L('Clínica médica', 'Medical clinic'), icon: Stethoscope },
  { carpeta: 'medicina-estetica', sector: L('Medicina estética', 'Aesthetic medicine'), icon: Flower2 },
  { carpeta: 'peluqueria', sector: L('Peluquería', 'Hair salon'), icon: Scissors },
  { carpeta: 'gimnasio', sector: L('Gimnasio', 'Gym'), icon: Dumbbell },
  { carpeta: 'restaurante', sector: L('Restaurante', 'Restaurant'), icon: Utensils },
  { carpeta: 'inmobiliaria', sector: L('Inmobiliaria', 'Real estate'), icon: KeyRound },
  { carpeta: 'administracion-fincas', sector: L('Administración de fincas', 'Property management'), icon: Building2 },
  { carpeta: 'abogados', sector: L('Abogados', 'Law firm'), icon: Scale },
  { carpeta: 'asesoria', sector: L('Asesoría', 'Accounting firm'), icon: Calculator },
  { carpeta: 'reformas', sector: L('Reformas', 'Remodeling'), icon: Hammer },
  { carpeta: 'oficios-hogar', sector: L('Servicios del hogar', 'Home services'), icon: Wrench },
  { carpeta: 'jardineria', sector: L('Jardinería', 'Landscaping'), icon: Leaf },
  { carpeta: 'limpieza', sector: L('Limpieza', 'Cleaning'), icon: SprayCan },
  { carpeta: 'taller', sector: L('Taller mecánico', 'Auto repair'), icon: Car },
  { carpeta: 'veterinaria', sector: L('Veterinaria', 'Veterinary clinic'), icon: PawPrint },
  { carpeta: 'hotel', sector: L('Hotel', 'Hotel'), icon: ConciergeBell },
];
