
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
  User, 
  Search, 
  FileText, 
  Clock, 
  DollarSign, 
  Download 
} from 'lucide-react';

// Mock data for customers
const mockCustomers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-8888',
    document: '123.456.789-00',
    purchases: 5,
    totalSpent: 1250.50,
    lastPurchase: '2023-04-10T14:30:00'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    phone: '(21) 98888-7777',
    document: '987.654.321-00',
    purchases: 3,
    totalSpent: 750.25,
    lastPurchase: '2023-04-08T10:15:00'
  },
  {
    id: '3',
    name: 'Carlos Pereira',
    email: 'carlos.pereira@email.com',
    phone: '(31) 97777-6666',
    document: '456.789.123-00',
    purchases: 2,
    totalSpent: 425.00,
    lastPurchase: '2023-04-05T16:45:00'
  },
  {
    id: '4',
    name: 'Ana Souza',
    email: 'ana.souza@email.com',
    phone: '(41) 96666-5555',
    document: '789.123.456-00',
    purchases: 7,
    totalSpent: 1800.75,
    lastPurchase: '2023-04-12T09:20:00'
  },
  {
    id: '5',
    name: 'Roberto Lima',
    email: 'roberto.lima@email.com',
    phone: '(51) 95555-4444',
    document: '321.654.987-00',
    purchases: 1,
    totalSpent: 150.00,
    lastPurchase: '2023-04-01T11:30:00'
  }
];

const TodosClientes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState(mockCustomers);
  const [sortField, setSortField] = useState('name');
  
  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          <User className="h-6 w-6 text-primary" />
          Ver Todos Clientes
        </CardTitle>
        <CardDescription>
          Clientes que já realizaram pelo menos uma compra aprovada
        </CardDescription>
      </CardHeader>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome, email ou CPF..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            defaultValue="name"
            onValueChange={(value) => setSortField(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="purchases">Número de Compras</SelectItem>
              <SelectItem value="totalSpent">Valor Total</SelectItem>
              <SelectItem value="lastPurchase">Última Compra</SelectItem>
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
                <TableHead>Nome do Cliente</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead className="text-center">Compras</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.document}</TableCell>
                    <TableCell className="text-center">{customer.purchases}</TableCell>
                    <TableCell className="text-right">{formatCurrency(customer.totalSpent)}</TableCell>
                    <TableCell>{formatDate(customer.lastPurchase)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <User className="h-4 w-4 mr-1" />
                          Perfil
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Histórico
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredCustomers.length} de {customers.length} clientes
          </div>
          <Button variant="outline" size="sm">
            Ver Mais
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
};

export default TodosClientes;
