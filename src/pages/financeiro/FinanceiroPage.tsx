
import React from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

// Mock data - in a real application, this would come from an API
const financialData = {
  cycle: {
    totalBilled: 5850.75,
    currentLimit: 10000,
    usagePercentage: 58.5,
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
    { id: 1, date: "02/03/2025", amount: 4325.50, status: "paid" },
    { id: 2, date: "01/02/2025", amount: 3875.25, status: "paid" },
    { id: 3, date: "01/01/2025", amount: 5125.75, status: "paid" },
    { id: 4, date: "01/12/2024", amount: 4950.00, status: "paid" },
  ],
  nextBilling: {
    date: "01/05/2025",
    estimatedAmount: 6000,
  }
};

const FinanceiroPage: React.FC = () => {
  const [isCardDialogOpen, setIsCardDialogOpen] = React.useState(false);
  const [showLimitWarning, setShowLimitWarning] = React.useState(financialData.cycle.usagePercentage > 80);
  
  const handleUpdateCard = () => {
    // In a real app, this would handle the card update process
    toast({
      title: "Cartão atualizado",
      description: "Seu método de pagamento foi atualizado com sucesso.",
    });
    setIsCardDialogOpen(false);
  };

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
              Adicione um método de pagamento para evitar interrupções no seu serviço.
            </AlertDescription>
          </Alert>
        )}

        {showLimitWarning && (
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
                  <CardDescription>Informações sobre seu ciclo atual</CardDescription>
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
                          A cobrança é realizada automaticamente ao final do ciclo 
                          baseada no seu consumo total. O limite define o máximo de 
                          processamento permitido neste ciclo.
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
                  <span className="text-sm text-muted-foreground">Limite atual liberado</span>
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
                  indicatorClassName={
                    financialData.cycle.usagePercentage > 80 
                      ? "bg-amber-500" 
                      : financialData.cycle.usagePercentage > 95 
                        ? "bg-red-500" 
                        : "bg-green-500"
                  }
                  className="h-2"
                />
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
              <CardDescription>Dados do seu cartão e próxima cobrança</CardDescription>
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
                <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      {financialData.paymentMethod ? "Alterar cartão" : "Adicionar cartão"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Atualizar método de pagamento</DialogTitle>
                      <DialogDescription>
                        Adicione ou atualize os dados do seu cartão de crédito.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      {/* In a real app, this would be a form for card details */}
                      <p className="text-center text-muted-foreground py-6">
                        Formulário para informações de cartão estaria aqui em uma aplicação real.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCardDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleUpdateCard}>Salvar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
    </DashboardLayout>
  );
};

export default FinanceiroPage;
