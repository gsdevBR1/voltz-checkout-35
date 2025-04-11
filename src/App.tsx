
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import BillingStep from "./pages/steps/BillingStep";
import DomainStep from "./pages/steps/DomainStep";
import GatewayStep from "./pages/steps/GatewayStep";
import ShippingStep from "./pages/steps/ShippingStep";
import { ActivationStepsProvider } from "./contexts/ActivationStepsContext";
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
          <ActivationStepsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/steps/billing" element={<BillingStep />} />
                <Route path="/steps/domain" element={<DomainStep />} />
                <Route path="/steps/gateway" element={<GatewayStep />} />
                <Route path="/steps/shipping" element={<ShippingStep />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ActivationStepsProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
