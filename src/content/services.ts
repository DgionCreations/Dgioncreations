/**
 * Shared content shape for the /services page (and the home-page services
 * grid that uses the same card data) — imported by admin editor + renderers.
 */
import { type TextStyle } from "@/content/typography";
import { type IconKey } from "@/content/icons";
export type { TextStyle } from "@/content/typography";
export type { IconKey } from "@/content/icons";

/* ──────────────── List item types ──────────────── */

/** One card in the hero-level stats strip. */
export interface ServicesStat {
  value: string;
  label: string;
  iconKey: IconKey;
}

/** One card in the expanding services grid (also used on the home page). */
export interface ServiceCard {
  /** Stable slug — used in /service/:id routes. Do not change casually. */
  id: string;
  /** Short title, e.g. "SEO" */
  title: string;
  /** Full name, e.g. "Search Engine Optimization" */
  full: string;
  /** Short description shown when the card is expanded. */
  desc: string;
  iconKey: IconKey;
  /** Optional custom logo/icon image URL — overrides the lucide iconKey when set. */
  iconImageUrl?: string;
  /** Hero image URL — shown as the card backdrop on hover/expand. */
  imageUrl?: string;
  /** Accent color (hex) — used for card trims. */
  color: string;
  /** Overview paragraph on the detail page */
  overview?: string;
  /** Features list on the detail page */
  features?: { title: string; desc: string }[];
  /** Stats on the detail page */
  stats?: { value: string; label: string }[];
}

/** One card in the "Our Approach" 4-phase playbook. */
export interface ApproachPhase {
  /** Step number label, e.g. "01" */
  step: string;
  title: string;
  desc: string;
  iconKey: IconKey;
  /** Base card color (hex) — shown at rest. */
  base: string;
  /** Accent color (hex) — revealed on hover. */
  accent: string;
}

/** One pill in the "Industries we serve" card. */
export interface IndustryPill {
  name: string;
  color: string;
}

/** One flipping card in the "What makes us different" hover showcase. */
export interface FeaturedCard {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  frontDesc: string;
  backDesc: string;
  buttonText: string;
  buttonUrl: string;
}

/* ──────────────── Top-level content shape ──────────────── */

export interface ServicesContent {
  /* — Hero — */
  heroKicker: string;
  heroHeadlineLine1: string;
  heroHighlight: string;
  heroHeadlineLine2: string;
  heroDescription: string;
  heroCtaPrimaryLabel: string;
  heroCtaPrimaryUrl: string;
  heroCtaSecondaryLabel: string;
  heroCtaSecondaryUrl: string;

  /* — Stats strip — */
  stats: ServicesStat[];

  /* — Services grid section (also shown on home page) — */
  servicesSectionTitle: string;
  servicesSectionHighlight: string;
  services: ServiceCard[];

  /* — Approach — */
  approachKicker: string;
  approachHeadingBefore: string;
  approachHighlight: string;
  approachHeadingAfter: string;
  approachDescription: string;
  approach: ApproachPhase[];

  /* — What you get — */
  deliverablesKicker: string;
  deliverablesHeading: string;
  deliverables: string[];

  /* — Industries — */
  industriesLabel: string;
  industriesTitle: string;
  industriesDescription: string;
  industries: IndustryPill[];
  industriesCtaLabel: string;
  industriesCtaUrl: string;

  /* — Featured flipping cards — */
  featuredKicker: string;
  featuredHeadingBefore: string;
  featuredHighlight: string;
  featuredHeadingAfter: string;
  featured: FeaturedCard[];
  featuredCardTitleStyle?: TextStyle;
  featuredCardDescStyle?: TextStyle;

  /* — Testimonial — */
  testimonialQuote: string;

  /* — CTA — */
  ctaHeadingBefore: string;
  ctaHighlight: string;
  ctaHeadingAfter: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  ctaSecondaryLabel: string;
  ctaSecondaryUrl: string;

