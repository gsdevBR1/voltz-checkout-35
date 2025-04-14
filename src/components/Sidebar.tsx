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
  UserX,
  Package,
  CreditCard,
  Palette,
  MessageSquare,
  Link as LinkIcon,
  ArrowRight,
  Percent,
  Megaphone,
  MousePointer,
  Tag,
  RefreshCw,
  BarChart,
  Copy,
  Flame,
  Plug,
  Settings,
  Globe,
  Truck,
  Webhook,
  Store,
  Languages,
  LifeBuoy,
  DollarSign,
  Receipt
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
import { useTheme } from '@/providers/ThemeProvider';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  className?: string;
}

export const AppSidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const { state } = useSidebar();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
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
        },
        {
          title: 'Extrato de Transações',
          path: '/vendas/extrato',
          icon: FileText,
        },
        {
          title: 'Recuperação de Vendas',
          path: '/vendas/recuperacao',
          icon: LifeBuoy,
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
      title: 'Produtos',
      path: '/produtos',
      icon: Package,
      subItems: [
        {
          title: 'Ver Todos',
          path: '/produtos', 
          icon: Package,
        },
        {
          title: 'Clonador Loja Shopify',
          path: '/produtos/clonador-shopify',
          icon: Copy,
        }
      ]
    },
    {
      title: 'Marketing',
      path: '/marketing',
      icon: Megaphone,
      subItems: [
        {
          title: 'Upsell One Click',
          path: '/marketing/upsell',
          icon: MousePointer,
        },
        {
          title: 'Order Bumps',
          path: '/marketing/order-bumps',
          icon: ShoppingBag,
        },
        {
          title: 'Cupons de Desconto',
          path: '/marketing/cupons',
          icon: Tag,
        },
        {
          title: 'Cross-Sell',
          path: '/marketing/cross-sell',
          icon: RefreshCw,
        },
        {
          title: 'Pixels',
          path: '/marketing/pixels',
          icon: BarChart,
        }
      ]
    },
    {
      title: 'Checkouts',
      path: '/checkouts',
      icon: CreditCard,
      subItems: [
        {
          title: 'Descontos por Pagamento',
          path: '/checkouts/descontos',
          icon: Percent,
        },
        {
          title: 'Personalizar Checkout',
          path: '/checkouts/personalizar',
          icon: Palette,
        },
        {
          title: 'Provas Sociais',
          path: '/checkouts/provas-sociais',
          icon: MessageSquare,
        },
        {
          title: 'Moeda e Idioma',
          path: '/checkouts/moeda-idioma',
          icon: Languages,
        },
        {
          title: 'Gateways',
          path: '/checkouts/gateways',
          icon: LinkIcon,
        },
        {
          title: 'Redirecionamento',
          path: '/checkouts/redirecionamento',
          icon: ArrowRight,
        }
      ]
    },
    {
      title: 'Integrações',
      path: '/integracoes',
      icon: Plug,
      subItems: [
        {
          title: 'E-commerce',
          path: '/integracoes/ecommerce',
          icon: ShoppingBag,
        },
        {
          title: 'Pixels',
          path: '/integracoes/pixels',
          icon: BarChart,
        },
        {
          title: 'Trackeamento',
          path: '/integracoes/trackeamento',
          icon: RefreshCw,
        }
      ]
    },
    {
      title: 'Configurações',
      path: '/configuracoes',
      icon: Settings,
      subItems: [
        {
          title: 'Gerais',
          path: '/configuracoes/gerais',
          icon: Store,
        },
        {
          title: 'Domínios',
          path: '/configuracoes/dominios',
          icon: Globe,
        },
        {
          title: 'Logística',
          path: '/configuracoes/logistica',
          icon: Truck,
        },
        {
          title: 'Webhooks',
          path: '/configuracoes/webhooks',
          icon: Webhook,
        }
      ]
    },
    {
      title: 'Financeiro',
      path: '/financeiro',
      icon: DollarSign,
    },
    {
      title: 'Plano e Cobrança',
      path: '/plano-cobranca',
      icon: Receipt,
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
        <div className="flex items-center justify-center w-full px-4 py-6">
          <Link to="/" className="flex items-center justify-center w-full h-full">
            {isDarkMode ? (
              <img 
                src="/lovable-uploads/6e7ee63b-0326-4a37-bc3f-0e31d8324441.png" 
                alt="Voltz.Checkout Logo (Dark Mode)" 
                className="w-full h-full object-contain"
              />
            ) : (
              <img 
                src="/lovable-uploads/3aa07f77-7311-4155-8e6c-39abb8dca3df.png" 
                alt="Voltz.Checkout Logo" 
                className="w-full h-full object-contain"
              />
            )}
          </Link>
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
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 min-w-0 mr-2">
            <StoreSelector />
          </div>
          <Avatar className="h-9 w-9 flex-shrink-0">
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
