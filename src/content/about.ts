import { type TextStyle } from "./typography";

export const ABOUT_CONTENT_KEY = "about_content";

export interface TimelineItem {
  year: string;
  title: string;
  titleStyle?: TextStyle;
  desc: string;
  descStyle?: TextStyle;
  images?: string[];
}

export interface ValueItem {
  icon: string; // Icon name from our library
  title: string;
  titleStyle?: TextStyle;
  desc: string;
  descStyle?: TextStyle;
  url?: string;
  image?: string;
}

export interface AboutContent {
  // Hero (top of the page)
  heroKicker: string;
  heroKickerStyle?: TextStyle;
  heroTitle: string;
  heroTitleStyle?: TextStyle;
  heroHighlight: string;
  heroHighlightStyle?: TextStyle;
  heroDesc: string;
  heroDescStyle?: TextStyle;

  // Values Section
  valuesTitle?: string;
  valuesTitleStyle?: TextStyle;
  valuesHighlight?: string;
  valuesHighlightStyle?: TextStyle;
  valuesItemTitleStyle?: TextStyle;
  valuesItemDescStyle?: TextStyle;
  values: ValueItem[];

  // Journey section header
  sectionKicker?: string;
  sectionKickerStyle?: TextStyle;
  sectionTitle?: string;
  sectionTitleStyle?: TextStyle;
  sectionHighlight?: string;
  sectionHighlightStyle?: TextStyle;
  sectionDesc?: string;
  sectionDescStyle?: TextStyle;

  // Spiral Timeline (wavy path)
  spiralItemTitleStyle?: TextStyle;
  spiralItemDescStyle?: TextStyle;
  spiralTimeline: TimelineItem[];

  // Vertical Journey Timeline (glider)
  journeyItemTitleStyle?: TextStyle;
  journeyItemDescStyle?: TextStyle;
  journeyTimeline: TimelineItem[];

  // Why Choose Section
  whyTitle: string;
  whyTitleStyle?: TextStyle;
  whyHighlight: string;
  whyHighlightStyle?: TextStyle;
  whyPillarTitleStyle?: TextStyle;
  whyPillarDescStyle?: TextStyle;
  whyPillars: WhyPillar[];
}

export interface WhyPillar {
  num: string;
  title: string;
  script: string;
  subtitle: string;
  description: string;
  descriptionStyle?: TextStyle;
  img: string;
  video: string;
}

export const DEFAULT_ABOUT_KICKER_STYLE: TextStyle = { fontSize: 16, fontFamily: "inter", bold: true, color: "#837FFB" };
export const DEFAULT_ABOUT_TITLE_STYLE: TextStyle = { fontSize: 64, fontFamily: "inter", bold: true, color: "#FFFFFF" };
export const DEFAULT_ABOUT_HIGHLIGHT_STYLE: TextStyle = { fontSize: 84, fontFamily: "inter", bold: true, color: "#837FFB" };
export const DEFAULT_ABOUT_DESC_STYLE: TextStyle = { fontSize: 20, fontFamily: "inter", color: "rgba(255,255,255,0.4)" };

