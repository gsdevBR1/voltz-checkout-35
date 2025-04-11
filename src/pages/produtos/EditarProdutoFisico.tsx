import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, Image, Save, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Product, ProductFormData } from '@/types/product';

// Mock data for demonstration purposes
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Camiseta Premium',
    type: 'physical',
    price: 12990,
    description: 'Camiseta premium 100% algodão',
    stock: 42,
    status: 'active',
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-03-15'),
    weight: 0.25,
    width: 30,
    height: 5,
    length: 40,
    sku: 'CAM-PREMIUM-01',
    barcode: '7898888888888',
    costPrice: 5990,
    comparePrice: 14990,
    images: [
      'https://via.placeholder.com/500x500?text=Camiseta+1',
      'https://via.placeholder.com/500x500?text=Camiseta+2'
    ],
    hasVariants: true,
    variantName: 'Tamanho',
    variantValues: ['P', 'M', 'G', 'GG'],
    manageStock: true
  },
  // ... other mock products
];

const formSchema = z.object({
  name: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
  price: z.number().min(1, { message: 'O preço de venda é obrigatório' }),
  costPrice: z.number().optional(),
  comparePrice: z.number().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  manageStock: z.boolean(),
  stock: z.number().optional(),
  weight: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  length: z.number().optional(),
  hasVariants: z.boolean(),
  variantName: z.string().optional(),
  variantValues: z.array(z.string()).optional(),
});

interface ImageItem {
  url: string;
  file?: File;
  isNew?: boolean;
}

