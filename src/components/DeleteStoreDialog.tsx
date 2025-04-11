
import React from 'react';
import { useStores, Store } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-full"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Excluir loja</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir loja</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a loja "{store.name}"?
            {store.isDemo && (
              <div className="mt-2 text-amber-600 bg-amber-50 p-2 rounded-md">
                <strong>Atenção:</strong> A loja de demonstração não pode ser excluída.
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
