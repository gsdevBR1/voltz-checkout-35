
import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  DollarSign, 
  Settings, 
  FileText, 
  Bell,
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SidebarLink = ({ to, icon, label, active }: { 
  to: string; 
  icon: React.ReactNode; 
  label: string; 
  active: boolean;
}) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-gray-400 hover:text-white hover:bg-[#262626]",
          active && "bg-[#262626] text-white"
        )}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </Button>
    </Link>
  );
};

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={cn(
      "bg-[#1A1A1A] flex flex-col border-r border-white/5 h-screen relative transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-white/5 flex items-center">
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div className="text-white text-xl font-bold">
              voltz<span className="text-[#10B981]">.admin</span>
            </div>
          )}
          
          {collapsed && (
            <div className="text-white text-xl font-bold">
              v<span className="text-[#10B981]">.</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn(
              "text-gray-400 hover:text-white",
              collapsed ? "ml-0" : "ml-2"
            )}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-1 overflow-y-auto">
        <SidebarLink
          to="/admin"
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          active={isActive('/admin') && location.pathname === '/admin'}
        />
        
        <SidebarLink
          to="/admin/lojas"
          icon={<Store className="h-5 w-5" />}
          label="Lojas"
          active={isActive('/admin/lojas')}
        />
        
        <SidebarLink
          to="/admin/usuarios"
          icon={<Users className="h-5 w-5" />}
          label="Usuários"
          active={isActive('/admin/usuarios')}
        />
        
        <SidebarLink
          to="/admin/financeiro"
          icon={<DollarSign className="h-5 w-5" />}
          label="Financeiro"
          active={isActive('/admin/financeiro')}
        />
        
        <SidebarLink
          to="/admin/notificacoes"
          icon={<Bell className="h-5 w-5" />}
          label="Notificações"
          active={isActive('/admin/notificacoes')}
        />
        
        <SidebarLink
          to="/admin/logs"
          icon={<FileText className="h-5 w-5" />}
          label="Logs & Auditoria"
          active={isActive('/admin/logs')}
        />
        
        <SidebarLink
          to="/admin/configuracoes"
          icon={<Settings className="h-5 w-5" />}
          label="Configurações"
          active={isActive('/admin/configuracoes')}
        />
      </div>
      
      <div className="p-4 border-t border-white/5">
        <div className={cn(
          "text-gray-400 text-xs",
          collapsed ? "text-center" : ""
        )}>
          {!collapsed ? "v2.5.3" : "v2.5"}
        </div>
      </div>
    </div>
  );
};
