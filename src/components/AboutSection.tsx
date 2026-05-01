import { useRef, useEffect, useState, useLayoutEffect } from "react";
// Force cache clear
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StatCounter } from "@/components/ui/StatCounter";
import { CreativeCarousel } from "@/components/ui/CreativeCarousel";

gsap.registerPlugin(ScrollTrigger);

import { useContent } from "@/lib/use-content";
import { 
  ABOUT_CONTENT_KEY, 
  defaultAboutContent, 
  type AboutContent,
  DEFAULT_ABOUT_KICKER_STYLE,
  DEFAULT_ABOUT_TITLE_STYLE,
  DEFAULT_ABOUT_HIGHLIGHT_STYLE,
  DEFAULT_ABOUT_DESC_STYLE
} from "@/content/about";
import { textStyleToCss } from "@/content/typography";
import { MarkupText } from "@/lib/markup-text";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const SPIRAL = `M 400 30 C 500 30, 580 80, 580 160 C 580 260, 350 280, 280 350 C 200 430, 250 500, 400 520 C 560 540, 650 600, 620 700 C 590 800, 350 830, 250 900 C 140 980, 200 1060, 400 1080 C 600 1100, 700 1180, 660 1280 C 620 1380, 350 1420, 200 1480 C 50 1540, 100 1620, 350 1660 C 600 1700, 720 1780, 680 1880 C 640 1960, 400 2000, 250 2080 C 100 2160, 150 2240, 400 2280 C 650 2320, 750 2400, 700 2500 C 650 2600, 400 2640, 200 2700`;

const milestones = [
  { x: 580, y: 160,  side: "right" as const },
  { x: 280, y: 350,  side: "left"  as const },
  { x: 620, y: 700,  side: "right" as const },
  { x: 250, y: 900,  side: "left"  as const },
  { x: 660, y: 1280, side: "right" as const },
  { x: 200, y: 1480, side: "left"  as const },
  { x: 680, y: 1880, side: "right" as const },
  { x: 250, y: 2080, side: "left"  as const },
  { x: 700, y: 2500, side: "right" as const },
  { x: 200, y: 2700, side: "left"  as const },
];

const VB_W = 800;
const VB_H = 2850;

// Precompute once — where in scroll progress each milestone "lights up"
const ALL_TRIGGER_POINTS = milestones.map((m) => m.y / VB_H);

