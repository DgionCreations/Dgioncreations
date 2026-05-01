import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import GooeyNav from "./GooeyNav";
import { LiquidButton, LiquidGlassFilter } from "@/components/ui/liquid-glass-button";
import { useContent } from "@/lib/use-content";
import { NAVBAR_CONTENT_KEY, defaultNavbarContent, type NavbarContent } from "@/content/navbar";
import { textStyleToCss } from "@/content/typography";
import { PremiumButton } from "@/components/ui/PremiumButton";

export default function Navbar() {
  const { data } = useContent<NavbarContent>(NAVBAR_CONTENT_KEY, defaultNavbarContent);
  const [open, setOpen] = useState(false);

  // Mouse tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["2deg", "-2deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <nav className="fixed top-8 left-0 right-0 z-50 flex justify-center w-full px-6">
      <LiquidGlassFilter />
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full"
      >
        {/* Main Body - Stretched Oval with background RESTORED for readability */}
        <div className="relative w-full px-5 md:px-10 py-2 bg-[#22175A]/80 backdrop-blur-3xl rounded-[100px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between min-h-[70px] md:min-h-[80px]">
          
          {/* Logo Section - New Dgion Logo */}
          <Link to={data.logoHref} className="flex items-center group shrink-0 min-w-[100px] md:min-w-[120px]">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-white tracking-tight text-xl md:text-2xl"
              style={textStyleToCss(data.logoStyle)}
            >
              {data.logoText}
            </motion.span>
            <div className="ml-1 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#837FFB] opacity-0 group-hover:opacity-100 transition-opacity self-end mb-2 md:mb-2.5" />
          </Link>

          {/* Desktop Links - Flex Centered to prevent overlap */}
          <div className="hidden xl:flex items-center justify-center flex-1 mx-2 h-full pb-1">
            <GooeyNav 
              items={(data.links.some(l => l.href === "/reviews") 
                ? data.links 
                : [...data.links, { label: "Reviews", href: "/reviews" }]
              ).map(l => ({
                ...l,
                href: l.href.startsWith("http") || l.href.startsWith("/") ? l.href : (l.href.startsWith("#") ? `/${l.href}` : `/${l.href}`)
              }))} 
              textStyle={data.linksStyle} 
            />
          </div>
 
          {/* Action Button - Right Corner */}
          <div className="hidden md:flex items-center justify-end gap-4 shrink-0 relative z-20 min-w-[150px] md:min-w-[180px]">
            <PremiumButton href={data.ctaHref} className="!h-9 md:!h-10 !px-4 md:!px-5 whitespace-nowrap text-xs md:text-sm">
              {data.ctaText}
            </PremiumButton>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setOpen(!open)} className="xl:hidden text-white p-2">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute top-full left-0 right-0 mt-4 bg-[#22175A]/98 backdrop-blur-3xl rounded-[50px] border border-[#837FFB]/20 p-10 flex flex-col gap-6 shadow-2xl z-[100]"
          >
            {(data.links.some(l => l.href === "/reviews") 
              ? data.links 
              : [...data.links, { label: "Reviews", href: "/reviews" }]
            ).map((l) => (
              <Link
                key={l.label}
                to={l.href}
                onClick={() => setOpen(false)}
                className="transition-colors py-3 font-black text-xl flex justify-between items-center"
                style={textStyleToCss(data.linksStyle)}
              >
                {l.label}
                <span className="opacity-30">→</span>
              </Link>
            ))}
            <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
                <Link
                  to={data.ctaHref}
                  onClick={() => setOpen(false)}
                  className="glow-button text-center !py-4 rounded-3xl"
                  style={textStyleToCss(data.ctaStyle)}
                >
                  {data.ctaText}
                </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </nav>
  );
}
