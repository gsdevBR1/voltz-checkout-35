
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ProductTypeBadge, ShopifyBadge } from '@/components/produtos/ProductBadge';
import { Product } from '@/types/product';
import { 
  ArrowLeft, Package, FileText, Eye, Save, Trash2, Plus, Image, RefreshCw,
  DollarSign, Tag, PercentSquare, Box, BarChart3, Weight, Ruler, 
  ChevronDown, ChevronUp, CreditCard, AlertCircle
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
    updatedAt: new Date('2025-03-15')
  },
  {
    id: '2',
    name: 'Curso de Marketing Digital',
    type: 'digital',
    price: 19900,
    description: 'Curso completo de marketing digital',
    status: 'inactive',
    createdAt: new Date('2025-03-10'),
    updatedAt: new Date('2025-03-12')
  },
  {
    id: '3',
    name: 'Tênis Esportivo',
    type: 'physical',
    price: 24990,
    description: 'Tênis para corrida e academia',
    stock: 15,
    status: 'active',
    fromShopify: true,
    createdAt: new Date('2025-03-05'),
    updatedAt: new Date('2025-03-05')
  },
  {
    id: '4',
    name: 'E-book: Finanças Pessoais',
    type: 'digital',
    price: 2990,
    description: 'Guia completo para organizar suas finanças',
    status: 'active',
    fromShopify: true,
    createdAt: new Date('2025-03-02'),
    updatedAt: new Date('2025-03-02')
  }
];

interface ImageItem {
  url: string;
  file?: File;
  isNew?: boolean;
}

