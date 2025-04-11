
import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { StoreSelector } from './StoreSelector';
import { useStores } from '@/contexts/StoreContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Store, Settings } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

export function DashboardHeader({ onCustomizeClick }: { onCustomizeClick?: () => void }) {
  const { currentStore } = useStores();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // State to handle logo transition
  const [isLogoTransitioning, setIsLogoTransitioning] = useState(false);
  const [visibleLogo, setVisibleLogo] = useState<"light" | "dark">(isDarkMode ? "dark" : "light");
  
  // Effect to handle logo transition when theme changes
  useEffect(() => {
    const targetLogo = isDarkMode ? "dark" : "light";
    if (visibleLogo !== targetLogo) {
      setIsLogoTransitioning(true);
      const timer = setTimeout(() => {
        setVisibleLogo(targetLogo);
        setTimeout(() => {
          setIsLogoTransitioning(false);
        }, 50);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isDarkMode, visibleLogo]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 relative h-10 w-10">
            <div className="relative w-full h-full">
              <img 
                src="/lovable-uploads/3aa07f77-7311-4155-8e6c-39abb8dca3df.png" 
                alt="Voltz.Checkout Logo" 
                className={cn(
                  "h-10 w-10 absolute top-0 left-0 transition-opacity duration-300 ease-in-out",
                  visibleLogo === "light" && !isLogoTransitioning ? "opacity-100" : "opacity-0"
                )}
              />
              <img 
                src="/lovable-uploads/6e7ee63b-0326-4a37-bc3f-0e31d8324441.png" 
                alt="Voltz.Checkout Logo (Dark Mode)" 
                className={cn(
                  "h-10 w-10 absolute top-0 left-0 transition-opacity duration-300 ease-in-out",
                  visibleLogo === "dark" && !isLogoTransitioning ? "opacity-100" : "opacity-0"
                )}
              />
            </div>
          </Link>
          
          {currentStore?.isDemo && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Demonstração
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/stores" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Gerenciar Lojas</span>
            </Link>
          </Button>
          
          <ThemeToggle />
          
          <StoreSelector />
          
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">
              {currentStore?.name.substring(0, 2).toUpperCase() || "LC"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {currentStore?.isDemo && (
        <div className="w-full bg-amber-50 border-b border-amber-200 py-2 px-4 text-amber-800 text-sm text-center">
          ⚠️ Esta é uma loja de demonstração. Nenhuma transação real será realizada. 
          <Link to="/stores" className="underline font-medium ml-1">
            Crie sua loja real clicando aqui
          </Link>.
        </div>
      )}
    </header>
  );
}
