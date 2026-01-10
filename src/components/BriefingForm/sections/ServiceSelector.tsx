import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { SERVICE_NAMES, ServiceType } from '../types';
import { Palette, Globe, Smartphone, Share2, FileEdit } from 'lucide-react';

interface ServiceSelectorProps {
  selected: string[];
  onChange: (services: string[]) => void;
  preselected?: string[];
}

const serviceIcons: Record<ServiceType, React.ReactNode> = {
  branding: <Palette className="w-5 h-5" />,
  web: <Globe className="w-5 h-5" />,
  apps: <Smartphone className="w-5 h-5" />,
  rrss: <Share2 className="w-5 h-5" />,
  content: <FileEdit className="w-5 h-5" />,
};

const ServiceSelector = ({ selected, onChange, preselected = [] }: ServiceSelectorProps) => {
  const handleToggle = (service: string) => {
    if (selected.includes(service)) {
      onChange(selected.filter(s => s !== service));
    } else {
      onChange([...selected, service]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground">¿Qué servicios te interesan?</h3>
        <p className="text-sm text-muted-foreground">Selecciona uno o varios</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(SERVICE_NAMES) as ServiceType[]).map((key) => {
          const isSelected = selected.includes(key);
          const isPreselected = preselected.includes(key);
          
          return (
            <div
              key={key}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
                }
              `}
              onClick={() => handleToggle(key)}
            >
              <Checkbox
                id={`service-${key}`}
                checked={isSelected}
                onCheckedChange={() => handleToggle(key)}
                className="absolute top-2 right-2"
              />
              <div className={`p-2 rounded-full ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {serviceIcons[key]}
              </div>
              <Label 
                htmlFor={`service-${key}`}
                className={`text-sm font-medium cursor-pointer text-center ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {SERVICE_NAMES[key]}
              </Label>
              {isPreselected && (
                <span className="text-xs text-primary">En tu carrito</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelector;
