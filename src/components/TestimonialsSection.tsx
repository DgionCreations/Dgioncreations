import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";

import { useContent } from "@/lib/use-content";
import { 
  TESTIMONIALS_CONTENT_KEY, 
  defaultTestimonialsContent, 
  type TestimonialsContent,
  DEFAULT_QUOTE_STYLE,
  DEFAULT_AUTHOR_STYLE
} from "@/content/testimonials";
import { textStyleToCss } from "@/content/typography";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function ReviewCard({ t }: { t: any }) {
  return (
    <div
      className="review-card flex flex-col justify-between select-none"
      style={{
        width: "min(360px, 86vw)",
        height: 240,
        borderRadius: 20,
        padding: "clamp(18px, 4vw, 28px) clamp(18px, 4vw, 28px) clamp(16px, 3.5vw, 24px)",
        background:
          "linear-gradient(145deg, rgba(131,127,251,0.2) 0%, rgba(27,20,74,0.95) 100%)",
        border: "1px solid rgba(131,127,251,0.4)",
        boxShadow:
          "0 25px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15)",
      }}
    >
      {/* top row: stars + quote icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#837FFB] text-[#837FFB]" />
          ))}
        </div>
        <Quote className="w-5 h-5 text-[#837FFB]/30" />
      </div>

      {/* quote */}
      <p
        style={{
          ...textStyleToCss(t.quoteStyle, DEFAULT_QUOTE_STYLE),
          flex: 1,
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* author */}
      <div className="flex items-center gap-3 mt-5">
        {/* avatar */}
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{
            width: 38,
            height: 38,
            background: "linear-gradient(135deg, #837FFB, #5B57F5)",
            boxShadow: "0 0 12px rgba(131,127,251,0.3)",
          }}
        >
          <span className="text-white text-xs font-bold">{t.avatar}</span>
        </div>
        <div>
          <p style={textStyleToCss(t.authorStyle, DEFAULT_AUTHOR_STYLE)}>
            {t.name}
          </p>
          <p
            style={{
              color: "rgba(131,127,251,0.55)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            {t.role}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const { data } = useContent<TestimonialsContent>(TESTIMONIALS_CONTENT_KEY, defaultTestimonialsContent);
  const cardItems = data.testimonials.map((t, i) => <ReviewCard key={i} t={t} />);

  return (
    <section
      className="relative w-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)",
      }}
    >
      {/* header */}
      {!hideHeader && (
        <motion.div
          className="text-center pt-16 sm:pt-20 md:pt-24 pb-6 px-4 relative z-10"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span 
            className="text-[#837FFB] text-sm font-bold tracking-[0.3em] uppercase block"
            style={textStyleToCss(data.heroKickerStyle)}
          >
            {data.heroKicker}
          </span>
          <h2 
            className="mt-4 text-white text-4xl md:text-5xl font-bold"
            style={textStyleToCss(data.heroTitleStyle)}
          >
            {data.heroTitle}{" "}
            <span 
              className="text-[#837FFB] drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]"
              style={textStyleToCss(data.heroHighlightStyle)}
            >
              {data.heroHighlight}
            </span>
          </h2>
        </motion.div>
      )}

      {/* full-screen 3D marquee */}
      <ThreeDMarquee items={cardItems} className="h-[70vh] sm:h-[80vh] md:h-[100vh]" />
    </section>
  );
}