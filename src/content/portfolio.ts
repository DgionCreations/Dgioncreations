import { type TextStyle } from "./typography";

export const PORTFOLIO_CONTENT_KEY = "portfolio_content";

export interface PortfolioMetric {
  value: string;
  label: string;
  iconKey: string;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  
  // Detail Page Fields
  client: string;
  industry: string;
  tagline: string;
  stats: { value: string; label: string }[];
  challenge: string;
  solution: string;
  results: string;
  features: string[];
  tech: string[];

  // Typography Styles
  titleStyle?: TextStyle;
  taglineStyle?: TextStyle;
  headingStyle?: TextStyle;
  bodyStyle?: TextStyle;
}

export interface PortfolioOutcome {
  metric: string;
  title: string;
  desc: string;
  tag: string;
  color: string;
}

export interface PortfolioTestimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

export interface PortfolioContent {
  // Hero
  heroKicker: string;
  heroKickerStyle?: TextStyle;
  heroTitle: string;
  heroTitleStyle?: TextStyle;
  heroHighlight: string;
  heroHighlightStyle?: TextStyle;
  heroDesc: string;
  heroDescStyle?: TextStyle;

  // Metrics
  metrics: PortfolioMetric[];

  // Projects (Case Studies)
  projects: PortfolioProject[];

  // Outcomes
  outcomes: PortfolioOutcome[];

  // Testimonials
  testimonials: PortfolioTestimonial[];
}

export const DEFAULT_HERO_KICKER_STYLE: TextStyle = { fontSize: 14, fontFamily: "inter", bold: true, color: "#837FFB" };
export const DEFAULT_HERO_TITLE_STYLE: TextStyle = { fontSize: 64, fontFamily: "inter", bold: true, color: "#FFFFFF" };
export const DEFAULT_HERO_HIGHLIGHT_STYLE: TextStyle = { fontSize: 64, fontFamily: "inter", bold: true, color: "#837FFB" };
export const DEFAULT_HERO_DESC_STYLE: TextStyle = { fontSize: 20, fontFamily: "inter", color: "rgba(255,255,255,0.55)" };

// Project Detail Defaults
export const DEFAULT_PROJECT_TITLE_STYLE: TextStyle = { fontSize: 80, fontFamily: "inter", bold: true, color: "#FFFFFF", italic: true };
export const DEFAULT_PROJECT_TAGLINE_STYLE: TextStyle = { fontSize: 24, fontFamily: "inter", color: "rgba(255,255,255,0.5)" };
export const DEFAULT_PROJECT_HEADING_STYLE: TextStyle = { fontSize: 24, fontFamily: "inter", bold: true, color: "#FFFFFF", italic: true };
export const DEFAULT_PROJECT_BODY_STYLE: TextStyle = { fontSize: 18, fontFamily: "inter", color: "rgba(255,255,255,0.6)" };

