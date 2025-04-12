
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
import TodosClientes from "./pages/clientes/TodosClientes";
import Leads from "./pages/clientes/Leads";
import ClienteDetalhes from "./pages/clientes/ClienteDetalhes";
import LeadDetalhes from "./pages/clientes/LeadDetalhes";
import HistoricoCompras from "./pages/clientes/HistoricoCompras";
import ListaProdutos from "./pages/produtos/ListaProdutos";
import NovoProdutoFisico from "./pages/produtos/NovoProdutoFisico";
import NovoProdutoDigital from "./pages/produtos/NovoProdutoDigital";
import EditarProduto from "./pages/produtos/EditarProduto";
import NovoFisico from "./pages/produtos/NovoFisico";
import EditarProdutoFisico from "./pages/produtos/EditarProdutoFisico";
import VerProduto from "./pages/produtos/VerProduto";
import DescontosPage from "./pages/checkouts/DescontosPage";
import PersonalizarCheckoutPage from "./pages/checkouts/PersonalizarCheckoutPage";
import ProvasSociaisPage from "./pages/checkouts/ProvasSociaisPage";
import GatewaysPage from "./pages/checkouts/GatewaysPage";
import RedirecionamentoPage from "./pages/checkouts/RedirecionamentoPage";

// Marketing Section Pages
import UpsellOnePage from "./pages/marketing/UpsellOnePage";
import OrderBumpsPage from "./pages/marketing/OrderBumpsPage";
import CuponsPage from "./pages/marketing/CuponsPage";
import CrossSellPage from "./pages/marketing/CrossSellPage";
import PixelsPage from "./pages/marketing/PixelsPage";

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
                  <Route path="/clientes/todos" element={<TodosClientes />} />
                  <Route path="/clientes/leads" element={<Leads />} />
                  <Route path="/clientes/perfil/:id" element={<ClienteDetalhes />} />
                  <Route path="/clientes/historico/:id" element={<HistoricoCompras />} />
                  <Route path="/clientes/leads/perfil/:id" element={<LeadDetalhes />} />
                  <Route path="/produtos" element={<ListaProdutos />} />
                  <Route path="/produtos/novo/fisico" element={<NovoProdutoFisico />} />
                  <Route path="/produtos/novo-fisico" element={<NovoFisico />} />
                  <Route path="/produtos/novo/digital" element={<NovoProdutoDigital />} />
                  <Route path="/produtos/novo-digital" element={<NovoProdutoDigital />} />
                  <Route path="/produtos/editar/:id" element={<EditarProduto />} />
                  <Route path="/produtos/:id/editar" element={<EditarProdutoFisico />} />
                  <Route path="/produtos/:id/ver" element={<VerProduto />} />
                  
                  {/* Marketing Section Routes */}
                  <Route path="/marketing/upsell" element={<UpsellOnePage />} />
                  <Route path="/marketing/order-bumps" element={<OrderBumpsPage />} />
                  <Route path="/marketing/cupons" element={<CuponsPage />} />
                  <Route path="/marketing/cross-sell" element={<CrossSellPage />} />
                  <Route path="/marketing/pixels" element={<PixelsPage />} />
                  
                  <Route path="/checkouts/descontos" element={<DescontosPage />} />
                  <Route path="/checkouts/personalizar" element={<PersonalizarCheckoutPage />} />
                  <Route path="/checkouts/provas-sociais" element={<ProvasSociaisPage />} />
                  <Route path="/checkouts/gateways" element={<GatewaysPage />} />
                  <Route path="/checkouts/redirecionamento" element={<RedirecionamentoPage />} />
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
