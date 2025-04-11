
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Mail, 
  CreditCard, 
  User, 
  MapPin, 
  ArrowLeft, 
  Download, 
  Clock, 
  ExternalLink,
  Smartphone,
  ShoppingCart
} from 'lucide-react';
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Mock data for a single abandoned cart
const mockAbandonedCart = {
  id: 'abc123',
  customer: {
    name: 'Mariana Oliveira',
    email: 'mariana@email.com',
    phone: '(21) 99888-7766',
    document: 'CPF informado',
  },
  stage: 'Pagamento',
  total: 159.90,
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 - 16 * 60 * 1000), // 2 hours and 16 minutes ago
  items: [
    {
      id: 'p001',
      name: 'Produto X',
      type: 'Principal',
      quantity: 1,
      price: 129.90,
      total: 129.90,
    },
    {
      id: 'p002',
      name: 'Produto Y',
      type: 'OrderBump',
      quantity: 1,
      price: 30.00,
      total: 30.00,
    }
  ],
  checkoutProgress: {
    'Dados Pessoais': 'completed',
    'Endereço': 'completed',
    'Pagamento': 'not-started',
  },
  source: {
    origin: 'Anúncio Instagram',
    campaign: 'campanha-pascoa',
    device: 'Mobile',
    location: 'São Paulo - SP',
  }
};

