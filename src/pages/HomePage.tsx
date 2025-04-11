
import React, { useEffect } from 'react';
import { useStores } from '@/contexts/StoreContext';
import { useActivationSteps, useCheckActivationStatus } from '@/contexts/ActivationStepsContextWithStores';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import ActivationStepCard from '@/components/ActivationStepCard';
import ShopifyCard from '@/components/ShopifyCard';

const HomePage = () => {
  const { currentStore, isStoresLoading } = useStores();
  const { steps } = useActivationSteps();
  const { isAllCompleted, percentComplete, completedCount, totalCount } = useCheckActivationStatus();
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

  const handleStepClick = (step: { route: string }) => {
    navigate(step.route);
  };

  if (isStoresLoading || !currentStore) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse">Carregando...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Filter required and optional steps
  const requiredSteps = steps.filter(step => step.isRequired);
  const optionalSteps = steps.filter(step => !step.isRequired);

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
              className="bg-[#2BBA00] hover:bg-[#249a00] text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Criar loja real
            </Button>
          )}
        </div>

        {currentStore.isDemo && (
          <Alert className="mb-6 border-amber-200 bg-amber-50/50 dark:bg-amber-950/10">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertTitle>Você está utilizando uma Loja Demo</AlertTitle>
            <AlertDescription>
              Este ambiente é apenas para testes e não realiza transações reais.
              Para começar a vender, <Button 
                variant="link" 
                className="h-auto p-0 text-primary" 
                onClick={() => navigate('/lojas')}
              >
                crie uma nova loja
              </Button>.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Para ativar seu checkout você precisa concluir todos os passos abaixo:
          </h2>
          <div className="flex items-center gap-2 mb-4">
            <Progress value={percentComplete} className="h-2" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {completedCount}/{totalCount} concluídos
            </span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {requiredSteps.map((step) => (
            <ActivationStepCard
              key={step.id}
              step={step}
              onClick={() => handleStepClick(step)}
            />
          ))}
        </div>

        {/* Optional steps section */}
        {optionalSteps.length > 0 && (
          <div className="mt-10">
            <ShopifyCard />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HomePage;
