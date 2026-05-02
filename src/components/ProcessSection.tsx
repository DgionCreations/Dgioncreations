import { useState, useRef, useCallback, useLayoutEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, Palette, Code2, Rocket, TrendingUp } from "lucide-react";
import { StatCounter } from "@/components/ui/StatCounter";

gsap.registerPlugin(ScrollTrigger);

import { useContent } from "@/lib/use-content";
import { 
  PROCESS_CONTENT_KEY, 
  defaultProcessContent, 
  type ProcessContent,
  type ProcessStep,
  DEFAULT_PROCESS_KICKER_STYLE,
  DEFAULT_PROCESS_TITLE_STYLE,
  DEFAULT_PROCESS_HIGHLIGHT_STYLE
} from "@/content/process";
import { textStyleToCss } from "@/content/typography";
import { resolveIcon } from "@/content/icons";
import { MarkupText } from "@/lib/markup-text";
import { ProcessThreeDBackground } from "@/components/ui/process-3d-background";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function StaircaseCard({
  step,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  step: ProcessStep;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = resolveIcon(step.iconKey);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [18, -18]), { stiffness: 180, damping: 22 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-18, 18]), { stiffness: 180, damping: 22 });

  const shineX = useTransform(mx, [0, 1], [0, 100]);
  const shineY = useTransform(my, [0, 1], [0, 100]);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }, [mx, my]);

  const handleLeave = useCallback(() => {
    mx.set(0.5);
    my.set(0.5);
    onLeave();
  }, [mx, my, onLeave]);

  return (
    <motion.div
      data-process-card
      className="flex flex-col items-start relative"
      // opacity:0 inline so cards stay hidden before the GSAP timeline mounts
      // (prevents a flash of all 5 visible on first paint)
      style={{ flex: 1, marginTop: index * 56, opacity: 0 }}
      onMouseEnter={onHover}
      onMouseLeave={handleLeave}
    >
      <div style={{ perspective: 700, width: "100%" }}>
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouse}
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            borderRadius: 22,
            background: step.bg,
            border: `1px solid ${isHovered ? step.accent + "44" : step.borderColor}`,
            boxShadow: isHovered
              ? `0 30px 70px rgba(0,0,0,0.55), 0 0 50px ${step.glowColor}, 0 0 0 1px ${step.accent}15`
              : "0 8px 30px rgba(0,0,0,0.35)",
            position: "relative",
            overflow: "hidden",
            cursor: "default",
            transformStyle: "preserve-3d",
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
            transition: "border-color 0.3s, box-shadow 0.4s",
          }}
          animate={isHovered ? { y: -10 } : { y: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)",
              borderRadius: "22px 22px 0 0",
              pointerEvents: "none",
              transform: "translateZ(2px)",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: 0,
              left: "12%",
              right: "12%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${step.accent}50, transparent)`,
              pointerEvents: "none",
              transform: "translateZ(4px)",
            }}
          />

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: 1,
              background: `linear-gradient(180deg, ${step.accent}30, transparent 60%)`,
              pointerEvents: "none",
            }}
          />

          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: useTransform(
                [shineX, shineY],
                ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.1) 0%, transparent 45%)`
              ),
              pointerEvents: "none",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.3s",
              transform: "translateZ(6px)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 5,
              borderRadius: 18,
              border: `1px solid ${step.accent}08`,
              pointerEvents: "none",
              transform: "translateZ(3px)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "translateZ(-6px)",
            }}
          >
            <span
              style={{
                fontSize: 120,
                fontWeight: 900,
                color: isHovered ? step.accent + "44" : step.numColor,
                lineHeight: 1,
                transition: "color 0.4s ease",
                userSelect: "none",
                textShadow: isHovered ? `0 0 30px ${step.accent}33` : "none",
              }}
            >
              <StatCounter value={step.number} duration={1.2} />
            </span>
          </div>

          {isHovered && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "250%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "30%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
                pointerEvents: "none",
                transform: "translateZ(8px)",
              }}
            />
          )}

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "15%",
              right: "15%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${step.accent}25, transparent)`,
              pointerEvents: "none",
            }}
          />
        </motion.div>

        <div
          style={{
            width: "70%",
            height: 16,
            borderRadius: "50%",
            margin: "6px auto 0",
            background: `radial-gradient(ellipse, ${step.glowColor}, transparent 70%)`,
            filter: "blur(6px)",
            opacity: isHovered ? 0.6 : 0.2,
            transition: "opacity 0.4s",
            transform: `scaleX(${isHovered ? 1.1 : 0.8})`,
          }}
        />
      </div>

      <div className="mt-4 pl-1 pr-2">
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            whileHover={{ scale: 1.12, rotateY: 12 }}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{
              background: `${step.accent}12`,
              border: `1px solid ${step.accent}25`,
              boxShadow: isHovered ? `0 4px 12px ${step.glowColor}` : "none",
              transition: "box-shadow 0.3s",
            }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: step.accent }} />
          </motion.div>
          <div>
            <p className="font-bold text-[13px] leading-none" style={{ color: step.accent }}>
              {step.label}
            </p>
            <p className="text-white font-semibold text-[12px] mt-0.5">{step.title}</p>
          </div>
        </div>
        <p className="text-white/35 text-[11px] leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  );
}