export default function AboutSection() {
  const { data } = useContent<AboutContent>(ABOUT_CONTENT_KEY, defaultAboutContent);
  const timeline = data.spiralTimeline;
  const sectionRef = useRef<HTMLElement>(null);
  const pathMainRef = useRef<SVGPathElement>(null);
  const pathTopRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(5000);
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollProgressVal, setScrollProgressVal] = useState(0);

  // Measure path length before paint to avoid a flash of "fully drawn" line
  useLayoutEffect(() => {
    if (pathMainRef.current) {
      const len = Math.ceil(pathMainRef.current.getTotalLength()) + 4;
      setPathLen(len);
    }
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    const main = pathMainRef.current;
    const top = pathTopRef.current;
    if (!el || !main || !top) return;

    // GPU-friendly hint — these attrs animate every scrub frame
    main.style.willChange = "stroke-dashoffset";
    top.style.willChange = "stroke-dashoffset";

    // Guard against stale setState calls every frame — only push when index
    // actually crosses a new milestone boundary
    const last = { idx: -1 };

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top center",
      end: "bottom center",
      scrub: 1, // follows Lenis with 1s smoothing — removes jitter
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgressVal(p);
        const off = pathLen * (1 - p);
        // gsap.set is far cheaper than setState for per-frame attribute writes
        gsap.set(main, { attr: { "stroke-dashoffset": off } });
        gsap.set(top,  { attr: { "stroke-dashoffset": off } });

        let current = -1; 
        const triggerPoints = ALL_TRIGGER_POINTS.slice(0, timeline.length);
        for (let i = 0; i < triggerPoints.length; i++) {
          // Reveal exactly when progress reaches the milestone point
          if (p >= triggerPoints[i]) current = i;
        }
        if (current !== last.idx) {
          last.idx = current;
          setActiveIdx(current);
        }
      },
    });

    return () => {
      st.kill();
      main.style.willChange = "";
      top.style.willChange = "";
    };
  }, [pathLen, timeline.length]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)",
        paddingTop: 100,
        paddingBottom: 100,
      }}
    >
      {/* Header — one-shot entrance, not scroll-tied. Framer-motion is fine here. */}
      <motion.div
        className="text-center mb-16 relative z-20 px-6"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease }}
      >
        <span 
          className="text-sm font-bold tracking-[0.3em] uppercase block text-[#837FFB]"
          style={textStyleToCss(data.sectionKickerStyle || data.heroKickerStyle, DEFAULT_ABOUT_KICKER_STYLE)}
        >
          {data.sectionKicker || "BEHIND THE SCENES"}
        </span>
        <h2 
          className="mt-3 text-white font-bold"
          style={textStyleToCss(data.sectionTitleStyle || data.heroTitleStyle, DEFAULT_ABOUT_TITLE_STYLE)}
        >
          <MarkupText 
            text={
              data.sectionTitle?.includes("**") 
                ? data.sectionTitle 
                : (data.sectionTitle || "Project").replace(/Done/g, "**Done.**")
            } 
            highlightStyle={data.sectionHighlightStyle || data.heroHighlightStyle || DEFAULT_ABOUT_HIGHLIGHT_STYLE}
            highlightClassName="drop-shadow-[0_0_25px_rgba(131,127,251,0.4)]"
          />
        </h2>
        <p 
          className="mt-4 max-w-xl mx-auto"
          style={textStyleToCss(data.sectionDescStyle || data.heroDescStyle, DEFAULT_ABOUT_DESC_STYLE)}
        >
          {data.sectionDesc || "A quarter-by-quarter breakdown of the work we've shipped and the impact we've made."}
        </p>
      </motion.div>

      <div className="relative max-w-4xl mx-auto px-6">
        <svg
          className="absolute left-0 top-0 w-full h-full pointer-events-none z-0"
          preserveAspectRatio="none"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="ab-gl" x="-20%" y="-5%" width="140%" height="110%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <path d={SPIRAL} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" strokeLinecap="round" />

          {/* Main glowing stroke — driven by GSAP scrub */}
          <path
            ref={pathMainRef}
            d={SPIRAL}
            fill="none"
            stroke="#837FFB"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#ab-gl)"
            strokeDasharray={pathLen}
            strokeDashoffset={pathLen}
          />

          {/* Bright overlay stroke — same drive, thinner + lighter */}
          <path
            ref={pathTopRef}
            d={SPIRAL}
            fill="none"
            stroke="#C4BFFF"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray={pathLen}
            strokeDashoffset={pathLen}
            opacity={0.75}
          />

          {milestones.slice(0, timeline.length).map((m, i) => {
            return (
              <g key={i}>
                {i <= activeIdx && (
                  <circle cx={m.x} cy={m.y} r="28" fill="#837FFB" opacity="0.12" filter="url(#ab-gl)" />
                )}
                <circle cx={m.x} cy={m.y} r="8" fill={i <= activeIdx ? "#837FFB" : "rgba(131,127,251,0.3)"} />
                <circle cx={m.x} cy={m.y} r="4" fill={i <= activeIdx ? "#fff" : "rgba(255,255,255,0.3)"} />
              </g>
            );
          })}
        </svg>

        <div className="relative z-10" style={{ minHeight: timeline.length * 400 }}>
          {milestones.slice(0, timeline.length).map((m, i) => {
            const item = timeline[i];
            if (!item) return null;
            const isRight = m.side === "right";
            const topPct = (m.y / VB_H) * 100;
            
            // Check if this specific item is the active one
            const isActive = i === activeIdx;
            
            return (
              <motion.div
                key={i}
                className="absolute"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isActive ? 1 : 0,
                  y: isActive ? -100 : -80 
                }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  top: `${topPct}%`,
                  left: isRight ? `${((m.x + 50) / VB_W) * 100}%` : undefined,
                  right: !isRight ? `${((VB_W - m.x + 50) / VB_W) * 100}%` : undefined,
                  width: "80vw",
                  maxWidth: 320,
                  textAlign: isRight ? "left" : "right",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <div
                  className="mb-2"
                  style={{
                    display: "flex",
                    justifyContent: isRight ? "flex-start" : "flex-end",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      background: "#837FFB",
                      boxShadow: isActive ? "0 0 16px rgba(131,127,251,0.8)" : "0 0 6px rgba(131,127,251,0.3)",
                      transition: "box-shadow 0.4s ease",
                    }}
                  />
                  <div style={{ width: 45, height: 1.5, background: "rgba(131,127,251,0.3)" }} />
                </div>

                <div
                  className="flex flex-col gap-6"
                  style={{
                    width: "100%",
                    alignItems: isRight ? "flex-start" : "flex-end",
                  }}
                >
                  {/* Text Part - TOP */}
                  <div className="w-full">
                    <p
                      className="font-mono font-black text-2xl tracking-tighter"
                      style={{ color: "#837FFB", textShadow: isActive ? "0 0 20px rgba(131,127,251,0.5)" : "none", transition: "all 0.6s" }}
                    >
                      {item.year}
                    </p>
                    <h3 
                      className="text-white font-bold mt-2 leading-tight"
                      style={textStyleToCss(item.titleStyle || data.spiralItemTitleStyle)}
                    >
                      {item.title}
                    </h3>
                    <p 
                      className="text-white/45 leading-relaxed mt-3"
                      style={textStyleToCss(item.descStyle || data.spiralItemDescStyle)}
                    >
                      {item.desc}
                    </p>
                  </div>

                  {/* IMAGES GALLERY - BOTTOM */}
                  {item.images && item.images.length > 0 && isActive && (
                    <div className="w-full transition-all duration-1000">
                      <CreativeCarousel 
                        images={item.images} 
                        autoplay={true}
                        showPagination={true}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}