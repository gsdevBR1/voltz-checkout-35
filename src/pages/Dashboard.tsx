
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { DashboardHeader } from '@/components/DashboardHeader';
import ActivationStepCard from '@/components/ActivationStepCard';
import { useActivationSteps, useCheckActivationStatus } from '@/contexts/ActivationStepsContextWithStores';
import { useStores } from '@/contexts/StoreContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRightCircle, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { steps } = useActivationSteps();
  const { isAllCompleted, isPublishingAllowed } = useCheckActivationStatus();
  const { currentStore } = useStores();
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);

  const handleStepClick = (stepId: string) => {
    switch (stepId) {
      case 'billing':
        navigate('/steps/billing');
        break;
      case 'domain':
        navigate('/steps/domain');
        break;
      case 'gateway':
        navigate('/steps/gateway');
        break;
      case 'shipping':
        navigate('/steps/shipping');
        break;
      default:
        break;
    }
  };

  const handlePublish = () => {
    if (!isPublishingAllowed) {
      if (currentStore?.isDemo) {
        toast.error('Não é possível publicar a loja de demonstração', {
          description: 'Crie uma loja real para publicar seu checkout.',
        });
      } else {
        toast.error('Complete todos os passos obrigatórios antes de publicar', {
          description: 'Você precisa concluir todas as etapas de ativação.',
        });
      }
      return;
    }

    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      toast.success('Checkout publicado com sucesso!', {
        description: 'Seu checkout está pronto para uso.',
      });
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {currentStore?.isDemo && (
          <Card className="mb-6 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-amber-700 dark:text-amber-400">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500 dark:text-amber-400" />
                Loja de Demonstração
              </CardTitle>
              <CardDescription className="text-amber-700/80 dark:text-amber-400/80">
                Esta é uma loja de demonstração para você conhecer a plataforma. 
                Nenhuma transação real será processada aqui.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-amber-700 dark:text-amber-400"
                onClick={() => navigate('/stores')}
              >
                Criar uma loja real
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">
            {currentStore?.isDemo 
              ? "Conheça os recursos disponíveis na plataforma" 
              : "Para ativar seu checkout você precisa concluir todos os passos abaixo:"}
          </h1>
          <p className="text-muted-foreground">
            {currentStore?.isDemo 
              ? "Todas as funcionalidades estão habilitadas nesta demonstração para você explorar" 
              : "Complete todos os passos obrigatórios para desbloquear as funcionalidades completas do checkout."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {steps.map((step) => (
            <ActivationStepCard
              key={step.id}
              step={step}
              onClick={() => handleStepClick(step.id)}
            />
          ))}
        </div>

        <Card className={`mt-8 border ${isAllCompleted ? 'border-success/30 bg-success/5 dark:bg-success/10 dark:border-success/20' : 'border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/30'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              {isAllCompleted ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5 text-success" />
                  Checkout pronto para publicação
                </>
              ) : (
                <>
                  <ArrowRightCircle className="mr-2 h-5 w-5 text-amber-500 dark:text-amber-400" />
                  Conclua todos os passos para publicar
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isAllCompleted
                ? currentStore?.isDemo
                  ? 'Todos os passos foram concluídos automaticamente nesta demonstração. Em uma loja real, você precisaria completar cada etapa.'
                  : 'Todos os passos obrigatórios foram concluídos. Seu checkout está pronto para ser publicado.'
                : 'Complete todos os passos obrigatórios listados acima para habilitar a publicação.'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className={`w-full ${isPublishingAllowed ? 'bg-success hover:bg-success/90' : ''}`}
              disabled={!isPublishingAllowed || isPublishing}
              onClick={handlePublish}
            >
              {isPublishing ? 'Publicando...' : 'Publicar Checkout'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
