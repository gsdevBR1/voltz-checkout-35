
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Edit, Copy, Trash2, ExternalLink } from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface MarketingCardProps {
  id: string;
  title: string;
  type: 'upsell' | 'cross-sell' | 'order-bump';
  active: boolean;
  productName: string;
  productImageUrl?: string;
  appliedToCount: number;
  appliedToProducts: string[];
  editPath: string;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, active: boolean) => void;
  stats?: {
    conversionRate?: number;
    updatedAt?: Date;
  };
}

const MarketingCard: React.FC<MarketingCardProps> = ({
  id,
  title,
  type,
  active,
  productName,
  productImageUrl,
  appliedToCount,
  appliedToProducts,
  editPath,
  onDuplicate,
  onDelete,
  onToggleActive,
  stats
}) => {
  const typeLabels = {
    'upsell': 'Upsell',
    'cross-sell': 'Cross-Sell',
    'order-bump': 'Order Bump'
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
      toast.success(`${typeLabels[type]} excluído com sucesso!`);
    }
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(id);
      toast.success(`${typeLabels[type]} duplicado com sucesso!`);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md group">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-start">
            {productImageUrl ? (
              <div className="h-10 w-10 rounded-md overflow-hidden bg-accent flex items-center justify-center">
                <img src={productImageUrl} alt={productName} className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-md overflow-hidden bg-accent flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-accent-foreground" />
              </div>
            )}
            <div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs font-normal">
                  {typeLabels[type]}
                </Badge>
                {stats?.updatedAt && (
                  <span className="text-xs text-muted-foreground">
                    Atualizado {formatRelativeTime(stats.updatedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Badge variant={active ? "success" : "secondary"}>
            {active ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Produto sugerido:</h4>
            <div className="flex items-center bg-muted/30 p-2 rounded-md text-sm">
              <ShoppingBag className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{productName}</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">
              Aplicado em {appliedToCount} produto{appliedToCount !== 1 ? 's' : ''}:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {appliedToProducts.map((product, index) => (
                <div key={index} className="bg-accent/20 p-2 rounded text-sm truncate">
                  {product}
                </div>
              ))}
              {appliedToProducts.length === 0 && (
                <div className="text-muted-foreground text-sm italic">
                  Nenhum produto vinculado
                </div>
              )}
            </div>
          </div>
          
          {stats?.conversionRate !== undefined && (
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground mr-2">Taxa de conversão:</span>
              <span className="font-medium text-success">{stats.conversionRate}%</span>
            </div>
          )}
          
          <Separator className="my-1" />
          
          <div className="flex justify-end gap-2">
            <TooltipProvider>
              {onDuplicate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDuplicate}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Duplicar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Duplicar este {typeLabels[type]}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to={editPath}>
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Editar
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar este {typeLabels[type]}</p>
                </TooltipContent>
              </Tooltip>
              
              {onDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este {typeLabels[type]}? Esta ação é irreversível.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Excluir este {typeLabels[type]}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketingCard;
