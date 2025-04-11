
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Package,
  X,
  Plus,
  Camera,
  Grip,
  Trash2,
  RefreshCw,
  ShoppingCart,
  DollarSign,
  BarChart,
  Tag,
  Barcode,
  Weight,
  Box,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Validação do formulário com Zod
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'O título deve ter pelo menos 3 caracteres.',
  }),
  description: z.string().min(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres.',
  }),
  // Preços
  costPrice: z.coerce.number().optional(),
  price: z.coerce.number().min(0.01, {
    message: 'O preço de venda deve ser maior que zero.',
  }),
  comparePrice: z.coerce.number().optional(),
  // Estoque
  sku: z.string().optional(),
  barcode: z.string().optional(),
  manageStock: z.boolean().default(true),
  stock: z.coerce.number().min(0).optional(),
  // Dimensões
  weight: z.coerce.number().min(0).optional(),
  width: z.coerce.number().min(0).optional(),
  height: z.coerce.number().min(0).optional(),
  length: z.coerce.number().min(0).optional(),
  // Variantes
  hasVariants: z.boolean().default(false),
  variantName: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

type ProductVariantValue = {
  id: string;
  value: string;
};

type ProductImage = {
  id: string;
  file: File;
  preview: string;
};

const NovoFisico: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variantValues, setVariantValues] = useState<ProductVariantValue[]>([]);
  const [newVariantValue, setNewVariantValue] = useState('');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      costPrice: undefined,
      price: 0,
      comparePrice: undefined,
      sku: '',
      barcode: '',
      manageStock: true,
      stock: 0,
      weight: undefined,
      width: undefined,
      height: undefined,
      length: undefined,
      hasVariants: false,
      variantName: '',
      status: 'active',
    },
  });

  const hasVariants = form.watch('hasVariants');
  const manageStock = form.watch('manageStock');

  // Manipulação de imagens
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.filter(file => 
      file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type)
    );
    
    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Arquivos inválidos",
        description: "Apenas arquivos JPG ou PNG até 2MB são permitidos.",
        variant: "destructive"
      });
    }
    
    if (validFiles.length > 0) {
      const newImages = validFiles.map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        preview: URL.createObjectURL(file)
      }));
      
      setImages(prev => [...prev, ...newImages]);
    }
  };
  
  const removeImage = (id: string) => {
    setImages(images.filter(image => image.id !== id));
  };
  
  // Gerar SKU automaticamente
  const generateSku = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    form.setValue('sku', `SKU-${random}`);
  };
  
  // Manipulação de variantes
  const addVariantValue = () => {
    if (!newVariantValue.trim()) return;
    
    const newValue = {
      id: Math.random().toString(36).substring(2, 9),
      value: newVariantValue.trim()
    };
    
    setVariantValues([...variantValues, newValue]);
    setNewVariantValue('');
  };
  
  const removeVariantValue = (id: string) => {
    setVariantValues(variantValues.filter(value => value.id !== id));
  };
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Validar se há pelo menos uma imagem
    if (images.length === 0) {
      toast({
        title: "Imagem obrigatória",
        description: "Adicione pelo menos uma imagem para o produto.",
        variant: "destructive"
      });
      return;
    }
    
    // Validar variantes se ativadas
    if (values.hasVariants) {
      if (!values.variantName) {
        toast({
          title: "Nome da opção obrigatório",
          description: "Informe o nome da opção de variante (ex: Tamanho).",
          variant: "destructive"
        });
        return;
      }
      
      if (variantValues.length === 0) {
        toast({
          title: "Valores da opção obrigatórios",
          description: "Adicione pelo menos um valor para a opção (ex: P, M, G).",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Construir o objeto com os dados do produto
    const productData = {
      name: values.name,
      type: 'physical' as const,
      price: Math.round(values.price * 100), // Converter para centavos
      description: values.description,
      stock: values.manageStock ? values.stock : undefined,
      status: values.status,
      costPrice: values.costPrice ? Math.round(values.costPrice * 100) : undefined,
      comparePrice: values.comparePrice ? Math.round(values.comparePrice * 100) : undefined,
      sku: values.sku,
      barcode: values.barcode,
      manageStock: values.manageStock,
      weight: values.weight,
      dimensions: values.width || values.height || values.length ? {
        width: values.width,
        height: values.height,
        length: values.length,
      } : undefined,
      hasVariants: values.hasVariants,
      variants: values.hasVariants ? {
        name: values.variantName,
        values: variantValues.map(v => v.value),
      } : undefined,
      images: images.map(img => ({
        file: img.file,
        preview: img.preview,
      })),
    };
    
    console.log('Form submitted:', productData);
    
    toast({
      title: 'Produto criado com sucesso!',
      description: `${values.name} foi adicionado ao seu catálogo.`,
    });
    
    // Em um app real, aqui enviaria para a API
    navigate('/produtos');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Novo Produto Físico
          </h1>
          <p className="text-muted-foreground">
            Preencha as informações para criar um novo produto físico.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 1. Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Informações Básicas
                </CardTitle>
                <CardDescription>
                  Defina o título e a descrição do seu produto.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Produto *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Camiseta Premium" {...field} />
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
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva seu produto em detalhes..." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel>Produto Ativo</FormLabel>
                          <FormDescription>
                            Produtos inativos não ficam visíveis para os clientes.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === 'active'}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? 'active' : 'inactive');
                            }}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 2. Imagens do Produto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Imagens do Produto
                </CardTitle>
                <CardDescription>
                  Adicione imagens para seu produto. Recomendado: 1000 x 1000 px.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div 
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center",
                        images.length === 0 ? "border-primary/20" : "border-muted"
                      )}
                    >
                      <input 
                        type="file" 
                        id="image-upload" 
                        accept=".jpg,.jpeg,.png" 
                        multiple 
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                      <label 
                        htmlFor="image-upload" 
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center">
                          Clique para enviar imagens<br />
                          <span className="text-xs">JPG ou PNG até 2MB cada.</span>
                        </p>
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="mt-4" 
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('image-upload')?.click();
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Imagens
                        </Button>
                      </label>
                    </div>
                    
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                        {images.map((image) => (
                          <div key={image.id} className="relative group">
                            <div className="aspect-square rounded-md overflow-hidden border bg-muted">
                              <img 
                                src={image.preview} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(image.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {images.length > 0 && (
                    <FormDescription>
                      {images.length} {images.length === 1 ? 'imagem adicionada' : 'imagens adicionadas'}. 
                      A primeira imagem será a principal.
                    </FormDescription>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 3. Variantes do Produto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Variantes do Produto
                </CardTitle>
                <CardDescription>
                  Defina se o produto possui variações como tamanho, cor, etc.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="hasVariants"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Este produto possui variantes?</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {hasVariants && (
                  <div className="mt-4 space-y-4 pt-4 border-t">
                    <FormField
                      control={form.control}
                      name="variantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Opção *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Tamanho" {...field} />
                          </FormControl>
                          <FormDescription>
                            Defina o nome da característica que varia (ex: Tamanho, Cor).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <FormLabel>Valores da Opção *</FormLabel>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Ex: P" 
                          value={newVariantValue} 
                          onChange={(e) => setNewVariantValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addVariantValue();
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          onClick={addVariantValue}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar
                        </Button>
                      </div>
                      
                      {variantValues.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {variantValues.map((value) => (
                            <Badge 
                              key={value.id}
                              variant="secondary"
                              className="px-2 py-1 flex items-center gap-1"
                            >
                              {value.value}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => removeVariantValue(value.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <FormDescription>
                        Adicione os valores possíveis para esta opção (ex: P, M, G, GG).
                      </FormDescription>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 4. Preços */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Preços
                </CardTitle>
                <CardDescription>
                  Configure os preços do seu produto.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço de Custo (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          placeholder="0,00" 
                          {...field} 
                          value={field.value === undefined ? '' : field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Custo para adquirir ou produzir este item.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço de Venda (R$) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          placeholder="0,00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Este é o preço que será cobrado no checkout.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="comparePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço de Comparação (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          placeholder="0,00" 
                          {...field} 
                          value={field.value === undefined ? '' : field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Preço original (riscado) para mostrar desconto.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 5. Estoque */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Estoque
                </CardTitle>
                <CardDescription>
                  Configure o estoque e identificadores do produto.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>SKU</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <Input placeholder="SKU-123ABC" {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className="ml-2"
                            onClick={generateSku}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Gerar
                          </Button>
                        </div>
                        <FormDescription>
                          Código interno do produto.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de Barras (EAN/ISBN)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 7898357410015" {...field} />
                      </FormControl>
                      <FormDescription>
                        Código de barras do produto, se disponível.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="manageStock"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <div>
                          <FormLabel>Gerenciar estoque?</FormLabel>
                          <FormDescription>
                            Se desativado, produto não é contado no estoque.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {manageStock && (
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade em Estoque</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* 6. Peso e Dimensões */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Box className="h-5 w-5" />
                  Peso e Dimensões
                </CardTitle>
                <CardDescription>
                  Informações opcionais para cálculo de frete.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            placeholder="0,00" 
                            {...field}
                            value={field.value === undefined ? '' : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid sm:grid-cols-3 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Largura (cm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            placeholder="0" 
                            {...field}
                            value={field.value === undefined ? '' : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altura (cm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            placeholder="0" 
                            {...field}
                            value={field.value === undefined ? '' : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comprimento (cm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            placeholder="0" 
                            {...field}
                            value={field.value === undefined ? '' : field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/produtos')}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar Produto</Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default NovoFisico;
