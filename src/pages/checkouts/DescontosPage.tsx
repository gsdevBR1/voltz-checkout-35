
import React, { useState } from 'react';
import CheckoutLayout from '@/components/checkout/CheckoutLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CreditCard, BanknoteIcon, QrCode } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DescontosPage = () => {
  const [descontos, setDescontos] = useState({
    cartao: 0,
    pix: 0,
    boleto: 0
  });

  const handleChange = (method: keyof typeof descontos, value: string) => {
    // Convert to number and ensure it's between 0 and 100
    let numValue = parseFloat(value);
    
    if (isNaN(numValue)) numValue = 0;
    if (numValue < 0) numValue = 0;
    if (numValue > 100) numValue = 100;
    
    setDescontos({
      ...descontos,
      [method]: numValue
    });
  };
  
  const handleSave = () => {
    // Here you would save the discounts to your backend
    toast({
      title: "Descontos salvos",
      description: "Os descontos por forma de pagamento foram atualizados com sucesso.",
    });
  };

  return (
    <CheckoutLayout 
      title="Descontos por Forma de Pagamento" 
      description="Configure descontos específicos para cada método de pagamento disponível na sua loja."
    >
      <Card>
        <CardHeader>
          <CardTitle>Configurar Descontos</CardTitle>
          <CardDescription>
            Esses descontos serão aplicados automaticamente no checkout quando o cliente escolher o método correspondente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="cartao">Cartão de Crédito</Label>
              </div>
              <div className="flex">
                <Input
                  id="cartao"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={descontos.cartao}
                  onChange={(e) => handleChange('cartao', e.target.value)}
                  className="rounded-r-none"
                />
                <div className="flex items-center justify-center bg-muted px-3 rounded-r-md border border-l-0 border-input">
                  %
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="pix">Pix</Label>
              </div>
              <div className="flex">
                <Input
                  id="pix"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={descontos.pix}
                  onChange={(e) => handleChange('pix', e.target.value)}
                  className="rounded-r-none"
                />
                <div className="flex items-center justify-center bg-muted px-3 rounded-r-md border border-l-0 border-input">
                  %
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BanknoteIcon className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="boleto">Boleto Bancário</Label>
              </div>
              <div className="flex">
                <Input
                  id="boleto"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={descontos.boleto}
                  onChange={(e) => handleChange('boleto', e.target.value)}
                  className="rounded-r-none"
                />
                <div className="flex items-center justify-center bg-muted px-3 rounded-r-md border border-l-0 border-input">
                  %
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </CardFooter>
      </Card>
    </CheckoutLayout>
  );
};

export default DescontosPage;
