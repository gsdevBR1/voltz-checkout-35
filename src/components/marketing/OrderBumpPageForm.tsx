
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
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Copy, Check, Save, ArrowLeft, Palette, EyeIcon, Eye, Settings, Target, Box } from 'lucide-react';
import ProductSelector from '@/components/marketing/ProductSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  }),
  layout: z.enum(["empilhado", "carrossel"]).default("empilhado"),
  limitQuantity: z.boolean().default(false),
  showStrikedPrice: z.boolean().default(false),
  backgroundColor: z.string().default("#FFFFFF"),
  textColor: z.string().default("#000000"),
  buttonColor: z.string().default("#3b82f6"),
  buttonText: z.string().default("Adicionar à compra"),
  buttonStyle: z.enum(["rounded", "pill", "square"]).default("rounded"),
  imageStyle: z.enum(["square", "rounded", "circle"]).default("rounded"),
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
  const [showTriggerProducts, setShowTriggerProducts] = useState(true);
  const [showOfferProducts, setShowOfferProducts] = useState(true);
  
  const form = useForm<OrderBumpPageFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      isActive: initialData.isActive,
      triggerProductIds: initialData.triggerProductIds,
      offerProductIds: initialData.offerProductIds,
      layout: "empilhado",
      limitQuantity: false,
      showStrikedPrice: false,
      backgroundColor: "#FFFFFF",
      textColor: "#000000",
      buttonColor: "#3b82f6",
      buttonText: "Adicionar à compra",
      buttonStyle: "rounded",
      imageStyle: "rounded",
    } : {
      name: '',
      description: '',
      isActive: true,
      triggerProductIds: [],
      offerProductIds: [],
      layout: "empilhado",
      limitQuantity: false,
      showStrikedPrice: false,
      backgroundColor: "#FFFFFF",
      textColor: "#000000",
      buttonColor: "#3b82f6",
      buttonText: "Adicionar à compra",
      buttonStyle: "rounded",
      imageStyle: "rounded",
    }
  });

  const watchTriggerProductIds = form.watch('triggerProductIds');
  const watchOfferProductIds = form.watch('offerProductIds');

  const handleSubmit = (data: OrderBumpPageFormData) => {
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
        <div className="grid gap-8">
          {/* Basic Configuration Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary">
                <Settings className="h-5 w-5" />
                <CardTitle className="text-xl">Configuração Básica</CardTitle>
              </div>
              <CardDescription>
                Configure as informações principais do seu OrderBump
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
                      Um nome interno para identificar este OrderBump
                    </FormDescription>
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
                    <FormDescription>
                      Explique brevemente a oferta para o cliente
                    </FormDescription>
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

          {/* Product Selection Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary">
                <Box className="h-5 w-5" />
                <CardTitle className="text-xl">Produtos a Oferecer</CardTitle>
              </div>
              <CardDescription>
                Selecione quais produtos serão oferecidos como OrderBump
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

          {/* Display Configuration Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary">
                <Target className="h-5 w-5" />
                <CardTitle className="text-xl">Exibição no Checkout</CardTitle>
              </div>
              <CardDescription>
                Configure onde e como seu OrderBump será exibido
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <FormField
                control={form.control}
                name="triggerProductIds"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base mb-2 block">
                      Produtos onde o OrderBump será exibido
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
                        description="Apenas nos checkouts destes produtos o OrderBump será exibido"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <FormField
                  control={form.control}
                  name="layout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Layout Visual</FormLabel>
                      <FormDescription>
                        Como os produtos serão exibidos no checkout
                      </FormDescription>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Selecione o layout" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="empilhado">Empilhado</SelectItem>
                          <SelectItem value="carrossel">Carrossel</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="limitQuantity"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-4">
                        <div>
                          <FormLabel className="text-base">Exibir quantidade limitada</FormLabel>
                          <FormDescription>
                            Mostrar indicação de estoque limitado
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
                    name="showStrikedPrice"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-md border p-4">
                        <div>
                          <FormLabel className="text-base">Mostrar preço riscado</FormLabel>
                          <FormDescription>
                            Exibir um preço original riscado (sugerindo desconto)
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Customization Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary">
                <Palette className="h-5 w-5" />
                <CardTitle className="text-xl">Personalização Visual</CardTitle>
              </div>
              <CardDescription>
                Customize as cores e estilos do seu OrderBump
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Cor de Fundo</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input type="color" {...field} className="w-12 h-10 p-1" />
                        </FormControl>
                        <Input 
                          type="text" 
                          value={field.value} 
                          onChange={field.onChange} 
                          className="h-10 flex-1"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="textColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Cor do Texto</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input type="color" {...field} className="w-12 h-10 p-1" />
                        </FormControl>
                        <Input 
                          type="text" 
                          value={field.value} 
                          onChange={field.onChange} 
                          className="h-10 flex-1"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buttonColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Cor do Botão</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input type="color" {...field} className="w-12 h-10 p-1" />
                        </FormControl>
                        <Input 
                          type="text" 
                          value={field.value} 
                          onChange={field.onChange} 
                          className="h-10 flex-1"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <FormField
                  control={form.control}
                  name="buttonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Texto do Botão</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Adicionar à compra" 
                          className="h-10" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buttonStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Formato do Botão</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Selecione o formato" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="rounded">Arredondado</SelectItem>
                          <SelectItem value="pill">Pílula</SelectItem>
                          <SelectItem value="square">Quadrado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Formato da Imagem</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Selecione o formato" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="square">Quadrada</SelectItem>
                          <SelectItem value="rounded">Arredondada</SelectItem>
                          <SelectItem value="circle">Circular</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview Section - Coming in future version */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 border-dashed border-primary/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary">
                <Eye className="h-5 w-5" />
                <CardTitle className="text-xl">Pré-visualização</CardTitle>
              </div>
              <CardDescription>
                Visualize como o OrderBump ficará no checkout (em breve)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-8">
              <div className="bg-muted/40 border-2 border-dashed border-muted rounded-lg p-8 text-center h-60 flex items-center justify-center">
                <div className="space-y-4">
                  <EyeIcon className="h-12 w-12 text-muted-foreground mx-auto"/>
                  <p className="text-muted-foreground">
                    Pré-visualização em desenvolvimento.<br/>
                    Em breve você poderá ver como seu OrderBump ficará no checkout.
                  </p>
                </div>
              </div>
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

        <div className="flex justify-between items-center space-x-4 border-t pt-8 mt-10">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onCancel} 
            className="h-12 text-base px-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-4">
            {onDuplicate && (
              <Button
                type="button"
                variant="outline"
                className="h-12 text-base px-6"
                onClick={onDuplicate}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={watchTriggerProductIds.length === 0 || watchOfferProductIds.length === 0}
              className="h-12 text-base px-6 bg-green-600 hover:bg-green-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {initialData ? "Atualizar" : "Criar"} OrderBump
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default OrderBumpPageForm;