const EditarProduto: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionChars, setDescriptionChars] = useState(0);
  const [price, setPrice] = useState(0);
  const [comparePrice, setComparePrice] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [manageStock, setManageStock] = useState(true);
  const [stock, setStock] = useState(0);
  const [weight, setWeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [length, setLength] = useState(0);
  const [hasVariants, setHasVariants] = useState(false);
  const [variantName, setVariantName] = useState("");
  const [variantValues, setVariantValues] = useState<string[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  
  // Drag and drop states
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  useEffect(() => {
    // In a real app, we would fetch this from an API
    const foundProduct = mockProducts.find(p => p.id === id) || null;
    
    if (foundProduct) {
      setProduct(foundProduct);
      setName(foundProduct.name);
      setDescription(foundProduct.description);
      setDescriptionChars(foundProduct.description.length);
      setPrice(foundProduct.price / 100);
      setComparePrice(foundProduct.comparePrice ? foundProduct.comparePrice / 100 : 0);
      setCostPrice(foundProduct.costPrice ? foundProduct.costPrice / 100 : 0);
      setSku(foundProduct.sku || "");
      setBarcode(foundProduct.barcode || "");
      setManageStock(foundProduct.manageStock || false);
      setStock(foundProduct.stock || 0);
      setWeight(foundProduct.weight || 0);
      setWidth(foundProduct.width || 0);
      setHeight(foundProduct.height || 0);
      setLength(foundProduct.length || 0);
      setHasVariants(foundProduct.hasVariants || false);
      setVariantName(foundProduct.variantName || "");
      setVariantValues(foundProduct.variantValues || []);
      
      // Setup mock images if they exist
      if (foundProduct.images && foundProduct.images.length > 0) {
        setImages(foundProduct.images.map(url => ({ url })));
      } else {
        // Add placeholder image if no images exist
        setImages([{ url: 'https://via.placeholder.com/500x500?text=Produto' }]);
      }
    }
    
    setLoading(false);
    
    // Focus on title input after loading
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }, 100);
  }, [id]);

  const handleSave = () => {
    // Validate required fields
    if (!name.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, informe o título do produto.",
        variant: "destructive",
      });
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
      return;
    }
    
    if (description.length < 10) {
      toast({
        title: "Descrição muito curta",
        description: "A descrição deve ter pelo menos 10 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    if (price <= 0) {
      toast({
        title: "Preço inválido",
        description: "O preço de venda deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }
    
    if (hasVariants && (!variantName || !variantValues.length)) {
      toast({
        title: "Variantes incompletas",
        description: "Informe o nome e pelo menos um valor para a variante.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would save to an API
    toast({
      title: "Produto atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
    
    // Navigate back to products list
    navigate('/produtos');
  };

  const handleDelete = () => {
    setDeleting(true);
    
    // In a real app, this would be an API call
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
    setVariantValues([...variantValues, '']);
  };

  const removeVariantValue = (index: number) => {
    setVariantValues(variantValues.filter((_, i) => i !== index));
  };

  const updateVariantValue = (index: number, value: string) => {
    const updated = [...variantValues];
    updated[index] = value;
    setVariantValues(updated);
  };

  const generateSku = () => {
    const productName = name || 'PROD';
    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const generatedSku = `${productName.slice(0, 3).toUpperCase()}-${randomNumber}`;
    setSku(generatedSku);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Produto não encontrado</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              O produto que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={() => navigate('/produtos')}>
              Voltar para Produtos
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="mr-2"
            onClick={() => navigate('/produtos')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {product.type === 'physical' ? (
                <Package className="h-6 w-6" />
              ) : (
                <FileText className="h-6 w-6" />
              )}
              Editar Produto
            </h1>
            <div className="flex items-center gap-2 ml-3">
              <ProductTypeBadge type={product.type} />
              {product.fromShopify && <ShopifyBadge />}
            </div>
          </div>
          
          <div className="ml-auto">
            <Button 
              variant="outline"
              onClick={() => navigate(`/produtos/${id}/ver`)}
              className="mr-2"
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver Produto
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card - Always Open */}
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center text-base">
                      <AlertCircle className="h-4 w-4 mr-1.5 text-destructive" />
                      Título do Produto *
                    </Label>
                    <Input 
                      id="name"
                      ref={titleInputRef}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ex: Camiseta Premium Preta"
                      className="text-lg font-medium h-12 border-2 focus-visible:ring-primary focus-visible:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="description" className="flex items-center text-base">
                        <AlertCircle className="h-4 w-4 mr-1.5 text-destructive" />
                        Descrição *
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        {descriptionChars} caracteres
                      </span>
                    </div>
                    <Textarea 
                      id="description"
                      value={description}
                      onChange={e => {
                        setDescription(e.target.value);
                        setDescriptionChars(e.target.value.length);
                      }}
                      placeholder="Descreva seu produto em detalhes..."
                      className="min-h-[120px] resize-y border-2 focus-visible:ring-primary focus-visible:border-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images Section */}
            <Accordion type="single" collapsible defaultValue="images" className="border-none">
              <AccordionItem value="images" className="border-none">
                <Card className="border shadow-sm">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center text-base font-semibold">
                      <Image className="h-5 w-5 mr-2" />
                      Imagens
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-base">Galeria de Imagens</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
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
                                    className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                                  >
                                    <Plus className="h-4 w-4" />
                                    Adicionar Imagem
                                  </label>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Arquivos .jpg ou .png até 2MB</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        
                        {images.length > 0 ? (
                          <div className="flex overflow-x-auto pb-2 gap-4 pt-1">
                            {images.map((image, index) => (
                              <div
                                key={index}
                                className={`relative flex-shrink-0 w-24 h-24 rounded-md border-2 overflow-hidden ${
                                  draggingIndex === index ? "opacity-50" : ""
                                } ${
                                  dropTargetIndex === index ? "border-primary" : "border-border"
                                } ${
                                  index === 0 ? "ring-2 ring-primary ring-offset-2" : ""
                                }`}
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
                                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white hover:bg-black/80 transition-all"
                                >
                                  <ArrowLeft className="h-3 w-3" />
                                </button>
                                {index === 0 && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs py-0.5 text-center">
                                    Principal
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-8">
                            <div className="text-center">
                              <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">Nenhuma imagem adicionada</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Arraste e solte ou clique para adicionar
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          Arraste para reordenar. A primeira imagem será exibida como principal.
                        </p>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>

            {/* Variants Section */}
            <Accordion type="single" collapsible defaultValue="variants" className="border-none">
              <AccordionItem value="variants" className="border-none">
                <Card className="border shadow-sm">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center text-base font-semibold">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Variantes
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <Label className="text-base">Este produto possui variantes?</Label>
                            <p className="text-sm text-muted-foreground">
                              Ex: Tamanhos, Cores, etc.
                            </p>
                          </div>
                          <Switch
                            checked={hasVariants}
                            onCheckedChange={setHasVariants}
                          />
                        </div>

                        {hasVariants && (
                          <div className="space-y-4 border rounded-md p-4 mt-4 bg-accent/20">
                            <div className="space-y-2">
                              <Label htmlFor="variantName" className="flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1.5 text-destructive" />
                                Nome da Opção *
                              </Label>
                              <Input
                                id="variantName"
                                value={variantName}
                                onChange={(e) => setVariantName(e.target.value)}
                                placeholder="Ex: Tamanho, Cor, etc."
                                className="border-2 focus-visible:ring-primary focus-visible:border-primary"
                              />
                              <p className="text-xs text-muted-foreground">
                                Qual característica varia entre as opções?
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label className="flex items-center">
                                <AlertCircle className="h-4 w-4 mr-1.5 text-destructive" />
                                Valores da Opção *
                              </Label>
                              <p className="text-xs text-muted-foreground mb-2">
                                Quais são as opções disponíveis?
                              </p>

                              <div className="space-y-2">
                                {variantValues.map((value, index) => (
                                  <div key={index} className="flex gap-2">
                                    <Input
                                      placeholder={`Ex: ${index === 0 ? 'P' : index === 1 ? 'M' : index === 2 ? 'G' : 'GG'}`}
                                      value={value}
                                      onChange={(e) => updateVariantValue(index, e.target.value)}
                                      className="border-2 focus-visible:ring-primary focus-visible:border-primary"
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
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>

            {/* Pricing Section */}
            <Accordion type="single" collapsible defaultValue="pricing" className="border-none">
              <AccordionItem value="pricing" className="border-none">
                <Card className="border shadow-sm">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center text-base font-semibold">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Preços
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="p-6 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price" className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1.5 text-destructive" />
                            Preço de Venda *
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              min="0"
                              value={price}
                              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                              className="pl-10 border-2 focus-visible:ring-primary focus-visible:border-primary"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Preço principal de venda
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="comparePrice" className="flex items-center">
                            <Tag className="h-4 w-4 mr-1.5 text-muted-foreground" />
                            Preço de Comparação
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="comparePrice"
                              type="number"
                              step="0.01"
                              min="0"
                              value={comparePrice}
                              onChange={(e) => setComparePrice(parseFloat(e.target.value) || 0)}
                              className="pl-10"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Preço "de" riscado (promoção)
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="costPrice" className="flex items-center">
                            <PercentSquare className="h-4 w-4 mr-1.5 text-muted-foreground" />
                            Preço de Custo
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="costPrice"
                              type="number"
                              step="0.01"
                              min="0"
                              value={costPrice}
                              onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                              className="pl-10"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Uso interno (não aparece para o cliente)
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>

            {/* Inventory Section */}
            <Accordion type="single" collapsible defaultValue="inventory" className="border-none">
              <AccordionItem value="inventory" className="border-none">
                <Card className="border shadow-sm">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center text-base font-semibold">
                      <Box className="h-5 w-5 mr-2" />
                      Estoque
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="sku" className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-1.5 text-muted-foreground" />
                              SKU (Código do Produto)
                            </Label>
                            <div className="flex space-x-2">
                              <Input
                                id="sku"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                placeholder="Ex: CAM-PRETA-M"
                              />
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      onClick={generateSku}
                                    >
                                      <RefreshCw className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Gerar SKU automaticamente</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Código único para identificação
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="barcode" className="flex items-center">
                              <BarChart3 className="h-4 w-4 mr-1.5 text-muted-foreground" />
                              Código de Barras (EAN/ISBN)
                            </Label>
                            <Input
                              id="barcode"
                              value={barcode}
                              onChange={(e) => setBarcode(e.target.value)}
                              placeholder="Ex: 7898888888888"
                            />
                            <p className="text-xs text-muted-foreground">
                              Opcional, para integração com PDV
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm mt-4">
                          <div className="space-y-0.5">
                            <Label className="text-base">Gerenciar estoque deste produto?</Label>
                            <p className="text-sm text-muted-foreground">
                              Controla quantidade disponível para venda
                            </p>
                          </div>
                          <Switch
                            checked={manageStock}
                            onCheckedChange={setManageStock}
                          />
                        </div>

                        {manageStock && (
                          <div className="p-4 border rounded-md mt-4 bg-accent/20">
                            <div className="space-y-2">
                              <Label htmlFor="stock" className="flex items-center">
                                Quantidade em Estoque
                              </Label>
                              <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={stock}
                                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                                className="border-2 focus-visible:ring-primary focus-visible:border-primary"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>

            {/* Dimensions Section */}
            <Accordion type="single" collapsible defaultValue="dimensions" className="border-none">
              <AccordionItem value="dimensions" className="border-none">
                <Card className="border shadow-sm">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center text-base font-semibold">
                      <Weight className="h-5 w-5 mr-2" />
                      Dimensões & Peso
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="weight" className="flex items-center">
                              <Weight className="h-4 w-4 mr-1.5 text-muted-foreground" />
                              Peso
                            </Label>
                            <div className="relative">
                              <Input
                                id="weight"
                                type="number"
                                step="0.01"
                                min="0"
                                value={weight}
                                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                kg
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="width" className="flex items-center">
                              <Ruler className="h-4 w-4 mr-1.5 text-muted-foreground" />
                              Largura
                            </Label>
                            <div className="relative">
                              <Input
                                id="width"
                                type="number"
                                min="0"
                                value={width}
                                onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                cm
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="height" className="flex items-center">
                              <Ruler className="h-4 w-4 mr-1.5 text-muted-foreground" />
                              Altura
                            </Label>
                            <div className="relative">
                              <Input
                                id="height"
                                type="number"
                                min="0"
                                value={height}
                                onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                cm
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="length" className="flex items-center">
                              <Ruler className="h-4 w-4 mr-1.5 text-muted-foreground" />
                              Comprimento
                            </Label>
                            <div className="relative">
                              <Input
                                id="length"
                                type="number"
                                min="0"
                                value={length}
                                onChange={(e) => setLength(parseInt(e.target.value) || 0)}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                cm
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-2">
                          <AlertCircle className="h-3 w-3 inline-block mr-1" />
                          Esses dados são usados para cálculo de frete
                        </p>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Sidebar - 1/3 width with product preview and actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Preview */}
            <Card className="border shadow-sm sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Preview do Produto
                </h3>
                
                <div className="space-y-4">
                  <div className="aspect-square rounded-md overflow-hidden bg-accent/20 relative">
                    {images.length > 0 ? (
                      <img 
                        src={images[0].url} 
                        alt={name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Image className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium line-clamp-2">
                      {name || "Título do Produto"}
                    </h4>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold">
                        R$ {price.toFixed(2).replace('.', ',')}
                      </span>
                      
                      {comparePrice > 0 && comparePrice > price && (
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {comparePrice.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </div>
                    
                    {hasVariants && variantName && (
                      <div className="mt-3">
                        <Label className="text-sm text-muted-foreground">
                          {variantName}:
                        </Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {variantValues.filter(v => v.trim() !== '').map((value, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline"
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            >
                              {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Action Buttons */}
            <Card className="border shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleSave}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/produtos')}
                  >
                    Cancelar Edição
                  </Button>
                  
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => setDeleteConfirmOpen(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir Produto
                    </Button>
                  </DialogTrigger>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
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
    </DashboardLayout>
  );
};

export default EditarProduto;
