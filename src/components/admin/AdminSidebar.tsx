
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Users,
  DollarSign,
  Settings,
  BarChart3,
  Bell,
  FileText,
  ShieldAlert,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number | string;
  isAlert?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, badge, isAlert }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
          "hover:bg-white/5",
          isActive 
            ? "bg-[#262626] text-white font-medium" 
            : "text-gray-400"
        )
      }
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span 
          className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-medium",
            isAlert ? "bg-red-500/20 text-red-300" : "bg-[#3b3b3b] text-gray-300"
          )}
        >
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export const AdminSidebar: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('is_admin');
    window.location.href = '/admin/login';
  };

  return (
    <div className="w-64 bg-[#121212] border-r border-white/5 flex flex-col h-screen">
      <div className="flex items-center justify-center h-16 border-b border-white/5">
        <h2 className="text-xl font-bold text-white">
          voltz<span className="text-[#10B981]">.admin</span>
        </h2>
      </div>
      
      <div className="flex-1 overflow-auto py-4 px-2 space-y-1 scrollbar-hide">
        <NavItem
          to="/admin"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
        />
        
        <NavItem
          to="/admin/lojas"
          icon={<Store size={18} />}
          label="Lojas"
          badge="156"
        />
        
        <NavItem
          to="/admin/usuarios"
          icon={<Users size={18} />}
          label="Usuários"
          badge="892"
        />
        
        <NavItem
          to="/admin/financeiro"
          icon={<DollarSign size={18} />}
          label="Financeiro Global"
          badge="28"
        />
        
        <NavItem
          to="/admin/configuracoes"
          icon={<Settings size={18} />}
          label="Configurações Gerais"
        />
        
        <NavItem
          to="/admin/relatorios"
          icon={<BarChart3 size={18} />}
          label="Relatórios"
        />
        
        <NavItem
          to="/admin/alertas"
          icon={<Bell size={18} />}
          label="Alertas"
          badge="12"
          isAlert={true}
        />
        
        <NavItem
          to="/admin/logs"
          icon={<FileText size={18} />}
          label="Logs e Auditoria"
        />

        <div className="pt-4 mt-4 border-t border-white/5">
          <NavItem
            to="/admin/suporte"
            icon={<ShieldAlert size={18} />}
            label="Modo Suporte"
          />
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors w-full text-left text-gray-400 hover:bg-white/5 hover:text-red-400"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </div>
      
      <div className="p-4 border-t border-white/5">
        <div className="bg-[#1E1E1E] p-3 rounded-md text-xs text-gray-400">
          <p className="mb-1">Versão: <span className="text-white">1.0.0</span></p>
          <p>Ambiente: <span className="text-[#10B981] font-medium">Produção</span></p>
        </div>
      </div>
    </div>
  );
};

