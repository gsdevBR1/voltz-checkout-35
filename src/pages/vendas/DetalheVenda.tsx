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
  CheckCircle, AlertCircle, CreditCard, Truck, Tag, MessageSquare,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  const order = mockOrder;
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: message,
    });
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = order.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const handleRepurchase = () => {
    const unavailableProductIndex = Math.random() > 0.8 ? 
      Math.floor(Math.random() * order.items.length) : -1;
    
    if (unavailableProductIndex >= 0) {
      const unavailableProduct = order.items[unavailableProductIndex];
      toast({
        variant: "destructive",
        title: "Produto indisponível",
        description: `${unavailableProduct.name} não está mais disponível em estoque. Você pode ajustar o carrinho antes de finalizar.`,
      });
    } else {
      toast({
        title: "Carrinho criado com sucesso!",
        description: `${order.items.length} produto(s) adicionados ao seu carrinho.`,
      });
    }
    
    setTimeout(() => {
      toast({
        title: "Redirecionando para o checkout...",
        description: "Em um app real, isso abriria uma nova página de checkout.",
      });
    }, 1500);
  };
  
  const canRepurchase = order.status === 'Aprovado' || order.status === 'Entregue';
  
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
            <Button 
              variant="whatsapp"
              onClick={handleWhatsAppContact}
              size="sm"
              className="relative pl-9"
            >
              <svg 
                className="absolute left-2 h-5 w-5" 
                fill="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Entrar em contato
            </Button>
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
        
        {canRepurchase && (
          <Card className="border-green-100 dark:border-green-800">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Repetir esta compra?</h3>
                <p className="text-muted-foreground max-w-md">
                  Clique abaixo para criar um novo pedido com os mesmos produtos.
                </p>
                <Button 
                  className="mt-2 bg-green-600 hover:bg-green-700"
                  onClick={handleRepurchase}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Recomprar Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DetalheVenda;
