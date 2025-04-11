
import React from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { SidebarLayout } from '@/components/Sidebar';
import { useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

// Define a mapping of routes to their display names
const routeNames: Record<string, string> = {
  '/pagina-inicial': 'Página Inicial',
  '/dashboard': 'Dashboard',
  '/lojas': 'Minhas Lojas',
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
  const currentPageName = routeNames[location.pathname] || 'voltz.checkout';

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary">{currentPageName}</h1>
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
