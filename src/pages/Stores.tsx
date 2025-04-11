
import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useStores, Store } from '@/contexts/StoreContext';
import { Input } from '@/components/ui/input';
import { Search, Store as StoreIcon, AlertTriangle } from 'lucide-react';
import { CreateStoreDialog } from '@/components/stores/CreateStoreDialog';
import { StoreCard } from '@/components/stores/StoreCard';
import { StoreFilter, StoreStatusFilter, StoreSortOption } from '@/components/stores/StoreFilter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Stores() {
  const { stores, currentStore, addStore } = useStores();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StoreStatusFilter>('all');
  const [sortOption, setSortOption] = useState<StoreSortOption>('name');
  const navigate = useNavigate();

  const getStoreStatus = (store: Store): StoreStatusFilter => {
    if (store.isDemo) return "demo";
    
    const steps = Object.values(store.status);
    const completedSteps = steps.filter(Boolean).length;
    
    if (completedSteps === steps.length) return "active";
    if (completedSteps > 0) return "incomplete";
    return "new";
  };

  const filteredStores = useMemo(() => {
    return stores
      .filter(store => {
        // Apply search filter
        if (searchQuery && !store.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        // Apply status filter
        if (statusFilter !== 'all') {
          const storeStatus = getStoreStatus(store);
          if (storeStatus !== statusFilter) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortOption === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortOption === 'createdAt') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortOption === 'lastAccessed') {
          return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
        }
        return 0;
      });
  }, [stores, searchQuery, statusFilter, sortOption]);

  const nonDemoStores = stores.filter(store => !store.isDemo);
  const isUsingDemoStore = currentStore?.isDemo;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Minhas Lojas</h1>
            <p className="text-muted-foreground">
              Gerencie suas lojas conectadas ao voltz.checkout
            </p>
          </div>
          <CreateStoreDialog />
        </div>

        {isUsingDemoStore && (
          <Card className="mb-6 border-purple-200 bg-purple-50/50 dark:bg-purple-950/10">
            <CardHeader className="pb-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <CardTitle className="text-lg">Você está utilizando uma loja de demonstração</CardTitle>
                  <CardDescription>
                    Para vender de verdade, crie uma nova loja clicando no botão acima.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar lojas..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <StoreFilter 
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />
        </div>

        {filteredStores.length === 0 && (
          <Card className="bg-muted/40">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <StoreIcon className="h-12 w-12 text-muted stroke-[1.5px] mb-4" />
              {stores.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold mb-1">Nenhuma loja encontrada</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Tente ajustar os filtros ou a pesquisa para encontrar o que procura.
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}>
                    Limpar filtros
                  </Button>
                </>
              ) : nonDemoStores.length === 0 ? (
                <>
                  <h3 className="text-lg font-semibold mb-1">Você ainda não criou nenhuma loja</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    Clique no botão acima para começar ou explore a Loja Demo.
                  </p>
                  <div className="flex gap-3">
                    <CreateStoreDialog buttonVariant="default" />
                    <Button variant="outline" onClick={() => navigate('/pagina-inicial')}>
                      Explorar Loja Demo
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-1">Nenhuma loja encontrada</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Tente ajustar os filtros para encontrar suas lojas.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {filteredStores.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
