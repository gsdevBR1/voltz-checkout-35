
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatDateTime } from '@/lib/utils';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, Mail, Link2, Tag, ClipboardCopy, Ban, FileEdit } from 'lucide-react';
import LeadCartDetails from '@/components/lead/LeadCartDetails';
import LeadCheckoutProgress from '@/components/lead/LeadCheckoutProgress';
import LeadOriginInfo from '@/components/lead/LeadOriginInfo';

// Mock data for a lead
const MOCK_LEAD = {
  id: '1',
  name: 'Mariana Oliveira',
  email: 'mariana@email.com',
  phone: '(21) 99888-7766',
  cpfCnpj: null,
  createdAt: '2025-04-11T17:40:00',
  lastActivity: '2025-04-11T17:45:00',
  status: 'abandoned',
  abandonedStage: 'Pagamento',
};

const statusVariants: Record<string, { badge: string, message: string, icon: React.ReactNode }> = {
  abandoned: {
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300',
    message: 'Este lead ainda não finalizou a compra.',
    icon: <AlertTriangle className="h-5 w-5" />
  },
  converted: {
    badge: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300',
    message: 'Lead convertido em cliente.',
    icon: <CheckCircle className="h-5 w-5" />
  },
  lost: {
    badge: 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300',
    message: 'Lead marcado como não recuperável.',
    icon: <XCircle className="h-5 w-5" />
  }
};

const LeadDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock function for time since last activity
  const getTimeSinceLastActivity = () => {
    return '3 dias';
  };

  return (
    <DashboardLayout>
      {/* Back button */}
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/clientes/leads">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Leads
          </Link>
        </Button>
      </div>
      
      {/* Status banner */}
      <div className={`p-4 rounded-lg mb-6 flex items-center justify-between ${statusVariants[MOCK_LEAD.status].badge}`}>
        <div className="flex items-center gap-2">
          {statusVariants[MOCK_LEAD.status].icon}
          <span className="font-medium">
            {statusVariants[MOCK_LEAD.status].message} 
            Última atividade: há {getTimeSinceLastActivity()}.
          </span>
        </div>
      </div>
      
      {/* Lead Profile Header */}
      <CardHeader className="px-0">
        <CardTitle className="text-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span>👤 Perfil do Lead — {MOCK_LEAD.name}</span>
          </div>
          <Badge variant="outline" className={`text-sm ${statusVariants[MOCK_LEAD.status].badge}`}>
            ⚠️ Carrinho Abandonado na etapa: {MOCK_LEAD.abandonedStage}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      {/* Lead Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            Dados Coletados
          </CardTitle>
          <CardDescription>
            Informações do lead capturadas durante o checkout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium mt-1">{MOCK_LEAD.name}</p>
            </div>
            
            <div className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground">E-mail</p>
              <p className="font-medium mt-1">{MOCK_LEAD.email}</p>
            </div>
            
            <div className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium mt-1">{MOCK_LEAD.phone || "—"}</p>
            </div>
            
            <div className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground">CPF/CNPJ</p>
              <p className="font-medium mt-1">{MOCK_LEAD.cpfCnpj || "— (não preenchido)"}</p>
            </div>
            
            <div className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground">Data do Lead</p>
              <p className="font-medium mt-1">{formatDateTime(new Date(MOCK_LEAD.createdAt))}</p>
            </div>
            
            <div className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground">Última Atividade</p>
              <p className="font-medium mt-1">{formatDateTime(new Date(MOCK_LEAD.lastActivity))}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for additional information */}
      <Tabs defaultValue="cart" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="cart">🛒 Carrinho</TabsTrigger>
          <TabsTrigger value="progress">🔄 Progresso no Checkout</TabsTrigger>
          <TabsTrigger value="origin">🌐 Origem do Tráfego</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cart">
          <LeadCartDetails leadId={id || ''} />
        </TabsContent>
        
        <TabsContent value="progress">
          <LeadCheckoutProgress leadId={id || ''} />
        </TabsContent>
        
        <TabsContent value="origin">
          <LeadOriginInfo leadId={id || ''} />
        </TabsContent>
      </Tabs>
      
      {/* Lead Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Ações Disponíveis</CardTitle>
          <CardDescription>Opções para recuperação e gerenciamento do lead</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="w-full flex items-center gap-2 h-auto py-4">
              <Mail className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span>Enviar E-mail</span>
                <span className="text-xs text-muted-foreground">Recuperação automática</span>
              </div>
            </Button>
            
            <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-4">
              <ClipboardCopy className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span>Copiar Link</span>
                <span className="text-xs text-muted-foreground">Carrinho preservado</span>
              </div>
            </Button>
            
            <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-4">
              <Ban className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span>Não Recuperável</span>
                <span className="text-xs text-muted-foreground">Marcar como perdido</span>
              </div>
            </Button>
            
            <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-4">
              <FileEdit className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span>Criar Anotação</span>
                <span className="text-xs text-muted-foreground">Adicionar observação</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default LeadDetalhes;
