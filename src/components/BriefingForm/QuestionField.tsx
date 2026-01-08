import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface QuestionFieldProps {
  label: string;
  name: string;
  options: string[];
  value: string;
  otroValue: string;
  onChange: (name: string, value: string) => void;
  useTextarea?: boolean;
}

const QuestionField = ({ 
  label, 
  name, 
  options, 
  value, 
  otroValue, 
  onChange,
  useTextarea = false 
}: QuestionFieldProps) => {
  const isOtro = value === 'Otro';
  const otroName = `${name}_otro`;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(name, val)}
        className="grid grid-cols-2 gap-2"
      >
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`${name}-${option}`} />
            <Label 
              htmlFor={`${name}-${option}`} 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              {option}
            </Label>
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Otro" id={`${name}-otro`} />
          <Label 
            htmlFor={`${name}-otro`} 
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Otro (especifica)
          </Label>
        </div>
      </RadioGroup>
      
      {isOtro && (
        useTextarea ? (
          <Textarea
            name={otroName}
            value={otroValue}
            onChange={(e) => onChange(otroName, e.target.value)}
            placeholder="Especifica aquí..."
            className="mt-2"
          />
        ) : (
          <Input
            name={otroName}
            value={otroValue}
            onChange={(e) => onChange(otroName, e.target.value)}
            placeholder="Especifica aquí..."
            className="mt-2"
          />
        )
      )}
    </div>
  );
};

export default QuestionField;
