
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  Link as LinkIcon, 
  Loader2, 
  PackageCheck, 
  Rocket, 
  ShoppingCart
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
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ShopifyProduct } from '@/types/shopifyProduct';

// Form schema for the product link
const formSchema = z.object({
  productLink: z.string()
    .url({ message: "O URL do produto é inválido." })
    .refine(
      (url) => url.includes('shopify.com') || url.includes('.myshopify.com'), 
      { message: "O URL deve ser de uma loja Shopify." }
    ),
});

// Form schema for the editable product details
const productFormSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres." }),
  description: z.string(),
  price: z.coerce.number().min(0.01, { message: "O preço deve ser maior que zero." }),
});

const ClonadorShopifyPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [productData, setProductData] = useState<ShopifyProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  // Form for the product link
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productLink: '',
    },
  });

  // Form for the product details
  const productForm = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    },
  });

  // Function to fetch product data from Shopify
  const fetchProductData = async (url: string) => {
    try {
      setIsLoading(true);
      // In a real implementation, this would be an API call to your backend
      // which would then fetch the product data from Shopify
      // For demo purposes, we'll simulate a response
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Mock data for demonstration
      const mockProduct: ShopifyProduct = {
        id: "shopify_1234567890",
        title: "Produto Demonstrativo Shopify",
        description: "<p>Esta é uma descrição de produto de exemplo com <strong>formatação HTML</strong> que foi importada de uma loja Shopify.</p><p>Características:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>",
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
      
      // Set the form values
      productForm.reset({
        title: mockProduct.title,
        description: mockProduct.description,
        price: mockProduct.price,
      });
      
      toast({
        title: "Produto encontrado!",
        description: "Os dados do produto foram carregados com sucesso.",
        variant: "success",
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

  // Handle form submission for the product link
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await fetchProductData(values.productLink);
  };

  // Handle cloning the product to the user's store
  const handleCloneProduct = async (values: z.infer<typeof productFormSchema>) => {
    if (!productData) return;
    
    try {
      setIsCloning(true);
      
      // In a real implementation, this would be an API call to your backend
      // which would then create the product in the user's Shopify store
      // and create a corresponding product in the VOLTZ platform
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      
      toast({
        title: "Produto clonado com sucesso!",
        description: "O produto foi adicionado à sua loja e vinculado ao checkout VOLTZ.",
        variant: "success",
      });
      
      // Reset the forms and state
      form.reset();
      productForm.reset();
      setProductData(null);
      setSelectedImage(null);
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

  // Handle selecting an image
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
              <Badge variant="success" className="text-xs px-2 py-1">EXCLUSIVO</Badge>
              <Badge className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-2 py-1">🔥 Novo</Badge>
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
              <p className="text-muted-foreground">
                Com essa funcionalidade inédita no mercado, você pode importar produtos de outras lojas Shopify para sua própria loja com apenas um link — e já receber o produto com checkout da VOLTZ pronto para vender. Ideal para dropshippers, testadores de produto e lojas de escala.
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-primary" />
              Insira o link do produto Shopify
            </CardTitle>
            <CardDescription>
              Cole o link completo de qualquer produto público de uma loja Shopify
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="productLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link do Produto Shopify</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="https://outraloja.myshopify.com/products/produto-x" 
                            {...field} 
                            className="flex-1"
                          />
                          <Button 
                            type="submit" 
                            disabled={isLoading}
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
                        Insira o link completo, incluindo https://
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {productData && (
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
                                <td className="px-4 py-2">R$ {variant.price}</td>
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
