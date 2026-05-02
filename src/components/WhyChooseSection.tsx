import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { useContent } from "@/lib/use-content";
import { ABOUT_CONTENT_KEY, defaultAboutContent, type AboutContent } from "@/content/about";
import { textStyleToCss } from "@/content/typography";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function Pillar3D({
  p,
  index,
}: {
  p: any;
  index: number;
}) {
  // Same content doc the parent reads — keeps title/desc typography in sync
  // without having to thread the style props through.
  const { data } = useContent<AboutContent>(ABOUT_CONTENT_KEY, defaultAboutContent);
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stopTimer = useRef<number | null>(null);
  const [videoActive, setVideoActive] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sRx = useSpring(rx, { stiffness: 80, damping: 16 });
  const sRy = useSpring(ry, { stiffness: 80, damping: 16 });
  const shineX = useTransform(sRy, [-18, 18], ["0%", "100%"]);
  const shineY = useTransform(sRx, [18, -18], ["0%", "100%"]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ry.set(((e.clientX - rect.left - rect.width / 2) / rect.width) * 18);
    rx.set(-((e.clientY - rect.top - rect.height / 2) / rect.height) * 18);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  const handleCircleEnter = () => {
    setVideoActive(true);
    const v = videoRef.current;
    if (v) { v.currentTime = 0; v.play().catch(() => {}); }
    if (stopTimer.current) window.clearTimeout(stopTimer.current);
    stopTimer.current = window.setTimeout(() => {
      if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
      setVideoActive(false);
    }, 6000);
  };

  const handleCircleLeave = () => {
    if (stopTimer.current) window.clearTimeout(stopTimer.current);
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    setVideoActive(false);
  };

  const ringDelay = index * 1.5;

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 50, rotateX: -20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease, delay: index * 0.18 }}
      style={{
        rotateX: sRx,
        rotateY: sRy,
        transformStyle: "preserve-3d",
        transformPerspective: 1200,
      }}
      className="relative group flex flex-col items-center"
    >
      {/* ── circular image container ── */}
      <div
        className="relative mx-auto w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[270px] md:h-[270px] mb-8 sm:mb-10"
        style={{ transformStyle: "preserve-3d", transform: "translateZ(50px)" }}
      >
        {/* back glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(131,127,251,0.5) 0%, transparent 70%)",
            transform: "translateZ(-40px) scale(1.2)",
          }}
          animate={{ scale: [1.2, 1.35, 1.2], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: ringDelay }}
        />

        {/* 3D rotating ring 1 — tilted X */}
        <motion.div
          className="absolute inset-[-16px] rounded-full will-change-transform"
          style={{
            border: "1px solid rgba(131,127,251,0.45)",
            boxShadow: "0 0 20px rgba(131,127,251,0.35)",
            transform: "rotateX(70deg)",
            transformStyle: "preserve-3d",
          }}
          animate={{ rotateZ: [0, 360] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute top-0 left-1/2 w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ background: "#fff", boxShadow: "0 0 12px #fff, 0 0 24px #837FFB" }}
          />
        </motion.div>

        {/* 3D rotating ring 2 — tilted opposite */}
        <motion.div
          className="absolute inset-[-24px] rounded-full will-change-transform"
          style={{
            border: "1px solid rgba(91,87,245,0.4)",
            boxShadow: "0 0 16px rgba(91,87,245,0.3)",
            transform: "rotateX(-65deg) rotateY(20deg)",
            transformStyle: "preserve-3d",
          }}
          animate={{ rotateZ: [360, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute top-0 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ background: "#837FFB", boxShadow: "0 0 10px #837FFB" }}
          />
        </motion.div>

        {/* circle with image/video */}
        <div
          onMouseEnter={handleCircleEnter}
          onMouseLeave={handleCircleLeave}
          className="relative w-full h-full rounded-full overflow-hidden cursor-pointer"
          style={{
            border: "2px solid rgba(131,127,251,0.4)",
            boxShadow:
              "0 30px 70px rgba(0,0,0,0.6), 0 0 50px rgba(131,127,251,0.3), inset 0 0 40px rgba(131,127,251,0.15), inset 0 2px 0 rgba(255,255,255,0.1)",
          }}
        >
          <img
            src={p.img}
            alt={p.title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
            style={{
              filter: "saturate(0.4) brightness(0.55) hue-rotate(220deg)",
              opacity: videoActive ? 0 : 1,
              transform: videoActive ? "scale(1.1)" : "scale(1)",
            }}
          />
          <video
            ref={videoRef}
            src={p.video}
            muted
            playsInline
            loop
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{
              filter: "saturate(0.55) brightness(0.7) hue-rotate(220deg)",
              opacity: videoActive ? 1 : 0,
            }}
          />
          {/* gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(131,127,251,0.15) 0%, rgba(8,6,26,0.5) 100%)",
            }}
          />
          {/* glass reflection band */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.15) 48%, rgba(255,255,255,0.22) 52%, transparent 70%)",
            }}
            animate={{ x: ["-150%", "150%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: index * 0.8 }}
          />
          {/* mouse shine */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              background: useTransform(
                [shineX, shineY],
                ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.25), transparent 55%)`
              ) as unknown as string,
            }}
          />
        </div>

        {/* roman numeral */}
        <span
          className="absolute top-0 left-1/2 text-white/80 text-xs font-bold tracking-[0.4em] uppercase"
          style={{
            fontFamily: "Georgia, serif",
            transform: "translate(-50%, -180%) translateZ(70px)",
          }}
        >
          {p.num}
        </span>

        {/* script word */}
        <span
          className="absolute inset-0 flex items-center justify-center text-white/25 italic font-light select-none pointer-events-none"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "3.5rem",
            letterSpacing: "-0.02em",
            textShadow: "0 0 30px rgba(131,127,251,0.6)",
            transform: "translateZ(40px)",
          }}
        >
          {p.script}
        </span>

        {/* tick marks */}
        <div
          className="absolute -top-6 left-1/2 flex gap-1.5"
          style={{ transform: "translate(-50%, -100%) translateZ(60px)" }}
        >
          {[...Array(3)].map((_, k) => (
            <div
              key={k}
              className="w-px h-5 bg-[#837FFB]/60"
              style={{ boxShadow: "0 0 6px rgba(131,127,251,0.6)" }}
            />
          ))}
        </div>

        {/* floating bobbing animation on circle */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="text-center md:text-left" style={{ transform: "translateZ(20px)" }}>
        <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
          <div
            className="w-6 h-[2px] bg-[#837FFB]"
            style={{ boxShadow: "0 0 8px rgba(131,127,251,0.9)" }}
          />
          <span className="text-[#837FFB] text-[10px] font-bold uppercase tracking-[0.25em]">
            {p.subtitle}
          </span>
        </div>
        <h3 
          className="text-white font-bold mb-2 leading-tight"
          style={textStyleToCss(data.whyPillarTitleStyle)}
        >
          {p.title}
        </h3>
        <p 
          className="text-white/60 leading-relaxed max-w-[20rem]"
          style={textStyleToCss(p.descriptionStyle ?? data.whyPillarDescStyle)}
        >
          {p.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function WhyChooseSection() {
  const { data } = useContent<AboutContent>(ABOUT_CONTENT_KEY, defaultAboutContent);
  const pillars = data.whyPillars || [];

  return (
    <section
      id="why-choose"
      className="relative overflow-hidden py-28"
      style={{
        background: "linear-gradient(160deg, #1B1A4E 0%, #13113A 50%, #1B1A4E 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-[#837FFB]/15 blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-[#5B57F5]/15 blur-[120px]"
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(131,127,251,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="block text-[#837FFB] text-[11px] font-bold tracking-[0.4em] uppercase mb-3">
            Why Us
          </span>
          <h2 
            className="text-white font-bold tracking-tight"
            style={textStyleToCss(data.whyTitleStyle)}
          >
            {data.whyTitle}{" "}
            <span 
              className="drop-shadow-[0_0_25px_rgba(131,127,251,0.6)]" 
              style={{ color: "#837FFB", ...textStyleToCss(data.whyHighlightStyle) }}
            >
              {data.whyHighlight}
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14" style={{ perspective: "1400px" }}>
          {pillars.map((p, i) => (
            <Pillar3D key={p.num} p={p} index={i} />
          ))}
        </div>

        <motion.p
          className="text-center text-white/30 text-xs uppercase tracking-[0.35em] mt-24 font-semibold"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          — est. 2024 · crafted with intent —
        </motion.p>
      </div>
    </section>
  );
}