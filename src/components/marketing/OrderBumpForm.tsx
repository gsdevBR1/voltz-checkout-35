
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Copy } from 'lucide-react';
import ProductSelector from '@/components/marketing/ProductSelector';
import { Product } from '@/types/product';
import { OrderBump, OrderBumpFormData } from '@/types/orderBump';

const formSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  description: z.string().min(1, { message: "Descrição é obrigatória" }),
  isActive: z.boolean().default(true),
  triggerProductIds: z.array(z.string()).min(1, { 
    message: "Você precisa escolher ao menos um produto onde o OrderBump será aplicado" 
  }),
  offerProductIds: z.array(z.string()).min(1, { 
    message: "Você precisa selecionar ao menos um produto para oferecer como OrderBump" 
  })
});

interface OrderBumpFormProps {
  onSubmit: (data: OrderBumpFormData) => void;
  onCancel: () => void;
  initialData?: OrderBump;
  products: Product[];
  onDuplicate?: () => void;
}

const OrderBumpForm: React.FC<OrderBumpFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  products,
  onDuplicate
}) => {
  const [showTriggerProducts, setShowTriggerProducts] = useState(true);
  const [showOfferProducts, setShowOfferProducts] = useState(true);
  
  const form = useForm<OrderBumpFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      isActive: initialData.isActive,
      triggerProductIds: initialData.triggerProductIds,
      offerProductIds: initialData.offerProductIds
    } : {
      name: '',
      description: '',
      isActive: true,
      triggerProductIds: [],
      offerProductIds: []
    }
  });

  const watchTriggerProductIds = form.watch('triggerProductIds');
  const watchOfferProductIds = form.watch('offerProductIds');

  const handleSubmit = (data: OrderBumpFormData) => {
    onSubmit(data);
  };

  // Format product names for summary display
  const getTriggerProductsNames = () => {
    if (!watchTriggerProductIds || watchTriggerProductIds.length === 0) return "Nenhum produto selecionado";
    
    return watchTriggerProductIds
      .map(id => products.find(p => p.id === id)?.name || 'Produto desconhecido')
      .join(', ');
  };

  const getOfferProductsNames = () => {
    if (!watchOfferProductIds || watchOfferProductIds.length === 0) return "Nenhum produto selecionado";
    
    return watchOfferProductIds
      .map(id => products.find(p => p.id === id)?.name || 'Produto desconhecido')
      .join(', ');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium">Detalhes do OrderBump</h3>
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel className="mt-0 text-base">Ativo</FormLabel>
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
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="text-base">Nome do OrderBump</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Garantia Estendida" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Descrição (será exibida no checkout)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ex: Adicione 12 meses de garantia ao seu produto" 
                        className="h-28 resize-none text-base"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="pt-6 space-y-6">
              <h3 className="text-xl font-medium mb-6">Resumo Visual</h3>
              
              <div className="space-y-5 bg-accent/30 p-6 rounded-md">
                <div className="space-y-2">
                  <p className="text-base font-medium text-muted-foreground">
                    Este OrderBump aparece em:
                  </p>
                  <p className="font-medium text-base">
                    {getTriggerProductsNames()}
                  </p>
                </div>
                
                <Separator className="my-2" />
                
                <div className="space-y-2">
                  <p className="text-base font-medium text-muted-foreground">
                    Oferta:
                  </p>
                  <p className="font-medium text-base">
                    {getOfferProductsNames()}
                  </p>
                </div>
              </div>
              
              {initialData && onDuplicate && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base mt-4"
                  onClick={onDuplicate}
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Duplicar este OrderBump
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="pt-6 pb-8">
            <FormField
              control={form.control}
              name="triggerProductIds"
              render={() => (
                <FormItem>
                  <div 
                    onClick={() => setShowTriggerProducts(!showTriggerProducts)} 
                    className="cursor-pointer mb-6"
                  >
                    <FormLabel className="text-xl font-medium">
                      Este OrderBump será exibido nos checkouts dos seguintes produtos:
                    </FormLabel>
                  </div>
                  <FormControl>
                    {showTriggerProducts && (
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
                        description="Apenas nos checkouts destes produtos o OrderBump será exibido"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="pt-6 pb-8">
            <FormField
              control={form.control}
              name="offerProductIds"
              render={() => (
                <FormItem>
                  <div 
                    onClick={() => setShowOfferProducts(!showOfferProducts)} 
                    className="cursor-pointer mb-6"
                  >
                    <FormLabel className="text-xl font-medium">
                      Produto(s) que serão oferecidos como OrderBump:
                    </FormLabel>
                  </div>
                  <FormControl>
                    {showOfferProducts && (
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
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {(watchTriggerProductIds.length === 0 || watchOfferProductIds.length === 0) && (
          <Alert variant="destructive" className="border-destructive/50 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {watchTriggerProductIds.length === 0 ? 
                "Você precisa escolher ao menos um produto onde o OrderBump será aplicado." : 
                "Você precisa selecionar ao menos um produto para oferecer como OrderBump."
              }
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end space-x-4 border-t pt-8 mt-10">
          <Button variant="outline" type="button" onClick={onCancel} className="h-12 text-base px-6">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={watchTriggerProductIds.length === 0 || watchOfferProductIds.length === 0}
            className="h-12 text-base px-6"
          >
            {initialData ? "Atualizar" : "Criar"} OrderBump
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OrderBumpForm;
