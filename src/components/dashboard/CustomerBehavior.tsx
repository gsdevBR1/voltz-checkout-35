
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  CreditCard, 
  QrCode, 
  ShoppingBag,
  Clock,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface BehaviorStep {
  id: string;
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface CustomerBehaviorProps {
  refreshInterval?: number; // in seconds
}

// Function to generate realistic step-by-step data with falloff
const generateStepData = () => {
  const initialCheckout = Math.floor(Math.random() * 25) + 10; // 10-35 people
  
  const steps: BehaviorStep[] = [
    {
      id: 'checkout',
      title: 'Entraram no Checkout',
      value: initialCheckout,
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'bg-emerald-500 dark:bg-emerald-600'
    },
    {
      id: 'personal',
      title: 'Dados Pessoais',
      value: Math.floor(initialCheckout * (Math.random() * 0.2 + 0.7)), // 70-90% of previous step
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500 dark:bg-blue-600'
    },
    {
      id: 'delivery',
      title: 'Entrega',
      value: 0, // Will be calculated
      icon: <Package className="h-6 w-6" />,
      color: 'bg-purple-500 dark:bg-purple-600'
    },
    {
      id: 'payment',
      title: 'Pagamento',
      value: 0, // Will be calculated
      icon: <CreditCard className="h-6 w-6" />,
      color: 'bg-amber-500 dark:bg-amber-600'
    },
    {
      id: 'pix',
      title: 'Gerou Pix',
      value: 0, // Will be calculated
      icon: <QrCode className="h-6 w-6" />,
      color: 'bg-indigo-500 dark:bg-indigo-600'
    },
    {
      id: 'purchase',
      title: 'Comprou',
      value: 0, // Will be calculated
      icon: <ShoppingBag className="h-6 w-6" />,
      color: 'bg-green-600 dark:bg-green-700'
    }
  ];
  
  // Calculate subsequent steps with progressive falloff
  for (let i = 2; i < steps.length; i++) {
    const previousValue = steps[i-1].value;
    const falloffRate = 0.65 + (Math.random() * 0.2); // 65-85% conversion rate
    steps[i].value = Math.floor(previousValue * falloffRate);
  }
  
  return steps;
};

const CustomerBehavior: React.FC<CustomerBehaviorProps> = ({ refreshInterval = 60 }) => {
  const [behaviorData, setBehaviorData] = useState<BehaviorStep[]>(generateStepData());
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [updating, setUpdating] = useState(false);
  const maxValue = behaviorData[0]?.value || 0;
  
  // Calculate time since last update
  const getTimeSinceUpdate = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seg atrás`;
    } else {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min atrás`;
    }
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    setUpdating(true);
    // Short timeout for animation effect
    setTimeout(() => {
      setBehaviorData(generateStepData());
      setLastUpdated(new Date());
      setUpdating(false);
    }, 600);
  };
  
  // Auto refresh based on interval
  useEffect(() => {
    const timer = setInterval(() => {
      handleRefresh();
    }, refreshInterval * 1000);
    
    return () => clearInterval(timer);
  }, [refreshInterval]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Comportamento dos Clientes</h3>
          <Badge variant="secondary" className="ml-2">
            últimos 10 minutos
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {getTimeSinceUpdate()}
          </span>
          <button 
            onClick={handleRefresh} 
            className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary/40 hover:bg-secondary/60 transition-colors"
            disabled={updating}
          >
            <RefreshCw className={cn(
              "h-4 w-4 text-muted-foreground", 
              updating && "animate-spin"
            )} />
          </button>
        </div>
      </div>
      
      {/* Timeline View */}
      <div className="relative">
        {/* Connection line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-muted -translate-x-1/2 hidden md:block" />
        
        <div className="space-y-8 relative">
          {behaviorData.map((step, index) => (
            <div key={step.id} className={cn(
              "grid grid-cols-1 md:grid-cols-12 items-center gap-4",
              index % 2 === 0 ? "md:grid-flow-col md:auto-cols-fr" : ""
            )}>
              {/* Desktop layout */}
              <div className={cn(
                "hidden md:flex items-center justify-end md:col-span-5",
                index % 2 !== 0 && "md:order-2 md:justify-start"
              )}>
                <div className="flex items-center gap-3">
                  {index % 2 !== 0 && (
                    <div className="text-3xl font-bold">{step.value}</div>
                  )}
                  <div className={cn(
                    "p-3 rounded-full flex items-center justify-center",
                    `bg-opacity-15 dark:bg-opacity-25 text-${step.color.split('-')[1]}-700 dark:text-${step.color.split('-')[1]}-300`,
                    step.color.replace('bg-', 'bg-opacity-15 dark:bg-opacity-25 bg-')
                  )}>
                    {step.icon}
                  </div>
                  {index % 2 === 0 && (
                    <div className="text-3xl font-bold">{step.value}</div>
                  )}
                </div>
              </div>
              
              {/* Circle connector for desktop */}
              <div className="hidden md:flex justify-center items-center md:col-span-2">
                <div className={cn(
                  "h-6 w-6 rounded-full border-4 z-10",
                  step.color,
                  "border-background"
                )} />
              </div>
              
              <div className={cn(
                "hidden md:block md:col-span-5",
                index % 2 === 0 && "md:order-2"
              )}>
                <h4 className="text-lg font-medium">{step.title}</h4>
                <Progress
                  value={(step.value / maxValue) * 100}
                  className="h-2 mt-2"
                  indicatorClassName={step.color}
                />
              </div>
              
              {/* Mobile layout */}
              <div className="flex md:hidden items-center gap-3 p-4 bg-card/50 rounded-lg border border-border/50">
                <div className={cn(
                  "p-3 rounded-full flex items-center justify-center shrink-0",
                  `bg-opacity-15 dark:bg-opacity-25 text-${step.color.split('-')[1]}-700 dark:text-${step.color.split('-')[1]}-300`,
                  step.color.replace('bg-', 'bg-opacity-15 dark:bg-opacity-25 bg-')
                )}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{step.title}</h4>
                    <div className="text-2xl font-bold">{step.value}</div>
                  </div>
                  <Progress
                    value={(step.value / maxValue) * 100}
                    className="h-2 mt-2"
                    indicatorClassName={step.color}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mini Funnel Visualization */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Conversão por Etapa</h4>
        <div className="grid grid-cols-6 gap-1 h-20">
          {behaviorData.map((step, index) => {
            const conversionRate = index === 0 
              ? 100 
              : Math.round((step.value / behaviorData[0].value) * 100);
            
            return (
              <TooltipProvider key={step.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <div className="flex-1 w-full flex items-end">
                        <div 
                          className={cn("w-full rounded-t-sm", step.color)}
                          style={{ height: `${conversionRate}%` }}
                        />
                      </div>
                      <span className="text-xs mt-1 text-center">{conversionRate}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p><strong>{step.title}</strong></p>
                      <p>{step.value} usuários ({conversionRate}%)</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerBehavior;
