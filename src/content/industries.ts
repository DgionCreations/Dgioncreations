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

export interface IndustriesContent {
  // Hero
  heroTitle: string;
  heroTitleStyle?: TextStyle;
  heroHighlight: string;
  heroHighlightStyle?: TextStyle;

  // Industries
  industries: Industry[];
}

export const DEFAULT_INDUSTRIES_TITLE_STYLE: TextStyle = { fontSize: 48, fontFamily: "inter", bold: true, color: "#FFFFFF" };
export const DEFAULT_INDUSTRIES_HIGHLIGHT_STYLE: TextStyle = { fontSize: 48, fontFamily: "inter", bold: true, color: "#837FFB" };

export const defaultIndustriesContent: IndustriesContent = {
  heroTitle: "Sectors We ",
  heroHighlight: "Empower",
  
  industries: [
    {
      iconKey: "heart",
      label: "Healthcare",
      desc: "HIPAA-compliant platforms, telemedicine, health data analytics, and patient management systems that improve outcomes at scale.",
      accent: "#F43F5E",
      glow: "rgba(244,63,94,0.35)",
      glassBg: "rgba(244,63,94,0.07)",
      glassBorder: "rgba(244,63,94,0.25)",
      tag: "MedTech",
    },
    {
      iconKey: "dollar-sign",
      label: "Finance",
      desc: "Fintech solutions, secure payment gateways, trading platforms, and real-time regulatory compliance tools for modern institutions.",
      accent: "#10B981",
      glow: "rgba(16,185,129,0.35)",
      glassBg: "rgba(16,185,129,0.07)",
      glassBorder: "rgba(16,185,129,0.25)",
      tag: "FinTech",
    },
    {
      iconKey: "shopping-cart",
      label: "E-commerce",
      desc: "Scalable storefronts, AI-driven inventory management, hyper-personalised recommendations, and friction-free checkout optimisation.",
      accent: "#F59E0B",
      glow: "rgba(245,158,11,0.35)",
      glassBg: "rgba(245,158,11,0.07)",
      glassBorder: "rgba(245,158,11,0.25)",
      tag: "Retail",
    },
    {
      iconKey: "graduation-cap",
      label: "Education",
      desc: "LMS platforms, interactive learning tools, virtual classrooms, and adaptive student-analytics dashboards for K-12 and beyond.",
      accent: "#3B82F6",
      glow: "rgba(59,130,246,0.35)",
      glassBg: "rgba(59,130,246,0.07)",
      glassBorder: "rgba(59,130,246,0.25)",
      tag: "EdTech",
    },
    {
      iconKey: "truck",
      label: "Logistics",
      desc: "Fleet management, AI route optimisation, real-time tracking, and end-to-end supply-chain automation that cuts costs by 35%.",
      accent: "#8B5CF6",
      glow: "rgba(139,92,246,0.35)",
      glassBg: "rgba(139,92,246,0.07)",
      glassBorder: "rgba(139,92,246,0.25)",
      tag: "Supply Chain",
    },
  ],
};
