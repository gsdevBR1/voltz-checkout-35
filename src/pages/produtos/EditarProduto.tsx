
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
import { ProductTypeBadge, ShopifyBadge } from '@/components/produtos/ProductBadge';
import { Product } from '@/types/product';
import { ArrowLeft, Package, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const EditarProduto: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch this from an API
    const foundProduct = mockProducts.find(p => p.id === id) || null;
    setProduct(foundProduct);
    setLoading(false);
  }, [id]);

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
      <div className="max-w-3xl mx-auto">
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
              {product.fromShopify && <ShopifyBadge />}
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Editar Produto</CardTitle>
            <CardDescription>
              Esta é uma página de demonstração. Em uma aplicação real, aqui você poderia editar os dados do produto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Você está visualizando o produto com ID: {product.id}
            </p>
            
            <div className="flex flex-col space-y-2">
              <p><strong>Nome:</strong> {product.name}</p>
              <p><strong>Descrição:</strong> {product.description}</p>
              <p><strong>Preço:</strong> R$ {(product.price / 100).toFixed(2).replace('.', ',')}</p>
              {product.type === 'physical' && (
                <p><strong>Estoque:</strong> {product.stock}</p>
              )}
              <p><strong>Status:</strong> {product.status === 'active' ? 'Ativo' : 'Inativo'}</p>
              <p><strong>Data de criação:</strong> {product.createdAt.toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => {
                toast({
                  title: "Produto atualizado",
                  description: "As alterações foram salvas com sucesso.",
                });
                navigate('/produtos');
              }}>
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditarProduto;
