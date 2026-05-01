/**
 * Shared content shape for the home "Ready to Build the Future" spotlight
 * CTA — imported by the admin editor and the CTASection renderer.
 */
import { type TextStyle } from "@/content/typography";
export type { TextStyle } from "@/content/typography";

export interface CtaStat {
  /** e.g. "100+ PROJECTS" — shown in the trust strip below the button. */
  text: string;
}

export interface CtaContent {
  /** Small pre-header (next to the rocket icon) */
  preheaderText: string;
  /** Big scattered-letter heading */
  heading: string;
  /** Body paragraph */
  description: string;
  /** Primary button label */
  buttonText: string;
  /** Optional in-page anchor id the button scrolls to (e.g. "contact") */
  buttonScrollTargetId?: string;
  /** Right-side illustration image URL */
  imageUrl: string;
  /** Alt text for the illustration (a11y) */
  imageAlt?: string;
  /** Trust strip — three short stats shown below the button */
  stats: CtaStat[];

  /** Typography slots — each drives a TextStyleEditor in the admin. */
  preheaderStyle?: TextStyle;
  headingStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  buttonStyle?: TextStyle;
  statStyle?: TextStyle;
}

/** Firestore document key — `content/{CTA_CONTENT_KEY}` */
export const CTA_CONTENT_KEY = "home_cta";

export const DEFAULT_PREHEADER_STYLE: TextStyle = {
  fontSize: 14,
  fontFamily: "inter",
  bold: false,
  color: "#837FFB",
};

export const DEFAULT_HEADING_STYLE: TextStyle = {
  fontSize: 56,
  fontFamily: "inter",
  bold: true,
  color: "#FFFFFF",
};

export const DEFAULT_DESCRIPTION_STYLE: TextStyle = {
  fontSize: 18,
  fontFamily: "inter",
  color: "#FFFFFF",
};

export const DEFAULT_BUTTON_STYLE: TextStyle = {
  fontSize: 16,
  fontFamily: "inter",
  bold: true,
  color: "#FFFFFF",
};

export const DEFAULT_STAT_STYLE: TextStyle = {
  fontSize: 11,
  fontFamily: "inter",
  bold: true,
  color: "#FFFFFF",
};

export const defaultCtaContent: CtaContent = {
  preheaderText: "Ready to Build the Future?",
  heading: "Uncover Untapped Potential",
  description:
    "We build intelligent products — from ML pipelines and NLP engines to full-stack platforms and digital experiences that give your business a competitive edge.",
  buttonText: "Start Your Project",
  buttonScrollTargetId: "contact",
  imageUrl:
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&auto=format&fit=crop",
  imageAlt: "Team collaborating on a digital project",
  stats: [
    { text: "100+ Projects" },
    { text: "99.9% Uptime" },
    { text: "24/7 Support" },
  ],
  preheaderStyle: DEFAULT_PREHEADER_STYLE,
  headingStyle: DEFAULT_HEADING_STYLE,
  descriptionStyle: DEFAULT_DESCRIPTION_STYLE,
  buttonStyle: DEFAULT_BUTTON_STYLE,
  statStyle: DEFAULT_STAT_STYLE,
};
