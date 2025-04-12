
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ProductSelector from '@/components/marketing/ProductSelector';
import { Product } from '@/types/product';
import { CrossSell } from '@/types/crossSell';

// Mock data for products - in a real app, this would come from an API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Curso de Marketing Digital',
    type: 'digital',
    price: 297.00,
    description: 'Curso completo de marketing digital',
    stock: undefined,
    status: 'active',
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'E-book: Guia de SEO',
    type: 'digital',
    price: 47.00,
    description: 'Aprenda técnicas avançadas de SEO',
    stock: undefined,
    status: 'active',
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Camiseta Premium',
    type: 'physical',
    price: 89.90,
    description: 'Camiseta 100% algodão',
    stock: 50,
    status: 'active',
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Mousepad Ergonômico',
    type: 'physical',
    price: 39.90,
    description: 'Mousepad com apoio ergonômico',
    stock: 75,
    status: 'active',
    imageUrl: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock cross-sells for demo
const mockCrossSells: CrossSell[] = [
  {
    id: '1',
    crossSellProductId: '2',
    crossSellProductName: 'E-book: Guia de SEO',
    mainProductIds: ['1'],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    crossSellProductId: '4',
    crossSellProductName: 'Mousepad Ergonômico',
    mainProductIds: ['1', '3'],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Schema for form validation
const crossSellFormSchema = z.object({
  crossSellProductId: z.string({
    required_error: "Você precisa selecionar um produto para sugerir como cross-sell",
  }),
  mainProductIds: z.array(z.string()).min(1, {
    message: "Selecione pelo menos um produto principal onde este cross-sell será exibido",
  }),
});

type CrossSellFormValues = z.infer<typeof crossSellFormSchema>;

const EditarCrossSellPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [crossSell, setCrossSell] = useState<CrossSell | null>(null);
  const [selectedMainProducts, setSelectedMainProducts] = useState<string[]>([]);
  
  // Initialize the form
  const form = useForm<CrossSellFormValues>({
    resolver: zodResolver(crossSellFormSchema),
    defaultValues: {
      crossSellProductId: "",
      mainProductIds: [],
    },
  });

  // Load cross-sell data
  useEffect(() => {
    // Simulate API call to fetch cross-sell data
    setIsLoading(true);
    
    // Find cross-sell by ID
    const foundCrossSell = mockCrossSells.find(cs => cs.id === id);
    
    if (foundCrossSell) {
      setCrossSell(foundCrossSell);
      setSelectedMainProducts(foundCrossSell.mainProductIds);
      
      // Set form values
      form.setValue('crossSellProductId', foundCrossSell.crossSellProductId, { shouldValidate: true });
      form.setValue('mainProductIds', foundCrossSell.mainProductIds, { shouldValidate: true });
    } else {
      // Handle case when cross-sell is not found
      toast.error("Cross-sell não encontrado");
      navigate('/marketing/cross-sell');
    }
    
    setIsLoading(false);
  }, [id, form, navigate]);

  // Handle form submission
  const onSubmit = (data: CrossSellFormValues) => {
    if (!crossSell) return;
    
    console.log("Form data submitted:", data);
    
    // Simulate API call to update the cross-sell
    const updatedCrossSell: CrossSell = {
      ...crossSell,
      crossSellProductId: data.crossSellProductId,
      crossSellProductName: mockProducts.find(p => p.id === data.crossSellProductId)?.name || '',
      mainProductIds: data.mainProductIds,
      updatedAt: new Date(),
    };
    
    // Here we would update the cross-sell in the backend
    console.log("Updated cross-sell:", updatedCrossSell);
    
    setTimeout(() => {
      toast.success("Cross-sell atualizado com sucesso!");
      
      // Redirect to the cross-sell listing page
      navigate('/marketing/cross-sell');
    }, 800);
  };

  // Handle product selection for main products where cross-sell will appear
  const handleMainProductsChange = (productIds: string[]) => {
    console.log("Selected product IDs changed:", productIds);
    setSelectedMainProducts(productIds);
    form.setValue('mainProductIds', productIds, { shouldValidate: true });
  };

  // Get the selected cross-sell product
  const selectedCrossSellProduct = form.watch('crossSellProductId');

  // Filter out the selected cross-sell product from main products options
  const mainProductOptions = selectedCrossSellProduct 
    ? mockProducts.filter(p => p.id !== selectedCrossSellProduct) 
    : mockProducts;

  if (isLoading) {
    return (
      <MarketingLayout 
        title="Carregando..." 
        description="Obtendo dados do cross-sell..."
      >
        <div className="flex items-center justify-center p-8">
          <div className="animate-pulse text-primary">Carregando...</div>
        </div>
      </MarketingLayout>
    );
  }

  if (!crossSell) {
    return (
      <MarketingLayout 
        title="Cross-Sell não encontrado" 
        description="O cross-sell solicitado não existe ou foi removido."
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Não foi possível encontrar este cross-sell. Retorne à listagem e tente novamente.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate('/marketing/cross-sell')}>
            Voltar para a listagem
          </Button>
        </div>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout 
      title="Editar Cross-Sell" 
      description="Atualize a configuração deste cross-sell para sugerir produtos complementares durante o checkout."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Produto a ser sugerido como Cross-Sell</CardTitle>
              <CardDescription>
                Selecione o produto que será sugerido aos clientes como compra adicional.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="crossSellProductId"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-3">
                    <FormLabel>Produto Cross-Sell *</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        
                        // If the newly selected cross-sell is now part of the main products, remove it
                        if (selectedMainProducts.includes(value)) {
                          const newMainProducts = selectedMainProducts.filter(id => id !== value);
                          handleMainProductsChange(newMainProducts);
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o produto para oferecer como sugestão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - R$ {product.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Este é o produto que será oferecido como sugestão de compra adicional.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produtos onde o Cross-Sell será exibido</CardTitle>
              <CardDescription>
                Selecione em quais produtos do checkout este cross-sell será exibido.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="mainProductIds"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Produtos principais *</FormLabel>
                      <FormDescription>
                        Este cross-sell está vinculado a {selectedMainProducts.length} produto(s) e será exibido na finalização de pedidos com os seguintes produtos:
                      </FormDescription>
                    </div>
                    <FormControl>
                      <ProductSelector
                        products={mainProductOptions}
                        selectedProductIds={selectedMainProducts}
                        onChange={handleMainProductsChange}
                        title="Aplicar este cross-sell nos seguintes produtos"
                        excludedProductId={form.watch('crossSellProductId')}
                        description="Selecione os produtos onde este cross-sell será exibido durante o checkout."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <CardFooter className="flex justify-between border rounded-lg p-4 bg-muted/30">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/marketing/cross-sell')}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Salvar alterações
            </Button>
          </CardFooter>
        </form>
      </Form>
    </MarketingLayout>
  );
};

export default EditarCrossSellPage;
