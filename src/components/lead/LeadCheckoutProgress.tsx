
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

// Mock data for checkout progress
const MOCK_CHECKOUT_STEPS = [
  { id: '1', name: 'Dados Pessoais', status: 'completed', timestamp: '2025-04-11T17:41:30' },
  { id: '2', name: 'Entrega', status: 'completed', timestamp: '2025-04-11T17:43:15' },
  { id: '3', name: 'Pagamento', status: 'abandoned', timestamp: '2025-04-11T17:45:00' },
  { id: '4', name: 'Pix gerado', status: 'not_reached', timestamp: null },
  { id: '5', name: 'Compra', status: 'not_reached', timestamp: null },
];

interface LeadCheckoutProgressProps {
  leadId: string;
}

const LeadCheckoutProgress: React.FC<LeadCheckoutProgressProps> = ({ leadId }) => {
  // Format time
  const formatTime = (dateString: string | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };
  
  // Get icon for step status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'abandoned':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case 'not_reached':
        return <XCircle className="h-6 w-6 text-muted-foreground" />;
      default:
        return null;
    }
  };
  
  // Get CSS classes for step status
  const getStepClasses = (status: string) => {
    const baseClasses = "transition-all duration-300";
    switch (status) {
      case 'completed':
        return `${baseClasses} border-green-500 bg-green-50 dark:bg-green-900/10`;
      case 'abandoned':
        return `${baseClasses} border-amber-500 bg-amber-50 dark:bg-amber-900/10`;
      case 'not_reached':
        return `${baseClasses} border-muted-foreground/30 bg-muted/30`;
      default:
        return baseClasses;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="size-5 text-xl">🔄</div>
          Progresso no Checkout
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-muted-foreground/20 z-0"></div>
          
          {/* Steps */}
          <div className="relative z-10 space-y-8">
            {MOCK_CHECKOUT_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-start">
                <div className="shrink-0 mr-4">
                  {getStatusIcon(step.status)}
                </div>
                
                <div className={`flex-1 p-4 rounded-md border ${getStepClasses(step.status)}`}>
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{step.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(step.timestamp)}
                    </span>
                  </div>
                  
                  {step.status === 'abandoned' && (
                    <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                      O cliente abandonou o checkout nesta etapa
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-md bg-muted/30 border">
          <p className="text-sm">
            <strong>Análise:</strong> O lead preencheu os dados pessoais e de entrega corretamente, 
            mas abandonou durante o processo de pagamento. Isso pode indicar uma dificuldade 
            com os métodos de pagamento oferecidos ou insegurança na finalização.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCheckoutProgress;
