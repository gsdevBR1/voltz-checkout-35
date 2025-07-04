
import React, { useState, useEffect } from 'react';
import { Search, CheckSquare, Filter } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductSelectorProps {
  products?: Product[];
  selectedProductIds: string[];
  onSelectProduct?: (productId: string) => void;
  onSelectAllFiltered?: () => void;
  onApplyToAllProducts?: (checked: boolean) => void;
  applyToAllProducts?: boolean;
  excludedProductId?: string;
  title?: string;
  description?: string;
  // New props to support both implementations
  onChange?: (selectedIds: string[]) => void;
  allowMultiple?: boolean;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  products = [], // Default to empty array to avoid undefined
  selectedProductIds,
  onSelectProduct,
  onSelectAllFiltered,
  onApplyToAllProducts,
  applyToAllProducts = false, // Default value
  excludedProductId,
  title = "Aplicar este upsell em massa",
  description,
  onChange,
  allowMultiple = true
}) => {
  const [productNameFilter, setProductNameFilter] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Handle selecting a product with proper state management
  const handleSelectProduct = (productId: string) => {
    if (onSelectProduct) {
      onSelectProduct(productId);
    } else if (onChange) {
      // For the new onChange API
      if (allowMultiple) {
        // Toggle selection for multiple selection mode
        const newSelection = selectedProductIds.includes(productId)
          ? selectedProductIds.filter(id => id !== productId)
          : [...selectedProductIds, productId];
        onChange(newSelection);
      } else {
        // Single selection mode
        onChange([productId]);
      }
    }
  };

  // Handle selecting all filtered products
  const handleSelectAllFiltered = () => {
    if (onSelectAllFiltered) {
      onSelectAllFiltered();
    } else if (onChange) {
      // Get all visible product IDs that aren't the excluded one
      const productIds = filteredProducts
        .filter(product => product.id !== excludedProductId)
        .map(product => product.id);
      onChange(productIds);
    }
  };

  // Handle the "apply to all products" option
  const handleApplyToAllProducts = (checked: boolean) => {
    if (onApplyToAllProducts) {
      onApplyToAllProducts(checked);
    }
  };

  // Filter products when search term or products array changes
  useEffect(() => {
    if (productNameFilter) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(productNameFilter.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [productNameFilter, products]);

  return (
    <div className="space-y-5 mt-8 pt-6 border-t">
      <h3 className="text-lg font-medium">{title}</h3>
      
      <div className="bg-gradient-to-b from-muted/50 to-card rounded-xl p-6 border border-border transition-all hover:border-border/60 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="flex h-6 items-center mt-0.5">
            <Checkbox 
              id="applyToAll" 
              checked={applyToAllProducts}
              onCheckedChange={(checked) => handleApplyToAllProducts(checked === true)}
              className="h-5 w-5 rounded-sm transition-colors data-[state=checked]:bg-primary data-[state=checked]:border-primary hover:border-primary/70"
            />
          </div>
          <div className="space-y-1.5">
            <Label 
              htmlFor="applyToAll" 
              className="font-medium text-base cursor-pointer"
            >
              Aplicar a todos os produtos da loja
            </Label>
            {applyToAllProducts && (
              <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 py-1.5 px-3 rounded-md">
                Este upsell será aplicado automaticamente após qualquer compra feita na loja.
              </p>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>
      
      {!applyToAllProducts && (
        <div className="space-y-4 bg-gradient-to-b from-card to-muted/50 p-6 rounded-xl border border-border shadow-sm">
          <div className="space-y-3">
            <Label htmlFor="productFilter" className="font-medium">Filtrar produtos pelo nome</Label>
            <div className="flex items-center space-x-3 flex-col sm:flex-row gap-3 sm:gap-0">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="productFilter"
                  type="text" 
                  placeholder="Buscar produtos por nome..."
                  value={productNameFilter}
                  onChange={(e) => setProductNameFilter(e.target.value)}
                  className="pl-10 py-6 h-auto border-input rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={handleSelectAllFiltered}
                className="whitespace-nowrap font-medium transition-all h-auto py-2.5 px-4 hover:bg-accent border-input"
              >
                <CheckSquare className="mr-2 h-4 w-4 text-primary" />
                Selecionar todos
              </Button>
            </div>
          </div>
          
          <div className="max-h-[350px] overflow-y-auto border rounded-lg bg-card shadow-sm">
            {filteredProducts.length > 0 ? (
              <ul className="p-0 m-0 list-none divide-y divide-border/40">
                {filteredProducts.map(product => {
                  const isSelected = selectedProductIds.includes(product.id);
                  const isDisabled = product.id === excludedProductId;
                  
                  return (
                    <li 
                      key={product.id} 
                      className={`${
                        isDisabled ? 'bg-muted/40 opacity-60' : 
                        isSelected ? 'bg-success/10 dark:bg-success/5' : ''
                      } transition-colors hover:bg-accent/30 rounded-md m-1`}
                    >
                      <div className="flex items-center p-4">
                        <Checkbox 
                          id={`product-${product.id}`} 
                          checked={isSelected}
                          onCheckedChange={() => !isDisabled && handleSelectProduct(product.id)}
                          disabled={isDisabled}
                          className="mr-3 h-5 w-5 rounded-sm transition-colors data-[state=checked]:bg-success data-[state=checked]:border-success hover:border-success/70"
                        />
                        <Label 
                          htmlFor={`product-${product.id}`}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between flex-1 cursor-pointer ${isDisabled ? 'text-muted-foreground' : ''}`}
                        >
                          <div className="font-medium text-base">{product.name}</div>
                          <div className="flex items-center gap-2 mt-1 sm:mt-0">
                            <span className="text-sm font-semibold text-foreground/80">
                              R${product.price.toFixed(2)}
                            </span>
                            <Badge variant="outline" className={`
                              text-xs px-2 py-0.5 
                              ${product.type === 'digital' 
                                ? 'bg-primary/10 text-primary dark:bg-primary/20 border-primary/30' 
                                : 'bg-secondary/10 text-secondary dark:bg-secondary/20 border-secondary/30'}
                            `}>
                              {product.type === 'digital' ? 'Digital' : 'Físico'}
                            </Badge>
                          </div>
                        </Label>
                        {isDisabled && (
                          <span className="text-xs px-2 py-1 bg-muted dark:bg-muted/70 rounded-md ml-2">Produto da oferta</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>Nenhum produto encontrado para "{productNameFilter}"</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm p-2 mt-2 bg-muted/60 dark:bg-muted/40 rounded-md">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span>
                {productNameFilter 
                  ? `${filteredProducts.length} produtos encontrados com "${productNameFilter}"`
                  : `${products.length} produtos no total`}
              </span>
            </div>
            <span className="font-semibold bg-muted dark:bg-muted/70 px-2 py-1 rounded-md">
              {selectedProductIds.length} produtos selecionados
            </span>
          </div>
        </div>
      )}
      
      {(selectedProductIds.length === 0 && !applyToAllProducts) && (
        <Alert variant="default" className="bg-muted/40 dark:bg-muted/20 border-border">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <AlertDescription className="text-muted-foreground">
            Selecione ao menos um produto para ativar o upsell.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ProductSelector;
