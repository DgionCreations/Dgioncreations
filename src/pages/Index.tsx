import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HomeOverview from "@/components/HomeOverview";
import ClientsSection from "@/components/ClientsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HomeOverview />
      <ClientsSection />
      <CTASection />
      <Footer />
    </div>
  );
}