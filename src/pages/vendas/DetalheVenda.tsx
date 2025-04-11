
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Receipt, User, MapPin, Package, Clock, Mail, 
  DollarSign, Link as LinkIcon, FileText, Copy, ExternalLink, 
  CheckCircle, AlertCircle, CreditCard, Truck, Tag
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Dados mockados para simular um pedido específico
const mockOrder = {
  id: '000123',
  product: 'Smartphone XYZ Pro',
  customer: 'João da Silva',
  email: 'joao@email.com',
  phone: '(11) 91234-5678',
  document: '123.456.789-00',
  birthDate: new Date(1990, 0, 10),
  total: 1299.90,
  subtotal: 1299.90,
  discount: 0,
  paymentMethod: 'Cartão de Crédito',
  installments: '12x',
  status: 'Aprovado',
  date: new Date(2025, 3, 10, 14, 33),
  coupon: '10OFF',
  address: {
    zipCode: '04567-890',
    street: 'Av. Paulista',
    number: '1000',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    complement: 'Ap. 301'
  },
  items: [
    {
      id: 1,
      name: 'Smartphone XYZ Pro',
      type: 'Principal',
      quantity: 1,
      price: 1199.90,
      total: 1199.90
    },
    {
      id: 2,
      name: 'Capa Protetora Premium',
      type: 'OrderBump',
      quantity: 1,
      price: 100.00,
      total: 100.00
    }
  ],
  timeline: [
    {
      date: new Date(2025, 3, 10, 14, 33),
      event: 'Pedido criado',
      icon: 'FileText'
    },
    {
      date: new Date(2025, 3, 10, 14, 35),
      event: 'Pagamento aprovado',
      icon: 'CheckCircle'
    },
    {
      date: new Date(2025, 3, 10, 14, 36),
      event: 'E-mail de confirmação enviado',
      icon: 'Mail'
    },
    {
      date: new Date(2025, 3, 10, 15, 30),
      event: 'Nota fiscal emitida',
      icon: 'FileText'
    }
  ]
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
    'Aprovado': { variant: 'default', label: 'Aprovado' },
    'Pendente': { variant: 'secondary', label: 'Pendente' },
    'Reembolsado': { variant: 'destructive', label: 'Reembolsado' },
    'Chargeback': { variant: 'destructive', label: 'Chargeback' },
  };
  
  const statusConfig = statusMap[status] || { variant: 'outline', label: status };
  
  return (
    <Badge variant={statusConfig.variant}>
      {statusConfig.label}
    </Badge>
  );
};

const getTypeTag = (type: string) => {
  const typeMap: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
    'Principal': { variant: 'outline', label: 'Principal' },
    'OrderBump': { variant: 'secondary', label: 'Order Bump' },
    'Upsell': { variant: 'default', label: 'Upsell' },
  };
  
  const typeConfig = typeMap[type] || { variant: 'outline', label: type };
  
  return type !== 'Principal' ? (
    <Badge variant={typeConfig.variant} className="ml-2">
      {typeConfig.label}
    </Badge>
  ) : null;
};

const DetalheVenda: React.FC = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  // Em um cenário real, usaríamos o ID para buscar os dados do pedido
  const order = mockOrder;
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: message,
    });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Receipt className="h-6 w-6 text-primary" />
              Detalhes da Venda #{order.id}
            </h1>
            <p className="text-muted-foreground">
              {formatDateTime(order.date)}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyToClipboard(`https://checkout.example.com/${order.id}`, "Link do checkout copiado!")}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Link
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast({
                title: "E-mail enviado",
                description: "Um e-mail manual foi enviado para o cliente.",
              })}
            >
              <Mail className="h-4 w-4 mr-2" />
              Enviar E-mail
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast({
                title: "Exportado",
                description: "Os dados da venda foram exportados com sucesso.",
              })}
            >
              <FileText className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            {order.status === 'Aprovado' && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => toast({
                  title: "Atenção",
                  description: "Função de reembolso simulada.",
                  variant: "destructive"
                })}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Reembolsar
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="resumo" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="cliente">Cliente</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>
          
          {/* Resumo do Pedido */}
          <TabsContent value="resumo" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Código do Pedido</p>
                    <p className="font-semibold">#{order.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Data e Hora</p>
                    <p className="font-medium">{formatDateTime(order.date)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                    <p className="font-semibold text-lg">{formatCurrency(order.total)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Forma de Pagamento</p>
                    <p className="font-medium flex items-center gap-1">
                      <CreditCard className="h-4 w-4 inline text-muted-foreground" />
                      {order.paymentMethod} ({order.installments})
                    </p>
                  </div>
                  {order.coupon && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Cupom Aplicado</p>
                      <p className="font-medium flex items-center gap-1">
                        <Tag className="h-4 w-4 inline text-muted-foreground" />
                        {order.coupon}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Informações do Cliente */}
          <TabsContent value="cliente" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p className="font-semibold">{order.customer}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                    <p className="font-medium">{order.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p className="font-medium">{order.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Documento</p>
                    <p className="font-medium">{order.document}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium">
                      {order.birthDate.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Produtos Comprados */}
          <TabsContent value="produtos" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Produtos Comprados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left">Produto</th>
                        <th className="px-4 py-3 text-left">Tipo</th>
                        <th className="px-4 py-3 text-center">Quantidade</th>
                        <th className="px-4 py-3 text-right">Valor Unitário</th>
                        <th className="px-4 py-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="px-4 py-3 font-medium">{item.name}</td>
                          <td className="px-4 py-3">
                            {item.type}
                            {getTypeTag(item.type)}
                          </td>
                          <td className="px-4 py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted/50">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-right font-medium">Total:</td>
                        <td className="px-4 py-3 text-right font-bold">{formatCurrency(order.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Endereço de Entrega */}
          <TabsContent value="endereco" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">CEP</p>
                    <p className="font-medium">{order.address.zipCode}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Rua</p>
                    <p className="font-medium">{order.address.street}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Número</p>
                    <p className="font-medium">{order.address.number}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Bairro</p>
                    <p className="font-medium">{order.address.neighborhood}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Cidade/Estado</p>
                    <p className="font-medium">{order.address.city} - {order.address.state}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Complemento</p>
                    <p className="font-medium">{order.address.complement || "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Histórico da Venda */}
          <TabsContent value="historico" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Histórico da Venda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 py-2">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {event.icon === 'FileText' && <FileText className="h-5 w-5" />}
                          {event.icon === 'CheckCircle' && <CheckCircle className="h-5 w-5" />}
                          {event.icon === 'Mail' && <Mail className="h-5 w-5" />}
                          {event.icon === 'AlertCircle' && <AlertCircle className="h-5 w-5" />}
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div className="h-full w-0.5 bg-border"></div>
                        )}
                      </div>
                      <div className="pb-8">
                        <p className="text-sm text-muted-foreground mb-1">
                          {event.date.toLocaleDateString('pt-BR')} - {event.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="font-medium">{event.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DetalheVenda;
