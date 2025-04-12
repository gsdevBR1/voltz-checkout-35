
import React, { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink } from 'lucide-react';
import { PixelIntegration } from '@/types/integration';

interface ConnectPixelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  integration: PixelIntegration | null;
  onConnect: (platform: string, credentials: Record<string, string>) => Promise<void>;
}

const ConnectPixelDialog: React.FC<ConnectPixelDialogProps> = ({
  isOpen,
  onClose,
  integration,
  onConnect
}) => {
  const [fields, setFields] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (integration && integration.credentials) {
      setFields(integration.credentials as Record<string, string>);
    } else {
      setFields({});
    }
  }, [integration]);

  const handleChange = (fieldName: string, value: string) => {
    setFields(prev => ({ ...prev, [fieldName]: value }));
  };

  const getFieldConfig = () => {
    if (!integration) return [];
    
    switch (integration.platform) {
      case 'google_ads':
        return [
          { name: 'conversionId', label: 'Conversion ID', placeholder: 'AW-XXXXXXXXX', required: true },
          { name: 'conversionLabel', label: 'Conversion Label', placeholder: 'XXXXXXXXXXXXXXXXXX', required: true },
        ];
      case 'google_analytics':
        return [
          { name: 'measurementId', label: 'Measurement ID', placeholder: 'G-XXXXXXXXXX', required: true },
        ];
      case 'google_tag_manager':
        return [
          { name: 'containerId', label: 'Container ID', placeholder: 'GTM-XXXXXXX', required: true },
        ];
      case 'meta':
        return [
          { name: 'pixelId', label: 'Pixel ID', placeholder: 'XXXXXXXXXXXXXXXXXX', required: true },
          { name: 'eventId', label: 'Event ID (opcional)', placeholder: 'XXXXXXXXXX', required: false },
        ];
      case 'tiktok':
      case 'pinterest':
      case 'kwai':
      case 'mgid':
      case 'outbrain':
        return [
          { name: 'pixelId', label: 'Pixel ID', placeholder: 'XXXXXXXXXXXXXXXXXX', required: true },
        ];
      case 'taboola':
        return [
          { name: 'trackingCode', label: 'Código de Rastreio', placeholder: 'Cole o código de rastreio personalizado...', required: true, multiline: true },
        ];
      default:
        return [];
    }
  };

  const getHelperUrl = () => {
    switch (integration?.platform) {
      case 'google_ads':
        return "https://support.google.com/google-ads/answer/6331304";
      case 'google_analytics':
        return "https://support.google.com/analytics/answer/9539598";
      case 'google_tag_manager':
        return "https://support.google.com/tagmanager/answer/6103696";
      case 'meta':
        return "https://www.facebook.com/business/help/952192354843755";
      case 'tiktok':
        return "https://ads.tiktok.com/help/article/tiktok-pixel-settings";
      case 'pinterest':
        return "https://help.pinterest.com/en/business/article/track-conversions-with-pinterest-tag";
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!integration) return;
    
    try {
      setIsLoading(true);
      
      // Validate required fields
      const fieldConfig = getFieldConfig();
      const missingFields = fieldConfig
        .filter(field => field.required && !fields[field.name])
        .map(field => field.label);
      
      if (missingFields.length > 0) {
        toast({
          title: "Campos obrigatórios não preenchidos",
          description: `Os seguintes campos são obrigatórios: ${missingFields.join(', ')}`,
          variant: "destructive",
        });
        return;
      }
      
      await onConnect(integration.platform, fields);
      onClose();
    } catch (error) {
      console.error(`Error connecting ${integration.name}:`, error);
      toast({
        title: `Erro ao conectar ${integration.name}`,
        description: "Não foi possível conectar este pixel. Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!integration) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Conectar {integration.name}</DialogTitle>
          <DialogDescription>
            Configure a integração com {integration.name} para rastreamento de conversões.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {getFieldConfig().map(field => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.multiline ? (
                <Textarea
                  id={field.name}
                  placeholder={field.placeholder}
                  value={fields[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  rows={4}
                />
              ) : (
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  value={fields[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
          
          {getHelperUrl() && (
            <div className="pt-2">
              <a 
                href={getHelperUrl() || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Como obter seu {integration.platform === 'meta' ? 'Pixel ID' : 'ID'}</span>
              </a>
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
              {integration.status === 'integrated' ? 'Atualizar' : 'Conectar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectPixelDialog;
