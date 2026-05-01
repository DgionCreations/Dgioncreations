import { 
  type TextStyle, 
  defaultTextStyle 
} from "./typography";

export const FOOTER_CONTENT_KEY = "footer_content";

export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterSocial {
  iconKey: string;
  label: string;
  href: string;
}

export interface FooterContact {
  iconKey: string;
  text: string;
}

export interface FooterContent {
  brandName: string;
  brandHref: string;
  brandDescription: string;
  socialLinks: FooterSocial[];
  servicesTitle: string;
  servicesLinks: FooterLink[];
  companyTitle: string;
  companyLinks: FooterLink[];
  resourcesTitle: string;
  resourceLinks: FooterLink[];
  contactTitle: string;
  contactInfo: FooterContact[];
  columnTitleStyle: TextStyle;
  linkStyle: TextStyle;
  brandTitleStyle: TextStyle;
  brandDescriptionStyle: TextStyle;
  contactItemStyle: TextStyle;
  copyrightStyle: TextStyle;
  bottomLinkStyle: TextStyle;
  copyrightText: string;
  bottomLinks: FooterLink[];
}

export const defaultFooterContent: FooterContent = {
  brandName: "Dgion",
  brandHref: "/",
  brandDescription: "A creative AI digital agency building intelligent products, scalable platforms, and digital experiences that drive real business growth.",
  servicesTitle: "Services",
  servicesLinks: [
    { text: "AI Solutions", href: "#services" },
    { text: "Web Development", href: "#services" },
    { text: "Mobile Apps", href: "#services" },
    { text: "Cloud & DevOps", href: "#services" },
  ],
  companyTitle: "Company",
  companyLinks: [
    { text: "About Us", href: "/about" },
    { text: "Our Process", href: "/process" },
    { text: "Portfolio", href: "/portfolio" },
    { text: "Reviews", href: "/reviews" },
  ],
  resourcesTitle: "Resources",
  resourceLinks: [
    { text: "Blog", href: "/blog" },
    { text: "Case Studies", href: "/case-studies" },
    { text: "Support", href: "/support" },
    { text: "Privacy Policy", href: "/privacy" },
  ],
  contactTitle: "Contact",
  contactInfo: [
    { iconKey: "mail", text: "hello@dgion.com" },
    { iconKey: "phone", text: "+1 (555) 012-3456" },
    { iconKey: "map-pin", text: "San Francisco, CA" },
  ],
  columnTitleStyle: {
    ...defaultTextStyle,
    fontSize: 12,
    bold: true,
    fontFamily: "inter",
    color: "rgba(131, 127, 251, 1)"
  },
  linkStyle: {
    ...defaultTextStyle,
    fontSize: 14,
    fontFamily: "inter",
    color: "rgba(255, 255, 255, 0.5)"
  },
  brandTitleStyle: {
    ...defaultTextStyle,
    fontSize: 24,
    fontFamily: "the-seasons",
    bold: true,
    color: "rgba(255, 255, 255, 1)"
  },
  brandDescriptionStyle: {
    ...defaultTextStyle,
    fontSize: 14,
    fontFamily: "inter",
    color: "rgba(255, 255, 255, 0.4)"
  },
  contactItemStyle: {
    ...defaultTextStyle,
    fontSize: 14,
    fontFamily: "inter",
    color: "rgba(255, 255, 255, 0.6)"
  },
  copyrightStyle: {
    ...defaultTextStyle,
    fontSize: 12,
    fontFamily: "inter",
    color: "rgba(255, 255, 255, 0.3)"
  },
  bottomLinkStyle: {
    ...defaultTextStyle,
    fontSize: 11,
    fontFamily: "inter",
    color: "rgba(255, 255, 255, 0.3)"
  },
  socialLinks: [
    { iconKey: "twitter", label: "Twitter", href: "#" },
    { iconKey: "github", label: "GitHub", href: "#" },
    { iconKey: "linkedin", label: "LinkedIn", href: "#" },
    { iconKey: "instagram", label: "Instagram", href: "#" },
  ],
  copyrightText: "© 2025 Dgion. All rights reserved.",
  bottomLinks: [
    { text: "Terms", href: "#" },
    { text: "Privacy", href: "#" },
    { text: "Cookies", href: "#" },
  ]
};
