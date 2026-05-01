import { useRef, useState, useCallback, type ReactNode } from "react";
import {
  motion, useMotionValue, useSpring, useTransform,
  type MotionStyle,
} from "framer-motion";

interface Tilt3DCardProps {
  children: ReactNode;
  className?: string;
  style?: MotionStyle;
  accent?: string;
  maxTilt?: number;
  scale?: number;
  glareOpacity?: number;
  perspective?: number;
  hoverLift?: number;
}

/**
 * Tilt3DCard — reusable 3D mouse-tilt card with:
 *  - Spring-damped rotateX / rotateY
 *  - Dynamic mouse-following glare
 *  - Hover scale + lift
 *  - Accent-colored glow on hover
 *
 * Pass children as-is — inner depth layers are automatic.
 */
export function Tilt3DCard({
  children,
  className = "",
  style = {},
  accent = "#837FFB",
  maxTilt = 14,
  scale = 1.03,
  glareOpacity = 0.12,
  perspective = 800,
  hoverLift = 6,
}: Tilt3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 200,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 200,
    damping: 22,
  });

  const glareX = useTransform(mx, [0, 1], [0, 100]);
  const glareY = useTransform(my, [0, 1], [0, 100]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 50%)`
  );

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set((e.clientX - rect.left) / rect.width);
      my.set((e.clientY - rect.top) / rect.height);
    },
    [mx, my]
  );

  const handleLeave = useCallback(() => {
    mx.set(0.5);
    my.set(0.5);
    setHovered(false);
  }, [mx, my]);

  return (
    <div className="h-full" style={{ perspective }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        className={`relative h-full ${className}`}
        style={{
          transformStyle: "preserve-3d",
          rotateX: hovered ? rotateX : 0,
          rotateY: hovered ? rotateY : 0,
          ...style,
        }}
        animate={hovered ? { y: -hoverLift, scale } : { y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* mouse-tracking glare overlay — sits in front */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            background: glareBg,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s",
            transform: "translateZ(6px)",
          }}
        />

        {/* top edge accent highlight */}
        <div
          aria-hidden
          className="absolute top-0 left-[10%] right-[10%] h-px rounded-[inherit] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}55, transparent)`,
            transform: "translateZ(4px)",
            opacity: hovered ? 1 : 0.5,
            transition: "opacity 0.3s",
          }}
        />

        {/* accent glow on hover */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            boxShadow: hovered
              ? `0 20px 50px ${accent}22, 0 0 40px ${accent}18`
              : "0 0 0 transparent",
            transition: "box-shadow 0.4s ease",
          }}
        />

        {/* content sits on its own depth plane */}
        <div className="relative" style={{ transform: "translateZ(12px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}