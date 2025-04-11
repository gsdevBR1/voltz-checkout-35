
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProductTypeBadge, ShopifyBadge } from '@/components/produtos/ProductBadge';
import { StatusBadge } from '@/components/produtos/StatusBadge';
import { Product } from '@/types/product';
import { 
  ArrowLeft, 
  Package, 
  FileText, 
  Edit, 
  Copy, 
  ExternalLink, 
  Clipboard,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock data for demonstration purposes
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Camiseta Premium',
    type: 'physical',
    price: 12990,
    description: 'Camiseta premium 100% algodão. Produzida com material de alta qualidade, ideal para o dia a dia. Disponível em várias cores e tamanhos.',
    stock: 42,
    status: 'active',
    imageUrl: 'https://via.placeholder.com/500',
    images: ['https://via.placeholder.com/500', 'https://via.placeholder.com/500?text=2', 'https://via.placeholder.com/500?text=3'],
    sku: 'CAM-PREM-001',
    barcode: '7894561230',
    costPrice: 5990,
    comparePrice: 19990,
    weight: 0.2,
    width: 30,
    height: 5,
    length: 40,
    hasVariants: true,
    variantName: 'Tamanho',
    variantValues: ['P', 'M', 'G', 'GG'],
    manageStock: true,
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-03-15')
  },
  {
    id: '2',
    name: 'Curso de Marketing Digital',
    type: 'digital',
    price: 19900,
    description: 'Curso completo de marketing digital para iniciantes e profissionais.',
    status: 'inactive',
    downloadUrl: 'https://example.com/download/marketing-digital',
    createdAt: new Date('2025-03-10'),
    updatedAt: new Date('2025-03-12')
  },
  {
    id: '3',
    name: 'Tênis Esportivo',
    type: 'physical',
    price: 24990,
    description: 'Tênis para corrida e academia com tecnologia de amortecimento.',
    stock: 15,
    status: 'active',
    fromShopify: true,
    imageUrl: 'https://via.placeholder.com/500?text=Tenis',
    images: ['https://via.placeholder.com/500?text=Tenis', 'https://via.placeholder.com/500?text=Tenis2'],
    sku: 'TEN-ESP-002',
    barcode: '7891234560',
    costPrice: 14990,
    comparePrice: 29990,
    weight: 0.5,
    width: 25,
    height: 15,
    length: 35,
    hasVariants: true,
    variantName: 'Tamanho',
    variantValues: ['38', '39', '40', '41', '42'],
    manageStock: true,
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
    downloadUrl: 'https://example.com/download/financas-pessoais',
    createdAt: new Date('2025-03-02'),
    updatedAt: new Date('2025-03-02')
  }
];

const VerProduto: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [duplicationDialogOpen, setDuplicationDialogOpen] = useState(false);

  const checkoutLink = `https://pagamento.voltzcheckout.com/checkout?product=${id}`;

  useEffect(() => {
    // In a real app, we would fetch this from an API
    const foundProduct = mockProducts.find(p => p.id === id) || null;
    setProduct(foundProduct);
    setLoading(false);
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(checkoutLink);
    setCopied(true);
    toast({
      title: "Link copiado",
      description: "Link de checkout copiado para a área de transferência.",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDuplicateProduct = () => {
    toast({
      title: "Produto duplicado",
      description: "Uma cópia do produto foi criada com sucesso.",
    });
    setDuplicationDialogOpen(false);
    // In a real app, this would create a new product and navigate to it
    navigate(`/produtos`);
  };

  const formatPrice = (price: number) => {
    return `R$ ${(price / 100).toFixed(2).replace('.', ',')}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Carregando produto...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-semibold mb-2">Produto não encontrado</h2>
          <p className="text-muted-foreground mb-6">O produto que você está procurando não existe.</p>
          <Button onClick={() => navigate('/produtos')}>
            Voltar para Produtos
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/produtos')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Produtos
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {product.type === 'physical' ? (
                <Package className="h-6 w-6" />
              ) : (
                <FileText className="h-6 w-6" />
              )}
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <ProductTypeBadge type={product.type} />
              <StatusBadge status={product.status} />
              {product.fromShopify && <ShopifyBadge />}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/produtos/${id}/editar`)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar Produto
            </Button>
            
            <Dialog open={duplicationDialogOpen} onOpenChange={setDuplicationDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicar Produto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Duplicar produto</DialogTitle>
                  <DialogDescription>
                    Tem certeza que deseja criar uma cópia deste produto?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDuplicationDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleDuplicateProduct}>Duplicar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={() => window.open(checkoutLink, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Ir para o Produto
            </Button>
          </div>
        </div>

        {product.status !== 'active' && (
          <Card className="mb-6 border-yellow-300 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                <p className="font-medium">Este produto ainda não está ativo. Finalize o cadastro para gerar o link de checkout.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Link de checkout</CardTitle>
            <CardDescription>
              Compartilhe este link com seus clientes para que eles possam comprar o produto diretamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <p className="text-sm font-mono flex-1 truncate">{checkoutLink}</p>
              <Button size="sm" variant="outline" onClick={handleCopyLink}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Clipboard className="h-4 w-4 mr-2" />}
                {copied ? 'Copiado' : 'Copiar'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            {product.images && product.images.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Imagens do produto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="aspect-square rounded-md overflow-hidden border">
                        <img 
                          src={image} 
                          alt={`${product.name} - Imagem ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Imagens do produto</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-40 bg-muted/50">
                  <p className="text-muted-foreground">Nenhuma imagem disponível</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Preços</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preço de venda:</span>
                    <span className="font-semibold">{formatPrice(product.price)}</span>
                  </div>
                  
                  {product.comparePrice && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Preço de comparação:</span>
                      <span className="line-through">{formatPrice(product.comparePrice)}</span>
                    </div>
                  )}
                  
                  {product.costPrice && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Preço de custo:</span>
                      <span>{formatPrice(product.costPrice)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações básicas</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground mb-4 whitespace-pre-line">{product.description}</p>
              
              {product.hasVariants && product.variantName && product.variantValues && (
                <>
                  <Separator className="my-4" />
                  <h3 className="font-semibold mb-2">Variantes</h3>
                  <div className="mb-2">
                    <span className="text-muted-foreground">Nome da opção: </span>
                    <span className="font-medium">{product.variantName}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variantValues.map((value, index) => (
                      <div key={index} className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-sm">
                        {value}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.sku && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU:</span>
                      <span className="font-mono">{product.sku}</span>
                    </div>
                  )}
                  
                  {product.barcode && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Código de barras:</span>
                      <span className="font-mono">{product.barcode}</span>
                    </div>
                  )}
                  
                  {product.manageStock && product.type === 'physical' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estoque atual:</span>
                      <span className="font-semibold">{product.stock} unidades</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gerenciar estoque:</span>
                    <span>{product.manageStock ? 'Sim' : 'Não'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {product.type === 'physical' && (
              <Card>
                <CardHeader>
                  <CardTitle>Peso e dimensões</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {product.weight && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Peso:</span>
                        <span>{product.weight} kg</span>
                      </div>
                    )}
                    
                    {product.width && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Largura:</span>
                        <span>{product.width} cm</span>
                      </div>
                    )}
                    
                    {product.height && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Altura:</span>
                        <span>{product.height} cm</span>
                      </div>
                    )}
                    
                    {product.length && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Comprimento:</span>
                        <span>{product.length} cm</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VerProduto;
