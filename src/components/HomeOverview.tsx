import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StatCounter } from "@/components/ui/StatCounter";
import { useContent } from "@/lib/use-content";
import {
  EXPLORE_CONTENT_KEY,
  defaultExploreContent,
  type ExploreContent,
  DEFAULT_HEADING_STYLE,
  DEFAULT_HIGHLIGHT_STYLE,
  DEFAULT_CARD_TITLE_STYLE,
  DEFAULT_CARD_SUMMARY_STYLE,
} from "@/content/explore";
import { textStyleToCss } from "@/content/typography";
import { MarkupText } from "@/lib/markup-text";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function HomeOverview() {
  const pinRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const { data } = useContent<ExploreContent>(EXPLORE_CONTENT_KEY, defaultExploreContent);
  const items = data.cards;

  useLayoutEffect(() => {
    const pin = pinRef.current;
    const stack = stackRef.current;
    if (!pin || !stack) return;

    const ctx = gsap.context(() => {
      const sections = Array.from(stack.querySelectorAll<HTMLElement>("[data-section]"));
      if (sections.length < 2) return;

      sections.forEach((s, i) => {
        gsap.set(s, {
          yPercent: i === 0 ? 0 : 100,
          scale: 1,
          opacity: 1,
          transformOrigin: "center center",
        });
        const img = s.querySelector<HTMLElement>("[data-img]");
        if (img) gsap.set(img, { scale: 1 });
        const content = s.querySelector<HTMLElement>("[data-content]");
        if (content) gsap.set(content, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 });
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${(sections.length - 1) * window.innerHeight}`,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      sections.forEach((section, i) => {
        if (i === 0) return;
        const prev = sections[i - 1];
        const content = section.querySelector<HTMLElement>("[data-content]");
        const prevContent = prev.querySelector<HTMLElement>("[data-content]");

        tl.to(section, { yPercent: 0, duration: 1, ease: "power3.inOut" }, i - 1);
        tl.to(prev, { scale: 0.96, opacity: 0.85, duration: 1, ease: "power2.out" }, i - 1);

        if (content) {
          tl.fromTo(content, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, i - 1 + 0.35);
        }
        if (prevContent) {
          tl.to(prevContent, { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" }, i - 1);
        }
      });

      const kens = Array.from(stack.querySelectorAll<HTMLElement>("[data-img]"));
      kens.forEach((img) => {
        gsap.to(img, {
          scale: 1.05,
          duration: 20,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });
    }, pin);

    return () => ctx.revert();
  }, [items]);

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background Heading - Subtle ghost effect to prevent overlap with card content */}
      <div className="relative z-0 max-w-7xl mx-auto px-6 lg:px-10 pt-16 md:pt-20 pb-4 hidden md:block opacity-[0.08]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="text-[10px] font-bold tracking-[0.5em] uppercase" style={{ color: "#837FFB" }}>
            {data.kicker}
          </span>
          <h2 className="mt-4" style={textStyleToCss(data.headingStyle, DEFAULT_HEADING_STYLE)}>
            {data.headingBefore.includes("**") ? (
              data.headingBefore.split("\n").map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  <MarkupText text={line} highlightStyle={data.highlightStyle} highlightClassName="drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]" />
                </span>
              ))
            ) : (
              <>
                {data.headingBefore}
                <span className="drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]" style={textStyleToCss(data.highlightStyle, DEFAULT_HIGHLIGHT_STYLE)}>
                  {data.headingHighlight}
                </span>
                {data.headingAfter}
              </>
            )}
          </h2>
        </motion.div>
      </div>

      {/* Cinematic Particles Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
        <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, opacity: 0.2 }} />
      </div>

      {/* Pinned stack - Adjusted height for better vertical balance */}
      <div ref={pinRef} className="relative h-screen overflow-hidden mt-0">
        <div ref={stackRef} className="absolute inset-0">
          {items.map((item, i) => {
            const textLeft = i % 2 === 0;
            const markerBg = i === 0 ? "#0e0e0e" : i === 1 ? "#c45c2e" : i === 2 ? "#d4a541" : i === 3 ? "#1d2c4d" : i === 4 ? "#ff5a1f" : item.accent;
            const markerFg = i === 0 ? "#f6f4ee" : i === 1 ? "#ffffff" : i === 2 ? "#0e0e0e" : i === 3 ? "#f6f4ee" : i === 4 ? "#ffffff" : "#ffffff";

            // Mobile-specific style overrides to prevent overflow
            const mobileTitleCss: React.CSSProperties = {
               ...textStyleToCss(item.titleStyle, DEFAULT_CARD_TITLE_STYLE),
               fontSize: "clamp(24px, 8vw, 36px)", // Force smaller size on mobile
               lineHeight: "1.1"
            };
            const desktopTitleCss: React.CSSProperties = {
               ...textStyleToCss(item.titleStyle, DEFAULT_CARD_TITLE_STYLE),
               letterSpacing: "-0.02em"
            };

            return (
              <article
                key={item.id}
                data-section
                className="group absolute inset-0 w-full h-full p-4 md:p-16 lg:p-20"
                style={{ 
                  zIndex: i + 1, 
                  willChange: "transform, opacity",
                  "--marker-bg": markerBg,
                  "--marker-fg": markerFg
                } as React.CSSProperties}
              >
                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-16 lg:p-24">
                  {/* Floating Glow Blobs */}
                  <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ background: item.tint }} />
                  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[150px] opacity-10" style={{ background: "#837FFB" }} />

                  <div
                    data-img-frame
                    className="relative h-full w-full rounded-3xl md:rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border border-white/10 backdrop-blur-sm bg-black/20"
                  >
                    <div
                      data-img
                      className="will-change-transform"
                      style={{
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        transformOrigin: "center center",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    />

                    {/* Premium Glass Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/5 opacity-40" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-black/90 via-transparent to-transparent opacity-60" />
                    
                    {/* Floating Content Layout */}
                    <div className="relative z-10 h-full flex items-end justify-end p-8 md:p-16">
                      <div data-content className="max-w-xl text-right" style={{ willChange: "transform, opacity" }}>
                        <h3 data-title className="mb-8">
                           <div className="font-sans font-extrabold tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]" style={{ fontSize: "clamp(32px, 5.5vw, 68px)", lineHeight: "1" }}>
                              {item.title}
                           </div>
                        </h3>
                        <Link to={item.url} className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-full text-sm font-black tracking-widest uppercase text-white bg-[#837FFB] transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_60px_rgba(131,127,251,0.4)]">
                          <span className="relative z-10">EXPLORE</span>
                          <ArrowUpRight className="relative z-10 w-5 h-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                  <div className="absolute top-4 right-4 md:top-8 md:right-8 text-white/80 text-[10px] md:text-sm font-mono tracking-widest pointer-events-none" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
                    <span className="opacity-60">0<StatCounter value={(i + 1).toString()} duration={0.8} /></span>
                    <span className="mx-1 opacity-30">/</span>
                    <span className="opacity-30">0{items.length}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}