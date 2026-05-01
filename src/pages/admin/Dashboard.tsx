import { Link } from "react-router-dom";
import {
  Home, Briefcase, Layers, Globe2, Users, Workflow, Mail, LayoutGrid, Building2, Rocket,
  ExternalLink, Shield, CheckCircle2, Clock, Layout,
} from "lucide-react";

/* Keep this in sync with AdminLayout's sidebar list. The dashboard only
 * needs the labels + statuses to drive the Overview cards. */
const editablePages = [
  { to: "/admin/home",       label: "Home Page",     desc: "Hero, overview, CTA.",             icon: Home,       status: "Editable" as const },
  { to: "/admin/explore",    label: "Explore Dgion", desc: "6-card stacked scroll section.",   icon: LayoutGrid, status: "Editable" as const },
  { to: "/admin/clients",    label: "Our Clients",   desc: "Partnership logos grid.",          icon: Building2,  status: "Editable" as const },
  { to: "/admin/cta",        label: "CTA Spotlight", desc: "\"Ready to Build\" call-to-action.", icon: Rocket,    status: "Editable" as const },
  { to: "/admin/services",   label: "Services",      desc: "Full services page content.",      icon: Layers,     status: "Editable" as const },
  { to: "/admin/portfolio",  label: "Portfolio",     desc: "Projects & case studies.",         icon: Briefcase,  status: "Editable" as const },
  { to: "/admin/process",    label: "Process",       desc: "How we work.",                     icon: Workflow,   status: "Editable" as const },
  { to: "/admin/industries", label: "Industries",    desc: "Sectors we transform.",            icon: Globe2,     status: "Editable" as const },
  { to: "/admin/about",      label: "About",         desc: "Story, values, team.",             icon: Users,      status: "Editable" as const },
  { to: "/admin/contact",    label: "Contact",       desc: "Form, address, map.",              icon: Mail,       status: "Editable" as const },
  { to: "/admin/footer",     label: "Footer Settings", desc: "Branding, links, copyright.",    icon: LayoutGrid, status: "Editable" as const },
  { to: "/admin/navbar",     label: "Navbar Menu",     desc: "Logo, header links, CTA.",         icon: Layout,     status: "Editable" as const },
  { to: "/admin/testimonials", label: "Reviews",       desc: "Client reviews & 3D marquee.",      icon: Users,      status: "Editable" as const },
];

export default function AdminDashboard() {
  const editableCount = editablePages.filter((p) => p.status === "Editable").length;
  const comingSoonCount = editablePages.filter((p) => p.status !== "Editable").length;

  return (
    <>
      {/* Top bar — sticky so it stays visible while scrolling the content area */}
      <header
        className="border-b border-white/5 sticky top-0 z-10"
        style={{ background: "rgba(10,8,24,0.8)", backdropFilter: "blur(10px)" }}
      >
        <div className="px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Dashboard</span>
            <span className="text-white/20">/</span>
            <span className="text-white text-sm font-semibold">Overview</span>
          </div>
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors"
          >
            View site <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      <main className="px-6 md:px-10 py-10 md:py-12 max-w-6xl mx-auto">
        {/* Welcome + stats */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">Welcome back 👋</h1>
          <p className="text-white/50 mt-2 text-sm">
            Pick a page on the left to edit. Changes publish to the live site in real time.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <StatCard icon={CheckCircle2} label="Editable pages" value={editableCount} tint="#4ade80" />
          <StatCard icon={Clock}        label="Coming soon"    value={comingSoonCount} tint="#f59e0b" />
          <StatCard icon={Shield}       label="Admins"         value="—" tint="#837FFB" note="Manage in Users" />
        </div>

        {/* Pages table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="px-5 py-3 flex items-center justify-between border-b border-white/5">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">All pages</span>
            <span className="text-xs text-white/40">{editablePages.length}</span>
          </div>
          <ul className="divide-y divide-white/5">
            {editablePages.map((p) => {
              const Icon = p.icon;
              const editable = p.status === "Editable";
              const Row = (
                <>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: editable ? "rgba(131,127,251,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${editable ? "rgba(131,127,251,0.25)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: editable ? "#837FFB" : "rgba(255,255,255,0.4)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold">{p.label}</p>
                    <p className="text-white/40 text-xs">{p.desc}</p>
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.18em] px-2 py-1 rounded-full"
                    style={{
                      color: editable ? "#4ade80" : "rgba(255,255,255,0.4)",
                      background: editable ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${editable ? "rgba(74,222,128,0.25)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    {p.status}
                  </span>
                </>
              );
              return editable ? (
                <li key={p.to}>
                  <Link to={p.to} className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                    {Row}
                  </Link>
                </li>
              ) : (
                <li key={p.to} className="px-5 py-4 flex items-center gap-4 cursor-not-allowed opacity-60">
                  {Row}
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </>
  );
}

/* ──────────────── Stat cards ──────────────── */

function StatCard({
  icon: Icon, label, value, tint, note,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: number | string;
  tint: string;
  note?: string;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `${tint}15`, border: `1px solid ${tint}30` }}
        >
          <Icon className="w-4 h-4" style={{ color: tint }} />
        </div>
      </div>
      <div className="text-white text-3xl font-bold leading-none">{value}</div>
      <p className="text-white/55 text-xs mt-1.5">{label}</p>
      {note && <p className="text-white/30 text-[10px] mt-0.5">{note}</p>}
    </div>
  );
}
