export interface Project {
  id: string;
  title: string;
  industry: string;
  tagline: string;
  description: string;
  image: string;
  thumb: string;
  tech: string[];
  features: string[];
  stats: { label: string; value: string }[];
  challenge: string;
  solution: string;
  results: string;
}

const projects: Project[] = [
  {
    id: "medisync",
    title: "MediSync",
    industry: "Healthcare",
    tagline: "AI-Powered Telemedicine Platform",
    description:
      "HIPAA-compliant telemedicine platform serving 500K+ patients across 12 countries with real-time diagnostics and AI-assisted care plans.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&h=900&fit=crop",
    thumb:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop",
    tech: ["React", "Node.js", "AWS", "TensorFlow", "PostgreSQL", "WebRTC"],
    features: [
      "Real-time HD video consultations",
      "AI-assisted diagnostic suggestions",
      "Electronic health records management",
      "Automated appointment scheduling",
      "Multi-language support across 12 countries",
      "End-to-end HIPAA compliance & encryption",
    ],
    stats: [
      { label: "Patients Served", value: "500K+" },
      { label: "Countries", value: "12" },
      { label: "Uptime", value: "99.99%" },
      { label: "Avg Response", value: "<2s" },
    ],
    challenge:
      "Healthcare providers across 12 countries needed a unified, secure platform for remote consultations — one that could handle real-time video at scale while remaining fully HIPAA-compliant.",
    solution:
      "We built a cloud-native telemedicine platform with end-to-end encryption, AI-powered triage, and an adaptive bitrate video engine that adjusts to each patient's network conditions in real time.",
    results:
      "The platform now serves over 500,000 patients with 99.99% uptime, reduced average diagnosis time by 40%, and expanded healthcare access to underserved regions across three continents.",
  },
  {
    id: "finflow",
    title: "FinFlow Dashboard",
    industry: "Finance",
    tagline: "Real-Time Trading Analytics",
    description:
      "Real-time trading analytics platform with AI-powered insights, predictive modelling, and institutional-grade risk assessment across global markets.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&h=900&fit=crop",
    thumb:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    tech: ["React", "Python", "FastAPI", "Redis", "Kafka", "D3.js"],
    features: [
      "Live market data with sub-millisecond latency",
      "AI-driven predictive modelling engine",
      "Multi-asset portfolio risk assessment",
      "Custom alert & notification system",
      "Regulatory compliance dashboard",
      "White-label solution for institutions",
    ],
    stats: [
      { label: "Daily Transactions", value: "2M+" },
      { label: "Markets Covered", value: "45" },
      { label: "Latency", value: "<50ms" },
      { label: "Risk Reduction", value: "28%" },
    ],
    challenge:
      "Institutional traders needed a single dashboard to monitor global markets in real time, with AI insights that could flag risk before it materialised — all at sub-50ms latency.",
    solution:
      "We engineered a streaming analytics platform using Kafka and Redis for real-time data ingestion, paired with custom ML models for predictive risk scoring across 45 global markets.",
    results:
      "The platform processes over 2 million daily transactions, reduced portfolio risk exposure by 28%, and is now used by three tier-1 financial institutions.",
  },
  {
    id: "shopverse",
    title: "ShopVerse",
    industry: "E-commerce",
    tagline: "AI-Personalised Shopping Experience",
    description:
      "AI-personalized shopping with 3D product visualisation, real-time inventory sync, and a predictive recommendation engine boosting conversion 3.2×.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&h=900&fit=crop",
    thumb:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
    tech: ["Next.js", "Three.js", "GraphQL", "Stripe", "Algolia", "AWS"],
    features: [
      "3D product visualisation & AR try-on",
      "AI recommendation engine (3.2× conversion)",
      "Real-time inventory sync across warehouses",
      "One-click checkout with Stripe",
      "Multi-language, multi-currency support",
      "Advanced search with Algolia",
    ],
    stats: [
      { label: "Conversion Boost", value: "3.2×" },
      { label: "Products Listed", value: "120K+" },
      { label: "Load Time", value: "<1.2s" },
      { label: "Monthly Users", value: "800K" },
    ],
    challenge:
      "An e-commerce brand with 120K products needed a next-gen storefront that could personalise the shopping journey for each visitor while keeping page loads under 1.5 seconds.",
    solution:
      "We built a headless commerce platform with 3D product previews, an ML-based recommendation engine trained on purchase history, and edge-cached pages that load in under 1.2 seconds globally.",
    results:
      "Conversion rates jumped 3.2× within three months, average session duration increased by 45%, and cart abandonment dropped by 22%.",
  },
  {
    id: "eduneural",
    title: "EduNeural",
    industry: "Education",
    tagline: "Neural Adaptive Learning Platform",
    description:
      "Neural network-driven adaptive learning platform personalising curriculum in real-time across 200+ subjects for K-12 and higher education.",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1400&h=900&fit=crop",
    thumb:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=250&fit=crop",
    tech: ["React", "Python", "PyTorch", "Firebase", "WebSocket", "GCP"],
    features: [
      "AI-driven adaptive curriculum engine",
      "Real-time progress tracking & analytics",
      "Interactive virtual classrooms",
      "Gamified learning with achievement system",
      "Parent & teacher dashboards",
      "200+ subjects from K-12 to university",
    ],
    stats: [
      { label: "Students", value: "150K+" },
      { label: "Subjects", value: "200+" },
      { label: "Completion Rate", value: "89%" },
      { label: "Score Improvement", value: "+34%" },
    ],
    challenge:
      "Educational institutions needed a platform that adapts to each student's learning pace and style — not a one-size-fits-all curriculum, but truly personalised pathways across hundreds of subjects.",
    solution:
      "We developed a neural-network-driven engine that analyses each student's performance in real time, adjusting difficulty, content format, and pacing to maximise retention and engagement.",
    results:
      "Course completion rates rose to 89% (from 52%), average test scores improved by 34%, and the platform now serves 150,000 students across 45 institutions.",
  },
  {
    id: "logitrack",
    title: "LogiTrack",
    industry: "Logistics",
    tagline: "AI Fleet & Supply Chain Platform",
    description:
      "End-to-end fleet management with real-time GPS, AI route optimisation, and predictive maintenance — cutting fuel costs by 35%.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&h=900&fit=crop",
    thumb:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop",
    tech: ["React Native", "Go", "gRPC", "TimescaleDB", "Mapbox", "IoT"],
    features: [
      "Real-time GPS fleet tracking",
      "AI-powered route optimisation",
      "Predictive vehicle maintenance alerts",
      "Automated dispatch & scheduling",
      "Driver performance analytics",
      "IoT sensor integration for cargo monitoring",
    ],
    stats: [
      { label: "Fuel Savings", value: "35%" },
      { label: "Vehicles Tracked", value: "8K+" },
      { label: "Routes Optimised", value: "50K/day" },
      { label: "Downtime Reduction", value: "60%" },
    ],
    challenge:
      "A logistics company operating 8,000+ vehicles across three countries needed to cut fuel costs and eliminate unexpected breakdowns that were costing millions annually.",
    solution:
      "We built a real-time fleet intelligence platform with IoT telemetry, ML-driven route optimisation, and predictive maintenance that flags issues 72 hours before failure.",
    results:
      "Fuel costs dropped 35%, unplanned vehicle downtime fell by 60%, and the company saves an estimated $4.2M annually on maintenance and fuel combined.",
  },
];

export default projects;

/* helper: find project by industry label (matches Globe markers) */
export function getProjectByIndustry(industry: string) {
  return projects.find((p) => p.industry === industry);
}