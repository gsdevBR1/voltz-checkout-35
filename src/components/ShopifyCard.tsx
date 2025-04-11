
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useActivationSteps } from '@/contexts/ActivationStepsContextWithStores';
import { useStores } from '@/contexts/StoreContext';

const ShopifyCard = () => {
  const navigate = useNavigate();
  const { steps } = useActivationSteps();
  const { currentStore } = useStores();
  
  // Check connection status from both contexts
  const shopifyStep = steps.find(step => step.id === 'shopify');
  const isConnected = shopifyStep?.isCompleted || (currentStore?.shopifyIntegration?.connected || false);

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      isConnected && "border-success/30 bg-success/5 dark:bg-success/10 dark:border-success/20"
    )}>
      <CardHeader className="pb-3 relative">
        <Badge variant="outline" className="absolute top-2 right-2 bg-[#F1F0FB] text-[#8E9196] border-none">
          Opcional
        </Badge>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#9b87f5]" />
            Integração com Shopify
          </CardTitle>
          <div>
            {isConnected ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600" />
            )}
          </div>
        </div>
        <CardDescription className="mt-2">
          Sincronize seus produtos e tema diretamente com a Shopify.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex items-center space-x-3 text-muted-foreground">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-sm">
            {isConnected ? (
              currentStore?.shopifyIntegration?.shopUrl || 'Conectado'
            ) : (
              'Desconectado'
            )}
          </span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant={isConnected ? "outline" : "default"} 
          className={cn(
            "w-full",
            isConnected && "border-success text-success hover:bg-success/10 dark:hover:bg-success/20"
          )}
          onClick={() => navigate('/steps/shopify')}
        >
          <span>{isConnected ? 'Revisar Shopify' : 'Configurar Shopify'}</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShopifyCard;
