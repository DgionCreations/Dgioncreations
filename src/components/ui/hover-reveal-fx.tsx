"use client";
import { memo, type ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * HoverRevealFx
 *
 * Adds only the twinkling star field effect behind any card content.
 * No mouse tracking, no shimmer bar — just the ambient starfield.
 */
const Stars = () => {
  const rnd = () => Math.random();
  const jitter = () => Math.random() * 4 - 2;
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.span
          key={i}
          animate={{
            top: `calc(${rnd() * 100}% + ${jitter()}px)`,
            left: `calc(${rnd() * 100}% + ${jitter()}px)`,
            opacity: rnd(),
            scale: [1, 1.2, 0],
          }}
          transition={{ duration: rnd() * 10 + 18, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            top: `${rnd() * 100}%`,
            left: `${rnd() * 100}%`,
            width: 2,
            height: 2,
            background: "rgba(131,127,251,0.85)",
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
};
const MemoStars = memo(Stars);

export function HoverRevealFx({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <MemoStars />
      <div className="relative z-10">{children}</div>
    </div>
  );
}