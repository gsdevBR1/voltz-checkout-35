
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import ActivationStepCard from '@/components/ActivationStepCard';
import { useActivationSteps, useCheckActivationStatus } from '@/contexts/ActivationStepsContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRightCircle } from 'lucide-react';

const Dashboard = () => {
  const { steps } = useActivationSteps();
  const { isAllCompleted } = useCheckActivationStatus();
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
    if (!isAllCompleted) {
      toast.error('Complete todos os passos obrigatórios antes de publicar', {
        description: 'Você precisa concluir todas as etapas de ativação.',
      });
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
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">
            Para ativar seu checkout você precisa concluir todos os passos abaixo:
          </h1>
          <p className="text-muted-foreground">
            Complete todos os passos obrigatórios para desbloquear as funcionalidades completas do checkout.
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

        <Card className={`mt-8 border ${isAllCompleted ? 'border-success bg-success/5' : 'border-amber-500/50 bg-amber-50/50'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              {isAllCompleted ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5 text-success" />
                  Checkout pronto para publicação
                </>
              ) : (
                <>
                  <ArrowRightCircle className="mr-2 h-5 w-5 text-amber-500" />
                  Conclua todos os passos para publicar
                </>
              )}
            </CardTitle>
            <CardDescription>
              {isAllCompleted
                ? 'Todos os passos obrigatórios foram concluídos. Seu checkout está pronto para ser publicado.'
                : 'Complete todos os passos obrigatórios listados acima para habilitar a publicação.'}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className={`w-full ${isAllCompleted ? 'bg-success hover:bg-success/90' : ''}`}
              disabled={!isAllCompleted || isPublishing}
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
