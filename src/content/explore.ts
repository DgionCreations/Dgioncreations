/**
 * Shared content shape for the "Explore Dgion" 6-card stacked section on the
 * home page — imported by both the admin editor (for the form) and the
 * HomeOverview component (for rendering). Keep the two in sync by extending
 * this file.
 *
 * Typography primitives (TextStyle, FontFamily, FONT_FAMILIES, etc.) live in
 * `src/content/typography.ts` and are shared across every editor.
 */
import { type TextStyle } from "@/content/typography";
export type { TextStyle } from "@/content/typography";

export interface ExploreCard {
  /** Stable slug — used as React key + referenced by URL. Do not rename. */
  id: string;
  /** Small pre-title shown above the panel heading, e.g. "Services" */
  eyebrow: string;
  /** Big heading rendered inside the dark pill */
  title: string;
  /** Tiny uppercase badge pill on top of the content block */
  badge: string;
  /** One-line summary paragraph */
  summary: string;
  /** Destination route (relative) the "VIEW X" CTA links to */
  url: string;
  /** Background image URL for the panel (full-bleed, ken-burns zoomed) */
  image: string;
  /** NEW: Optimized image URL specifically for the alternating details section below */
  detailsImage?: string;
  /** Accent color — badge background + brand touches (hex) */
  accent: string;
  /** Deep base tint behind the image — controls gradient + fallback (hex) */
  tint: string;
  /** Typography for the big title pill */
  titleStyle?: TextStyle;
  /** Typography for the summary paragraph */
  summaryStyle?: TextStyle;
}

export interface ExploreContent {
  /** Small kicker above the main heading */
  kicker: string;
  /** Main heading line 1 (plain text portion before the highlight) */
  headingBefore: string;
  /** Highlighted word (gets the glowing purple treatment) */
  headingHighlight: string;
  /** Heading line continuation after the highlight */
  headingAfter: string;
  /** Typography for the plain-text portions of the main heading */
  headingStyle?: TextStyle;
  /** Typography for the highlighted word — kept independent so it can tower */
  highlightStyle?: TextStyle;
  /** Ordered list of 6 cards shown in the stacked pin */
  cards: ExploreCard[];
  /** NEW: Kicker for the alternating details section below */
  detailsKicker: string;
  /** NEW: Details heading line 1 */
  detailsHeadingBefore: string;
  /** NEW: Details heading highlighted word */
  detailsHeadingHighlight: string;
  /** NEW: Details heading line continuation */
  detailsHeadingAfter: string;
  /** NEW: Typography for the plain-text portions of the details heading */
  detailsHeadingStyle?: TextStyle;
  /** NEW: Typography for the highlighted word in the details heading */
  detailsHighlightStyle?: TextStyle;
  /** NEW: Independent list of 4 cards specifically for the alternating pillars section */
  pillarCards: ExploreCard[];
}

/** Firestore document key — `content/{EXPLORE_CONTENT_KEY}` */
export const EXPLORE_CONTENT_KEY = "home_explore";

/* ───────────── Default text styles ─────────────
 * Pixel sizes chosen to roughly match the old hardcoded Tailwind scale at
 * typical desktop viewports, so upgrading Firestore docs in place (without
 * re-saving) still looks like the original design.
 */
export const DEFAULT_HEADING_STYLE: TextStyle = {
  fontSize: 48,
  fontFamily: "inter",
  bold: true,
  color: "#FFFFFF",
};

export const DEFAULT_HIGHLIGHT_STYLE: TextStyle = {
  fontSize: 48,
  fontFamily: "inter",
  bold: true,
  color: "#837FFB",
};

export const DEFAULT_CARD_TITLE_STYLE: TextStyle = {
  fontSize: 80,
  fontFamily: "inter",
  bold: true,
  color: "#FFFFFF",
};

export const DEFAULT_CARD_SUMMARY_STYLE: TextStyle = {
  fontSize: 18,
  fontFamily: "inter",
  color: "#FFFFFF",
};

