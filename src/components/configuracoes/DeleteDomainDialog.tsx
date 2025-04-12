
import React from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Domain } from '@/types/domain';
import { AlertTriangle } from 'lucide-react';

interface DeleteDomainDialogProps {
  domain: Domain;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteDomainDialog: React.FC<DeleteDomainDialogProps> = ({
  domain,
  isOpen,
  onConfirm,
  onCancel
}) => {
  const canDelete = !domain.inUse || domain.inUse === 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover Domínio</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o domínio <strong>{domain.type}.{domain.name}</strong>? 
            Essa ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!canDelete && (
          <div className="flex items-center text-red-500 text-sm mt-2 bg-red-50 dark:bg-red-950/30 p-3 rounded-md border border-red-200 dark:border-red-800">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>
              Este domínio está em uso em {domain.inUse} {domain.inUse === 1 ? 'checkout' : 'checkouts'}.
              Você precisa desconfigurá-lo antes de poder removê-lo.
            </span>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!canDelete}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
