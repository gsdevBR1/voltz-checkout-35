
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStores } from './StoreContext';

export interface ActivationStep {
  id: string;
  name: string;
  description: string;
  isCompleted: boolean;
  isRequired: boolean;
  icon: string;
  route: string;
}

const defaultSteps: ActivationStep[] = [
  {
    id: 'billing',
    name: 'Faturamento',
    description: 'Configure suas informações fiscais',
    isCompleted: false,
    isRequired: true,
    icon: 'receipt',
    route: '/steps/billing'
  },
  {
    id: 'domain',
    name: 'Domínio',
    description: 'Configure seu domínio personalizado',
    isCompleted: false,
    isRequired: true,
    icon: 'globe',
    route: '/steps/domain'
  },
  {
    id: 'gateway',
    name: 'Gateway',
    description: 'Conecte seu gateway de pagamento',
    isCompleted: false,
    isRequired: true,
    icon: 'credit-card',
    route: '/steps/gateway'
  },
  {
    id: 'shipping',
    name: 'Frete',
    description: 'Configure suas opções de frete',
    isCompleted: false,
    isRequired: true,
    icon: 'truck',
    route: '/steps/shipping'
  },
  {
    id: 'shopify',
    name: 'Integração com Shopify',
    description: 'Sincronize seus produtos e tema diretamente com a Shopify',
    isCompleted: false,
    isRequired: false,
    icon: 'shopping-bag',
    route: '/steps/shopify'
  }
];

interface ActivationStepsContextType {
  steps: ActivationStep[];
  updateStepCompletion: (stepId: string, isCompleted: boolean) => void;
}

const ActivationStepsContext = createContext<ActivationStepsContextType | undefined>(undefined);

export const ActivationStepsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [steps, setSteps] = useState<ActivationStep[]>(defaultSteps);
  const { currentStore, stores, setCurrentStore } = useStores();
  
  // Initialize steps based on current store
  useEffect(() => {
    if (!currentStore) return;
    
    const updatedSteps = defaultSteps.map(step => ({
      ...step,
      isCompleted: currentStore.isDemo ? true : currentStore.status[step.id as keyof typeof currentStore.status] || false
    }));
    
    setSteps(updatedSteps);
  }, [currentStore]);

  const updateStepCompletion = (stepId: string, isCompleted: boolean) => {
    // Update steps state
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId ? { ...step, isCompleted } : step
      )
    );
    
    // Update store status if not a demo store
    if (currentStore && !currentStore.isDemo) {
      const updatedStore = {
        ...currentStore,
        status: {
          ...currentStore.status,
          [stepId]: isCompleted
        }
      };
      
      // Update current store and stores list
      setCurrentStore(updatedStore);
    }
  };

  return (
    <ActivationStepsContext.Provider value={{ steps, updateStepCompletion }}>
      {children}
    </ActivationStepsContext.Provider>
  );
};

export const useActivationSteps = () => {
  const context = useContext(ActivationStepsContext);
  
  if (!context) {
    throw new Error('useActivationSteps must be used within an ActivationStepsProvider');
  }
  
  return context;
};

export const useCheckActivationStatus = () => {
  const { steps } = useActivationSteps();
  const { currentStore } = useStores();
  
  const requiredSteps = steps.filter(step => step.isRequired);
  const completedRequiredSteps = requiredSteps.filter(step => step.isCompleted);
  
  const isAllCompleted = 
    requiredSteps.length > 0 && 
    completedRequiredSteps.length === requiredSteps.length;
  
  const isPublishingAllowed = isAllCompleted && !currentStore?.isDemo;
  
  return {
    isAllCompleted,
    completedCount: completedRequiredSteps.length,
    totalCount: requiredSteps.length,
    percentComplete: requiredSteps.length > 0
      ? (completedRequiredSteps.length / requiredSteps.length) * 100
      : 0,
    isPublishingAllowed,
  };
};
