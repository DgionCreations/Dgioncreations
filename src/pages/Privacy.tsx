import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function Privacy() {
  const lastUpdated = "May 1, 2026";

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <main className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-16 h-16 rounded-2xl bg-[#837FFB]/10 border border-[#837FFB]/20 flex items-center justify-center mb-8"
            >
              <Shield className="w-8 h-8 text-[#837FFB]" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold font-display mb-6"
              style={{ fontFamily: "the-seasons" }}
            >
              Privacy <span className="text-[#837FFB]">Policy</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs"
            >
              Last Updated: {lastUpdated}
            </motion.p>
          </div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert prose-purple max-w-none space-y-12"
          >
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><FileText className="w-4 h-4 text-[#837FFB]" /></div>
                1. Data Collection
              </h2>
              <p className="text-white/60 leading-relaxed">
                At Dgion, we collect information that you provide directly to us when you create an account, subscribe to our newsletter, or contact us for support. This may include your name, email address, company name, and any other information you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Eye className="w-4 h-4 text-[#837FFB]" /></div>
                2. How We Use Your Data
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                We use the information we collect to provide, maintain, and improve our services, including:
              </p>
              <ul className="list-disc list-inside text-white/50 space-y-2 ml-4">
                <li>Personalising your experience on our platform</li>
                <li>Communicating with you about products and services</li>
                <li>Monitoring and analysing trends and usage</li>
                <li>Protecting the security and integrity of our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Lock className="w-4 h-4 text-[#837FFB]" /></div>
                3. Information Sharing
              </h2>
              <p className="text-white/60 leading-relaxed">
                We do not share your personal information with third parties except as described in this policy. We may share information with vendors who perform services for us, or when required by law or to protect our rights.
              </p>
            </section>

            <div className="p-8 rounded-3xl bg-[#837FFB]/5 border border-[#837FFB]/10 mt-16">
              <h3 className="text-xl font-bold mb-4 text-white">Any Questions?</h3>
              <p className="text-white/50 text-sm mb-6">
                If you have any questions about this Privacy Policy, please contact our data protection officer at:
              </p>
              <p className="font-bold text-[#837FFB]">privacy@dgion.com</p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
