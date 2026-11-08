import type { LucideIcon } from 'lucide-react';
import {
  Building2, Calculator, Car, ConciergeBell, Dumbbell, Flower2, Hammer, KeyRound, Leaf,
  PawPrint, Scale, Scissors, Smile, SprayCan, Stethoscope, Utensils, Wrench,
} from 'lucide-react';
import { isEn } from '@/i18n';

// Demos por sector publicadas en /demos (páginas estáticas de public/demos).
// Los negocios son ficticios y cada demo lo dice arriba. La foto es /demos/comun/fondos/<carpeta>.webp, creada con IA.
// Súbelo cuando se cambie alguna foto, para que nadie siga viendo la anterior guardada en su navegador.
export const FOTOS_VERSION = 2;

export interface SectorDemo {
  carpeta: string;
  sector: string;
  icon: LucideIcon;
}

const DEMOS_RAW = [
  { carpeta: 'clinica-dental', es: 'Clínica dental', en: 'Dental Clinic', icon: Smile },
  { carpeta: 'clinica-medica', es: 'Clínica médica', en: 'Medical Clinic', icon: Stethoscope },
  { carpeta: 'medicina-estetica', es: 'Medicina estética', en: 'Aesthetic Medicine', icon: Flower2 },
  { carpeta: 'peluqueria', es: 'Peluquería', en: 'Hair Salon', icon: Scissors },
  { carpeta: 'gimnasio', es: 'Gimnasio', en: 'Gym & Fitness', icon: Dumbbell },
  { carpeta: 'restaurante', es: 'Restaurante', en: 'Restaurant', icon: Utensils },
  { carpeta: 'inmobiliaria', es: 'Inmobiliaria', en: 'Real Estate', icon: KeyRound },
  { carpeta: 'administracion-fincas', es: 'Administración de fincas', en: 'Property Management', icon: Building2 },
  { carpeta: 'abogados', es: 'Abogados', en: 'Law Firm', icon: Scale },
  { carpeta: 'asesoria', es: 'Asesoría', en: 'Accounting Firm', icon: Calculator },
  { carpeta: 'reformas', es: 'Reformas', en: 'Home Remodeling', icon: Hammer },
  { carpeta: 'oficios-hogar', es: 'Servicios del hogar', en: 'Home Services', icon: Wrench },
  { carpeta: 'jardineria', es: 'Jardinería', en: 'Landscaping', icon: Leaf },
  { carpeta: 'limpieza', es: 'Limpieza', en: 'Cleaning Services', icon: SprayCan },
  { carpeta: 'taller', es: 'Taller mecánico', en: 'Auto Repair', icon: Car },
  { carpeta: 'veterinaria', es: 'Veterinaria', en: 'Veterinary Clinic', icon: PawPrint },
  { carpeta: 'hotel', es: 'Hotel', en: 'Hotel & Hospitality', icon: ConciergeBell },
];

export const getSectorDemos = (en: boolean): SectorDemo[] =>
  DEMOS_RAW.map((d) => ({
    carpeta: d.carpeta,
    sector: en ? d.en : d.es,
    icon: d.icon,
  }));

export const SECTOR_DEMOS: SectorDemo[] = getSectorDemos(isEn);
