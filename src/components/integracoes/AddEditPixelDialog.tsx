
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PixelConfig } from '@/types/integration';

interface AddEditPixelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  platformId: string;
  pixelData?: PixelConfig;
  isEdit?: boolean;
}

// Schema for Meta (Facebook) pixel
const metaPixelSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  pixelId: z.string().min(5, { message: 'ID do pixel é obrigatório' }),
  integrationType: z.enum(['classic', 'conversion_api']),
  token: z.string().optional(),
  trackBoleto: z.boolean().default(false),
  trackPix: z.boolean().default(false),
});

// Schema for Google Ads pixel
const googleAdsSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  conversionId: z.string().min(2, { message: 'ID de conversão é obrigatório' }),
  conversionLabel: z.string().min(2, { message: 'Rótulo de conversão é obrigatório' }),
  trackBoleto: z.boolean().default(false),
  trackPix: z.boolean().default(false),
});

// Schema for TikTok pixel
const tiktokSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  pixelId: z.string().min(2, { message: 'ID do pixel é obrigatório' }),
  trackBoleto: z.boolean().default(false),
  trackPix: z.boolean().default(false),
});

const AddEditPixelDialog: React.FC<AddEditPixelDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  platformId,
  pixelData,
  isEdit = false,
}) => {
  // Determine which schema to use based on platform
  const getSchema = () => {
    switch (platformId) {
      case 'meta':
        return metaPixelSchema;
      case 'google_ads':
        return googleAdsSchema;
      case 'tiktok':
        return tiktokSchema;
      default:
        return metaPixelSchema; // Default
    }
  };

  // Initialize form with appropriate schema and defaults
  const form = useForm<any>({
    resolver: zodResolver(getSchema()),
    defaultValues: pixelData ? {
      name: pixelData.name,
      ...(pixelData.integrationType && { integrationType: pixelData.integrationType }),
      ...(pixelData.credentials?.pixelId && { pixelId: pixelData.credentials.pixelId }),
      ...(pixelData.credentials?.conversionId && { conversionId: pixelData.credentials.conversionId }),
      ...(pixelData.credentials?.conversionLabel && { conversionLabel: pixelData.credentials.conversionLabel }),
      ...(pixelData.credentials?.token && { token: pixelData.credentials.token }),
      ...(pixelData.rules?.trackBoleto !== undefined && { trackBoleto: pixelData.rules.trackBoleto }),
      ...(pixelData.rules?.trackPix !== undefined && { trackPix: pixelData.rules.trackPix }),
    } : {
      name: '',
      integrationType: 'classic',
      pixelId: '',
      conversionId: '',
      conversionLabel: '',
      token: '',
      trackBoleto: false,
      trackPix: false,
    },
  });

  const handleSubmit = (data: any) => {
    // Transform form data to match PixelConfig structure
    const pixelConfig: PixelConfig = {
      id: pixelData?.id || `${platformId}-pixel-${Date.now()}`,
      name: data.name,
      platform: platformId as any,
      status: 'active',
      createdAt: pixelData?.createdAt || new Date(),
      updatedAt: new Date(),
      ...(platformId === 'meta' && { integrationType: data.integrationType }),
      credentials: {
        ...(data.pixelId && { pixelId: data.pixelId }),
        ...(data.conversionId && { conversionId: data.conversionId }),
        ...(data.conversionLabel && { conversionLabel: data.conversionLabel }),
        ...(data.token && { token: data.token }),
      },
      rules: {
        trackBoleto: data.trackBoleto,
        trackPix: data.trackPix,
      },
    };

    onSubmit(pixelConfig);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar' : 'Adicionar'} Pixel {platformId.toUpperCase()}</DialogTitle>
          <DialogDescription>
            Configure os detalhes do seu pixel para rastreamento de conversões.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome (interno)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Meta Principal" {...field} />
                  </FormControl>
                  <FormDescription>
                    Um nome para identificar este pixel no painel.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Meta specific fields */}
            {platformId === 'meta' && (
              <>
                <FormField
                  control={form.control}
                  name="integrationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Integração</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="classic">Clássica (Cookie)</SelectItem>
                          <SelectItem value="conversion_api">API de Conversão</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        O método de integração com o Meta Pixel.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pixelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID do Pixel</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789012345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("integrationType") === "conversion_api" && (
                  <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token da API de Conversão</FormLabel>
                        <FormControl>
                          <Input placeholder="EAABwzLixnjYBO..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Token de acesso para a API de Conversão do Meta.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            {/* Google Ads specific fields */}
            {platformId === 'google_ads' && (
              <>
                <FormField
                  control={form.control}
                  name="conversionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID de Conversão</FormLabel>
                      <FormControl>
                        <Input placeholder="AW-123456789" {...field} />
                      </FormControl>
                      <FormDescription>
                        Começa com AW-
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
                        <Input placeholder="AbCdEfGhIj-D" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* TikTok specific fields */}
            {platformId === 'tiktok' && (
              <FormField
                control={form.control}
                name="pixelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID do Pixel</FormLabel>
                    <FormControl>
                      <Input placeholder="C3ABCDEFGHI4567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Common fields for all platforms */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Regras de Rastreamento</h3>
              
              <FormField
                control={form.control}
                name="trackBoleto"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Rastrear Boleto</FormLabel>
                      <FormDescription>
                        Rastrear conversões via boleto
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trackPix"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Rastrear Pix</FormLabel>
                      <FormDescription>
                        Rastrear conversões via Pix
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEdit ? 'Atualizar' : 'Adicionar'} Pixel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditPixelDialog;
