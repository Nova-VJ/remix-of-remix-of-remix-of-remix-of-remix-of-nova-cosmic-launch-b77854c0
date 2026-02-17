import { 
  Power, 
  ClipboardList, 
  Brain, 
  Palette, 
  Code, 
  Settings, 
  Eye, 
  Pencil, 
  Megaphone, 
  Flag 
} from 'lucide-react';

export const PROJECT_STAGES = [
  {
    id: 'activation',
    title: 'Activación del proyecto',
    icon: Power,
    description: 'El servicio ha sido contratado y el proyecto se activa en el sistema.',
  },
  {
    id: 'brief',
    title: 'Brief recibido',
    icon: ClipboardList,
    description: 'Se recibe la información del cliente: objetivos, referencias, estilo, plataformas y necesidades.',
  },
  {
    id: 'strategy',
    title: 'Estrategia y planificación',
    icon: Brain,
    description: 'Se estructura la estrategia del proyecto, formatos, calendario y enfoque creativo.',
  },
  {
    id: 'design',
    title: 'Diseño creativo',
    icon: Palette,
    description: 'Se crean los diseños, guiones, copys, vídeos o piezas visuales.',
  },
  {
    id: 'development',
    title: 'Programación / Implementación',
    icon: Code,
    description: 'Se programa la web, app, landing, formularios o automatizaciones necesarias.',
  },
  {
    id: 'testing',
    title: 'Integración y pruebas',
    icon: Settings,
    description: 'Se prueban enlaces, formularios, flujos, rendimiento y compatibilidad.',
  },
  {
    id: 'review',
    title: 'Revisión del cliente',
    icon: Eye,
    description: 'El cliente revisa el material y da su feedback.',
  },
  {
    id: 'adjustments',
    title: 'Ajustes finales',
    icon: Pencil,
    description: 'Se aplican correcciones y mejoras solicitadas.',
  },
  {
    id: 'launch',
    title: 'Lanzamiento',
    icon: Megaphone,
    description: 'El proyecto se publica o se pone en marcha la campaña.',
  },
  {
    id: 'delivered',
    title: 'Proyecto entregado',
    icon: Flag,
    description: 'El proyecto se marca como finalizado y pasa a histórico.',
  },
];

interface ProjectFlowProps {
  currentStage: string;
  isActive: boolean;
  projectName?: string;
}

const ProjectFlow = ({ currentStage, isActive, projectName }: ProjectFlowProps) => {
  const currentStageIndex = PROJECT_STAGES.findIndex((s) => s.id === currentStage);

  if (!isActive || currentStage === 'inactive') {
    return (
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-bold text-foreground mb-4">Flujo del proyecto</h3>
        <div className="text-center py-8">
          <Power className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">No tienes proyectos activos en este momento.</p>
        </div>
        
        {/* Show inactive flow */}
        <div className="mt-6">
          {/* Desktop: Horizontal */}
          <div className="hidden md:flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {PROJECT_STAGES.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <div className="flex flex-col items-center min-w-[80px]">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <stage.icon className="w-5 h-5 text-muted-foreground/50" />
                  </div>
                  <span className="text-[10px] text-muted-foreground/50 text-center mt-1 max-w-[70px] truncate">
                    {stage.title}
                  </span>
                </div>
                {index < PROJECT_STAGES.length - 1 && (
                  <div className="w-6 h-0.5 bg-muted mx-1 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile: Vertical timeline */}
          <div className="md:hidden space-y-1">
            {PROJECT_STAGES.map((stage, index) => (
              <div key={stage.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <stage.icon className="w-4 h-4 text-muted-foreground/50" />
                  </div>
                  {index < PROJECT_STAGES.length - 1 && (
                    <div className="w-0.5 h-4 bg-muted" />
                  )}
                </div>
                <div className="pt-1.5">
                  <p className="text-xs text-muted-foreground/50 leading-tight">{stage.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground">Flujo del proyecto</h3>
        {projectName && (
          <span className="text-sm text-primary font-medium">{projectName}</span>
        )}
      </div>

      {/* Desktop: Horizontal */}
      <div className="hidden md:block overflow-x-auto pb-4">
        <div className="flex items-center min-w-max">
          {PROJECT_STAGES.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isFuture = index > currentStageIndex;

            return (
              <div key={stage.id} className="flex items-center">
                <div className="flex flex-col items-center min-w-[90px] group relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/40 ring-4 ring-primary/20'
                        : isCompleted
                        ? 'bg-primary/80 text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <stage.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] text-center mt-2 max-w-[80px] leading-tight ${
                      isCurrent
                        ? 'text-primary font-medium'
                        : isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {stage.title}
                  </span>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-popover text-popover-foreground text-xs p-2 rounded-lg shadow-lg max-w-[200px]">
                      {stage.description}
                    </div>
                  </div>
                </div>
                {index < PROJECT_STAGES.length - 1 && (
                  <div
                    className={`w-8 h-1 mx-1 rounded-full flex-shrink-0 ${
                      isCompleted ? 'bg-primary/80' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: Vertical timeline */}
      <div className="md:hidden space-y-0">
        {PROJECT_STAGES.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;

          return (
            <div key={stage.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/40 ring-2 ring-primary/20'
                      : isCompleted
                      ? 'bg-primary/80 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <stage.icon className="w-4 h-4" />
                </div>
                {index < PROJECT_STAGES.length - 1 && (
                  <div className={`w-0.5 h-6 ${isCompleted ? 'bg-primary/80' : 'bg-muted'}`} />
                )}
              </div>
              <div className="pt-2 pb-4">
                <p className={`text-sm font-medium leading-tight ${
                  isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {stage.title}
                </p>
                {isCurrent && (
                  <p className="text-xs text-muted-foreground mt-0.5">{stage.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectFlow;