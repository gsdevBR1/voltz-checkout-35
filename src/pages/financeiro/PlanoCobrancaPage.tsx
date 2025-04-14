
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Check, CreditCard, DollarSign, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number | 'free';
  fee: number;
  features: PlanFeature[];
  recommended?: boolean;
  idealFor: string;
  cycleLimit: number;
  monthlyCharge: boolean;
}

const PlanoCobrancaPage = () => {
  const [currentPlan, setCurrentPlan] = useState<string>('testando');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  const plans: Plan[] = [
    {
      id: 'testando',
      name: 'Testando',
      description: 'Ideal para quem está começando',
      price: 'free',
      fee: 2.5,
      idealFor: 'Ideal para quem está começando',
      cycleLimit: 100,
      monthlyCharge: false,
      features: [
        { text: 'Taxa de 2,5% por pedido pago', included: true },
        { text: 'Ciclo padrão: R$ 100', included: true },
        { text: 'Sem cobrança mensal', included: true },
      ]
    },
    {
      id: 'pre-escala',
      name: 'Pré Escala',
      description: 'Ideal para quem fatura mais de R$ 50.000/mês',
      price: 147,
      fee: 2.0,
      idealFor: 'Ideal para quem fatura mais de R$ 50.000/mês',
      cycleLimit: 100,
      monthlyCharge: true,
      recommended: true,
      features: [
        { text: 'Taxa de 2,0% por pedido pago', included: true },
        { text: 'Cobrança mensal: R$ 147', included: true },
        { text: 'Ciclo padrão: R$ 100', included: true },
      ]
    },
    {
      id: 'escalando',
      name: 'Escalando',
      description: 'Ideal para quem fatura mais de R$ 100.000/mês',
      price: 497,
      fee: 1.5,
      idealFor: 'Ideal para quem fatura mais de R$ 100.000/mês',
      cycleLimit: 100,
      monthlyCharge: true,
      features: [
        { text: 'Taxa de 1,5% por pedido pago', included: true },
        { text: 'Cobrança mensal: R$ 497', included: true },
        { text: 'Ciclo padrão: R$ 100', included: true },
      ]
    }
  ];

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === currentPlan) return;
    
    setSelectedPlan(plan);
    setOpenDialog(true);
  };

  const handleConfirmUpgrade = () => {
    if (!selectedPlan) return;
    
    // Here we would actually change the plan on the server
    setCurrentPlan(selectedPlan.id);
    setOpenDialog(false);
    
    toast.success(`Seu plano foi alterado para ${selectedPlan.name}`, {
      description: `A nova taxa de ${selectedPlan.fee}% será aplicada em seus próximos pedidos.`
    });
  };

  const formatPrice = (price: number | 'free'): string => {
    if (price === 'free') return 'Grátis';
    return `R$ ${price}/mês`;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Plano e Cobrança</h1>
            <p className="text-muted-foreground">Gerencie seu plano e visualize informações de cobrança</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={cn(
                "flex flex-col h-full",
                plan.recommended && "border-primary shadow-md"
              )}
            >
              <CardHeader className="pb-4">
                {plan.recommended && (
                  <Badge className="w-fit mb-2 bg-primary">Recomendado</Badge>
                )}
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-1 text-primary" />
                  {plan.idealFor}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">
                    {plan.price === 'free' ? 'Grátis' : `R$ ${plan.price}`}
                  </span>
                  {plan.price !== 'free' && <span className="text-sm text-muted-foreground ml-1">/mês</span>}
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center font-medium text-lg">
                    <DollarSign className="h-5 w-5 mr-2 text-primary" />
                    {plan.fee}% por pedido pago
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                {currentPlan === plan.id ? (
                  <Button className="w-full" variant="outline" disabled>
                    Plano Atual
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => handleSelectPlan(plan)}
                    variant={plan.recommended ? "default" : "outline"}
                  >
                    Selecionar Plano
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar alteração de plano</DialogTitle>
              <DialogDescription>
                Você está prestes a alterar seu plano para <strong>{selectedPlan?.name}</strong>
              </DialogDescription>
            </DialogHeader>
            
            {selectedPlan && (
              <div className="space-y-4">
                <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nova taxa por pedido:</span>
                    <span className="font-medium">{selectedPlan.fee}%</span>
                  </div>
                  
                  {selectedPlan.price !== 'free' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cobrança mensal:</span>
                      <span className="font-medium">R$ {selectedPlan.price}</span>
                    </div>
                  )}
                </div>
                
                {selectedPlan.price !== 'free' && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4 mr-2" />
                    A cobrança mensal será realizada no cartão cadastrado
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter className="flex sm:justify-between">
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmUpgrade} className="sm:ml-2">
                Confirmar Alteração
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default PlanoCobrancaPage;
