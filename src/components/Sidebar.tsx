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
  ShoppingBag,
  ChevronDown,
  Users,
  UserCheck,
  UserX
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StoreSelector } from '@/components/StoreSelector';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  SidebarMenuSubButton,
  useSidebar
} from '@/components/ui/sidebar';

interface SidebarProps {
  className?: string;
}

export const AppSidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const { state } = useSidebar();
  
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .sidebar-icon {
        color: var(--icon-inactive-color);
        transition: color 0.3s ease-in-out;
      }
      
      .sidebar-icon.active {
        color: #2BBA00;
      }
      
      .sidebar-icon:hover:not(.active) {
        color: #666666;
      }
      
      @media (prefers-color-scheme: dark) {
        .sidebar-icon {
          --icon-inactive-color: #BBBBBB;
        }
      }
      
      @media (prefers-color-scheme: light) {
        .sidebar-icon {
          --icon-inactive-color: #999999;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
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
      title: 'Clientes',
      path: '/clientes',
      icon: Users,
      subItems: [
        {
          title: 'Ver Todos',
          path: '/clientes/todos',
          icon: UserCheck,
        },
        {
          title: 'Leads',
          path: '/clientes/leads',
          icon: UserX,
        }
      ]
    },
    {
      title: 'Minhas Lojas',
      path: '/lojas',
      icon: StoreIcon,
    },
  ];

  useEffect(() => {
    menuItems.forEach(item => {
      if (item.subItems && location.pathname.startsWith(item.path)) {
        setOpenSections(prev => ({ ...prev, [item.path]: true }));
      }
    });
  }, [location.pathname]);

  const toggleSection = (path: string) => {
    setOpenSections(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(path);
  };
  
  return (
    <Sidebar className={className}>
      <SidebarHeader>
        <div className="flex items-center justify-between w-full px-4 py-6">
          <Link to="/" className="flex items-center justify-center w-full h-full">
            <img 
              src="/lovable-uploads/3aa07f77-7311-4155-8e6c-39abb8dca3df.png" 
              alt="Voltz.Checkout Logo" 
              className="w-full h-full object-contain"
            />
          </Link>
          <Avatar className="h-8 w-8">
            <AvatarFallback>
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
                <Collapsible
                  open={openSections[item.path]}
                  onOpenChange={() => toggleSection(item.path)}
                >
                  <div className="flex w-full">
                    <CollapsibleTrigger asChild className="w-full">
                      <SidebarMenuButton
                        isActive={isActive(item.path)}
                        tooltip={item.title}
                        className="flex justify-between group"
                      >
                        <div className="flex items-center">
                          <item.icon 
                            className={cn(
                              "h-5 w-5 mr-2 sidebar-icon",
                              isActive(item.path) && "active"
                            )} 
                            aria-current={isActive(item.path) ? "page" : undefined}
                          />
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown 
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            openSections[item.path] ? "transform rotate-180" : "",
                            isActive(item.path) && "text-primary"
                          )} 
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.path}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={location.pathname === subItem.path}
                          >
                            <Link to={subItem.path} className="group">
                              <subItem.icon 
                                className={cn(
                                  "h-4 w-4 sidebar-icon",
                                  location.pathname === subItem.path && "active"
                                )}
                                aria-current={location.pathname === subItem.path ? "page" : undefined}
                              />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  tooltip={item.title}
                >
                  <Link to={item.path} className="w-full group">
                    <item.icon 
                      className={cn(
                        "h-5 w-5 sidebar-icon",
                        location.pathname === item.path && "active",
                        state === "collapsed" && "mx-auto"
                      )}
                      aria-current={location.pathname === item.path ? "page" : undefined}
                    />
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
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

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
