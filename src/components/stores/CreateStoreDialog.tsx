
import React, { useState } from 'react';
import { useStores } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface CreateStoreDialogProps {
  className?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function CreateStoreDialog({ className, buttonVariant = "default" }: CreateStoreDialogProps) {
  const { addStore } = useStores();
  const [isOpen, setIsOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [storeNameError, setStoreNameError] = useState('');

  const handleCreateStore = () => {
    if (!newStoreName.trim()) {
      setStoreNameError('O nome da loja é obrigatório');
      return;
    }
    
    addStore(newStoreName.trim());
    setNewStoreName('');
    setStoreNameError('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          className={`bg-[#2BBA00] hover:bg-[#249a00] text-white flex items-center gap-2 ${className}`}
        >
          <Plus className="h-4 w-4" />
          <span>Criar Nova Loja</span>
        </Button>
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateStore}
            className="bg-[#2BBA00] hover:bg-[#249a00]"
          >
            Criar loja
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
