"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const ProfessionalBackground = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#08061A]">
      {/* Texture Overlay (Grain) */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Global Grid System */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `radial-gradient(rgba(131,127,251,0.2) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Large Parallax Background Text */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-1/4 -left-20 text-[20vw] font-black text-white/[0.02] select-none leading-none whitespace-nowrap"
      >
        METHODOLOGY
      </motion.div>
      
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-1/4 -right-20 text-[20vw] font-black text-white/[0.02] select-none leading-none whitespace-nowrap"
      >
        STRATEGY
      </motion.div>

      {/* Slow Ambient Glows */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[1000px] h-[1000px] rounded-full bg-[#837FFB] blur-[150px] -mr-96 -mt-96"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 left-0 w-[800px] h-[800px] rounded-full bg-[#5B57F5] blur-[120px] -ml-64 -mb-64"
      />

      {/* Subtle Scanlines or Digital Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,35,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-10 bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />
    </div>
  );
};
