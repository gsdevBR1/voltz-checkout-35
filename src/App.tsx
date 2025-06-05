
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthPage from "@/pages/AuthPage";
import Index from "./pages/Index";
import Stores from "./pages/Stores";
import Dashboard from "./pages/Dashboard";

// Admin pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import { AdminGuard } from "./components/admin/AdminGuard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStoresList from "./pages/admin/AdminStoresList";
import AdminStoreDetail from "./pages/admin/AdminStoreDetail";
import AdminUsersList from "./pages/admin/AdminUsersList";
import AdminFinanceiroGlobal from "./pages/admin/AdminFinanceiroGlobal";
import AdminNotificacoes from "./pages/admin/AdminNotificacoes";
import AdminLogsAuditoria from "./pages/admin/AdminLogsAuditoria";
import AdminConfiguracoesGerais from "./pages/admin/AdminConfiguracoesGerais";

// Regular app pages
import ListaProdutos from "./pages/produtos/ListaProdutos";
import VerProduto from "./pages/produtos/VerProduto";
import EditarProduto from "./pages/produtos/EditarProduto";
import EditarProdutoFisico from "./pages/produtos/EditarProdutoFisico";
import NovoProdutoDigital from "./pages/produtos/NovoProdutoDigital";
import NovoProdutoFisico from "./pages/produtos/NovoProdutoFisico";
import NovoFisico from "./pages/produtos/NovoFisico";
import ClonadorShopifyPage from "./pages/produtos/ClonadorShopifyPage";

// Marketing pages
import CuponsPage from "./pages/marketing/CuponsPage";
import CriarCupomPage from "./pages/marketing/CriarCupomPage";
import OrderBumpsPage from "./pages/marketing/OrderBumpsPage";
import CriarOrderBumpPage from "./pages/marketing/CriarOrderBumpPage";
import EditarOrderBumpPage from "./pages/marketing/EditarOrderBumpPage";
import UpsellOnePage from "./pages/marketing/UpsellOnePage";
import CriarUpsellPage from "./pages/marketing/CriarUpsellPage";
import UpsellDisplay from "./pages/marketing/UpsellDisplay";
import UpsellPreviewPage from "./pages/marketing/UpsellPreviewPage";
import CrossSellPage from "./pages/marketing/CrossSellPage";
import CriarCrossSellPage from "./pages/marketing/CriarCrossSellPage";
import EditarCrossSellPage from "./pages/marketing/EditarCrossSellPage";
import PixelsPage from "./pages/marketing/PixelsPage";

// Sales pages
import TodasVendas from "./pages/vendas/TodasVendas";
import DetalheVenda from "./pages/vendas/DetalheVenda";
import ExtratoTransacoes from "./pages/vendas/ExtratoTransacoes";
import CarrinhosAbandonados from "./pages/vendas/CarrinhosAbandonados";
import DetalheCarrinhoAbandonado from "./pages/vendas/DetalheCarrinhoAbandonado";
import RecuperacaoVendas from "./pages/vendas/RecuperacaoVendas";
import Reembolsos from "./pages/vendas/Reembolsos";
import Estornos from "./pages/vendas/Estornos";

// Customer pages
import TodosClientes from "./pages/clientes/TodosClientes";
import ClienteDetalhes from "./pages/clientes/ClienteDetalhes";
import HistoricoCompras from "./pages/clientes/HistoricoCompras";
import Leads from "./pages/clientes/Leads";
import LeadDetalhes from "./pages/clientes/LeadDetalhes";

// Checkout pages
import PersonalizarCheckoutPage from "./pages/checkouts/PersonalizarCheckoutPage";
import GatewaysPage from "./pages/checkouts/GatewaysPage";
import ProvasSociaisPage from "./pages/checkouts/ProvasSociaisPage";
import DescontosPage from "./pages/checkouts/DescontosPage";
import RedirecionamentoPage from "./pages/checkouts/RedirecionamentoPage";
import MoedaIdiomaPage from "./pages/checkouts/MoedaIdiomaPage";

// Integration pages
import PixelsIntegrations from "./pages/integracoes/PixelsIntegrations";
import EcommerceIntegrations from "./pages/integracoes/EcommerceIntegrations";
import TrackingIntegrations from "./pages/integracoes/TrackingIntegrations";
import PixelManagementPage from "./pages/integracoes/PixelManagementPage";

// Configuration pages
import GeraisPage from "./pages/configuracoes/GeraisPage";
import DominiosPage from "./pages/configuracoes/DominiosPage";
import WebhooksPage from "./pages/configuracoes/WebhooksPage";
import LogisticaPage from "./pages/configuracoes/LogisticaPage";

// Financial pages
import FinanceiroPage from "./pages/financeiro/FinanceiroPage";
import PlanoCobrancaPage from "./pages/financeiro/PlanoCobrancaPage";

// Step pages
import BillingStep from "./pages/steps/BillingStep";
import DomainStep from "./pages/steps/DomainStep";
import GatewayStep from "./pages/steps/GatewayStep";
import ShippingStep from "./pages/steps/ShippingStep";
import ShopifyStep from "./pages/steps/ShopifyStep";

