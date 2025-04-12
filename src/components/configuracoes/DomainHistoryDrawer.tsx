
import React from 'react';
import { format } from 'date-fns';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Domain, DomainHistoryEvent } from '@/types/domain';
import { PlusCircle, CheckCircle2, ShieldCheck, Edit, XCircle } from 'lucide-react';

interface DomainHistoryDrawerProps {
  domain: Domain;
  open: boolean;
  onClose: () => void;
}

export const DomainHistoryDrawer: React.FC<DomainHistoryDrawerProps> = ({
  domain,
  open,
  onClose
}) => {
  // Create a history array if it doesn't exist
  const history = domain.history || [
    {
      id: '1',
      type: 'added',
      timestamp: domain.createdAt,
      details: `Domínio ${domain.name} adicionado`
    }
  ];

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "dd/MM/yyyy HH:mm");
    } catch {
      return 'Data inválida';
    }
  };

  const getEventIcon = (type: DomainHistoryEvent['type']) => {
    switch (type) {
      case 'added':
        return <PlusCircle className="h-5 w-5 text-blue-500" />;
      case 'dns_verified':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'ssl_issued':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      case 'name_changed':
        return <Edit className="h-5 w-5 text-amber-500" />;
      case 'validation_failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <PlusCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getEventDescription = (event: DomainHistoryEvent) => {
    switch (event.type) {
      case 'added':
        return 'Domínio adicionado';
      case 'dns_verified':
        return 'Validação DNS concluída';
      case 'ssl_issued':
        return 'SSL emitido';
      case 'name_changed':
        return event.details || 'Nome alterado';
      case 'validation_failed':
        return 'Validação falhou';
      default:
        return event.details || 'Evento';
    }
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Histórico do Domínio</DrawerTitle>
          <DrawerDescription>
            {domain.type}.{domain.name}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2">
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhum histórico registrado para este domínio.
              </p>
            ) : (
              <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
                {history.map((event) => (
                  <li key={event.id} className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-white rounded-full -left-3 ring-8 ring-white dark:ring-background dark:bg-background">
                      {getEventIcon(event.type)}
                    </span>
                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {getEventDescription(event)}
                    </h3>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                      {formatTimestamp(event.timestamp)}
                    </time>
                    {event.details && event.type !== 'name_changed' && (
                      <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                        {event.details}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
