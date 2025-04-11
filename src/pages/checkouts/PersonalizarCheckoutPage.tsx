
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutLayout from '@/components/checkout/CheckoutLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CheckoutBuilder {
  id: string;
  name: string;
  theme: string;
  lastEdited: string;
}

const PersonalizarCheckoutPage = () => {
  const navigate = useNavigate();
  
  // Mock data - this would come from your backend
  const checkoutBuilders: CheckoutBuilder[] = [
    {
      id: "1",
      name: "Checkout Padrão",
      theme: "Light",
      lastEdited: "2023-12-15"
    },
    {
      id: "2",
      name: "Checkout Black Friday",
      theme: "Dark",
      lastEdited: "2023-11-22"
    }
  ];
  
  return (
    <CheckoutLayout 
      title="Personalizar Checkout" 
      description="Personalize a aparência e comportamento do checkout da sua loja."
    >
      <div className="flex justify-end mb-4">
        <Button className="flex items-center gap-2" onClick={() => navigate('/checkouts/personalizar/novo')}>
          <Plus className="h-4 w-4" />
          <span>Criar Novo Checkout Builder</span>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {checkoutBuilders.map((builder) => (
          <Card key={builder.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{builder.name}</CardTitle>
                <Badge variant="outline">{builder.theme}</Badge>
              </div>
              <CardDescription>
                Editado em: {new Date(builder.lastEdited).toLocaleDateString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-3 flex justify-between gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => navigate(`/checkouts/personalizar/${builder.id}`)}>
                <Edit className="h-4 w-4" />
                <span>Editar</span>
              </Button>
              <Button variant="secondary" size="sm" className="flex items-center gap-2" onClick={() => navigate(`/checkouts/personalizar/${builder.id}/preview`)}>
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </CheckoutLayout>
  );
};

export default PersonalizarCheckoutPage;
