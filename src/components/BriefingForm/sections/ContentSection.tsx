import QuestionField from '../QuestionField';
import { FormData } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface ContentSectionProps {
  formData: ContentFormData;
  onChange: (field: keyof ContentFormData, value: string | string[]) => void;
}

export interface ContentFormData {
  platforms: string[];
  goal: string;
  service_type: string;
  style: string[];
  details: string;
  links: string;
  budget: string;
}

const platformOptions = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'web', label: 'Página web' },
  { value: 'app', label: 'App' },
  { value: 'ads', label: 'Publicidad (Meta/Google/TikTok Ads)' },
  { value: 'otro', label: 'Otro' },
];

const goalOptions = [
  { value: 'vender', label: 'Vender más' },
  { value: 'seguidores', label: 'Aumentar seguidores' },
  { value: 'imagen', label: 'Mejorar imagen de marca' },
  { value: 'lanzamiento', label: 'Lanzar producto/servicio' },
  { value: 'autoridad', label: 'Crear autoridad' },
  { value: 'otro', label: 'Otro' },
];

const serviceTypeOptions = [
  { value: 'puntual', label: 'Contenido puntual' },
  { value: 'mensual', label: 'Contenido mensual' },
];

const styleOptions = [
  { value: 'profesional', label: 'Profesional' },
  { value: 'creativo', label: 'Creativo' },
  { value: 'minimalista', label: 'Minimalista' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'divertido', label: 'Divertido' },
  { value: 'inspiracional', label: 'Inspiracional' },
  { value: 'tecnologico', label: 'Tecnológico / moderno' },
];

const budgetOptions = [
  { value: 'definir', label: 'A definir' },
  { value: 'basico', label: 'Básico' },
  { value: 'medio', label: 'Medio' },
  { value: 'premium', label: 'Premium' },
];

const ContentSection = ({ formData, onChange }: ContentSectionProps) => {
  const handleMultiSelect = (field: 'platforms' | 'style', value: string) => {
    const currentValues = formData[field] || [];
    if (currentValues.includes(value)) {
      onChange(field, currentValues.filter((v) => v !== value));
    } else {
      onChange(field, [...currentValues, value]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Platforms - MULTISELECT */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Plataforma(s) *</Label>
        <p className="text-xs text-muted-foreground">Selecciona una o varias</p>
        <div className="grid grid-cols-2 gap-2">
          {platformOptions.map((option) => (
            <div
              key={option.value}
              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                formData.platforms?.includes(option.value)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleMultiSelect('platforms', option.value)}
            >
              <Checkbox
                checked={formData.platforms?.includes(option.value)}
                onCheckedChange={() => handleMultiSelect('platforms', option.value)}
              />
              <span className="text-sm text-foreground">{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Goal - SINGLE */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Objetivo principal *</Label>
        <div className="grid grid-cols-2 gap-2">
          {goalOptions.map((option) => (
            <div
              key={option.value}
              className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                formData.goal === option.value
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border hover:border-primary/50 text-muted-foreground'
              }`}
              onClick={() => onChange('goal', option.value)}
            >
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Service Type - SINGLE */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Tipo de servicio *</Label>
        <div className="grid grid-cols-2 gap-2">
          {serviceTypeOptions.map((option) => (
            <div
              key={option.value}
              className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                formData.service_type === option.value
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border hover:border-primary/50 text-muted-foreground'
              }`}
              onClick={() => onChange('service_type', option.value)}
            >
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Style - MULTISELECT */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Estilo preferido</Label>
        <p className="text-xs text-muted-foreground">Selecciona uno o varios</p>
        <div className="grid grid-cols-2 gap-2">
          {styleOptions.map((option) => (
            <div
              key={option.value}
              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                formData.style?.includes(option.value)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleMultiSelect('style', option.value)}
            >
              <Checkbox
                checked={formData.style?.includes(option.value)}
                onCheckedChange={() => handleMultiSelect('style', option.value)}
              />
              <span className="text-sm text-foreground">{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Details - TEXTAREA */}
      <div className="space-y-2">
        <Label className="text-foreground font-medium">Detalles adicionales</Label>
        <Textarea
          value={formData.details || ''}
          onChange={(e) => onChange('details', e.target.value)}
          placeholder="Cuéntanos tu idea, referencias, competencia, tonos, colores, ejemplos…"
          className="min-h-[100px]"
        />
      </div>

      {/* Links - INPUT */}
      <div className="space-y-2">
        <Label className="text-foreground font-medium">Enlaces de referencia (opcional)</Label>
        <Input
          value={formData.links || ''}
          onChange={(e) => onChange('links', e.target.value)}
          placeholder="URLs de ejemplos, competencia, inspiración..."
        />
      </div>

      {/* Budget - SINGLE */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Presupuesto</Label>
        <div className="grid grid-cols-2 gap-2">
          {budgetOptions.map((option) => (
            <div
              key={option.value}
              className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                formData.budget === option.value
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border hover:border-primary/50 text-muted-foreground'
              }`}
              onClick={() => onChange('budget', option.value)}
            >
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentSection;