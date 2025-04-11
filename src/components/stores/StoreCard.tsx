
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Store, useStores } from '@/contexts/StoreContext';
import { 
  Card,
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Copy, 
  Edit, 
  ExternalLink, 
  Globe, 
  Store as StoreIcon, 
  X 
} from 'lucide-react';
import { DeleteStoreDialog } from '@/components/DeleteStoreDialog';
import { useNavigate } from 'react-router-dom';

interface StoreCardProps {
  store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
  const { currentStore, setCurrentStore, duplicateStore } = useStores();
  const navigate = useNavigate();

  const isCurrentStore = currentStore?.id === store.id;

  const getStoreStatus = () => {
    if (store.isDemo) return "demo";
    
    const steps = Object.values(store.status);
    const completedSteps = steps.filter(Boolean).length;
    
    if (completedSteps === steps.length) return "active";
    if (completedSteps > 0) return "incomplete";
    return "new";
  };

  const handleStoreSelect = () => {
    setCurrentStore(store);
    navigate('/pagina-inicial');
  };

  const handleEditStore = () => {
    setCurrentStore(store);
    navigate('/steps/billing');
  };

  const handleDuplicateStore = () => {
    duplicateStore(store.id);
  };

  const renderStatusBadge = () => {
    const status = getStoreStatus();
    
    switch (status) {
      case "active":
        return (
          <div className="flex items-center rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            <span>Ativa</span>
          </div>
        );
      case "incomplete":
        return (
          <div className="flex items-center rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            <span>Incompleta</span>
          </div>
        );
      case "demo":
        return (
          <div className="flex items-center rounded-full bg-purple-100 text-purple-800 px-2 py-0.5 text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            <span>Demo</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center rounded-full bg-gray-100 text-gray-800 px-2 py-0.5 text-xs">
            <X className="w-3 h-3 mr-1" />
            <span>Nova</span>
          </div>
        );
    }
  };

  return (
    <Card className={`${isCurrentStore ? 'border-primary' : ''} ${store.isDemo ? 'border-purple-200' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {store.isDemo ? (
                  <AlertTriangle className="h-4 w-4 text-purple-500" />
                ) : (
                  <StoreIcon className="h-4 w-4" />
                )}
                <CardTitle className="text-base truncate">{store.name}</CardTitle>
              </div>
              {isCurrentStore && (
                <Badge variant="outline" className="ml-2 border-primary text-primary text-xs">
                  Loja Atual
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Globe className="h-3.5 w-3.5 mr-1" />
              <span className="truncate">{store.domain}</span>
            </div>
          </div>
          <DeleteStoreDialog store={store} />
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-sm">Status</div>
          {renderStatusBadge()}
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Criada em</span>
          <span>
            {format(new Date(store.createdAt), "dd/MM/yyyy", { locale: ptBR })}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            variant="default" 
            size="sm"
            className="w-full"
            onClick={handleStoreSelect}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Entrar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full"
            onClick={handleEditStore}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full text-muted-foreground"
          onClick={handleDuplicateStore}
        >
          <Copy className="h-4 w-4 mr-1" />
          Duplicar
        </Button>
      </CardFooter>
    </Card>
  );
}