const DetalheCarrinhoAbandonado: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [cart] = useState(mockAbandonedCart);
  
  // Calculate progress percentage based on completed steps
  const calculateProgress = () => {
    const total = Object.keys(cart.checkoutProgress).length;
    const completed = Object.values(cart.checkoutProgress).filter(status => status === 'completed').length;
    return (completed / total) * 100;
  };
  
  // Get hours since cart was abandoned
  const getHoursSinceAbandoned = () => {
    const now = new Date();
    return Math.floor((now.getTime() - cart.createdAt.getTime()) / (1000 * 60 * 60));
  };
  
  // Get status color based on abandonment time
  const getStatusColor = () => {
    const hours = getHoursSinceAbandoned();
    return hours < 6 ? 'amber' : 'destructive';
  };
  
  // Handle copy cart link
  const handleCopyCartLink = () => {
    // In a real app, this would be a deep link to resume the cart
    navigator.clipboard.writeText(`https://yourcheckout.com/resume-cart/${cart.id}`);
    toast({
      title: "Link copiado!",
      description: "O link para recuperação do carrinho foi copiado.",
    });
  };
  
  // Handle send recovery email
  const handleSendRecoveryEmail = () => {
    toast({
      title: "Email enviado com sucesso!",
      description: `Um email de recuperação foi enviado para ${cart.customer.email}`,
    });
  };
  
  // Handle mark as unrecoverable
  const handleMarkUnrecoverable = () => {
    toast({
      title: "Carrinho marcado como irrecuperável",
      description: "Este carrinho não será mais exibido nas estatísticas ativas.",
    });
  };
  
  // Handle WhatsApp contact
  const handleWhatsAppContact = () => {
    // Format phone number for WhatsApp link
    const phoneNumber = cart.customer.phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${cart.customer.name}, notamos que você deixou alguns produtos no carrinho em nossa loja. Posso ajudar a finalizar sua compra?`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with back button and actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/vendas/abandonados">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Carrinho Abandonado — Pedido Incompleto</h1>
              <p className="text-muted-foreground">ID: {cart.id}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyCartLink}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar link
            </Button>
            <Button 
              variant="outline" 
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
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
        
        {/* Abandonment Status Card */}
        <Card className={`border-l-4 border-l-${getStatusColor()}-500`}>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`h-5 w-5 text-${getStatusColor()}-500`} />
                <span className="text-lg font-medium">
                  Este carrinho foi abandonado na etapa: <span className="font-bold">{cart.stage}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formatRelativeTime(cart.createdAt)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main content in tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="checkout">Progresso</TabsTrigger>
            <TabsTrigger value="source">Origem</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Cliente</CardTitle>
                <CardDescription>
                  Informações coletadas durante o processo de checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
                      <p className="text-base">{cart.customer.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">E-mail</h3>
                      <p className="text-base">{cart.customer.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Telefone</h3>
                      <p className="text-base">{cart.customer.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Documento</h3>
                      <p className="text-base">{cart.customer.document}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Data de criação</h3>
                      <p className="text-base">{formatDateTime(cart.createdAt)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Tempo abandonado</h3>
                      <p className="text-base">{formatRelativeTime(cart.createdAt)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Total do carrinho</h3>
                      <p className="text-xl font-bold">{formatCurrency(cart.total)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Progress Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Progresso do Checkout</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress
                      value={calculateProgress()}
                      indicatorClassName={`bg-${getStatusColor()}-500`}
                      className="h-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      {Math.round(calculateProgress())}% completo
                    </p>
                    
                    <div className="pt-2 space-y-2">
                      {Object.entries(cart.checkoutProgress).map(([step, status]) => (
                        <div key={step} className="flex items-center">
                          {status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-success mr-2" />
                          ) : (
                            <XCircle className="h-5 w-5 text-muted-foreground mr-2" />
                          )}
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Products Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Produtos no Carrinho</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {item.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              x{item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(item.total)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(item.price)} cada
                          </p>
                        </div>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <p className="font-bold">Total</p>
                      <p className="font-bold">{formatCurrency(cart.total)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recovery Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Recomendadas</CardTitle>
                <CardDescription>
                  Recupere este carrinho abandonado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="default" 
                    className="w-full" 
                    onClick={handleSendRecoveryEmail}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar email de recuperação
                  </Button>
                  <Button 
                    variant="whatsapp" 
                    className="w-full relative pl-9" 
                    onClick={handleWhatsAppContact}
                  >
                    <svg 
                      className="absolute left-2 h-5 w-5" 
                      fill="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Contato via WhatsApp
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={handleMarkUnrecoverable}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Marcar como irrecuperável
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Produtos no Carrinho</CardTitle>
                <CardDescription>
                  Detalhes dos produtos que estavam sendo comprados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Valor Unitário</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant={item.type === 'Principal' ? 'outline' : 'secondary'}>
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6 flex justify-end">
                  <div className="w-full max-w-sm space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(cart.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Desconto:</span>
                      <span>R$ 0,00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(cart.total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Checkout Progress Tab */}
          <TabsContent value="checkout">
            <Card>
              <CardHeader>
                <CardTitle>Progresso do Checkout</CardTitle>
                <CardDescription>
                  Acompanhe o progresso do cliente no fluxo de checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <Progress 
                    value={calculateProgress()} 
                    indicatorClassName={`bg-${getStatusColor()}-500`} 
                    className="h-3"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(cart.checkoutProgress).map(([step, status], index) => (
                      <Card key={step} className={`border-l-4 ${status === 'completed' ? 'border-l-success' : 'border-l-muted'}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`rounded-full p-2 ${status === 'completed' ? 'bg-success/10 text-success' : 'bg-muted/10 text-muted-foreground'}`}>
                              {step === 'Dados Pessoais' && <User className="h-6 w-6" />}
                              {step === 'Endereço' && <MapPin className="h-6 w-6" />}
                              {step === 'Pagamento' && <CreditCard className="h-6 w-6" />}
                            </div>
                            <div>
                              <h3 className="font-medium">{step}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {status === 'completed' ? 'Etapa concluída' : 'Etapa não iniciada'}
                              </p>
                              <div className="mt-4">
                                {status === 'completed' ? (
                                  <Badge variant="success" className="bg-success/10 text-success">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Completo
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-muted/10">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Pendente
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Source Tab */}
          <TabsContent value="source">
            <Card>
              <CardHeader>
                <CardTitle>Origem e UTM</CardTitle>
                <CardDescription>
                  Informações sobre a origem e comportamento do cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Fonte</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <p className="text-base">{cart.source.origin}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Campanha UTM</h3>
                      <p className="text-base mt-1">
                        {cart.source.campaign}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Dispositivo</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-base">{cart.source.device}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Localização</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="text-base">{cart.source.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="mt-6">
                  <AccordionItem value="analytics">
                    <AccordionTrigger>Dados Analíticos Adicionais</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-muted/20 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Visualizações</p>
                            <p className="text-2xl font-bold">3</p>
                          </div>
                          <div className="bg-muted/20 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Tempo de sessão</p>
                            <p className="text-2xl font-bold">5:32</p>
                          </div>
                          <div className="bg-muted/20 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">Páginas visitadas</p>
                            <p className="text-2xl font-bold">7</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Estas informações são estimativas baseadas no comportamento do usuário durante a sessão.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DetalheCarrinhoAbandonado;
