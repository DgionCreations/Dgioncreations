import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [stage, setStage] = useState<"jumbled" | "ordered" | "fade">("jumbled");
  const letters = ["D", "G", "I", "O", "N"];
  
  // Random positions for jumbled state
  const jumbledPositions = [
    { x: -150, y: -400, rotate: -45 },
    { x: 100, y: -500, rotate: 30 },
    { x: -50, y: -600, rotate: -15 },
    { x: 200, y: -450, rotate: 60 },
    { x: -200, y: -550, rotate: -30 },
  ];

  useEffect(() => {
    // Stage 1: Jumbled letters fall (automatic via initial/animate)
    
    // Stage 2: Rearrange to ordered after 1.8s
    const timer1 = setTimeout(() => setStage("ordered"), 1800);
    
    // Stage 3: Fade out the whole screen after 3.2s
    const timer2 = setTimeout(() => setStage("fade"), 3200);
    
    // Final: Callback to hide splash
    const timer3 = setTimeout(() => onFinish(), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === "fade" ? 0 : 1 }}
      className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      {/* Background Glows with DGION brand colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Brand Glow (Purple) */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#837FFB]/20 rounded-full blur-[150px]" 
        />
        
        {/* Secondary Brand Glow (Deep Blue/Indigo) */}
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5B57F5]/20 rounded-full blur-[120px]" 
        />

        {/* Subtle Bottom Glow */}
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-full h-[30%] bg-[#837FFB]/5 blur-[100px] rounded-[100%]" />
      </div>

      <div className="relative flex items-center justify-center">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ 
              x: jumbledPositions[index].x, 
              y: jumbledPositions[index].y, 
              rotate: jumbledPositions[index].rotate,
              opacity: 0 
            }}
            animate={{ 
              x: stage === "jumbled" ? jumbledPositions[index].x : 0,
              y: stage === "jumbled" ? 0 : 0,
              rotate: stage === "jumbled" ? jumbledPositions[index].rotate : 0,
              opacity: 1,
              color: stage === "ordered" ? "#ffffff" : "rgba(255,255,255,0.4)"
            }}
            transition={{ 
              type: "spring",
              damping: 12,
              stiffness: 100,
              duration: 1,
              delay: stage === "jumbled" ? index * 0.1 : 0
            }}
            className="text-7xl md:text-9xl font-black tracking-tighter italic select-none inline-block"
            style={{
                textShadow: stage === "ordered" ? "0 0 30px rgba(131,127,251,0.5)" : "none",
                fontFamily: "'Inter', sans-serif"
            }}
          >
            {letter}
          </motion.span>
        ))}

        {/* Floating dust particles for premium feel */}
        <div className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 pointer-events-none opacity-20">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: Math.random() * 1000, y: Math.random() * 1000 }}
                    animate={{ 
                        y: [0, -100], 
                        opacity: [0, 1, 0] 
                    }}
                    transition={{ 
                        duration: 3 + Math.random() * 5, 
                        repeat: Infinity, 
                        delay: Math.random() * 5 
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full"
                />
            ))}
        </div>
      </div>

      {/* Subtle branding line at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: stage === "ordered" ? 0.3 : 0, y: 0 }}
        className="absolute bottom-12 text-white/50 text-[10px] font-bold tracking-[0.5em] uppercase"
      >
        Digital Innovation Agency
      </motion.div>
    </motion.div>
  );
}
