
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type StepStatus = 'pending' | 'in-progress' | 'completed';

export interface ActivationStep {
  id: 'billing' | 'domain' | 'gateway' | 'shipping';
  title: string;
  description: string;
  status: StepStatus;
  order: number;
}

interface ActivationStepsContextType {
  steps: ActivationStep[];
  updateStepStatus: (id: ActivationStep['id'], status: StepStatus) => void;
  isAllCompleted: boolean;
}

const ActivationStepsContext = createContext<ActivationStepsContextType | undefined>(undefined);

export const ActivationStepsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [steps, setSteps] = useState<ActivationStep[]>([
    {
      id: 'billing',
      title: 'Faturamento',
      description: 'Adicione um cartão de crédito em sua conta.',
      status: 'pending',
      order: 1,
    },
    {
      id: 'domain',
      title: 'Domínio',
      description: 'Verifique seu domínio. Deve ser o mesmo utilizado na Shopify, WooCommerce ou landing page.',
      status: 'pending',
      order: 2,
    },
    {
      id: 'gateway',
      title: 'Gateway de Pagamento',
      description: 'Configure os meios de pagamento que serão exibidos em sua loja.',
      status: 'pending',
      order: 3,
    },
    {
      id: 'shipping',
      title: 'Frete',
      description: 'Crie métodos de entrega para ser exibido no seu checkout.',
      status: 'pending',
      order: 4,
    },
  ]);

  const updateStepStatus = (id: ActivationStep['id'], status: StepStatus) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => (step.id === id ? { ...step, status } : step))
    );
  };

  const isAllCompleted = steps.every((step) => step.status === 'completed');

  useEffect(() => {
    // Simulate loading from an API or localStorage
    const savedSteps = localStorage.getItem('activation-steps');
    if (savedSteps) {
      try {
        const parsed = JSON.parse(savedSteps);
        setSteps(parsed);
      } catch (e) {
        console.error('Failed to parse saved steps', e);
      }
    }
  }, []);

  useEffect(() => {
    // Save steps to localStorage whenever they change
    localStorage.setItem('activation-steps', JSON.stringify(steps));
  }, [steps]);

  return (
    <ActivationStepsContext.Provider value={{ steps, updateStepStatus, isAllCompleted }}>
      {children}
    </ActivationStepsContext.Provider>
  );
};

export const useActivationSteps = () => {
  const context = useContext(ActivationStepsContext);
  if (context === undefined) {
    throw new Error('useActivationSteps must be used within an ActivationStepsProvider');
  }
  return context;
};

export const useCheckActivationStatus = () => {
  const { isAllCompleted } = useActivationSteps();
  
  const checkAccess = (action: string): boolean => {
    if (!isAllCompleted) {
      toast.error('Complete todos os passos de ativação para acessar esta funcionalidade', {
        description: 'Você precisa concluir os 4 passos obrigatórios antes de prosseguir.',
      });
      return false;
    }
    return true;
  };
  
  return { checkAccess, isAllCompleted };
};
