
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./providers/ThemeProvider";

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
import ExtratoTransacoes from "./pages/vendas/ExtratoTransacoes";
import DetalheVenda from "./pages/vendas/DetalheVenda";
import CarrinhosAbandonados from "./pages/vendas/CarrinhosAbandonados";
import DetalheCarrinhoAbandonado from "./pages/vendas/DetalheCarrinhoAbandonado";
import RecuperacaoVendas from "./pages/vendas/RecuperacaoVendas";
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
import ClonadorShopifyPage from "./pages/produtos/ClonadorShopifyPage";
import DescontosPage from "./pages/checkouts/DescontosPage";
import PersonalizarCheckoutPage from "./pages/checkouts/PersonalizarCheckoutPage";
import ProvasSociaisPage from "./pages/checkouts/ProvasSociaisPage";
import GatewaysPage from "./pages/checkouts/GatewaysPage";
import RedirecionamentoPage from "./pages/checkouts/RedirecionamentoPage";
import MoedaIdiomaPage from "./pages/checkouts/MoedaIdiomaPage";

import UpsellOnePage from "./pages/marketing/UpsellOnePage";
import CriarUpsellPage from "./pages/marketing/CriarUpsellPage";
import UpsellDisplay from "./pages/marketing/UpsellDisplay";
import OrderBumpsPage from "./pages/marketing/OrderBumpsPage";
import EditarOrderBumpPage from "./pages/marketing/EditarOrderBumpPage";
import CriarOrderBumpPage from "./pages/marketing/CriarOrderBumpPage";
import CuponsPage from "./pages/marketing/CuponsPage";
import CriarCupomPage from "./pages/marketing/CriarCupomPage";
import CrossSellPage from "./pages/marketing/CrossSellPage";
import CriarCrossSellPage from "./pages/marketing/CriarCrossSellPage";
import EditarCrossSellPage from "./pages/marketing/EditarCrossSellPage";
import PixelsPage from "./pages/marketing/PixelsPage";

import FinanceiroPage from './pages/financeiro/FinanceiroPage';

import DominiosPage from "./pages/configuracoes/DominiosPage";
import LogisticaPage from "./pages/configuracoes/LogisticaPage";
import WebhooksPage from "./pages/configuracoes/WebhooksPage";
import GeraisPage from "./pages/configuracoes/GeraisPage";

import { ActivationStepsProvider } from "./contexts/ActivationStepsContextWithStores";
import { StoreProvider } from "./contexts/StoreContext";

import IntegrationLayout from "./pages/integracoes/IntegrationLayout";
import EcommerceIntegrations from "./pages/integracoes/EcommerceIntegrations";
import PixelsIntegrations from "./pages/integracoes/PixelsIntegrations";
import TrackingIntegrations from "./pages/integracoes/TrackingIntegrations";
import PixelManagementPage from "./pages/integracoes/PixelManagementPage";

// Admin imports
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStoresList from "./pages/admin/AdminStoresList";
import AdminLoginPage from "./pages/admin/AdminLoginPage";

const App: React.FC = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
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
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Navigate to="/pagina-inicial" replace />} />
                  <Route path="/pagina-inicial" element={<HomePage />} />
                  <Route path="/lojas" element={<Stores />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/vendas/todas" element={<TodasVendas />} />
                  <Route path="/vendas/extrato" element={<ExtratoTransacoes />} />
                  <Route path="/vendas/detalhe/:id" element={<DetalheVenda />} />
                  <Route path="/vendas/abandonados" element={<CarrinhosAbandonados />} />
                  <Route path="/vendas/abandonados/detalhe/:id" element={<DetalheCarrinhoAbandonado />} />
                  <Route path="/vendas/recuperacao" element={<RecuperacaoVendas />} />
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
                  <Route path="/produtos/clonador-shopify" element={<ClonadorShopifyPage />} />
                  
                  <Route path="/marketing/upsell" element={<UpsellOnePage />} />
                  <Route path="/marketing/upsell/criar" element={<CriarUpsellPage />} />
                  <Route path="/marketing/upsell/criar/:productId" element={<CriarUpsellPage />} />
                  <Route path="/marketing/upsell/:id/preview" element={<UpsellDisplay />} />
                  <Route path="/marketing/upsell/display/:id" element={<UpsellDisplay />} />
                  <Route path="/marketing/upsell/editar/:id" element={<CriarUpsellPage />} />
                  
                  <Route path="/marketing/order-bumps" element={<OrderBumpsPage />} />
                  <Route path="/marketing/order-bumps/novo" element={<CriarOrderBumpPage />} />
                  <Route path="/marketing/order-bumps/:id/editar" element={<EditarOrderBumpPage />} />
                  
                  <Route path="/marketing/cross-sell" element={<CrossSellPage />} />
                  <Route path="/marketing/cross-sells/novo" element={<CriarCrossSellPage />} />
                  <Route path="/marketing/cross-sells/:id/editar" element={<EditarCrossSellPage />} />
                  
                  <Route path="/marketing/cupons" element={<CuponsPage />} />
                  <Route path="/marketing/cupons/novo" element={<CriarCupomPage />} />
                  <Route path="/marketing/pixels" element={<PixelsPage />} />
                  
                  <Route path="/checkouts/descontos" element={<DescontosPage />} />
                  <Route path="/checkouts/personalizar" element={<PersonalizarCheckoutPage />} />
                  <Route path="/checkouts/provas-sociais" element={<ProvasSociaisPage />} />
                  <Route path="/checkouts/gateways" element={<GatewaysPage />} />
                  <Route path="/checkouts/redirecionamento" element={<RedirecionamentoPage />} />
                  <Route path="/checkouts/moeda-idioma" element={<MoedaIdiomaPage />} />
                  <Route path="/steps/billing" element={<BillingStep />} />
                  <Route path="/steps/domain" element={<DomainStep />} />
                  <Route path="/steps/gateway" element={<GatewayStep />} />
                  <Route path="/steps/shipping" element={<ShippingStep />} />
                  <Route path="/steps/shopify" element={<ShopifyStep />} />
                  
                  <Route path="/financeiro" element={<FinanceiroPage />} />
                  
                  <Route path="/integracoes" element={<Navigate to="/integracoes/ecommerce" replace />} />
                  <Route path="/integracoes/ecommerce" element={<EcommerceIntegrations />} />
                  <Route path="/integracoes/pixels" element={<PixelsIntegrations />} />
                  <Route path="/integracoes/trackeamento" element={<TrackingIntegrations />} />
                  <Route path="/integracoes/:platform" element={<PixelManagementPage />} />
                  
                  <Route path="/configuracoes" element={<Navigate to="/configuracoes/gerais" replace />} />
                  <Route path="/configuracoes/gerais" element={<GeraisPage />} />
                  <Route path="/configuracoes/dominios" element={<DominiosPage />} />
                  <Route path="/configuracoes/logistica" element={<LogisticaPage />} />
                  <Route path="/configuracoes/webhooks" element={<WebhooksPage />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="lojas" element={<AdminStoresList />} />
                    {/* Redirect any other admin paths back to dashboard */}
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Route>
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </BrowserRouter>
            </ActivationStepsProvider>
          </StoreProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
