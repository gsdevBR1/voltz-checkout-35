
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatDateTime } from "@/lib/utils";
import { Clock, AlertCircle, ShoppingBag, CheckCircle } from "lucide-react";

// Mock data for customer checkout behavior
const MOCK_CHECKOUT_ATTEMPTS = [
  {
    date: "2025-04-11T15:23:00",
    step: "Pagamento",
    completed: false,
    value: 299.90,
    items: 2
  },
  {
    date: "2025-04-08T19:45:00",
    step: "Entrega",
    completed: false,
    value: 89.90,
    items: 1
  },
  {
    date: "2025-04-05T10:12:00",
    step: "Pagamento",
    completed: true,
    value: 429.80,
    items: 3
  },
  {
    date: "2025-03-30T12:30:00",
    step: "Dados",
    completed: false,
    value: 199.90,
    items: 1
  }
];

// Mock data for customer abandonment stages
const MOCK_ABANDONMENT_STAGES = [
  { stage: "Pagamento", count: 5, percentage: 60 },
  { stage: "Entrega", count: 2, percentage: 25 },
  { stage: "Dados", count: 1, percentage: 15 },
];

// Mock data for conversion
const MOCK_CONVERSION = {
  totalAttempts: 8,
  completedAttempts: 3,
  conversionRate: 37.5,
  fromLeads: 2
};

interface ClienteCheckoutBehaviorProps {
  customerId: string;
}

const ClienteCheckoutBehavior: React.FC<ClienteCheckoutBehaviorProps> = ({ customerId }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Clock className="h-5 w-5 text-primary" />
          Comportamento no Checkout (últimos 30 dias)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="behavior">
          <AccordionItem value="behavior" className="border-none">
            <AccordionTrigger className="py-2">
              <span className="text-base font-semibold">Atividades Recentes</span>
            </AccordionTrigger>
            <AccordionContent>
              <Tabs defaultValue="abandonments">
                <TabsList className="mb-4">
                  <TabsTrigger value="abandonments">Etapas Abandonadas</TabsTrigger>
                  <TabsTrigger value="attempts">Tentativas Recentes</TabsTrigger>
                  <TabsTrigger value="conversion">Conversão</TabsTrigger>
                </TabsList>
                
                <TabsContent value="abandonments">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Etapas do checkout onde este cliente mais abandona suas compras
                    </p>
                    
                    {MOCK_ABANDONMENT_STAGES.map((stage, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{stage.stage}</span>
                          <span>{stage.count} vezes • {stage.percentage}%</span>
                        </div>
                        <Progress value={stage.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="attempts">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Tentativas de compra recentes, finalizadas ou não
                    </p>
                    
                    {MOCK_CHECKOUT_ATTEMPTS.map((attempt, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-md border">
                        {attempt.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap justify-between gap-2">
                            <p className="font-medium">
                              {attempt.completed ? "Compra finalizada" : `Abandono na etapa: ${attempt.step}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(new Date(attempt.date))}
                            </p>
                          </div>
                          <p className="text-sm">
                            Carrinho com {attempt.items} {attempt.items === 1 ? 'item' : 'itens'} • 
                            Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(attempt.value)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="conversion">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-md border">
                        <div className="text-2xl font-bold text-primary">
                          {MOCK_CONVERSION.conversionRate}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Taxa de conversão ({MOCK_CONVERSION.completedAttempts} de {MOCK_CONVERSION.totalAttempts} tentativas)
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-md border">
                        <div className="text-2xl font-bold text-primary">
                          {MOCK_CONVERSION.fromLeads}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Compras de recuperação de carrinho abandonado
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-md border bg-muted/30">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-amber-500" />
                        <span className="font-medium">Comportamento de checkout</span>
                      </div>
                      <p className="mt-2 text-sm">
                        Este cliente costuma abandonar compras principalmente na etapa de pagamento.
                        Considere ofertar cupons de desconto ou parcelamento sem juros para aumentar a conversão.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ClienteCheckoutBehavior;
