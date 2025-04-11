
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useActivationSteps } from '@/contexts/ActivationStepsContextWithStores';
import { useStores } from '@/contexts/StoreContext';
import { useToast } from '@/hooks/use-toast';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Lock, Save, ArrowLeft } from 'lucide-react';

const shopifyFormSchema = z.object({
  shopUrl: z.string()
    .min(1, "URL da loja é obrigatória")
    .refine(value => value.endsWith('.myshopify.com'), {
      message: "A URL deve terminar com .myshopify.com"
    }),
  adminToken: z.string().min(1, "Token de acesso é obrigatório"),
  apiKey: z.string().min(1, "Chave da API é obrigatória"),
  apiSecret: z.string().min(1, "Chave secreta é obrigatória"),
  skipCart: z.boolean().default(false),
});

type ShopifyFormValues = z.infer<typeof shopifyFormSchema>;

const ShopifyStep: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateStore, currentStore } = useStores();
  const { updateStepStatus } = useActivationSteps();

  const defaultValues: ShopifyFormValues = {
    shopUrl: '',
    adminToken: '',
    apiKey: '',
    apiSecret: '',
    skipCart: false,
  };

  const form = useForm<ShopifyFormValues>({
    resolver: zodResolver(shopifyFormSchema),
    defaultValues,
  });

  function onSubmit(values: ShopifyFormValues) {
    // In a real app, this would be encrypted and saved securely
    console.log("Saving Shopify credentials:", values);
    
    // Update the store record
    if (currentStore) {
      // Mark Shopify step as completed in store status
      updateStore(currentStore.id, {
        shopifyIntegration: {
          connected: true,
          shopUrl: values.shopUrl,
          // In a real implementation, sensitive data would be stored securely
        }
      });
      
      // Update the step status in the activation context
      updateStepStatus('shopify', true);
      
      toast({
        title: "Integração Shopify configurada",
        description: "Sua loja foi conectada com sucesso ao Shopify.",
      });
      
      // Navigate back to home page
      navigate('/pagina-inicial');
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 flex items-center gap-2" 
          onClick={() => navigate('/pagina-inicial')}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Página Inicial
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Conectar minha loja Shopify</h1>
        <p className="text-muted-foreground mb-8">
          Configure a integração da sua loja Shopify com o voltz.checkout para sincronizar produtos e tema automaticamente.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="shopUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Loja Shopify</FormLabel>
                  <FormControl>
                    <Input placeholder="sua-loja.myshopify.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    A URL da sua loja Shopify deve terminar com .myshopify.com
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="adminToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token de Acesso da API Admin</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxx" {...field} />
                  </FormControl>
                  <FormDescription>
                    Encontrado nas configurações de aplicativos do Shopify
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave da API</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="xxxxxxxxxxxxxxxxxxxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave Secreta da API</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="xxxxxxxxxxxxxxxxxxxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="skipCart"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Pular Carrinho</FormLabel>
                    <FormDescription>
                      Ativar esta opção irá redirecionar os clientes diretamente para o checkout, pulando a página do carrinho.
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
            
            <Alert className="bg-muted/50 border-muted-foreground/20">
              <Lock className="h-4 w-4 mr-2" />
              <AlertDescription>
                Suas credenciais serão criptografadas e usadas apenas para sincronização.
              </AlertDescription>
            </Alert>
            
            <Button type="submit" className="w-full flex items-center gap-2">
              <Save className="h-4 w-4" />
              Salvar e Conectar Shopify
            </Button>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default ShopifyStep;
