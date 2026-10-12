import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

const SectionHeader = ({ eyebrow, title, subtitle, align = 'center', className }: SectionHeaderProps) => (
  <div className={cn('mb-12', align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl', className)}>
    {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
    <h2 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">{title}</h2>
    {subtitle && <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{subtitle}</p>}
  </div>
);

export default SectionHeader;
