import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Home, Briefcase, Layers, Globe2, Users, Workflow, Mail,
  LayoutGrid, Building2, Rocket,
  LogOut, Shield, LayoutDashboard, Layout
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DgionLogo } from "../DgionLogo";

/**
 * Shared admin chrome: the left-hand sidebar persists across every admin
 * route. Individual pages render inside the <Outlet /> on the right.
 *
 * Keep the `editablePages` list here (not duplicated in each page) so the
 * sidebar is the one source of truth for admin navigation.
 */
const editablePages = [
  { to: "/admin/home",       label: "Home Page",     icon: Home,       status: "Editable" as const },
  { to: "/admin/explore",    label: "Explore Dgion", icon: LayoutGrid, status: "Editable" as const },
  { to: "/admin/clients",    label: "Our Clients",   icon: Building2,  status: "Editable" as const },
  { to: "/admin/cta",        label: "CTA Spotlight", icon: Rocket,     status: "Editable" as const },
  { to: "/admin/services",   label: "Services",      icon: Layers,     status: "Editable" as const },
  { to: "/admin/portfolio",  label: "Portfolio",     icon: Briefcase,  status: "Editable" as const },
  { to: "/admin/process",    label: "Process",       icon: Workflow,   status: "Editable" as const },
  { to: "/admin/industries", label: "Industries",    icon: Globe2,     status: "Editable" as const },
  { to: "/admin/about",      label: "About",         icon: Users,      status: "Editable" as const },
  { to: "/admin/contact",    label: "Contact",       icon: Mail,       status: "Editable" as const },
  { to: "/admin/footer",     label: "Footer Settings", icon: LayoutGrid, status: "Editable" as const },
  { to: "/admin/navbar",     label: "Navbar Menu",     icon: Layout,     status: "Editable" as const },
  { to: "/admin/testimonials", label: "Reviews",       icon: Users,      status: "Editable" as const },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Match by exact path for /admin (don't let it stay active when on a sub-route)
  const isActive = (to: string) => (to === "/admin" ? pathname === to : pathname.startsWith(to));

  return (
    <div className="admin-shell min-h-screen text-white flex transition-all duration-300" style={{ background: "#08061A" }}>
      {/* ─── Left sidebar ─── */}
      <aside
        className="hidden md:flex flex-col shrink-0 transition-all duration-300 border-r border-white/5 sticky top-0 h-screen z-50 shadow-2xl"
        style={{ 
          background: "#141033",
          width: collapsed ? "80px" : "260px" 
        }}
      >
        {/* Toggle & Logo */}
        <div className={`flex items-center px-6 py-5 border-b border-white/5 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-3 text-white font-bold text-lg tracking-tight truncate">
              <DgionLogo size={28} />
              <span>Dgion <span className="text-[#837FFB]">Admin</span></span>
            </Link>
          )}
          {collapsed && (
            <Link to="/admin" className="flex items-center justify-center">
              <DgionLogo size={28} />
            </Link>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Layout className="w-5 h-5 rotate-90" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-5 custom-scrollbar" data-lenis-prevent="true">
          <SidebarGroup label="Dashboard" collapsed={collapsed}>
            <SidebarItem to="/admin" icon={LayoutDashboard} label="Overview" active={isActive("/admin")} collapsed={collapsed} />
            <SidebarItem to="/admin/users" icon={Shield} label="Users" active={isActive("/admin/users")} collapsed={collapsed} />
          </SidebarGroup>

          <SidebarGroup label="Pages" collapsed={collapsed}>
            {editablePages.map((p) => (
              <SidebarItem
                key={p.to}
                to={p.to}
                icon={p.icon}
                label={p.label}
                active={isActive(p.to)}
                badge={p.status === "Editable" && !collapsed ? "Live" : undefined}
                disabled={p.status !== "Editable"}
                collapsed={collapsed}
              />
            ))}
          </SidebarGroup>
        </nav>

        {/* User footer */}
        <div className={`px-3 py-4 border-t border-white/5 ${collapsed ? "flex flex-col items-center gap-4" : ""}`}>
          <div
            className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${collapsed ? "w-12 h-12 justify-center" : "w-full"}`}
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ background: "linear-gradient(135deg,#837FFB,#5B57F5)" }}
            >
              {(user?.email?.[0] ?? "A").toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-white text-[11px] font-semibold truncate">{user?.email ?? "Admin"}</p>
                <p className="text-[9px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" /> online
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={signOut}
                title="Sign out"
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {collapsed && (
            <button
              onClick={signOut}
              title="Sign out"
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-all shadow-lg"
            >
              <LogOut className="w-5 h-5 text-red-400" />
            </button>
          )}
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <div className="flex-1 min-w-0 h-screen overflow-y-auto" data-lenis-prevent="true">
        <Outlet />
      </div>
    </div>
  );
}

/* ──────────────── Sidebar bits ──────────────── */

function SidebarGroup({ label, collapsed, children }: { label: string; collapsed: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      {!collapsed && <p className="px-6 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">{label}</p>}
      {collapsed && <div className="mx-auto w-8 h-px bg-white/10 mb-4" />}
      <div className="px-3 flex flex-col gap-1">{children}</div>
    </div>
  );
}

function SidebarItem({
  to, icon: Icon, label, active = false, disabled = false, badge, collapsed
}: {
  to: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
  collapsed: boolean;
}) {
  const classes = [
    "flex items-center rounded-xl text-sm font-medium transition-all group relative",
    active ? "bg-[#837FFB]/15 text-white" : "text-white/60 hover:text-white hover:bg-white/5",
    collapsed ? "justify-center w-12 h-12" : "gap-3 px-3 py-2.5",
    disabled ? "opacity-30 cursor-not-allowed pointer-events-none" : "",
  ].join(" ");

  const inner = (
    <>
      <Icon className={`w-5 h-5 shrink-0 transition-transform ${active ? "text-[#837FFB] scale-110" : "text-white/40 group-hover:scale-110 group-hover:text-white"}`} />
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {badge && !collapsed && (
        <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
          {badge}
        </span>
      )}
      
      {/* Tooltip for collapsed mode */}
      {collapsed && (
        <div className="absolute left-full ml-3 px-2 py-1 bg-[#837FFB] text-white text-[10px] font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] shadow-xl">
          {label}
        </div>
      )}
    </>
  );

  return disabled ? (
    <span className={classes}>{inner}</span>
  ) : (
    <Link to={to} className={classes} title={collapsed ? label : ""}>
      {inner}
    </Link>
  );
}
