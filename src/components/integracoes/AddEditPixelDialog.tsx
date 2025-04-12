
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PixelConfig } from '@/types/integration';

interface AddEditPixelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pixelData: PixelConfig) => void;
  pixel: PixelConfig | null;
  platform: string;
}

// Create a type-safe validation schema for each platform
const createValidationSchema = (platform: string) => {
  const baseSchema = {
    name: z.string()
      .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
      .max(50, { message: 'O nome deve ter no máximo 50 caracteres' }),
    status: z.enum(['active', 'inactive']),
    rules: z.object({
      trackBoleto: z.boolean().optional(),
      trackPix: z.boolean().optional(),
    }),
  };

  switch (platform) {
    case 'meta':
      return z.object({
        ...baseSchema,
        integrationType: z.enum(['classic', 'conversion_api']),
        credentials: z.object({
          pixelId: z.string()
            .min(1, { message: 'O Pixel ID é obrigatório' })
            .regex(/^[0-9]+$/, { message: 'O Pixel ID deve conter apenas números' }),
          token: z.string()
            .optional()
            .refine(val => 
              val === undefined || val === '' || val.startsWith('EAA'), 
              { message: 'O token deve iniciar com EAA...' }
            ),
        }).refine(data => {
          // Se for API de conversão, o token é obrigatório
          if (data.token === undefined && integrationType === 'conversion_api') {
            return false;
          }
          return true;
        }, { 
          message: 'Token é obrigatório para API de conversão',
          path: ['token']
        }),
      });
    case 'google_ads':
      return z.object({
        ...baseSchema,
        credentials: z.object({
          conversionId: z.string()
            .min(1, { message: 'O ID de Conversão é obrigatório' })
            .regex(/^AW-\d+$/, { message: 'O ID de conversão deve estar no formato AW-XXXXXXXX' }),
          conversionLabel: z.string()
            .min(1, { message: 'O Rótulo de Conversão é obrigatório' }),
        }),
      });
    case 'tiktok':
    case 'pinterest':
    case 'kwai':
    case 'mgid':
    case 'outbrain':
      return z.object({
        ...baseSchema,
        credentials: z.object({
          pixelId: z.string()
            .min(1, { message: 'O Pixel ID é obrigatório' }),
        }),
      });
    case 'google_analytics':
      return z.object({
        ...baseSchema,
        credentials: z.object({
          measurementId: z.string()
            .min(1, { message: 'O Measurement ID é obrigatório' })
            .regex(/^G-[A-Z0-9]+$/, { message: 'O Measurement ID deve estar no formato G-XXXXXXXXXX' }),
        }),
      });
    case 'google_tag_manager':
      return z.object({
        ...baseSchema,
        credentials: z.object({
          containerId: z.string()
            .min(1, { message: 'O Container ID é obrigatório' })
            .regex(/^GTM-[A-Z0-9]+$/, { message: 'O Container ID deve estar no formato GTM-XXXXXXX' }),
        }),
      });
    case 'taboola':
      return z.object({
        ...baseSchema,
        credentials: z.object({
          trackingCode: z.string()
            .min(1, { message: 'O código de rastreio é obrigatório' }),
        }),
      });
    default:
      return z.object({
        ...baseSchema,
        credentials: z.object({
          pixelId: z.string()
            .min(1, { message: 'O Pixel ID é obrigatório' }),
        }),
      });
  }
};

