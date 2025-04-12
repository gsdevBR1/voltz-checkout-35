
import React, { useState } from 'react';
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CreditCard,
  DollarSign,
  Calendar,
  AlertTriangle,
  Clock,
  Info,
  CheckCircle,
  AlertCircle,
  History,
  RefreshCw,
  Percent,
  Pencil,
  Settings
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import CreditCardModal from "@/components/financeiro/CreditCardModal";

// Mock data - in a real application, this would come from an API
const financialData = {
  cycle: {
    totalBilled: 78.45,
    currentLimit: 100, // Limit set to R$100
    usagePercentage: 78.45, // Usage percentage based on R$100 limit
    transactionFeePercentage: 2.5, // 2.5% transaction fee
    status: "active", // active, warning, overdue
    startDate: "01/04/2025",
    endDate: "30/04/2025",
  },
  paymentMethod: {
    type: "credit_card",
    last4: "4242", // Only show last 4 digits for security
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2027,
  },
  billingHistory: [
    { id: 1, date: "02/03/2025", amount: 100, status: "paid", description: "Taxa de processamento - Ciclo de Março/2025" },
    { id: 2, date: "01/02/2025", amount: 100, status: "paid", description: "Taxa de processamento - Ciclo de Fevereiro/2025" },
    { id: 3, date: "01/01/2025", amount: 100, status: "paid", description: "Taxa de processamento - Ciclo de Janeiro/2025" },
    { id: 4, date: "01/12/2024", amount: 95, status: "paid", description: "Taxa de processamento - Ciclo de Dezembro/2024" },
  ],
  nextBilling: {
    date: "01/05/2025",
    estimatedAmount: 100,
  }
};

