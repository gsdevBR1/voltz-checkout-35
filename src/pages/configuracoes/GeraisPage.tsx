
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SidebarLayout } from '@/components/Sidebar';
import { 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Clock, 
  DollarSign, 
  Languages, 
  Settings, 
  Save,
  Info
} from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

// Esquema de validação
const storeFormSchema = z.object({
  // Identificação da Loja
  storeName: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
  document: z.string().refine(
    (val) => {
      // Validação simples de CPF/CNPJ (pode ser aprimorada)
      const onlyNumbers = val.replace(/\D/g, '');
      return onlyNumbers.length === 11 || onlyNumbers.length === 14;
    },
    { message: 'CPF ou CNPJ inválido' }
  ),
  supportEmail: z.string().email({ message: 'Email inválido' }),
  supportWhatsapp: z.string().optional(),
  
  // Dados de Localização e Padrão
  address: z.string().min(5, { message: 'Endereço deve ser completo' }),
  postalCode: z.string().refine(
    (val) => /^\d{5}-?\d{3}$/.test(val.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2')),
    { message: 'CEP inválido' }
  ),
  timezone: z.string(),
  currency: z.string(),
  language: z.string(),
  
  // Comportamento padrão
  threeStepCheckout: z.boolean(),
  darkMode: z.boolean(),
  hideCents: z.boolean(),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

const GeraisPage: React.FC = () => {
  const { toast } = useToast();
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Valores padrão para o formulário
  const defaultValues: StoreFormValues = {
    storeName: 'Minha Loja',
    document: '',
    supportEmail: '',
    supportWhatsapp: '',
    address: '',
    postalCode: '',
    timezone: 'America/Sao_Paulo',
    currency: 'BRL',
    language: 'pt-BR',
    threeStepCheckout: true,
    darkMode: false,
    hideCents: false,
  };
  
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues,
  });
  
  const onSubmit = (data: StoreFormValues) => {
    // Aqui implementaríamos a lógica de salvar no backend
    console.log('Dados salvos:', data);
    
    // Atualiza horário da última edição
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR');
    const formattedTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setLastUpdated(`${formattedDate} às ${formattedTime}`);
    
    // Mostrar toast de sucesso
    toast({
      title: "Sucesso!",
      description: "Alterações salvas com sucesso!",
      variant: "success",
    });
  };
  
  return (
    <SidebarLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Configurações Gerais</h1>
            <p className="text-muted-foreground">
              Configure dados básicos e comportamentos padrão da sua loja
            </p>
          </div>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            className="bg-green-500 hover:bg-green-600"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar alterações
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Seção 1: Identificação da Loja */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Store className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Identificação da Loja</CardTitle>
                </div>
                <CardDescription>
                  Informações básicas sobre sua loja que serão exibidas aos clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="storeName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Nome da loja</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Nome público que aparecerá no checkout</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>CNPJ ou CPF</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Documento fiscal da empresa ou pessoa física</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="00.000.000/0000-00 ou 000.000.000-00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supportEmail"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>E-mail de suporte</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Exibido no rodapé do checkout</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                            <Mail className="h-4 w-4" />
                          </span>
                          <Input 
                            {...field} 
                            className="rounded-l-none" 
                            placeholder="suporte@sualoja.com.br"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supportWhatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>WhatsApp de suporte</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Número de WhatsApp para atendimento (opcional)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                            <Phone className="h-4 w-4" />
                          </span>
                          <Input 
                            {...field} 
                            className="rounded-l-none" 
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Campo opcional
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            {/* Seção 2: Dados de Localização e Padrão */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Dados de Localização e Padrão</CardTitle>
                </div>
                <CardDescription>
                  Configure a localização, fuso horário e preferências regionais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Endereço completo</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Endereço comercial completo</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                          </span>
                          <Input 
                            {...field} 
                            className="rounded-l-none" 
                            placeholder="Rua, número, bairro, cidade, estado"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>CEP</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Código de Endereçamento Postal</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="00000-000"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Fuso horário</FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Fuso horário para relatórios e eventos</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <SelectValue placeholder="Selecione um fuso horário" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                          <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                          <SelectItem value="America/Belem">Belém (GMT-3)</SelectItem>
                          <SelectItem value="America/Bahia">Salvador (GMT-3)</SelectItem>
                          <SelectItem value="America/Fortaleza">Fortaleza (GMT-3)</SelectItem>
                          <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Moeda padrão</FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Moeda usada nos checkouts</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <div className="flex items-center">
                                <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Selecione uma moeda" />
                              </div>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="BRL">BRL - Real Brasileiro</SelectItem>
                            <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - Libra Esterlina</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Idioma padrão</FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Idioma principal dos checkouts</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <div className="flex items-center">
                                <Languages className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Selecione um idioma" />
                              </div>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                            <SelectItem value="en-US">English (US)</SelectItem>
                            <SelectItem value="es-ES">Español</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Seção 3: Comportamento padrão */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle>Comportamento padrão</CardTitle>
                </div>
                <CardDescription>
                  Configure o comportamento padrão da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="threeStepCheckout"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Checkout padrão em 3 etapas
                          </FormLabel>
                          <FormDescription>
                            Se ativado, todo novo produto seguirá esse padrão
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
                    name="darkMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Ativar modo escuro na interface
                          </FormLabel>
                          <FormDescription>
                            Habilita dark mode da plataforma por padrão
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
                    name="hideCents"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Exibir preços sem centavos
                          </FormLabel>
                          <FormDescription>
                            Ex: R$ 49 ao invés de R$ 49,90
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
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-green-500 hover:bg-green-600"
              >
                <Save className="mr-2 h-4 w-4" />
                Salvar alterações
              </Button>
            </div>
          </form>
        </Form>
        
        {lastUpdated && (
          <div className="mt-8 text-sm text-muted-foreground text-right">
            Última atualização: {lastUpdated}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default GeraisPage;
