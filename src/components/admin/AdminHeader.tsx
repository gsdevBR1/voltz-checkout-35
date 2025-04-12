
import React from 'react';
import { 
  Bell, 
  Search, 
  User,
  ChevronDown,
  Settings,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ThemeToggle';

export const AdminHeader: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('is_admin');
    window.location.href = '/admin/login';
  };

  return (
    <header className="h-16 border-b border-white/5 bg-[#1A1A1A] flex items-center px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="relative mr-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Buscar..."
              className="bg-[#262626] border border-white/10 rounded-md py-1.5 pl-9 pr-4 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <HelpCircle className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-sm">
                <div className="h-8 w-8 rounded-full bg-[#262626] flex items-center justify-center text-[#10B981]">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-white">Admin</div>
                  <div className="text-xs text-gray-400">Administrador</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#262626] border-white/10">
              <DropdownMenuLabel className="text-gray-300">Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-[#1A1A1A]">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-[#1A1A1A]">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                className="text-red-400 focus:text-red-400 focus:bg-[#1A1A1A]"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
