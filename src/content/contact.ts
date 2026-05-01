import { type TextStyle } from "./typography";

export const CONTACT_CONTENT_KEY = "contact_content";

export interface ContactCard {
  label: string;
  value: string;
  color: string;
  bg: string;
  logo: string;
}

export interface TrustBadge {
  iconKey: string;
  label: string;
  labelStyle?: TextStyle;
  value: string;
  valueStyle?: TextStyle;
  sub: string;
  subStyle?: TextStyle;
  color: string;
}

export interface QuickAction {
  iconKey: string;   // e.g. "calendar", "message-circle", "send"
  title: string;     // card heading
  titleStyle?: TextStyle;
  revealText?: string; // optional alternate title revealed on hover
  desc: string;      // 1-2 line description
  descStyle?: TextStyle;
  cta: string;       // CTA button text
  ctaStyle?: TextStyle;
  href: string;      // URL — Calendly link, wa.me link, or mailto
  accent?: string;   // optional brand accent hex (icon / glow / CTA); defaults to DGION purple
}

export interface FAQ {
  q: string;
  a: string;
}

export interface ContactContent {
  // Hero
  heroKicker: string;
  heroKickerStyle?: TextStyle;
  heroTitle: string;
  heroTitleStyle?: TextStyle;
  heroHighlightStyle?: TextStyle;
  heroDesc: string;
  heroDescStyle?: TextStyle;
  orbText: string;

  // Info Cards
  cards: ContactCard[];

  // Trust badges (strip below hero)
  trustBadges: TrustBadge[];

  // "Recent Work" section heading
  otherWaysKicker: string;
  otherWaysKickerStyle?: TextStyle;
  otherWaysTitle: string;
  otherWaysTitleStyle?: TextStyle;
  otherWaysHighlight: string;
  otherWaysHighlightStyle?: TextStyle;

  // Quick action cards (Book / WhatsApp / Brief)
  quickActions: QuickAction[];

  // FAQ section heading
  faqKicker: string;
  faqKickerStyle?: TextStyle;
  faqTitle: string;
  faqTitleStyle?: TextStyle;
  faqHighlight: string;
  faqHighlightStyle?: TextStyle;

  // FAQ items
  faqs: FAQ[];

  // Form
  formHeader: string;
  formSubHeader: string;
  formSubmitLabel: string;
  formScheduleLabel: string;

  // Office / Map
  officeAddress: string;
  officeAddressStyle?: TextStyle;
  officeQuery: string;
  mapTitleKicker: string;
  mapTitleKickerStyle?: TextStyle;
  mapTitle: string;
  mapTitleStyle?: TextStyle;
  mapHighlight: string;
  mapHighlightStyle?: TextStyle;
}

export const DEFAULT_CONTACT_KICKER_STYLE: TextStyle = { fontSize: 16, fontFamily: "inter", bold: true, color: "#837FFB" };
export const DEFAULT_CONTACT_TITLE_STYLE: TextStyle = { fontSize: 72, fontFamily: "inter", bold: true, color: "#FFFFFF" };
export const DEFAULT_CONTACT_DESC_STYLE: TextStyle = { fontSize: 20, fontFamily: "inter", color: "rgba(255,255,255,0.4)" };

