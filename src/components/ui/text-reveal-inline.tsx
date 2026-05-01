import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * TextRevealInline — a compact hover-reveal effect that fits inside existing
 * layouts (card titles, headings, etc.). As the mouse moves across the element,
 * a vertical line sweeps, revealing `revealText` over the top of `text`.
 *
 * This is a trimmed variant of the full-card TextRevealCard — no background,
 * no stars, no fixed dimensions. It inherits typography from its parent.
 */
export function TextRevealInline({
  text,
  revealText,
  accent = "#837FFB",
  className,
}: {
  text: string;
  revealText: string;
  accent?: string;
  className?: string;
}) {
  const [widthPercentage, setWidthPercentage] = useState(0);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [left, setLeft] = useState(0);
  const [localWidth, setLocalWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setLeft(rect.left);
      setLocalWidth(rect.width);
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const relativeX = e.clientX - left;
    setWidthPercentage(Math.max(0, Math.min(100, (relativeX / localWidth) * 100)));
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => {
        setIsMouseOver(false);
        setWidthPercentage(0);
      }}
      onMouseMove={onMouseMove}
      className={cn("relative inline-block align-baseline", className)}
      style={{ cursor: "default" }}
    >
      {/* Base text — clipped OUT as we sweep */}
      <motion.span 
        animate={{
          clipPath: `inset(0 0 0 ${widthPercentage}%)`,
        }}
        transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
        className="relative z-0 block"
      >
        {text}
      </motion.span>

      {/* Reveal layer — clipped IN as we sweep */}
      <motion.span
        aria-hidden
        animate={{
          clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
          opacity: widthPercentage > 0 ? 1 : 0,
        }}
        transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
        className="absolute inset-0 z-10 will-change-[clip-path] block whitespace-nowrap"
        style={{ color: accent, textShadow: `0 0 18px ${accent}80` }}
      >
        {revealText}
      </motion.span>

      {/* Vertical sweep line */}
      <motion.span
        aria-hidden
        animate={{
          left: `${widthPercentage}%`,
          opacity: widthPercentage > 0 ? 1 : 0,
        }}
        transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
        className="pointer-events-none absolute top-0 bottom-0 z-20 w-[2px]"
        style={{
          background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 12px ${accent}`,
        }}
      />
    </span>
  );
}
