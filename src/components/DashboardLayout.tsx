
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

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary">{pageName}</h1>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className={cn("container mx-auto px-4 py-8", className)}>
          {children}
        </main>
      </div>
    </SidebarLayout>
  );
};

export default DashboardLayout;
