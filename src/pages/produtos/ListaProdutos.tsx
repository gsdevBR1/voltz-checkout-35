
import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Product, ProductStatus, ProductType } from '@/types/product';
import { ProductTypeBadge, ShopifyBadge } from '@/components/produtos/ProductBadge';
import { StatusBadge } from '@/components/produtos/StatusBadge';
import { formatCurrency, cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Package, 
  FileText, 
  Search, 
  Link as LinkIcon, 
  Pencil, 
  Power
} from 'lucide-react';

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

const ListaProdutos: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || product.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [searchTerm, typeFilter, statusFilter, products]);

  const handleStatusToggle = useCallback((product: Product) => {
    // Toggle the product status
    const newStatus: ProductStatus = product.status === 'active' ? 'inactive' : 'active';
    
    // In a real app, this would be an API call
    console.log(`Toggling status for product ${product.id} from ${product.status} to ${newStatus}`);
    
    // Update the local state
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === product.id ? { ...p, status: newStatus } : p
      )
    );
    
    // Show a toast notification
    toast({
      title: `Produto ${newStatus === 'active' ? 'ativado' : 'desativado'}`,
      description: `${product.name} foi ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso.`,
    });
  }, [toast]);

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-2xl font-bold">Meus Produtos</div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/steps/shopify")}
              className="flex items-center gap-2"
            >
              <LinkIcon className="h-4 w-4" />
              Integrar com Shopify
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Produto
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/produtos/novo/fisico")}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>Novo Produto Físico</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/produtos/novo/digital")}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Novo Produto Digital</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar produto..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de produto" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="physical">Físico</SelectItem>
                <SelectItem value="digital">Digital</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {filteredProducts.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="flex flex-col items-center justify-center p-10 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-semibold">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground max-w-md mt-1">
                {mockProducts.length === 0 
                  ? "Você ainda não possui produtos cadastrados. Crie um novo ou integre com sua loja Shopify."
                  : "Nenhum produto corresponde aos filtros aplicados. Tente outros critérios de busca."}
              </p>
              {mockProducts.length === 0 && (
                <div className="mt-6 flex gap-4">
                  <Button onClick={() => navigate("/produtos/novo/fisico")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Produto
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/steps/shopify")}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Integrar com Shopify
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <div className="font-medium">{product.name}</div>
                        {product.fromShopify && (
                          <ShopifyBadge />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <ProductTypeBadge type={product.type} />
                    </TableCell>
                    <TableCell>{formatCurrency(product.price / 100)}</TableCell>
                    <TableCell>
                      {product.type === 'physical' 
                        ? product.stock?.toString() ?? '0'
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={product.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/produtos/editar/${product.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleStatusToggle(product)}
                          title={product.status === 'active' ? 'Desativar produto' : 'Ativar produto'}
                        >
                          <Power className={cn(
                            "h-4 w-4",
                            product.status === 'active' 
                              ? "text-green-500 hover:text-green-600" 
                              : "text-red-500 hover:text-red-600"
                          )} />
                          <span className="sr-only">
                            {product.status === 'active' ? 'Desativar' : 'Ativar'}
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ListaProdutos;
