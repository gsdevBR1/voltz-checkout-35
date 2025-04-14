
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  FileText, 
  Settings, 
  Bell, 
  CreditCard, 
  BarChart3,
  Eye, 
  ChevronDown, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export const AdminSidebar = () => {
  const location = useLocation();
  const [isStoresSubmenuOpen, setIsStoresSubmenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('is_admin');
    window.location.href = '/admin/login';
  };

  return (
    <div className="w-64 bg-[#1A1A1A] border-r border-white/5 flex flex-col min-h-screen">
      <div className="px-6 py-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-[#10B981] rounded-md flex items-center justify-center">
            <Eye className="h-5 w-5 text-white" />
          </div>
          <div className="text-white font-semibold text-lg">Voltz Admin</div>
        </div>
      </div>
      
      <Separator className="bg-white/5" />
      
      <nav className="flex-1 py-6 px-4 space-y-1">
        <Link to="/admin/dashboard">
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-gray-400 hover:text-white hover:bg-[#262626]", 
              isActive('/admin/dashboard') && "bg-[#262626] text-white"
            )}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Button>
        </Link>
        
        <div>
          <Button
            variant="ghost"
            className={cn("w-full justify-between text-gray-400 hover:text-white hover:bg-[#262626]", 
              isActive('/admin/lojas') && "bg-[#262626] text-white"
            )}
            onClick={() => setIsStoresSubmenuOpen(!isStoresSubmenuOpen)}
          >
            <div className="flex items-center">
              <Store className="h-5 w-5 mr-3" />
              Lojas
            </div>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isStoresSubmenuOpen && "transform rotate-180")} />
          </Button>
          
          {isStoresSubmenuOpen && (
            <div className="ml-10 space-y-1 mt-1">
              <Link to="/admin/lojas">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start text-gray-400 hover:text-white hover:bg-[#262626] px-3", 
                    location.pathname === '/admin/lojas' && "text-white"
                  )}
                >
                  Todas as Lojas
                </Button>
              </Link>
              <Link to="/admin/lojas/relatorios">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("w-full justify-start text-gray-400 hover:text-white hover:bg-[#262626] px-3", 
                    location.pathname === '/admin/lojas/relatorios' && "text-white"
                  )}
                >
                  Relatórios
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        <Link to="/admin/usuarios">
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-gray-400 hover:text-white hover:bg-[#262626]", 
              isActive('/admin/usuarios') && "bg-[#262626] text-white"
            )}
          >
            <Users className="h-5 w-5 mr-3" />
            Usuários
          </Button>
        </Link>
        
        <Link to="/admin/financeiro">
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-gray-400 hover:text-white hover:bg-[#262626]", 
              isActive('/admin/financeiro') && "bg-[#262626] text-white"
            )}
          >
            <CreditCard className="h-5 w-5 mr-3" />
            Financeiro
          </Button>
        </Link>
        
        <Link to="/admin/relatorios">
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-gray-400 hover:text-white hover:bg-[#262626]", 
              isActive('/admin/relatorios') && "bg-[#262626] text-white"
            )}
          >
            <BarChart3 className="h-5 w-5 mr-3" />
            Relatórios & Exportações
          </Button>
        </Link>
        
        <Link to="/admin/auditoria">
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-gray-400 hover:text-white hover:bg-[#262626]", 
              isActive('/admin/auditoria') && "bg-[#262626] text-white"
            )}
          >
            <FileText className="h-5 w-5 mr-3" />
            Logs de Auditoria
          </Button>
        </Link>
        
        <Link to="/admin/notificacoes">
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-gray-400 hover:text-white hover:bg-[#262626]", 
              isActive('/admin/notificacoes') && "bg-[#262626] text-white"
            )}
          >
            <Bell className="h-5 w-5 mr-3" />
            Notificações & Alertas
          </Button>
        </Link>
        
        <Link to="/admin/configuracoes">
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-gray-400 hover:text-white hover:bg-[#262626]", 
              isActive('/admin/configuracoes') && "bg-[#262626] text-white"
            )}
          >
            <Settings className="h-5 w-5 mr-3" />
            Configurações
          </Button>
        </Link>
      </nav>
      
      <div className="p-4 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-[#262626]"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
};
