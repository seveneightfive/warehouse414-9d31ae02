import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import DesignerDetail from "./pages/DesignerDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminHolds from "./pages/admin/AdminHolds";
import AdminOffers from "./pages/admin/AdminOffers";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminDesigners from "./pages/admin/AdminDesigners";
import AdminMakers from "./pages/admin/AdminMakers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminStyles from "./pages/admin/AdminStyles";
import AdminPeriods from "./pages/admin/AdminPeriods";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/designer/:slug" element={<DesignerDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/holds" element={<AdminHolds />} />
            <Route path="/admin/offers" element={<AdminOffers />} />
            <Route path="/admin/inquiries" element={<AdminInquiries />} />
            <Route path="/admin/designers" element={<AdminDesigners />} />
            <Route path="/admin/makers" element={<AdminMakers />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/styles" element={<AdminStyles />} />
            <Route path="/admin/periods" element={<AdminPeriods />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
