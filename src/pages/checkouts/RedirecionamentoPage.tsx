
import React, { useState } from 'react';
import CheckoutLayout from '@/components/checkout/CheckoutLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, BanknoteIcon, QrCode } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const RedirecionamentoPage = () => {
  const [urls, setUrls] = useState({
    cartao: 'https://voltz.checkout/obrigado',
    pix: 'https://voltz.checkout/obrigado',
    boleto: 'https://voltz.checkout/obrigado'
  });

  const handleChange = (method: keyof typeof urls, value: string) => {
    setUrls({
      ...urls,
      [method]: value
    });
  };
  
  const handleSave = () => {
    // Here you would save the URLs to your backend
    toast({
      title: "URLs de redirecionamento salvas",
      description: "As URLs de redirecionamento foram atualizadas com sucesso.",
    });
  };

  return (
    <CheckoutLayout 
      title="Redirecionamento" 
      description="Configure as URLs de redirecionamento após o pagamento para cada método de pagamento."
    >
      <Card>
        <CardHeader>
          <CardTitle>Configurar Redirecionamentos</CardTitle>
          <CardDescription>
            Após o pagamento, seus clientes serão redirecionados para a URL correspondente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="cartao">Cartão de Crédito</Label>
              </div>
              <Input
                id="cartao"
                type="url"
                placeholder="https://"
                value={urls.cartao}
                onChange={(e) => handleChange('cartao', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="pix">Pix</Label>
              </div>
              <Input
                id="pix"
                type="url"
                placeholder="https://"
                value={urls.pix}
                onChange={(e) => handleChange('pix', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BanknoteIcon className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="boleto">Boleto Bancário</Label>
              </div>
              <Input
                id="boleto"
                type="url"
                placeholder="https://"
                value={urls.boleto}
                onChange={(e) => handleChange('boleto', e.target.value)}
              />
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

export default RedirecionamentoPage;