export const defaultPortfolioContent: PortfolioContent = {
  heroKicker: "Our Work",
  heroTitle: "Proof, not ",
  heroHighlight: "promises",
  heroDesc: "A curated selection of products we've architected, designed and engineered — each with the numbers that back it up.",
  
  metrics: [
    { value: "150+",  label: "Projects Shipped",     iconKey: "trophy" },
    { value: "3.2×",  label: "Avg Conversion Boost", iconKey: "trending-up" },
    { value: "$200M+", label: "Revenue Impact",       iconKey: "dollar-sign" },
    { value: "25+",   label: "Countries Launched",   iconKey: "globe" },
  ],

  projects: [
    {
      id: "dgion-commerce",
      slug: "dgion-commerce",
      title: "LuxeBrand Engine",
      category: "E-commerce",
      client: "LuxeBrand",
      industry: "Luxury Retail",
      tagline: "Headless Commerce for Global Scale",
      description: "Dgion architected a custom headless commerce ecosystem for LuxeBrand, resulting in a 3.2x conversion lift and sub-1s load times across 45 countries.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&h=900&fit=crop",
      tech: ["Next.js", "Three.js", "GraphQL", "Stripe", "AWS"],
      features: [
        "Custom 3D product visualization engine",
        "AI-driven personalization layer",
        "Multi-region inventory orchestration",
        "Edge-cached global checkout system",
      ],
      stats: [
        { label: "Conversion Lift", value: "3.2x" },
        { label: "Page Load", value: "<0.8s" },
        { label: "Markets", value: "45" },
        { label: "Uptime", value: "99.99%" },
      ],
      challenge: "LuxeBrand needed a high-performance storefront that could maintain a premium aesthetic while handling massive global traffic with zero latency.",
      solution: "We deployed a Next.js powered headless stack with a custom WebGL product previewer and a globally distributed API layer.",
      results: "Launched in 12 weeks, the platform doubled average session duration and boosted annual digital revenue by 40%.",
    },
    {
      id: "fintech-pro",
      slug: "fintech-pro",
      title: "FinFlow Dashboard",
      category: "Fintech",
      client: "FinFlow",
      industry: "Finance",
      tagline: "Real-time Trading Intelligence",
      description: "A high-frequency trading dashboard with real-time risk modeling and predictive AI insights, built by Dgion for institutional-grade reliability.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&h=900&fit=crop",
      tech: ["React", "Python", "Redis", "Kafka", "D3.js"],
      features: [
        "Sub-50ms data visualization latency",
        "AI-powered predictive risk scoring",
        "Institutional-grade security protocols",
        "Multi-asset portfolio monitoring",
      ],
      stats: [
        { label: "Latency", value: "<50ms" },
        { label: "Daily Volume", value: "$2B+" },
        { label: "Alert Accuracy", value: "94%" },
        { label: "Downtime", value: "Zero" },
      ],
      challenge: "Institutional traders required a zero-latency interface to monitor market volatility and execute high-stakes trades in real-time.",
      solution: "Dgion engineered a streaming data pipeline using Kafka and a custom React-based canvas renderer for ultra-fast visual updates.",
      results: "The dashboard now processes $2B in daily volume with zero reported outages in the first year of operation.",
    },
    {
      id: "health-plus",
      slug: "health-plus",
      title: "MediSync AI",
      category: "Healthcare",
      client: "MediSync",
      industry: "Healthcare",
      tagline: "Neural Telemedicine Platform",
      description: "Dgion developed a HIPAA-compliant telemedicine platform with an integrated AI diagnostic assistant serving 500K+ patients globally.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&h=900&fit=crop",
      tech: ["React Native", "FastAPI", "PostgreSQL", "WebRTC", "TensorFlow"],
      features: [
        "AI-assisted patient triage engine",
        "HD multi-peer video consultations",
        "Encrypted EHR synchronization",
        "Automated billing & insurance claims",
      ],
      stats: [
        { label: "Patients", value: "500K+" },
        { label: "Wait Time", value: "-60%" },
        { label: "Diagnosis Speed", value: "+45%" },
        { label: "Compliance", value: "100%" },
      ],
      challenge: "The provider needed to scale remote care while maintaining strict data privacy and providing doctors with better diagnostic tools.",
      solution: "We built a secure, cloud-native platform with on-device ML for real-time symptom analysis and encrypted WebRTC video.",
      results: "Reduced average patient wait times by 60% and expanded care access to underserved rural regions.",
    },
  ],

  outcomes: [
    {
      metric: "3.2×",
      title: "Conversion lift for ShopVerse",
      desc: "Headless commerce migration with AI-personalised recommendations pushed conversion from 1.1% to 3.5% in 90 days.",
      tag: "E-commerce",
      color: "#f59e0b",
    },
    {
      metric: "35%",
      title: "Fuel savings for LogiTrack",
      desc: "AI route optimisation across 8K+ vehicles. Predictive maintenance cut unplanned downtime by 60%.",
      tag: "Logistics",
      color: "#8b5cf6",
    },
    {
      metric: "500K",
      title: "Patients on MediSync",
      desc: "HIPAA-compliant telemedicine across 12 countries with 99.99% uptime and sub-2s response times.",
      tag: "Healthcare",
      color: "#f43f5e",
    },
    {
      metric: "+34%",
      title: "Score improvement, EduNeural",
      desc: "Neural adaptive learning engine pushed completion rates from 52% to 89% across 200+ subjects.",
      tag: "Education",
      color: "#3b82f6",
    },
  ],

  testimonials: [
    {
      quote: "Six months in, they've shipped more than our previous agency did in a year — and the code quality is 10× better.",
      author: "Marcus Webb",
      role: "CTO, FinFlow",
      rating: 5,
    },
    {
      quote: "They treat our product like it's theirs. Dedicated Slack, weekly demos, no hidden hours. It's a partnership, not a vendor.",
      author: "Priya Patel",
      role: "Head of Product, ShopVerse",
      rating: 5,
    },
    {
      quote: "From discovery to launch in 11 weeks. Zero bugs in production for the first month. These folks know what they're doing.",
      author: "Dr. Jenna Liu",
      role: "CEO, MediSync",
      rating: 5,
    },
  ],
};