const EditarProdutoFisico: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      costPrice: 0,
      comparePrice: 0,
      sku: '',
      barcode: '',
      manageStock: true,
      stock: 0,
      weight: 0,
      width: 0,
      height: 0,
      length: 0,
      hasVariants: false,
      variantName: '',
      variantValues: [],
    },
  });

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProduct = () => {
      // Find product in mock data
      const foundProduct = mockProducts.find(p => p.id === id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Populate form with product data
        form.reset({
          name: foundProduct.name,
          description: foundProduct.description,
          price: foundProduct.price / 100, // Convert from cents to real
          costPrice: foundProduct.costPrice ? foundProduct.costPrice / 100 : undefined,
          comparePrice: foundProduct.comparePrice ? foundProduct.comparePrice / 100 : undefined,
          sku: foundProduct.sku || '',
          barcode: foundProduct.barcode || '',
          manageStock: foundProduct.manageStock || false,
          stock: foundProduct.stock || 0,
          weight: foundProduct.weight || 0,
          width: foundProduct.width || 0,
          height: foundProduct.height || 0,
          length: foundProduct.length || 0,
          hasVariants: foundProduct.hasVariants || false,
          variantName: foundProduct.variantName || '',
          variantValues: foundProduct.variantValues || [],
        });
        
        // Setup images
        if (foundProduct.images && foundProduct.images.length > 0) {
          setImages(foundProduct.images.map(url => ({ url })));
        }
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, form]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file size and type
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB
      
      if (!isValidType) {
        toast({
          title: "Tipo de arquivo inválido",
          description: "Apenas arquivos JPG ou PNG são permitidos.",
          variant: "destructive",
        });
      }
      
      if (!isValidSize) {
        toast({
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é 2MB.",
          variant: "destructive",
        });
      }
      
      return isValidType && isValidSize;
    });
    
    if (validFiles.length > 0) {
      const newImages = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        file,
        isNew: true
      }));
      
      setImages(prev => [...prev, ...newImages]);
    }
    
    // Reset input value to allow uploading the same file again
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    
    // If this was a new image with an object URL, revoke it to prevent memory leaks
    if (updatedImages[index].isNew && updatedImages[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(updatedImages[index].url);
    }
    
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (index: number) => {
    setDropTargetIndex(index);
  };

  const handleDrop = () => {
    if (draggingIndex !== null && dropTargetIndex !== null && draggingIndex !== dropTargetIndex) {
      const updatedImages = [...images];
      const draggedImage = updatedImages[draggingIndex];
      
      // Remove dragged item
      updatedImages.splice(draggingIndex, 1);
      
      // Insert at new position
      updatedImages.splice(dropTargetIndex, 0, draggedImage);
      
      setImages(updatedImages);
    }
    
    setDraggingIndex(null);
    setDropTargetIndex(null);
  };

  const addVariantValue = () => {
    const variantValues = form.getValues().variantValues || [];
    form.setValue('variantValues', [...variantValues, '']);
  };

  const removeVariantValue = (index: number) => {
    const variantValues = form.getValues().variantValues || [];
    form.setValue('variantValues', variantValues.filter((_, i) => i !== index));
  };

  const updateVariantValue = (index: number, value: string) => {
    const variantValues = form.getValues().variantValues || [];
    const updated = [...variantValues];
    updated[index] = value;
    form.setValue('variantValues', updated);
  };

  const generateSku = () => {
    const productName = form.getValues().name || 'PROD';
    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const sku = `${productName.slice(0, 3).toUpperCase()}-${randomNumber}`;
    form.setValue('sku', sku);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Validate at least one image
    if (images.length === 0) {
      toast({
        title: "Imagens obrigatórias",
        description: "Adicione pelo menos uma imagem ao produto.",
        variant: "destructive",
      });
      return;
    }

    // Validate variants if hasVariants is true
    if (values.hasVariants) {
      if (!values.variantName || values.variantName.trim() === '') {
        toast({
          title: "Nome da variante obrigatório",
          description: "Informe o nome da opção de variante.",
          variant: "destructive",
        });
        return;
      }

      if (!values.variantValues || values.variantValues.length === 0 || 
          values.variantValues.some(v => v.trim() === '')) {
        toast({
          title: "Valores de variante obrigatórios",
          description: "Informe pelo menos um valor para a variante.",
          variant: "destructive",
        });
        return;
      }
    }

    // In a real app, we would upload the images and save the product data
    toast({
      title: "Produto atualizado",
      description: "As alterações foram salvas com sucesso.",
    });

    // Redirect to product list
    navigate('/produtos');
  };

  const handleDelete = () => {
    setDeleting(true);
    
    // In a real app, this would be an API call to delete the product
    setTimeout(() => {
      setDeleting(false);
      setDeleteConfirmOpen(false);
      
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso.",
      });
      
      navigate('/produtos');
    }, 500);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-8 py-6">
          <p>Carregando produto...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-8 py-6">
          <p>Produto não encontrado.</p>
          <Button className="mt-4" onClick={() => navigate('/produtos')}>
            Voltar para Lista de Produtos
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-8 py-6">
        <div className="sticky top-16 z-10 bg-background pb-4 border-b mb-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" onClick={() => navigate('/produtos')} className="mr-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-semibold">Editar Produto: {product.name}</h1>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
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
                        <Input placeholder="Ex: Camiseta Premium Preta" {...field} />
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
              </CardContent>
            </Card>

            {/* Imagens do Produto */}
            <Card>
              <CardHeader>
                <CardTitle>Imagens do Produto</CardTitle>
                <CardDescription>
                  Adicione imagens para seu produto. Recomendado: 1000 x 1000 px.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <FormLabel>
                      Imagens do Produto *
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="product-images"
                        multiple
                      />
                      <label
                        htmlFor="product-images"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                      >
                        <Image className="h-4 w-4" />
                        Adicionar Imagens
                      </label>
                      <p className="text-xs text-muted-foreground">
                        JPG ou PNG até 2MB. Sugerido: 1000 x 1000 px
                      </p>
                    </div>
                    
                    {images.length > 0 && (
                      <div className="mt-4">
                        <FormLabel className="mb-2 block">
                          Imagens adicionadas ({images.length})
                        </FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                          {images.map((image, index) => (
                            <div
                              key={index}
                              className={cn(
                                "relative rounded-md overflow-hidden border-2 aspect-square",
                                draggingIndex === index ? "opacity-50" : "",
                                dropTargetIndex === index ? "border-primary" : "border-border"
                              )}
                              draggable
                              onDragStart={() => handleDragStart(index)}
                              onDragOver={(e) => {
                                e.preventDefault();
                                handleDragOver(index);
                              }}
                              onDragEnd={handleDrop}
                              onDrop={(e) => {
                                e.preventDefault();
                                handleDrop();
                              }}
                            >
                              <img
                                src={image.url}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1 text-white hover:bg-opacity-80 transition-all"
                              >
                                <X className="h-4 w-4" />
                              </button>
                              {index === 0 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 text-center">
                                  Principal
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Arraste para reordenar. A primeira imagem será a principal.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variantes */}
            <Card>
              <CardHeader>
                <CardTitle>Variantes do Produto</CardTitle>
                <CardDescription>
                  Defina se o produto possui variações como tamanho, cor, etc.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="hasVariants"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Este produto possui variantes?</FormLabel>
                        <FormDescription>
                          Ex: Tamanhos, Cores, etc.
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

                {form.watch('hasVariants') && (
                  <div className="space-y-4 p-4 border rounded-md mt-4">
                    <FormField
                      control={form.control}
                      name="variantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Opção *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Tamanho, Cor, etc." {...field} />
                          </FormControl>
                          <FormDescription>
                            Qual característica varia entre as opções?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel>Valores da Opção *</FormLabel>
                      <FormDescription className="mb-2">
                        Quais são as opções disponíveis?
                      </FormDescription>

                      <div className="space-y-2">
                        {form.watch('variantValues')?.map((value, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder={`Ex: ${index === 0 ? 'P' : index === 1 ? 'M' : index === 2 ? 'G' : 'XG'}`}
                              value={value}
                              onChange={(e) => updateVariantValue(index, e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeVariantValue(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={addVariantValue}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Opção
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preços */}
            <Card>
              <CardHeader>
                <CardTitle>Preços</CardTitle>
                <CardDescription>
                  Configure os preços do seu produto.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço de Custo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              R$
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0,00"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Uso interno, não aparece para o cliente
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço de Venda *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              R$
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0,00"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Preço principal no checkout
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="comparePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço de Comparação</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              R$
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0,00"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Preço "de" riscado (promoção)
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Estoque */}
            <Card>
              <CardHeader>
                <CardTitle>Estoque</CardTitle>
                <CardDescription>
                  Configure o estoque e identificadores do produto.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU (Código do Produto)</FormLabel>
                          <div className="flex space-x-2">
                            <FormControl>
                              <Input placeholder="Ex: CAM-PRETA-M" {...field} />
                            </FormControl>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={generateSku}
                              title="Gerar SKU automático"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormDescription>
                            Código único para identificação do produto
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código de Barras (EAN/ISBN)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 7898888888888" {...field} />
                          </FormControl>
                          <FormDescription>
                            Opcional, para controle de estoque
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="manageStock"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Gerenciar estoque?</FormLabel>
                          <FormDescription>
                            Controla quantidade disponível
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

                  {form.watch('manageStock') && (
                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade em Estoque</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Peso e Dimensões */}
            <Card>
              <CardHeader>
                <CardTitle>Peso e Dimensões</CardTitle>
                <CardDescription>
                  Informações úteis para cálculo de frete.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

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
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
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
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
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
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="pt-6 border-t bg-background">
              <div className="flex justify-between items-center">
                <div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeleteConfirmOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Produto
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/produtos')}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Produto</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Excluindo...' : 'Excluir Produto'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default EditarProdutoFisico;
