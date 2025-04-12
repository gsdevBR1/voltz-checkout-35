
import React from 'react';
import { ArrowUp, ArrowDown, Store, User, CreditCard, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trendUp = true 
}: { 
  title: string; 
  value: string; 
  change: string;
  icon: React.ReactNode; 
  trendUp?: boolean; 
}) => {
  return (
    <Card className="bg-[#1E1E1E] border-white/5 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <div className="h-8 w-8 rounded-md bg-[#262626] flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className={cn(
          "flex items-center text-xs mt-1",
          trendUp ? "text-emerald-500" : "text-red-500"
        )}>
          {trendUp ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
          <span>{change} em relação ao ciclo anterior</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function for className consolidation
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="text-sm text-gray-400">
          Última atualização: 12 Abril, 2025 às 09:45
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Lojas Ativas"
          value="156"
          change="12%"
          icon={<Store className="h-5 w-5 text-[#10B981]" />}
          trendUp={true}
        />
        
        <StatsCard
          title="Novos Usuários"
          value="28"
          change="8%"
          icon={<User className="h-5 w-5 text-blue-500" />}
          trendUp={true}
        />
        
        <StatsCard
          title="Faturamento Global"
          value="R$ 28.562,90"
          change="15%"
          icon={<CreditCard className="h-5 w-5 text-purple-500" />}
          trendUp={true}
        />
        
        <StatsCard
          title="Alertas Críticos"
          value="7"
          change="3%"
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          trendUp={false}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1E1E1E] border-white/5 shadow-md">
          <CardHeader>
            <CardTitle className="text-white">Alertas Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlertItem
              type="Cobrança Recusada"
              store="Loja Pet Happiness"
              time="25 minutos atrás"
              status="critical"
            />
            <AlertItem
              type="Domínio sem SSL"
              store="Tech Innovations"
              time="1 hora atrás"
              status="warning"
            />
            <AlertItem
              type="Checkout com Erro"
              store="Moda Fashion Store"
              time="3 horas atrás"
              status="critical"
            />
            <AlertItem
              type="Gateway Offline"
              store="Home Decor Shop"
              time="5 horas atrás"
              status="warning"
            />
          </CardContent>
        </Card>
        
        <Card className="bg-[#1E1E1E] border-white/5 shadow-md">
          <CardHeader>
            <CardTitle className="text-white">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ActivityItem
              action="Bloqueio de Usuário"
              target="maria@email.com"
              admin="admin@voltz.checkout"
              time="12 minutos atrás"
            />
            <ActivityItem
              action="Alteração de Ciclo"
              target="Loja XYZ Store"
              admin="suporte@voltz.checkout"
              time="45 minutos atrás"
            />
            <ActivityItem
              action="Reset de Senha"
              target="joao@email.com"
              admin="admin@voltz.checkout"
              time="1 hora atrás"
            />
            <ActivityItem
              action="Forçar Cobrança"
              target="Beauty Shop"
              admin="financeiro@voltz.checkout"
              time="3 horas atrás"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

type AlertItemProps = {
  type: string;
  store: string;
  time: string;
  status: 'critical' | 'warning';
};

const AlertItem: React.FC<AlertItemProps> = ({ type, store, time, status }) => {
  return (
    <div className="flex justify-between items-center p-3 rounded-md bg-[#262626] hover:bg-[#2A2A2A] transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-2 h-2 rounded-full",
          status === 'critical' ? "bg-red-500" : "bg-yellow-500"
        )} />
        <div>
          <div className="font-medium text-sm text-white">{type}</div>
          <div className="text-xs text-gray-400">{store}</div>
        </div>
      </div>
      <div className="text-xs text-gray-500">{time}</div>
    </div>
  );
};

type ActivityItemProps = {
  action: string;
  target: string;
  admin: string;
  time: string;
};

const ActivityItem: React.FC<ActivityItemProps> = ({ action, target, admin, time }) => {
  return (
    <div className="flex justify-between items-center p-3 rounded-md bg-[#262626] hover:bg-[#2A2A2A] transition-colors">
      <div>
        <div className="font-medium text-sm text-white">{action}</div>
        <div className="text-xs text-gray-400">
          <span className="text-blue-400">{target}</span> por <span className="text-[#10B981]">{admin}</span>
        </div>
      </div>
      <div className="text-xs text-gray-500">{time}</div>
    </div>
  );
};

export default AdminDashboard;