export const defaultExploreContent: ExploreContent = {
  kicker: "Explore Dgion",
  headingBefore: "Everything you ",
  headingHighlight: "need",
  headingAfter: ", one click away",
  headingStyle: DEFAULT_HEADING_STYLE,
  highlightStyle: DEFAULT_HIGHLIGHT_STYLE,
  cards: [
    {
      id: "services",
      eyebrow: "Services",
      title: "Services",
      badge: "Capabilities",
      summary:
        "SEO, performance marketing, brand identity, UX — eight specialist practices, one team.",
      url: "/services",
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1800&h=1000&fit=crop",
      accent: "#837FFB",
      tint: "#000000",
      titleStyle: DEFAULT_CARD_TITLE_STYLE,
      summaryStyle: DEFAULT_CARD_SUMMARY_STYLE,
    },
    {
      id: "portfolio",
      eyebrow: "Portfolio",
      title: "Portfolio",
      badge: "Case studies",
      summary:
        "Real projects shipped across 5 industries with numbers that moved and clients who came back.",
      url: "/portfolio",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1800&h=1000&fit=crop",
      accent: "#f43f5e",
      tint: "#000000",
      titleStyle: DEFAULT_CARD_TITLE_STYLE,
      summaryStyle: DEFAULT_CARD_SUMMARY_STYLE,
    },
    {
      id: "process",
      eyebrow: "Process",
      title: "Process",
      badge: "How we work",
      summary:
        "Five stages. Zero theatre. How we go from kickoff call to production launch in weeks, not quarters.",
      url: "/process",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1800&h=1000&fit=crop",
      accent: "#38bdf8",
      tint: "#000000",
      titleStyle: DEFAULT_CARD_TITLE_STYLE,
      summaryStyle: DEFAULT_CARD_SUMMARY_STYLE,
    },
    {
      id: "industries",
      eyebrow: "Industries",
      title: "Industries",
      badge: "Sectors we serve",
      summary:
        "Healthcare, finance, e-commerce, education, logistics — adapted to sector-specific realities.",
      url: "/industries",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&h=1000&fit=crop",
      accent: "#10b981",
      tint: "#000000",
      titleStyle: DEFAULT_CARD_TITLE_STYLE,
      summaryStyle: DEFAULT_CARD_SUMMARY_STYLE,
    },
    {
      id: "about",
      eyebrow: "About",
      title: "About",
      badge: "Our story",
      summary:
        "A 12-year-old studio disguised as a startup. Craft, clarity, care, speed — in that order.",
      url: "/about",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1800&h=1000&fit=crop",
      accent: "#a855f7",
      tint: "#000000",
      titleStyle: DEFAULT_CARD_TITLE_STYLE,
      summaryStyle: DEFAULT_CARD_SUMMARY_STYLE,
    },
    {
      id: "contact",
      eyebrow: "Contact",
      title: "Contact",
      badge: "Get in touch",
      summary:
        "Tell us what you're building. 30-minute discovery call — no pitch deck, just real advice.",
      url: "/contact",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1800&h=1000&fit=crop",
      accent: "#fb923c",
      tint: "#4C1D95",
      titleStyle: DEFAULT_CARD_TITLE_STYLE,
      summaryStyle: DEFAULT_CARD_SUMMARY_STYLE,
    },
  ],
  detailsKicker: "EXPLORE DGION",
  detailsHeadingBefore: "The Pillars of ",
  detailsHeadingHighlight: "Excellence",
  detailsHeadingAfter: "",
  detailsHeadingStyle: DEFAULT_HEADING_STYLE,
  detailsHighlightStyle: DEFAULT_HIGHLIGHT_STYLE,
  pillarCards: [
    {
      id: "services",
      eyebrow: "VIEW DETAILS",
      title: "Services",
      summary: "SEO, performance marketing, brand identity, UX — eight specialist practices, one team.",
      badge: "CAPABILITIES",
      url: "/services",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426",
      accent: "#837FFB",
      tint: "#0D0B24"
    },
    {
      id: "industries",
      eyebrow: "VIEW DETAILS",
      title: "Industries",
      summary: "Specialized solutions for finance, healthcare, e-commerce, and high-growth technology sectors.",
      badge: "SECTORS WE SERVE",
      url: "/industries",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070",
      accent: "#00E599",
      tint: "#081A14"
    },
    {
      id: "process",
      eyebrow: "VIEW DETAILS",
      title: "Process",
      summary: "A battle-tested methodology focused on rapid iteration, transparency, and measurable results.",
      badge: "HOW WE WORK",
      url: "/process",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070",
      accent: "#00C2FF",
      tint: "#08131A"
    },
    {
      id: "portfolio",
      eyebrow: "VIEW DETAILS",
      title: "Portfolio",
      summary: "Real projects shipped across 5 industries with numbers that moved and clients who came back.",
      badge: "CASE STUDIES",
      url: "/portfolio",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426",
      accent: "#FF3366",
      tint: "#1A080C"
    }
  ]
};
