
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  Save, 
  X, 
  AlertCircle,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

// Mock data for products
const mockProducts = [
  { id: "1", name: "Camiseta Premium" },
  { id: "2", name: "Calça Jeans Slim" },
  { id: "3", name: "Tênis Esportivo" },
  { id: "4", name: "Kit Skin Care" },
  { id: "5", name: "Fones de Ouvido Bluetooth" },
];

// Form schema using Zod
const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  mainProductId: z.string({
    required_error: "Selecione um produto principal",
  }),
  upsellProductId: z.string({
    required_error: "Selecione um produto para upsell",
  }),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
  customPrice: z.coerce.number().min(0.01, "Preço deve ser maior que zero"),
  showOriginalPrice: z.boolean().default(false),
  limitOnePerCustomer: z.boolean().default(true),
  customTitle: z.string().optional(),
  backgroundColor: z.string().default("#FFFFFF"),
  textColor: z.string().default("#000000"),
  buttonColor: z.string().default("#2BBA00"),
  buttonText: z.string().default("Quero Aproveitar"),
  redirectTarget: z.enum(["checkout", "thankyou", "custom"]),
  customRedirectUrl: z.string().optional(),
  // The customRedirectUrl is conditionally required if redirectTarget is 'custom'
}).refine(data => {
  if (data.redirectTarget === 'custom' && (!data.customRedirectUrl || data.customRedirectUrl.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "URL é obrigatória quando o redirecionamento é personalizado",
  path: ["customRedirectUrl"]
});

type FormData = z.infer<typeof formSchema>;

const CriarUpsellPage = () => {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Initialize the form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "Adicione esta oferta por apenas R$ XX,XX",
      customPrice: 0,
      showOriginalPrice: false,
      limitOnePerCustomer: true,
      backgroundColor: "#F1F0FB", // soft gray
      textColor: "#1A1F2C", // dark text
      buttonColor: "#2BBA00", // green
      buttonText: "Quero Aproveitar",
      redirectTarget: "checkout",
    }
  });
  
  const redirectTarget = form.watch("redirectTarget");
  
  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erro no upload",
          description: "A imagem não pode ter mais de 2MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setPreviewImage(null);
  };
  
  // Form submission handler
  const onSubmit = (data: FormData) => {
    // In a real app, we would save the data to the backend here
    console.log("Form data:", data);
    console.log("Image:", previewImage);
    
    toast({
      title: "Upsell criado com sucesso!",
      description: "O upsell foi criado e está pronto para uso.",
    });
    
    // Navigate back to the upsell list
    navigate("/marketing/upsell");
  };
  
  // Actions for the layout
  const actions = (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        onClick={() => navigate("/marketing/upsell")}
      >
        <X className="mr-2 h-4 w-4" />
        Cancelar
      </Button>
      <Button 
        type="submit"
        onClick={form.handleSubmit(onSubmit)}
      >
        <Save className="mr-2 h-4 w-4" />
        Salvar Upsell
      </Button>
    </div>
  );

  return (
    <MarketingLayout 
      title="Criar Upsell One Click" 
      description="Configure uma oferta especial que será exibida após a compra do produto principal."
      actions={actions}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Informações Básicas</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Upsell <span className="text-red-500">*</span></FormLabel>
                      <FormDescription>
                        Um nome para identificar esta oferta internamente
                      </FormDescription>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Oferta Especial – Kit 3 Sabonetes" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="mainProductId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Produto Principal <span className="text-red-500">*</span></FormLabel>
                        <FormDescription>
                          Produto que, ao ser comprado, ativa este upsell
                        </FormDescription>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o produto principal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockProducts.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="upsellProductId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Produto de Upsell <span className="text-red-500">*</span></FormLabel>
                        <FormDescription>
                          Produto que será oferecido após a compra
                        </FormDescription>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o produto para upsell" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockProducts.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem do Upsell <span className="text-red-500">*</span></FormLabel>
                      <FormDescription>
                        Texto da oferta que será exibido para o cliente
                      </FormDescription>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Ex: Adicione esta oferta por apenas R$ XX,XX" 
                          className="h-24"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <Label>Imagem destaque do upsell (Opcional)</Label>
                  <div className="mt-2">
                    <div className="flex items-center gap-4">
                      {previewImage ? (
                        <div className="relative w-32 h-32 overflow-hidden rounded-md border border-border">
                          <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={removeImage}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-32 h-32 rounded-md border border-dashed border-border bg-background hover:bg-accent hover:cursor-pointer transition-colors">
                          <Label 
                            htmlFor="image-upload" 
                            className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-xs text-muted-foreground text-center">
                              Clique para<br />upload
                            </span>
                          </Label>
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        <p>Formato: JPG/PNG</p>
                        <p>Tamanho recomendado: 1000x1000px</p>
                        <p>Tamanho máximo: 2MB</p>
                      </div>
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg, image/png"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Preço e Condições</h3>
                
                <FormField
                  control={form.control}
                  name="customPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço personalizado do upsell <span className="text-red-500">*</span></FormLabel>
                      <FormDescription>
                        Valor com desconto exclusivo para esta oferta
                      </FormDescription>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">R$</span>
                          <Input 
                            type="number" 
                            min="0.01" 
                            step="0.01" 
                            {...field} 
                            className="pl-10" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="showOriginalPrice"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Mostrar valor original riscado?</FormLabel>
                          <FormDescription>
                            Exibe o preço normal ao lado do promocional
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
                    name="limitOnePerCustomer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Limitar a 1 vez por cliente?</FormLabel>
                          <FormDescription>
                            Impede múltiplas compras do mesmo upsell
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
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Personalização Visual</h3>
                
                <FormField
                  control={form.control}
                  name="customTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título personalizado (Opcional)</FormLabel>
                      <FormDescription>
                        Um título destacado para a página de upsell
                      </FormDescription>
                      <FormControl>
                        <Input {...field} placeholder="Ex: 🎁 Última chance!" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-6 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="backgroundColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor do fundo</FormLabel>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-10 h-10 rounded-md border border-border" 
                            style={{ backgroundColor: field.value }}
                          />
                          <FormControl>
                            <Input
                              type="color"
                              {...field}
                              className="w-24 h-10 p-1"
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="textColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor do texto</FormLabel>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-10 h-10 rounded-md border border-border" 
                            style={{ backgroundColor: field.value }}
                          />
                          <FormControl>
                            <Input
                              type="color"
                              {...field}
                              className="w-24 h-10 p-1"
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="buttonColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cor do botão</FormLabel>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-10 h-10 rounded-md border border-border" 
                            style={{ backgroundColor: field.value }}
                          />
                          <FormControl>
                            <Input
                              type="color"
                              {...field}
                              className="w-24 h-10 p-1"
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="buttonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto do botão</FormLabel>
                      <FormDescription>
                        Texto da call-to-action (CTA) do botão
                      </FormDescription>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Sim, quero adicionar!" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Preview da tela de upsell */}
                <div className="mt-6 p-4 border rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Preview do Upsell</h4>
                  <div 
                    className="p-6 rounded-lg"
                    style={{ 
                      backgroundColor: form.watch("backgroundColor"), 
                      color: form.watch("textColor") 
                    }}
                  >
                    {form.watch("customTitle") && (
                      <h2 className="text-xl font-bold mb-3">{form.watch("customTitle")}</h2>
                    )}
                    
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                      {previewImage && (
                        <div className="w-full md:w-1/3">
                          <img 
                            src={previewImage} 
                            alt="Produto" 
                            className="w-full h-auto rounded-md object-cover"
                          />
                        </div>
                      )}
                      <div className="w-full md:w-2/3">
                        <p className="mb-3 text-lg">{form.watch("message")}</p>
                        <div className="mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">R$ {form.watch("customPrice").toFixed(2)}</span>
                            {form.watch("showOriginalPrice") && (
                              <span className="text-sm line-through opacity-70">R$ {(form.watch("customPrice") * 1.3).toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          style={{ 
                            backgroundColor: form.watch("buttonColor"),
                            color: "#FFFFFF" 
                          }}
                          className="w-full md:w-auto px-6"
                        >
                          {form.watch("buttonText")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Comportamento</h3>
                
                <FormField
                  control={form.control}
                  name="redirectTarget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Redirecionamento após o clique</FormLabel>
                      <FormControl>
                        <RadioGroup
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          className="grid gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="checkout" id="checkout" />
                            <Label htmlFor="checkout">Checkout de pagamento</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="thankyou" id="thankyou" />
                            <Label htmlFor="thankyou">Página de obrigado</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id="custom" />
                            <Label htmlFor="custom">Página personalizada</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {redirectTarget === "custom" && (
                  <FormField
                    control={form.control}
                    name="customRedirectUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da página personalizada <span className="text-red-500">*</span></FormLabel>
                        <FormDescription>
                          Link completo para onde o cliente será redirecionado
                        </FormDescription>
                        <FormControl>
                          <Input {...field} placeholder="https://" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end mt-6 space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/marketing/upsell")}
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Salvar Upsell
            </Button>
          </div>
        </form>
      </Form>
    </MarketingLayout>
  );
};

export default CriarUpsellPage;
