
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import ClientePurchaseHistory from '@/components/cliente/ClientePurchaseHistory';
import ClienteCheckoutBehavior from '@/components/cliente/ClienteCheckoutBehavior';
import ClienteOriginInfo from '@/components/cliente/ClienteOriginInfo';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  DollarSign,
  ShoppingBag,
  Clock,
  ChevronLeft,
  Download,
  Star,
  MessageSquare,
  Pencil
} from "lucide-react";

// Mock customer data
const MOCK_CUSTOMERS = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-8888',
    document: '123.456.789-00',
    birthDate: '1990-01-10T00:00:00',
    firstPurchase: '2023-04-10T14:33:00',
    lastPurchase: '2025-04-12T18:40:00',
    totalSpent: 1390.00,
    purchaseCount: 7,
    isVip: false
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    phone: '(21) 98888-7777',
    document: '987.654.321-00',
    birthDate: '1985-05-15T00:00:00',
    firstPurchase: '2023-06-20T11:23:00',
    lastPurchase: '2025-04-05T10:15:00',
    totalSpent: 2450.75,
    purchaseCount: 5,
    isVip: true
  }
];

const ClienteDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<typeof MOCK_CUSTOMERS[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVip, setIsVip] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const foundCustomer = MOCK_CUSTOMERS.find(c => c.id === id);
    
    if (foundCustomer) {
      setCustomer(foundCustomer);
      setIsVip(foundCustomer.isVip);
    }
    
    setLoading(false);
  }, [id]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  const toggleVipStatus = () => {
    setIsVip(!isVip);
    // In a real app, this would trigger an API call to update the customer status
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse text-lg">Carregando dados do cliente...</div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!customer) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <h1 className="text-2xl font-bold">Cliente não encontrado</h1>
          <p className="text-muted-foreground">O cliente que você está procurando não existe ou foi removido.</p>
          <Button asChild>
            <Link to="/clientes/todos">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para a lista de clientes
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/clientes/todos">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" />
              Exportar Cliente
            </Button>
            
            <Button 
              variant={isVip ? "default" : "outline"} 
              size="sm"
              onClick={toggleVipStatus}
              className={isVip ? "bg-amber-500 hover:bg-amber-600" : ""}
            >
              <Star className="mr-1 h-4 w-4" />
              {isVip ? "Cliente VIP" : "Marcar como VIP"}
            </Button>
            
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-1 h-4 w-4" />
              Criar Nota
            </Button>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-7 w-7 text-primary" />
          Perfil do Cliente — {customer.name}
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Informações do Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{customer.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
                  <p className="font-medium">{customer.document}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">{formatDate(customer.birthDate)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Primeiro Pedido</p>
                  <p className="font-medium">{formatDateTime(new Date(customer.firstPurchase))}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Última Compra</p>
                  <p className="font-medium">{formatDateTime(new Date(customer.lastPurchase))}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Gasto</p>
                  <p className="font-medium">{formatCurrency(customer.totalSpent)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <ShoppingBag className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                  <p className="font-medium">{customer.purchaseCount}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Star className={`h-5 w-5 ${isVip ? 'text-amber-500' : 'text-muted-foreground'} mt-0.5`} />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{isVip ? 'Cliente VIP' : 'Cliente Regular'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4 mr-1" />
              Editar Informações
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <ClientePurchaseHistory customerId={customer.id} />
      <ClienteCheckoutBehavior customerId={customer.id} />
      <ClienteOriginInfo customerId={customer.id} />
    </DashboardLayout>
  );
};

export default ClienteDetalhes;
