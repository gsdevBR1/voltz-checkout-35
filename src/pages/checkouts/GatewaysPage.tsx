import React, { useState } from 'react';
import CheckoutLayout from '@/components/checkout/CheckoutLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ExternalLink, Check, X, CreditCard, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Gateway {
  id: string;
  name: string;
  logo: string;
  isActive: boolean;
  publicKey?: string;
  secretKey?: string;
  token?: string;
}

const GatewaysPage = () => {
  const [gateways, setGateways] = useState<Gateway[]>([
    {
      id: "stripe",
      name: "Stripe",
      logo: "/placeholder.svg",
      isActive: true,
      publicKey: "pk_test_123",
      secretKey: "sk_test_***"
    },
    {
      id: "paypal",
      name: "PayPal",
      logo: "/placeholder.svg",
      isActive: false
    },
    {
      id: "mercadopago",
      name: "Mercado Pago",
      logo: "/placeholder.svg",
      isActive: false
    }
  ]);
  
  const [open, setOpen] = useState(false);
  const [currentGateway, setCurrentGateway] = useState<Gateway | null>(null);
  const [formData, setFormData] = useState({
    publicKey: "",
    secretKey: "",
    token: ""
  });
  
  const handleOpenDialog = (gateway: Gateway) => {
    setCurrentGateway(gateway);
    setFormData({
      publicKey: gateway.publicKey || "",
      secretKey: gateway.secretKey || "",
      token: gateway.token || ""
    });
    setOpen(true);
  };
  
  const handleSaveGateway = () => {
    if (!currentGateway) return;
    
    const updatedGateways = gateways.map(g => 
      g.id === currentGateway.id 
        ? { 
            ...g, 
            isActive: true,
            publicKey: formData.publicKey,
            secretKey: formData.secretKey,
            token: formData.token
          } 
        : g
    );
    
    setGateways(updatedGateways);
    setOpen(false);
    
    toast({
      title: "Gateway integrado",
      description: `${currentGateway.name} foi integrado com sucesso.`
    });
  };
  
  const handleRemoveGateway = (id: string) => {
    const updatedGateways = gateways.map(g => 
      g.id === id 
        ? { ...g, isActive: false, publicKey: undefined, secretKey: undefined, token: undefined } 
        : g
    );
    
    setGateways(updatedGateways);
    
    toast({
      title: "Gateway removido",
      description: "O gateway foi removido com sucesso."
    });
  };

  return (
    <CheckoutLayout 
      title="Gateways de Pagamento" 
      description="Integre sua loja com diversos gateways de pagamento para oferecer várias opções aos seus clientes."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gateways.map((gateway) => (
          <Card key={gateway.id} className={cn(
            "transition-all",
            gateway.isActive 
              ? "border-green-200 dark:border-green-900" 
              : "hover:border-muted-foreground/20"
          )}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {gateway.name}
                </CardTitle>
                {gateway.isActive ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-muted">
                    Inativo
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardFooter className="pt-3">
              {gateway.isActive ? (
                <div className="flex w-full gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 flex-1"
                    onClick={() => handleOpenDialog(gateway)}
                  >
                    <Edit className="h-4 w-4" />
                    <span>Editar</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 flex-1 text-destructive border-destructive/50 hover:bg-destructive/10"
                    onClick={() => handleRemoveGateway(gateway.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remover</span>
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 w-full" 
                  onClick={() => handleOpenDialog(gateway)}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Integrar</span>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Integrar {currentGateway?.name}</DialogTitle>
            <DialogDescription>
              Insira as informações de integração do gateway.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="publicKey">Chave Pública</Label>
              <Input 
                id="publicKey" 
                value={formData.publicKey}
                onChange={(e) => setFormData({...formData, publicKey: e.target.value})}
                placeholder="pk_..." 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secretKey">Chave Secreta</Label>
              <Input 
                id="secretKey" 
                value={formData.secretKey}
                onChange={(e) => setFormData({...formData, secretKey: e.target.value})}
                placeholder="sk_..." 
                type="password"
              />
            </div>
            
            {currentGateway?.id === "mercadopago" && (
              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <Input 
                  id="token" 
                  value={formData.token}
                  onChange={(e) => setFormData({...formData, token: e.target.value})}
                  placeholder="APP_USR-..." 
                />
              </div>
            )}
            
            <div className="flex items-center pt-2">
              <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                <a 
                  href={`https://${currentGateway?.id}.com/dashboard`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Acessar dashboard do {currentGateway?.name}
                </a>
              </span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveGateway}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CheckoutLayout>
  );
};

export default GatewaysPage;
