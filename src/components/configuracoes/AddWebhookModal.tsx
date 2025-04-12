
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { WebhookEvent } from '@/types/webhook';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome deve ter pelo menos 3 caracteres.',
  }),
  url: z.string().url({
    message: 'Insira uma URL válida.',
  }),
  events: z.array(z.string()).min(1, {
    message: 'Selecione pelo menos um evento.',
  }),
});

type FormData = z.infer<typeof formSchema>;

interface AddWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData & { token: string }) => void;
}

const webhookEvents = [
  { id: 'cart.abandoned', label: 'Carrinho abandonado' },
  { id: 'order.created', label: 'Pedido criado' },
  { id: 'order.updated', label: 'Atualização do pedido' },
  { id: 'order.status_updated', label: 'Atualização do status do pedido' },
  { id: 'order.approved', label: 'Pedido aprovado' },
  { id: 'order.rejected', label: 'Pedido recusado' },
];

export const AddWebhookModal: React.FC<AddWebhookModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const generateToken = () => {
    const randomBytes = new Uint8Array(24);
    window.crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  };

  const token = React.useMemo(() => generateToken(), [isOpen]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      url: '',
      events: [],
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit({ ...data, token });
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Webhook</DialogTitle>
          <DialogDescription>
            Configure um webhook para receber notificações de eventos
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do webhook" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://seusite.com/webhook" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Token</FormLabel>
              <div className="flex">
                <Input 
                  readOnly 
                  value={token} 
                  className="font-mono text-xs" 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="ml-2"
                  onClick={() => navigator.clipboard.writeText(token)}
                >
                  Copiar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Este token é gerado automaticamente e é usado para verificar as solicitações do webhook.
              </p>
            </div>
            
            <div className="space-y-3">
              <FormLabel>Eventos</FormLabel>
              <div className="border rounded-md p-4 space-y-3">
                <FormField
                  control={form.control}
                  name="events"
                  render={() => (
                    <FormItem>
                      {webhookEvents.map((event) => (
                        <FormField
                          key={event.id}
                          control={form.control}
                          name="events"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={event.id}
                                className="flex flex-row items-start space-x-3 space-y-0 py-1"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(event.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, event.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== event.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {event.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Criar Webhook</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
