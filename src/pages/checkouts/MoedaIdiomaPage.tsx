
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Info, Globe, Languages } from 'lucide-react';
import CheckoutLayout from '@/components/checkout/CheckoutLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCurrencySettings } from '@/hooks/use-currency-settings';
import { CurrencySettings } from '@/types/currency';

const formSchema = z.object({
  detectCountryViaIp: z.boolean().default(false),
  convertCurrencyAutomatically: z.boolean().default(false),
  translateLanguageAutomatically: z.boolean().default(false),
  showConversionNotice: z.boolean().default(true),
  fixedCurrency: z.string().default('BRL'),
  fixedLanguage: z.string().default('pt-BR'),
});

type FormValues = z.infer<typeof formSchema>;

const MoedaIdiomaPage = () => {
  const { settings, updateSettings, isLoading, supportsMultipleCurrencies } = useCurrencySettings();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      detectCountryViaIp: settings?.detectCountryViaIp || false,
      convertCurrencyAutomatically: settings?.convertCurrencyAutomatically || false,
      translateLanguageAutomatically: settings?.translateLanguageAutomatically || false,
      showConversionNotice: settings?.showConversionNotice || true,
      fixedCurrency: settings?.fixedCurrency || 'BRL',
      fixedLanguage: settings?.fixedLanguage || 'pt-BR',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Ensure all required properties are included for CurrencySettings
      const settingsToUpdate: CurrencySettings = {
        detectCountryViaIp: data.detectCountryViaIp,
        convertCurrencyAutomatically: data.convertCurrencyAutomatically,
        translateLanguageAutomatically: data.translateLanguageAutomatically,
        showConversionNotice: data.showConversionNotice,
        fixedCurrency: data.fixedCurrency,
        fixedLanguage: data.fixedLanguage,
        // Include other required properties from the existing settings or with defaults
        supportsMultipleCurrencies: settings?.supportsMultipleCurrencies || false,
        updatedAt: new Date().toISOString(),
      };
      
      await updateSettings(settingsToUpdate);
      toast.success('Configurações de moeda e idioma salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações.');
      console.error(error);
    }
  };

  const currencies = [
    { code: 'BRL', name: 'Real Brasileiro (R$)' },
    { code: 'USD', name: 'Dólar Americano ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'Libra Esterlina (£)' },
    { code: 'MXN', name: 'Peso Mexicano ($)' },
    { code: 'CLP', name: 'Peso Chileno ($)' },
    { code: 'ARS', name: 'Peso Argentino ($)' },
    { code: 'CAD', name: 'Dólar Canadense ($)' },
    { code: 'AUD', name: 'Dólar Australiano ($)' },
    { code: 'JPY', name: 'Iene Japonês (¥)' },
  ];
  
  const languages = [
    { code: 'pt-BR', name: 'Português (Brasil)' },
    { code: 'en-US', name: 'Inglês (EUA)' },
    { code: 'es-ES', name: 'Espanhol' },
    { code: 'fr-FR', name: 'Francês' },
    { code: 'de-DE', name: 'Alemão' },
    { code: 'it-IT', name: 'Italiano' },
  ];

  return (
    <CheckoutLayout 
      title="Moeda e Idioma" 
      description="Configure as opções de moeda e idioma do seu checkout baseados na localização do cliente."
    >
      {!supportsMultipleCurrencies && (
        <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <Info className="h-5 w-5 flex-shrink-0" />
              <p>Seu gateway atual não aceita pagamentos em múltiplas moedas. Algumas opções podem estar limitadas.</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span>Configuração Automática</span>
              </CardTitle>
              <CardDescription>
                Configure como o checkout se adapta automaticamente baseado na localização do cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="detectCountryViaIp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Detectar país do cliente via IP</FormLabel>
                      <FormDescription>
                        Utiliza geolocalização baseada no IP para identificar o país do cliente
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
                name="convertCurrencyAutomatically"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Converter moeda automaticamente</FormLabel>
                      <FormDescription>
                        Mostra preços na moeda local do cliente baseado na sua localização
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch("detectCountryViaIp") || !supportsMultipleCurrencies}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="translateLanguageAutomatically"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Traduzir idioma automaticamente</FormLabel>
                      <FormDescription>
                        Adapta o idioma do checkout baseado no país do cliente
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch("detectCountryViaIp")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="showConversionNotice"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Mostrar aviso de conversão</FormLabel>
                      <FormDescription>
                        Exibe um aviso informando que os valores foram convertidos automaticamente
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!(form.watch("convertCurrencyAutomatically") || form.watch("translateLanguageAutomatically"))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                <span>Configuração Manual (Fallback)</span>
              </CardTitle>
              <CardDescription>
                Define configurações padrão caso a detecção automática falhe ou esteja desativada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fixedCurrency"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>Moeda fixa do checkout</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Esta será a moeda padrão se a detecção automática estiver desativada ou falhar
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar moeda" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fixedLanguage"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>Idioma fixo do checkout</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Este será o idioma padrão se a detecção automática estiver desativada ou falhar
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem key={language.code} value={language.code}>
                              {language.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground mt-4 text-right">
            Última atualização: {settings?.updatedAt ? new Date(settings.updatedAt).toLocaleString('pt-BR') : 'Nunca'}
          </div>
        </form>
      </Form>
    </CheckoutLayout>
  );
};

export default MoedaIdiomaPage;
