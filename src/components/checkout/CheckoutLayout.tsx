
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CheckoutLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({ 
  children, 
  title,
  description 
}) => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        <Separator />
        <div className="grid gap-6">
          {children}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckoutLayout;
