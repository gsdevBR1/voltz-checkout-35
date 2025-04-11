
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useStores, Store } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { DeleteStoreDialog } from '@/components/DeleteStoreDialog';
import { AlertTriangle, Plus, Store as StoreIcon, CheckCircle, X, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

export default function Stores() {
  const { stores, addStore, setCurrentStore } = useStores();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [storeNameError, setStoreNameError] = useState('');
  const navigate = useNavigate();

  const handleCreateStore = () => {
    if (!newStoreName.trim()) {
      setStoreNameError('O nome da loja é obrigatório');
      return;
    }
    
    addStore(newStoreName.trim());
    setNewStoreName('');
    setStoreNameError('');
    setIsDialogOpen(false);
  };

  const handleStoreSelect = (store: Store) => {
    setCurrentStore(store);
    navigate('/pagina-inicial');
  };

  const getStoreCompletionPercentage = (store: Store) => {
    const steps = [
      store.status.billing,
      store.status.domain,
      store.status.gateway,
      store.status.shipping
    ];
    
    const completedSteps = steps.filter(Boolean).length;
    return (completedSteps / steps.length) * 100;
  };

  const getStoreStatus = (store: Store) => {
    if (store.isDemo) return "demo";
    
    const completionPercentage = getStoreCompletionPercentage(store);
    
    if (completionPercentage === 0) return "not-started";
    if (completionPercentage === 100) return "completed";
    return "in-progress";
  };

  const renderStoreStatusBadge = (store: Store) => {
    const status = getStoreStatus(store);
    
    switch (status) {
      case "demo":
        return (
          <div className="flex items-center rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            <span>Demo</span>
          </div>
        );
      case "completed":
        return (
          <div className="flex items-center rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            <span>Ativa</span>
          </div>
        );
      case "in-progress":
        return (
          <div className="flex items-center rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            <span>Incompleta</span>
          </div>
        );
      case "not-started":
        return (
          <div className="flex items-center rounded-full bg-gray-100 text-gray-800 px-2 py-0.5 text-xs">
            <X className="w-3 h-3 mr-1" />
            <span>Nova</span>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Minhas Lojas</h1>
            <p className="text-muted-foreground">
              Gerencie todas as suas lojas em um só lugar
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Criar nova loja</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar nova loja</DialogTitle>
                <DialogDescription>
                  Crie uma nova loja para seus produtos e configurações.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="store-name">Nome da loja</Label>
                  <Input
                    id="store-name"
                    placeholder="Digite o nome da sua loja"
                    value={newStoreName}
                    onChange={(e) => {
                      setNewStoreName(e.target.value);
                      if (e.target.value.trim()) setStoreNameError('');
                    }}
                    className={storeNameError ? "border-destructive" : ""}
                  />
                  {storeNameError && (
                    <p className="text-sm text-destructive">{storeNameError}</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateStore}>
                  Criar loja
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stores.map((store) => (
            <Card key={store.id} className={store.isDemo ? "border-amber-200" : ""}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="w-full mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      {store.isDemo ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      ) : (
                        <StoreIcon className="h-4 w-4" />
                      )}
                      <CardTitle className="text-base truncate">{store.name}</CardTitle>
                    </div>
                    <CardDescription>
                      Criada em {format(new Date(store.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </CardDescription>
                  </div>
                  <DeleteStoreDialog store={store} />
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm">Status</div>
                  {renderStoreStatusBadge(store)}
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progresso</span>
                    <span>{Math.round(getStoreCompletionPercentage(store))}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${getStoreCompletionPercentage(store)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={store.isDemo ? "outline" : "default"}
                  onClick={() => handleStoreSelect(store)}
                >
                  {store.isDemo ? "Ver Demonstração" : "Gerenciar Loja"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
