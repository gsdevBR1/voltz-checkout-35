
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductSelector from '@/components/marketing/ProductSelector';
import { Product } from '@/types/product';

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

const CriarCrossSellPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMainProducts, setSelectedMainProducts] = useState<string[]>([]);
  const [crossSellProductId, setCrossSellProductId] = useState<string>("");
  
  // Initialize the form
  const form = useForm<CrossSellFormValues>({
    resolver: zodResolver(crossSellFormSchema),
    defaultValues: {
      crossSellProductId: "",
      mainProductIds: [],
    },
  });

  // Handle form submission
  const onSubmit = (data: CrossSellFormValues) => {
    console.log("Form data submitted:", data);
    
    // Simulate API call to save the cross-sell
    setTimeout(() => {
      toast({
        title: "Cross-sell criado com sucesso!",
        description: "O cross-sell foi configurado e já está ativo nos checkouts selecionados.",
      });
      
      // Redirect to the cross-sell listing page
      navigate('/marketing/cross-sell');
    }, 1000);
  };

  // Handle product selection for main products where cross-sell will appear
  const handleMainProductsChange = (productIds: string[]) => {
    setSelectedMainProducts(productIds);
    form.setValue('mainProductIds', productIds, { shouldValidate: true });
  };

  // Handle the product selection for cross-sell product
  const handleCrossSellProductChange = (value: string) => {
    setCrossSellProductId(value);
    form.setValue('crossSellProductId', value, { shouldValidate: true });
  };

  // Get the selected cross-sell product
  const selectedCrossSellProduct = mockProducts.find(p => p.id === crossSellProductId);

  // Filter out the selected cross-sell product from main products options
  const mainProductOptions = crossSellProductId 
    ? mockProducts.filter(p => p.id !== crossSellProductId) 
    : mockProducts;

  return (
    <MarketingLayout 
      title="Criar Cross-Sell" 
      description="Configure um cross-sell para sugerir produtos complementares durante o checkout."
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
                      onValueChange={handleCrossSellProductChange}
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
                        Este cross-sell será exibido na finalização de pedidos com os seguintes produtos:
                      </FormDescription>
                    </div>
                    <FormControl>
                      <ProductSelector
                        products={mainProductOptions}
                        selectedProductIds={selectedMainProducts}
                        onChange={handleMainProductsChange}
                        title="Aplicar este cross-sell nos seguintes produtos"
                        excludedProductId={crossSellProductId}
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
              Salvar Cross-Sell
            </Button>
          </CardFooter>
        </form>
      </Form>
    </MarketingLayout>
  );
};

export default CriarCrossSellPage;
