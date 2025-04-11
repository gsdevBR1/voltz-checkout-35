
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

interface SidebarProps {
  className?: string;
}

export const AppSidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: 'Página Inicial',
      path: '/',
      icon: Home,
    },
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: BarChart2,
    },
  ];
  
  return (
    <Sidebar className={className}>
      <SidebarContent>
        <div className="px-4 py-6">
          <h2 className="text-xl font-bold text-primary">voltz.checkout</h2>
        </div>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.path}
                tooltip={item.title}
              >
                <Link to={item.path} className="w-full">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3 border-t border-border">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
};

export const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </SidebarProvider>
  );
};
