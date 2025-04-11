
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Clock, ArrowRight, CreditCard, Globe, CreditCard as PaymentIcon, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActivationStep } from '@/contexts/ActivationStepsContextWithStores';

interface ActivationStepCardProps {
  step: ActivationStep;
  onClick: () => void;
}

const StepIcon = ({ id }: { id: string }) => {
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

const StatusIcon = ({ isCompleted }: { isCompleted: boolean }) => {
  return isCompleted ? 
    <CheckCircle className="h-5 w-5 text-success" /> : 
    <Circle className="h-5 w-5 text-gray-300" />;
};

const ActivationStepCard: React.FC<ActivationStepCardProps> = ({ step, onClick }) => {
  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      step.isCompleted && "border-success/30 bg-success/5"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{step.name}</CardTitle>
          <StatusIcon isCompleted={step.isCompleted} />
        </div>
        <CardDescription className="mt-2">{step.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center space-x-3 text-muted-foreground">
          <StepIcon id={step.id} />
          <span className="text-sm">
            {step.isCompleted ? 'Concluído' : 'Não iniciado'}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={step.isCompleted ? "outline" : "default"} 
          className={cn(
            "w-full",
            step.isCompleted && "border-success text-success hover:bg-success/10"
          )}
          onClick={onClick}
        >
          <span>{step.isCompleted ? 'Revisar' : 'Configurar'}</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivationStepCard;
