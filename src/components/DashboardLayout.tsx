import React from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { SidebarLayout } from '@/components/Sidebar';
import { useLocation, useParams } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

// Define a mapping of routes to their display names
const routeNames: Record<string, string> = {
  '/pagina-inicial': 'Página Inicial',
  '/dashboard': 'Dashboard',
  '/lojas': 'Minhas Lojas',
  '/vendas/todas': 'Todas as Vendas',
  '/vendas/abandonados': 'Carrinhos Abandonados',
  '/clientes/todos': 'Todos os Clientes',
  '/clientes/leads': 'Leads',
  '/steps/billing': 'Faturamento',
  '/steps/domain': 'Domínio',
  '/steps/gateway': 'Gateway',
  '/steps/shipping': 'Frete',
  '/steps/shopify': 'Integração Shopify'
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  className,
}) => {
  const location = useLocation();
  const params = useParams();
  
  // Handle dynamic routes like cliente/perfil/:id
  let pageName = routeNames[location.pathname] || 'voltz.checkout';
  
  // Special case for customer profile pages
  if (location.pathname.startsWith('/clientes/perfil/') && params.id) {
    pageName = 'Perfil do Cliente';
  }
  
  // Special case for lead profile pages
  if (location.pathname.startsWith('/clientes/leads/perfil/') && params.id) {
    pageName = 'Perfil do Lead';
  }
  
  // Special case for purchase history
  if (location.pathname.startsWith('/clientes/historico/') && params.id) {
    pageName = 'Histórico de Compras';
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background relative">
        <main className={cn("container mx-auto px-4 py-8", className)}>
          {children}
        </main>
        <div className="fixed bottom-6 right-6 z-50">
          <ThemeToggle />
        </div>
      </div>
    </SidebarLayout>
  );
};

export default DashboardLayout;
