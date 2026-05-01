import { GlassButton } from "@/components/ui/glass-button";
import { Zap } from "lucide-react";

const DottedBackground = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="100%"
    width="100%"
    className="pointer-events-none absolute inset-0 z-0"
  >
    <defs>
      <pattern
        patternUnits="userSpaceOnUse"
        height="30"
        width="30"
        id="dottedGrid"
      >
        <circle
          fill="rgba(255,255,255,0.1)"
          r="1"
          cy="2"
          cx="2"
        ></circle>
      </pattern>
    </defs>
    <rect fill="url(#dottedGrid)" height="100%" width="100%"></rect>
  </svg>
);

const GlassButtonDemo = () => {
  return (
    <div className="relative flex min-h-[400px] w-full flex-col items-center justify-center gap-8 bg-[#08061A] p-10 rounded-3xl overflow-hidden border border-white/5">
      <DottedBackground />
      <div className="z-10 text-center">
        <h2 className="text-white font-bold text-2xl mb-8 tracking-tight">Premium Glass Buttons</h2>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
          <GlassButton
            size="sm"
          >
            Small
          </GlassButton>
          <GlassButton
            size="default"
            contentClassName="flex items-center gap-2"
          >
            <span>Generate</span>
            <Zap className="h-5 w-5" />
          </GlassButton>
          <GlassButton
            size="lg"
          >
            Submit
          </GlassButton>
          <GlassButton
            size="icon"
          >
            <Zap className="h-5 w-5" />
          </GlassButton>
        </div>
      </div>
    </div>
  );
};

export default GlassButtonDemo;
