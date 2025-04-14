
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Stores from "./pages/Stores";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersList from "./pages/admin/AdminUsersList";
import AdminStoresList from "./pages/admin/AdminStoresList";
import AdminStoreDetail from "./pages/admin/AdminStoreDetail";
import AdminFinanceiroGlobal from "./pages/admin/AdminFinanceiroGlobal";
import AdminConfiguracoesGerais from "./pages/admin/AdminConfiguracoesGerais";
import AdminLogsAuditoria from "./pages/admin/AdminLogsAuditoria";
import AdminNotificacoes from "./pages/admin/AdminNotificacoes";
import AdminReportsExports from "./pages/admin/AdminReportsExports";
import { StoreProvider } from "./contexts/StoreContext";

function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pagina-inicial" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lojas" element={<Stores />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="usuarios" element={<AdminUsersList />} />
            <Route path="lojas" element={<AdminStoresList />} />
            <Route path="lojas/:id" element={<AdminStoreDetail />} />
            <Route path="financeiro" element={<AdminFinanceiroGlobal />} />
            <Route path="configuracoes" element={<AdminConfiguracoesGerais />} />
            <Route path="auditoria" element={<AdminLogsAuditoria />} />
            <Route path="notificacoes" element={<AdminNotificacoes />} />
            <Route path="relatorios" element={<AdminReportsExports />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </StoreProvider>
    </ThemeProvider>
  );
}

export default App;
