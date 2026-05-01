import { Rocket } from "lucide-react";
import { AnimatedFeatureSpotlight } from "@/components/ui/feature-spotlight";
import ScatteredText from "@/components/ui/ScatteredText";
import { useContent } from "@/lib/use-content";
import {
  CTA_CONTENT_KEY,
  defaultCtaContent,
  type CtaContent,
  DEFAULT_PREHEADER_STYLE,
  DEFAULT_HEADING_STYLE,
  DEFAULT_DESCRIPTION_STYLE,
  DEFAULT_BUTTON_STYLE,
  DEFAULT_STAT_STYLE,
} from "@/content/cta";
import { textStyleToCss } from "@/content/typography";

export default function CTASection() {
  const { data } = useContent<CtaContent>(CTA_CONTENT_KEY, defaultCtaContent);

  return (
    <div
      className="w-full py-20 md:py-28 px-4"
      style={{
        background: "#08061A",
      }}
    >
      <AnimatedFeatureSpotlight
        className="bg-[#1E1B4B] border-[rgba(131,127,251,0.2)] shadow-[0_30px_80px_rgba(0,0,0,0.3),0_0_50px_rgba(131,127,251,0.1)]"
        preheaderIcon={<Rocket className="h-4 w-4 text-[#837FFB]" />}
        preheaderText={data.preheaderText}
        heading={
          <ScatteredText
            text={data.heading}
            trigger="view"
            speed={0.04}
            style={{ color: "#FFFFFF" }}
          />
        }
        description={data.description}
        buttonText={data.buttonText}
        buttonProps={{
          className:
            "bg-[#837FFB] hover:bg-[#6c68e8] text-white shadow-[0_12px_30px_rgba(131,127,251,0.4)] hover:shadow-[0_16px_40px_rgba(131,127,251,0.55)] transition-all duration-300 hover:-translate-y-0.5",
          onClick: () => {
            const targetId = data.buttonScrollTargetId?.trim();
            if (targetId) {
              document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
            }
          },
        }}
        imageUrl={data.imageUrl}
        imageAlt={data.imageAlt}
        stats={data.stats.map((s) => s.text).filter(Boolean)}
        preheaderStyle={textStyleToCss(data.preheaderStyle, DEFAULT_PREHEADER_STYLE)}
        headingStyle={textStyleToCss(data.headingStyle, DEFAULT_HEADING_STYLE)}
        descriptionStyle={textStyleToCss(data.descriptionStyle, DEFAULT_DESCRIPTION_STYLE)}
        buttonStyle={textStyleToCss(data.buttonStyle, DEFAULT_BUTTON_STYLE)}
        statStyle={textStyleToCss(data.statStyle, DEFAULT_STAT_STYLE)}
      />
    </div>
  );
}
