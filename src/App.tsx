
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import Stores from "./pages/Stores";
import NotFound from "./pages/NotFound";
import BillingStep from "./pages/steps/BillingStep";
import DomainStep from "./pages/steps/DomainStep";
import GatewayStep from "./pages/steps/GatewayStep";
import ShippingStep from "./pages/steps/ShippingStep";
import ShopifyStep from "./pages/steps/ShopifyStep";
import TodasVendas from "./pages/vendas/TodasVendas";
import DetalheVenda from "./pages/vendas/DetalheVenda";
import CarrinhosAbandonados from "./pages/vendas/CarrinhosAbandonados";
import DetalheCarrinhoAbandonado from "./pages/vendas/DetalheCarrinhoAbandonado";
import { ActivationStepsProvider } from "./contexts/ActivationStepsContextWithStores";
import { StoreProvider } from "./contexts/StoreContext";
import { ThemeProvider } from "./providers/ThemeProvider";

const App: React.FC = () => {
  // Create a new QueryClient instance for each render to avoid shared state issues
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <TooltipProvider>
          <StoreProvider>
            <ActivationStepsProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Navigate to="/pagina-inicial" replace />} />
                  <Route path="/pagina-inicial" element={<HomePage />} />
                  <Route path="/lojas" element={<Stores />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/vendas/todas" element={<TodasVendas />} />
                  <Route path="/vendas/detalhe/:id" element={<DetalheVenda />} />
                  <Route path="/vendas/abandonados" element={<CarrinhosAbandonados />} />
                  <Route path="/vendas/abandonados/detalhe/:id" element={<DetalheCarrinhoAbandonado />} />
                  <Route path="/steps/billing" element={<BillingStep />} />
                  <Route path="/steps/domain" element={<DomainStep />} />
                  <Route path="/steps/gateway" element={<GatewayStep />} />
                  <Route path="/steps/shipping" element={<ShippingStep />} />
                  <Route path="/steps/shopify" element={<ShopifyStep />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ActivationStepsProvider>
          </StoreProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
