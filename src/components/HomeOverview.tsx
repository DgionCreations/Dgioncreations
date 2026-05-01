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
        if (img) gsap.set(img, { scale: 1.15 });
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
      {/* Background Heading - Hidden on mobile to prevent overlap with pinned stack */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-20 md:pt-32 pb-8 md:pb-16 hidden md:block">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="text-sm font-bold tracking-[0.3em] uppercase" style={{ color: "#837FFB" }}>
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

      {/* Pinned stack - Adjusted height for mobile */}
      <div ref={pinRef} className="relative h-[80vh] md:h-screen overflow-hidden mt-20 md:mt-0">
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
                className="group absolute inset-0 w-full h-full p-2 md:p-12 lg:p-16"
                style={{ 
                  zIndex: i + 1, 
                  willChange: "transform, opacity",
                  "--marker-bg": markerBg,
                  "--marker-fg": markerFg
                } as React.CSSProperties}
              >
                <div
                  data-img-frame
                  className="relative h-full w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)_inset]"
                  style={{ background: item.tint }}
                >
                  <div
                    data-img
                    className="will-change-transform"
                    style={{
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                      transformOrigin: "center center",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  />

                  {/* Professional bottom-fade for high-end readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:hidden" />

                  <div
                    className="absolute inset-0 pointer-events-none hidden md:block"
                    style={{
                      background: textLeft
                        ? `linear-gradient(90deg, ${item.tint}ee 0%, ${item.tint}88 42%, transparent 78%)`
                        : `linear-gradient(270deg, ${item.tint}ee 0%, ${item.tint}88 42%, transparent 78%)`,
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(180deg, rgba(10,8,24,0.15) 0%, transparent 22%, transparent 78%, rgba(10,8,24,0.5) 100%)",
                    }}
                  />

                  <div className="relative z-10 h-full flex items-end md:items-center pb-12 md:pb-0">
                    <div className="max-w-7xl mx-auto w-full px-6 md:px-10 lg:px-16">
                      <div data-content className={`max-w-xl ${textLeft ? "" : "md:ml-auto md:text-right"} text-left mx-0`} style={{ willChange: "transform, opacity" }}>
                        <span className="inline-block text-white text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase px-3 py-1 rounded-sm mb-5 shadow-lg" style={{ background: item.accent, color: "#fff" }}>
                          {item.badge}
                        </span>
                        <h3 data-title className="mt-2 md:mt-6">
                           <div className="font-sans font-extrabold tracking-tight text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]" style={{ fontSize: "clamp(32px, 5vw, 64px)", lineHeight: "1" }}>
                              {item.title}
                           </div>
                        </h3>
                        <p className="mt-5 md:mt-6 leading-relaxed max-w-sm md:max-w-md text-sm md:text-base text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]" style={textStyleToCss(item.summaryStyle, DEFAULT_CARD_SUMMARY_STYLE)}>
                          {item.summary}
                        </p>
                        <Link to={item.url} className="mt-8 md:mt-10 inline-flex items-center gap-2 px-7 md:px-8 py-3 md:py-4 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase text-black bg-white transition-all duration-300 hover:pr-10 hover:shadow-[0_10px_40px_rgba(255,255,255,0.3)] hover:-translate-y-1">
                          EXPLORE {item.eyebrow}
                          <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Link>
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