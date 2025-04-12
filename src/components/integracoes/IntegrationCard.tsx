
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Link as LinkIcon,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AnyIntegration } from '@/types/integration';

interface IntegrationCardProps {
  integration: AnyIntegration;
  onConnect: (integration: AnyIntegration) => void;
  onDisconnect: (integration: AnyIntegration) => void;
  onUpdate: (integration: AnyIntegration) => void;
  tooltipContent?: React.ReactNode;
  actionText?: string;
  statusText?: string | null;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onConnect,
  onDisconnect,
  onUpdate,
  tooltipContent,
  actionText,
  statusText
}) => {
  // Helper function for status badge
  const renderStatusBadge = () => {
    switch (integration.status) {
      case 'integrated':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Integrado</span>
          </Badge>
        );
      case 'not_integrated':
        return (
          <Badge variant="secondary" className="gap-1">
            <XCircle className="h-3 w-3" />
            <span>Não integrado</span>
          </Badge>
        );
      case 'auth_failed':
        return (
          <Badge variant="warning" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Falha na autenticação</span>
          </Badge>
        );
      default:
        return null;
    }
  };

  // Determine the action button to show
  const renderActionButton = () => {
    if (integration.isNative === false && integration.externalUrl) {
      return (
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-1"
          onClick={() => window.open(integration.externalUrl, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
          <span>Acessar</span>
        </Button>
      );
    }

    if (integration.status === 'integrated') {
      return (
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1"
            onClick={() => onUpdate(integration)}
          >
            <RefreshCw className="h-4 w-4" />
            <span>{actionText || 'Atualizar'}</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1"
            onClick={() => onDisconnect(integration)}
          >
            <LinkIcon className="h-4 w-4" />
            <span>Desconectar</span>
          </Button>
        </div>
      );
    }
    
    return (
      <Button 
        size="sm" 
        onClick={() => onConnect(integration)}
      >
        <LinkIcon className="h-4 w-4 mr-1" />
        <span>{actionText || 'Conectar'}</span>
      </Button>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            {integration.logo ? (
              <img 
                src={integration.logo} 
                alt={`${integration.name} logo`} 
                className="h-10 w-10 object-contain rounded-md" 
              />
            ) : (
              <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                <span className="text-muted-foreground text-xs font-bold">
                  {integration.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              {renderStatusBadge()}
            </div>
          </div>
          
          {tooltipContent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rounded-full w-5 h-5 bg-muted flex items-center justify-center cursor-help">
                    <span className="text-xs">?</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm p-4">
                  {tooltipContent}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <CardDescription>{integration.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {statusText && (
          <p className="text-xs text-muted-foreground">
            {statusText}
          </p>
        )}
        {integration.lastSync && !statusText && (
          <p className="text-xs text-muted-foreground">
            Última sincronização: {new Date(integration.lastSync).toLocaleString()}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end pt-2">
        {renderActionButton()}
      </CardFooter>
    </Card>
  );
};

export default IntegrationCard;
