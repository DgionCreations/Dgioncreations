import { useEffect, useRef } from "react";
import { animate, useInView, motion } from "framer-motion";

interface StatCounterProps {
  value: string;
  className?: string;
  duration?: number;
  delay?: number;
  disableCommas?: boolean;
}

/**
 * StatCounter — Animates a number from 0 to target.
 * Automatically handles suffixes/prefixes like "+", "%", "K", etc.
 */
export function StatCounter({ value, className = "", duration = 2, delay = 0, disableCommas = false }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  // Extract the numeric part and the string parts (prefix/suffix)
  // Example: "$50M+" -> prefix: "$", number: 50, suffix: "M+"
  const match = value.match(/^([^0-9]*)([0-9.,]+)([^0-9]*)$/);
  
  const prefix = match ? match[1] : "";
  const rawNum = match ? match[2].replace(/,/g, "") : "0";
  const suffix = match ? match[3] : "";
  
  const targetNum = parseFloat(rawNum);
  const isDecimal = rawNum.includes(".");

  useEffect(() => {
    if (isInView && ref.current && targetNum > 0) {
      const node = ref.current;
      const controls = animate(0, targetNum, {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Custom ease for a premium feel
        onUpdate(latest) {
          if (isDecimal) {
            node.textContent = latest.toFixed(1);
          } else {
            node.textContent = disableCommas ? Math.round(latest).toString() : Math.round(latest).toLocaleString();
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, targetNum, duration, delay, isDecimal, disableCommas]);

  return (
    <span className={className}>
      {prefix}
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}
