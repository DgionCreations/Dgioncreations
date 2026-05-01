import { type TextStyle } from "./typography";

export const INDUSTRIES_CONTENT_KEY = "industries_content";

export interface Industry {
  iconKey: string;
  label: string;
  desc: string;
  accent: string;
  glow: string;
  glassBg: string;
  glassBorder: string;
  tag: string;
}

export interface DeepDiveSector {
  iconKey: string;
  label: string;
  desc: string;
  tag: string;
  color: string;
  wins: string[];
}

export interface IndustriesContent {
  // Hero
  heroTitle: string;
  heroTitleStyle?: TextStyle;
  heroHighlight: string;
  heroHighlightStyle?: TextStyle;

  // Industries
  industries: Industry[];

  // Deep Dive
  deepDiveTitle: string;
  deepDiveSectors: DeepDiveSector[];
}

export const DEFAULT_INDUSTRIES_TITLE_STYLE: TextStyle = { fontSize: 48, fontFamily: "inter", bold: true, color: "#FFFFFF" };
export const DEFAULT_INDUSTRIES_HIGHLIGHT_STYLE: TextStyle = { fontSize: 48, fontFamily: "inter", bold: true, color: "#837FFB" };

export const defaultIndustriesContent: IndustriesContent = {
  heroTitle: "Sectors We ",
  heroHighlight: "Empower",
  
  industries: [
    {
      iconKey: "briefcase",
      label: "Strategic Business",
      desc: "End-to-end operational scaling, AI-driven resource planning, and bespoke workflow automation for modern enterprises.",
      accent: "#837FFB",
      glow: "rgba(131,127,251,0.35)",
      glassBg: "rgba(131,127,251,0.07)",
      glassBorder: "rgba(131,127,251,0.25)",
      tag: "Enterprise",
    },
    {
      iconKey: "bar-chart",
      label: "Digital Markets",
      desc: "High-performance trading environments, automated market making, and real-time data analytics for the digital economy.",
      accent: "#10B981",
      glow: "rgba(16,185,129,0.35)",
      glassBg: "rgba(16,185,129,0.07)",
      glassBorder: "rgba(16,185,129,0.25)",
      tag: "Growth",
    },
    {
      iconKey: "server",
      label: "IT Industries",
      desc: "Next-gen cloud architecture, cybersecurity hardening, and AI-native toolchains for heavy-duty IT environments.",
      accent: "#06B6D4",
      glow: "rgba(6,182,212,0.35)",
      glassBg: "rgba(6,182,212,0.07)",
      glassBorder: "rgba(6,182,212,0.25)",
      tag: "Infrastructure",
    },
  ],

  deepDiveTitle: "Where we've won",
  deepDiveSectors: [
    {
      iconKey: "briefcase",
      label: "Strategic Business",
      tag: "Enterprise",
      desc: "End-to-end operational scaling, AI-driven resource planning, and bespoke workflow automation for modern enterprises.",
      color: "#837FFB",
      wins: ["45% efficiency gain", "12+ Fortune 500s", "Global scale"],
    },
    {
      iconKey: "bar-chart",
      label: "Digital Markets",
      tag: "Growth",
      desc: "High-performance trading environments, automated market making, and real-time data analytics for the digital economy.",
      color: "#10B981",
      wins: ["$2B+ processed", "<10ms latency", "24/7 reliability"],
    },
    {
      iconKey: "server",
      label: "IT Industries",
      tag: "Infrastructure",
      desc: "Next-gen cloud architecture, cybersecurity hardening, and AI-native toolchains for heavy-duty IT environments.",
      color: "#06B6D4",
      wins: ["Zero-trust security", "99.999% uptime", "AI-optimized"],
    },
  ],
};
