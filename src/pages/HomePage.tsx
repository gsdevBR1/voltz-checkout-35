
import React, { useEffect } from 'react';
import { useStores } from '@/contexts/StoreContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const HomePage = () => {
  const { currentStore, isStoresLoading } = useStores();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Show a welcome toast on first load
  useEffect(() => {
    if (currentStore && !isStoresLoading) {
      toast({
        title: `Bem-vindo à ${currentStore.name}`,
        description: "Gerencie sua loja através do painel de controle.",
      });
    }
  }, [currentStore, isStoresLoading, toast]);

  if (isStoresLoading || !currentStore) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse">Carregando...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Página Inicial</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao painel de controle da sua loja
            </p>
          </div>
          {currentStore.isDemo && (
            <Button 
              onClick={() => navigate('/lojas')} 
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Criar loja real
            </Button>
          )}
        </div>

        {currentStore.isDemo && (
          <Card className="mb-6 border-amber-200 bg-amber-50/50 dark:bg-amber-950/10">
            <CardHeader className="pb-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <CardTitle className="text-lg">Loja de Demonstração</CardTitle>
                  <CardDescription>
                    Você está visualizando uma loja de demonstração. Para aproveitar todos os recursos,{' '}
                    <Button 
                      variant="link" 
                      className="h-auto p-0 text-primary" 
                      onClick={() => navigate('/lojas')}
                    >
                      crie sua própria loja
                    </Button>.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
              <CardDescription>Resumo dos dados da sua loja</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status</span>
                  <span className="text-sm font-medium">
                    {currentStore.isDemo ? 'Demo' : 'Ativa'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Data de criação</span>
                  <span className="text-sm font-medium">
                    {new Date(currentStore.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HomePage;
