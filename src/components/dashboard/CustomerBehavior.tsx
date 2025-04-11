
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
  shortTitle: string; // Added short title for compact view
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
      shortTitle: 'Checkout',
      value: initialCheckout,
      icon: <ShoppingCart className="h-5 w-5" />,
      color: 'bg-emerald-500 dark:bg-emerald-600'
    },
    {
      id: 'personal',
      title: 'Dados Pessoais',
      shortTitle: 'Dados',
      value: Math.floor(initialCheckout * (Math.random() * 0.2 + 0.7)), // 70-90% of previous step
      icon: <Users className="h-5 w-5" />,
      color: 'bg-blue-500 dark:bg-blue-600'
    },
    {
      id: 'delivery',
      title: 'Entrega',
      shortTitle: 'Entrega',
      value: 0, // Will be calculated
      icon: <Package className="h-5 w-5" />,
      color: 'bg-purple-500 dark:bg-purple-600'
    },
    {
      id: 'payment',
      title: 'Pagamento',
      shortTitle: 'Pagamento',
      value: 0, // Will be calculated
      icon: <CreditCard className="h-5 w-5" />,
      color: 'bg-amber-500 dark:bg-amber-600'
    },
    {
      id: 'pix',
      title: 'Gerou Pix',
      shortTitle: 'Pix',
      value: 0, // Will be calculated
      icon: <QrCode className="h-5 w-5" />,
      color: 'bg-indigo-500 dark:bg-indigo-600'
    },
    {
      id: 'purchase',
      title: 'Comprou',
      shortTitle: 'Comprou',
      value: 0, // Will be calculated
      icon: <ShoppingBag className="h-5 w-5" />,
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Comportamento dos Clientes</h3>
          <Badge variant="secondary" className="text-xs">
            últimos 10 minutos
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {getTimeSinceUpdate()}
          </span>
          <button 
            onClick={handleRefresh} 
            className="flex items-center justify-center h-6 w-6 rounded-full bg-secondary/40 hover:bg-secondary/60 transition-colors"
            disabled={updating}
          >
            <RefreshCw className={cn(
              "h-3 w-3 text-muted-foreground", 
              updating && "animate-spin"
            )} />
          </button>
        </div>
      </div>
      
      {/* Progress indicator for refresh */}
      <div className="relative h-0.5 w-full bg-muted overflow-hidden">
        <div 
          className={cn(
            "absolute top-0 left-0 h-full bg-primary transition-all duration-300",
            updating ? "opacity-100" : "opacity-0"
          )}
          style={{ width: updating ? "100%" : "0%" }}
        ></div>
      </div>
      
      {/* Compact Horizontal Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {behaviorData.map((step, index) => (
          <TooltipProvider key={step.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-md border border-border/50",
                    "bg-card/50 hover:bg-card/80 transition-colors",
                    index < behaviorData.length - 1 && "relative"
                  )}
                >
                  {/* Icon with colored background */}
                  <div className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center mb-2",
                    `bg-opacity-15 dark:bg-opacity-25 text-${step.color.split('-')[1]}-700 dark:text-${step.color.split('-')[1]}-300`,
                    step.color.replace('bg-', 'bg-opacity-15 dark:bg-opacity-25 bg-')
                  )}>
                    {step.icon}
                  </div>
                  
                  {/* Step title - short version */}
                  <span className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                    {step.shortTitle}
                  </span>
                  
                  {/* Value */}
                  <span className="text-xl font-bold mt-1">{step.value}</span>
                  
                  {/* Connector to next step (only for non-last items) */}
                  {index < behaviorData.length - 1 && (
                    <div className="hidden md:block absolute -right-1 top-1/2 w-2 h-0.5 bg-muted -translate-y-1/2"></div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-semibold">{step.title}</p>
                  <p>{step.value} usuários nesta etapa nos últimos 10 minutos</p>
                  {index > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((step.value / behaviorData[0].value) * 100)}% do total inicial
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      
      {/* Mini Funnel Visualization */}
      <div className="mt-2 pt-2 border-t border-border">
        <div className="flex items-center gap-1 h-12">
          {behaviorData.map((step, index) => {
            const conversionRate = index === 0 
              ? 100 
              : Math.round((step.value / behaviorData[0].value) * 100);
            
            return (
              <TooltipProvider key={step.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex-1 flex flex-col h-full">
                      <div className="flex-1 w-full flex items-end">
                        <div 
                          className={cn("w-full rounded-t-sm", step.color)}
                          style={{ height: `${conversionRate}%` }}
                        />
                      </div>
                      <span className="text-[10px] mt-1 text-center text-muted-foreground">{conversionRate}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
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
