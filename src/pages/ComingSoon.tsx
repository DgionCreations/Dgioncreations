import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Rocket } from "lucide-react";

export default function ComingSoon() {
  const location = useLocation();
  const pageName = location.pathname.split("/").pop()?.replace(/-/g, " ") || "Page";
  
  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden py-32">
        {/* Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-[#837FFB]/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex justify-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-[#837FFB]/10 border border-[#837FFB]/20 flex items-center justify-center">
              <Rocket className="w-10 h-10 text-[#837FFB]" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold font-display mb-6 capitalize"
            style={{ fontFamily: "the-seasons" }}
          >
            {pageName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-white/50 mb-12 leading-relaxed"
          >
            We're currently architecting something incredible for our <strong>{pageName}</strong> experience. Stay tuned for a world-class reveal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link 
              to="/"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold">Return to Hub</span>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
