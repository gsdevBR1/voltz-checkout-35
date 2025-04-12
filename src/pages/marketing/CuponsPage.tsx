
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MarketingLayout from '@/components/marketing/MarketingLayout';

const CuponsPage = () => {
  return (
    <MarketingLayout 
      title="Cupons de Desconto" 
      description="Crie e gerencie cupons de desconto para suas campanhas."
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Cupons de Desconto</h2>
          <p className="text-sm text-muted-foreground">
            Incentive suas vendas com promoções e descontos.
          </p>
        </div>
        <Button as={Link} to="/marketing/cupons/novo">
          <Plus className="mr-2 h-4 w-4" />
          Novo Cupom
        </Button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar cupons por código ou descrição..."
            className="pl-8"
          />
        </div>
      </div>

      <Tabs defaultValue="todos">
        <TabsList className="mb-4">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="ativos">Ativos</TabsTrigger>
          <TabsTrigger value="inativos">Inativos</TabsTrigger>
          <TabsTrigger value="expirados">Expirados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Código</th>
                    <th className="text-left p-4 font-medium">Desconto</th>
                    <th className="text-left p-4 font-medium">Validade</th>
                    <th className="text-left p-4 font-medium">Usos</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">BEMVINDO10</td>
                    <td className="p-4">10% OFF</td>
                    <td className="p-4">01/12/2025</td>
                    <td className="p-4">45/100</td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
                    </td>
                    <td className="p-4 flex items-center space-x-2">
                      <Switch checked={true} />
                      <Button variant="outline" size="sm" className="ml-2">Editar</Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">BLACKFRIDAY</td>
                    <td className="p-4">30% OFF</td>
                    <td className="p-4">30/11/2025</td>
                    <td className="p-4">125/500</td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
                    </td>
                    <td className="p-4 flex items-center space-x-2">
                      <Switch checked={true} />
                      <Button variant="outline" size="sm" className="ml-2">Editar</Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">VERAO2024</td>
                    <td className="p-4">15% OFF</td>
                    <td className="p-4">15/03/2024</td>
                    <td className="p-4">78/100</td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Expirado</Badge>
                    </td>
                    <td className="p-4 flex items-center space-x-2">
                      <Switch checked={false} />
                      <Button variant="outline" size="sm" className="ml-2">Editar</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">DESCONTO20</td>
                    <td className="p-4">R$ 20,00</td>
                    <td className="p-4">31/12/2025</td>
                    <td className="p-4">12/50</td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inativo</Badge>
                    </td>
                    <td className="p-4 flex items-center space-x-2">
                      <Switch checked={false} />
                      <Button variant="outline" size="sm" className="ml-2">Editar</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ativos" className="space-y-4">
          {/* Similar structure for active coupons */}
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-center p-6">
                <p className="text-muted-foreground">Conteúdo de cupons ativos será carregado aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inativos" className="space-y-4">
          {/* Similar structure for inactive coupons */}
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-center p-6">
                <p className="text-muted-foreground">Conteúdo de cupons inativos será carregado aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expirados" className="space-y-4">
          {/* Similar structure for expired coupons */}
          <Card>
            <CardContent className="p-0">
              <div className="flex items-center justify-center p-6">
                <p className="text-muted-foreground">Conteúdo de cupons expirados será carregado aqui</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MarketingLayout>
  );
};

export default CuponsPage;
