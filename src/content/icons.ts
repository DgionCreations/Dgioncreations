/**
 * Curated lucide icon registry — admin editors store a short string key in
 * Firestore, and the renderer looks up the React component here. Keeping this
 * list central means adding a new icon is one line in each place, and the
 * Firestore payload stays small (a key instead of the whole icon definition).
 */
import {
  type LucideIcon,
  Target, Lightbulb, Rocket, BarChart3, CheckCircle2, Users, Award,
  Search, Share2, FileText, Fingerprint, Layout, LineChart, Brain,
  Heart, Globe, ShoppingCart, GraduationCap, Truck, Code2, Briefcase,
  Zap, Star, TrendingUp, DollarSign, Building2, Sparkles, Shield,
  Layers, Workflow, Mail, Compass, Palette, Clock, Calendar, MessageCircle, Send,
  Twitter, Github, Linkedin, Instagram, Phone, MapPin, Link,
} from "lucide-react";

/** Token stored in Firestore (short, stable). */
export type IconKey =
  | "target" | "lightbulb" | "rocket" | "bar-chart" | "check-circle" | "users" | "award"
  | "search" | "share" | "file-text" | "fingerprint" | "layout" | "line-chart" | "brain"
  | "heart" | "globe" | "shopping-cart" | "graduation-cap" | "truck" | "code" | "briefcase"
  | "zap" | "star" | "trending-up" | "dollar-sign" | "building" | "sparkles" | "shield"
  | "layers" | "workflow" | "mail" | "compass" | "palette" | "clock"
  | "calendar" | "message-circle" | "send"
  | "twitter" | "github" | "linkedin" | "instagram" | "phone" | "map-pin" | "link";

export interface IconEntry {
  label: string;
  component: LucideIcon;
}

export const ICONS: Record<IconKey, IconEntry> = {
  "target":         { label: "Target",         component: Target },
  "lightbulb":      { label: "Lightbulb",      component: Lightbulb },
  "rocket":         { label: "Rocket",         component: Rocket },
  "bar-chart":      { label: "Bar chart",      component: BarChart3 },
  "check-circle":   { label: "Check circle",   component: CheckCircle2 },
  "users":          { label: "Users",          component: Users },
  "award":          { label: "Award",          component: Award },
  "search":         { label: "Search",         component: Search },
  "share":          { label: "Share",          component: Share2 },
  "file-text":      { label: "File / document",component: FileText },
  "fingerprint":    { label: "Fingerprint",    component: Fingerprint },
  "layout":         { label: "Layout",         component: Layout },
  "line-chart":     { label: "Line chart",     component: LineChart },
  "brain":          { label: "Brain",          component: Brain },
  "heart":          { label: "Heart",          component: Heart },
  "globe":          { label: "Globe",          component: Globe },
  "shopping-cart":  { label: "Shopping cart",  component: ShoppingCart },
  "graduation-cap": { label: "Graduation cap", component: GraduationCap },
  "truck":          { label: "Truck",          component: Truck },
  "code":           { label: "Code",           component: Code2 },
  "briefcase":      { label: "Briefcase",      component: Briefcase },
  "zap":            { label: "Zap / bolt",     component: Zap },
  "star":           { label: "Star",           component: Star },
  "trending-up":    { label: "Trending up",    component: TrendingUp },
  "dollar-sign":    { label: "Dollar sign",    component: DollarSign },
  "building":       { label: "Building",       component: Building2 },
  "sparkles":       { label: "Sparkles",       component: Sparkles },
  "shield":         { label: "Shield",         component: Shield },
  "layers":         { label: "Layers",         component: Layers },
  "workflow":       { label: "Workflow",       component: Workflow },
  "mail":           { label: "Mail",           component: Mail },
  "compass":        { label: "Compass",        component: Compass },
  "palette":        { label: "Palette",        component: Palette },
  "clock":          { label: "Clock",          component: Clock },
  "calendar":       { label: "Calendar",       component: Calendar },
  "message-circle": { label: "Chat bubble",    component: MessageCircle },
  "send":           { label: "Send / paper plane", component: Send },
  "twitter":        { label: "Twitter",        component: Twitter },
  "github":         { label: "GitHub",         component: Github },
  "linkedin":       { label: "LinkedIn",       component: Linkedin },
  "instagram":      { label: "Instagram",      component: Instagram },
  "phone":          { label: "Phone",          component: Phone },
  "map-pin":        { label: "Map Pin",        component: MapPin },
  "link":           { label: "Link",           component: Link },
};

/** Resolve an icon key to its React component. Falls back to a safe default
 *  (Sparkles) when the stored key is unknown — e.g. during a schema migration. */
export function resolveIcon(key: IconKey | string | undefined): LucideIcon {
  if (key && key in ICONS) return ICONS[key as IconKey].component;
  return Sparkles;
}

export const ICON_KEYS = Object.keys(ICONS) as IconKey[];