export const defaultContactContent: ContactContent = {
  heroKicker: "Contact Us",
  heroTitle: "Designing **NextGen|s=96**\nDigital Solutions.",
  heroDesc: "Bring us your most ambitious digital challenges. From initial concept to market-leading architecture, we partner with visionaries to build the extraordinary.",
  orbText: "DGION",
  
  heroKickerStyle: DEFAULT_CONTACT_KICKER_STYLE,
  heroTitleStyle: DEFAULT_CONTACT_TITLE_STYLE,
  heroHighlightStyle: { ...DEFAULT_CONTACT_TITLE_STYLE, color: "#837FFB" },
  heroDescStyle: DEFAULT_CONTACT_DESC_STYLE,
  
  cards: [
    { logo: "https://cdn.simpleicons.org/gmail/EA4335",       label: "Email us",     value: "hello@dgion.com",          color: "#EA4335", bg: "#EA4335" },
    { logo: "https://cdn.simpleicons.org/whatsapp/25D366",    label: "Call us",      value: "091006 00458",             color: "#25D366", bg: "#25D366" },
    { logo: "https://cdn.simpleicons.org/googlemaps/4285F4",  label: "Visit",        value: "Nampally, Hyderabad",      color: "#4285F4", bg: "#4285F4" },
    { logo: "https://cdn.simpleicons.org/clockify/03A9F4",    label: "Reply within", value: "24 hours",                 color: "#03A9F4", bg: "#03A9F4" },
  ],

  trustBadges: [
    { 
      iconKey: "sparkles", 
      label: "Free consult", 
      labelStyle: { fontSize: 12, fontFamily: "inter", bold: true, color: "#837FFB" },
      value: "30-min discovery", 
      valueStyle: { fontSize: 16, fontFamily: "inter", bold: true, color: "#FFFFFF" },
      sub: "No pitch deck — straight advice on your challenge.", 
      subStyle: { fontSize: 12, fontFamily: "inter", color: "rgba(255,255,255,0.35)" },
      color: "#837FFB" 
    },
    { 
      iconKey: "clock", 
      label: "Fast reply", 
      labelStyle: { fontSize: 12, fontFamily: "inter", bold: true, color: "#837FFB" },
      value: "Under 24 hours", 
      valueStyle: { fontSize: 16, fontFamily: "inter", bold: true, color: "#FFFFFF" },
      sub: "Most inquiries get a first response same-day.", 
      subStyle: { fontSize: 12, fontFamily: "inter", color: "rgba(255,255,255,0.35)" },
      color: "#10b981" 
    },
    { 
      iconKey: "shield", 
      label: "NDA-ready", 
      labelStyle: { fontSize: 12, fontFamily: "inter", bold: true, color: "#837FFB" },
      value: "Confidential", 
      valueStyle: { fontSize: 16, fontFamily: "inter", bold: true, color: "#FFFFFF" },
      sub: "Happy to sign an NDA before you share details.", 
      subStyle: { fontSize: 12, fontFamily: "inter", color: "rgba(255,255,255,0.35)" },
      color: "#f59e0b" 
    },
    { 
      iconKey: "users", 
      label: "Expert team", 
      labelStyle: { fontSize: 12, fontFamily: "inter", bold: true, color: "#837FFB" },
      value: "12+ years experience", 
      valueStyle: { fontSize: 16, fontFamily: "inter", bold: true, color: "#FFFFFF" },
      sub: "Specialists across strategy, design & engineering.", 
      subStyle: { fontSize: 12, fontFamily: "inter", color: "rgba(255,255,255,0.35)" },
      color: "#38bdf8" 
    },
    { 
      iconKey: "star", 
      label: "5-star rated", 
      labelStyle: { fontSize: 12, fontFamily: "inter", bold: true, color: "#837FFB" },
      value: "98% satisfaction", 
      valueStyle: { fontSize: 16, fontFamily: "inter", bold: true, color: "#FFFFFF" },
      sub: "Based on 150+ delivered projects across industries.", 
      subStyle: { fontSize: 12, fontFamily: "inter", color: "rgba(255,255,255,0.35)" },
      color: "#f59e0b" 
    },
  ],

  otherWaysKicker: "Skip the form",
  otherWaysKickerStyle: { fontSize: 14, fontFamily: "inter", bold: true, color: "#837FFB" },
  otherWaysTitle: "Reach us ",
  otherWaysTitleStyle: { fontSize: 48, fontFamily: "inter", bold: true, color: "#FFFFFF" },
  otherWaysHighlight: "directly",
  otherWaysHighlightStyle: { fontSize: 48, fontFamily: "inter", bold: true, color: "#837FFB" },

  faqKicker: "Just ask",
  faqKickerStyle: { fontSize: 14, fontFamily: "inter", bold: true, color: "#837FFB" },
  faqTitle: "Clear Answers. ",
  faqTitleStyle: { fontSize: 48, fontFamily: "inter", bold: true, color: "#FFFFFF" },
  faqHighlight: "Real Direction",
  faqHighlightStyle: { fontSize: 48, fontFamily: "inter", bold: true, color: "#837FFB" },

  faqs: [
    { q: "What kinds of projects do you take on?",    a: "We partner on ambitious digital products — web platforms, SaaS tools, mobile apps, rebrands, and growth engagements. We're strongest when the goal is clear and the scope is meaningful." },
    { q: "How quickly can we start?",                 a: "Discovery can begin within 1 week. Build work typically kicks off 2–3 weeks after contract signing, depending on team availability." },
    { q: "Do you work globally?",                     a: "Yes. We work with clients across India, the US, Europe, and the Middle East. We cover standard business hours and adapt to your timezone when needed." },
    { q: "Will I get the same team throughout?",      a: "Yes. The humans you meet in discovery are the humans who work on your project. No bait-and-switch with offshore juniors." },
  ],

  quickActions: [
    {
      iconKey: "phone",
      title: "Call Us Directly",
      titleStyle: { fontSize: 20, fontFamily: "inter", bold: true, color: "#FFFFFF" },
      revealText: "Let's Talk Now",
      desc: "Skip the scheduling — pick up the phone for a quick chat during business hours.",
      descStyle: { fontSize: 14, fontFamily: "inter", color: "rgba(255,255,255,0.55)" },
      cta: "Call Now",
      ctaStyle: { fontSize: 14, fontFamily: "inter", bold: true },
      href: "tel:+919100600458",
      accent: "#34C759",
    },
    {
      iconKey: "message-circle",
      title: "Chat on WhatsApp",
      titleStyle: { fontSize: 20, fontFamily: "inter", bold: true, color: "#FFFFFF" },
      revealText: "Ping Us Anytime",
      desc: "Quick question? Ping us directly — we reply within business hours.",
      descStyle: { fontSize: 14, fontFamily: "inter", color: "rgba(255,255,255,0.55)" },
      cta: "Open WhatsApp",
      ctaStyle: { fontSize: 14, fontFamily: "inter", bold: true },
      href: "https://wa.me/919100600458?text=Hi%20DGION%2C%20I%27d%20like%20to%20discuss%20a%20project.",
      accent: "#25D366",
    },
    {
      iconKey: "send",
      title: "Send a Project Brief",
      titleStyle: { fontSize: 20, fontFamily: "inter", bold: true, color: "#FFFFFF" },
      revealText: "Let's Build Together",
      desc: "Have specs ready? Drop a brief — we respond with scoping within 48 hours.",
      descStyle: { fontSize: 14, fontFamily: "inter", color: "rgba(255,255,255,0.55)" },
      cta: "Open in Gmail",
      ctaStyle: { fontSize: 14, fontFamily: "inter", bold: true },
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=hello@dgion.com&su=Project%20Brief&body=Hi%20DGION%20team%2C%0A%0APlease%20find%20our%20project%20brief%20below.%0A%0AGoals%3A%20%0AScope%3A%20%0ATimeline%3A%20%0ABudget%3A%20%0A%0AThanks!",
      accent: "#EA4335",
    },
  ],

  formHeader: "Get In Touch",
  formSubHeader: "Let's build the future together.",
  formSubmitLabel: "Send Message",
  formScheduleLabel: "Prefer to schedule a call?",

  officeAddress: "1st Floor, Bademiya Complex, 5-8-328/2 & 3A, Chapel Rd, Nampally, Hyderabad, Telangana 500001",
  officeAddressStyle: { fontSize: 14, fontFamily: "inter", color: "rgba(255,255,255,0.4)" },
  officeQuery: "DGION CREATIONS PRIVATE LIMITED, Chapel Rd, Nampally, Hyderabad",
  mapTitleKicker: "Find Us",
  mapTitleKickerStyle: { fontSize: 16, fontFamily: "inter", bold: true, color: "#837FFB" },
  mapTitle: "Come say ",
  mapTitleStyle: { fontSize: 36, fontFamily: "inter", bold: true, color: "#FFFFFF" },
  mapHighlight: "hello",
  mapHighlightStyle: { fontSize: 36, fontFamily: "inter", bold: true, color: "#837FFB" },
};
