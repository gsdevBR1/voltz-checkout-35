
import React, { useState } from 'react';
import { useStores } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Store, 
  AlertTriangle, 
  ChevronDown, 
  CheckCircle, 
  Clock, 
  X, 
  ExternalLink 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Store as StoreType } from '@/contexts/StoreContext';

export function StoreSelector() {
  const { stores, currentStore, setCurrentStore, addStore } = useStores();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [storeNameError, setStoreNameError] = useState('');

  const handleStoreChange = (store: StoreType) => {
    setCurrentStore(store);
  };

  const handleCreateStore = () => {
    if (!newStoreName.trim()) {
      setStoreNameError('O nome da loja é obrigatório');
      return;
    }
    
    addStore(newStoreName.trim());
    setNewStoreName('');
    setStoreNameError('');
    setIsDialogOpen(false);
  };

  const getStoreStatusIcon = (store: StoreType) => {
    if (store.isDemo) {
      return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
    }
    
    const steps = Object.values(store.status);
    const completedSteps = steps.filter(Boolean).length;
    
    if (completedSteps === steps.length) {
      return <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />;
    } else if (completedSteps > 0) {
      return <Clock className="h-4 w-4 text-blue-500 shrink-0" />;
    } else {
      return <X className="h-4 w-4 text-gray-500 shrink-0" />;
    }
  };

  const getStoreStatusLabel = (store: StoreType) => {
    if (store.isDemo) {
      return <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Demo</span>;
    }
    
    const steps = Object.values(store.status);
    const completedSteps = steps.filter(Boolean).length;
    
    if (completedSteps === steps.length) {
      return <span className="ml-auto text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Ativa</span>;
    } else if (completedSteps > 0) {
      return <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Incompleta</span>;
    } else {
      return <span className="ml-auto text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">Nova</span>;
    }
  };

  if (!currentStore) return null;

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-auto flex items-center gap-2 px-3 py-2 border-dashed">
            {currentStore.isDemo ? (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            ) : (
              <Store className="h-4 w-4" />
            )}
            <span className="font-medium truncate max-w-[150px]">{currentStore.name}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <div className="py-2 px-3">
            <div className="text-sm font-medium">Suas lojas</div>
            <div className="text-xs text-muted-foreground">Selecione ou crie uma loja</div>
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-[260px] overflow-y-auto">
            {stores.map((store) => (
              <DropdownMenuItem 
                key={store.id} 
                className="cursor-pointer flex items-center gap-2 py-2"
                onSelect={() => handleStoreChange(store)}
              >
                {getStoreStatusIcon(store)}
                <span className="truncate font-medium">{store.name}</span>
                {getStoreStatusLabel(store)}
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem 
                className="cursor-pointer flex items-center gap-2 py-2 text-primary"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <Plus className="h-4 w-4 shrink-0" />
                <span>Criar nova loja</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar nova loja</DialogTitle>
                <DialogDescription>
                  Crie uma nova loja para seus produtos e configurações.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="store-name">Nome da loja</Label>
                  <Input
                    id="store-name"
                    placeholder="Digite o nome da sua loja"
                    value={newStoreName}
                    onChange={(e) => {
                      setNewStoreName(e.target.value);
                      if (e.target.value.trim()) setStoreNameError('');
                    }}
                    className={storeNameError ? "border-destructive" : ""}
                  />
                  {storeNameError && (
                    <p className="text-sm text-destructive">{storeNameError}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateStore}>
                  Criar loja
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Link to="/stores" className="block">
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 py-2">
              <ExternalLink className="h-4 w-4 shrink-0" />
              <span>Ver todas as lojas</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {currentStore.isDemo && (
        <div className="mt-1 fixed top-16 left-0 right-0 z-10 bg-amber-50 border-b border-amber-200 py-2 px-4 text-amber-800 text-sm text-center">
          ⚠️ Esta é uma loja de demonstração. Para começar a vender, <Link to="/stores" className="underline font-medium">crie sua loja real clicando aqui</Link>.
        </div>
      )}
    </div>
  );
}
