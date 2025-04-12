
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome do domínio deve ter pelo menos 3 caracteres.',
  }),
  type: z.enum(['checkout', 'secure', 'pay', 'seguro'], {
    required_error: 'Por favor selecione um tipo de subdomínio.',
  }),
});

type FormData = z.infer<typeof formSchema>;

interface AddDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export const AddDomainModal: React.FC<AddDomainModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'checkout',
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Domínio</DialogTitle>
          <DialogDescription>
            Configure um novo domínio para o seu checkout
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do domínio</FormLabel>
                  <FormControl>
                    <Input placeholder="checkout.sualoja.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de subdomínio</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="checkout">checkout</SelectItem>
                      <SelectItem value="secure">secure</SelectItem>
                      <SelectItem value="pay">pay</SelectItem>
                      <SelectItem value="seguro">seguro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Alert variant="outline" className="bg-muted">
              <InfoIcon className="h-4 w-4 mr-2" />
              <AlertDescription>
                <h4 className="font-medium mb-2">Instruções de DNS</h4>
                <p className="text-sm">Configure um registro CNAME no seu provedor de DNS apontando para:</p>
                <code className="text-xs bg-background p-1 rounded mt-1 block">checkout.voltz.app</code>
              </AlertDescription>
            </Alert>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Adicionar Domínio</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
