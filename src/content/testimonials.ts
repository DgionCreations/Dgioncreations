import { type TextStyle } from "./typography";

export const TESTIMONIALS_CONTENT_KEY = "testimonials_content";

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
  quoteStyle?: TextStyle;
  authorStyle?: TextStyle;
}

export interface TestimonialsContent {
  heroKicker: string;
  heroKickerStyle?: TextStyle;
  heroTitle: string;
  heroTitleStyle?: TextStyle;
  heroHighlight: string;
  heroHighlightStyle?: TextStyle;
  
  testimonials: Testimonial[];
  
  // Showcase section (the "box")
  showcaseTitle: string;
  showcaseTitleStyle?: TextStyle;
  showcaseSubtitle: string;
  showcaseSubtitleStyle?: TextStyle;
  showcaseBadge: string;
  showcaseBadgeStyle?: TextStyle;
  
  // Trust logos
  trustedCompaniesTitle: string;
  trustedCompaniesStyle?: TextStyle;
  trustedCompanies: string[];

  // Why Review section (right side of form)
  whyKicker: string;
  whyKickerStyle?: TextStyle;
  whyTitle: string;
  whyTitleStyle?: TextStyle;
  whySubtitle: string;
  whySubtitleStyle?: TextStyle;
  whyItems: { title: string; desc: string }[];
}

export const DEFAULT_QUOTE_STYLE: TextStyle = { fontSize: 15, fontFamily: "inter", color: "rgba(255,255,255,0.82)" };
export const DEFAULT_AUTHOR_STYLE: TextStyle = { fontSize: 14, fontFamily: "inter", bold: true, color: "#FFFFFF" };

export const DEFAULT_TESTIMONIALS_KICKER_STYLE: TextStyle = { fontSize: 14, fontFamily: "inter", bold: true, color: "#837FFB" };
export const DEFAULT_TESTIMONIALS_TITLE_STYLE: TextStyle = { fontSize: 48, fontFamily: "the-seasons", bold: true, color: "#FFFFFF" };
export const DEFAULT_TESTIMONIALS_HIGHLIGHT_STYLE: TextStyle = { fontSize: 48, fontFamily: "the-seasons", bold: true, color: "#837FFB" };

export const defaultTestimonialsContent: TestimonialsContent = {
  heroKicker: "Testimonials",
  heroTitle: "What Clients ",
  heroHighlight: "Say",
  
  testimonials: [
    // ... existing testimonials ...
    { 
      name: "Marcus Webb",    
      role: "CTO, FinFlow",           
      quote: "Dgion delivered our trading dashboard in record time. The sub-50ms latency they achieved is world-class. It's rare to find an agency that understands both design and high-scale engineering so deeply.", 
      avatar: "MW" 
    },
    { 
      name: "Sarah Chen",      
      role: "VP Engineering, DataFlow", 
      quote: "We've worked with many vendors, but Dgion feels like an extension of our own team. Their commitment to clean code and architectural integrity saved us months of technical debt.", 
      avatar: "SC" 
    },
    { 
      name: "Dr. Jenna Liu",   
      role: "CEO, MediSync",        
      quote: "From discovery to launch, Dgion was incredible. They built a HIPAA-compliant platform that scales effortlessly. Their AI triage engine is a game changer for our clinicians.", 
      avatar: "JL" 
    },
    { 
      name: "Priya Patel",     
      role: "Head of Product, ShopVerse",
      quote: "The 3.2x conversion boost we saw after the re-platforming was beyond our expectations. Dgion's focus on user experience and performance is unmatched.", 
      avatar: "PP" 
    },
    { 
      name: "Alex Rivera",     
      role: "COO, ShipFast",            
      quote: "Dgion rebuilt our route optimization engine and cut our fuel costs by 35%. They don't just build software; they solve complex business problems with elegant tech.", 
      avatar: "AR" 
    },
    { 
      name: "Thomas Bradley",  
      role: "Founder, Zenith AI",   
      quote: "The speed of execution at Dgion is breathtaking. We went from a napkin sketch to a production-ready AI agent in 8 weeks. I wouldn't trust anyone else with our R&D.", 
      avatar: "TB" 
    },
  ],
  showcaseTitle: "What Founders Say About Us",
  showcaseSubtitle: "We've helped over 50+ startups launch and scale their products. Here's what they have to say about the Dgion experience.",
  showcaseBadge: "Trust & Results",
  trustedCompaniesTitle: "TRUSTED BY DEVELOPERS FROM COMPANIES WORLDWIDE",
  trustedCompanies: ["Google", "Microsoft", "Airbnb", "Spotify", "Netflix"],
  
  whyKicker: "Feedback",
  whyTitle: "Why Your Voice **Matters**",
  whySubtitle: "Your feedback helps us evolve. At Dgion, we don't just build software; we build partnerships. Every review is a step toward perfecting our craft.",
  whyItems: [
    { title: "Transparency", desc: "Your reviews go live instantly for the world to see." },
    { title: "Impact", desc: "Your insights directly influence our future project roadmaps." },
    { title: "Community", desc: "Join 50+ founders who have shared their Dgion journey." },
  ],
};
