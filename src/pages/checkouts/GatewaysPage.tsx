
import React, { useState } from 'react';
import CheckoutLayout from '@/components/checkout/CheckoutLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { CreditCard, ExternalLink, Globe, Flag } from 'lucide-react';

interface Gateway {
  id: string;
  name: string;
  logo: string;
  scopes: string[];
  isActive: boolean;
  publicKey?: string;
  secretKey?: string;
  token?: string;
}

const GatewaysPage = () => {
  const isMobile = useIsMobile();
  const [gateways, setGateways] = useState<Gateway[]>([
    {
      id: "alpa",
      name: "Alpa",
      logo: "/placeholder.svg",
      scopes: ["Nacional"],
      isActive: false
    },
    {
      id: "appmax",
      name: "Appmax",
      logo: "/placeholder.svg",
      scopes: ["Nacional"],
      isActive: false
    },
    {
      id: "astonpay",
      name: "Aston Pay",
      logo: "/placeholder.svg",
      scopes: ["Nacional", "Global"],
      isActive: true,
      publicKey: "pk_test_123",
      secretKey: "sk_test_***"
    },
    {
      id: "azcend",
      name: "Azcend",
      logo: "/placeholder.svg",
      scopes: ["Nacional", "Global"],
      isActive: false
    },
    {
      id: "axionpay",
      name: "Axionpay",
      logo: "/placeholder.svg",
      scopes: ["Nacional"],
      isActive: true,
      token: "AXN_TOKEN_123"
    },
    {
      id: "bestfy",
      name: "Bestfy",
      logo: "/placeholder.svg",
      scopes: ["Nacional", "Global"],
      isActive: false
    }
  ]);
  
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentGateway, setCurrentGateway] = useState<Gateway | null>(null);
  const [formData, setFormData] = useState({
    publicKey: "",
    secretKey: "",
    token: ""
  });
  
  const handleOpenModal = (gateway: Gateway) => {
    setCurrentGateway(gateway);
    setFormData({
      publicKey: gateway.publicKey || "",
      secretKey: gateway.secretKey || "",
      token: gateway.token || ""
    });
    
    if (isMobile) {
      setOpenDrawer(true);
    } else {
      setOpenDialog(true);
    }
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
    setOpenDialog(false);
    setOpenDrawer(false);
    
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
      <div className="grid gap-6 md:grid-cols-2">
        {gateways.map((gateway) => (
          <div 
            key={gateway.id} 
            className={cn(
              "rounded-lg border bg-card p-4 transition-all hover:shadow-md",
              gateway.isActive ? "border-green-200 dark:border-green-900" : "hover:border-muted-foreground/20"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{gateway.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {gateway.scopes.map((scope) => (
                      <Badge 
                        key={scope} 
                        variant="outline" 
                        className="bg-muted text-muted-foreground"
                      >
                        {scope === "Global" ? (
                          <Globe className="mr-1 h-3 w-3" />
                        ) : (
                          <Flag className="mr-1 h-3 w-3" />
                        )}
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div 
                className={cn(
                  "h-4 w-4 rounded-full transition-colors duration-300",
                  gateway.isActive 
                    ? "bg-green-500" 
                    : "bg-gray-300 dark:bg-gray-600"
                )}
              />
            </div>
            <div className="mt-4">
              {gateway.isActive ? (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 flex-1"
                    onClick={() => handleOpenModal(gateway)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 flex-1 text-destructive border-destructive/50 hover:bg-destructive/10"
                    onClick={() => handleRemoveGateway(gateway.id)}
                  >
                    Remover
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 w-full" 
                  onClick={() => handleOpenModal(gateway)}
                >
                  Integrar
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Dialog for desktop */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
            
            {currentGateway?.id === "axionpay" && (
              <div className="space-y-2">
                <Label htmlFor="token">Token</Label>
                <Input 
                  id="token" 
                  value={formData.token}
                  onChange={(e) => setFormData({...formData, token: e.target.value})}
                  placeholder="AXN_..." 
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
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleSaveGateway}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Drawer for mobile */}
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Integrar {currentGateway?.name}</DrawerTitle>
            <DrawerDescription>
              Insira as informações de integração do gateway.
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="publicKey-mobile">Chave Pública</Label>
              <Input 
                id="publicKey-mobile" 
                value={formData.publicKey}
                onChange={(e) => setFormData({...formData, publicKey: e.target.value})}
                placeholder="pk_..." 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secretKey-mobile">Chave Secreta</Label>
              <Input 
                id="secretKey-mobile" 
                value={formData.secretKey}
                onChange={(e) => setFormData({...formData, secretKey: e.target.value})}
                placeholder="sk_..." 
                type="password"
              />
            </div>
            
            {currentGateway?.id === "axionpay" && (
              <div className="space-y-2">
                <Label htmlFor="token-mobile">Token</Label>
                <Input 
                  id="token-mobile" 
                  value={formData.token}
                  onChange={(e) => setFormData({...formData, token: e.target.value})}
                  placeholder="AXN_..." 
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
          
          <DrawerFooter>
            <Button onClick={handleSaveGateway}>Salvar</Button>
            <Button variant="outline" onClick={() => setOpenDrawer(false)}>Cancelar</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </CheckoutLayout>
  );
};

export default GatewaysPage;
