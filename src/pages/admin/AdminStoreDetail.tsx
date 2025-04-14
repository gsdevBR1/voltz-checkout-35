
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, DollarSign, RefreshCw, Store, History } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CycleHistoryTable from '@/components/admin/CycleHistoryTable';

const AdminStoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');

  // Mock store data
  const store = {
    id: id || '',
    name: `Loja ${id?.split('-')[1] || '1'}`,
    owner: {
      name: `Usuário ${id?.split('-')[1] || '1'}`,
      email: `user${id?.split('-')[1] || '1'}@example.com`
    },
    billing: {
      current: Math.floor(Math.random() * 5000),
      fees: Math.floor(Math.random() * 200),
      limit: 200,
    },
    status: 'active',
    cycle: {
      value: Math.floor(Math.random() * 100),
      limit: 100,
      next: new Date(Date.now() + Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000))
    },
    created: new Date(Date.now() - Math.floor(Math.random() * 100 * 24 * 60 * 60 * 1000)),
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/admin/lojas')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Store className="h-5 w-5 mr-2" />
              {store.name}
            </h1>
            <Badge className="ml-2 bg-emerald-600">{store.status === 'active' ? 'Ativa' : 'Inativa'}</Badge>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sincronizar Dados
            </Button>
            <Button size="sm">
              <CreditCard className="h-4 w-4 mr-2" />
              Forçar Cobrança
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-background/5 p-1">
            <TabsTrigger value="info" className="data-[state=active]:bg-primary">
              Informações Gerais
            </TabsTrigger>
            <TabsTrigger value="cycle" className="data-[state=active]:bg-primary">
              <History className="h-4 w-4 mr-2" />
              Histórico de Ciclos
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-primary">
              Transações
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary">
              Configurações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Informações de Cobrança
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Ciclo Atual:</span>
                      <span className="font-medium">{formatCurrency(store.billing.limit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Faturamento no Ciclo:</span>
                      <span className="font-medium">{formatCurrency(store.billing.current)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Taxas Acumuladas:</span>
                      <span className="font-medium">{formatCurrency(store.billing.fees)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Proprietário</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Nome:</span>
                      <span className="font-medium">{store.owner.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="font-medium">{store.owner.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Detalhes da Loja</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ID:</span>
                      <span className="font-medium">{store.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Criada em:</span>
                      <span className="font-medium">
                        {new Intl.DateTimeFormat('pt-BR').format(store.created)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="cycle" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Alterações de Ciclo</CardTitle>
                <CardDescription>
                  Visualize todas as alterações de ciclo desta loja, sejam automáticas ou manuais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CycleHistoryTable storeId={id || ''} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transações da Loja</CardTitle>
                <CardDescription>
                  Visualize todas as transações realizadas por esta loja.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="py-10 text-center text-muted-foreground">
                  Informações de transações serão exibidas aqui.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Loja</CardTitle>
                <CardDescription>
                  Gerencie as configurações específicas desta loja.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="py-10 text-center text-muted-foreground">
                  Configurações da loja serão exibidas aqui.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminStoreDetail;
