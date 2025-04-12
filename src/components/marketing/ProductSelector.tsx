
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
  products: Product[];
  selectedProductIds: string[];
  onSelectProduct: (productId: string) => void;
  onSelectAllFiltered: () => void;
  onApplyToAllProducts: (checked: boolean) => void;
  applyToAllProducts: boolean;
  excludedProductId?: string;
  title?: string;
  description?: string;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProductIds,
  onSelectProduct,
  onSelectAllFiltered,
  onApplyToAllProducts,
  applyToAllProducts,
  excludedProductId,
  title = "Aplicar este upsell em massa",
  description
}) => {
  const [productNameFilter, setProductNameFilter] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
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
      
      <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 transition-all hover:border-slate-300 dark:hover:border-slate-600 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="flex h-6 items-center mt-0.5">
            <Checkbox 
              id="applyToAll" 
              checked={applyToAllProducts}
              onCheckedChange={onApplyToAllProducts}
              className="h-5 w-5 rounded-sm transition-colors data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 hover:border-emerald-400"
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
        <div className="space-y-4 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="space-y-3">
            <Label htmlFor="productFilter" className="font-medium">Filtrar produtos pelo nome</Label>
            <div className="flex items-center space-x-3 flex-col sm:flex-row gap-3 sm:gap-0">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="productFilter"
                  type="text" 
                  placeholder="Buscar produtos por nome..."
                  value={productNameFilter}
                  onChange={(e) => setProductNameFilter(e.target.value)}
                  className="pl-10 py-6 h-auto border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={onSelectAllFiltered}
                className="whitespace-nowrap font-medium transition-all h-auto py-2.5 px-4 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600"
              >
                <CheckSquare className="mr-2 h-4 w-4 text-primary" />
                Selecionar todos
              </Button>
            </div>
          </div>
          
          <div className="max-h-[350px] overflow-y-auto border rounded-lg bg-white dark:bg-slate-900 shadow-sm">
            {filteredProducts.length > 0 ? (
              <ul className="p-0 m-0 list-none divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.map(product => {
                  const isSelected = selectedProductIds.includes(product.id);
                  const isDisabled = product.id === excludedProductId;
                  
                  return (
                    <li 
                      key={product.id} 
                      className={`${
                        isDisabled ? 'bg-slate-100/50 dark:bg-slate-800/50 opacity-60' : 
                        isSelected ? 'bg-emerald-50 dark:bg-emerald-950/20' : ''
                      } transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md m-1`}
                    >
                      <div className="flex items-center p-4">
                        <Checkbox 
                          id={`product-${product.id}`} 
                          checked={isSelected}
                          onCheckedChange={() => onSelectProduct(product.id)}
                          disabled={isDisabled}
                          className="mr-3 h-5 w-5 rounded-sm transition-colors data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                        />
                        <Label 
                          htmlFor={`product-${product.id}`}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between flex-1 cursor-pointer ${isDisabled ? 'text-muted-foreground' : ''}`}
                        >
                          <div className="font-medium text-base">{product.name}</div>
                          <div className="flex items-center gap-2 mt-1 sm:mt-0">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                              R${product.price.toFixed(2)}
                            </span>
                            <Badge variant="outline" className={`
                              text-xs px-2 py-0.5 
                              ${product.type === 'digital' 
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-800' 
                                : 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 border-purple-200 dark:border-purple-800'}
                            `}>
                              {product.type === 'digital' ? 'Digital' : 'Físico'}
                            </Badge>
                          </div>
                        </Label>
                        {isDisabled && (
                          <span className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-md ml-2">Produto da oferta</span>
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
          
          <div className="flex items-center justify-between text-sm p-2 mt-2 bg-slate-100 dark:bg-slate-800 rounded-md">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span>
                {productNameFilter 
                  ? `${filteredProducts.length} produtos encontrados com "${productNameFilter}"`
                  : `${products.length} produtos no total`}
              </span>
            </div>
            <span className="font-semibold bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md">
              {selectedProductIds.length} produtos selecionados
            </span>
          </div>
        </div>
      )}
      
      {(selectedProductIds.length === 0 && !applyToAllProducts) && (
        <Alert variant="default" className="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <AlertCircle className="h-4 w-4 text-slate-500" />
          <AlertDescription className="text-slate-600 dark:text-slate-400">
            Selecione ao menos um produto para ativar o upsell.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ProductSelector;
