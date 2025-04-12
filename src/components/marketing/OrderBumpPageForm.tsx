
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Save, ArrowLeft, Box, Target } from 'lucide-react';
import ProductSelector from '@/components/marketing/ProductSelector';
import { Product } from '@/types/product';
import { OrderBump, OrderBumpFormData } from '@/types/orderBump';

const formSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  isActive: z.boolean().default(true),
  triggerProductIds: z.array(z.string()).min(1, { 
    message: "Você precisa escolher ao menos um produto onde o OrderBump será aplicado" 
  }),
  offerProductIds: z.array(z.string()).min(1, { 
    message: "Você precisa selecionar ao menos um produto para oferecer como OrderBump" 
  }),
});

type OrderBumpPageFormData = z.infer<typeof formSchema>;

interface OrderBumpPageFormProps {
  onSubmit: (data: OrderBumpPageFormData) => void;
  onCancel: () => void;
  initialData?: OrderBump;
  products: Product[];
  onDuplicate?: () => void;
}

const OrderBumpPageForm: React.FC<OrderBumpPageFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  products,
  onDuplicate
}) => {
  const form = useForm<OrderBumpPageFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      isActive: initialData.isActive,
      triggerProductIds: initialData.triggerProductIds,
      offerProductIds: initialData.offerProductIds,
    } : {
      name: '',
      isActive: true,
      triggerProductIds: [],
      offerProductIds: [],
    }
  });

  const watchTriggerProductIds = form.watch('triggerProductIds');
  const watchOfferProductIds = form.watch('offerProductIds');

  const handleSubmit = (data: OrderBumpPageFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-8">
          {/* Basic Configuration Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary">
                <CardTitle className="text-xl">Identificação</CardTitle>
              </div>
              <CardDescription>
                Configure as informações básicas do OrderBump
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel className="mt-0 text-base">Status do OrderBump</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                          <span className={field.value ? "text-green-600" : "text-muted-foreground"}>
                            {field.value ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="text-base">Nome do OrderBump</FormLabel>
                    <FormDescription>
                      Um nome para identificar este OrderBump
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Ex: Garantia Estendida" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Product Selection Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary">
                <Box className="h-5 w-5" />
                <CardTitle className="text-xl">Produtos Oferecidos</CardTitle>
              </div>
              <CardDescription>
                Produto(s) a serem oferecidos como OrderBump
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <FormField
                control={form.control}
                name="offerProductIds"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <ProductSelector
                        products={products}
                        selectedProductIds={watchOfferProductIds}
                        onSelectProduct={(productId) => {
                          const current = form.getValues().offerProductIds || [];
                          if (current.includes(productId)) {
                            form.setValue('offerProductIds', current.filter(id => id !== productId));
                          } else {
                            form.setValue('offerProductIds', [...current, productId]);
                          }
                        }}
                        onSelectAllFiltered={() => {
                          form.setValue('offerProductIds', products.map(p => p.id));
                        }}
                        onApplyToAllProducts={(checked) => {
                          if (checked) {
                            form.setValue('offerProductIds', products.map(p => p.id));
                          } else {
                            form.setValue('offerProductIds', []);
                          }
                        }}
                        applyToAllProducts={watchOfferProductIds.length === products.length}
                        title="Selecione os produtos a oferecer"
                        description="Estes produtos serão oferecidos como order bump no checkout"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Product Display Configuration Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary">
                <Target className="h-5 w-5" />
                <CardTitle className="text-xl">Exibição no Checkout</CardTitle>
              </div>
              <CardDescription>
                Configure onde seu OrderBump será exibido
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <FormField
                control={form.control}
                name="triggerProductIds"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base mb-2 block">
                      Este OrderBump será exibido nos seguintes produtos principais
                    </FormLabel>
                    <FormDescription className="mb-4">
                      Selecione em quais checkouts de produtos este OrderBump aparecerá
                    </FormDescription>
                    <FormControl>
                      <ProductSelector
                        products={products}
                        selectedProductIds={watchTriggerProductIds}
                        onSelectProduct={(productId) => {
                          const current = form.getValues().triggerProductIds || [];
                          if (current.includes(productId)) {
                            form.setValue('triggerProductIds', current.filter(id => id !== productId));
                          } else {
                            form.setValue('triggerProductIds', [...current, productId]);
                          }
                        }}
                        onSelectAllFiltered={() => {
                          form.setValue('triggerProductIds', products.map(p => p.id));
                        }}
                        onApplyToAllProducts={(checked) => {
                          if (checked) {
                            form.setValue('triggerProductIds', products.map(p => p.id));
                          } else {
                            form.setValue('triggerProductIds', []);
                          }
                        }}
                        applyToAllProducts={watchTriggerProductIds.length === products.length}
                        title="Selecione os produtos principais"
                        description="O OrderBump será exibido nos checkouts destes produtos, conforme configuração do builder."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {(watchTriggerProductIds.length === 0 || watchOfferProductIds.length === 0) && (
          <Alert variant="destructive" className="mt-6 border-destructive/50 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {watchTriggerProductIds.length === 0 ? 
                "Você precisa escolher ao menos um produto onde o OrderBump será aplicado." : 
                "Você precisa selecionar ao menos um produto para oferecer como OrderBump."
              }
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center space-x-4 border-t pt-8 mt-10 sticky bottom-0 bg-background py-4 z-10">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel} 
            className="h-12 text-base px-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={watchTriggerProductIds.length === 0 || watchOfferProductIds.length === 0}
            className="h-12 text-base px-6 bg-green-600 hover:bg-green-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {initialData ? "Atualizar" : "Criar"} OrderBump
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OrderBumpPageForm;
