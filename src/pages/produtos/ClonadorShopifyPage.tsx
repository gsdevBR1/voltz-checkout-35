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
  XCircle,
  ArrowRight,
  RefreshCw,
  List
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
import { Checkbox } from '@/components/ui/checkbox';

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
    inProgress: false,
    integratedWithVoltz: 0
  });

  const [clonedProducts, setClonedProducts] = useState<ShopifyProduct[]>([]);
  const [showIntegrateStep, setShowIntegrateStep] = useState(false);
  const [isIntegrating, setIsIntegrating] = useState(false);
  const [selectedProductsForIntegration, setSelectedProductsForIntegration] = useState<string[]>([]);
  const [integrationProgress, setIntegrationProgress] = useState(0);

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
      
      const shopifyProductUrl = `${credentials.shopDomain}/products/${product.handle}`;
      
      return {
        success: true,
        message: "Produto criado com sucesso na sua loja Shopify.",
        productId: shopifyProductId,
        shopifyProductUrl: shopifyProductUrl,
        checkoutIntegrated: false
      };
    } catch (error) {
      console.error("Error creating product in Shopify:", error);
      return {
        success: false,
        message: "Erro ao criar produto na sua loja Shopify. Verifique as credenciais e tente novamente."
      };
    }
  };

  const integrateProductWithVoltz = async (productId: string): Promise<{ success: boolean; checkoutUrl?: string; message: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const checkoutUrl = `https://pagamento.voltzcheckout.com/checkout?product=${productId}`;
      
      return {
        success: true,
        checkoutUrl,
        message: "Produto integrado com sucesso ao checkout VOLTZ."
      };
    } catch (error) {
      console.error("Error integrating product with VOLTZ:", error);
      return {
        success: false,
        message: "Erro ao integrar produto com checkout VOLTZ."
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
        inProgress: true,
        integratedWithVoltz: 0
      });
      
      const clonedProductsList: ShopifyProduct[] = [];
      
      for (let i = 1; i <= totalProducts; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess) {
          const mockProduct: ShopifyProduct = {
            id: `shopify_${Math.floor(Math.random() * 10000000)}`,
            title: `Produto Clonado ${i}`,
            description: "<p>Descrição do produto clonado</p>",
            price: 99.99 + i,
            compareAtPrice: 129.99 + i,
            images: ["https://placekitten.com/500/500"],
            variants: [
              {
                id: `variant_${i}_1`,
                title: "Padrão",
                price: `${99.99 + i}`,
                available: true,
                sku: `SKU-${i}`,
                options: []
              }
            ],
            options: [],
            vendor: "Loja Original",
            productType: "Produto Clonado",
            handle: `produto-clonado-${i}`,
            tags: ["clonado", "shopify"],
            url: `https://original-store.com/products/produto-${i}`,
            status: 'cloned',
            clonedProductId: `gid://shopify/Product/${Math.floor(Math.random() * 10000000)}`,
            shopifyProductUrl: `${shopifyCredentials.shopDomain}/products/produto-clonado-${i}`,
            isIntegratedWithVoltz: false
          };
          
          clonedProductsList.push(mockProduct);
        }
        
        setStoreCloneStatus(prev => ({
          ...prev,
          processedProducts: i,
          successCount: isSuccess ? prev.successCount + 1 : prev.successCount,
          errorCount: !isSuccess ? prev.errorCount + 1 : prev.errorCount,
        }));
        
        setStoreCloningProgress(Math.floor((i / totalProducts) * 100));
      }
      
      setClonedProducts(clonedProductsList);
      
      toast({
        title: "Produtos clonados com sucesso!",
        description: `${storeCloneStatus.successCount} produtos foram adicionados à sua loja Shopify. Agora você pode integrar com o checkout VOLTZ.`,
        variant: "default",
      });
      
      setShowIntegrateStep(true);
      
      setIsStoreCloningInProgress(false);
      setStoreCloningProgress(0);
      setStoreCloneStatus(prev => ({ ...prev, inProgress: false }));
      
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
        const clonedProduct: ShopifyProduct = {
          ...productToClone,
          status: 'cloned',
          clonedProductId: result.productId,
          shopifyProductUrl: result.shopifyProductUrl,
          isIntegratedWithVoltz: false
        };
        
        setClonedProducts(prev => [...prev, clonedProduct]);
        
        setCloneStatus('success');
        setCloneMessage("Produto clonado com sucesso para sua loja Shopify. Agora você pode integrá-lo ao checkout VOLTZ.");
        
        toast({
          title: "Produto clonado com sucesso!",
          description: "O produto foi adicionado à sua loja Shopify. Agora você pode integrá-lo ao checkout VOLTZ.",
          variant: "default",
        });
        
        setShowIntegrateStep(true);
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

  const handleIntegrateWithVoltz = async (productIds: string[]) => {
    if (productIds.length === 0) {
      toast({
        title: "Nenhum produto selecionado",
        description: "Selecione pelo menos um produto para integrar com o checkout VOLTZ.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsIntegrating(true);
      
      const updatedProducts = [...clonedProducts];
      let integratedCount = 0;
      
      for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];
        setIntegrationProgress(Math.floor((i / productIds.length) * 100));
        
        const productIndex = updatedProducts.findIndex(p => p.clonedProductId === productId);
        if (productIndex !== -1) {
          const integrationResult = await integrateProductWithVoltz(productId);
          
          if (integrationResult.success) {
            updatedProducts[productIndex] = {
              ...updatedProducts[productIndex],
              status: 'integrated',
              voltzCheckoutUrl: integrationResult.checkoutUrl,
              isIntegratedWithVoltz: true
            };
            integratedCount++;
          } else {
            updatedProducts[productIndex] = {
              ...updatedProducts[productIndex],
              status: 'error',
              errorMessage: integrationResult.message
            };
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setClonedProducts(updatedProducts);
      
      setSelectedProductsForIntegration([]);
      
      toast({
        title: "Produtos integrados com sucesso!",
        description: `${integratedCount} produtos foram integrados ao checkout VOLTZ e estão prontos para venda.`,
        variant: "default",
      });
      
    } catch (error) {
      console.error("Error integrating products with VOLTZ:", error);
      toast({
        title: "Erro ao integrar produtos",
        description: "Ocorreu um erro ao tentar integrar os produtos com o checkout VOLTZ. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsIntegrating(false);
      setIntegrationProgress(0);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductsForIntegration(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAllProducts = () => {
    const unintegratedProductIds = clonedProducts
      .filter(p => !p.isIntegratedWithVoltz)
      .map(p => p.clonedProductId || '');
    
    if (unintegratedProductIds.length === selectedProductsForIntegration.length) {
      setSelectedProductsForIntegration([]);
    } else {
      setSelectedProductsForIntegration(unintegratedProductIds.filter(Boolean));
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

  const ClonedProductsList = () => {
    if (clonedProducts.length === 0) return null;
    
    const unintegratedProducts = clonedProducts.filter(p => !p.isIntegratedWithVoltz);
    const integratedProducts = clonedProducts.filter(p => p.isIntegratedWithVoltz);
    
    return (
      <div className="space-y-6 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Produtos Clonados</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAllProducts}
              disabled={unintegratedProducts.length === 0}
              className="text-xs"
            >
              {selectedProductsForIntegration.length === unintegratedProducts.length && unintegratedProducts.length > 0 
                ? "Desmarcar Todos" 
                : "Selecionar Todos"}
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleIntegrateWithVoltz(selectedProductsForIntegration)}
              disabled={selectedProductsForIntegration.length === 0 || isIntegrating}
              className="text-xs"
            >
              {isIntegrating && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
              {isIntegrating ? "Integrando..." : "Integrar Selecionados"}
            </Button>
          </div>
        </div>
        
        {isIntegrating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Integrando produtos com checkout VOLTZ...</span>
              <span>{integrationProgress}%</span>
            </div>
            <Progress value={integrationProgress} className="h-2" />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unintegratedProducts.map(product => (
            <Card key={product.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{product.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      ID: {product.clonedProductId}
                    </CardDescription>
                  </div>
                  <Checkbox 
                    id={`product-${product.id}`}
                    checked={selectedProductsForIntegration.includes(product.clonedProductId || '')}
                    onCheckedChange={() => toggleProductSelection(product.clonedProductId || '')}
                  />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">Clonado ✅</Badge>
                  <Badge variant="warning" className="text-xs">Checkout não vinculado ⚠️</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  <div className="flex items-center gap-1 mt-1">
                    <Store className="h-3 w-3" />
                    <a 
                      href={product.shopifyProductUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {product.shopifyProductUrl}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {integratedProducts.length > 0 && (
          <>
            <Separator className="my-6" />
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Produtos Integrados ao Checkout</h3>
              <Badge variant="success" className="text-xs">
                {integratedProducts.length} produto(s) com checkout VOLTZ ativo 🟢
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integratedProducts.map(product => (
                <Card key={product.id} className="relative border-green-200 dark:border-green-800/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{product.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      ID: {product.clonedProductId}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">Clonado ✅</Badge>
                      <Badge variant="success" className="text-xs">Checkout VOLTZ ativo 🟢</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <div className="flex items-center gap-1 mt-1">
                        <Store className="h-3 w-3" />
                        <a 
                          href={product.shopifyProductUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {product.shopifyProductUrl}
                        </a>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <ShoppingCart className="h-3 w-3" />
                        <a 
                          href={product.voltzCheckoutUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {product.voltzCheckoutUrl}
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col space-y-3 md:flex-row md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Clonador Shopify (POKY)</h1>
            <p className="text-muted-foreground">
              Importe produtos de outras lojas Shopify diretamente para sua loja.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Conexão Shopify App</CardTitle>
            <CardDescription>
              Primeiro, conecte sua loja Shopify através de um App privado para que possamos importar produtos para ela.
            </CardDescription>
            <div className="flex gap-1 mt-2">
              <Badge variant={shopifyAppConnected ? "success" : "outline"} className="text-xs">
                {shopifyAppConnected ? (
                  <>
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    App Shopify Conectado
                  </>
                ) : (
                  <>
                    <AlertCircle className="mr-1 h-3 w-3" />
                    App Shopify Não Conectado
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="default">
              <LockKeyhole className="h-4 w-4" />
              <AlertTitle>Instruções de Conexão</AlertTitle>
              <AlertDescription>
                <div className="space-y-2 mt-2">
                  <p>Para conectar sua loja Shopify, você precisa criar um App Privado na sua loja com as seguintes permissões:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>read_products, write_products</li>
                    <li>read_inventory, write_inventory</li>
                    <li>read_files, write_files</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <Form {...shopifyAppForm}>
              <form onSubmit={shopifyAppForm.handleSubmit(connectShopifyApp)} className="space-y-4">
                <FormField
                  control={shopifyAppForm.control}
                  name="shopDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Loja Shopify</FormLabel>
                      <FormControl>
                        <Input placeholder="https://sua-loja.myshopify.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Insira o URL completo da sua loja Shopify
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={shopifyAppForm.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input placeholder="abcd1234..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={shopifyAppForm.control}
                    name="apiSecret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Secret</FormLabel>
                        <FormControl>
                          <Input placeholder="shpss_xyz..." type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={shopifyAppForm.control}
                  name="accessToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Token</FormLabel>
                      <FormControl>
                        <Input placeholder="shpat_123..." type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isConnecting || shopifyAppConnected}>
                  {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {shopifyAppConnected ? 'Conectado' : isConnecting ? 'Conectando...' : 'Conectar App Shopify'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {shopifyAppConnected && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Importação de Produtos</CardTitle>
              <CardDescription>
                Escolha entre importar um produto específico ou escanear uma loja para importar todos os produtos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={cloneOption} onValueChange={(value) => setCloneOption(value as 'product' | 'store')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="product">Produto Único</TabsTrigger>
                  <TabsTrigger value="store">Loja Completa</TabsTrigger>
                </TabsList>
                <TabsContent value="product" className="space-y-4 mt-4">
                  <Form {...singleProductForm}>
                    <form onSubmit={singleProductForm.handleSubmit(onSubmitSingleProduct)} className="space-y-4">
                      <FormField
                        control={singleProductForm.control}
                        name="productLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Link do Produto</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://loja.com/products/produto" 
                                {...field} 
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormDescription>
                              Cole o link direto para um produto de qualquer loja Shopify
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Buscando...' : 'Buscar Produto'}
                      </Button>
                    </form>
                  </Form>
                  
                  {productData && (
                    <div className="mt-8 space-y-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Produto Encontrado</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="relative rounded-md overflow-hidden border aspect-square">
                              {selectedImage && (
                                <img 
                                  src={selectedImage} 
                                  alt={productData.title} 
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            {productData.images.length > 1 && (
                              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                                {productData.images.map((image, idx) => (
                                  <div 
                                    key={idx}
                                    className={`border rounded cursor-pointer h-16 w-16 flex-shrink-0 ${
                                      selectedImage === image ? 'border-primary' : 'border-border'
                                    }`}
                                    onClick={() => handleSelectImage(image)}
                                  >
                                    <img 
                                      src={image} 
                                      alt={`${productData.title} - Imagem ${idx + 1}`} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-4">
                            {detectionMethod && (
                              <Badge variant="outline" className="mb-2">
                                {detectionMethod === 'api' ? (
                                  <>
                                    <Code className="mr-1 h-3 w-3" />
                                    Via API Storefront
                                  </>
                                ) : (
                                  <>
                                    <BoxSelect className="mr-1 h-3 w-3" />
                                    Via Scraping Estruturado
                                  </>
                                )}
                              </Badge>
                            )}
                            
                            <Form {...productForm}>
                              <form onSubmit={productForm.handleSubmit(handleCloneProduct)} className="space-y-4">
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
                                      <FormLabel>Descrição</FormLabel>
                                      <FormControl>
                                        <Textarea 
                                          {...field} 
                                          rows={6} 
                                          className="font-mono text-xs resize-none"
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Permite formatação HTML
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
                                      <FormLabel>Preço</FormLabel>
                                      <FormControl>
                                        <Input 
                                          {...field} 
                                          type="number" 
                                          step="0.01" 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <div className="pt-2">
                                  <Button
                                    type="submit"
                                    disabled={isCloning}
                                    className="w-full"
                                  >
                                    {isCloning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isCloning 
                                      ? 'Clonando produto...' 
                                      : 'Clonar para Minha Loja Shopify'}
                                  </Button>
                                </div>
                              </form>
                            </Form>
                            
                            <CloneStatusDisplay />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Detalhes do Produto Original</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium">Marca</div>
                              <div className="text-sm text-muted-foreground">{productData.vendor}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Tipo</div>
                              <div className="text-sm text-muted-foreground">{productData.productType}</div>
                            </div>
                          </div>
                          
                          {productData.variants.length > 0 && (
                            <div>
                              <div className="text-sm font-medium mb-2">Variantes ({productData.variants.length})</div>
                              <div className="space-y-2">
                                {productData.variants.map((variant) => (
                                  <div key={variant.id} className="bg-secondary/50 p-2 rounded-md">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-sm">{variant.title}</div>
                                        <div className="text-xs text-muted-foreground">
                                          SKU: {variant.sku || 'N/A'}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="text-sm font-medium">
                                          {variant.price}
                                        </div>
                                        <Badge variant={variant.available ? "success" : "outline"} className="text-xs">
                                          {variant.available ? 'Disponível' : 'Indisponível'}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="store" className="space-y-4 mt-4">
                  <Form {...storeForm}>
                    <form onSubmit={storeForm.handleSubmit(onSubmitStore)} className="space-y-4">
                      <FormField
                        control={storeForm.control}
                        name="storeLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Link da Loja</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://loja.com" 
                                {...field} 
                                disabled={isStoreLoading}
                              />
                            </FormControl>
                            <FormDescription>
                              Cole o link para uma loja Shopify para escanear seus produtos
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isStoreLoading}>
                        {isStoreLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isStoreLoading ? 'Escaneando...' : 'Escanear Loja'}
                      </Button>
                    </form>
                  </Form>
                  
                  {foundProducts !== null && (
                    <Alert className="mt-6">
                      <Store className="h-4 w-4" />
                      <AlertTitle>Loja Shopify Encontrada</AlertTitle>
                      <AlertDescription>
                        <div className="mt-2">
                          <p>Encontramos {foundProducts} produtos disponíveis para importação.</p>
                          <Button 
                            className="w-full mt-4" 
                            onClick={startStoreCloning}
                            disabled={isStoreCloningInProgress}
                          >
                            {isStoreCloningInProgress && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isStoreCloningInProgress 
                              ? 'Clonando produtos...' 
                              : 'Importar Todos os Produtos'}
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {isStoreCloningInProgress && (
                    <div className="space-y-4 mt-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Clonando produtos...</div>
                          <div className="text-sm text-muted-foreground">
                            {storeCloneStatus.processedProducts} de {storeCloneStatus.totalProducts} produtos
                          </div>
                        </div>
                        <div className="text-sm">
                          {storeCloningProgress}%
                        </div>
                      </div>
                      <Progress value={storeCloningProgress} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-sm">{storeCloneStatus.successCount} sucesso</span>
                          </div>
                          <div className="flex items-center">
                            <XCircle className="mr-1 h-4 w-4 text-red-500" />
                            <span className="text-sm">{storeCloneStatus.errorCount} falhas</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
        
        {showIntegrateStep && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Integração com Checkout VOLTZ</CardTitle>
              <CardDescription>
                Após clonar os produtos para sua loja Shopify, você pode integrá-los ao checkout VOLTZ.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="default" className="mb-6">
                <ShoppingCart className="h-4 w-4" />
                <AlertTitle>Como funciona a integração com checkout VOLTZ?</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2 mt-2">
                    <p>Ao integrar seus produtos com o checkout VOLTZ, você terá acesso a recursos como:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Upsells, Order Bumps e Cross-Sells</li>
                      <li>One-Click Checkout otimizado para conversão</li>
                      <li>Abandonment Recovery automático</li>
                      <li>Analytics de conversão avançados</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
              
              <ClonedProductsList />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClonadorShopifyPage;
