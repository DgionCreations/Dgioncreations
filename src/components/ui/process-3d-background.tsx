"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const ProcessThreeDBackground = () => {
  const { scrollYProgress } = useScroll();
  
  // Parallax movement for 3D depth
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 3D Perspective Grid */}
      <div 
        className="absolute inset-0 opacity-[0.1]" 
        style={{ 
          perspective: "1000px",
          transformStyle: "preserve-3d"
        }}
      >
        <motion.div 
          style={{ rotateX: 60, y: y1 }}
          className="absolute inset-0"
        >
          <div 
            className="w-[200%] h-[200%] -left-1/2 -top-1/2"
            style={{ 
              backgroundImage: `linear-gradient(rgba(131,127,251,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(131,127,251,0.2) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
              maskImage: 'radial-gradient(ellipse at center, white, transparent 70%)'
            }}
          />
        </motion.div>
      </div>

      {/* Dgion's Two Colors - Floating Glows */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
        style={{ background: "#837FFB" }} // Color 1: Purple
      />

      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, 40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-15"
        style={{ background: "#38bdf8" }} // Color 2: Blue/Cyan
      />

      {/* Floating 3D Elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            z: Math.random() * -500,
            rotate: Math.random() * 360
          }}
          animate={{
            y: ["0%", "-20%", "0%"],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="absolute w-12 h-12 border border-white/10 flex items-center justify-center"
        >
          <div className="w-full h-full bg-white/5 backdrop-blur-sm border border-white/5 shadow-2xl" />
        </motion.div>
      ))}

      {/* Scanline / Data flow effect */}
      <div className="absolute inset-0 bg-transparent overflow-hidden">
        <motion.div 
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-full h-1/4 bg-gradient-to-b from-transparent via-[#837FFB]/10 to-transparent opacity-50"
        />
      </div>
    </div>
  );
};
