
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  UserX, 
  Search, 
  Clock, 
  DollarSign, 
  Download,
  Mail,
  AlertCircle 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for leads
const mockLeads = [
  {
    id: '1',
    name: 'Fernando Costa',
    email: 'fernando.costa@email.com',
    phone: '(11) 98765-4321',
    lastActivity: '2023-04-10T14:30:00',
    abandonedStage: 'Pagamento',
    cartValue: 320.50
  },
  {
    id: '2',
    name: 'Juliana Santos',
    email: 'juliana.santos@email.com',
    phone: '(21) 99876-5432',
    lastActivity: '2023-04-09T11:20:00',
    abandonedStage: 'Entrega',
    cartValue: 175.25
  },
  {
    id: '3',
    name: null,
    email: 'pedro.andrade@email.com',
    phone: null,
    lastActivity: '2023-04-08T16:45:00',
    abandonedStage: 'Dados',
    cartValue: 450.00
  },
  {
    id: '4',
    name: 'Lucia Ferreira',
    email: 'lucia.ferreira@email.com',
    phone: '(51) 97654-3210',
    lastActivity: '2023-04-07T09:15:00',
    abandonedStage: 'Pagamento',
    cartValue: 280.75
  },
  {
    id: '5',
    name: 'Ricardo Mendes',
    email: null,
    phone: '(31) 96543-2109',
    lastActivity: '2023-04-06T13:40:00',
    abandonedStage: 'Dados',
    cartValue: 195.30
  }
];

// Badge colors for different stages
const stageBadgeVariants: Record<string, string> = {
  'Dados': 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300',
  'Entrega': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300',
  'Pagamento': 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300',
};

const Leads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState(mockLeads);
  const [sortField, setSortField] = useState('lastActivity');
  
  // Filter leads based on search term
  const filteredLeads = leads.filter(lead => 
    (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (lead.phone && lead.phone.includes(searchTerm))
  );
  
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <DashboardLayout>
      <CardHeader className="px-0">
        <CardTitle className="text-2xl flex items-center gap-2">
          <UserX className="h-6 w-6 text-primary" />
          Leads
        </CardTitle>
        <CardDescription>
          Usuários que iniciaram o checkout mas não finalizaram a compra
        </CardDescription>
      </CardHeader>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome, email ou telefone..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            defaultValue="lastActivity"
            onValueChange={(value) => setSortField(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="lastActivity">Última Atividade</SelectItem>
              <SelectItem value="cartValue">Valor do Carrinho</SelectItem>
              <SelectItem value="abandonedStage">Etapa Abandonada</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead>Etapa Abandonada</TableHead>
                <TableHead className="text-right">Valor do Carrinho</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      {lead.name || <span className="text-muted-foreground italic">Não informado</span>}
                    </TableCell>
                    <TableCell>
                      {lead.email || <span className="text-muted-foreground italic">Não informado</span>}
                    </TableCell>
                    <TableCell>
                      {lead.phone || <span className="text-muted-foreground italic">Não informado</span>}
                    </TableCell>
                    <TableCell>{formatDate(lead.lastActivity)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={stageBadgeVariants[lead.abandonedStage]}
                      >
                        {lead.abandonedStage}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(lead.cartValue)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          Recuperar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Nenhum lead encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredLeads.length} de {leads.length} leads
          </div>
          <Button variant="outline" size="sm">
            Ver Mais
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
};

export default Leads;
