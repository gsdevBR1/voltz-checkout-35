
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
  RefreshCw
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
    currentLimit: 100, // Changed to 100 as per requirement
    freeLimit: 100, // New field to represent the free tier limit
    usagePercentage: 78.45, // Updated percentage based on new limit
    status: "active", // active, warning, overdue
    startDate: "01/04/2025",
    endDate: "30/04/2025",
    isFreeUsage: true, // New field to indicate free tier usage
  },
  paymentMethod: {
    type: "credit_card",
    last4: "4242", // Only show last 4 digits for security
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2027,
  },
  billingHistory: [
    { id: 1, date: "02/03/2025", amount: 125.50, status: "paid" },
    { id: 2, date: "01/02/2025", amount: 89.25, status: "paid" },
    { id: 3, date: "01/01/2025", amount: 112.75, status: "paid" },
    { id: 4, date: "01/12/2024", amount: 95.00, status: "paid" },
  ],
  nextBilling: {
    date: "01/05/2025",
    estimatedAmount: 90,
  }
};

const FinanceiroPage: React.FC = () => {
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(financialData.cycle.usagePercentage > 90);
  const [showFreeUsageAlert, setShowFreeUsageAlert] = useState(
    financialData.cycle.isFreeUsage && financialData.cycle.usagePercentage > 90
  );
  
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seu ciclo de faturamento, limites e método de pagamento.
          </p>
        </div>

        {!financialData.paymentMethod && (
          <Alert className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nenhum método de pagamento cadastrado</AlertTitle>
            <AlertDescription>
              Adicione um método de pagamento para evitar interrupções no seu serviço após atingir o limite gratuito de R$ 100,00.
            </AlertDescription>
          </Alert>
        )}

        {showFreeUsageAlert && (
          <Alert className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atenção: Limite gratuito quase atingido</AlertTitle>
            <AlertDescription>
              Seu faturamento está próximo do limite gratuito de R$ 100,00. Cadastre um cartão de crédito 
              para evitar interrupções no seu serviço quando o limite for atingido.
            </AlertDescription>
          </Alert>
        )}

        {showLimitWarning && !financialData.cycle.isFreeUsage && (
          <Alert className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atenção: Utilização próxima ao limite</AlertTitle>
            <AlertDescription>
              Seu faturamento no ciclo atual está se aproximando do limite estabelecido.
              Entre em contato com o suporte caso precise aumentar seu limite.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ciclo de Uso */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">Ciclo de Uso</CardTitle>
                  <CardDescription>
                    {financialData.cycle.isFreeUsage 
                      ? "Ciclo gratuito inicial - R$ 100,00 de uso" 
                      : "Informações sobre seu ciclo atual"}
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
                          Você possui R$ 100,00 de uso gratuito inicial. Após atingir este limite, 
                          a cobrança é realizada automaticamente ao final do ciclo 
                          baseada no seu consumo total, via cartão de crédito previamente cadastrado.
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
                  <span className="text-sm text-muted-foreground">Faturamento do ciclo</span>
                  <div className="text-2xl font-bold flex items-center">
                    <DollarSign className="h-5 w-5 mr-1 text-muted-foreground" />
                    R$ {financialData.cycle.totalBilled.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">
                    {financialData.cycle.isFreeUsage ? "Limite gratuito" : "Limite atual liberado"}
                  </span>
                  <div className="text-2xl font-bold flex items-center">
                    <DollarSign className="h-5 w-5 mr-1 text-muted-foreground" />
                    R$ {financialData.cycle.currentLimit.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Utilização</span>
                  <span className="font-medium">{financialData.cycle.usagePercentage}%</span>
                </div>
                <Progress 
                  value={financialData.cycle.usagePercentage} 
                  className={
                    financialData.cycle.usagePercentage > 90 
                      ? "bg-amber-100" 
                      : financialData.cycle.usagePercentage > 95 
                        ? "bg-red-100" 
                        : "bg-slate-100"
                  }
                />
                <div className="text-xs text-muted-foreground">
                  Você está usando R$ {financialData.cycle.totalBilled.toLocaleString('pt-BR', {minimumFractionDigits: 2})} de 
                  R$ {financialData.cycle.freeLimit.toLocaleString('pt-BR')} disponíveis nesse ciclo
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
                {financialData.cycle.isFreeUsage && !financialData.paymentMethod 
                  ? "Cadastre seu cartão para uso após o ciclo gratuito" 
                  : "Dados do seu cartão e próxima cobrança"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-slate-600" />
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
                        Nenhum método cadastrado
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsCardModalOpen(true)}>
                  {financialData.paymentMethod ? "Alterar cartão" : "Adicionar cartão"}
                </Button>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Próxima cobrança</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-md">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Data:</span> {financialData.nextBilling.date}
                  </div>
                  <div>
                    <span className="font-medium">
                      R$ {financialData.nextBilling.estimatedAmount.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">(estimado)</span>
                  </div>
                </div>
                {financialData.cycle.isFreeUsage && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Cobranças serão realizadas automaticamente após atingir o limite gratuito
                    de R$ {financialData.cycle.freeLimit.toLocaleString('pt-BR')}.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

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
            <CardDescription>Registro de todas as cobranças relacionadas à sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialData.billingHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
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
