import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Eye, Save, Clock, Paintbrush, Type, Layout, AlertCircle, ImageIcon, X, Upload, Search, CheckSquare, Filter, ListFilter } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Product } from '@/types/product';

const mockProducts: Product[] = [
  {
    id: "prod_1",
    name: "Curso Avançado de Marketing Digital",
    type: "digital",
    price: 197.0,
    description: "Aprenda estratégias avançadas de marketing digital com este curso completo. Inclui módulos de SEO, mídia paga, e-mail marketing e análise de dados.",
    status: "active",
    imageUrl: "https://placehold.co/1000x1000/2563eb/ffffff?text=Curso+Marketing",
    createdAt: new Date(),
    updatedAt: new Date(),
    downloadUrl: "https://example.com/download"
  },
  {
    id: "prod_2",
    name: "E-book: Transformação Digital para Empresas",
    type: "digital",
    price: 47.0,
    description: "Guia completo para implementar a transformação digital no seu negócio. Casos de sucesso e passo a passo prático.",
    status: "active",
    imageUrl: "https://placehold.co/1000x1000/10b981/ffffff?text=E-book",
    createdAt: new Date(),
    updatedAt: new Date(),
    downloadUrl: "https://example.com/ebook"
  },
  {
    id: "prod_3",
    name: "Template de Planilha para Gestão Financeira",
    type: "digital",
    price: 29.90,
    description: "Controle suas finanças com esta planilha profissional. Inclui dashboards, controle de gastos e projeções financeiras.",
    status: "active",
    imageUrl: "https://placehold.co/1000x1000/f59e0b/ffffff?text=Planilha",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "prod_4",
    name: "Smartphone XPhone 12 Pro",
    type: "physical",
    price: 4999.0,
    description: "O mais avançado smartphone do mercado com câmera de 108MP, tela AMOLED de 6.7\" e processador ultrarrápido.",
    status: "active",
    stock: 15,
    imageUrl: "https://placehold.co/1000x1000/ef4444/ffffff?text=Smartphone",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

interface UpsellBuilderProps {
  initialData?: any;
  onSave?: (data: any) => void;
  productId?: string;
}

const UpsellBuilder: React.FC<UpsellBuilderProps> = ({ initialData, onSave, productId }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [fieldsEdited, setFieldsEdited] = useState({
    title: false,
    description: false,
    productImage: false
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  
  const [upsellData, setUpsellData] = useState(initialData || {
    id: 'new-' + Date.now(),
    title: '🎁 Oferta exclusiva para completar seu pedido!',
    description: '<p>Parabéns pela sua compra! Como cliente especial, você tem acesso a esta oferta por tempo limitado.</p>',
    productImage: 'https://placehold.co/1000x1000',
    productImageFile: null,
    triggerProductIds: [],
    applyToAllProducts: false,
    productId: '',
    productName: 'Produto Upsell',
    originalPrice: 197.0,
    discountPrice: 97.0,
    countdown: true,
    countdownMinutes: 15,
    paymentMethod: 'card',
    buttonText: 'Sim, quero adicionar!',
    declineText: 'Não, obrigado',
    redirectUrl: 'https://voltz.checkout/obrigado',
    showOriginalPrice: true,
    layout: 'vertical',
    theme: {
      background: '#ffffff',
      text: '#333333',
      button: '#2BBA00',
      buttonText: '#ffffff',
    }
  });
  
  const [showAutoFillAlert, setShowAutoFillAlert] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [productError, setProductError] = useState<string | null>(null);
  
  const [productNameFilter, setProductNameFilter] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showReplaceUpsellDialog, setShowReplaceUpsellDialog] = useState(false);
  const [hasConflictingProducts, setHasConflictingProducts] = useState(false);
  
  useEffect(() => {
    if (upsellData.productImage) {
      setImagePreview(upsellData.productImage);
    }
    
    if (productId && !upsellData.productId) {
      applyProductData(productId);
    }
    
    setFilteredProducts(mockProducts);
  }, []);
  
  useEffect(() => {
    if (productNameFilter) {
      const filtered = mockProducts.filter(product => 
        product.name.toLowerCase().includes(productNameFilter.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(mockProducts);
    }
  }, [productNameFilter]);
  
  useEffect(() => {
    if (upsellData.productId && upsellData.triggerProductIds.includes(upsellData.productId)) {
      setProductError("O produto oferecido no upsell não pode ser o mesmo que o produto gatilho.");
    } else {
      setProductError(null);
    }
    
    if (upsellData.triggerProductIds.length > 0) {
      const hasConflict = Math.random() < 0.3;
      setHasConflictingProducts(hasConflict);
    }
  }, [upsellData.productId, upsellData.triggerProductIds]);
  
  const handleChange = (field: string, value: any) => {
    if (field === 'title' || field === 'description' || field === 'productImage') {
      setFieldsEdited(prev => ({
        ...prev,
        [field]: true
      }));
    }
    
    setUpsellData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    handleChange('productImage', url);
    setImagePreview(url);
    
    if (url && upsellData.productImageFile) {
      setUpsellData(prev => ({
        ...prev,
        productImageFile: null
      }));
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessImage(file);
    }
  };
  
  const validateAndProcessImage = (file: File) => {
    setImageError(null);
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setImageError('Formato de arquivo inválido. Use apenas JPG ou PNG.');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Imagem muito grande. O tamanho máximo é 2MB.');
      return;
    }
    
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    
    setUpsellData(prev => ({
      ...prev,
      productImageFile: file,
      productImage: ''
    }));
    
    setFieldsEdited(prev => ({
      ...prev,
      productImage: true
    }));
  };
  
  const handleRemoveImage = () => {
    setImagePreview(null);
    setUpsellData(prev => ({
      ...prev,
      productImage: '',
      productImageFile: null
    }));
    setFieldsEdited(prev => ({
      ...prev,
      productImage: true
    }));
    setImageError(null);
  };
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessImage(e.dataTransfer.files[0]);
    }
  }, []);
  
  const handleThemeChange = (field: string, value: any) => {
    setUpsellData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [field]: value
      }
    }));
  };
  
  const handleTriggerProductSelect = (productId: string) => {
    if (upsellData.applyToAllProducts) {
      setUpsellData(prev => ({
        ...prev,
        applyToAllProducts: false,
      }));
    }
    
    const currentTriggerProducts = [...upsellData.triggerProductIds];
    
    if (currentTriggerProducts.includes(productId)) {
      setUpsellData(prev => ({
        ...prev,
        triggerProductIds: prev.triggerProductIds.filter(id => id !== productId)
      }));
    } else {
      setUpsellData(prev => ({
        ...prev,
        triggerProductIds: [...prev.triggerProductIds, productId]
      }));
    }
  };
  
  const handleOfferProductSelect = (productId: string) => {
    if (fieldsEdited.title || fieldsEdited.description || fieldsEdited.productImage) {
      setPendingProductId(productId);
      setShowConfirmDialog(true);
      return;
    }
    
    applyProductData(productId);
  };
  
  const handleApplyToAllProducts = (checked: boolean) => {
    setUpsellData(prev => ({
      ...prev,
      applyToAllProducts: checked,
      triggerProductIds: checked ? [] : prev.triggerProductIds
    }));
  };
  
  const handleSelectAllFiltered = () => {
    const filteredIds = filteredProducts.map(product => product.id);
    
    const validFilteredIds = upsellData.productId 
      ? filteredIds.filter(id => id !== upsellData.productId)
      : filteredIds;
    
    setUpsellData(prev => ({
      ...prev,
      applyToAllProducts: false,
      triggerProductIds: validFilteredIds
    }));
    
    if (validFilteredIds.length > 0 && Math.random() < 0.3) {
      setHasConflictingProducts(true);
    }
  };
  
  const applyProductData = (productId: string) => {
    const selectedProduct = mockProducts.find(p => p.id === productId);
    
    if (selectedProduct) {
      setUpsellData(prev => ({
        ...prev,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        title: `🎁 Oferta especial: ${selectedProduct.name}!`,
        description: selectedProduct.description || '<p>Detalhes do produto não disponíveis. Você pode adicionar uma descrição manualmente.</p>',
        productImage: selectedProduct.imageUrl || '',
        productImageFile: null,
        originalPrice: selectedProduct.price,
        discountPrice: Math.round(selectedProduct.price * 0.7)
      }));
      
      setImagePreview(selectedProduct.imageUrl || null);
      
      setFieldsEdited({
        title: false,
        description: false,
        productImage: false
      });
      
      setShowAutoFillAlert(true);
      
      setTimeout(() => {
        setShowAutoFillAlert(false);
      }, 5000);
    }
  };
  
  const confirmProductChange = () => {
    if (pendingProductId) {
      applyProductData(pendingProductId);
      setPendingProductId(null);
    }
    setShowConfirmDialog(false);
  };
  
  const handleConfirmReplaceUpsells = () => {
    setShowReplaceUpsellDialog(false);
    setHasConflictingProducts(false);
    
    toast.success("Upsells existentes substituídos", {
      description: "Os upsells anteriores foram substituídos com sucesso.",
    });
  };
  
  const validateBeforeSave = () => {
    let isValid = true;
    
    if (!upsellData.productImage && !upsellData.productImageFile) {
      toast.error("Imagem necessária", {
        description: "Você precisa adicionar uma imagem para exibir no upsell."
      });
      isValid = false;
    }
    
    if (upsellData.triggerProductIds.length === 0 && !upsellData.applyToAllProducts) {
      toast.error("Produto gatilho necessário", {
        description: "Você precisa selecionar pelo menos um produto gatilho ou aplicar a todos os produtos."
      });
      isValid = false;
    }
    
    if (!upsellData.productId) {
      toast.error("Produto de oferta necessário", {
        description: "Você precisa selecionar um produto para oferecer no upsell."
      });
      isValid = false;
    }
    
    if (productError) {
      toast.error("Erro de configuração", {
        description: productError
      });
      isValid = false;
    }
    
    if (hasConflictingProducts) {
      setShowReplaceUpsellDialog(true);
      return false;
    }
    
    return isValid;
  };
  
  const handleSave = async () => {
    if (!validateBeforeSave()) {
      return;
    }
    
    setSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dataToSave = { ...upsellData };
      
      if (upsellData.productImageFile) {
        dataToSave.productImage = imagePreview;
        delete dataToSave.productImageFile;
      }
      
      if (onSave) {
        onSave(dataToSave);
      }
      
      const productCount = upsellData.applyToAllProducts 
        ? mockProducts.length - 1
        : upsellData.triggerProductIds.length;
      
      toast.success("Upsell salvo com sucesso!", {
        description: `Suas configurações de upsell foram aplicadas a ${productCount} produtos.`,
      });
      
      setSaving(false);
    } catch (error) {
      toast.error("Erro ao salvar", {
        description: "Ocorreu um erro ao salvar suas configurações.",
      });
      console.error('Save error:', error);
      setSaving(false);
    }
  };
  
  const handlePreview = () => {
    if (!validateBeforeSave()) {
      return;
    }
    
    localStorage.setItem('upsell-preview-data', JSON.stringify(upsellData));
    navigate(`/marketing/upsell/${upsellData.id}/preview`);
  };
  
  const getSelectedTriggerProducts = () => {
    return mockProducts.filter(p => upsellData.triggerProductIds.includes(p.id));
  };
  
  const getSelectedOfferProduct = () => {
    return mockProducts.find(p => p.id === upsellData.productId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurar Upsell One Click</CardTitle>
          <CardDescription>
            Personalize como seu upsell será exibido após o checkout principal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 mb-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Configuração da Oferta de Upsell</h3>
              
              <div className="space-y-2">
                <Label htmlFor="offerProduct">Produto a ser ofertado no upsell</Label>
                <Select 
                  value={upsellData.productId}
                  onValueChange={handleOfferProductSelect}
                >
                  <SelectTrigger id="offerProduct">
                    <SelectValue placeholder="Escolha um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - R${product.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Ao selecionar um produto, os campos de imagem, título e descrição serão preenchidos automaticamente.
                </p>
                
                {getSelectedOfferProduct() && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs">
                      {getSelectedOfferProduct()?.name}
                    </div>
                  </div>
                )}
                
                {productError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {productError}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              {showAutoFillAlert && (
                <Alert variant="default" className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Essas informações foram preenchidas automaticamente com base no produto selecionado, mas você pode editar se quiser.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-4 mt-6 pt-4 border-t">
              <h3 className="text-lg font-medium">Aplicar este upsell em massa</h3>
              
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="applyToAll" 
                  checked={upsellData.applyToAllProducts}
                  onCheckedChange={handleApplyToAllProducts}
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor="applyToAll" 
                    className="font-medium"
                  >
                    Aplicar este upsell a todos os produtos da loja
                  </Label>
                  {upsellData.applyToAllProducts && (
                    <p className="text-sm text-amber-600">
                      Este upsell será aplicado automaticamente após qualquer compra feita na loja.
                    </p>
                  )}
                </div>
              </div>
              
              {!upsellData.applyToAllProducts && (
                <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="productFilter">Filtrar produtos pelo nome</Label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="productFilter"
                          type="text" 
                          placeholder="Digite para buscar produtos..." 
                          value={productNameFilter}
                          onChange={(e) => setProductNameFilter(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleSelectAllFiltered}
                        className="whitespace-nowrap"
                      >
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Selecionar todos
                      </Button>
                    </div>
                  </div>
                  
                  <div className="max-h-[300px] overflow-y-auto border rounded-md bg-white">
                    {filteredProducts.length > 0 ? (
                      <ul className="p-0 m-0 list-none divide-y">
                        {filteredProducts.map(product => (
                          <li key={product.id} className={`flex items-center p-3 ${product.id === upsellData.productId ? 'bg-slate-100 opacity-60' : ''}`}>
                            <Checkbox 
                              id={`product-${product.id}`} 
                              checked={upsellData.triggerProductIds.includes(product.id)}
                              onCheckedChange={() => handleTriggerProductSelect(product.id)}
                              disabled={product.id === upsellData.productId}
                              className="mr-3"
                            />
                            <Label 
                              htmlFor={`product-${product.id}`}
                              className={`flex-1 cursor-pointer ${product.id === upsellData.productId ? 'text-muted-foreground' : ''}`}
                            >
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-muted-foreground">
                                R${product.price.toFixed(2)} • {product.type === 'digital' ? 'Digital' : 'Físico'}
                              </div>
                            </Label>
                            {product.id === upsellData.productId && (
                              <span className="text-xs px-2 py-1 bg-slate-200 rounded ml-2">Produto da oferta</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        <p>Nenhum produto encontrado para "{productNameFilter}"</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <ListFilter className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {productNameFilter 
                        ? `${filteredProducts.length} produtos encontrados com "${productNameFilter}"`
                        : `${mockProducts.length} produtos no total`}
                    </span>
                    <div className="flex-1"></div>
                    <span className="font-medium">
                      {upsellData.triggerProductIds.length} produtos selecionados
                    </span>
                  </div>
                </div>
              )}
              
              {(upsellData.triggerProductIds.length === 0 && !upsellData.applyToAllProducts) && (
                <Alert variant="default" className="bg-slate-50 border-slate-200">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <AlertDescription className="text-muted-foreground">
                    Selecione ao menos um produto para ativar o upsell.
                  </AlertDescription>
                </Alert>
              )}
              
              {upsellData.applyToAllProducts && upsellData.productId && (
                <Alert variant="default" className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Upsell será aplicado em {mockProducts.length - 1} produtos (todos os produtos exceto o produto da oferta).
                  </AlertDescription>
                </Alert>
              )}
              
              {upsellData.triggerProductIds.length > 0 && (
                <Alert variant="default" className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700">
                    Upsell será aplicado em {upsellData.triggerProductIds.length} produtos.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="content">
                <Type className="h-4 w-4 mr-2" />
                Conteúdo
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Paintbrush className="h-4 w-4 mr-2" />
                Aparência
              </TabsTrigger>
              <TabsTrigger value="behavior">
                <Clock className="h-4 w-4 mr-2" />
                Comportamento
              </TabsTrigger>
              <TabsTrigger value="layout">
                <Layout className="h-4 w-4 mr-2" />
                Layout
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Oferta</Label>
                <Input 
                  id="title" 
                  value={upsellData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="🎁 Oferta exclusiva para completar seu pedido!"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição da Oferta</Label>
                <Textarea 
                  id="description" 
                  value={upsellData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Descrição rica do seu produto com emojis, parágrafos, etc."
                  className="min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground">
                  Suporta HTML básico para formatação (parágrafos, listas, negrito).
                </p>
              </div>
              
              <div className="space-y-4">
                <Label>Imagem Destaque do Upsell</Label>
                
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded-md object-contain"
                      />
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4">
                      <ImageIcon className="h-10 w-10 mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">Arraste uma imagem ou clique para fazer upload</p>
                      <p className="text-xs text-muted-foreground mb-4">Formatos: JPG, PNG (Max: 2MB, Ideal: 1000x1000px)</p>
                      <Button 
                        variant="outline" 
                        className="gap-2" 
                        onClick={() => document.getElementById('imageUpload')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        Escolher arquivo
                      </Button>
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    id="imageUpload" 
                    accept=".jpg,.jpeg,.png" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                  />
                </div>
                
                {imageError && (
                  <div className="text-sm text-destructive mt-1">{imageError}</div>
                )}
                
                <div className="space-y-2 mt-2">
                  <Label htmlFor="imageUrl">Ou insira uma URL de imagem</Label>
                  <Input 
                    id="imageUrl" 
                    value={upsellData.productImage}
                    onChange={handleImageUrlChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Se você inserir uma URL e fizer upload de um arquivo, o arquivo terá prioridade.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Nome do Produto</Label>
                  <Input 
                    id="productName" 
                    value={upsellData.productName}
                    onChange={(e) => handleChange('productName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Preço Original (R$)</Label>
                  <Input 
                    id="originalPrice" 
                    type="number"
                    value={upsellData.originalPrice}
                    onChange={(e) => handleChange('originalPrice', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountPrice">Preço com Desconto (R$)</Label>
                  <Input 
                    id="discountPrice" 
                    type="number"
                    value={upsellData.discountPrice}
                    onChange={(e) => handleChange('discountPrice', parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Texto do Botão Principal</Label>
                  <Input 
                    id="buttonText" 
                    value={upsellData.buttonText}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="declineText">Texto do Botão Recusar</Label>
                  <Input 
                    id="declineText" 
                    value={upsellData.declineText}
                    onChange={(e) => handleChange('declineText', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="redirectUrl">URL de Redirecionamento</Label>
                  <Input 
                    id="redirectUrl" 
                    value={upsellData.redirectUrl}
                    onChange={(e) => handleChange('redirectUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                URL para onde o cliente será direcionado após aceitar ou recusar a oferta.
              </p>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Cores</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bgColor">Cor de Fundo</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="bgColor" 
                        type="color"
                        value={upsellData.theme.background}
                        onChange={(e) => handleThemeChange('background', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input 
                        value={upsellData.theme.background}
                        onChange={(e) => handleThemeChange('background', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="textColor">Cor do Texto</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="textColor" 
                        type="color"
                        value={upsellData.theme.text}
                        onChange={(e) => handleThemeChange('text', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input 
                        value={upsellData.theme.text}
                        onChange={(e) => handleThemeChange('text', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Botão Principal</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="buttonColor">Cor do Botão</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="buttonColor" 
                        type="color"
                        value={upsellData.theme.button}
                        onChange={(e) => handleThemeChange('button', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input 
                        value={upsellData.theme.button}
                        onChange={(e) => handleThemeChange('button', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="buttonTextColor">Cor do Texto do Botão</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="buttonTextColor" 
                        type="color"
                        value={upsellData.theme.buttonText}
                        onChange={(e) => handleThemeChange('buttonText', e.target.value)}
                        className="w-12 h-10 p-1"
                      />
                      <Input 
                        value={upsellData.theme.buttonText}
                        onChange={(e) => handleThemeChange('buttonText', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="rounded-lg p-4 border bg-gray-50">
                  <h3 className="font-medium mb-2">Visualização</h3>
                  <div
                    className="p-4 rounded"
                    style={{ backgroundColor: upsellData.theme.background }}
                  >
                    <div 
                      className="mb-2 font-bold"
                      style={{ color: upsellData.theme.text }}
                    >
                      {upsellData.title}
                    </div>
                    <button 
                      className="px-4 py-2 rounded"
                      style={{ 
                        backgroundColor: upsellData.theme.button, 
                        color: upsellData.theme.buttonText 
                      }}
                    >
                      {upsellData.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="behavior" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="countdown" className="text-base">Exibir Contagem Regressiva</Label>
                    <p className="text-sm text-muted-foreground">
                      Adiciona um temporizador para criar senso de urgência
                    </p>
                  </div>
                  <Switch 
                    id="countdown"
                    checked={upsellData.countdown}
                    onCheckedChange={(checked) => handleChange('countdown', checked)}
                  />
                </div>
                
                {upsellData.countdown && (
                  <div className="space-y-2 pl-6 border-l-2 border-gray-100">
                    <Label htmlFor="countdownMinutes">Duração em Minutos</Label>
                    <Input 
                      id="countdownMinutes" 
                      type="number"
                      min="1"
                      max="60"
                      value={upsellData.countdownMinutes}
                      onChange={(e) => handleChange('countdownMinutes', parseInt(e.target.value))}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showOriginalPrice" className="text-base">Mostrar Preço Original</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibe o preço original riscado ao lado do preço com desconto
                  </p>
                </div>
                <Switch 
                  id="showOriginalPrice"
                  checked={upsellData.showOriginalPrice}
                  onCheckedChange={(checked) => handleChange('showOriginalPrice', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pagamento Padrão</Label>
                <Select 
                  value={upsellData.paymentMethod}
                  onValueChange={(value) => handleChange('paymentMethod', value)}
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Escolha o método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Cartão de Crédito (One Click)</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Esta configuração é apenas para preview. Na prática, será baseado no método de pagamento utilizado no checkout principal.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="layout" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="layout">Estilo de Layout</Label>
                <Select 
                  value={upsellData.layout}
                  onValueChange={(value) => handleChange('layout', value)}
                >
                  <SelectTrigger id="layout">
                    <SelectValue placeholder="Escolha o layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vertical">Vertical (Imagem acima, texto abaixo)</SelectItem>
                    <SelectItem value="horizontal">Horizontal (Imagem à esquerda, texto à direita)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`border rounded-lg p-4 ${upsellData.layout === 'vertical' ? 'bg-primary/10' : 'bg-muted'}`}>
                  <div className="flex items-center mb-2">
                    <div className={`h-4 w-4 rounded mr-2 ${upsellData.layout === 'vertical' ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                    <span className={`text-sm font-medium ${upsellData.layout === 'vertical' ? 'text-primary' : 'text-muted-foreground'}`}>
                      Layout Vertical
                    </span>
                  </div>
                  <div className="bg-background rounded p-3">
                    <div className="w-full h-20 bg-gray-200 rounded mb-2"></div>
                    <div className="w-3/4 h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                    <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                    <div className="w-1/2 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
                
                <div className={`border rounded-lg p-4 ${upsellData.layout === 'horizontal' ? 'bg-primary/10' : 'bg-muted'}`}>
                  <div className="flex items-center mb-2">
                    <div className={`h-4 w-4 rounded mr-2 ${upsellData.layout === 'horizontal' ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                    <span className={`text-sm font-medium ${upsellData.layout === 'horizontal' ? 'text-primary' : 'text-muted-foreground'}`}>
                      Layout Horizontal
                    </span>
                  </div>
                  <div className="bg-background rounded p-3">
                    <div className="flex">
                      <div className="w-1/3 h-20 bg-gray-200 rounded mr-2"></div>
                      <div className="w-2/3">
                        <div className="w-3/4 h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                        <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                        <div className="w-1/2 h-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={handlePreview}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Visualizar
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="gap-2"
          >
            {saving ? 'Salvando...' : (
              <>
                <Save className="h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Substituir conteúdo editado?</DialogTitle>
            <DialogDescription>
              Você já editou manualmente alguns campos. Selecionar um novo produto substituirá essas alterações.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancelar</Button>
            <Button onClick={confirmProductChange}>Substituir conteúdo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showReplaceUpsellDialog} onOpenChange={setShowReplaceUpsellDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Substituir upsells existentes?</DialogTitle>
            <DialogDescription>
              Alguns produtos selecionados já possuem upsells ativos. Deseja substituir os upsells anteriores?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplaceUpsellDialog(false)}>Cancelar</Button>
            <Button onClick={handleConfirmReplaceUpsells}>Sim, substituir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpsellBuilder;
