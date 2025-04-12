
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink } from 'lucide-react';

interface ConnectWooCommerceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (credentials: {
    storeUrl: string;
    consumerKey: string;
    consumerSecret: string;
  }) => Promise<void>;
}

const ConnectWooCommerceDialog: React.FC<ConnectWooCommerceDialogProps> = ({
  isOpen,
  onClose,
  onConnect
}) => {
  const [storeUrl, setStoreUrl] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Validate form
      if (!storeUrl || !consumerKey || !consumerSecret) {
        toast({
          title: "Formulário incompleto",
          description: "Preencha todos os campos para conectar sua loja WooCommerce.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate URL format
      try {
        new URL(storeUrl);
      } catch (error) {
        toast({
          title: "URL inválida",
          description: "Informe uma URL válida para sua loja WooCommerce.",
          variant: "destructive",
        });
        return;
      }
      
      await onConnect({
        storeUrl,
        consumerKey,
        consumerSecret,
      });
      
      onClose();
    } catch (error) {
      console.error("Error connecting WooCommerce:", error);
      toast({
        title: "Erro ao conectar WooCommerce",
        description: "Não foi possível conectar sua loja WooCommerce. Verifique suas credenciais.",
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
          <DialogTitle>Conectar WooCommerce</DialogTitle>
          <DialogDescription>
            Conecte sua loja WooCommerce para sincronizar produtos e pedidos.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="store-url">URL da Loja</Label>
            <Input
              id="store-url"
              placeholder="https://sualoja.com.br"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              URL completa da sua loja WooCommerce
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consumer-key">Consumer Key</Label>
            <Input
              id="consumer-key"
              placeholder="ck_xxxxxxxxxxxxxxxxxxxx"
              value={consumerKey}
              onChange={(e) => setConsumerKey(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consumer-secret">Consumer Secret</Label>
            <Input
              id="consumer-secret"
              placeholder="cs_xxxxxxxxxxxxxxxxxxxx"
              type="password"
              value={consumerSecret}
              onChange={(e) => setConsumerSecret(e.target.value)}
            />
          </div>
          
          <div className="pt-2">
            <a 
              href="https://woocommerce.com/document/woocommerce-rest-api/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Como obter suas credenciais WooCommerce</span>
            </a>
          </div>
          
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
              Conectar WooCommerce
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWooCommerceDialog;
