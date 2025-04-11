
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ShoppingBag, Tag, Package } from 'lucide-react';

// Mock data for cart items
const MOCK_CART_ITEMS = [
  {
    id: '1',
    name: 'Fone Bluetooth',
    type: 'Principal',
    quantity: 1,
    unitPrice: 129.90,
  },
  {
    id: '2',
    name: 'Garantia Extra',
    type: 'OrderBump',
    quantity: 1,
    unitPrice: 30.00,
  }
];

interface LeadCartDetailsProps {
  leadId: string;
}

const LeadCartDetails: React.FC<LeadCartDetailsProps> = ({ leadId }) => {
  // Calculate subtotals and total
  const subtotals = MOCK_CART_ITEMS.map(item => item.quantity * item.unitPrice);
  const total = subtotals.reduce((sum, price) => sum + price, 0);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Icon for product type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Principal':
        return <Package className="h-4 w-4" />;
      case 'OrderBump':
        return <Tag className="h-4 w-4" />;
      default:
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Detalhes do Carrinho Abandonado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Valor Unitário</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_CART_ITEMS.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {getTypeIcon(item.type)}
                    <span>{item.type}</span>
                  </div>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                <TableCell className="text-right">{formatCurrency(subtotals[index])}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4} className="text-right font-semibold">
                Total potencial:
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(total)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        <div className="mt-4 p-4 rounded-md bg-muted/30 border">
          <p className="text-sm">
            <strong>Nota:</strong> Este carrinho está preservado e pode ser recuperado 
            enviando o link especial para o cliente.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCartDetails;
