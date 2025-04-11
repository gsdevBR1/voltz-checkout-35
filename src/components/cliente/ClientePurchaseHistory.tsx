
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { FileText, Search, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

// Mock data for customer orders
const MOCK_ORDERS = [
  {
    id: "00123",
    date: "2025-04-12T18:40:00",
    product: "Fone Bluetooth",
    value: 199.90,
    status: "Aprovado",
  },
  {
    id: "00102",
    date: "2025-04-08T11:15:00",
    product: "Camiseta Branca",
    value: 89.90,
    status: "Reembolsado",
  },
  {
    id: "00098",
    date: "2025-04-01T09:30:00",
    product: "Notebook Dell",
    value: 4299.90,
    status: "Aprovado",
  },
  {
    id: "00056",
    date: "2025-03-15T14:20:00",
    product: "Mouse sem fio",
    value: 129.90,
    status: "Entregue",
  },
  {
    id: "00042",
    date: "2025-03-10T10:45:00",
    product: "Teclado Mecânico",
    value: 349.90,
    status: "Aprovado",
  },
  {
    id: "00039",
    date: "2025-03-05T16:30:00",
    product: "Mousepad XL",
    value: 49.90,
    status: "Entregue",
  },
  {
    id: "00027",
    date: "2025-02-20T13:15:00",
    product: "Monitor 24\"",
    value: 699.90,
    status: "Entregue",
  }
];

interface ClientePurchaseHistoryProps {
  customerId: string;
}

const ClientePurchaseHistory: React.FC<ClientePurchaseHistoryProps> = ({ customerId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState(MOCK_ORDERS);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredOrders(MOCK_ORDERS);
    } else {
      const filtered = MOCK_ORDERS.filter(
        order => 
          order.id.toLowerCase().includes(term) ||
          order.product.toLowerCase().includes(term) ||
          order.status.toLowerCase().includes(term)
      );
      setFilteredOrders(filtered);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovado':
        return 'text-green-600 bg-green-100 dark:bg-green-950 dark:text-green-400';
      case 'reembolsado':
        return 'text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-400';
      case 'entregue':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5 text-primary" />
          Histórico de Compras
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="history">
          <AccordionItem value="history" className="border-none">
            <AccordionTrigger className="py-2">
              <span className="text-base font-semibold">Pedidos ({MOCK_ORDERS.length})</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="mb-4 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pedidos por número, produto ou status..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Produto Principal</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>{formatDateTime(new Date(order.date))}</TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell className="text-right">{formatCurrency(order.value)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              asChild
                            >
                              <Link to={`/vendas/detalhe/${order.id}`}>
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Ver detalhes
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          Nenhum pedido encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" asChild>
          <Link to={`/clientes/historico/${customerId}`}>
            Ver histórico completo
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientePurchaseHistory;
