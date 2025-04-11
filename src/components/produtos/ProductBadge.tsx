
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProductType } from '@/types/product';
import { cn } from '@/lib/utils';
import { Package, FileText, ShoppingBag } from 'lucide-react';

interface ProductTypeBadgeProps {
  type: ProductType;
  className?: string;
}

export const ProductTypeBadge: React.FC<ProductTypeBadgeProps> = ({ type, className }) => {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center gap-1 font-medium",
        type === 'physical' ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800" : 
                              "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
        className
      )}
    >
      {type === 'physical' ? (
        <Package className="h-3 w-3" />
      ) : (
        <FileText className="h-3 w-3" />
      )}
      {type === 'physical' ? 'Físico' : 'Digital'}
    </Badge>
  );
};

interface ShopifyBadgeProps {
  className?: string;
}

export const ShopifyBadge: React.FC<ShopifyBadgeProps> = ({ className }) => {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center gap-1 font-medium bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
        className
      )}
    >
      <ShoppingBag className="h-3 w-3" />
      Shopify
    </Badge>
  );
};
