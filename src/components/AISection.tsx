import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Zap, Network, Cpu, ArrowUpRight } from "lucide-react";

const features = [
  { id: 0, icon: Bot,     title: "LLM Integration",        number: "01", desc: "Deploy custom language models tailored to your domain and workflows for smarter automation." },
  { id: 1, icon: Zap,     title: "Intelligent Automation",  number: "02", desc: "Automate repetitive processes with AI-driven decision engines that learn and adapt over time." },
  { id: 2, icon: Network, title: "Neural Networks",         number: "03", desc: "Deep learning solutions for complex pattern recognition, prediction, and data analysis at scale." },
  { id: 3, icon: Cpu,     title: "Edge AI",                 number: "04", desc: "Run AI models at the edge for real-time, low-latency applications across devices and platforms." },
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function CyberCard({ children, onClick, delay = 0 }: {
  children: React.ReactNode; onClick: () => void; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -14, y: ((e.clientX - r.left) / r.width - 0.5) * 14 });
  }, []);

  return (
    <motion.div
      ref={ref}
      className="cursor-pointer select-none"
      style={{ perspective: "800px" }}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease, delay }}
    >
      <div
        className="rounded-[20px] relative overflow-hidden h-full"
        style={{
          background: "linear-gradient(45deg, #1a1a2e, #16213e)",
          borderWidth: 2, borderStyle: "solid",
          borderColor: `rgba(131,127,251,${hovered ? 0.5 : 0.15})`,
          boxShadow: hovered
            ? "0 0 30px rgba(131,127,251,0.25), inset 0 0 20px rgba(0,0,0,0.3)"
            : "0 0 20px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.2)",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.125s ease-in-out, border-color 0.3s, box-shadow 0.3s, filter 0.3s",
          filter: hovered ? "brightness(1.1)" : "brightness(1)",
        }}
      >
        <div className="absolute pointer-events-none" style={{ width: "150%", height: "150%", left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(131,127,251,0.1) 0%, transparent 60%)", filter: "blur(20px)", opacity: hovered ? 0.8 : 0, transition: "opacity 0.3s" }} />
        <div className="absolute inset-0 rounded-[20px] pointer-events-none" style={{ background: "linear-gradient(125deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, rgba(255,255,255,0) 100%)", opacity: hovered ? 1 : 0, transition: "opacity 0.3s" }} />
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
}

export default function AISection() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const toggle = (id: number) => setActiveId((p) => (p === id ? null : id));
  const active = activeId !== null ? features.find((f) => f.id === activeId) : null;
  const inactive = activeId !== null ? features.filter((f) => f.id !== activeId) : [];

  useEffect(() => {
    if (activeId === null) return;
    const t = setTimeout(() => setActiveId(null), 6000);
    return () => clearTimeout(t);
  }, [activeId]);

  return (
    <section
      className="relative overflow-hidden py-28"
      style={{ background: "linear-gradient(160deg, #0B0F2A 0%, #141A42 30%, #1A1F4F 60%, #0B0F2A 100%)" }}
    >
      {/* bg shapes */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div animate={{ rotate: [8, 16, 8], y: [-10, 10, -10] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", top: "-15%", right: "-15%", width: "80%", height: "130%", borderRadius: "30% 70% 55% 45% / 45% 30% 70% 55%", background: "linear-gradient(240deg, #2563A8 0%, #1E5290 25%, #174076 50%, #102E58 100%)", opacity: 0.7 }} />
        <motion.div animate={{ rotate: [-12, -5, -12], x: [-8, 12, -8] }} transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 2 }} style={{ position: "absolute", top: "10%", left: "-25%", width: "65%", height: "90%", borderRadius: "55% 45% 40% 60% / 50% 55% 45% 50%", background: "linear-gradient(150deg, #1E5694 0%, #174580 35%, #10345F 70%, #0B2442 100%)", opacity: 0.6 }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
        {/* header */}
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
          <span className="text-[#837FFB] text-sm font-bold tracking-[0.3em] uppercase">AI-Powered</span>
          <h2 className="mt-4 text-white text-4xl md:text-5xl font-bold">
            Artificial <span className="text-[#837FFB] drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]">Intelligence</span>
          </h2>
          <p className="text-white/40 text-lg mt-4 max-w-2xl mx-auto">Harness the power of AI to unlock insights, automate operations, and build intelligent products.</p>
        </motion.div>

        {/* cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId ?? "grid"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease }}
            style={{ minHeight: 400 }}
          >
            {/* DEFAULT: 4 square cards */}
            {activeId === null && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {features.map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <CyberCard key={feat.id} onClick={() => toggle(feat.id)} delay={i * 0.08}>
                      <div className="p-7 flex flex-col" style={{ minHeight: 320 }}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(131,127,251,0.1)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(131,127,251,0.25)" }}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[#837FFB]/25 text-4xl font-bold mt-3 leading-none">{feat.number}</span>
                        <h3 className="text-white font-bold text-base uppercase tracking-wide leading-tight mt-auto">{feat.title}</h3>
                        <p className="text-white/30 text-xs leading-relaxed mt-2 line-clamp-2">{feat.desc}</p>
                        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: "rgba(255,255,255,0.06)" }}>
                          <span className="text-[#837FFB] text-xs font-bold uppercase tracking-wider">Learn More</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#837FFB]" />
                        </div>
                      </div>
                    </CyberCard>
                  );
                })}
              </div>
            )}

            {/* ACTIVE: expanded + row */}
            {active && (
              <div className="flex flex-col gap-5">
                <CyberCard onClick={() => toggle(active.id)}>
                  <div className="p-8 md:p-10 flex flex-col md:flex-row gap-6" style={{ minHeight: 250 }}>
                    <div className="flex flex-col flex-1">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(131,127,251,0.1)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(131,127,251,0.25)" }}>
                        {(() => { const Icon = active.icon; return <Icon className="w-7 h-7 text-white" />; })()}
                      </div>
                      <h3 className="text-white font-bold text-2xl md:text-3xl uppercase tracking-wide leading-tight">{active.title}</h3>
                      <span className="text-[#837FFB]/40 text-xs font-bold mt-2">{active.number}</span>
                    </div>
                    <motion.div className="flex-1 flex flex-col justify-center" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease, delay: 0.12 }}>
                      <p className="text-white/60 text-base leading-relaxed">{active.desc}</p>
                      <motion.button
                        className="mt-6 self-start inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white"
                        style={{ background: "rgba(131,127,251,0.15)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(131,127,251,0.35)" }}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(131,127,251,0.3)" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Get Started <ArrowUpRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  </div>
                </CyberCard>

                <div className="grid grid-cols-3 gap-4">
                  {inactive.map((feat) => {
                    const Icon = feat.icon;
                    return (
                      <CyberCard key={feat.id} onClick={() => toggle(feat.id)}>
                        <div className="p-5 flex flex-col" style={{ height: 160 }}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(131,127,251,0.1)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(131,127,251,0.2)" }}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[#837FFB]/30 text-2xl font-bold leading-none">{feat.number}</span>
                          </div>
                          <h4 className="text-white font-bold text-sm uppercase tracking-wide leading-tight">{feat.title}</h4>
                          <p className="text-white/30 text-[11px] leading-relaxed mt-2 line-clamp-2">{feat.desc}</p>
                        </div>
                      </CyberCard>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.p className="text-center text-white/15 text-xs mt-10 select-none" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.8 }}>
          Click any card to expand
        </motion.p>
      </div>
    </section>
  );
}