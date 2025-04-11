
import React, { useState } from 'react';
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
import { ProductFormData } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { FileText, Image, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome do produto deve ter pelo menos 3 caracteres.',
  }),
  description: z.string().min(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres.',
  }),
  price: z.coerce.number().min(1, {
    message: 'O preço deve ser maior que zero.',
  }),
  costPrice: z.coerce.number().optional(),
  comparePrice: z.coerce.number().optional(),
  imageUrl: z.string().optional(),
  downloadUrl: z.string().min(1, {
    message: 'A URL de download é obrigatória para produtos digitais.',
  }),
});

interface ImageItem {
  url: string;
  file?: File;
  isNew?: boolean;
}

const NovoProdutoDigital: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      costPrice: undefined,
      comparePrice: undefined,
      imageUrl: '',
      downloadUrl: '',
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 2 * 1024 * 1024;
      
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
    
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    
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
      
      updatedImages.splice(draggingIndex, 1);
      updatedImages.splice(dropTargetIndex, 0, draggedImage);
      
      setImages(updatedImages);
    }
    
    setDraggingIndex(null);
    setDropTargetIndex(null);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (images.length === 0) {
      toast({
        title: "Imagem obrigatória",
        description: "Adicione pelo menos uma imagem para o produto digital.",
        variant: "destructive",
      });
      return;
    }

    // Convert price to cents for storage
    const productData: ProductFormData = {
      name: values.name,
      type: 'digital',
      price: Math.round(values.price * 100),
      description: values.description,
      status: 'active',
      costPrice: values.costPrice ? Math.round(values.costPrice * 100) : undefined,
      comparePrice: values.comparePrice ? Math.round(values.comparePrice * 100) : undefined,
      downloadUrl: values.downloadUrl,
      images: images.map(img => img.url),
    };
    
    console.log('Form submitted:', productData);
    
    toast({
      title: "Produto digital criado com sucesso!",
      description: `${values.name} foi adicionado ao seu catálogo.`,
    });
    
    // Em uma aplicação real, salvariamos no banco de dados
    navigate('/produtos');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Novo Produto Digital
          </h1>
          <p className="text-muted-foreground">
            Preencha as informações para criar um novo produto digital.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Defina o nome e descrição do seu produto digital.
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
                        <Input placeholder="Ex: E-book: Guia de Marketing Digital" {...field} />
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
                          placeholder="Descreva seu produto digital em detalhes..." 
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

            <Card>
              <CardHeader>
                <CardTitle>Imagens do Produto</CardTitle>
                <CardDescription>
                  Adicione imagens para seu produto digital. Recomendado: 1000 x 1000 px.
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

            <Card>
              <CardHeader>
                <CardTitle>Preços</CardTitle>
                <CardDescription>
                  Configure os preços do seu produto digital.
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
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
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
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
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

            <Card>
              <CardHeader>
                <CardTitle>Conteúdo Digital</CardTitle>
                <CardDescription>
                  Configure o link para download ou acesso ao conteúdo digital.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="downloadUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de Download *</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com/download" {...field} />
                      </FormControl>
                      <FormDescription>
                        Link para o arquivo digital ou área de membros
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/produtos')}
              >
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Salvar Produto
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default NovoProdutoDigital;
