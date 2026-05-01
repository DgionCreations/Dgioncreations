import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface SkewCardItem {
  title: string;
  desc: string;
  gradientFrom: string;
  gradientTo: string;
  /** Route path — clicking anywhere on the card (or the CTA button) navigates here */
  to: string;
  /** Optional icon rendered in the content panel */
  icon?: ReactNode;
  /** Custom label for the CTA button (defaults to "Explore") */
  ctaLabel?: string;
}

interface SkewCardsProps {
  items: SkewCardItem[];
  className?: string;
}

/**
 * SkewCards — animated gradient cards with a skewed back-panel that morphs on hover,
 * blur halos that drift into view, and a glass content slab that shifts left.
 *
 * Each card takes a `to` route and wraps everything in a react-router `<Link>`.
 */
export default function SkewCards({ items, className = "" }: SkewCardsProps) {
  return (
    <>
      <div className={`flex justify-center items-stretch flex-wrap ${className}`}>
        {items.map(({ title, desc, gradientFrom, gradientTo, to, icon, ctaLabel }, idx) => (
          <Link
            key={idx}
            to={to}
            className="group relative w-[320px] h-[400px] m-[40px_30px] transition-all duration-500 block"
          >
            {/* Skewed gradient panel */}
            <span
              className="absolute top-0 left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)]"
              style={{
                background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
              }}
            />

            {/* Blurred skewed twin — glow layer */}
            <span
              className="absolute top-0 left-[50px] w-1/2 h-full rounded-lg transform skew-x-[15deg] blur-[30px] transition-all duration-500 group-hover:skew-x-0 group-hover:left-[20px] group-hover:w-[calc(100%-90px)]"
              style={{
                background: `linear-gradient(315deg, ${gradientFrom}, ${gradientTo})`,
              }}
            />

            {/* Animated blur dots that drift into view on hover */}
            <span className="pointer-events-none absolute inset-0 z-10">
              <span className="absolute top-0 left-0 w-0 h-0 rounded-lg opacity-0 bg-white/10 backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all duration-500 animate-skew-blob group-hover:top-[-50px] group-hover:left-[50px] group-hover:w-[100px] group-hover:h-[100px] group-hover:opacity-100" />
              <span className="absolute bottom-0 right-0 w-0 h-0 rounded-lg opacity-0 bg-white/10 backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-all duration-500 animate-skew-blob animation-delay-skew-1000 group-hover:bottom-[-50px] group-hover:right-[50px] group-hover:w-[100px] group-hover:h-[100px] group-hover:opacity-100" />
            </span>

            {/* Content slab */}
            <div className="relative z-20 left-0 p-[20px_40px] bg-white/5 backdrop-blur-[10px] shadow-lg rounded-lg text-white transition-all duration-500 group-hover:left-[-25px] group-hover:p-[60px_40px]">
              {icon && <div className="mb-4">{icon}</div>}
              <h2 className="text-2xl font-bold mb-3">{title}</h2>
              <p className="text-[15px] leading-relaxed mb-5 text-white/75">{desc}</p>
              <span
                className="inline-block text-sm font-bold text-black bg-white px-4 py-2 rounded hover:bg-[#ffcf4d] hover:shadow-md transition-colors"
              >
                {ctaLabel ?? "Explore"}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Component-scoped keyframes — prefixed to avoid collisions with other blob animations */}
      <style>{`
        @keyframes skew-blob {
          0%, 100% { transform: translateY(10px); }
          50% { transform: translate(-10px); }
        }
        .animate-skew-blob { animation: skew-blob 2s ease-in-out infinite; }
        .animation-delay-skew-1000 { animation-delay: -1s; }
      `}</style>
    </>
  );
}