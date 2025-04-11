
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ArrowRight, Clock, ShoppingBag, Check, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ShopifyFormValues {
  storeUrl: string;
  accessToken: string;
  apiKey: string;
  apiSecretKey: string;
  skipCart: boolean;
}

const ShopifyCard = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<ShopifyFormValues>({
    defaultValues: {
      storeUrl: '',
      accessToken: '',
      apiKey: '',
      apiSecretKey: '',
      skipCart: false
    }
  });

  const validateShopifyUrl = (url: string) => {
    if (!url) return false;
    
    // Remove any protocol, www, or trailing slashes
    let cleanUrl = url.trim();
    cleanUrl = cleanUrl.replace(/^(https?:\/\/)?(www\.)?/, '');
    cleanUrl = cleanUrl.replace(/\/$/, '');
    
    // Check if it ends with .myshopify.com
    return cleanUrl.endsWith('.myshopify.com') && !cleanUrl.includes('/') && !cleanUrl.includes('.br');
  };

  const onSubmit = (data: ShopifyFormValues) => {
    if (!validateShopifyUrl(data.storeUrl)) {
      toast({
        title: "URL inválida",
        description: "A URL deve terminar com .myshopify.com e não pode conter www., https://, http://, /, .br",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate successful connection
    setIsConnected(true);
    const now = new Date();
    setLastSyncDate(now.toLocaleString('pt-BR'));
    
    toast({
      title: "Conexão realizada com sucesso",
      description: "Sua loja Shopify foi conectada com sucesso ao voltz.checkout",
    });
    
    // In a real implementation, you would send this data to your backend
    console.log("Shopify integration data:", data);
  };

  const disconnectShopify = () => {
    setIsConnected(false);
    setLastSyncDate(null);
    form.reset();
    
    toast({
      title: "Shopify desconectado",
      description: "A integração com a Shopify foi removida",
    });
  };

  return (
    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 bg-[#F1F0FB]/30">
      <CardHeader className="pb-3 relative">
        <Badge variant="outline" className="absolute top-2 right-2 bg-[#F1F0FB] text-[#8E9196] border-none">
          Opcional
        </Badge>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#9b87f5]" />
            Integração com Shopify
          </CardTitle>
          {isConnected ? (
            <Badge className="bg-[#F2FCE2] hover:bg-[#E8F7D4] text-[#2BBA00] border-none">
              <Check className="mr-1 h-3 w-3" /> Ativo
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-100 text-gray-500 hover:bg-gray-200 border-none">
              <X className="mr-1 h-3 w-3" /> Desconectado
            </Badge>
          )}
        </div>
        <CardDescription className="mt-2">
          Sincronize seus produtos e tema diretamente com a Shopify.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!isConnected ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="storeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da loja</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input 
                          placeholder="sualoja.myshopify.com" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      URL completa da sua loja Shopify sem https:// ou www.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="accessToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token de acesso da API Admin</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxx" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave de API</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="xxxxxxxxxxxxxxxxxxxxxxxx" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="apiSecretKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave secreta da API</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="xxxxxxxxxxxxxxxxxxxxxxxx" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="skipCart"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Pular Carrinho</FormLabel>
                      <FormDescription>
                        Direcionar usuário direto para o checkout
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
              
              <Button type="submit" className="w-full">
                Conectar minha loja Shopify
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border p-3">
              <div className="font-medium">Passo a passo da integração:</div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-[#F2FCE2] text-[#2BBA00] border-none">
                    <Check className="mr-1 h-3 w-3" />
                  </Badge>
                  <span>Shopify conectada</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-[#F2FCE2] text-[#2BBA00] border-none">
                    <Check className="mr-1 h-3 w-3" />
                  </Badge>
                  <span>Produtos sincronizados</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-[#F2FCE2] text-[#2BBA00] border-none">
                    <Check className="mr-1 h-3 w-3" />
                  </Badge>
                  <span>Tema sincronizado</span>
                </div>
              </div>
            </div>
            
            {lastSyncDate && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>Última sincronização: {lastSyncDate}</span>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="flex-1" onClick={disconnectShopify}>
                Desconectar Shopify
              </Button>
              <Button variant="default" className="flex-1 bg-[#9b87f5] hover:bg-[#8a76e4]">
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir App na Shopify
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShopifyCard;
