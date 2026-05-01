import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "End-to-end strategy & roadmapping",
  "Dedicated project lead + specialist team",
  "Weekly progress reviews & async updates",
  "Fixed-scope pricing, no surprises",
  "90-day post-launch support included",
  "Full IP transfer on completion",
];

const industries = [
  "Healthcare", "Finance", "E-commerce", 
  "Education", "Logistics", "SaaS"
];

export default function EngagementSection() {
  return (
    <section className="py-24 bg-[#08061A] overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Column: What you get */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-[#837FFB] font-bold text-base tracking-[0.2em] uppercase mb-5">
                What you get
              </h3>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-14 tracking-tight leading-[1.1]">
                Every engagement<br />includes
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="mt-0.5 shrink-0">
                    <div className="w-6 h-6 rounded-full border border-[#837FFB]/50 flex items-center justify-center bg-[#837FFB]/10">
                      <CheckCircle2 className="w-4 h-4 text-[#837FFB]" />
                    </div>
                  </div>
                  <p className="text-base text-white/80 leading-snug font-medium">
                    {feature}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Card */}
          <motion.div 
            className="w-full flex justify-center lg:justify-end perspective-[1200px]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div 
              className="relative w-full max-w-[500px] rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(131,127,251,0.25)] transition-transform duration-700 hover:[transform:rotateY(0deg)_rotateX(0deg)]"
              style={{
                background: "linear-gradient(145deg, #6b66f5, #4f46e5)",
                transform: "rotateY(-12deg) rotateX(8deg)",
                transformStyle: "preserve-3d"
              }}
            >
              {/* Top Striped Header */}
              <div 
                className="absolute top-0 left-0 w-full h-16 bg-black/20"
                style={{
                  backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)"
                }}
              />

              <div className="relative pt-24 pb-12 px-10">
                <h4 className="text-white/60 font-bold text-sm tracking-[0.2em] uppercase mb-4">
                  Where we play
                </h4>
                <h3 className="text-5xl text-white font-bold italic tracking-tight mb-5 drop-shadow-md">
                  Industries we serve
                </h3>
                <p className="text-white/80 text-base leading-relaxed mb-10">
                  Our services adapt to sector-specific requirements—regulatory, scale, UX—without losing speed.
                </p>

                <div className="flex flex-wrap gap-3.5 mb-12">
                  {industries.map((ind) => (
                    <div 
                      key={ind}
                      className="px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-inner text-[15px] font-medium text-white"
                    >
                      {ind}
                    </div>
                  ))}
                </div>

                <button className="bg-white text-[#4f46e5] font-bold text-sm tracking-wider uppercase px-8 py-4 rounded-full flex items-center gap-2 hover:bg-white/90 transition-colors shadow-xl">
                  Explore all industries
                  <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>

              {/* Decorative glows inside card */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute top-10 -left-10 w-40 h-40 bg-white/10 blur-2xl rounded-full pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
