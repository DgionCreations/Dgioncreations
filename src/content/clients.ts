/**
 * Shared content shape for the "Our Clients / Partnerships" logo grid on the
 * home page — imported by the admin editor and the ClientsSection renderer.
 */
import { type TextStyle } from "@/content/typography";
export type { TextStyle } from "@/content/typography";

export interface ClientLogo {
  /** Stable slug — used as React key. Admin can edit freely. */
  id: string;
  /** Display name shown under the logo. */
  name: string;
  /** Public image URL (e.g. Simple Icons CDN, your own CDN). */
  imgSrc: string;
  /** Destination link on click (use "#" for no-op). */
  href: string;
}

export interface ClientsContent {
  /** Small uppercase kicker (e.g. "Our Clients") */
  kicker: string;
  /** Heading part before the highlighted word */
  headingBefore: string;
  /** Highlighted word (purple glow) */
  headingHighlight: string;
  /** Heading part after the highlighted word */
  headingAfter: string;
  /** Supporting paragraph under the heading */
  description: string;
  /** Logos rendered in the grid (order = display order) */
  logos: ClientLogo[];

  /** Typography slots — each drives a TextStyleEditor in the admin. */
  kickerStyle?: TextStyle;
  headingStyle?: TextStyle;
  highlightStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  logoLabelStyle?: TextStyle;
}

/** Firestore document key — `content/{CLIENTS_CONTENT_KEY}` */
export const CLIENTS_CONTENT_KEY = "home_clients";

export const DEFAULT_KICKER_STYLE: TextStyle = {
  fontSize: 14,
  fontFamily: "inter",
  bold: true,
  color: "#837FFB",
};

export const DEFAULT_HEADING_STYLE: TextStyle = {
  fontSize: 56,
  fontFamily: "inter",
  bold: true,
  color: "#FFFFFF",
};

export const DEFAULT_HIGHLIGHT_STYLE: TextStyle = {
  fontSize: 56,
  fontFamily: "inter",
  bold: true,
  color: "#837FFB",
};

export const DEFAULT_DESCRIPTION_STYLE: TextStyle = {
  fontSize: 18,
  fontFamily: "inter",
  color: "#FFFFFF",
};

export const DEFAULT_LOGO_LABEL_STYLE: TextStyle = {
  fontSize: 12,
  fontFamily: "inter",
  bold: true,
  color: "#FFFFFF",
};

const S = "https://cdn.simpleicons.org";

export const defaultClientsContent: ClientsContent = {
  kicker: "Elite Partnerships",
  headingBefore: "Architecting Success with ",
  headingHighlight: "Industry",
  headingAfter: " Leaders",
  description:
    "We are obsessed with high-scale engineering and unshakeable quality. Dgion partners with ambitious brands to build the digital infrastructure of tomorrow, today.",
  logos: [
    { id: "hashnode",    name: "Hashnode",    imgSrc: `${S}/hashnode/2962FF`,   href: "#" },
    { id: "upwork",      name: "Upwork",      imgSrc: `${S}/upwork/6FDA44`,     href: "#" },
    { id: "googleplay",  name: "Google Play", imgSrc: `${S}/googleplay/34A853`, href: "#" },
    { id: "envato",      name: "Envato",      imgSrc: `${S}/envato/82B541`,     href: "#" },
    { id: "suse",        name: "SUSE",        imgSrc: `${S}/suse/30BA78`,       href: "#" },
    { id: "asana",       name: "Asana",       imgSrc: `${S}/asana/F06A6A`,      href: "#" },
    { id: "figma",       name: "Figma",       imgSrc: `${S}/figma/F24E1E`,      href: "#" },
    { id: "notion",      name: "Notion",      imgSrc: `${S}/notion/787878`,     href: "#" },
    { id: "stripe",      name: "Stripe",      imgSrc: `${S}/stripe/9D9AFF`,     href: "#" },
    { id: "discord",     name: "Discord",     imgSrc: `${S}/discord/5865F2`,    href: "#" },
  ],
  kickerStyle: DEFAULT_KICKER_STYLE,
  headingStyle: DEFAULT_HEADING_STYLE,
  highlightStyle: DEFAULT_HIGHLIGHT_STYLE,
  descriptionStyle: DEFAULT_DESCRIPTION_STYLE,
  logoLabelStyle: DEFAULT_LOGO_LABEL_STYLE,
};
