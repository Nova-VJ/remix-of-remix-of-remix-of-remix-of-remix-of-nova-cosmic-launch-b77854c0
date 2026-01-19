import { Folder, Rocket, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const EmptyProjectsState = () => {
  return (
    <Card className="glass-card border-border/50 overflow-hidden animate-fade-in">
      <CardContent className="py-16 px-6">
        <div className="flex flex-col items-center text-center max-w-md mx-auto space-y-6">
          {/* Animated illustration */}
          <div className="relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-150 animate-pulse" />
            
            {/* Main icon container */}
            <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
              <Folder className="w-16 h-16 text-primary/60" />
              
              {/* Floating decorative elements */}
              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30 animate-[bounce_2s_ease-in-out_infinite]">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              
              <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center animate-[bounce_2.5s_ease-in-out_infinite_0.5s]">
                <Rocket className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              No tienes proyectos activos
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              ¡Es el momento perfecto para dar el primer paso! Solicita un presupuesto 
              y comienza a transformar tu idea en realidad.
            </p>
          </div>

          {/* CTA Button */}
          <Link to="/#services">
            <Button className="gap-2 group">
              Explorar servicios
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          {/* Additional info */}
          <div className="pt-4 border-t border-border/50 w-full">
            <p className="text-xs text-muted-foreground">
              ¿Tienes un presupuesto pendiente? Revisa la pestaña 
              <span className="text-primary font-medium"> Presupuestos</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyProjectsState;