  /* — Typography slots — */
  heroKickerStyle?: TextStyle;
  heroHeadlineStyle?: TextStyle;
  heroHighlightStyle?: TextStyle;
  heroDescriptionStyle?: TextStyle;
  statValueStyle?: TextStyle;
  statLabelStyle?: TextStyle;
  servicesSectionTitleStyle?: TextStyle;
  serviceCardTitleStyle?: TextStyle;
  serviceCardDescStyle?: TextStyle;
  sectionKickerStyle?: TextStyle;
  sectionHeadingStyle?: TextStyle;
  sectionHighlightStyle?: TextStyle;
  sectionDescriptionStyle?: TextStyle;
  phaseTitleStyle?: TextStyle;
  phaseDescStyle?: TextStyle;
  deliverableItemStyle?: TextStyle;
  industryPillStyle?: TextStyle;
  testimonialQuoteStyle?: TextStyle;
  ctaHeadingStyle?: TextStyle;
  ctaHighlightStyle?: TextStyle;
  ctaDescriptionStyle?: TextStyle;
}

/** Firestore document key. */
export const SERVICES_CONTENT_KEY = "services_page";

/* ──────────────── Default text styles ──────────────── */

export const DEFAULT_HERO_KICKER_STYLE: TextStyle = { fontSize: 10, fontFamily: "inter", bold: true, color: "#837FFB" };
export const DEFAULT_HERO_HEADLINE_STYLE: TextStyle = { fontSize: 44, fontFamily: "inter", bold: true, color: "#FFFFFF" };
export const DEFAULT_HERO_HIGHLIGHT_STYLE: TextStyle = { fontSize: 96, fontFamily: "inter", bold: true, color: "#837FFB" };
export const DEFAULT_HERO_DESCRIPTION_STYLE: TextStyle = { fontSize: 20, fontFamily: "inter", color: "#FFFFFF" };
export const DEFAULT_STAT_VALUE_STYLE: TextStyle = { fontSize: 30, fontFamily: "inter", bold: true, color: "#837FFB" };
export const DEFAULT_STAT_LABEL_STYLE: TextStyle = { fontSize: 12, fontFamily: "inter", color: "#FFFFFF" };
export const DEFAULT_SERVICES_SECTION_TITLE_STYLE: TextStyle = { fontSize: 48, fontFamily: "inter", bold: true, color: "#FFFFFF" };
export const DEFAULT_SERVICE_CARD_TITLE_STYLE: TextStyle = { fontSize: 28, fontFamily: "inter", bold: true, color: "#FFFFFF" };
export const DEFAULT_SERVICE_CARD_DESC_STYLE: TextStyle = { fontSize: 14, fontFamily: "inter", color: "#FFFFFF" };
export const DEFAULT_SECTION_KICKER_STYLE: TextStyle = { fontSize: 14, fontFamily: "inter", bold: true, color: "#837FFB" };
export const DEFAULT_SECTION_HEADING_STYLE: TextStyle = { fontSize: 44, fontFamily: "inter", bold: true, color: "#FFFFFF" };
export const DEFAULT_SECTION_HIGHLIGHT_STYLE: TextStyle = { fontSize: 44, fontFamily: "inter", bold: true, color: "#837FFB" };
export const DEFAULT_SECTION_DESCRIPTION_STYLE: TextStyle = { fontSize: 16, fontFamily: "inter", color: "#FFFFFF" };
export const DEFAULT_PHASE_TITLE_STYLE: TextStyle = { fontSize: 22, fontFamily: "inter", bold: true, color: "#FFFFFF" };
export const DEFAULT_PHASE_DESC_STYLE: TextStyle = { fontSize: 14, fontFamily: "inter", color: "#FFFFFF" };
export const DEFAULT_DELIVERABLE_ITEM_STYLE: TextStyle = { fontSize: 16, fontFamily: "inter", color: "#FFFFFF" };
export const DEFAULT_INDUSTRY_PILL_STYLE: TextStyle = { fontSize: 14, fontFamily: "inter", bold: true, color: "#FFFFFF" };
export const DEFAULT_TESTIMONIAL_QUOTE_STYLE: TextStyle = { fontSize: 28, fontFamily: "inter", color: "#FFFFFF" };
export const DEFAULT_FEATURED_CARD_TITLE_STYLE: TextStyle = { fontSize: 16, fontFamily: "inter", bold: true, color: "#FFFFFF" };
export const DEFAULT_FEATURED_CARD_DESC_STYLE: TextStyle = { fontSize: 13, fontFamily: "inter", color: "rgba(255,255,255,0.7)" };
export const DEFAULT_CTA_HEADING_STYLE: TextStyle = { fontSize: 44, fontFamily: "inter", bold: true, color: "#FFFFFF" };
export const DEFAULT_CTA_HIGHLIGHT_STYLE: TextStyle = { fontSize: 44, fontFamily: "inter", bold: true, color: "#837FFB" };
export const DEFAULT_CTA_DESCRIPTION_STYLE: TextStyle = { fontSize: 18, fontFamily: "inter", color: "#FFFFFF" };

