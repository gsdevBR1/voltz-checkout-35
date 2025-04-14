
import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type PermissionType = 'admin_global' | 'financeiro' | 'suporte' | 'leitura' | 'personalizado';

interface PermissionBadgeProps {
  type: PermissionType;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PermissionBadge: React.FC<PermissionBadgeProps> = ({ 
  type, 
  className,
  showIcon = true,
  size = 'md'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'admin_global':
        return <ShieldAlert className="h-3.5 w-3.5 mr-1" />;
      case 'financeiro':
      case 'suporte':
        return <ShieldCheck className="h-3.5 w-3.5 mr-1" />;
      case 'leitura':
        return <Eye className="h-3.5 w-3.5 mr-1" />;
      case 'personalizado':
        return <Shield className="h-3.5 w-3.5 mr-1" />;
      default:
        return <Shield className="h-3.5 w-3.5 mr-1" />;
    }
  };

  const getStyles = () => {
    const sizeStyles = {
      sm: 'text-[10px] py-0 px-2 h-5',
      md: 'text-xs py-0.5 px-2.5',
      lg: 'text-sm py-1 px-3',
    };

    switch (type) {
      case 'admin_global':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'financeiro':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'suporte':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'leitura':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'personalizado':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'admin_global':
        return 'Admin Global';
      case 'financeiro':
        return 'Financeiro';
      case 'suporte':
        return 'Suporte';
      case 'leitura':
        return 'Leitura';
      case 'personalizado':
        return 'Personalizado';
      default:
        return type;
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium flex items-center", 
        getStyles(),
        sizeStyles[size],
        className
      )}
    >
      {showIcon && getIcon()}
      {getLabel()}
    </Badge>
  );
};
