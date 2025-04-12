
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
import { Webhook } from '@/types/webhook';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface WebhookLog {
  id: string;
  webhookId: string;
  timestamp: string;
  status: number;
  duration: number;
  event: string;
  payload: string;
}

interface WebhookLogsDrawerProps {
  webhook: Webhook;
  open: boolean;
  onClose: () => void;
}

export const WebhookLogsDrawer: React.FC<WebhookLogsDrawerProps> = ({
  webhook,
  open,
  onClose
}) => {
  // Mock logs data - in a real app, this would come from an API
  const mockLogs: WebhookLog[] = [
    {
      id: '1',
      webhookId: webhook.id,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 200,
      duration: 320,
      event: 'order.created',
      payload: JSON.stringify({ orderId: '12345', total: 199.90, customer: { name: 'João Silva' } })
    },
    {
      id: '2',
      webhookId: webhook.id,
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      status: 200,
      duration: 285,
      event: 'order.created',
      payload: JSON.stringify({ orderId: '12344', total: 99.90, customer: { name: 'Maria Santos' } })
    },
    {
      id: '3',
      webhookId: webhook.id,
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      status: 404,
      duration: 1200,
      event: 'order.approved',
      payload: JSON.stringify({ orderId: '12343', status: 'approved' })
    },
    {
      id: '4',
      webhookId: webhook.id,
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      status: 500,
      duration: 2500,
      event: 'cart.abandoned',
      payload: JSON.stringify({ cartId: '45678', items: [{ product: 'Produto ABC', quantity: 1 }] })
    },
    {
      id: '5',
      webhookId: webhook.id,
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 200,
      duration: 310,
      event: 'order.updated',
      payload: JSON.stringify({ orderId: '12342', status: 'processing' })
    }
  ];

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss");
    } catch {
      return 'Data inválida';
    }
  };

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          {status} OK
        </Badge>
      );
    } else if (status >= 400 && status < 500) {
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          {status} Erro
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          {status} Erro
        </Badge>
      );
    }
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Logs de Entrega - {webhook.name}</DrawerTitle>
          <DrawerDescription>
            {webhook.url}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 py-2">
          <div className="space-y-4">
            {mockLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhum log registrado para este webhook.
              </p>
            ) : (
              <div className="space-y-3">
                {mockLogs.map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge>{log.event}</Badge>
                        {getStatusBadge(log.status)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{log.duration}ms</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {formatTimestamp(log.timestamp)}
                    </div>
                    <div className="mt-2">
                      <div className="text-xs font-semibold mb-1">Payload:</div>
                      <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                        {JSON.stringify(JSON.parse(log.payload), null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
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
