
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PixelIntegration } from '@/types/integration';

interface ConnectPixelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (credentials: any) => void;
  integration: PixelIntegration;
}

// Define schemas for different pixel platforms
const metaSchema = z.object({
  pixelId: z.string().min(1, { message: 'Pixel ID é obrigatório' }),
});

const googleAdsSchema = z.object({
  conversionId: z.string().min(1, { message: 'ID de conversão é obrigatório' }),
  conversionLabel: z.string().min(1, { message: 'Rótulo de conversão é obrigatório' }),
});

const ConnectPixelDialog: React.FC<ConnectPixelDialogProps> = ({
  isOpen,
  onClose,
  onConnect,
  integration,
}) => {
  const getSchema = () => {
    switch (integration.platform) {
      case 'meta':
        return metaSchema;
      case 'google_ads':
        return googleAdsSchema;
      default:
        return metaSchema;
    }
  };

  const defaultValues = {
    pixelId: integration.pixels && integration.pixels[0]?.credentials?.pixelId || '',
    conversionId: integration.pixels && integration.pixels[0]?.credentials?.conversionId || '',
    conversionLabel: integration.pixels && integration.pixels[0]?.credentials?.conversionLabel || '',
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues,
  });

  const onSubmit = (data: any) => {
    onConnect(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Conectar {integration.name}</DialogTitle>
          <DialogDescription>
            Configure as credenciais para integrar o {integration.name} em seu checkout.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {integration.platform === 'meta' && (
              <FormField
                control={form.control}
                name="pixelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pixel ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 1234567890123456" {...field} />
                    </FormControl>
                    <FormDescription>
                      Encontrado nas configurações do Pixel do Facebook.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {integration.platform === 'google_ads' && (
              <>
                <FormField
                  control={form.control}
                  name="conversionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID de Conversão</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: AW-1234567890" {...field} />
                      </FormControl>
                      <FormDescription>
                        Comumente inicia com "AW-".
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conversionLabel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rótulo de Conversão</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: AbCdEfGhIj-D" {...field} />
                      </FormControl>
                      <FormDescription>
                        Configurado ao criar a conversão no Google Ads.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Conectar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectPixelDialog;
