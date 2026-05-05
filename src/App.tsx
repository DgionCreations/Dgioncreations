import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScrollProvider } from "@/lib/smooth-scroll";
import { AuthProvider } from "@/lib/auth-context";
import Index from "./pages/Index.tsx";
import Services from "./pages/Services.tsx";
import Industries from "./pages/Industries.tsx";
import Process from "./pages/Process.tsx";
import Portfolio from "./pages/Portfolio.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Reviews from "./pages/Reviews.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import ServiceDetail from "./pages/ServiceDetail.tsx";
import Blog from "./pages/Blog.tsx";
import Support from "./pages/Support.tsx";
import Privacy from "./pages/Privacy.tsx";
import ComingSoon from "./pages/ComingSoon.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/admin/Login.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import HomeEditor from "./pages/admin/HomeEditor.tsx";
import ExploreEditor from "./pages/admin/ExploreEditor.tsx";
import ClientsEditor from "./pages/admin/ClientsEditor.tsx";
import CtaEditor from "./pages/admin/CtaEditor.tsx";
import ServicesEditor from "./pages/admin/ServicesEditor.tsx";
import PortfolioEditor from "./pages/admin/PortfolioEditor.tsx";
import ProcessEditor from "./pages/admin/ProcessEditor.tsx";
import IndustriesEditor from "./pages/admin/IndustriesEditor.tsx";
import AboutEditor from "./pages/admin/AboutEditor.tsx";
import ContactEditor from "./pages/admin/ContactEditor.tsx";
import FooterEditor from "./pages/admin/FooterEditor.tsx";
import NavbarEditor from "./pages/admin/NavbarEditor.tsx";
import TestimonialsEditor from "./pages/admin/TestimonialsEditor.tsx";
import AdminUsers from "./pages/admin/Users.tsx";
import ProtectedRoute from "./pages/admin/ProtectedRoute.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AIAgent from "./components/AIAgent.tsx";

const queryClient = new QueryClient();

const AIAgentWrapper = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return <AIAgent />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* AuthProvider wraps everything — exposes the current Firebase user to
          admin pages AND to public pages (e.g. to show an "Edit" overlay later). */}
      <AuthProvider>
        <SmoothScrollProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <AIAgentWrapper />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/process" element={<Process />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/service/:id" element={<ServiceDetail />} />

              {/* Content Pages */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/case-studies" element={<ComingSoon />} />
              <Route path="/support" element={<Support />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/careers" element={<ComingSoon />} />

              {/* Admin routes — login is public, everything else requires Firebase auth */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/home" element={<HomeEditor />} />
                  <Route path="/admin/explore" element={<ExploreEditor />} />
                  <Route path="/admin/clients" element={<ClientsEditor />} />
                  <Route path="/admin/cta" element={<CtaEditor />} />
                  <Route path="/admin/services" element={<ServicesEditor />} />
                  <Route path="/admin/portfolio" element={<PortfolioEditor />} />
                  <Route path="/admin/process" element={<ProcessEditor />} />
                  <Route path="/admin/industries" element={<IndustriesEditor />} />
                  <Route path="/admin/about" element={<AboutEditor />} />
                  <Route path="/admin/contact" element={<ContactEditor />} />
                  <Route path="/admin/footer" element={<FooterEditor />} />
                  <Route path="/admin/navbar" element={<NavbarEditor />} />
                  <Route path="/admin/testimonials" element={<TestimonialsEditor />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SmoothScrollProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;