/* ──────────────── Default content ──────────────── */

export const defaultServicesContent: ServicesContent = {
  heroKicker: "Our Expertise",
  heroHeadlineLine1: "Solutions that turn",
  heroHighlight: "Ambition",
  heroHeadlineLine2: "into growth.",
  heroDescription:
    "Eight specialist practices. One integrated team. We architect strategy, design and engineering into digital products that move numbers and make noise.",
  heroCtaPrimaryLabel: "Start a Project",
  heroCtaPrimaryUrl: "/contact",
  heroCtaSecondaryLabel: "See Our Work",
  heroCtaSecondaryUrl: "/portfolio",

  stats: [
    { value: "150+",  label: "Projects Delivered",   iconKey: "rocket" },
    { value: "98%",   label: "Client Satisfaction",  iconKey: "award" },
    { value: "$50M+", label: "Ad Spend Managed",     iconKey: "bar-chart" },
    { value: "12+",   label: "Years of Experience",  iconKey: "users" },
  ],

  servicesSectionTitle: "Our",
  servicesSectionHighlight: "Services",
  services: [
    { id: "web-design", title: "Website", full: "Website Design",            iconKey: "layout",       color: "#837FFB", desc: "High-end, conversion-focused websites with immersive 3D elements, glassmorphism, and cinematic motion.", imageUrl: "https://picsum.photos/seed/website-design/800/600", overview: "We design and develop websites that are beautiful, fast, and conversion-optimized.", features: [{ title: "UX Research", desc: "User interviews and journey mapping." }], stats: [{ value: "150+", label: "Websites delivered" }] },
    { id: "web-app",    title: "Web App",  full: "Web App Development",      iconKey: "code",         color: "#06b6d4", desc: "Enterprise-grade web applications built with React, Next.js, and scalable cloud architectures for complex logic.", imageUrl: "https://picsum.photos/seed/web-app-development/800/600", overview: "Our engineering team builds robust web applications designed to handle complex business logic.", features: [{ title: "SaaS Architecture", desc: "Multi-tenant systems with secure auth." }], stats: [{ value: "40+", label: "Apps in production" }] },
    { id: "seo",        title: "SEO",      full: "Search Engine Optimization", iconKey: "search",       color: "#4ade80", desc: "Dominate search rankings with technical SEO, on-page optimization, and data-driven keyword strategies.", imageUrl: "https://picsum.photos/seed/seo-analytics/800/600", overview: "Our SEO specialists combine technical expertise with creative strategy to help your brand achieve dominant search visibility.", features: [{ title: "Technical SEO Audit", desc: "Comprehensive crawl analysis and fixes." }], stats: [{ value: "340%", label: "Average traffic increase" }] },
    { id: "smm",        title: "SMM",      full: "Social Media Marketing",     iconKey: "share",        color: "#38bdf8", desc: "Build brand authority across platforms with targeted campaigns and viral content strategies.", imageUrl: "https://picsum.photos/seed/social-media/800/600", overview: "We craft social media strategies that go beyond likes and follows.", features: [{ title: "Platform Strategy", desc: "Custom strategies for each platform." }], stats: [{ value: "5M+", label: "Impressions generated" }] },
    { id: "ppc",        title: "PPC",      full: "Pay-Per-Click Advertising",  iconKey: "bar-chart",    color: "#f59e0b", desc: "Drive high-intent traffic with precision-targeted ad campaigns across Google, Meta and LinkedIn.", imageUrl: "https://picsum.photos/seed/ppc-ads/800/600", overview: "Our performance marketing team obsesses over ROAS.", features: [{ title: "Google Ads Management", desc: "Search, Shopping, Display campaigns." }], stats: [{ value: "8.2x", label: "Average ROAS" }] },
    { id: "content",    title: "Content",  full: "Content Marketing",          iconKey: "file-text",    color: "#a855f7", desc: "Editorial strategy, long-form content, and distribution that builds trust and compounds organic reach.", imageUrl: "https://picsum.photos/seed/content-marketing/800/600", overview: "Content is the backbone of digital presence.", features: [{ title: "Content Strategy", desc: "Editorial calendars and content audits." }], stats: [{ value: "500+", label: "Articles published" }] },
    { id: "brand",      title: "Brand",    full: "Brand Identity & Strategy",  iconKey: "fingerprint",  color: "#f43f5e", desc: "Positioning, visual systems and brand architecture that set you apart and scale with you.", imageUrl: "https://picsum.photos/seed/brand-identity/800/600", overview: "Your brand is more than a logo — it's the emotional connection with your audience.", features: [{ title: "Brand Strategy", desc: "Mission, vision, values, positioning." }], stats: [{ value: "200+", label: "Brands launched" }] },
    { id: "growth",     title: "Growth",   full: "Growth Engineering",         iconKey: "line-chart",   color: "#10b981", desc: "Experimentation frameworks, CRO, and full-funnel analytics that unlock sustainable growth.", imageUrl: "https://picsum.photos/seed/growth-charts/800/600", overview: "Growth engineering is the intersection of marketing, data, and product.", features: [{ title: "Conversion Rate Optimization", desc: "Systematic A/B testing and user behavior analysis." }], stats: [{ value: "3.5x", label: "Average conversion lift" }] },
    { id: "ai",         title: "AI",       full: "AI & Automation",            iconKey: "brain",        color: "#8b5cf6", desc: "ML pipelines, NLP engines and workflow automation that take repetitive work off your plate.", imageUrl: "https://picsum.photos/seed/ai-automation/800/600", overview: "We turn GenAI hype into real, shipping software.", features: [{ title: "LLM Copilots & Chatbots", desc: "Domain-tuned assistants for support." }], stats: [{ value: "60%", label: "Support volume deflected" }] },
    { 
      id: "production", 
      title: "Production", 
      full: "Cinematic Digital Production", 
      iconKey: "video", 
      color: "#facc15", 
      desc: "High-end video production, motion design, and storytelling that captures attention and drives emotional resonance.", 
      imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop", 
      overview: "We blend cinematic techniques with digital strategy to create content that doesn't just look good — it performs. From brand films to social-first motion systems, we bring your vision to life.", 
      features: [
        { title: "Brand Storytelling", desc: "Crafting narratives that define your identity." },
        { title: "3D & Motion Graphics", desc: "High-end visual effects and animation." },
        { title: "Post-Production", desc: "Professional editing, color grading, and sound design." }
      ], 
      stats: [
        { value: "40%", label: "Average engagement boost" },
        { value: "150+", label: "Campaigns delivered" }
      ] 
    },
  ],

  approachKicker: "Our Approach",
  approachHeadingBefore: "A proven ",
  approachHighlight: "playbook",
  approachHeadingAfter: "",
  approachDescription: "Four phases. Zero fluff. Every engagement follows a clear rhythm that keeps momentum high and surprises low.",
  approach: [
    { step: "01", title: "Discover", desc: "We immerse ourselves in your business, audience and market to uncover real opportunities — not guesswork.",                      iconKey: "target",    base: "#837FFB", accent: "#1B1862" },
    { step: "02", title: "Ideate",   desc: "Cross-functional sprints where strategy, design and engineering co-create the sharpest path forward.",                         iconKey: "lightbulb", base: "#1B1862", accent: "#837FFB" },
    { step: "03", title: "Execute",  desc: "Ship fast, measure always. Weekly increments with production-grade quality from day one.",                                      iconKey: "rocket",    base: "#837FFB", accent: "#1B1862" },
    { step: "04", title: "Optimize", desc: "Data-driven iteration — A/B tests, analytics, and performance tuning until numbers tell a story worth telling.",                iconKey: "bar-chart", base: "#1B1862", accent: "#837FFB" },
  ],

  deliverablesKicker: "What You Get",
  deliverablesHeading: "Every engagement includes",
  deliverables: [
    "End-to-end strategy & roadmapping",
    "Dedicated project lead + specialist team",
    "Weekly progress reviews & async updates",
    "Fixed-scope pricing, no surprises",
    "90-day post-launch support included",
    "Full IP transfer on completion",
  ],

  industriesLabel: "Where We Play",
  industriesTitle: "Industries we serve",
  industriesDescription:
    "Our services adapt to sector-specific requirements — regulatory, scale, UX — without losing speed.",
  industries: [
    { name: "Healthcare", color: "#f43f5e" },
    { name: "Finance",    color: "#10b981" },
    { name: "E-commerce", color: "#f59e0b" },
    { name: "Education",  color: "#3b82f6" },
    { name: "Logistics",  color: "#8b5cf6" },
    { name: "SaaS",       color: "#06b6d4" },
  ],
  industriesCtaLabel: "Explore all industries",
  industriesCtaUrl: "/industries",

  featuredKicker: "Hover to Explore",
  featuredHeadingBefore: "What makes us ",
  featuredHighlight: "different",
  featuredHeadingAfter: "",
  featured: [
    {
      id: "design",
      imageSrc: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
      imageAlt: "Design Excellence",
      title: "Design Excellence",
      frontDesc: "Beautiful, intuitive designs that create meaningful connections with users.",
      backDesc: "Research-led product design, modern design systems, and interaction craft that ships production-ready work fast.",
      buttonText: "View Portfolio",
      buttonUrl: "/portfolio",
    },
    {
      id: "data",
      imageSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      imageAlt: "Data Analytics",
      title: "Data & Analytics",
      frontDesc: "Transform raw signals into insights that move the metrics your board cares about.",
      backDesc: "Event pipelines, dashboards, and experimentation frameworks wired straight into product decisions.",
      buttonText: "Learn More",
      buttonUrl: "/services",
    },
    {
      id: "engineering",
      imageSrc: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
      imageAlt: "Engineering",
      title: "Engineering Craft",
      frontDesc: "Production-grade engineering that's fast to ship and easy to maintain.",
      backDesc: "TypeScript, React, server-side rendering, edge-ready APIs, and infra that doesn't wake you up at 3am.",
      buttonText: "Our Stack",
      buttonUrl: "/process",
    },
  ],

  testimonialQuote:
    "Dgion doesn't just deliver work — we deliver leverage. Within six months we'd doubled pipeline and cut our CAC by 40%. They're the operating partner every founder wishes they had.",

  ctaHeadingBefore: "Ready to ship something ",
  ctaHighlight: "worth building",
  ctaHeadingAfter: "?",
  ctaDescription:
    "Free 30-minute strategy call. No pitch deck — just real advice for your biggest digital challenge.",
  ctaPrimaryLabel: "Book a Call",
  ctaPrimaryUrl: "/contact",
  ctaSecondaryLabel: "See Our Process",
  ctaSecondaryUrl: "/process",

  heroHeadlineStyle:         DEFAULT_HERO_HEADLINE_STYLE,
  heroHighlightStyle:        DEFAULT_HERO_HIGHLIGHT_STYLE,
  heroDescriptionStyle:      DEFAULT_HERO_DESCRIPTION_STYLE,
  statValueStyle:            DEFAULT_STAT_VALUE_STYLE,
  statLabelStyle:            DEFAULT_STAT_LABEL_STYLE,
  servicesSectionTitleStyle: DEFAULT_SERVICES_SECTION_TITLE_STYLE,
  serviceCardTitleStyle:     DEFAULT_SERVICE_CARD_TITLE_STYLE,
  serviceCardDescStyle:      DEFAULT_SERVICE_CARD_DESC_STYLE,
  sectionKickerStyle:        DEFAULT_SECTION_KICKER_STYLE,
  sectionHeadingStyle:       DEFAULT_SECTION_HEADING_STYLE,
  sectionHighlightStyle:     DEFAULT_SECTION_HIGHLIGHT_STYLE,
  sectionDescriptionStyle:   DEFAULT_SECTION_DESCRIPTION_STYLE,
  phaseTitleStyle:           DEFAULT_PHASE_TITLE_STYLE,
  phaseDescStyle:            DEFAULT_PHASE_DESC_STYLE,
  deliverableItemStyle:      DEFAULT_DELIVERABLE_ITEM_STYLE,
  industryPillStyle:         DEFAULT_INDUSTRY_PILL_STYLE,
  testimonialQuoteStyle:     DEFAULT_TESTIMONIAL_QUOTE_STYLE,
  featuredCardTitleStyle:    DEFAULT_FEATURED_CARD_TITLE_STYLE,
  featuredCardDescStyle:     DEFAULT_FEATURED_CARD_DESC_STYLE,
  ctaHeadingStyle:           DEFAULT_CTA_HEADING_STYLE,
  ctaHighlightStyle:         DEFAULT_CTA_HIGHLIGHT_STYLE,
  ctaDescriptionStyle:       DEFAULT_CTA_DESCRIPTION_STYLE,
};
