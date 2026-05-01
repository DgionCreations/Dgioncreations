"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode, useEffect, useMemo, useState } from "react";

export function ThreeDMarquee({
  items,
  className,
}: {
  items: ReactNode[];
  className?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  const rows = useMemo(() => {
    const chunkSize = Math.ceil(items.length / 4);
    const chunks: ReactNode[][] = [];
    for (let i = 0; i < 4; i++) {
      chunks.push(items.slice(i * chunkSize, (i + 1) * chunkSize));
    }
    return [...chunks, ...chunks.map((c) => [...c].reverse())].slice(0, 8);
  }, [items]);

  return (
    <div
      className={cn(
        "relative flex h-screen w-full flex-col items-center justify-center overflow-hidden",
        className
      )}
      style={{ perspective: "280px" }}
    >
      <div
        style={{
          transform: "rotateX(22deg) rotateZ(-4deg) translateZ(0)",
          transformStyle: "preserve-3d",
        }}
        className="flex flex-col gap-6"
      >
        {rows.map((row, i) => (
          <motion.div
            key={i}
            animate={isLoaded ? { x: i % 2 === 0 ? [0, -400] : [-400, 0] } : {}}
            transition={{
              duration: 22 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            className="flex flex-shrink-0 gap-6"
          >
            {[...row, ...row].map((item, j) => (
              <div key={`${i}-${j}`} className="flex-shrink-0">
                {item}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* cinematic edge fades */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08061A] via-[#08061A]/10 to-[#08061A]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#08061A] via-transparent to-[#08061A]" />
    </div>
  );
}