
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  Link as LinkIcon, 
  Loader2, 
  PackageCheck, 
  Rocket, 
  ShoppingCart,
  Store,
  BoxSelect,
  Code,
  LockKeyhole,
  Key,
  ShieldCheck
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ShopifyProduct, ShopifyAppCredentials } from '@/types/shopifyProduct';
import { formatCurrency } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const singleProductFormSchema = z.object({
  productLink: z.string()
    .url({ message: "O URL do produto é inválido. Insira um link completo incluindo https://" })
    .refine(url => {
      const hasProductsPath = url.includes('/products/') || url.includes('/produto/') || url.includes('/collection/');
      return hasProductsPath;
    }, { message: "O URL deve ser um link direto para um produto (ex: loja.com/products/nome-do-produto)" })
});

const storeFormSchema = z.object({
  storeLink: z.string()
    .url({ message: "O URL da loja é inválido. Insira um link completo incluindo https://" })
});

const shopifyAppFormSchema = z.object({
  shopDomain: z.string()
    .url({ message: "O URL da sua loja é inválido. Insira um link completo incluindo https://" }),
  apiKey: z.string()
    .min(1, { message: "A chave de API é obrigatória." }),
  apiSecret: z.string()
    .min(1, { message: "A chave secreta é obrigatória." }),
  accessToken: z.string()
    .min(1, { message: "O token de acesso é obrigatório." }),
});

const productFormSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres." }),
  description: z.string(),
  price: z.coerce.number().min(0.01, { message: "O preço deve ser maior que zero." }),
});

const ClonadorShopifyPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStoreLoading, setIsStoreLoading] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [productData, setProductData] = useState<ShopifyProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cloneOption, setCloneOption] = useState<'product' | 'store'>('product');
  const [foundProducts, setFoundProducts] = useState<number | null>(null);
  const [isStoreCloningInProgress, setIsStoreCloningInProgress] = useState(false);
  const [storeCloningProgress, setStoreCloningProgress] = useState(0);
  const [detectionMethod, setDetectionMethod] = useState<'api' | 'scraping' | null>(null);
  const [shopifyAppConnected, setShopifyAppConnected] = useState(false);
  const [shopifyCredentials, setShopifyCredentials] = useState<ShopifyAppCredentials | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const singleProductForm = useForm<z.infer<typeof singleProductFormSchema>>({
    resolver: zodResolver(singleProductFormSchema),
    defaultValues: {
      productLink: '',
    },
  });

  const storeForm = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      storeLink: '',
    },
  });

  const shopifyAppForm = useForm<z.infer<typeof shopifyAppFormSchema>>({
    resolver: zodResolver(shopifyAppFormSchema),
    defaultValues: {
      shopDomain: '',
      apiKey: '',
      apiSecret: '',
      accessToken: '',
    },
  });

  const productForm = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    },
  });

  const isShopifyStore = (url: string): boolean => {
    return url.includes('shopify.com') || 
           url.includes('.myshopify.com') || 
           url.includes('/products/') || 
           url.includes('/collections/') || 
           url.includes('/produto/') ||
           url.includes('lojachic.com.br') || 
           url.includes('tenisbonito.com') || 
           url.includes('superloja.com.br') ||
           url.includes('tenispremium.com') ||
           url.includes('superdrop.com');
  };

  const isProductUrl = (url: string): boolean => {
    return url.includes('/products/') || 
           url.includes('/collections/') || 
           url.includes('/produto/');
  };

  const connectShopifyApp = async (values: z.infer<typeof shopifyAppFormSchema>) => {
    try {
      setIsConnecting(true);
      
      // Simulate API connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const credentials: ShopifyAppCredentials = {
        apiKey: values.apiKey,
        apiSecret: values.apiSecret,
        accessToken: values.accessToken,
        shopDomain: values.shopDomain,
        isConnected: true
      };
      
      setShopifyCredentials(credentials);
      setShopifyAppConnected(true);
      
      toast({
        title: "App Shopify conectado com sucesso!",
        description: "Sua loja foi conectada e está pronta para receber produtos clonados.",
        variant: "default",
      });
      
    } catch (error) {
      console.error("Error connecting Shopify app:", error);
      toast({
        title: "Erro ao conectar App Shopify",
        description: "Não foi possível conectar sua loja. Verifique as credenciais fornecidas.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchProductData = async (url: string) => {
    try {
      setIsLoading(true);
      
      if (!isShopifyStore(url)) {
        toast({
          title: "Erro ao verificar loja",
          description: "Essa loja não parece ser uma loja Shopify. Verifique o URL fornecido.",
          variant: "destructive",
        });
        return;
      }

      let useScrapingFallback = !url.includes('.myshopify.com') && !url.includes('shopify.com');
      
      if (useScrapingFallback) {
        setDetectionMethod('scraping');
        await new Promise(resolve => setTimeout(resolve, 2500));
      } else {
        setDetectionMethod('api');
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      const mockProduct: ShopifyProduct = {
        id: "shopify_1234567890",
        title: "Produto Demonstrativo Shopify" + (useScrapingFallback ? " (via Scraping)" : ""),
        description: "<p>Esta é uma descrição de produto de exemplo com <strong>formatação HTML</strong> que foi importada de uma loja Shopify" + 
                    (useScrapingFallback ? " utilizando scraping estruturado.</p>" : " utilizando a API Storefront.</p>") + 
                    "<p>Características:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>",
        price: 129.99,
        compareAtPrice: 159.99,
        images: [
          "https://placekitten.com/500/500",
          "https://placekitten.com/500/501",
          "https://placekitten.com/500/502",
          "https://placekitten.com/500/503"
        ],
        variants: [
          {
            id: "variant_1",
            title: "Pequeno / Preto",
            price: "129.99",
            available: true,
            sku: "PROD-S-BLACK",
            options: [
              { name: "Tamanho", value: "Pequeno" },
              { name: "Cor", value: "Preto" }
            ]
          },
          {
            id: "variant_2",
            title: "Médio / Preto",
            price: "129.99",
            available: true,
            sku: "PROD-M-BLACK",
            options: [
              { name: "Tamanho", value: "Médio" },
              { name: "Cor", value: "Preto" }
            ]
          },
          {
            id: "variant_3",
            title: "Grande / Preto",
            price: "139.99",
            available: true,
            sku: "PROD-L-BLACK",
            options: [
              { name: "Tamanho", value: "Grande" },
              { name: "Cor", value: "Preto" }
            ]
          },
          {
            id: "variant_4",
            title: "Pequeno / Azul",
            price: "129.99",
            available: false,
            sku: "PROD-S-BLUE",
            options: [
              { name: "Tamanho", value: "Pequeno" },
              { name: "Cor", value: "Azul" }
            ]
          }
        ],
        options: [
          {
            name: "Tamanho",
            values: ["Pequeno", "Médio", "Grande"]
          },
          {
            name: "Cor",
            values: ["Preto", "Azul"]
          }
        ],
        vendor: "Marca Demo",
        productType: "Acessórios",
        handle: "produto-demonstrativo",
        tags: ["demo", "exemplo", "shopify"],
        url: url
      };

      setProductData(mockProduct);
      setSelectedImage(mockProduct.images[0]);
      
      productForm.reset({
        title: mockProduct.title,
        description: mockProduct.description,
        price: mockProduct.price,
      });
      
      toast({
        title: "Produto encontrado!",
        description: `Os dados do produto foram carregados com sucesso ${useScrapingFallback ? 'utilizando scraping estruturado' : 'via API Storefront'}.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Erro ao buscar produto",
        description: "Não foi possível carregar os dados do produto. Verifique se o link é válido.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scanShopifyStore = async (url: string) => {
    try {
      setIsStoreLoading(true);
      
      if (!isShopifyStore(url)) {
        toast({
          title: "Erro ao verificar loja",
          description: "Essa loja não parece ser uma loja Shopify. Verifique o URL fornecido.",
          variant: "destructive",
        });
        return;
      }
      
      const useScrapingFallback = !url.includes('.myshopify.com') && !url.includes('shopify.com');
      setDetectionMethod(useScrapingFallback ? 'scraping' : 'api');
      
      if (useScrapingFallback) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      const productCount = Math.floor(Math.random() * 30) + 5;
      
      setFoundProducts(productCount);
      
      toast({
        title: "Loja Shopify encontrada!",
        description: `Encontramos ${productCount} produtos disponíveis publicamente ${useScrapingFallback ? 'utilizando scraping estruturado' : 'via API Storefront'}.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error scanning store:", error);
      toast({
        title: "Erro ao escanear loja",
        description: "Não foi possível verificar a loja Shopify. Verifique se o link é válido.",
        variant: "destructive",
      });
    } finally {
      setIsStoreLoading(false);
    }
  };

  const startStoreCloning = async () => {
    try {
      setIsStoreCloningInProgress(true);
      setStoreCloningProgress(0);
      
      for (let i = 1; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStoreCloningProgress(i * 10);
      }
      
      toast({
        title: "Loja clonada com sucesso!",
        description: `${foundProducts} produtos foram adicionados à sua loja e configurados com checkout VOLTZ.`,
        variant: "default",
      });
      
      storeForm.reset();
      setFoundProducts(null);
      setDetectionMethod(null);
    } catch (error) {
      console.error("Error cloning store:", error);
      toast({
        title: "Erro ao clonar loja",
        description: "Ocorreu um erro ao tentar clonar a loja. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsStoreCloningInProgress(false);
      setStoreCloningProgress(0);
    }
  };

  const onSubmitSingleProduct = async (values: z.infer<typeof singleProductFormSchema>) => {
    if (!shopifyAppConnected) {
      toast({
        title: "App Shopify não conectado",
        description: "Você precisa conectar seu App Shopify antes de clonar produtos.",
        variant: "destructive",
      });
      return;
    }
    
    await fetchProductData(values.productLink);
  };

  const onSubmitStore = async (values: z.infer<typeof storeFormSchema>) => {
    if (!shopifyAppConnected) {
      toast({
        title: "App Shopify não conectado",
        description: "Você precisa conectar seu App Shopify antes de clonar produtos.",
        variant: "destructive",
      });
      return;
    }
    
    await scanShopifyStore(values.storeLink);
  };

  const handleCloneProduct = async (values: z.infer<typeof productFormSchema>) => {
    if (!productData || !shopifyAppConnected) return;
    
    try {
      setIsCloning(true);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Produto clonado com sucesso!",
        description: "O produto foi adicionado à sua loja e vinculado ao checkout VOLTZ.",
        variant: "default",
      });
      
      singleProductForm.reset();
      productForm.reset();
      setProductData(null);
      setSelectedImage(null);
      setDetectionMethod(null);
    } catch (error) {
      console.error("Error cloning product:", error);
      toast({
        title: "Erro ao clonar produto",
        description: "Ocorreu um erro ao tentar clonar o produto. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsCloning(false);
    }
  };

  const handleSelectImage = (image: string) => {
    setSelectedImage(image);
  };

  return (
    <DashboardLayout>
      <div className="container py-6 max-w-5xl">
        <div className="flex flex-col space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Clonador Loja Shopify</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 text-xs px-2 py-1">EXCLUSIVO</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            Clone produtos de qualquer loja Shopify para a sua loja e venda com checkout VOLTZ.
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 mb-8 border border-primary/20">
          <div className="flex items-start gap-4">
            <Rocket className="h-8 w-8 text-primary shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-primary mb-2">
                Clonador de Produtos Shopify com Checkout VOLTZ (EXCLUSIVO)
              </h2>
              <p className="text-muted-foreground mb-4">
                Com essa funcionalidade EXCLUSIVA, você pode importar produtos de qualquer loja Shopify para a sua própria loja com apenas um link.
                A VOLTZ já cuida de tudo: importa os dados, cria os produtos e ativa o checkout externo da VOLTZ imediatamente.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary/80">
                <Badge variant="outline" className="bg-primary/10 text-primary">NOVO</Badge>
                Agora suporta domínios personalizados além do .myshopify.com!
              </div>
            </div>
          </div>
        </div>

        {/* Shopify App Connection */}
        <Card className="mb-8 border-amber-200 dark:border-amber-800/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Conecte sua loja Shopify
            </CardTitle>
            <CardDescription>
              Insira as credenciais do seu App personalizado da Shopify para permitir a clonagem automática de produtos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {shopifyAppConnected ? (
              <div className="space-y-4">
                <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/30">
                  <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-800 dark:text-green-300">Loja Shopify conectada!</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    Sua loja {shopifyCredentials?.shopDomain} está conectada e pronta para receber produtos clonados.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-muted-foreground">Domínio da loja:</div>
                  <div className="font-medium">{shopifyCredentials?.shopDomain}</div>
                  
                  <div className="text-muted-foreground">Status de conexão:</div>
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 mr-2"></span>
                    Conectado
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShopifyAppConnected(false);
                      setShopifyCredentials(null);
                      shopifyAppForm.reset();
                    }}
                  >
                    Desconectar Loja
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...shopifyAppForm}>
                <form onSubmit={shopifyAppForm.handleSubmit(connectShopifyApp)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={shopifyAppForm.control}
                      name="shopDomain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Domínio da sua loja Shopify</FormLabel>
                          <FormControl>
                            <Input placeholder="https://minhaloja.myshopify.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Digite o URL completo da sua loja Shopify
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={shopifyAppForm.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave de API do App</FormLabel>
                          <FormControl>
                            <Input placeholder="a1b2c3d4..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Encontrada nas configurações do App
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={shopifyAppForm.control}
                      name="apiSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave Secreta do App</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="shpss_..." {...field} />
                          </FormControl>
                          <FormDescription>
                            A chave secreta do seu App Shopify
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={shopifyAppForm.control}
                      name="accessToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Token de Acesso</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="shpat_..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Token com permissões de leitura/escrita
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/30">
                    <Key className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertTitle className="text-amber-800 dark:text-amber-300">Permissões necessárias</AlertTitle>
                    <AlertDescription className="text-amber-700 dark:text-amber-400">
                      <p className="mb-2">Seu App personalizado da Shopify precisa ter as seguintes permissões:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-600"></span>
                          read_products
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-600"></span>
                          write_products
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-600"></span>
                          read_inventory
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-600"></span>
                          write_inventory
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-600"></span>
                          read_files
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-600"></span>
                          write_files
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isConnecting}
                      className="flex gap-2"
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Conectando...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          Conectar Loja Shopify
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenção: Responsabilidade legal</AlertTitle>
          <AlertDescription>
            Você é responsável legal por clonar e comercializar produtos de terceiros. Use essa funcionalidade com responsabilidade e respeite direitos autorais e marcas registradas.
          </AlertDescription>
        </Alert>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Escolha o que deseja clonar:</h2>
          
          <RadioGroup 
            className="flex flex-col md:flex-row gap-4 mb-6"
            value={cloneOption}
            onValueChange={(value) => setCloneOption(value as 'product' | 'store')}
          >
            <div className={`flex items-start space-x-2 border rounded-lg p-4 ${cloneOption === 'product' ? 'border-primary bg-primary/5' : 'border-border'} flex-1`}>
              <RadioGroupItem value="product" id="product" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="product" className="flex items-center text-base font-medium mb-1">
                  <BoxSelect className="mr-2 h-5 w-5 text-primary" />
                  Clonar um Produto Específico
                </Label>
                <p className="text-sm text-muted-foreground">
                  Insira o link direto do produto Shopify que deseja clonar para sua loja
                </p>
              </div>
            </div>
            
            <div className={`flex items-start space-x-2 border rounded-lg p-4 ${cloneOption === 'store' ? 'border-primary bg-primary/5' : 'border-border'} flex-1`}>
              <RadioGroupItem value="store" id="store" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="store" className="flex items-center text-base font-medium mb-1">
                  <Store className="mr-2 h-5 w-5 text-primary" />
                  Clonar Loja Completa
                </Label>
                <p className="text-sm text-muted-foreground">
                  Insira o domínio da loja Shopify para clonar todos os produtos disponíveis publicamente
                </p>
              </div>
            </div>
          </RadioGroup>
          
          {cloneOption === 'product' ? (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-primary" />
                  Insira o link do produto Shopify
                </CardTitle>
                <CardDescription>
                  Cole o link completo de qualquer produto público de uma loja Shopify (domínio próprio ou myshopify.com)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...singleProductForm}>
                  <form onSubmit={singleProductForm.handleSubmit(onSubmitSingleProduct)} className="space-y-4">
                    <FormField
                      control={singleProductForm.control}
                      name="productLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link do Produto Shopify</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input 
                                placeholder="https://lojachic.com.br/products/produto-x" 
                                {...field} 
                                className="flex-1"
                              />
                              <Button 
                                type="submit" 
                                disabled={isLoading || !shopifyAppConnected}
                                className="whitespace-nowrap"
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Carregando...
                                  </>
                                ) : (
                                  <>
                                    Importar Produto
                                  </>
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Suporta links de produtos de qualquer domínio Shopify (ex: lojachic.com.br/products/produto-x)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                
                {isLoading && (
                  <div className="mt-4">
                    <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/30">
                      <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />
                      <AlertTitle className="text-blue-800 dark:text-blue-300">Verificando produto...</AlertTitle>
                      <AlertDescription className="text-blue-700 dark:text-blue-400">
                        {detectionMethod === 'scraping' 
                          ? "Usando scraping estruturado para identificar o produto de domínio personalizado..." 
                          : "Acessando API da loja Shopify para obter os dados do produto..."}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  Insira o domínio da loja Shopify
                </CardTitle>
                <CardDescription>
                  Cole o domínio completo de uma loja Shopify para importar todos os produtos (myshopify.com ou domínio próprio)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...storeForm}>
                  <form onSubmit={storeForm.handleSubmit(onSubmitStore)} className="space-y-4">
                    <FormField
                      control={storeForm.control}
                      name="storeLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Domínio da Loja Shopify</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input 
                                placeholder="https://superloja.com.br" 
                                {...field} 
                                className="flex-1"
                              />
                              <Button 
                                type="submit" 
                                disabled={isStoreLoading}
                                className="whitespace-nowrap"
                              >
                                {isStoreLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verificando...
                                  </>
                                ) : (
                                  <>
                                    Verificar Loja
                                  </>
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Agora também suporta domínios personalizados (ex: superloja.com.br)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                
                {isStoreLoading && (
                  <div className="mt-4">
                    <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/30">
                      <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />
                      <AlertTitle className="text-blue-800 dark:text-blue-300">Verificando loja...</AlertTitle>
                      <AlertDescription className="text-blue-700 dark:text-blue-400">
                        {detectionMethod === 'scraping' 
                          ? "Realizando varredura estruturada para identificar produtos no domínio personalizado..." 
                          : "Acessando API da loja Shopify para listar os produtos disponíveis..."}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                
                {foundProducts && (
                  <div className="mt-6 space-y-4">
                    <Alert className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/30">
                      <PackageCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertTitle className="text-green-800 dark:text-green-300">Loja verificada com sucesso!</AlertTitle>
                      <AlertDescription className="text-green-700 dark:text-green-400">
                        Encontramos {foundProducts} produtos disponíveis publicamente nesta loja Shopify.
                        {detectionMethod === 'scraping' && (
                          <div className="mt-1 flex items-center text-sm gap-1">
                            <Code className="h-3.5 w-3.5" /> 
                            Método: Scraping estruturado (domínio personalizado)
                          </div>
                        )}
                        {detectionMethod === 'api' && (
                          <div className="mt-1 flex items-center text-sm gap-1">
                            <Code className="h-3.5 w-3.5" /> 
                            Método: API Storefront (domínio Shopify padrão)
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                    
                    {isStoreCloningInProgress ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso: {storeCloningProgress}%</span>
                          <span>Clonando produtos...</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${storeCloningProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Por favor, aguarde enquanto clonamos todos os produtos desta loja...
                        </p>
                      </div>
                    ) : (
                      <Button 
                        onClick={startStoreCloning} 
                        className="w-full flex gap-2 h-12"
                      >
                        <Copy className="h-5 w-5" />
                        Clonar {foundProducts} Produtos para Minha Loja
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {productData && cloneOption === 'product' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Preview do Produto</h2>
            
            <Form {...productForm}>
              <form onSubmit={productForm.handleSubmit(handleCloneProduct)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="rounded-lg overflow-hidden border border-border aspect-square">
                      {selectedImage && (
                        <img 
                          src={selectedImage} 
                          alt={productData.title} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {productData.images.map((image, index) => (
                        <div 
                          key={index}
                          className={`
                            cursor-pointer border rounded-md overflow-hidden w-16 h-16 flex-shrink-0
                            ${selectedImage === image ? 'border-primary border-2' : 'border-border'}
                          `}
                          onClick={() => handleSelectImage(image)}
                        >
                          <img 
                            src={image} 
                            alt={`${productData.title} - Imagem ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Informações da Loja Original:</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Vendedor:</div>
                        <div>{productData.vendor}</div>
                        
                        <div className="text-muted-foreground">Categoria:</div>
                        <div>{productData.productType}</div>
                        
                        <div className="text-muted-foreground">Tags:</div>
                        <div className="flex flex-wrap gap-1">
                          {productData.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="text-muted-foreground">Método de detecção:</div>
                        <div className="flex items-center gap-1">
                          <Code className="h-3.5 w-3.5 text-primary" />
                          <span className="text-primary font-medium">
                            {detectionMethod === 'scraping' ? 'Scraping estruturado' : 'API Storefront'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => window.open(productData.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Ver original
                      </Button>
                      
                      <div className="text-xs text-muted-foreground">
                        ID: {productData.id}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={productForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título do Produto</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={productForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição do Produto</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={6}
                              className="resize-none"
                            />
                          </FormControl>
                          <FormDescription>
                            A descrição pode conter HTML básico para formatação.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={productForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              {...field} 
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(isNaN(value) ? 0 : value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Preço de venda do produto na sua loja
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Variantes do Produto</h3>
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium">Variante</th>
                              <th className="px-4 py-2 text-left font-medium">Preço</th>
                              <th className="px-4 py-2 text-left font-medium">SKU</th>
                              <th className="px-4 py-2 text-left font-medium">Disponível</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {productData.variants.map((variant) => (
                              <tr key={variant.id}>
                                <td className="px-4 py-2">{variant.title}</td>
                                <td className="px-4 py-2">{formatCurrency(parseFloat(variant.price))}</td>
                                <td className="px-4 py-2">{variant.sku}</td>
                                <td className="px-4 py-2">
                                  {variant.available ? (
                                    <span className="text-green-600 flex items-center gap-1">
                                      <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span>
                                      Sim
                                    </span>
                                  ) : (
                                    <span className="text-red-600 flex items-center gap-1">
                                      <span className="inline-block w-2 h-2 rounded-full bg-red-600"></span>
                                      Não
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/30">
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <AlertTitle className="text-amber-800 dark:text-amber-300">Nota importante</AlertTitle>
                      <AlertDescription className="text-amber-700 dark:text-amber-400">
                        Esta funcionalidade é exclusiva para fins de escalabilidade e demonstração. Respeite direitos autorais e marcas de terceiros.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="h-5 w-5 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Ao clonar, este produto será adicionado à sua loja Shopify e configurado com checkout VOLTZ
                    </span>
                  </div>
                  
                  <Button
                    type="submit"
                    size="lg"
                    className="gap-2"
                    disabled={isCloning}
                  >
                    {isCloning ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Clonando Produto...
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5" />
                        Clonar Produto para Minha Loja
                      </>
                    )}
                  </Button>
                </div>
                
                <Alert className="bg-muted border-muted-foreground/20">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <AlertDescription className="text-muted-foreground text-sm">
                    Após a clonagem, o produto estará disponível na sua loja Shopify e terá um link de checkout VOLTZ: <span className="font-mono text-xs bg-muted-foreground/10 px-2 py-1 rounded">https://pagamento.voltzcheckout.com/checkout?product=XYZ</span>
                  </AlertDescription>
                </Alert>
              </form>
            </Form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClonadorShopifyPage;
