
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface UpsellSuccessProps {
  productName: string;
  orderNumber?: string;
  redirectUrl: string;
}

const UpsellSuccess: React.FC<UpsellSuccessProps> = ({ 
  productName, 
  orderNumber = "123456", 
  redirectUrl 
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 bg-gradient-to-b from-green-50 to-white">
      <Card className="w-full max-w-md shadow-lg overflow-hidden border-0">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Produto Adicionado!</CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            O produto <strong>{productName}</strong> foi adicionado com sucesso ao seu pedido.
          </p>
          
          {orderNumber && (
            <div className="bg-muted py-3 px-4 rounded-md">
              <p className="text-sm">Número do Pedido</p>
              <p className="font-medium">{orderNumber}</p>
            </div>
          )}
          
          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              Um e-mail de confirmação foi enviado para você com os detalhes da sua compra.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="pb-6 pt-2 flex justify-center">
          <Button 
            className="w-full"
            onClick={() => window.location.href = redirectUrl}
          >
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpsellSuccess;
