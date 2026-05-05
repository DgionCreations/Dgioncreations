import {
  Search, Share2, BarChart3, FileText,
  Fingerprint, Layout, Rocket, LineChart, Brain, Video
} from "lucide-react";

const services = [
  {
    id: "seo",
    title: "SEO",
    full: "Search Engine Optimization",
    icon: Search,
    desc: "Dominate search rankings with technical SEO, on-page optimization, and data-driven keyword strategies.",
    hero: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=1400&h=800&fit=crop",
    color: "#4ade80",
    overview:
      "Our SEO specialists combine technical expertise with creative strategy to help your brand achieve dominant search visibility. We go beyond basic keyword stuffing — our approach encompasses site architecture, Core Web Vitals optimization, schema markup, backlink strategy, and content clustering to build sustainable organic growth.",
    features: [
      { title: "Technical SEO Audit", desc: "Comprehensive crawl analysis, indexation fixes, site speed optimization, and Core Web Vitals improvements." },
      { title: "Keyword Strategy", desc: "Data-driven keyword research, competitive gap analysis, and intent-mapping to capture high-converting traffic." },
      { title: "On-Page Optimization", desc: "Title tags, meta descriptions, header hierarchy, internal linking, and content optimization for maximum relevance." },
      { title: "Link Building", desc: "White-hat outreach, digital PR, guest posting, and authority building to strengthen domain credibility." },
      { title: "Content Clustering", desc: "Pillar-page architecture with topic clusters that establish topical authority and drive long-tail traffic." },
      { title: "Analytics & Reporting", desc: "Real-time dashboards, rank tracking, traffic attribution, and monthly performance reports with actionable insights." },
    ],
    stats: [
      { value: "340%", label: "Average traffic increase" },
      { value: "Top 3", label: "Keyword rankings achieved" },
      { value: "12x", label: "ROI on SEO investment" },
    ],
  },
  {
    id: "smm",
    title: "SMM",
    full: "Social Media Marketing",
    icon: Share2,
    desc: "Build brand authority across platforms with targeted campaigns and viral content strategies.",
    hero: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1400&h=800&fit=crop",
    color: "#38bdf8",
    overview:
      "We craft social media strategies that go beyond likes and follows. Our team creates platform-specific content calendars, manages community engagement, and runs precision-targeted ad campaigns that convert followers into customers across Instagram, LinkedIn, Twitter, TikTok, and Meta.",
    features: [
      { title: "Platform Strategy", desc: "Custom strategies for each platform — Instagram, LinkedIn, TikTok, Twitter, and Meta — aligned to your audience behavior." },
      { title: "Content Creation", desc: "Scroll-stopping visuals, reels, carousels, and copy crafted by our in-house creative team." },
      { title: "Community Management", desc: "Active engagement, comment moderation, DM handling, and brand voice consistency across all channels." },
      { title: "Paid Social Campaigns", desc: "Lookalike audiences, retargeting funnels, A/B creative testing, and budget optimization for maximum ROAS." },
      { title: "Influencer Partnerships", desc: "Identifying, vetting, and managing influencer collaborations that authentically amplify your brand reach." },
      { title: "Social Listening", desc: "Brand mention tracking, sentiment analysis, and competitor monitoring to stay ahead of trends." },
    ],
    stats: [
      { value: "5M+", label: "Impressions generated" },
      { value: "280%", label: "Engagement rate increase" },
      { value: "45%", label: "Lower cost-per-lead" },
    ],
  },
  {
    id: "ppc",
    title: "PPC",
    full: "Pay-Per-Click Advertising",
    icon: BarChart3,
    desc: "Maximize ROI with precision-targeted paid campaigns across Google, Meta, and programmatic channels.",
    hero: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=800&fit=crop",
    color: "#a855f7",
    overview:
      "Our performance marketing team obsesses over ROAS. We build, test, and scale paid campaigns across Google Ads, Meta Ads, LinkedIn, programmatic display, and emerging platforms — using advanced attribution models and real-time bid optimization to maximize every dollar spent.",
    features: [
      { title: "Google Ads Management", desc: "Search, Shopping, Display, YouTube, and Performance Max campaigns with granular keyword and audience targeting." },
      { title: "Meta Ads (Facebook & IG)", desc: "Full-funnel campaigns from awareness to conversion with dynamic creative, lookalike audiences, and CBO strategies." },
      { title: "Programmatic & Display", desc: "Automated media buying across premium publisher networks with contextual targeting and frequency capping." },
      { title: "Landing Page Optimization", desc: "Conversion-focused landing pages with A/B testing, heatmap analysis, and personalized user journeys." },
      { title: "Attribution Modeling", desc: "Multi-touch attribution, cross-channel measurement, and incrementality testing to understand true campaign impact." },
      { title: "Budget Optimization", desc: "AI-driven bid strategies, dayparting, geo-targeting, and dynamic budget allocation across channels." },
    ],
    stats: [
      { value: "8.2x", label: "Average ROAS" },
      { value: "62%", label: "Lower CPA" },
      { value: "$50M+", label: "Ad spend managed" },
    ],
  },
  {
    id: "content",
    title: "Content",
    full: "Content Marketing",
    icon: FileText,
    desc: "Craft compelling narratives with SEO-optimized blogs, video content, and thought leadership.",
    hero: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1400&h=800&fit=crop",
    color: "#f59e0b",
    overview:
      "Content is the backbone of digital presence. Our content strategists and writers produce high-quality, SEO-optimized content that educates, engages, and converts — from long-form blog posts and whitepapers to video scripts, email sequences, and social media copy.",
    features: [
      { title: "Content Strategy", desc: "Editorial calendars, content audits, persona mapping, and funnel-aligned content planning." },
      { title: "Blog & Article Writing", desc: "SEO-optimized long-form content with E-E-A-T compliance, internal linking, and multimedia integration." },
      { title: "Video Content", desc: "Scripting, storyboarding, and production management for YouTube, social media, and website video content." },
      { title: "Email Marketing", desc: "Drip campaigns, newsletters, onboarding sequences, and lifecycle email programs that nurture and convert." },
      { title: "Whitepapers & Case Studies", desc: "In-depth research reports and client success stories that establish thought leadership and generate leads." },
      { title: "Content Distribution", desc: "Multi-channel syndication, content repurposing, and amplification strategies to maximize reach and engagement." },
    ],
    stats: [
      { value: "500+", label: "Articles published" },
      { value: "4.2M", label: "Organic visits driven" },
      { value: "89%", label: "Client retention rate" },
    ],
  },
  {
    id: "brand",
    title: "Brand Identity & Positioning",
    full: "Brand Identity & Positioning",
    icon: Fingerprint,
    desc: "Define your market presence with distinctive visual identity and competitive positioning.",
    hero: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1400&h=800&fit=crop",
    color: "#f43f5e",
    overview:
      "Your brand is more than a logo — it's the emotional connection with your audience. We craft comprehensive brand identities that communicate your values, differentiate you from competitors, and create lasting impressions across every touchpoint.",
    features: [
      { title: "Brand Strategy", desc: "Mission, vision, values, brand archetype, positioning statement, and competitive differentiation framework." },
      { title: "Visual Identity", desc: "Logo design, color palette, typography system, iconography, and comprehensive brand guidelines." },
      { title: "Brand Voice & Tone", desc: "Messaging framework, tone of voice guidelines, taglines, and communication templates for consistency." },
      { title: "Brand Collateral", desc: "Business cards, presentations, social media templates, packaging, and marketing materials." },
      { title: "Brand Audit", desc: "Competitive analysis, perception studies, and brand health assessment with actionable recommendations." },
      { title: "Rebranding", desc: "Strategic brand evolution for established companies — refreshing visual identity while preserving brand equity." },
    ],
    stats: [
      { value: "200+", label: "Brands launched" },
      { value: "94%", label: "Brand recall improvement" },
      { value: "3.5x", label: "Perceived value increase" },
    ],
  },
  {
    id: "web-design",
    title: "Website Design",
    full: "Website Design & UX",
    icon: Layout,
    desc: "Design conversion-focused websites with intuitive UX, responsive layouts, and blazing performance.",
    hero: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1400&h=800&fit=crop",
    color: "#837FFB",
    overview:
      "We design and develop websites that are beautiful, fast, and conversion-optimized. Our design process combines user research, wireframing, and iterative prototyping with development best practices — delivering responsive, accessible, and performant web experiences.",
    features: [
      { title: "UX Research", desc: "User interviews, journey mapping, persona development, and competitive UX analysis." },
      { title: "High-End UI Design", desc: "Pixel-perfect visual design with custom design systems and component libraries." },
      { title: "Responsive Breakpoints", desc: "Seamless experiences across all device sizes from mobile to ultra-wide displays." },
      { title: "3D & Motion", desc: "Integration of Spline, Three.js, and GSAP for immersive digital storytelling." },
    ],
    stats: [
      { value: "150+", label: "Websites delivered" },
      { value: "99", label: "Lighthouse score average" },
      { value: "3.2x", label: "Conversion rate uplift" },
    ],
  },
  {
    id: "web-app",
    title: "Web App Development",
    full: "Enterprise Web Applications",
    icon: Rocket,
    desc: "Build scalable, high-performance web applications with modern tech stacks and secure cloud architecture.",
    hero: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&h=800&fit=crop",
    color: "#06b6d4",
    overview:
      "Our engineering team builds robust web applications designed to handle complex business logic and high traffic volumes. We specialize in React, Next.js, and Node.js architectures that are secure, scalable, and built for long-term growth.",
    features: [
      { title: "SaaS Architecture", desc: "Multi-tenant systems with secure authentication and subscription management." },
      { title: "API Development", desc: "High-performance REST and GraphQL APIs for seamless data integration." },
      { title: "Cloud Integration", desc: "AWS, Azure, or GCP setups with serverless functions and auto-scaling." },
      { title: "Real-time Systems", desc: "WebSocket integration for live data updates and collaborative features." },
    ],
    stats: [
      { value: "40+", label: "Apps in production" },
      { value: "99.9%", label: "System uptime" },
      { value: "10M+", label: "Monthly API calls" },
    ],
  },
  {
    id: "dla",
    title: "DLA",
    full: "Demand & Lead Acceleration",
    icon: Rocket,
    desc: "Build scalable lead pipelines with marketing automation and conversion optimization.",
    hero: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1400&h=800&fit=crop",
    color: "#837FFB",
    overview:
      "We engineer demand generation systems that fill your pipeline with qualified leads. From top-of-funnel awareness to bottom-of-funnel conversion, we build automated nurture sequences, optimize landing pages, and deploy multi-channel campaigns that accelerate revenue growth.",
    features: [
      { title: "Lead Generation", desc: "Multi-channel lead capture through gated content, webinars, quiz funnels, and interactive tools." },
      { title: "Marketing Automation", desc: "HubSpot, Marketo, and ActiveCampaign workflows with lead scoring, segmentation, and behavioral triggers." },
      { title: "Conversion Rate Optimization", desc: "A/B testing, form optimization, exit-intent popups, and user flow analysis to maximize conversion." },
      { title: "Account-Based Marketing", desc: "Targeted campaigns for high-value accounts with personalized content and multi-touch engagement." },
      { title: "Sales Enablement", desc: "Sales decks, battle cards, ROI calculators, and CRM integration for seamless lead handoff." },
      { title: "Pipeline Analytics", desc: "Funnel visualization, lead velocity, MQL/SQL tracking, and revenue attribution dashboards." },
    ],
    stats: [
      { value: "10K+", label: "Leads generated monthly" },
      { value: "67%", label: "MQL to SQL conversion" },
      { value: "4.8x", label: "Pipeline growth" },
    ],
  },
  {
    id: "idm",
    title: "IDM",
    full: "Insight-Driven Marketing",
    icon: LineChart,
    desc: "Turn data into decisions with advanced analytics, attribution modeling, and campaign intelligence.",
    hero: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&h=800&fit=crop",
    color: "#06b6d4",
    overview:
      "Data without insight is noise. Our analytics team transforms raw marketing data into actionable intelligence — building custom dashboards, implementing tracking infrastructure, and providing strategic recommendations that drive measurable business outcomes.",
    features: [
      { title: "Analytics Implementation", desc: "GA4, GTM, server-side tracking, consent management, and cross-domain measurement setup." },
      { title: "Custom Dashboards", desc: "Real-time Looker Studio, Tableau, or custom dashboards with KPIs tailored to your business goals." },
      { title: "Attribution Modeling", desc: "Multi-touch attribution, marketing mix modeling, and incrementality testing for accurate ROI measurement." },
      { title: "Customer Data Platform", desc: "Unified customer profiles, segmentation, and activation across marketing channels and touchpoints." },
      { title: "Predictive Analytics", desc: "Churn prediction, LTV modeling, propensity scoring, and AI-powered campaign optimization." },
      { title: "Competitive Intelligence", desc: "Market share analysis, competitor benchmarking, and trend forecasting to inform strategic decisions." },
    ],
    stats: [
      { value: "99.9%", label: "Tracking accuracy" },
      { value: "42%", label: "Better budget allocation" },
      { value: "2.1x", label: "Faster decision-making" },
    ],
  },
  {
    id: "growth",
    title: "Growth Engineering",
    full: "Full-Funnel Growth Engineering",
    icon: LineChart,
    desc: "Scale your revenue with data-driven experimentation, CRO, and advanced marketing analytics.",
    hero: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&h=800&fit=crop",
    color: "#10b981",
    overview:
      "Growth engineering is the intersection of marketing, data, and product. We build experimentation frameworks that allow for rapid testing and scaling of what works — optimizing every stage of the funnel from first touch to retention.",
    features: [
      { title: "Conversion Rate Optimization", desc: "Systematic A/B testing and user behavior analysis to maximize landing page performance." },
      { title: "Funnel Analytics", desc: "End-to-end tracking of user journeys to identify and remove conversion friction points." },
      { title: "Retention Strategies", desc: "Data-driven lifecycle marketing and product features designed to increase LTV." },
      { title: "Viral Loops", desc: "Engineering social sharing and referral systems into the core product experience." },
    ],
    stats: [
      { value: "3.5x", label: "Average conversion lift" },
      { value: "48%", label: "Lower churn rate" },
      { value: "200+", label: "Experiments run" },
    ],
  },
  {
    id: "ai",
    title: "AI",
    full: "AI Projects Development",
    icon: Brain,
    desc: "Build production-grade AI solutions — agents, LLM copilots, RAG pipelines, and predictive models tailored to your business.",
    hero: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&h=800&fit=crop",
    color: "#a855f7",
    overview:
      "We turn GenAI hype into real, shipping software. Our team designs and deploys LLM-powered copilots, retrieval-augmented generation (RAG) systems, autonomous agents, and custom predictive models on your data. Every build is engineered for cost, latency, and observability — so your AI scales from prototype to production without rewrites.",
    features: [
      { title: "LLM Copilots & Chatbots", desc: "Domain-tuned assistants for support, sales, and internal workflows — integrated with your knowledge base and tools." },
      { title: "RAG Pipelines", desc: "Vector search, hybrid retrieval, reranking, and grounded generation with citation — delivering accurate, up-to-date answers." },
      { title: "Autonomous Agents", desc: "Multi-step agents that plan, call tools, and execute business workflows with guardrails and human-in-the-loop oversight." },
      { title: "Predictive ML Models", desc: "Custom churn, LTV, demand-forecasting, and recommendation models trained on your data and deployed at scale." },
      { title: "MLOps & Evaluation", desc: "CI/CD for models, prompt versioning, offline eval harnesses, online A/B and drift monitoring — treat AI like real software." },
      { title: "AI Integration & APIs", desc: "Securely wire AI into your stack — OpenAI, Anthropic, open-source models, plus custom APIs, vector DBs, and data warehouses." },
    ],
    stats: [
      { value: "60%", label: "Support volume deflected" },
      { value: "4x", label: "Faster internal workflows" },
      { value: "<300ms", label: "Median agent latency" },
    ],
  },
  {
    id: "production",
    title: "Production",
    full: "Cinematic Digital Production",
    icon: Video,
    desc: "High-end video production, motion design, and storytelling that captures attention and drives emotional resonance.",
    hero: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1400&h=800&fit=crop",
    color: "#facc15",
    overview:
      "We blend cinematic techniques with digital strategy to create content that doesn't just look good — it performs. From brand films to social-first motion systems, we bring your vision to life through high-end digital production and post-production excellence.",
    features: [
      { title: "Brand Storytelling", desc: "Crafting cinematic narratives that define your brand identity and build deep emotional connections with your audience." },
      { title: "3D & Motion Graphics", desc: "High-end visual effects, 3D animation, and motion design systems that make your digital presence feel alive and premium." },
      { title: "Post-Production", desc: "Professional editing, color grading, and sound design that ensure your content meets the highest industry standards." },
      { title: "Social Content Systems", desc: "Batch production of social-first video content designed for maximum engagement on TikTok, Reels, and Shorts." },
    ],
    stats: [
      { value: "40%", label: "Average engagement boost" },
      { value: "150+", label: "Campaigns delivered" },
      { value: "12M+", label: "Total views generated" },
    ],
  },
];

// Display order — AI first, Web & App Solutions (ux) second, then the rest.
// The raw `services` array keeps its natural definition order so each entry
// stays grouped with its docs; this lookup just re-slots them for the UI.
const DISPLAY_ORDER = ["web-design", "web-app", "seo", "smm", "ppc", "content", "brand", "growth", "ai", "production"];
const orderedServices = DISPLAY_ORDER
  .map((id) => services.find((s) => s.id === id))
  .filter((s): s is (typeof services)[number] => Boolean(s));

export default orderedServices;

export function getServiceById(id: string) {
  return services.find((s) => s.id === id);
}