
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
import { Webhook } from '@/types/webhook';
import { AlertTriangle } from 'lucide-react';

interface DeleteWebhookDialogProps {
  webhook: Webhook;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteWebhookDialog: React.FC<DeleteWebhookDialogProps> = ({
  webhook,
  isOpen,
  onConfirm,
  onCancel
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover Webhook</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o webhook <strong>{webhook.name}</strong>? 
            Essa ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