const AddEditPixelDialog: React.FC<AddEditPixelDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  pixel,
  platform,
}) => {
  const [integrationType, setIntegrationType] = useState<'classic' | 'conversion_api'>('classic');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get the appropriate validation schema based on the platform
  const validationSchema = createValidationSchema(platform);
  
  // Initialize the form with react-hook-form
  const form = useForm<any>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
      status: 'active' as const,
      integrationType: 'classic' as const,
      credentials: {},
      rules: {
        trackBoleto: false,
        trackPix: false,
      },
    },
  });

  // Update the form when the pixel changes
  useEffect(() => {
    if (pixel) {
      form.reset({
        name: pixel.name,
        status: pixel.status,
        integrationType: pixel.integrationType || 'classic',
        credentials: pixel.credentials,
        rules: pixel.rules || {
          trackBoleto: false,
          trackPix: false,
        },
      });
      
      if (pixel.integrationType) {
        setIntegrationType(pixel.integrationType);
      }
    } else {
      form.reset({
        name: '',
        status: 'active',
        integrationType: 'classic',
        credentials: {},
        rules: {
          trackBoleto: false,
          trackPix: false,
        },
      });
      setIntegrationType('classic');
    }
  }, [pixel, form]);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      // Create or update the pixel data
      const pixelData: PixelConfig = {
        id: pixel?.id || `pixel-${Date.now()}`,
        name: data.name,
        platform: platform as any,
        status: data.status,
        createdAt: pixel?.createdAt || new Date(),
        updatedAt: new Date(),
        credentials: data.credentials,
        rules: data.rules,
      };
      
      // Add integration type for Meta
      if (platform === 'meta') {
        pixelData.integrationType = data.integrationType;
      }
      
      // Call the onSave function with the pixel data
      onSave(pixelData);
    } catch (error) {
      console.error('Error saving pixel:', error);
      toast({
        title: 'Erro ao salvar pixel',
        description: 'Ocorreu um erro ao salvar o pixel. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntegrationTypeChange = (value: 'classic' | 'conversion_api') => {
    setIntegrationType(value);
    form.setValue('integrationType', value);
  };

  // Get the appropriate form fields based on the platform
  const renderCredentialsFields = () => {
    switch (platform) {
      case 'meta':
        return (
          <Tabs value={integrationType} onValueChange={handleIntegrationTypeChange as any}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="classic">Clássica (Cookie)</TabsTrigger>
              <TabsTrigger value="conversion_api">API de Conversão</TabsTrigger>
            </TabsList>
            <TabsContent value="classic" className="pt-4 space-y-4">
              <FormField
                control={form.control}
                name="credentials.pixelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pixel ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="12345678901234567" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Digite o ID do seu pixel do Facebook (somente números)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value="conversion_api" className="pt-4 space-y-4">
              <FormField
                control={form.control}
                name="credentials.pixelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pixel ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="12345678901234567" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Digite o ID do seu pixel do Facebook (somente números)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="credentials.token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token de Acesso</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="EAABwzLixnjYBO..." 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Token gerado no Event Manager do Facebook
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
        );
      case 'google_ads':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="credentials.conversionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID de Conversão</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="AW-12345678" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Digite o ID de conversão do Google Ads (formato: AW-XXXXXXXX)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentials.conversionLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rótulo de Conversão</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="AbCdEfGhIj-D" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Digite o rótulo de conversão associado
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 'google_analytics':
        return (
          <FormField
            control={form.control}
            name="credentials.measurementId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Measurement ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="G-XXXXXXXXXX" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Digite o ID de medição do Google Analytics 4
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'google_tag_manager':
        return (
          <FormField
            control={form.control}
            name="credentials.containerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Container ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="GTM-XXXXXXX" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Digite o ID do container do Google Tag Manager
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'taboola':
        return (
          <FormField
            control={form.control}
            name="credentials.trackingCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Rastreio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Cole o código de rastreio personalizado..." 
                    {...field} 
                    value={field.value || ''}
                    rows={5}
                  />
                </FormControl>
                <FormDescription>
                  Cole o código de rastreamento fornecido pela Taboola
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 'tiktok':
      case 'pinterest':
      case 'kwai':
      case 'mgid':
      case 'outbrain':
      default:
        return (
          <FormField
            control={form.control}
            name="credentials.pixelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pixel ID</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="XXXXXXXXXXXXXXXX" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Digite o ID do pixel fornecido pela plataforma
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case 'meta':
        return 'Meta (Facebook/Instagram)';
      case 'google_ads':
        return 'Google Ads';
      case 'google_analytics':
        return 'Google Analytics 4';
      case 'google_tag_manager':
        return 'Google Tag Manager';
      case 'tiktok':
        return 'TikTok';
      case 'pinterest':
        return 'Pinterest';
      case 'kwai':
        return 'Kwai';
      case 'taboola':
        return 'Taboola';
      case 'mgid':
        return 'Mgid';
      case 'outbrain':
        return 'Outbrain';
      default:
        return platform;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{pixel ? 'Editar' : 'Adicionar'} Pixel - {getPlatformName()}</DialogTitle>
          <DialogDescription>
            {pixel 
              ? 'Edite as configurações deste pixel para rastreamento de conversões.' 
              : 'Configure um novo pixel para rastreamento de conversões.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome interno</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Facebook Principal" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Um nome para identificar este pixel no painel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="active" />
                          </FormControl>
                          <FormLabel className="font-normal">Ativo</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="inactive" />
                          </FormControl>
                          <FormLabel className="font-normal">Inativo</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-3">Informações Básicas</h3>
                {renderCredentialsFields()}
              </div>

              <div className="border rounded-md p-4">
                <div className="flex items-center mb-3">
                  <h3 className="text-sm font-medium">Regras de Rastreamento</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="ml-1 cursor-help">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Por padrão, já registramos eventos Purchase para pagamentos com cartão. Você pode escolher rastrear métodos adicionais.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="rules.trackBoleto"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Marcar boleto como conversão
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rules.trackPix"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Marcar pix como conversão
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {pixel ? 'Atualizar' : 'Adicionar'} Pixel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditPixelDialog;
