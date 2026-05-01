import { useRef } from "react";
import { motion, useAnimate } from "framer-motion";
import { useContent } from "@/lib/use-content";
import {
  CLIENTS_CONTENT_KEY,
  defaultClientsContent,
  type ClientsContent,
  DEFAULT_KICKER_STYLE,
  DEFAULT_HEADING_STYLE,
  DEFAULT_HIGHLIGHT_STYLE,
  DEFAULT_DESCRIPTION_STYLE,
  DEFAULT_LOGO_LABEL_STYLE,
} from "@/content/clients";
import { textStyleToCss } from "@/content/typography";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

/* ── clip-path keyframes ── */
const NO_CLIP           = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP    = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP  = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP     = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

type Side = "left" | "right" | "top" | "bottom";
const ENTRANCE_KEYFRAMES: Record<Side, string[]> = {
  left:   [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top:    [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right:  [TOP_LEFT_CLIP,     NO_CLIP],
};
const EXIT_KEYFRAMES: Record<Side, string[]> = {
  left:   [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top:    [NO_CLIP, TOP_RIGHT_CLIP],
  right:  [NO_CLIP, BOTTOM_LEFT_CLIP],
};

function LinkBox({
  name,
  imgSrc,
  href,
  index = 0,
  labelStyle,
}: {
  name: string;
  imgSrc: string;
  href: string;
  index?: number;
  labelStyle?: React.CSSProperties;
}) {
  const [scope, animate] = useAnimate();
  const ref = useRef<HTMLAnchorElement>(null);

  const getNearestSide = (e: React.MouseEvent<HTMLAnchorElement>): Side => {
    const box = (e.currentTarget).getBoundingClientRect();
    const candidates: { proximity: number; side: Side }[] = [
      { proximity: Math.abs(box.left   - e.clientX), side: "left"   },
      { proximity: Math.abs(box.right  - e.clientX), side: "right"  },
      { proximity: Math.abs(box.top    - e.clientY), side: "top"    },
      { proximity: Math.abs(box.bottom - e.clientY), side: "bottom" },
    ];
    candidates.sort((a, b) => a.proximity - b.proximity);
    return candidates[0].side;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const side = getNearestSide(e);
    animate(scope.current, { clipPath: ENTRANCE_KEYFRAMES[side] }, { duration: 0.4, ease: "easeInOut" });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const side = getNearestSide(e);
    animate(scope.current, { clipPath: EXIT_KEYFRAMES[side] }, { duration: 0.4, ease: "easeInOut" });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
      whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.08,
      }}
      whileHover={{ rotateY: 6, rotateX: -4 }}
      style={{
        transformStyle: "preserve-3d",
        transformPerspective: 800,
        background: "linear-gradient(180deg, #1B1A4E 0%, #13113A 100%)",
      }}
      className="relative grid h-24 sm:h-32 md:h-40 w-full place-content-center group"
    >
      {/* flowing shimmer sweep across the box */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, transparent 35%, rgba(131,127,251,0.18) 50%, transparent 65%)",
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
          delay: index * 0.25,
        }}
      />

      {/* base layer — monochrome logo + label with continuous float */}
      <motion.div
        className="flex flex-col items-center gap-2 text-white/80 relative"
        animate={{ y: [0, -5, 0], rotateZ: [-1, 1, -1] }}
        transition={{
          duration: 4 + (index % 3),
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.15,
        }}
      >
        <img
          src={imgSrc}
          alt={name}
          className="h-7 sm:h-9 md:h-10 w-auto object-contain"
          style={{ filter: "grayscale(100%) brightness(1.4)" }}
        />
        <span
          className="uppercase tracking-[0.2em]"
          style={labelStyle}
        >
          {name}
        </span>
      </motion.div>

      {/* hover layer — clipped reveal with colored logo on purple */}
      <div
        ref={scope}
        style={{ clipPath: BOTTOM_RIGHT_CLIP }}
        className="absolute inset-0 grid place-content-center bg-[#837FFB]"
      >
        <div className="flex flex-col items-center gap-2 text-white">
          <img
            src={imgSrc}
            alt={name}
            className="h-7 sm:h-9 md:h-10 w-auto object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold">
            {name}
          </span>
        </div>
      </div>
    </motion.a>
  );
}

export default function ClientsSection() {
  const { data } = useContent<ClientsContent>(CLIENTS_CONTENT_KEY, defaultClientsContent);
  const logos = data.logos;
  // Preserve the 2 / 4 / 4 layout for the first 10 logos. Any extras spill
  // into a final row so admins can add beyond ten without breaking layout.
  const row1 = logos.slice(0, 2);
  const row2 = logos.slice(2, 6);
  const row3 = logos.slice(6, 10);
  const rest = logos.slice(10);
  const labelStyle = textStyleToCss(data.logoLabelStyle, DEFAULT_LOGO_LABEL_STYLE);

  return (
    <section
      id="clients"
      className="relative overflow-hidden py-28"
      style={{
        background: "linear-gradient(160deg, #1B1A4E 0%, #13113A 50%, #1B1A4E 100%)",
      }}
    >
      {/* ambient orbs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#837FFB]/12 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#5B57F5]/12 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full px-6 lg:px-10">
        {/* header */}
        <motion.span
          className="block tracking-[0.3em] uppercase mb-4"
          style={textStyleToCss(data.kickerStyle, DEFAULT_KICKER_STYLE)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          {data.kicker}
        </motion.span>

        <motion.h2
          className="leading-[1.05] uppercase tracking-tight max-w-4xl"
          style={textStyleToCss(data.headingStyle, DEFAULT_HEADING_STYLE)}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          {data.headingBefore}
          <span
            className="drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]"
            style={textStyleToCss(data.highlightStyle, DEFAULT_HIGHLIGHT_STYLE)}
          >
            {data.headingHighlight}
          </span>
          {data.headingAfter}
        </motion.h2>

        <motion.p
          className="mt-6 max-w-3xl"
          style={textStyleToCss(data.descriptionStyle, DEFAULT_DESCRIPTION_STYLE)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
        >
          {data.description}
        </motion.p>

        {/* clip-path link grid — full width */}
        <motion.div
          className="mt-16 divide-y border divide-white/10 border-white/10 overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease, delay: 0.25 }}
        >
          {row1.length > 0 && (
            <div className="grid grid-cols-2 divide-x divide-white/10">
              {row1.map((c, i) => (
                <LinkBox key={c.id} index={i} {...c} labelStyle={labelStyle} />
              ))}
            </div>
          )}
          {row2.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {row2.map((c, i) => (
                <LinkBox key={c.id} index={i + 2} {...c} labelStyle={labelStyle} />
              ))}
            </div>
          )}
          {row3.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {row3.map((c, i) => (
                <LinkBox key={c.id} index={i + 6} {...c} labelStyle={labelStyle} />
              ))}
            </div>
          )}
          {rest.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {rest.map((c, i) => (
                <LinkBox key={c.id} index={i + 10} {...c} labelStyle={labelStyle} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}