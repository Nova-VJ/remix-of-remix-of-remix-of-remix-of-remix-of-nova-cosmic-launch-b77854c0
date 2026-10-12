import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

const THEME_KEY = 'nova-theme';

interface ThemeToggleProps {
  className?: string;
  variant?: 'navbar' | 'floating';
}

const ThemeToggle = ({ className, variant = 'navbar' }: ThemeToggleProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // New key: the old one stored 'dark' for every past visitor, and the site is now light by default
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          "fixed bottom-4 left-4 z-50 p-2 rounded-full border border-border/50 bg-background/80 backdrop-blur-sm shadow-lg transition-all hover:scale-110",
          className
        )}
        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-foreground" />
        ) : (
          <Moon className="w-4 h-4 text-foreground" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-full border border-border/50 bg-muted/50 hover:bg-muted transition-colors",
        className
      )}
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-foreground" />
      ) : (
        <Moon className="w-4 h-4 text-foreground" />
      )}
    </button>
  );
};

export default ThemeToggle;
