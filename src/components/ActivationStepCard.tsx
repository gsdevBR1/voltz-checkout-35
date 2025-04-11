
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Clock, ArrowRight, CreditCard, Globe, CreditCard as PaymentIcon, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActivationStep, StepStatus } from '@/contexts/ActivationStepsContext';

interface ActivationStepCardProps {
  step: ActivationStep;
  onClick: () => void;
}

const StepIcon = ({ id }: { id: ActivationStep['id'] }) => {
  switch (id) {
    case 'billing':
      return <CreditCard className="h-6 w-6" />;
    case 'domain':
      return <Globe className="h-6 w-6" />;
    case 'gateway':
      return <PaymentIcon className="h-6 w-6" />;
    case 'shipping':
      return <Truck className="h-6 w-6" />;
    default:
      return <Circle className="h-6 w-6" />;
  }
};

const StatusIcon = ({ status }: { status: StepStatus }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-success" />;
    case 'in-progress':
      return <Clock className="h-5 w-5 text-amber-500 animate-pulse" />;
    default:
      return <Circle className="h-5 w-5 text-gray-300" />;
  }
};

const ActivationStepCard: React.FC<ActivationStepCardProps> = ({ step, onClick }) => {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      step.status === 'completed' && "border-success/30 bg-success/5",
      step.status === 'in-progress' && "border-amber-500/30 bg-amber-500/5"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-white",
              step.status === 'completed' ? "bg-success" : "bg-primary"
            )}>
              <span>{step.order}</span>
            </div>
            <CardTitle className="text-lg">{step.title}</CardTitle>
          </div>
          <StatusIcon status={step.status} />
        </div>
        <CardDescription className="mt-2">{step.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center space-x-3 text-muted-foreground">
          <StepIcon id={step.id} />
          <span className="text-sm">
            {step.status === 'completed' 
              ? 'Concluído' 
              : step.status === 'in-progress' 
                ? 'Em andamento' 
                : 'Não iniciado'}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={step.status === 'completed' ? "outline" : "default"} 
          className={cn(
            "w-full",
            step.status === 'completed' && "border-success text-success hover:bg-success/10"
          )}
          onClick={onClick}
        >
          <span>{step.status === 'completed' ? 'Revisar' : 'Configurar'}</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivationStepCard;
