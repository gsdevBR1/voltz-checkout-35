
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProductStatus } from '@/types/product';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ProductStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <Badge 
      variant={status === 'active' ? 'default' : 'outline'}
      className={cn(
        status === 'active' 
          ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800" 
          : "text-gray-500 border-gray-300 dark:text-gray-400 dark:border-gray-600",
        className
      )}
    >
      {status === 'active' ? 'Ativo' : 'Inativo'}
    </Badge>
  );
};
