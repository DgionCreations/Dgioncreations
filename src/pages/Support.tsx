import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageSquare, Mail, Phone, Clock, FileText, ChevronRight } from "lucide-react";

const HELP_CATEGORIES = [
  { icon: FileText, title: "Documentation", desc: "Browse our guides and tutorials for all Dgion products." },
  { icon: MessageSquare, title: "Community", desc: "Connect with other founders and share your experiences." },
  { icon: Mail, title: "Email Support", desc: "Get in touch with our experts for complex inquiries." },
];

const FAQS = [
  { q: "How do I get started with a new project?", a: "The best way to start is by filling out our Discovery form or reaching out to hello@dgion.com. We'll set up a 15-minute call to discuss your goals." },
  { q: "What is your typical turnaround time?", a: "Standard projects usually take 8-16 weeks. We work in 2-week sprints with clear milestones and demo days." },
  { q: "Do you offer post-launch support?", a: "Yes, we provide managed support retainers that include bug fixes, security updates, and performance optimization." },
  { q: "Where can I find my project billing?", a: "All billing and invoices are managed through our secure client portal. You can access it using your project credentials." }
];

export default function Support() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <main className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-24">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold font-display"
              style={{ fontFamily: "the-seasons" }}
            >
              How can we <span className="text-[#837FFB]">help?</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8 text-white/50 text-xl max-w-2xl mx-auto"
            >
              We're here to ensure your digital experience is flawless. Search our resources or get in touch with our team.
            </motion.p>
          </div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-24 relative"
          >
            <input 
              type="text" 
              placeholder="Search for articles, guides, or help..." 
              className="w-full px-8 py-6 rounded-[30px] bg-white/5 border border-white/10 text-lg outline-none focus:border-[#837FFB] transition-colors pl-16"
            />
            <div className="absolute left-6 top-1/2 -translate-y-1/2">
              <MessageSquare className="w-6 h-6 text-white/20" />
            </div>
          </motion.div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {HELP_CATEGORIES.map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="p-10 rounded-[35px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#837FFB]/10 border border-[#837FFB]/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <cat.icon className="w-6 h-6 text-[#837FFB]" />
                </div>
                <h3 className="text-xl font-bold mb-4">{cat.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  {cat.desc}
                </p>
                <div className="flex items-center gap-2 text-[#837FFB] font-bold text-sm uppercase tracking-widest">
                  Browse <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQs */}
          <div className="max-w-4xl mx-auto mb-32">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-3xl bg-white/2 border border-white/5"
                >
                  <h4 className="text-lg font-bold mb-3">{faq.q}</h4>
                  <p className="text-white/40 leading-relaxed text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1B144A] to-[#08061A] border border-white/10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#837FFB]/20 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-[#837FFB]" />
              </div>
              <div>
                <p className="text-white/40 text-sm uppercase tracking-widest font-bold">Email Us</p>
                <p className="text-xl font-bold mt-1">support@dgion.com</p>
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#1B144A] to-[#08061A] border border-white/10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#837FFB]/20 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-[#837FFB]" />
              </div>
              <div>
                <p className="text-white/40 text-sm uppercase tracking-widest font-bold">Call Us</p>
                <p className="text-xl font-bold mt-1">+91 9100600458</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