export const defaultAboutContent: AboutContent = {
  heroKicker: "OUR STORY",
  heroTitle: "Where strategy meets\n**craft and code.**",
  heroHighlight: "",
  heroDesc: "A studio bringing rare disciplines under one roof. Strategy, design, and engineering working in lockstep — built so ambitious teams can move faster, ship sharper, and outlast the noise.",

  // Values Section
  valuesTitle: "Four values, zero ",
  valuesHighlight: "fluff.",
  values: [
    { 
      icon: "Sparkles", 
      title: "Craft",   
      desc: "We sweat the details. Pixel alignment matters. API design matters. Every commit is a small act of pride.", 
      url: "/portfolio",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
    },
    { 
      icon: "Target",   
      title: "Clarity", 
      desc: "Honest scoping, transparent pricing, zero buzzwords. If we don't know, we say so.", 
      url: "/services",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
    },
    { 
      icon: "Heart",    
      title: "Care",    
      desc: "Your product is our product for the duration. We show up, we follow through, we don't ghost.", 
      url: "/contact",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
    },
    { 
      icon: "Rocket",   
      title: "Speed",   
      desc: "Velocity without corners cut. First demo in two weeks, production-ready from day one.", 
      url: "/services",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
    },
  ],

  // Journey section header — separate from the page hero.
  sectionKicker: "BEHIND THE SCENES",
  sectionTitle: "Projects **Done.**",
  sectionHighlight: "",
  sectionDesc: "A quarter-by-quarter breakdown of the work we've shipped and the impact we've made.",


  spiralTimeline: [
    { 
      year: "Q1 2024", 
      title: "FinFlow Evolution", 
      desc: "Dgion launched a zero-latency trading suite for a tier-1 EU fintech.", 
      images: [
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600",
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600"
      ] 
    },
    { 
      year: "Q2 2024", 
      title: "MediSync AI Triage", 
      desc: "Deployed a HIPAA-compliant neural engine for automated patient care.", 
      images: [
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600",
        "https://images.unsplash.com/photo-1504868584819-f8e90526354c?q=80&w=600",
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600"
      ] 
    },
    { 
      year: "Q3 2024", 
      title: "LogiTrack Core", 
      desc: "Dgion engineered a real-time route optimization platform for 8K vehicles.", 
      images: [
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600",
        "https://images.unsplash.com/photo-1519003722824-192d9920211d?q=80&w=600",
        "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?q=80&w=600",
        "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600"
      ] 
    },
    { 
      year: "Q4 2024", 
      title: "LuxeBrand Re-platform", 
      desc: "Architected a custom headless storefront handling $50M+ in holiday sales.", 
      images: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600",
        "https://images.unsplash.com/photo-1556742049-13da736c7459?q=80&w=600",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600",
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600"
      ] 
    },
    { 
      year: "Q1 2025", 
      title: "Enterprise Hub V2", 
      desc: "Centralized complex internal operations for a Fortune 500 tech firm.", 
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=600",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600",
        "https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=600"
      ] 
    },
    { 
      year: "Q2 2025", 
      title: "Web3 Luxury Connect", 
      desc: "Dgion secured high-end NFT utility integration for a global fashion house.", 
      images: [
        "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=600",
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600",
        "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?q=80&w=600"
      ] 
    },
    { 
      year: "Q3 2025", 
      title: "Smart Grid Dashboard", 
      desc: "Visualized real-time energy flow across 12 metropolitan hubs.", 
      images: [
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=600",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=600",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600"
      ] 
    },
    { 
      year: "Q4 2025", 
      title: "Spatial Retail XP", 
      desc: "Pioneered Apple Vision Pro try-on experiences for elite retailers.", 
      images: [
        "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=600",
        "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600",
        "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=600",
        "https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?q=80&w=600"
      ] 
    },
    { 
      year: "Q1 2026", 
      title: "Autonomous Logistics OS", 
      desc: "Dgion developed the core OS for warehouse robotics automation.", 
      images: [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600",
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600",
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600",
        "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?q=80&w=600"
      ] 
    },
    { 
      year: "Q2 2026", 
      title: "Quantum Risk Models", 
      desc: "Deployed early-stage quantum algorithms for high-stakes predictive finance.", 
      images: [
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600",
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600",
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600"
      ] 
    },
  ],

  journeyTimeline: [
    { year: "Q1 2024", title: "Dgion Established", desc: "Dgion was founded with a vision to bridge the gap between elite design and high-scale engineering." },
    { year: "Q2 2024", title: "First Legacy Project", desc: "Successfully delivered our first major e-commerce transformation for a global luxury brand." },
    { year: "Q3 2024", title: "Studio Expansion", desc: "Moved into our flagship digital studio and doubled our core engineering and design teams." },
    { year: "Q4 2024", title: "Innovation Lab", desc: "Launched Dgion Labs, an internal R&D division focused on Generative AI and WebGL performance." },
    { year: "Q1 2025", title: "Global Partnerships", desc: "Established strategic alliances with leading tech providers to scale our delivery capabilities." },
    { year: "Q2 2025", title: "Award Wins", desc: "Recognized as 'Rising Agency of the Year' at the International Digital Excellence Awards." },
    { year: "Q3 2025", title: "Product Launch", desc: "Released our first internal SaaS tool designed for elite creative agencies." },
    { year: "Q4 2025", title: "Scale at Speed", desc: "Reached a milestone of 50+ successful project deliveries across three continents." },
  ],


  // Why Choose Section
  whyTitle: "Why Choose ",
  whyHighlight: "DGION",
  whyPillars: [
    {
      num: "I",
      title: "AI-Powered Solutions",
      script: "AI",
      subtitle: "Artificial Intelligence",
      description: "We build intelligent systems — from ML pipelines and NLP engines to computer vision and predictive analytics — that give your business a competitive edge.",
      img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&auto=format&fit=crop",
      video: "https://videos.pexels.com/video-files/3129595/3129595-uhd_2560_1440_30fps.mp4",
    },
    {
      num: "II",
      title: "Full-Stack Engineering",
      script: "build",
      subtitle: "IT Projects & Products",
      description: "End-to-end development for startups and enterprises — web apps, mobile platforms, cloud infrastructure, APIs, and SaaS products built to scale globally.",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80&auto=format&fit=crop",
      video: "https://videos.pexels.com/video-files/3141208/3141208-uhd_2560_1440_25fps.mp4",
    },
    {
      num: "III",
      title: "Digital Growth Partner",
      script: "grow",
      subtitle: "Strategy & Marketing",
      description: "We drive real business results — brand strategy, performance marketing, SEO, and data-driven campaigns that turn clicks into customers and ideas into revenue.",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&auto=format&fit=crop",
      video: "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4",
    },
  ],
};
