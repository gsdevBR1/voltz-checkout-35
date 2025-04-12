
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Detalhes do OrderBump</h3>
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormLabel className="mt-0">Ativo</FormLabel>
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
                    <FormItem>
                      <FormLabel>Nome do OrderBump</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Garantia Estendida" {...field} />
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
                      <FormLabel>Descrição (será exibida no checkout)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: Adicione 12 meses de garantia ao seu produto" 
                          className="h-20 resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Resumo Visual</h3>
                
                <div className="space-y-3 bg-accent/30 p-4 rounded-md">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Este OrderBump aparece em:
                    </p>
                    <p className="font-medium">
                      {getTriggerProductsNames()}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Oferta:
                    </p>
                    <p className="font-medium">
                      {getOfferProductsNames()}
                    </p>
                  </div>
                </div>
                
                {initialData && onDuplicate && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onDuplicate}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicar este OrderBump
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="triggerProductIds"
              render={() => (
                <FormItem>
                  <div onClick={() => setShowTriggerProducts(!showTriggerProducts)} className="cursor-pointer">
                    <FormLabel className="text-lg font-medium">
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

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="offerProductIds"
              render={() => (
                <FormItem>
                  <div onClick={() => setShowOfferProducts(!showOfferProducts)} className="cursor-pointer">
                    <FormLabel className="text-lg font-medium">
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

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={watchTriggerProductIds.length === 0 || watchOfferProductIds.length === 0}
          >
            {initialData ? "Atualizar" : "Criar"} OrderBump
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OrderBumpForm;
