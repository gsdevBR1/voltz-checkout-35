
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useStores } from '@/contexts/StoreContext';

export type KpiCategory = 'financial' | 'conversion' | 'traffic';

export interface KpiSetting {
  id: string;
  name: string;
  category: KpiCategory;
  default: boolean;
}

export const availableKpis: KpiSetting[] = [
  { id: 'faturamento', name: 'Faturamento (Dia)', category: 'financial', default: true },
  { id: 'transacoes', name: 'Transações Aprovadas', category: 'financial', default: true },
  { id: 'ticketMedio', name: 'Ticket Médio', category: 'financial', default: true },
  { id: 'conversaoCheckout', name: 'Conversão do Checkout', category: 'conversion', default: true },
  { id: 'conversaoGateway', name: 'Conversão do Gateway', category: 'conversion', default: true },
  { id: 'reembolsos', name: 'Reembolsos', category: 'financial', default: true },
  { id: 'chargebacks', name: 'Chargebacks', category: 'financial', default: false },
  { id: 'visitas', name: 'Visitas no Checkout', category: 'traffic', default: true },
];

export interface CustomizeDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomizeDashboardDialog({ open, onOpenChange }: CustomizeDashboardDialogProps) {
  const { currentStore, updateStore } = useStores();
  const [activeKpis, setActiveKpis] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    // Initialize KPI settings from store or defaults
    if (currentStore) {
      const initialKpis: Record<string, boolean> = {};
      
      availableKpis.forEach(kpi => {
        const storeKpiSettings = currentStore.dashboardSettings?.kpis || {};
        initialKpis[kpi.id] = storeKpiSettings[kpi.id] !== undefined 
          ? storeKpiSettings[kpi.id] 
          : kpi.default;
      });
      
      setActiveKpis(initialKpis);
    }
  }, [currentStore]);

  const handleToggleKpi = (kpiId: string) => {
    setActiveKpis(prev => ({
      ...prev,
      [kpiId]: !prev[kpiId]
    }));
  };

  const handleSave = () => {
    if (currentStore) {
      updateStore(currentStore.id, {
        dashboardSettings: {
          ...currentStore.dashboardSettings,
          kpis: activeKpis
        }
      });
      onOpenChange(false);
    }
  };

  const handleResetToDefaults = () => {
    const defaultKpis: Record<string, boolean> = {};
    availableKpis.forEach(kpi => {
      defaultKpis[kpi.id] = kpi.default;
    });
    setActiveKpis(defaultKpis);
  };

  // Group KPIs by category
  const kpisByCategory: Record<KpiCategory, KpiSetting[]> = {
    financial: availableKpis.filter(kpi => kpi.category === 'financial'),
    conversion: availableKpis.filter(kpi => kpi.category === 'conversion'),
    traffic: availableKpis.filter(kpi => kpi.category === 'traffic'),
  };

  const categoryNames: Record<KpiCategory, string> = {
    financial: 'Financeiro',
    conversion: 'Conversão',
    traffic: 'Tráfego',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Personalizar Dashboard</DialogTitle>
          <DialogDescription>
            Selecione os indicadores que deseja visualizar em sua Dashboard. 
            Você pode ativar ou desativar qualquer KPI a qualquer momento.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
          {(Object.keys(categoryNames) as KpiCategory[]).map(category => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">{categoryNames[category]}</h3>
              <div className="space-y-3">
                {kpisByCategory[category].map(kpi => (
                  <div key={kpi.id} className="flex items-center justify-between">
                    <Label htmlFor={kpi.id} className="cursor-pointer">{kpi.name}</Label>
                    <Switch 
                      id={kpi.id}
                      checked={activeKpis[kpi.id] || false}
                      onCheckedChange={() => handleToggleKpi(kpi.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleResetToDefaults}
          >
            Restaurar padrão
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
