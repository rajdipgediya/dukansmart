import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Inventory from "./pages/Inventory";
import Credit from "./pages/Credit";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import FastSale from "./pages/FastSale";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ShopProducts from "./pages/ShopProducts";
import DailySummary from "./pages/DailySummary";
import Expenses from "./pages/Expenses";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, isSuperAdmin } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (isSuperAdmin) {
    return (
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<SuperAdminDashboard />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // Shopkeeper routes
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/products" element={<ShopProducts />} />
        <Route path="/credit" element={<Credit />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/daily-summary" element={<DailySummary />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="/fast-sale" element={<FastSale />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
