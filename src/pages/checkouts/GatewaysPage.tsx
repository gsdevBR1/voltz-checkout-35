
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
import { CreditCard, ExternalLink, Globe, Flag, HelpCircle, CreditCard as CardIcon, QrCode } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface GatewayRule {
  creditCardEnabled: boolean;
  pixEnabled: boolean;
  customInterestRate: boolean;
}

interface Gateway {
  id: string;
  name: string;
  logo: string;
  scopes: string[];
  isActive: boolean;
  secretKey?: string;
  rules?: GatewayRule;
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
      secretKey: "sk_test_***",
      rules: {
        creditCardEnabled: true,
        pixEnabled: true,
        customInterestRate: false
      }
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
      secretKey: "AXN_SECRET_123",
      rules: {
        creditCardEnabled: true,
        pixEnabled: false,
        customInterestRate: true
      }
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
    secretKey: "",
    creditCardEnabled: false,
    pixEnabled: false,
    customInterestRate: false,
    isActive: false
  });
  
  const handleOpenModal = (gateway: Gateway) => {
    setCurrentGateway(gateway);
    setFormData({
      secretKey: gateway.secretKey || "",
      creditCardEnabled: gateway.rules?.creditCardEnabled || false,
      pixEnabled: gateway.rules?.pixEnabled || false,
      customInterestRate: gateway.rules?.customInterestRate || false,
      isActive: gateway.isActive || false
    });
    
    if (isMobile) {
      setOpenDrawer(true);
    } else {
      setOpenDialog(true);
    }
  };
  
  const handleSaveGateway = () => {
    if (!currentGateway) return;
    
    if (!formData.secretKey) {
      toast({
        title: "Erro ao salvar",
        description: "A chave secreta é obrigatória.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedGateways = gateways.map(g => 
      g.id === currentGateway.id 
        ? { 
            ...g, 
            isActive: formData.isActive,
            secretKey: formData.secretKey,
            rules: {
              creditCardEnabled: formData.creditCardEnabled,
              pixEnabled: formData.pixEnabled,
              customInterestRate: formData.customInterestRate
            }
          } 
        : g
    );
    
    setGateways(updatedGateways);
    setOpenDialog(false);
    setOpenDrawer(false);
    
    toast({
      title: formData.isActive ? "Gateway integrado" : "Configurações salvas",
      description: `${currentGateway.name} foi ${formData.isActive ? "integrado" : "configurado"} com sucesso.`
    });
  };
  
  const handleRemoveGateway = (id: string) => {
    const updatedGateways = gateways.map(g => 
      g.id === id 
        ? { 
            ...g, 
            isActive: false, 
            secretKey: undefined, 
            rules: {
              creditCardEnabled: false,
              pixEnabled: false,
              customInterestRate: false
            }
          } 
        : g
    );
    
    setGateways(updatedGateways);
    
    toast({
      title: "Gateway removido",
      description: "O gateway foi removido com sucesso."
    });
  };

  const renderGatewayModalContent = () => (
    <>
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
          <CreditCard className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{currentGateway?.name.toUpperCase()}</h3>
          <p className="text-sm text-muted-foreground">
            Integre sua loja ao gateway {currentGateway?.name}.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {/* Informações básicas */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-base font-medium mb-4">Informações básicas</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="secretKey" className="flex items-center">
                    Chave Secreta: <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Input 
                    id="secretKey" 
                    value={formData.secretKey}
                    onChange={(e) => setFormData({...formData, secretKey: e.target.value})}
                    placeholder="Cole aqui sua chave secreta" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regras */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-base font-medium mb-4">Regras</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Ativar cartão de crédito</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs", formData.creditCardEnabled ? "text-primary" : "text-muted-foreground")}>
                      {formData.creditCardEnabled ? "SIM" : "NÃO"}
                    </span>
                    <Switch 
                      checked={formData.creditCardEnabled}
                      onCheckedChange={(checked) => setFormData({...formData, creditCardEnabled: checked})}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                    <span>Ativar pix</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs", formData.pixEnabled ? "text-primary" : "text-muted-foreground")}>
                      {formData.pixEnabled ? "SIM" : "NÃO"}
                    </span>
                    <Switch 
                      checked={formData.pixEnabled}
                      onCheckedChange={(checked) => setFormData({...formData, pixEnabled: checked})}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>Utilizar taxa de juros customizada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs", formData.customInterestRate ? "text-primary" : "text-muted-foreground")}>
                      {formData.customInterestRate ? "SIM" : "NÃO"}
                    </span>
                    <Switch 
                      checked={formData.customInterestRate}
                      onCheckedChange={(checked) => setFormData({...formData, customInterestRate: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Label htmlFor="status" className="flex items-center">
                  Status <span className="text-destructive ml-1">*</span>
                </Label>
                <RadioGroup 
                  value={formData.isActive ? "active" : "inactive"}
                  onValueChange={(value) => setFormData({...formData, isActive: value === "active"})}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inactive" id="inactive" />
                    <Label htmlFor="inactive" className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-gray-400 mr-2"></span>
                      Inativo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active" className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Ativo
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
          
          {/* Help Section */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-2">
                  <p className="text-primary font-medium">Está com dúvidas?</p>
                  <a 
                    href={`https://${currentGateway?.id}.com/docs`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80 flex items-center"
                  >
                    Como integrar o gateway {currentGateway?.name}?
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );

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
        <DialogContent className="max-w-4xl">
          {currentGateway && renderGatewayModalContent()}
          
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog(false)}
              className="border-primary text-primary hover:bg-primary/10"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveGateway} 
              disabled={!formData.secretKey}
              className="bg-primary text-white"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Drawer for mobile */}
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="px-4">
          <DrawerHeader className="text-left">
            <DrawerTitle>{currentGateway?.name}</DrawerTitle>
            <DrawerDescription>
              Integre sua loja ao gateway {currentGateway?.name}.
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 py-2">
            {currentGateway && renderGatewayModalContent()}
          </div>
          
          <DrawerFooter className="pt-2">
            <Button 
              onClick={handleSaveGateway}
              disabled={!formData.secretKey}
              className="bg-primary text-white"
            >
              Salvar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpenDrawer(false)}
              className="border-primary text-primary hover:bg-primary/10"
            >
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </CheckoutLayout>
  );
};

export default GatewaysPage;
