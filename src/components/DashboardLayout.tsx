
import React from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  className,
}) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">voltz.checkout</h1>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className={cn("container mx-auto px-4 py-8", className)}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
