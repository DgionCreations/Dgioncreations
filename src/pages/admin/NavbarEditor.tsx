import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Save, Check, AlertCircle, Type, Link as LinkIcon, 
  ChevronRight, ExternalLink, Loader2, Plus, Trash2, Layout
} from "lucide-react";
import { useContent, saveContent } from "@/lib/use-content";
import {
  NAVBAR_CONTENT_KEY,
  defaultNavbarContent,
  type NavbarContent,
  type NavLink
} from "@/content/navbar";
import TextStyleEditor from "@/components/admin/TextStyleEditor";

export default function NavbarEditor() {
  const { data, loading } = useContent<NavbarContent>(NAVBAR_CONTENT_KEY, defaultNavbarContent);
  const [draft, setDraft] = useState<NavbarContent>(defaultNavbarContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(data);

  useEffect(() => {
    if (!loading) setDraft(data);
  }, [loading, data]);

  const onSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await saveContent<NavbarContent>(NAVBAR_CONTENT_KEY, draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)" }}>
      <header className="sticky top-0 z-20" style={{ background: "rgba(8,6,26,0.85)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <span className="hidden md:block w-px h-5 bg-white/10" />
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-white/35">Editing</span>
            <span className="px-2.5 py-1 rounded-md font-bold tracking-wider uppercase" style={{ background: "rgba(131,127,251,0.12)", color: "#837FFB", border: "1px solid rgba(131,127,251,0.3)", fontSize: 10 }}>Navbar Navigation</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            {saved ? (
              <span className="text-xs text-green-400 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Published
              </span>
            ) : dirty ? (
              <span className="text-xs text-amber-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Unpublished
              </span>
            ) : (
              <span className="text-xs text-white/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" /> In sync
              </span>
            )}
            <button 
              onClick={onSave} 
              disabled={saving || !dirty} 
              className="px-5 py-2 rounded-lg font-semibold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-40" 
              style={{ background: "linear-gradient(135deg, #837FFB, #5B57F5)", boxShadow: "0 4px 16px rgba(131,127,251,0.3)" }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 pb-32">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-white/40">
            <Link to="/admin" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#837FFB]">Navbar Editor</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Navigation — Header Bar</h1>
          <p className="text-white/45 text-sm mt-2 max-w-xl">
            Customize your brand logo, primary navigation links, and the call-to-action button.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl flex items-start gap-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-sm text-red-300">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <SectionPanel title="Branding" subtitle="Global site logo and identity." icon={Type}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Logo Typography</p>
              <TextStyleEditor 
                label="Logo Style"
                value={draft.logoStyle} 
                fallback={defaultNavbarContent.logoStyle}
                onChange={v => setDraft(d => ({ ...d, logoStyle: v }))} 
                previewText={draft.logoText}
              />
              <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                <Field label="Logo Text" value={draft.logoText} onChange={v => setDraft(d => ({ ...d, logoText: v }))} />
                <Field label="Logo Link (URL)" value={draft.logoHref} onChange={v => setDraft(d => ({ ...d, logoHref: v }))} />
              </div>
            </SectionPanel>

            <SectionPanel title="Action Button" subtitle="The highlighted CTA on the right." icon={Layout}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Button Typography</p>
              <TextStyleEditor 
                label="Button Style"
                value={draft.ctaStyle} 
                fallback={defaultNavbarContent.ctaStyle}
                onChange={v => setDraft(d => ({ ...d, ctaStyle: v }))} 
                previewText={draft.ctaText}
              />
              <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                <Field label="Button Text" value={draft.ctaText} onChange={v => setDraft(d => ({ ...d, ctaText: v }))} />
                <Field label="Button URL" value={draft.ctaHref} onChange={v => setDraft(d => ({ ...d, ctaHref: v }))} />
              </div>
            </SectionPanel>
          </div>

          <div>
            <SectionPanel title="Navigation Links" subtitle="The main menu items in the center." icon={LinkIcon}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Menu Typography</p>
              <TextStyleEditor 
                label="Menu Style"
                value={draft.linksStyle} 
                fallback={defaultNavbarContent.linksStyle}
                onChange={v => setDraft(d => ({ ...d, linksStyle: v }))} 
                previewText="Menu Item"
              />

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                {draft.links.map((link, i) => (
                  <div key={i} className="rounded-xl p-4 bg-white/[0.03] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Link 0{i + 1}</span>
                      <button 
                        onClick={() => setDraft(d => ({ ...d, links: d.links.filter((_, idx) => idx !== i) }))}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Label" value={link.label} onChange={v => setDraft(d => ({ ...d, links: d.links.map((l, idx) => idx === i ? { ...l, label: v } : l) }))} />
                      <Field label="URL" value={link.href} onChange={v => setDraft(d => ({ ...d, links: d.links.map((l, idx) => idx === i ? { ...l, href: v } : l) }))} />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => setDraft(d => ({ ...d, links: [...d.links, { label: "New Link", href: "#" }] }))}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/50 hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Navigation Link
                </button>
              </div>
            </SectionPanel>
          </div>
        </div>

        {/* Floating Save Bar */}
        <div className="fixed bottom-8 left-[260px] right-0 z-30 px-6 md:px-10 pointer-events-none">
          <div 
            className="max-w-5xl mx-auto p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4 pointer-events-auto"
            style={{ 
              background: "rgba(13,11,36,0.95)", 
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(131,127,251,0.3)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
            }}
          >
            <div className="flex-1 text-center md:text-left">
              <p className="text-white text-sm font-bold">Ready to update your navigation?</p>
              <p className="text-white/50 text-[11px] mt-0.5">Your changes will be live instantly across all pages.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white/70 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <ExternalLink className="w-3 h-3" /> Preview
              </Link>
              <button 
                onClick={onSave} 
                disabled={saving || !dirty} 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5" 
                style={{ background: "linear-gradient(135deg, #837FFB, #5B57F5)" }}
              >
                {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing...</> : <><Save className="w-3.5 h-3.5" /> Publish Changes</>}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionPanel({ title, subtitle, icon: Icon, children }: any) {
  return (
    <section className="rounded-2xl overflow-hidden mb-6 flex flex-col" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
      <div className="px-7 py-5 flex items-center gap-4" style={{ background: "linear-gradient(135deg, rgba(131,127,251,0.05), rgba(131,127,251,0.01))", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(131,127,251,0.14)", border: "1px solid rgba(131,127,251,0.3)" }}>
          <Icon className="w-5 h-5 text-[#837FFB]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white text-xl font-bold tracking-tight">{title}</h2>
          <p className="text-white/50 text-sm mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="px-7 py-6 space-y-6 flex-1">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange, placeholder }: any) {
  const common = {
    value, placeholder,
    onChange: (e: any) => onChange(e.target.value),
    className: "w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] text-white text-sm outline-none focus:ring-2 focus:ring-[#837FFB]/40 focus:bg-white/[0.06] transition-colors",
    style: { border: "1px solid rgba(255,255,255,0.08)" }
  };
  return (
    <label className="block w-full">
      <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 mb-1.5">{label}</span>
      <input type="text" {...common} />
    </label>
  );
}
