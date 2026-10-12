import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Index from "./pages/Index";
import CookieConsent from "./components/CookieConsent";

// The home page ships in the main bundle; every other page loads on demand
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const CasosExito = lazy(() => import("./pages/CasosExito"));
const CasoHawkers = lazy(() => import("./pages/CasoHawkers"));
const CasoDominos = lazy(() => import("./pages/CasoDominos"));
const MetodoNova = lazy(() => import("./pages/MetodoNova"));
const InvitaAmigo = lazy(() => import("./pages/InvitaAmigo"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const LegalNotice = lazy(() => import("./pages/LegalNotice"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const InstalarApp = lazy(() => import("./pages/InstalarApp"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {/* Skip motion animations for visitors who ask for reduced motion */}
          <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/casos-exito" element={<CasosExito />} />
                <Route path="/casos-exito/hawkers" element={<CasoHawkers />} />
                <Route path="/casos-exito/dominos" element={<CasoDominos />} />
                <Route path="/metodo-nova" element={<MetodoNova />} />
                <Route path="/invita-a-un-amigo" element={<InvitaAmigo />} />
                <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
                <Route path="/politica-de-cookies" element={<CookiePolicy />} />
                <Route path="/aviso-legal" element={<LegalNotice />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/instalar-app" element={<InstalarApp />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <CookieConsent />
          </BrowserRouter>
          </MotionConfig>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
