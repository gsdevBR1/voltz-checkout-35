
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
  ChevronDown
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

  // Initialize or update open sections based on current path
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

  // Check if a menu item is active
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(path);
  };
  
  // Style for active icon
  const activeIconClass = "text-primary transition-all duration-200 ease-in-out transform scale-110";
  
  // Style for inactive icon
  const inactiveIconClass = "text-muted-foreground transition-all duration-200 ease-in-out";
  
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
                              "h-5 w-5 mr-2",
                              isActive(item.path) ? activeIconClass : inactiveIconClass,
                              "group-hover:scale-110 group-hover:text-primary/80"
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
                                  "h-4 w-4",
                                  location.pathname === subItem.path ? activeIconClass : inactiveIconClass,
                                  "group-hover:scale-110 group-hover:text-primary/80"
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
                        "h-5 w-5",
                        location.pathname === item.path ? activeIconClass : inactiveIconClass,
                        "group-hover:scale-110 group-hover:text-primary/80",
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
