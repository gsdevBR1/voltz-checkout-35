import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Filter, Info } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DateRange } from 'react-day-picker';

// Types for cycle history entries
export interface CycleHistoryEntry {
  id: string;
  timestamp: Date;
  previousValue: number;
  newValue: number;
  changeType: 'automatic' | 'manual';
  changedBy: string;
  rule?: {
    minRevenue: number;
    maxRevenue: number;
    cycleValue: number;
  }
}

interface CycleHistoryTableProps {
  storeId: string;
}

const CycleHistoryTable: React.FC<CycleHistoryTableProps> = ({ storeId }) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState<CycleHistoryEntry | null>(null);

  // Mock data for demonstration
  const mockCycleHistory: CycleHistoryEntry[] = [
    {
      id: "1",
      timestamp: new Date('2025-04-14T15:32:00'),
      previousValue: 10000,
      newValue: 20000,
      changeType: 'automatic',
      changedBy: 'Sistema',
      rule: {
        minRevenue: 5001,
        maxRevenue: 15000,
        cycleValue: 20000
      }
    },
    {
      id: "2",
      timestamp: new Date('2025-04-08T11:07:00'),
      previousValue: 20000,
      newValue: 30000,
      changeType: 'manual',
      changedBy: 'admin@voltzcheckout.com'
    },
    {
      id: "3", 
      timestamp: new Date('2025-04-01T09:15:00'),
      previousValue: 5000,
      newValue: 10000,
      changeType: 'automatic',
      changedBy: 'Sistema',
      rule: {
        minRevenue: 0,
        maxRevenue: 5000,
        cycleValue: 10000
      }
    }
  ];

  // Filter history based on selected period
  const getFilteredHistory = () => {
    let filtered = [...mockCycleHistory];
    
    const now = new Date();
    let fromDate: Date | undefined;
    
    if (periodFilter === '7days') {
      fromDate = new Date(now.setDate(now.getDate() - 7));
    } else if (periodFilter === '30days') {
      fromDate = new Date(now.setDate(now.getDate() - 30));
    } else if (periodFilter === 'custom' && dateRange.from) {
      fromDate = dateRange.from;
    }
    
    if (fromDate) {
      filtered = filtered.filter(entry => entry.timestamp >= fromDate!);
    }
    
    if (periodFilter === 'custom' && dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(entry => entry.timestamp <= toDate);
    }
    
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100);
  };

  const handleShowRuleDetails = (entry: CycleHistoryEntry) => {
    setSelectedRule(entry);
    setShowRuleDialog(true);
  };

  const filteredHistory = getFilteredHistory();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Período" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todo o período</SelectItem>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          {periodFilter === 'custom' && (
            <DatePickerWithRange
              selected={dateRange}
              onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
            />
          )}
        </div>
      </div>

      {/* Cycle History Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Valor Anterior do Ciclo</TableHead>
              <TableHead>Novo Valor do Ciclo</TableHead>
              <TableHead>Tipo de Alteração</TableHead>
              <TableHead>Alterado por</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {format(entry.timestamp, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{formatCurrency(entry.previousValue)}</TableCell>
                  <TableCell>{formatCurrency(entry.newValue)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={cn(
                          entry.changeType === 'automatic' 
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800" 
                            : "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                        )}
                      >
                        {entry.changeType === 'automatic' ? 'Automático' : 'Manual'}
                      </Badge>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            {entry.changeType === 'automatic' 
                              ? "Ajuste automático com base no faturamento total da loja." 
                              : "Ajuste manual feito via painel Admin."}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell>{entry.changedBy}</TableCell>
                  <TableCell className="text-right">
                    {entry.changeType === 'automatic' && entry.rule && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleShowRuleDetails(entry)}
                      >
                        Ver regra aplicada
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  Nenhum registro de alteração de ciclo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Rule Details Dialog */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Regra Aplicada</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedRule?.rule && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Faturamento Mínimo</h4>
                    <p className="text-base font-semibold">
                      {formatCurrency(selectedRule.rule.minRevenue * 100)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Faturamento Máximo</h4>
                    <p className="text-base font-semibold">
                      {selectedRule.rule.maxRevenue === Number.MAX_SAFE_INTEGER 
                        ? "Sem limite"
                        : formatCurrency(selectedRule.rule.maxRevenue * 100)}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Valor do Ciclo para esta Faixa</h4>
                  <p className="text-base font-semibold">{formatCurrency(selectedRule.rule.cycleValue)}</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm">
                    Esta alteração foi aplicada automaticamente quando o faturamento total da loja 
                    entrou na faixa especificada acima.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CycleHistoryTable;