import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              } />
              <Route path="/admin/lojas" element={
                <AdminGuard>
                  <AdminStoresList />
                </AdminGuard>
              } />
              <Route path="/admin/lojas/:storeId" element={
                <AdminGuard>
                  <AdminStoreDetail />
                </AdminGuard>
              } />
              <Route path="/admin/usuarios" element={
                <AdminGuard>
                  <AdminUsersList />
                </AdminGuard>
              } />
              <Route path="/admin/financeiro" element={
                <AdminGuard>
                  <AdminFinanceiroGlobal />
                </AdminGuard>
              } />
              <Route path="/admin/notificacoes" element={
                <AdminGuard>
                  <AdminNotificacoes />
                </AdminGuard>
              } />
              <Route path="/admin/logs" element={
                <AdminGuard>
                  <AdminLogsAuditoria />
                </AdminGuard>
              } />
              <Route path="/admin/configuracoes" element={
                <AdminGuard>
                  <AdminConfiguracoesGerais />
                </AdminGuard>
              } />

              {/* Protected app routes */}
              <Route path="/stores" element={
                <ProtectedRoute>
                  <Stores />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* Product routes */}
              <Route path="/produtos" element={
                <ProtectedRoute>
                  <ListaProdutos />
                </ProtectedRoute>
              } />
              <Route path="/produtos/:id" element={
                <ProtectedRoute>
                  <VerProduto />
                </ProtectedRoute>
              } />
              <Route path="/produtos/:id/editar" element={
                <ProtectedRoute>
                  <EditarProduto />
                </ProtectedRoute>
              } />
              <Route path="/produtos/:id/editar-fisico" element={
                <ProtectedRoute>
                  <EditarProdutoFisico />
                </ProtectedRoute>
              } />
              <Route path="/produtos/novo" element={
                <ProtectedRoute>
                  <NovoProdutoDigital />
                </ProtectedRoute>
              } />
              <Route path="/produtos/novo-fisico" element={
                <ProtectedRoute>
                  <NovoProdutoFisico />
                </ProtectedRoute>
              } />
              <Route path="/produtos/fisico" element={
                <ProtectedRoute>
                  <NovoFisico />
                </ProtectedRoute>
              } />
              <Route path="/produtos/clonador-shopify" element={
                <ProtectedRoute>
                  <ClonadorShopifyPage />
                </ProtectedRoute>
              } />

              {/* Marketing routes */}
              <Route path="/marketing/cupons" element={
                <ProtectedRoute>
                  <CuponsPage />
                </ProtectedRoute>
              } />
              <Route path="/marketing/cupons/criar" element={
                <ProtectedRoute>
                  <CriarCupomPage />
                </ProtectedRoute>
              } />
              <Route path="/marketing/order-bumps" element={
                <ProtectedRoute>
                  <OrderBumpsPage />
                </ProtectedRoute>
              } />
              <Route path="/marketing/order-bumps/criar" element={
                <ProtectedRoute>
                  <CriarOrderBumpPage />
                </ProtectedRoute>
              } />
              <Route path="/marketing/order-bumps/:id/editar" element={
                <ProtectedRoute>
                  <EditarOrderBumpPage />
                </ProtectedRoute>
              } />
              <Route path="/marketing/upsells" element={
                <ProtectedRoute>
                  <UpsellOnePage />
                </ProtectedRoute>
              } />
              <Route path="/marketing/upsells/criar" element={
                <ProtectedRoute>
                  <CriarUpsellPage />
                </ProtectedRoute>
              } />
              <Route path="/marketing/upsells/:id" element={
                <ProtectedRoute>
                  <UpsellDisplay />
                </ProtectedRoute>
              } />
              <Route path="/marketing/upsells/:id/preview" element={
                <ProtectedRoute>
                  <UpsellPreviewPage />
                </ProtectedRoute>
              } />
              <Route path="/marketing/cross-sells" element={
                <ProtectedRoute>
                  <CrossSellPage />
                </ProtectedRoute>
              } />
              <Route path="/marketing/cross-sells/criar" element={
                <ProtectedRoute>
                  <CriarCrossSellPage />
                </ProtectedRoute>
              } />
              <Route path="/marketing/cross-sells/:id/editar" element={
                <ProtectedRoute>
                  <EditarCrossSellPage />
                </ProtectedRoute>
              } />
              <Route path="/marketing/pixels" element={
                <ProtectedRoute>
                  <PixelsPage />
                </ProtectedRoute>
              } />

              {/* Sales routes */}
              <Route path="/vendas" element={
                <ProtectedRoute>
                  <TodasVendas />
                </ProtectedRoute>
              } />
              <Route path="/vendas/:id" element={
                <ProtectedRoute>
                  <DetalheVenda />
                </ProtectedRoute>
              } />
              <Route path="/vendas/extrato-transacoes" element={
                <ProtectedRoute>
                  <ExtratoTransacoes />
                </ProtectedRoute>
              } />
              <Route path="/vendas/carrinhos-abandonados" element={
                <ProtectedRoute>
                  <CarrinhosAbandonados />
                </ProtectedRoute>
              } />
              <Route path="/vendas/carrinhos-abandonados/:id" element={
                <ProtectedRoute>
                  <DetalheCarrinhoAbandonado />
                </ProtectedRoute>
              } />
              <Route path="/vendas/recuperacao" element={
                <ProtectedRoute>
                  <RecuperacaoVendas />
                </ProtectedRoute>
              } />
              <Route path="/vendas/reembolsos" element={
                <ProtectedRoute>
                  <Reembolsos />
                </ProtectedRoute>
              } />
              <Route path="/vendas/estornos" element={
                <ProtectedRoute>
                  <Estornos />
                </ProtectedRoute>
              } />

              {/* Customer routes */}
              <Route path="/clientes" element={
                <ProtectedRoute>
                  <TodosClientes />
                </ProtectedRoute>
              } />
              <Route path="/clientes/:id" element={
                <ProtectedRoute>
                  <ClienteDetalhes />
                </ProtectedRoute>
              } />
              <Route path="/clientes/:id/historico" element={
                <ProtectedRoute>
                  <HistoricoCompras />
                </ProtectedRoute>
              } />
              <Route path="/leads" element={
                <ProtectedRoute>
                  <Leads />
                </ProtectedRoute>
              } />
              <Route path="/leads/:id" element={
                <ProtectedRoute>
                  <LeadDetalhes />
                </ProtectedRoute>
              } />

              {/* Checkout routes */}
              <Route path="/checkouts/personalizar" element={
                <ProtectedRoute>
                  <PersonalizarCheckoutPage />
                </ProtectedRoute>
              } />
              <Route path="/checkouts/gateways" element={
                <ProtectedRoute>
                  <GatewaysPage />
                </ProtectedRoute>
              } />
              <Route path="/checkouts/provas-sociais" element={
                <ProtectedRoute>
                  <ProvasSociaisPage />
                </ProtectedRoute>
              } />
              <Route path="/checkouts/descontos" element={
                <ProtectedRoute>
                  <DescontosPage />
                </ProtectedRoute>
              } />
              <Route path="/checkouts/redirecionamento" element={
                <ProtectedRoute>
                  <RedirecionamentoPage />
                </ProtectedRoute>
              } />
              <Route path="/checkouts/moeda-idioma" element={
                <ProtectedRoute>
                  <MoedaIdiomaPage />
                </ProtectedRoute>
              } />

              {/* Integration routes */}
              <Route path="/integracoes/pixels" element={
                <ProtectedRoute>
                  <PixelsIntegrations />
                </ProtectedRoute>
              } />
              <Route path="/integracoes/ecommerce" element={
                <ProtectedRoute>
                  <EcommerceIntegrations />
                </ProtectedRoute>
              } />
              <Route path="/integracoes/trackeamento" element={
                <ProtectedRoute>
                  <TrackingIntegrations />
                </ProtectedRoute>
              } />
              <Route path="/integracoes/gerenciar-pixels" element={
                <ProtectedRoute>
                  <PixelManagementPage />
                </ProtectedRoute>
              } />

              {/* Configuration routes */}
              <Route path="/configuracoes/gerais" element={
                <ProtectedRoute>
                  <GeraisPage />
                </ProtectedRoute>
              } />
              <Route path="/configuracoes/dominios" element={
                <ProtectedRoute>
                  <DominiosPage />
                </ProtectedRoute>
              } />
              <Route path="/configuracoes/webhooks" element={
                <ProtectedRoute>
                  <WebhooksPage />
                </ProtectedRoute>
              } />
              <Route path="/configuracoes/logistica" element={
                <ProtectedRoute>
                  <LogisticaPage />
                </ProtectedRoute>
              } />

              {/* Financial routes */}
              <Route path="/financeiro" element={
                <ProtectedRoute>
                  <FinanceiroPage />
                </ProtectedRoute>
              } />
              <Route path="/financeiro/plano" element={
                <ProtectedRoute>
                  <PlanoCobrancaPage />
                </ProtectedRoute>
              } />

              {/* Step routes */}
              <Route path="/steps/billing" element={
                <ProtectedRoute>
                  <BillingStep />
                </ProtectedRoute>
              } />
              <Route path="/steps/domain" element={
                <ProtectedRoute>
                  <DomainStep />
                </ProtectedRoute>
              } />
              <Route path="/steps/gateway" element={
                <ProtectedRoute>
                  <GatewayStep />
                </ProtectedRoute>
              } />
              <Route path="/steps/shipping" element={
                <ProtectedRoute>
                  <ShippingStep />
                </ProtectedRoute>
              } />
              <Route path="/steps/shopify" element={
                <ProtectedRoute>
                  <ShopifyStep />
                </ProtectedRoute>
              } />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
