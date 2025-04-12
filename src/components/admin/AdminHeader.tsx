
import React from 'react';
import { Bell, UserCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

export const AdminHeader: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('is_admin');
    toast({
      title: "Logout realizado",
      description: "Você saiu da área administrativa com sucesso.",
    });
    window.location.href = '/pagina-inicial';
  };

  return (
    <header className="h-16 border-b border-white/5 bg-[#121212] shadow-sm flex items-center px-6">
      <div className="flex-1 flex items-center">
        <h1 className="text-xl font-semibold text-white mr-2">Voltz Admin</h1>
        <span className="px-2 py-1 rounded-md bg-[#3b3b3b] text-xs text-[#10B981]">
          Painel Administrativo
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-gray-400 hover:text-white"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center text-white">
            3
          </span>
        </Button>

        <ThemeToggle />
        
        <Separator orientation="vertical" className="h-8 bg-white/5" />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2 text-gray-400 hover:text-white px-2"
            >
              <UserCircle className="h-6 w-6" />
              <span>Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[#1E1E1E] border-white/5">
            <DropdownMenuItem className="cursor-pointer hover:bg-[#2A2A2A]">
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-[#2A2A2A]">
              Preferências
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem 
              className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-[#2A2A2A]"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair do Admin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
