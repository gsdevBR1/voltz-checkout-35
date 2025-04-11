
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Home, 
  BarChart2, 
  Store as StoreIcon, 
  ChevronLeft, 
  ChevronRight, 
  User,
  ShoppingCart,
  FileText,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StoreSelector } from '@/components/StoreSelector';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from '@/components/ui/sidebar';

interface SidebarProps {
  className?: string;
}

export const AppSidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: 'Página Inicial',
      path: '/pagina-inicial',
      icon: Home,
    },
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: BarChart2,
    },
    {
      title: 'Vendas',
      path: '/vendas',
      icon: ShoppingCart,
      subItems: [
        {
          title: 'Ver Todas',
          path: '/vendas/todas',
          icon: FileText,
        },
        {
          title: 'Carrinhos Abandonados',
          path: '/vendas/abandonados',
          icon: ShoppingBag,
        }
      ]
    },
    {
      title: 'Minhas Lojas',
      path: '/lojas',
      icon: StoreIcon,
    },
  ];
  
  return (
    <Sidebar className={className}>
      <SidebarHeader>
        <div className="flex items-center justify-between w-full px-4 py-6">
          <h2 className="text-xl font-bold text-primary">voltz.checkout</h2>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              {item.subItems ? (
                <>
                  <SidebarMenuButton
                    isActive={location.pathname.startsWith(item.path)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {item.subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.path}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location.pathname === subItem.path}
                        >
                          <Link to={subItem.path}>
                            <subItem.icon className="h-4 w-4" />
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </>
              ) : (
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
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3 border-t border-border">
        <div className="flex items-center justify-between">
          <StoreSelector />
          <Avatar className="h-9 w-9 ml-2">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

// The SidebarLayout component was not properly exported, let's fix that
export const SidebarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </SidebarProvider>
  );
};
