import { type TextStyle } from "./typography";

export const PROCESS_CONTENT_KEY = "process_content";

export interface ProcessStep {
  number: string;
  iconKey: string;
  label: string;
  title: string;
  desc: string;
  bg: string;
  numColor: string;
  accent: string;
  borderColor: string;
  glowColor: string;
}

export interface ProcessContent {
  // Hero
  heroKicker: string;
  heroKickerStyle?: TextStyle;
  heroTitle: string;
  heroTitleStyle?: TextStyle;
  heroHighlight: string;
  heroHighlightStyle?: TextStyle;

  // Steps
  steps: ProcessStep[];

  // Badges
  badges: string[];
}

export const DEFAULT_PROCESS_KICKER_STYLE: TextStyle = { fontSize: 14, fontFamily: "inter", bold: true, color: "#837FFB" };
export const DEFAULT_PROCESS_TITLE_STYLE: TextStyle = { fontSize: 48, fontFamily: "inter", bold: true, color: "#FFFFFF" };
export const DEFAULT_PROCESS_HIGHLIGHT_STYLE: TextStyle = { fontSize: 48, fontFamily: "inter", bold: true, color: "#837FFB" };

export const defaultProcessContent: ProcessContent = {
  heroKicker: "OUR BLUEPRINT",
  heroTitle: "The Dgion ",
  heroHighlight: "Playbook",
  
  steps: [
    {
      number: "1",
      iconKey: "search",
      label: "Discover",
      title: "Research & Strategy",
      desc: "Deep research into your market, audience, and competition to define a winning digital strategy and roadmap.",
      bg: "linear-gradient(145deg, #1b3d2a 0%, #142e20 40%, #0c1f16 100%)",
      numColor: "rgba(74,222,128,0.3)",
      accent: "#4ade80",
      borderColor: "rgba(74,222,128,0.18)",
      glowColor: "rgba(74,222,128,0.08)",
    },
    {
      number: "2",
      iconKey: "palette",
      label: "Design",
      title: "UI/UX & Prototyping",
      desc: "Pixel-perfect interfaces with wireframes, prototypes, and user-tested visual systems that delight users.",
      bg: "linear-gradient(145deg, #163838 0%, #112c2c 40%, #0b1e1e 100%)",
      numColor: "rgba(45,212,191,0.3)",
      accent: "#2dd4bf",
      borderColor: "rgba(45,212,191,0.18)",
      glowColor: "rgba(45,212,191,0.08)",
    },
    {
      number: "3",
      iconKey: "code",
      label: "Develop",
      title: "Engineering & Testing",
      desc: "Scalable engineering with modern frameworks, CI/CD pipelines, and rigorous code review processes.",
      bg: "linear-gradient(145deg, #162a3d 0%, #111f2e 40%, #0b1520 100%)",
      numColor: "rgba(56,189,248,0.3)",
      accent: "#38bdf8",
      borderColor: "rgba(56,189,248,0.18)",
      glowColor: "rgba(56,189,248,0.08)",
    },
    {
      number: "4",
      iconKey: "rocket",
      label: "Deploy",
      title: "Launch & Monitoring",
      desc: "Zero-downtime deployment with real-time monitoring, observability dashboards and rollback safety.",
      bg: "linear-gradient(145deg, #291a3d 0%, #1f112e 40%, #150b20 100%)",
      numColor: "rgba(168,85,247,0.3)",
      accent: "#a855f7",
      borderColor: "rgba(168,85,247,0.18)",
      glowColor: "rgba(168,85,247,0.08)",
    },
    {
      number: "5",
      iconKey: "trending-up",
      label: "Scale",
      title: "Growth & Optimization",
      desc: "Performance tuning, global CDN, analytics — expand to millions of users without a single outage.",
      bg: "linear-gradient(145deg, #231a3d 0%, #1a1130 40%, #120b22 100%)",
      numColor: "rgba(131,127,251,0.3)",
      accent: "#837FFB",
      borderColor: "rgba(131,127,251,0.18)",
      glowColor: "rgba(131,127,251,0.08)",
    },
  ],

  badges: ["End-to-End Execution", "5 Step Framework"],
};
