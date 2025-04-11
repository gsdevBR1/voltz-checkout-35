
import React from 'react';
import { useStores, Store } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

interface DeleteStoreDialogProps {
  store: Store;
}

export function DeleteStoreDialog({ store }: DeleteStoreDialogProps) {
  const { deleteStore } = useStores();
  const [open, setOpen] = React.useState(false);

  const handleDelete = () => {
    deleteStore(store.id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Excluir loja</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir loja</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a loja "{store.name}"?
            {store.isDemo && (
              <div className="mt-2 text-amber-600 bg-amber-50 p-2 rounded-md">
                <strong>Atenção:</strong> Excluindo a loja de demonstração, não será possível recriá-la posteriormente.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
