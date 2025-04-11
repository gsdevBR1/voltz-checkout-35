import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, Filter, Mail } from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Mock data for abandoned carts
const mockAbandonedCarts = [
  {
    id: 'abc123',
    product: 'Notebook Ultra Slim',
    email: 'cliente1@example.com',
    stage: 'Pagamento',
    total: 3499.90,
    abandonedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
  },
  {
    id: 'def456',
    product: 'Smartphone Galaxy S22',
    email: 'cliente2@example.com',
    stage: 'Entrega',
    total: 2799.90,
    abandonedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
  },
  {
    id: 'ghi789',
    product: 'Headset Wireless Elite',
    email: 'cliente3@example.com',
    stage: 'Dados',
    total: 599.90,
    abandonedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 'jkl012',
    product: 'Smart TV 65" 4K',
    email: 'cliente4@example.com',
    stage: 'Pagamento',
    total: 4299.90,
    abandonedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
  {
    id: 'mno345',
    product: 'Câmera Mirrorless Pro',
    email: 'cliente5@example.com',
    stage: 'Entrega',
    total: 3899.90,
    abandonedAt: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
  },
];

const getStageBadge = (stage: string) => {
  const stageMap: Record<string, { color: string; label: string }> = {
    'Dados': { color: 'bg-blue-100 text-blue-800', label: 'Dados Pessoais' },
    'Entrega': { color: 'bg-amber-100 text-amber-800', label: 'Entrega' },
    'Pagamento': { color: 'bg-purple-100 text-purple-800', label: 'Pagamento' },
  };
  
  const stageConfig = stageMap[stage] || { color: 'bg-gray-100 text-gray-800', label: stage };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${stageConfig.color}`}>
      {stageConfig.label}
    </span>
  );
};

const CarrinhosAbandonados: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const { toast } = useToast();
  
  // Filter abandoned carts based on search and filters
  const filteredCarts = mockAbandonedCarts.filter(cart => {
    const matchesSearch = 
      cart.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cart.product.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStage = stageFilter === 'all' || cart.stage === stageFilter;
    
    // Time filter logic
    let matchesTime = true;
    const now = new Date();
    const hoursDiff = (now.getTime() - cart.abandonedAt.getTime()) / (1000 * 60 * 60);
    
    if (timeFilter === '24h' && hoursDiff > 24) {
      matchesTime = false;
    } else if (timeFilter === '7d' && hoursDiff > 24 * 7) {
      matchesTime = false;
    } else if (timeFilter === '30d' && hoursDiff > 24 * 30) {
      matchesTime = false;
    }
    
    return matchesSearch && matchesStage && matchesTime;
  });
  
  const handleRecoveryEmail = (email: string) => {
    toast({
      title: "Email de recuperação enviado",
      description: `Um email de recuperação foi enviado para ${email}`,
    });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar email, produto..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Etapas</SelectItem>
                <SelectItem value="Dados">Dados Pessoais</SelectItem>
                <SelectItem value="Entrega">Entrega</SelectItem>
                <SelectItem value="Pagamento">Pagamento</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo Período</SelectItem>
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Carrinhos Abandonados</CardTitle>
            <CardDescription>
              Clientes que iniciaram o checkout mas não finalizaram a compra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Etapa finalizada</TableHead>
                    <TableHead>Valor do Carrinho</TableHead>
                    <TableHead>Tempo Abandonado</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCarts.length > 0 ? (
                    filteredCarts.map((cart) => (
                      <TableRow key={cart.id}>
                        <TableCell className="max-w-[200px] truncate" title={cart.product}>
                          {cart.product}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{cart.email}</div>
                        </TableCell>
                        <TableCell>{getStageBadge(cart.stage)}</TableCell>
                        <TableCell>{formatCurrency(cart.total)}</TableCell>
                        <TableCell>{formatRelativeTime(cart.abandonedAt)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRecoveryEmail(cart.email)}
                            >
                              <Mail className="h-3.5 w-3.5 mr-1" />
                              Recuperar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Detalhes
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Nenhum carrinho abandonado encontrado com os filtros aplicados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CarrinhosAbandonados;
