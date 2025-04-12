
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LinkedUpsellBadgeProps {
  upsellName: string;
  isActive?: boolean;
  className?: string;
}

const LinkedUpsellBadge: React.FC<LinkedUpsellBadgeProps> = ({ 
  upsellName, 
  isActive = true,
  className = '' 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`text-blue-600 border-blue-600 flex items-center gap-1 ${className} ${!isActive ? 'opacity-70' : ''}`}
          >
            <ExternalLink className="h-3 w-3" />
            {isActive ? (
              <>Redireciona para Upsell</>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 text-amber-500" />
                Upsell inativo
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isActive 
              ? `Após a compra, o cliente será redirecionado para o Upsell: "${upsellName}"` 
              : `O Upsell "${upsellName}" está configurado, mas está inativo no momento`
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LinkedUpsellBadge;
