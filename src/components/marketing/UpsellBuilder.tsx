
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Eye, Save, Clock, Paintbrush, Type, Layout } from 'lucide-react';
import { toast } from 'sonner';

interface UpsellBuilderProps {
  initialData?: any;
  onSave?: (data: any) => void;
  productId?: string;
}

const UpsellBuilder: React.FC<UpsellBuilderProps> = ({ initialData, onSave, productId }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  const [upsellData, setUpsellData] = useState(initialData || {
    id: 'new-' + Date.now(),
    title: '🎁 Oferta exclusiva para completar seu pedido!',
    description: '<p>Parabéns pela sua compra! Como cliente especial, você tem acesso a esta oferta por tempo limitado.</p>',
    productImage: 'https://placehold.co/1000x1000',
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
  
  const handleChange = (field: string, value: any) => {
    setUpsellData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleThemeChange = (field: string, value: any) => {
    setUpsellData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [field]: value
      }
    }));
  };
  
  const handleSave = async () => {
    setSaving(true);
    
    try {
      // In a real implementation, this would call your API to save the upsell
      // Example: await saveUpsell(upsellData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        onSave(upsellData);
      }
      
      toast.success("Upsell salvo com sucesso!", {
        description: "Suas configurações de upsell foram salvas.",
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
    // Store the current state in localStorage for the preview
    localStorage.setItem('upsell-preview-data', JSON.stringify(upsellData));
    
    // Navigate to preview page
    navigate(`/marketing/upsell/${upsellData.id}/preview`);
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
                  <Label htmlFor="productImage">URL da Imagem</Label>
                  <Input 
                    id="productImage" 
                    value={upsellData.productImage}
                    onChange={(e) => handleChange('productImage', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Preço Original (R$)</Label>
                  <Input 
                    id="originalPrice" 
                    type="number"
                    value={upsellData.originalPrice}
                    onChange={(e) => handleChange('originalPrice', parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discountPrice">Preço com Desconto (R$)</Label>
                  <Input 
                    id="discountPrice" 
                    type="number"
                    value={upsellData.discountPrice}
                    onChange={(e) => handleChange('discountPrice', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Texto do Botão Principal</Label>
                  <Input 
                    id="buttonText" 
                    value={upsellData.buttonText}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="declineText">Texto do Botão Recusar</Label>
                  <Input 
                    id="declineText" 
                    value={upsellData.declineText}
                    onChange={(e) => handleChange('declineText', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="redirectUrl">URL de Redirecionamento</Label>
                <Input 
                  id="redirectUrl" 
                  value={upsellData.redirectUrl}
                  onChange={(e) => handleChange('redirectUrl', e.target.value)}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground">
                  Para onde o cliente será direcionado após aceitar ou recusar a oferta.
                </p>
              </div>
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
    </div>
  );
};

export default UpsellBuilder;