const FinanceiroPage: React.FC = () => {
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(financialData.cycle.usagePercentage > 90);
  const [showCardMissingAlert, setShowCardMissingAlert] = useState(!financialData.paymentMethod && financialData.cycle.usagePercentage > 60);
  
  const handleManualCharge = () => {
    // In a real app, this would trigger a manual charge
    toast({
      title: "Cobrança solicitada",
      description: "Sua solicitação de cobrança manual foi enviada.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Pago</Badge>;
      case "error":
        return <Badge variant="destructive">Erro</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">Aguardando</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  // Function to calculate estimated days until next billing based on current rate
  const calculateDaysUntilBilling = () => {
    const remainingAmount = financialData.cycle.currentLimit - financialData.cycle.totalBilled;
    // Assuming an average daily accumulation rate based on current cycle
    const daysElapsed = 12; // For this example, let's assume 12 days elapsed in the current cycle
    const dailyRate = financialData.cycle.totalBilled / daysElapsed;
    
    if (dailyRate <= 0) return "30+ dias"; // If no daily accumulation, show long timeframe
    
    const daysUntilBilling = Math.ceil(remainingAmount / dailyRate);
    
    if (daysUntilBilling <= 0) return "Hoje";
    if (daysUntilBilling === 1) return "Amanhã";
    if (daysUntilBilling > 30) return "30+ dias";
    return `${daysUntilBilling} dias`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seu ciclo de faturamento, taxas e método de pagamento.
          </p>
        </div>

        {!financialData.paymentMethod && (
          <Alert className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nenhum método de pagamento cadastrado</AlertTitle>
            <AlertDescription>
              Adicione um método de pagamento para garantir a continuidade dos seus checkouts quando atingir o limite do ciclo de R$ {financialData.cycle.currentLimit.toLocaleString('pt-BR')}.
            </AlertDescription>
          </Alert>
        )}

        {showLimitWarning && (
          <Alert className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atenção: Utilização próxima ao limite</AlertTitle>
            <AlertDescription>
              Seu faturamento no ciclo atual está se aproximando do limite estabelecido de R$ {financialData.cycle.currentLimit.toLocaleString('pt-BR')}.
              Quando atingir esse valor, será feita uma cobrança automática no seu cartão cadastrado.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ciclo de Uso */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">Ciclo de Taxas de Processamento</CardTitle>
                  <CardDescription>
                    Taxa de {financialData.cycle.transactionFeePercentage}% por transação aprovada
                  </CardDescription>
                </div>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <Info className="h-4 w-4" />
                          <span className="sr-only">Info</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p>
                          A VOLTZ aplica {financialData.cycle.transactionFeePercentage}% por transação confirmada. 
                          A cobrança é feita apenas quando o valor atinge R$ {financialData.cycle.currentLimit.toLocaleString('pt-BR')}.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Taxas acumuladas</span>
                  <div className="text-2xl font-bold flex items-center">
                    <DollarSign className="h-5 w-5 mr-1 text-muted-foreground" />
                    R$ {financialData.cycle.totalBilled.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Limite do ciclo</span>
                  <div className="text-2xl font-bold flex items-center">
                    <DollarSign className="h-5 w-5 mr-1 text-muted-foreground" />
                    R$ {financialData.cycle.currentLimit.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Utilização do ciclo</span>
                  <span className="font-medium">{financialData.cycle.usagePercentage}%</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Progress 
                          value={financialData.cycle.usagePercentage} 
                          className={
                            financialData.cycle.usagePercentage > 90 
                              ? "bg-amber-100 dark:bg-amber-950/30" 
                              : financialData.cycle.usagePercentage > 95 
                                ? "bg-red-100 dark:bg-red-950/30" 
                                : "bg-slate-100 dark:bg-slate-800"
                          }
                          indicatorClassName="bg-emerald-500"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Próxima cobrança automática ao atingir R$ 100 ou em {calculateDaysUntilBilling()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>
                    Taxa por transação: <span className="font-medium">{financialData.cycle.transactionFeePercentage}%</span>
                  </div>
                  <div>
                    Próxima cobrança em: <span className="font-medium">{calculateDaysUntilBilling()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {financialData.cycle.startDate} a {financialData.cycle.endDate}
                  </span>
                </div>
                <Badge className="bg-green-500">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  Em dia
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Método de Pagamento */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Método de Pagamento</CardTitle>
              <CardDescription>
                Usado para cobranças automáticas quando as taxas atingem R$ {financialData.cycle.currentLimit.toLocaleString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                  </div>
                  <div>
                    {financialData.paymentMethod ? (
                      <>
                        <div className="font-medium">{financialData.paymentMethod.brand}</div>
                        <div className="text-sm text-muted-foreground">
                          **** **** **** {financialData.paymentMethod.last4}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-red-500 font-medium">
                        Nenhum cartão cadastrado
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsCardModalOpen(true)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {financialData.paymentMethod ? "Alterar cartão" : "Adicionar cartão"}
                </Button>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Próxima cobrança</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 p-3 rounded-md border dark:border-slate-700">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Prevista para:</span> {financialData.nextBilling.date}
                  </div>
                  <div>
                    <span className="font-medium">
                      R$ {financialData.nextBilling.estimatedAmount.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">(valor máximo)</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1 italic">
                  A cobrança ocorrerá automaticamente quando as taxas acumuladas atingirem R$ {financialData.cycle.currentLimit} ou ao final do ciclo, o que ocorrer primeiro.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Política de Taxas */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-muted-foreground" />
              <CardTitle className="text-xl">Política de Taxas</CardTitle>
            </div>
            <CardDescription>Detalhes sobre a cobrança de taxas de processamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-[#1E1E1E] dark:bg-opacity-50 p-4 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-200 dark:shadow-black/10">
                <div className="flex items-center mb-2">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2">
                    <Percent className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold ml-2">Taxa por Transação</h3>
                </div>
                <p className="text-sm text-muted-foreground dark:text-[#B3B3B3]">
                  {financialData.cycle.transactionFeePercentage}% sobre cada pedido processado e aprovado na plataforma.
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-[#1E1E1E] dark:bg-opacity-50 p-4 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-200 dark:shadow-black/10">
                <div className="flex items-center mb-2">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2">
                    <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold ml-2">Ciclo Acumulativo</h3>
                </div>
                <p className="text-sm text-muted-foreground dark:text-[#B3B3B3]">
                  As taxas são acumuladas até atingirem R$ {financialData.cycle.currentLimit.toLocaleString('pt-BR')}, quando então é realizada a cobrança.
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-[#1E1E1E] dark:bg-opacity-50 p-4 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-200 dark:shadow-black/10">
                <div className="flex items-center mb-2">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
                    <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold ml-2">Forma de Cobrança</h3>
                </div>
                <p className="text-sm text-muted-foreground dark:text-[#B3B3B3]">
                  Cobrança automática no cartão de crédito cadastrado, apenas quando o limite de R$ {financialData.cycle.currentLimit.toLocaleString('pt-BR')} é atingido.
                </p>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>A taxa de {financialData.cycle.transactionFeePercentage}% se aplica somente às transações aprovadas. Não há cobrança por vendas canceladas, estornos ou falhas de pagamento. As taxas são transparentes e aparecem detalhadas no seu Extrato de Transações.</p>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Cobranças */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Histórico de Cobranças</CardTitle>
              <Button variant="outline" size="sm" onClick={handleManualCharge}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reemitir cobrança manual
              </Button>
            </div>
            <CardDescription>Registro de todas as cobranças de taxas relacionadas à sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialData.billingHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{item.description}</TableCell>
                    <TableCell>R$ {item.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Credit Card Modal */}
      <CreditCardModal 
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        existingCard={financialData.paymentMethod ? {
          last4: financialData.paymentMethod.last4,
          brand: financialData.paymentMethod.brand
        } : null}
      />
    </DashboardLayout>
  );
};

export default FinanceiroPage;
