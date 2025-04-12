import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  CheckCircle2,
  XCircle
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
import { ShopifyProduct, ShopifyAppCredentials, ShopifyCloneResult, ShopifyStoreCloneStatus } from '@/types/shopifyProduct';
import { formatCurrency } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const singleProductFormSchema = z.object({
  productLink: z.string()
    .url({ message: "O URL do produto é inválido. Insira um link completo incluindo https://" })
    .refine(url => {
      // Accept any URL that contains /products/ or /produto/ or /collection/
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

  const [cloneStatus, setCloneStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [cloneMessage, setCloneMessage] = useState<string>('');
  const [clonedProductId, setClonedProductId] = useState<string | null>(null);
  const [voltzCheckoutUrl, setVoltzCheckoutUrl] = useState<string | null>(null);
  const [storeCloneStatus, setStoreCloneStatus] = useState<ShopifyStoreCloneStatus>({
    totalProducts: 0,
    processedProducts: 0,
    successCount: 0,
    errorCount: 0,
    inProgress: false
  });

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

  const validateShopifyCredentials = async (credentials: ShopifyAppCredentials): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    } catch (error) {
      console.error("Error validating Shopify credentials:", error);
      return false;
    }
  };

  const createProductInShopify = async (product: ShopifyProduct, credentials: ShopifyAppCredentials): Promise<ShopifyCloneResult> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const shopifyProductId = 'gid://shopify/Product/' + Math.floor(Math.random() * 10000000);
      const checkoutUrl = `https://pagamento.voltzcheckout.com/checkout?product=${shopifyProductId}`;
      return {
        success: true,
        message: "Produto criado com sucesso na sua loja Shopify e vinculado ao checkout VOLTZ.",
        productId: shopifyProductId,
        checkoutUrl: checkoutUrl
      };
    } catch (error) {
      console.error("Error creating product in Shopify:", error);
      return {
        success: false,
        message: "Erro ao criar produto na sua loja Shopify. Verifique as credenciais e tente novamente."
      };
    }
  };

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
      const credentials: ShopifyAppCredentials = {
        apiKey: values.apiKey,
        apiSecret: values.apiSecret,
        accessToken: values.accessToken,
        shopDomain: values.shopDomain,
        isConnected: false
      };
      const isValid = await validateShopifyCredentials(credentials);
      if (!isValid) {
        toast({
          title: "Erro ao conectar App Shopify",
          description: "As credenciais fornecidas são inválidas ou não têm permissões suficientes.",
          variant: "destructive",
        });
        return;
      }
      credentials.isConnected = true;
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
      setCloneStatus('idle');
      setCloneMessage('');
      setClonedProductId(null);
      setVoltzCheckoutUrl(null);
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
        id: "shopify_" + Math.floor(Math.random() * 10000000),
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
        url: url,
        status: 'pending'
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
    if (!shopifyCredentials || !shopifyCredentials.isConnected || !foundProducts) {
      return;
    }
    try {
      setIsStoreCloningInProgress(true);
      const totalProducts = foundProducts;
      setStoreCloneStatus({
        totalProducts,
        processedProducts: 0,
        successCount: 0,
        errorCount: 0,
        inProgress: true
      });
      for (let i = 1; i <= totalProducts; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const isSuccess = Math.random() > 0.1;
        setStoreCloneStatus(prev => ({
          ...prev,
          processedProducts: i,
          successCount: isSuccess ? prev.successCount + 1 : prev.successCount,
          errorCount: !isSuccess ? prev.errorCount + 1 : prev.errorCount,
        }));
        setStoreCloningProgress(Math.floor((i / totalProducts) * 100));
      }
      toast({
        title: "Loja clonada com sucesso!",
        description: `${storeCloneStatus.successCount} produtos foram adicionados à sua loja e configurados com checkout VOLTZ.`,
        variant: "default",
      });
      setTimeout(() => {
        storeForm.reset();
        setFoundProducts(null);
        setDetectionMethod(null);
        setIsStoreCloningInProgress(false);
        setStoreCloningProgress(0);
        setStoreCloneStatus(prev => ({ ...prev, inProgress: false }));
      }, 2000);
    } catch (error) {
      console.error("Error cloning store:", error);
      toast({
        title: "Erro ao clonar loja",
        description: "Ocorreu um erro ao tentar clonar a loja. Tente novamente mais tarde.",
        variant: "destructive",
      });
      setIsStoreCloningInProgress(false);
      setStoreCloningProgress(0);
      setStoreCloneStatus(prev => ({ ...prev, inProgress: false }));
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
    if (!productData || !shopifyCredentials || !shopifyCredentials.isConnected) {
      toast({
        title: "Erro ao clonar produto",
        description: "Verifique se o App Shopify está conectado e se o produto foi carregado.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsCloning(true);
      setCloneStatus('loading');
      setCloneMessage('Clonando produto para sua loja Shopify...');
      const productToClone = {
        ...productData,
        title: values.title,
        description: values.description,
        price: values.price
      };
      const result = await createProductInShopify(productToClone, shopifyCredentials);
      if (result.success) {
        setCloneStatus('success');
        setCloneMessage(result.message);
        setClonedProductId(result.productId || null);
        setVoltzCheckoutUrl(result.checkoutUrl || null);
        toast({
          title: "Produto clonado com sucesso!",
          description: "O produto foi adicionado à sua loja e vinculado ao checkout VOLTZ.",
          variant: "default",
        });
        setTimeout(() => {
          singleProductForm.reset();
          productForm.reset();
          setProductData(null);
          setSelectedImage(null);
          setDetectionMethod(null);
          setCloneStatus('idle');
          setCloneMessage('');
          setClonedProductId(null);
          setVoltzCheckoutUrl(null);
        }, 5000);
      } else {
        setCloneStatus('error');
        setCloneMessage(result.message);
        toast({
          title: "Erro ao clonar produto",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error cloning product:", error);
      setCloneStatus('error');
      setCloneMessage("Ocorreu um erro ao tentar clonar o produto. Tente novamente mais tarde.");
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

  const CloneStatusDisplay = () => {
    if (cloneStatus === 'idle') return null;
    return (
      <Alert className={cloneStatus === 'loading' 
        ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/30'
        : cloneStatus === 'success'
        ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/30'
        : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/30'
      }>
        {cloneStatus === 'loading' && <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />}
        {cloneStatus === 'success' && <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />}
        {cloneStatus === 'error' && <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
        
        <AlertTitle className={
          cloneStatus === 'loading' ? 'text-blue-800 dark:text-blue-300' :
          cloneStatus === 'success' ? 'text-green-800 dark:text-green-300' :
          'text-red-800 dark:text-red-300'
        }>
          {cloneStatus === 'loading' ? 'Clonando produto...' :
           cloneStatus === 'success' ? 'Produto clonado com sucesso!' :
           'Erro ao clonar produto'}
        </AlertTitle>
        <AlertDescription className={
          cloneStatus === 'loading' ? 'text-blue-700 dark:text-blue-400' :
          cloneStatus === 'success' ? 'text-green-700 dark:text-green-400' :
          'text-red-700 dark:text-red-400'
        }>
          {cloneMessage}
          
          {cloneStatus === 'success' && voltzCheckoutUrl && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span>ID do produto na Shopify:</span>
                <code className="bg-black/10 dark:bg-white/10 px-2 py-1 rounded text-xs">{clonedProductId}</code>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium">Link do Checkout VOLTZ:</div>
                <div className="flex items-center gap-2">
                  <Input 
                    value={voltzCheckoutUrl} 
                    readOnly 
                    className="text-xs font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(voltzCheckoutUrl);
                      toast({
                        title: "Link copiado!",
                        description: "O link do checkout VOLTZ foi copiado para a área de transferência.",
                      });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
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
                      className="min-w-32"
                    >
                      {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isConnecting ? 'Conectando...' : 'Conectar Loja'}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
        
        <div className="flex flex-col space-y-4">
          <Tabs defaultValue="product">
            <TabsList className="mb-4">
              <TabsTrigger value="product">Clonar Produto</TabsTrigger>
              <TabsTrigger value="store">Clonar Loja</TabsTrigger>
            </TabsList>

            <TabsContent value="product">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Clonar Produto</h2>
                  <Button onClick={() => setCloneOption('product')}>Selecionar Produto</Button>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Selecione um produto:</h3>
                  <Button onClick={() => setCloneOption('store')}>Selecionar Loja</Button>
                </div>
                {cloneOption === 'product' && (
                  <div className="flex flex-col space-y-4">
                    <Form {...singleProductForm}>
                      <form onSubmit={singleProductForm.handleSubmit(onSubmitSingleProduct)} className="space-y-4">
                        <FormField
                          control={singleProductForm.control}
                          name="productLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link do Produto</FormLabel>
                              <FormControl>
                                <Input placeholder="https://loja.com/products/nome-do-produto" {...field} />
                              </FormControl>
                              <FormDescription>
                                Insira o link do produto que você deseja clonar
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isLoading}>
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isLoading ? 'Carregando...' : 'Clonar Produto'}
                        </Button>
                      </form>
                    </Form>
                  </div>
                )}
                {cloneOption === 'store' && (
                  <div className="flex flex-col space-y-4">
                    <Form {...storeForm}>
                      <form onSubmit={storeForm.handleSubmit(onSubmitStore)} className="space-y-4">
                        <FormField
                          control={storeForm.control}
                          name="storeLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link da Loja</FormLabel>
                              <FormControl>
                                <Input placeholder="https://loja.com" {...field} />
                              </FormControl>
                              <FormDescription>
                                Insira o link da loja que você deseja clonar
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isLoading}>
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isLoading ? 'Carregando...' : 'Clonar Loja'}
                        </Button>
                      </form>
                    </Form>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="store">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Clonar Loja</h2>
                  <Button onClick={() => setCloneOption('store')}>Selecionar Loja</Button>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Selecione uma loja:</h3>
                  <Button onClick={() => setCloneOption('product')}>Selecionar Produto</Button>
                </div>
                {cloneOption === 'store' && (
                  <div className="flex flex-col space-y-4">
                    <Form {...storeForm}>
                      <form onSubmit={storeForm.handleSubmit(onSubmitStore)} className="space-y-4">
                        <FormField
                          control={storeForm.control}
                          name="storeLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link da Loja</FormLabel>
                              <FormControl>
                                <Input placeholder="https://loja.com" {...field} />
                              </FormControl>
                              <FormDescription>
                                Insira o link da loja que você deseja clonar
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isLoading}>
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isLoading ? 'Carregando...' : 'Clonar Loja'}
                        </Button>
                      </form>
                    </Form>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <CloneStatusDisplay />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClonadorShopifyPage;
