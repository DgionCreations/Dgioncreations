/**
 * Shared content shape for the home hero — imported by both the admin editor
 * (for the form) and the HeroSection (for rendering). This keeps the two in
 * sync — add a field here and it's available everywhere.
 *
 * Typography primitives (TextStyle, FONT_FAMILIES, etc.) live in
 * `src/content/typography.ts` and are shared across every editor.
 */
import { type TextStyle } from "@/content/typography";
export type { TextStyle } from "@/content/typography";

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroContent {
  badge: string;
  headlineTop: string;
  headlineHighlight: string;
  headlineBottom: string;
  description: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  /** Optional image shown on the right side of the hero (overrides the 3D scene) */
  heroImageUrl?: string;
  stats: HeroStat[];

  /** Typography — per text slot. Each controls size / family / bold / italic / underline. */
  badgeStyle?: TextStyle;
  headlineStyle?: TextStyle;
  highlightStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  statValueStyle?: TextStyle;
  statLabelStyle?: TextStyle;
  ctaPrimaryStyle?: TextStyle;
  ctaSecondaryStyle?: TextStyle;
}

/** Firestore document key — `content/{HERO_CONTENT_KEY}` */
export const HERO_CONTENT_KEY = "home_hero";

/* ───────────── Default text styles ─────────────
 * Pixel sizes chosen to roughly match the old hardcoded Tailwind scale at
 * a typical desktop viewport so existing Firestore docs keep working without
 * a forced re-save.
 */
export const DEFAULT_BADGE_STYLE: TextStyle = {
  fontSize: 14,
  fontFamily: "inter",
  bold: false,
  color: "#FFFFFF",
};

export const DEFAULT_HEADLINE_STYLE: TextStyle = {
  fontSize: 56,
  fontFamily: "inter",
  bold: true,
  color: "#FFFFFF",
};

export const DEFAULT_HIGHLIGHT_STYLE: TextStyle = {
  fontSize: 96,
  fontFamily: "inter",
  bold: true,
  color: "#837FFB",
};

export const DEFAULT_DESCRIPTION_STYLE: TextStyle = {
  fontSize: 18,
  fontFamily: "inter",
  color: "#FFFFFF",
};

export const DEFAULT_STAT_VALUE_STYLE: TextStyle = {
  fontSize: 28,
  fontFamily: "inter",
  bold: true,
  color: "#FFFFFF",
};

export const DEFAULT_STAT_LABEL_STYLE: TextStyle = {
  fontSize: 12,
  fontFamily: "inter",
  color: "#FFFFFF",
};

export const DEFAULT_CTA_PRIMARY_STYLE: TextStyle = {
  fontSize: 16,
  fontFamily: "inter",
  bold: true,
  color: "#FFFFFF",
};

export const DEFAULT_CTA_SECONDARY_STYLE: TextStyle = {
  fontSize: 18,
  fontFamily: "inter",
  bold: true,
  color: "#FFFFFF",
};

export const defaultHeroContent: HeroContent = {
  badge: "Next-Gen Creative & Tech Studio",
  headlineTop: "Architecting the",
  headlineHighlight: "Digital",
  headlineBottom: "Legacy of Brands",
  description:
    "We are a high-end agency at the intersection of strategy, design, and engineering. Dgion transforms ambitious ideas into industry-leading digital products that scale.",
  ctaPrimaryLabel: "Start a Project",
  ctaSecondaryLabel: "View Our Work",
  heroImageUrl: "",
  stats: [
    { value: "150+", label: "Projects Shipped" },
    { value: "98%",  label: "Client Satisfaction" },
    { value: "12+",  label: "Years Experience" },
  ],
  badgeStyle: DEFAULT_BADGE_STYLE,
  headlineStyle: DEFAULT_HEADLINE_STYLE,
  highlightStyle: DEFAULT_HIGHLIGHT_STYLE,
  descriptionStyle: DEFAULT_DESCRIPTION_STYLE,
  statValueStyle: DEFAULT_STAT_VALUE_STYLE,
  statLabelStyle: DEFAULT_STAT_LABEL_STYLE,
  ctaPrimaryStyle: DEFAULT_CTA_PRIMARY_STYLE,
  ctaSecondaryStyle: DEFAULT_CTA_SECONDARY_STYLE,
};
