
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CycleHistoryTable from '@/components/admin/CycleHistoryTable';

const AdminStoreDetail = () => {
  const [activeTab, setActiveTab] = useState('details');
  
  // This is mock data - in a real app, this would come from an API or context
  const storeData = {
    id: '123',
    name: 'Loja de Teste',
    owner: 'Usuario Teste',
    email: 'usuario@teste.com',
    status: 'active',
    plan: 'Pré Escala',
    createDate: '10/01/2023',
    lastAccess: '14/04/2023',
    cycleValue: 200.00,
    monthlyRevenue: 75000.00,
    transactionFee: 2.0,
    domain: 'loja-teste.voltzcheckout.com',
    customDomain: 'checkout.minhaloja.com.br',
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <div className="flex-1 flex flex-col">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">{storeData.name}</h1>
              <p className="text-muted-foreground">ID: {storeData.id} | Proprietário: {storeData.owner}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={storeData.status === 'active' ? 'success' : 'destructive'}>
                {storeData.status === 'active' ? 'Ativa' : 'Inativa'}
              </Badge>
              <Badge variant="outline">{storeData.plan}</Badge>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="cycle-history">Histórico de Ciclos</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              {/* Store details content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-medium mb-4">Informações Gerais</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Email:</dt>
                      <dd>{storeData.email}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Criada em:</dt>
                      <dd>{storeData.createDate}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Último acesso:</dt>
                      <dd>{storeData.lastAccess}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-medium mb-4">Financeiro</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Valor do Ciclo:</dt>
                      <dd>R$ {storeData.cycleValue.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Faturamento Mensal:</dt>
                      <dd>R$ {storeData.monthlyRevenue.toFixed(2)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Taxa por Transação:</dt>
                      <dd>{storeData.transactionFee}%</dd>
                    </div>
                  </dl>
                  <div className="mt-4">
                    <Button variant="outline" size="sm">Ajustar Ciclo</Button>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-medium mb-4">Domínios</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Domínio Voltz:</dt>
                      <dd>{storeData.domain}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Domínio Personalizado:</dt>
                      <dd>{storeData.customDomain || 'Não configurado'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <div className="rounded-lg border">
                <h3 className="p-6 text-lg font-medium">Lista de Pedidos</h3>
                <p className="px-6 pb-6 text-muted-foreground">
                  Funcionalidade em desenvolvimento
                </p>
              </div>
            </TabsContent>

            <TabsContent value="cycle-history">
              <CycleHistoryTable storeId={storeData.id} />
            </TabsContent>

            <TabsContent value="settings">
              <div className="rounded-lg border">
                <h3 className="p-6 text-lg font-medium">Configurações da Loja</h3>
                <p className="px-6 pb-6 text-muted-foreground">
                  Funcionalidade em desenvolvimento
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminStoreDetail;
