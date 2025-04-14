
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Download, 
  Search, 
  Filter, 
  Check, 
  X, 
  AlertCircle, 
  Clock, 
  Mail, 
  Globe
} from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { toast } from "sonner";

interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  ip: string;
  result: "success" | "error" | "warning";
  details?: string;
  actionType: "modification" | "access" | "security" | "system";
}

const AdminLogsAuditoria = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [actionTypeFilter, setActionTypeFilter] = useState<string>("all");
  const [resultFilter, setResultFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ 
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date() 
  });

  // Fixed handleDateRangeChange function to match the expected type
  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
  };

  const allLogs: LogEntry[] = [
    {
      id: "log1",
      timestamp: "2025-04-14T10:32:00",
      action: "Alterou taxa da loja \"ShopX\" para 2,5%",
      user: "admin@voltz.com",
      ip: "191.245.XXX.XXX",
      result: "success",
      actionType: "modification"
    },
    {
      id: "log2",
      timestamp: "2025-04-13T19:00:00",
      action: "Bloqueou usuário \"joao@email.com\"",
      user: "suporte@voltz.com",
      ip: "177.22.XXX.XXX",
      result: "success",
      actionType: "security"
    },
    {
      id: "log3",
      timestamp: "2025-04-12T08:12:00",
      action: "Tentativa de acesso sem permissão",
      user: "guest_user",
      ip: "200.180.XXX.XXX",
      result: "error",
      actionType: "security"
    },
    {
      id: "log4",
      timestamp: "2025-04-11T15:45:00",
      action: "Trocou plano da loja \"TechStore\" para Escalando",
      user: "admin@voltz.com",
      ip: "191.245.XXX.XXX",
      result: "success",
      actionType: "modification"
    },
    {
      id: "log5",
      timestamp: "2025-04-10T14:22:00",
      action: "Aprovou reembolso #12345 no valor de R$399,90",
      user: "financeiro@voltz.com",
      ip: "189.112.XXX.XXX",
      result: "success",
      actionType: "modification"
    },
    {
      id: "log6",
      timestamp: "2025-04-09T11:08:00",
      action: "Suspendeu loja \"FashionStore\" por atraso no pagamento",
      user: "admin@voltz.com",
      ip: "191.245.XXX.XXX",
      result: "warning",
      actionType: "security"
    },
    {
      id: "log7",
      timestamp: "2025-04-08T09:30:00",
      action: "Tentativa de login com credenciais inválidas",
      user: "unknown",
      ip: "45.178.XXX.XXX",
      result: "error",
      actionType: "security"
    },
    {
      id: "log8",
      timestamp: "2025-04-07T16:40:00",
      action: "Acessou informações sensíveis da loja \"SuperMarket\"",
      user: "suporte@voltz.com",
      ip: "177.22.XXX.XXX",
      result: "success",
      actionType: "access"
    },
    {
      id: "log9",
      timestamp: "2025-04-06T13:15:00",
      action: "Sistema executou backup automático",
      user: "system",
      ip: "internal",
      result: "success",
      actionType: "system"
    },
    {
      id: "log10",
      timestamp: "2025-04-05T20:05:00",
      action: "Alterou permissões do usuário \"analista@voltz.com\"",
      user: "admin@voltz.com",
      ip: "191.245.XXX.XXX",
      result: "success",
      actionType: "security"
    }
  ];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, "dd/MM/yyyy HH:mm");
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "error":
        return <X className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case "success":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Sucesso</Badge>;
      case "error":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Negado</Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Alerta</Badge>;
      default:
        return null;
    }
  };

  const getActionTypeBadge = (actionType: string) => {
    switch (actionType) {
      case "modification":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Alteração</Badge>;
      case "access":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Acesso</Badge>;
      case "security":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Segurança</Badge>;
      case "system":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Sistema</Badge>;
      default:
        return null;
    }
  };

  const filterLogs = () => {
    let filteredLogs = allLogs;
    
    if (activeTab !== "all") {
      filteredLogs = filteredLogs.filter(log => log.actionType === activeTab);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.action.toLowerCase().includes(searchLower) || 
        log.user.toLowerCase().includes(searchLower) ||
        log.ip.toLowerCase().includes(searchLower)
      );
    }
    
    if (actionTypeFilter && actionTypeFilter !== "all") {
      filteredLogs = filteredLogs.filter(log => log.actionType === actionTypeFilter);
    }
    
    if (resultFilter && resultFilter !== "all") {
      filteredLogs = filteredLogs.filter(log => log.result === resultFilter);
    }
    
    if (dateRange?.from) {
      filteredLogs = filteredLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        if (dateRange.from && dateRange.to) {
          return logDate >= dateRange.from && logDate <= dateRange.to;
        } else if (dateRange.from) {
          return logDate >= dateRange.from;
        }
        return true;
      });
    }
    
    return filteredLogs;
  };

  const handleExportCSV = () => {
    const logs = filterLogs();
    
    if (logs.length === 0) {
      toast.error("Não há dados para exportar");
      return;
    }
    
    const csvData = logs.map(log => ({
      "Data/Hora": formatTimestamp(log.timestamp),
      "Ação": log.action,
      "Usuário": log.user,
      "IP": log.ip,
      "Resultado": log.result === "success" ? "Sucesso" : log.result === "error" ? "Negado" : "Alerta",
      "Tipo de Ação": log.actionType === "modification" ? "Alteração" : 
                     log.actionType === "access" ? "Acesso" : 
                     log.actionType === "security" ? "Segurança" : "Sistema"
    }));
    
    const headers = Object.keys(csvData[0]).join(",");
    const rows = csvData.map(row => Object.values(row).join(","));
    const csvContent = [headers, ...rows].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    const now = new Date();
    link.setAttribute("href", url);
    link.setAttribute("download", `logs_auditoria_${format(now, "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exportado com sucesso");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Logs & Auditoria</h1>
          <p className="text-muted-foreground">
            Visualize e monitore todas as ações realizadas no sistema
          </p>
        </div>
        <Button onClick={handleExportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <Card className="mb-6">
        <div className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ação, usuário ou IP..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <DatePickerWithRange 
              selected={dateRange}
              onSelect={handleDateRangeChange}
              className="w-full md:w-auto"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 md:flex-none md:w-1/4">
              <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Tipo de ação" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="modification">Alteração</SelectItem>
                  <SelectItem value="access">Acesso</SelectItem>
                  <SelectItem value="security">Segurança</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 md:flex-none md:w-1/4">
              <Select value={resultFilter} onValueChange={setResultFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <SelectValue placeholder="Resultado" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os resultados</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="error">Negado</SelectItem>
                  <SelectItem value="warning">Alerta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 w-full md:w-auto">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="modification">Alterações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="access">Acessos</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="bg-card rounded-lg border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader sticky>
                  <TableRow>
                    <TableHead className="w-[180px]">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Data/Hora
                      </div>
                    </TableHead>
                    <TableHead className="w-[300px]">Ação Realizada</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Usuário/Admin
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        IP de Origem
                      </div>
                    </TableHead>
                    <TableHead className="w-[120px] text-center">Tipo</TableHead>
                    <TableHead className="w-[120px] text-center">Resultado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterLogs().length > 0 ? (
                    filterLogs().map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                        <TableCell className="text-center">
                          {getActionTypeBadge(log.actionType)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getResultBadge(log.result)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nenhum log encontrado com os filtros selecionados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminLogsAuditoria;