export default function ProcessSection() {
  const { data } = useContent<ProcessContent>(PROCESS_CONTENT_KEY, defaultProcessContent);
  const steps = data.steps;
  const [hovered, setHovered] = useState<number | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  // Scroll-scrubbed reveal — each card fades in at its own scroll position.
  // Because the cards sit in a flex row (staircase layout), a plain IntersectionObserver
  // pops them all in simultaneously. Here we tie the reveal to scroll *progress* through
  // the section, with a big stagger so card 1 finishes before card 2 starts.
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const cards = row.querySelectorAll<HTMLElement>("[data-process-card]");
    if (!cards.length) return;

    gsap.set(cards, { opacity: 0, y: 60, willChange: "transform, opacity" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: "top 80%",
        end: "top 10%", // reveal completes before the row scrolls past the middle
        scrub: 1,       // follow Lenis scroll with 1s smoothing
      },
    });

    tl.to(cards, {
      opacity: 1,
      y: 0,
      ease: "power2.out",
      // stagger > per-card duration → cards reveal one-at-a-time, not overlapping
      stagger: { each: 0.9, from: "start" },
      duration: 0.6,
      onComplete: () => cards.forEach((c) => (c.style.willChange = "")),
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      cards.forEach((c) => (c.style.willChange = ""));
    };
  }, []);

  return (
    <section
      id="process"
      className="relative overflow-hidden py-16 sm:py-20 md:py-28"
      style={{ background: "#08061A" }}
    >
      <ProcessThreeDBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          className="text-center mb-10 sm:mb-14 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span 
            className="text-sm font-bold tracking-[0.3em] uppercase block"
            style={textStyleToCss(data.heroKickerStyle, DEFAULT_PROCESS_KICKER_STYLE)}
          >
            {data.heroKicker}
          </span>
          <h2
            className="mt-4 text-white font-bold"
            style={textStyleToCss(data.heroTitleStyle, DEFAULT_PROCESS_TITLE_STYLE)}
          >
            {data.heroTitle.includes("**") ? (
              data.heroTitle.split("\n").map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  <MarkupText
                    text={line}
                    highlightStyle={data.heroHighlightStyle}
                    highlightClassName="drop-shadow-[0_0_24px_rgba(131,127,251,0.6)]"
                  />
                </span>
              ))
            ) : (
              <>
                {data.heroTitle}{" "}
                <span
                  className="drop-shadow-[0_0_24px_rgba(131,127,251,0.6)]"
                  style={textStyleToCss(data.heroHighlightStyle, DEFAULT_PROCESS_HIGHLIGHT_STYLE)}
                >
                  {data.heroHighlight}
                </span>
              </>
            )}
          </h2>
        </motion.div>

        <div ref={rowRef} className="hidden lg:flex items-start gap-1 relative">
          {steps.map((step, i) => (
            <StaircaseCard
              key={step.label}
              step={step}
              index={i}
              isHovered={hovered === i}
              onHover={() => setHovered(i)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>

        <div className="lg:hidden flex flex-col gap-4 sm:gap-5 md:gap-6">
          {steps.map((step, i) => {
            const Icon = resolveIcon(step.iconKey);
            return (
              <motion.div
                key={step.label}
                className="flex gap-4 items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              >
                <div
                  className="shrink-0 flex items-center justify-center relative overflow-hidden"
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 16,
                    background: step.bg,
                    border: `1px solid ${step.borderColor}`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "50%",
                      background: "linear-gradient(180deg, rgba(255,255,255,0.04), transparent)",
                      borderRadius: "16px 16px 0 0",
                      pointerEvents: "none",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 34,
                      fontWeight: 900,
                      color: step.numColor,
                      lineHeight: 1,
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                <div className="pt-1 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4" style={{ color: step.accent }} />
                    <h3 className="text-white font-bold text-[15px]">{step.label}</h3>
                  </div>
                  <p className="text-white/45 text-[12px] font-medium mb-0.5">{step.title}</p>
                  <p className="text-white/30 text-[11px] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-10 sm:mt-12 md:mt-16"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
        >
          {data.badges.map((label) => (
            <div
              key={label}
              className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white/70"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(131,127,251,0.2)",
              }}
            >
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}