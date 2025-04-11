
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { StoreSelector } from './StoreSelector';
import { useStores } from '@/contexts/StoreContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';

export function DashboardHeader() {
  const { currentStore } = useStores();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold text-lg">
            Voltz.checkout
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
