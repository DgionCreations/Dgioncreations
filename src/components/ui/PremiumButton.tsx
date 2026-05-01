"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
}

export const PremiumButton = ({ children, onClick, className, href }: PremiumButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const content = (
    <>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#5B57F5] via-[#837FFB] to-[#5B57F5] transition-all duration-500 group-hover:scale-105" />
      
      {/* Gloss Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
      

      {/* Border Glow */}
      <div className="absolute inset-0 rounded-full border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" />

      {/* Text */}
      <span className="relative z-10 block text-[11px] font-black uppercase tracking-[0.25em] text-white drop-shadow-sm">
        {children}
      </span>
    </>
  );

  const baseClasses = cn(
    "group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-10 transition-all duration-300 active:scale-95 shadow-[0_10px_30px_rgba(131,127,251,0.3)] hover:shadow-[0_20px_40px_rgba(131,127,251,0.5)]",
    className
  );

  if (href) {
    const isExternal = href.startsWith("http");
    return (
      <motion.a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={baseClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={buttonRef}
      onClick={onClick}
      className={baseClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
    >
      {content}
    </motion.button>
  );
};
