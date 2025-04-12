
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink } from 'lucide-react';

interface ConnectShopifyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (credentials: {
    installationType: 'official' | 'private';
    shopDomain?: string;
    apiKey?: string;
    apiSecret?: string;
    accessToken?: string;
  }) => Promise<void>;
}

const ConnectShopifyDialog: React.FC<ConnectShopifyDialogProps> = ({
  isOpen,
  onClose,
  onConnect
}) => {
  const [installationType, setInstallationType] = useState<'official' | 'private'>('official');
  const [shopDomain, setShopDomain] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (installationType === 'official') {
        // Mock the official app installation flow (would open Shopify OAuth in real app)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast({
          title: "Redirecionando para instalação do app",
          description: "Você será redirecionado para instalar o app oficial na sua loja Shopify.",
        });
        
        // In a real app, we would redirect the user to Shopify's OAuth flow
        // Since this is a demo, we'll simulate a successful connection
        await onConnect({ installationType: 'official' });
      } else {
        // Validate form
        if (!shopDomain || !apiKey || !apiSecret || !accessToken) {
          toast({
            title: "Formulário incompleto",
            description: "Preencha todos os campos para conectar seu app privado.",
            variant: "destructive",
          });
          return;
        }
        
        await onConnect({
          installationType: 'private',
          shopDomain,
          apiKey,
          apiSecret,
          accessToken,
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Error connecting Shopify:", error);
      toast({
        title: "Erro ao conectar Shopify",
        description: "Não foi possível conectar sua loja Shopify. Verifique suas credenciais.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Conectar Shopify</DialogTitle>
          <DialogDescription>
            Conecte sua loja Shopify para importar produtos e gerenciar seu checkout.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <RadioGroup
            value={installationType}
            onValueChange={(value) => setInstallationType(value as 'official' | 'private')}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="official" id="official" />
              <div className="flex flex-col">
                <Label htmlFor="official" className="font-medium">App Oficial (Recomendado)</Label>
                <p className="text-sm text-muted-foreground">
                  Instale o app oficial da VOLTZ na sua loja Shopify para integração completa.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="private" id="private" />
              <div className="flex flex-col">
                <Label htmlFor="private" className="font-medium">App Privado</Label>
                <p className="text-sm text-muted-foreground">
                  Conecte manualmente através de um app privado (requer credenciais).
                </p>
              </div>
            </div>
          </RadioGroup>
          
          {installationType === 'private' && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="shop-domain">Domínio da loja</Label>
                <Input
                  id="shop-domain"
                  placeholder="sua-loja.myshopify.com"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  placeholder="xxxxxxxxxxxxxxxxxxxx"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-secret">API Secret</Label>
                <Input
                  id="api-secret"
                  placeholder="xxxxxxxxxxxxxxxxxxxx"
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="access-token">Access Token</Label>
                <Input
                  id="access-token"
                  placeholder="xxxxxxxxxxxxxxxxxxxx"
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                />
              </div>
              
              <div className="pt-2">
                <a 
                  href="https://help.shopify.com/en/manual/apps/private-apps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Como criar um app privado no Shopify</span>
                </a>
              </div>
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {installationType === 'official' ? 'Instalar App Oficial' : 'Conectar App Privado'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectShopifyDialog;
