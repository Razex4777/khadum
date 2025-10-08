import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import AdminLogin from "./pages/administrator/AdminLogin";
import AdminDashboard from "./pages/administrator/AdminDashboard";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Profile from "./pages/dashboard/Profile";
import Projects from "./pages/dashboard/Projects";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/authentication/login" element={<Login />} />
          <Route path="/authentication/register" element={<Register />} />
          
          {/* Dashboard Routes with Nested Sidebar Layout */}
          <Route path="/dashboard" element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="projects" element={<Projects />} />
          </Route>
          
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/administrator" element={<AdminDashboard />} />
          
          {/* Redirect all unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;