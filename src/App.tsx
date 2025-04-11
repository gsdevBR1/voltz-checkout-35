
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Stores from "./pages/Stores";
import NotFound from "./pages/NotFound";
import BillingStep from "./pages/steps/BillingStep";
import DomainStep from "./pages/steps/DomainStep";
import GatewayStep from "./pages/steps/GatewayStep";
import ShippingStep from "./pages/steps/ShippingStep";
import { ActivationStepsProvider } from "./contexts/ActivationStepsContextWithStores";
import { StoreProvider } from "./contexts/StoreContext";
import { ThemeProvider } from "./providers/ThemeProvider";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    },
  },
});

const App: React.FC = () => {
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
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/stores" element={<Stores />} />
                  <Route path="/steps/billing" element={<BillingStep />} />
                  <Route path="/steps/domain" element={<DomainStep />} />
                  <Route path="/steps/gateway" element={<GatewayStep />} />
                  <Route path="/steps/shipping" element={<ShippingStep />} />
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
