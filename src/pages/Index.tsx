import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HomeOverview from "@/components/HomeOverview";
import HomeDetailsSection from "@/components/HomeDetailsSection";
import ClientsSection from "@/components/ClientsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";

export default function Index() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Check if splash has been shown in this session
    const hasShownSplash = sessionStorage.getItem("dgion-splash-shown");
    if (!hasShownSplash) {
      setShowSplash(true);
      sessionStorage.setItem("dgion-splash-shown", "true");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <Navbar />
      <HeroSection />
      <HomeOverview />
      <HomeDetailsSection />
      <ClientsSection />
      <CTASection />
      <Footer />
    </div>
  );
}