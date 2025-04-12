
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, BarChart, RefreshCw } from 'lucide-react';

interface IntegrationLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const IntegrationLayout: React.FC<IntegrationLayoutProps> = ({
  title,
  description,
  children
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine which tab is active based on the current path
  const getActiveTab = () => {
    if (currentPath.includes('/ecommerce')) return 'ecommerce';
    if (currentPath.includes('/pixels')) return 'pixels';
    if (currentPath.includes('/trackeamento')) return 'tracking';
    return 'ecommerce'; // Default
  };
  
  const handleTabChange = (value: string) => {
    switch (value) {
      case 'ecommerce':
        navigate('/integracoes/ecommerce');
        break;
      case 'pixels':
        navigate('/integracoes/pixels');
        break;
      case 'tracking':
        navigate('/integracoes/trackeamento');
        break;
      default:
        navigate('/integracoes/ecommerce');
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        
        <Tabs 
          defaultValue={getActiveTab()} 
          value={getActiveTab()}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 sm:w-[400px]">
            <TabsTrigger value="ecommerce" className="flex gap-2 items-center">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">E-commerce</span>
            </TabsTrigger>
            <TabsTrigger value="pixels" className="flex gap-2 items-center">
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">Pixels</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex gap-2 items-center">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Trackeamento</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={getActiveTab()} className="pt-6">
            {children}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default IntegrationLayout;
