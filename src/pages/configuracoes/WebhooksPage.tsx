
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus, Link, ExternalLink, Check, X, AlertCircle } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { AddWebhookModal } from '@/components/configuracoes/AddWebhookModal';
import { Webhook, WebhookEvent } from '@/types/webhook';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const mockWebhooks: Webhook[] = [
  {
    id: '1',
    name: 'Notificação de pedidos',
    url: 'https://example.com/webhook/orders',
    token: '3f8a61c9d2e5b7f4a0c3d6e9',
    events: ['order.created', 'order.approved', 'order.rejected'],
    status: 'active',
    createdAt: '2023-11-05T09:20:00Z',
  },
  {
    id: '2',
    name: 'Carrinhos abandonados',
    url: 'https://example.com/webhook/abandoned',
    token: '7d5e2f1c8b9a6d3e0f4c7b2a',
    events: ['cart.abandoned'],
    status: 'inactive',
    createdAt: '2023-11-10T14:30:00Z',
  },
];

const eventLabels: Record<WebhookEvent, string> = {
  'cart.abandoned': 'Carrinho abandonado',
  'order.created': 'Pedido criado',
  'order.updated': 'Atualização do pedido',
  'order.status_updated': 'Atualização do status',
  'order.approved': 'Pedido aprovado',
  'order.rejected': 'Pedido recusado',
};

const WebhooksPage: React.FC = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>(mockWebhooks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();

  const handleAddWebhook = (data: { 
    name: string; 
    url: string; 
    token: string;
    events: string[];
  }) => {
    const newWebhook: Webhook = {
      id: Math.random().toString(36).substring(2, 9),
      name: data.name,
      url: data.url,
      token: data.token,
      events: data.events as WebhookEvent[],
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setWebhooks([...webhooks, newWebhook]);
    setIsAddModalOpen(false);
    
    toast({
      title: "Webhook criado",
      description: `O webhook "${data.name}" foi criado com sucesso.`,
    });
  };

  const handleToggleStatus = (id: string) => {
    setWebhooks(hooks => 
      hooks.map(hook => 
        hook.id === id 
          ? { ...hook, status: hook.status === 'active' ? 'inactive' : 'active' } 
          : hook
      )
    );
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}${urlObj.pathname}`;
    } catch (e) {
      return url;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Webhooks</h1>
            <p className="text-muted-foreground">Gerencie webhooks para integração com sistemas externos</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Webhook
          </Button>
        </div>

        <div className="bg-card border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Eventos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum webhook configurado ainda
                  </TableCell>
                </TableRow>
              ) : (
                webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell className="font-medium">{webhook.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Link className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[200px]">{formatUrl(webhook.url)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.length > 3 ? (
                          <>
                            {webhook.events.slice(0, 2).map(event => (
                              <Badge key={event} variant="outline" className="text-xs">
                                {eventLabels[event as WebhookEvent]}
                              </Badge>
                            ))}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge variant="outline" className="text-xs cursor-help">
                                    +{webhook.events.length - 2}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="space-y-1">
                                    {webhook.events.slice(2).map(event => (
                                      <div key={event}>{eventLabels[event as WebhookEvent]}</div>
                                    ))}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </>
                        ) : (
                          webhook.events.map(event => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {eventLabels[event as WebhookEvent]}
                            </Badge>
                          ))
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={webhook.status === 'active'} 
                          onCheckedChange={() => handleToggleStatus(webhook.id)}
                        />
                        <span className={`text-sm ${webhook.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                          {webhook.status === 'active' ? (
                            <span className="flex items-center">
                              <Check className="w-3 h-3 mr-1" />
                              Ativo
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <X className="w-3 h-3 mr-1" />
                              Inativo
                            </span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <AlertCircle className="h-4 w-4" />
                                <span className="sr-only">Logs</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ver logs de entrega</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddWebhookModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAddWebhook} 
      />
    </DashboardLayout>
  );
};

export default WebhooksPage;
