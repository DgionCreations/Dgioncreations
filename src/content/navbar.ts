/**
 * Navbar Content Schema
 * Stores links, logo text, and CTA settings.
 */
export const NAVBAR_CONTENT_KEY = "navbar_content";

import { type TextStyle, defaultTextStyle } from "./typography";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarContent {
  logoText: string;
  logoHref: string;
  logoStyle: TextStyle;
  links: NavLink[];
  linksStyle: TextStyle;
  ctaText: string;
  ctaHref: string;
  ctaStyle: TextStyle;
}

export const defaultNavbarContent: NavbarContent = {
  logoText: "Dgion",
  logoHref: "/",
  logoStyle: {
    ...defaultTextStyle,
    fontSize: 36,
    bold: true,
    fontFamily: 'playfair',
    color: "#ffffff",
  },
  links: [
    { label: "Home",       href: "/" },
    { label: "Services",   href: "/services" },
    { label: "Industries", href: "/industries" },
    { label: "Process",    href: "/process" },
    { label: "Portfolio",  href: "/portfolio" },
    { label: "About",      href: "/about" },
    { label: "Reviews",    href: "/reviews" },
    { label: "Contact Us", href: "/contact" },
  ],
  linksStyle: {
    ...defaultTextStyle,
    fontSize: 14,
    bold: true,
    color: "#d1d5db",
  },
  ctaText: "Get Started",
  ctaHref: "/contact",
  ctaStyle: {
    ...defaultTextStyle,
    fontSize: 14,
    bold: true,
    color: "#ffffff",
  },
};
