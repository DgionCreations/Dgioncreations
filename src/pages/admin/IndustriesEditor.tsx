import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Save, Check, AlertCircle, Type, Globe2, Plus, Trash2,
  ChevronRight, ExternalLink, Loader2, ChevronUp, ChevronDown, Palette, Eye
} from "lucide-react";
import { useContent, saveContent } from "@/lib/use-content";
import {
  INDUSTRIES_CONTENT_KEY,
  defaultIndustriesContent,
  type IndustriesContent,
  type Industry,
  DEFAULT_INDUSTRIES_TITLE_STYLE,
  DEFAULT_INDUSTRIES_HIGHLIGHT_STYLE
} from "@/content/industries";
import TextStyleEditor from "@/components/admin/TextStyleEditor";
import WordHighlightPicker from "@/components/admin/WordHighlightPicker";

const TABS = [
  { id: "hero",      label: "Hero Section", icon: Type,   hint: "Page title & highlight" },
  { id: "sectors",   label: "Globe Sectors", icon: Globe2, hint: "Industry accordion items" },
  { id: "deepdive",  label: "Deep Dive",     icon: Eye,    hint: "Detailed sector cards" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function IndustriesEditor() {
  const { data, loading } = useContent<IndustriesContent>(INDUSTRIES_CONTENT_KEY, defaultIndustriesContent);
  const [draft, setDraft] = useState<IndustriesContent>(defaultIndustriesContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("hero");

  const dirty = JSON.stringify(draft) !== JSON.stringify(data);

  useEffect(() => {
    if (!loading) setDraft(data);
  }, [loading, data]);

  const onSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await saveContent<IndustriesContent>(INDUSTRIES_CONTENT_KEY, draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const activeIndex = TABS.findIndex(t => t.id === activeTab);

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)" }}>
      <Header 
        saving={saving} 
        saved={saved} 
        dirty={dirty} 
        onSave={onSave} 
        tabLabel={TABS[activeIndex]?.label ?? ""}
        tabIndex={activeIndex + 1}
        tabTotal={TABS.length}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-white/40">
            <Link to="/admin" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#837FFB]">Industries Page</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Industries — Sectors We Empower</h1>
          <p className="text-white/45 text-sm mt-2 max-w-xl">
            Edit the industries you serve, their descriptions, and visual accents.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl flex items-start gap-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-sm text-red-300">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Sections sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(180deg, rgba(13,11,36,0.9), rgba(8,6,26,0.9))",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)"
              }}
            >
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/45">Sections</span>
                <span className="text-[10px] font-bold tracking-wider text-white/45">
                  {activeIndex + 1} / {TABS.length}
                </span>
              </div>

              <div className="space-y-2">
                {TABS.map((t, i) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  const num = String(i + 1).padStart(2, "0");
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className="relative w-full rounded-xl p-3 text-left transition-all overflow-hidden group"
                      style={{
                        background: isActive
                          ? "linear-gradient(135deg, rgba(131,127,251,0.18), rgba(131,127,251,0.04))"
                          : "rgba(255,255,255,0.025)",
                        border: `1px solid ${isActive ? "rgba(131,127,251,0.55)" : "rgba(255,255,255,0.06)"}`,
                      }}
                    >
                      {isActive && (
                        <span
                          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r"
                          style={{ background: "#837FFB", boxShadow: "0 0 12px rgba(131,127,251,0.7)" }}
                        />
                      )}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold tracking-wider"
                          style={{
                            background: isActive
                              ? "linear-gradient(135deg, rgba(131,127,251,0.45), rgba(91,87,245,0.18))"
                              : "rgba(255,255,255,0.04)",
                            color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                            border: `1px solid ${isActive ? "rgba(131,127,251,0.6)" : "rgba(255,255,255,0.07)"}`,
                          }}
                        >
                          {num}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-sm font-bold truncate"
                            style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.78)" }}
                          >
                            {t.label}
                          </h3>
                          <p className="text-white/40 text-[11px] mt-0.5 line-clamp-1">{t.hint}</p>
                        </div>
                        <Icon
                          className="w-4 h-4 shrink-0 transition-colors"
                          style={{ color: isActive ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.28)" }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              <Link
                to="/industries"
                target="_blank"
                className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.22em] transition-all hover:bg-white/[0.07]"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <Eye className="w-3.5 h-3.5" /> Preview Live
              </Link>
            </div>
          </aside>

          {/* Tab content column */}
          <div className="min-w-0">
        {/* Tab Content */}
        {activeTab === "hero" && (
          <SectionPanel title="Hero Section" subtitle="The main title and highlight word for the industries section." icon={Type}>
            <FieldGroup legend="Headline">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3 items-start">
                <Field
                  label="Hero Title"
                  multiline
                  value={draft.heroTitle}
                  onChange={v => setDraft(d => ({ ...d, heroTitle: v }))}
                />
                <WordHighlightPicker
                  value={draft.heroTitle}
                  onChange={(v: string) => setDraft(d => ({ ...d, heroTitle: v }))}
                  baseStyle={draft.heroTitleStyle ?? DEFAULT_INDUSTRIES_TITLE_STYLE}
                  highlightStyle={draft.heroHighlightStyle ?? DEFAULT_INDUSTRIES_HIGHLIGHT_STYLE}
                />
              </div>
              <TextStyleEditor
                label="Title Style"
                value={draft.heroTitleStyle ?? DEFAULT_INDUSTRIES_TITLE_STYLE}
                fallback={DEFAULT_INDUSTRIES_TITLE_STYLE}
                onChange={v => setDraft(d => ({ ...d, heroTitleStyle: v }))}
                previewText={(draft.heroTitle.split("\n")[0] || "Title").replace(/\*\*([^*\n]+?)(?:\|[^*\n]*)?\*\*/g, "$1")}
              />
              <TextStyleEditor
                label="Highlight Style"
                value={draft.heroHighlightStyle ?? DEFAULT_INDUSTRIES_HIGHLIGHT_STYLE}
                fallback={DEFAULT_INDUSTRIES_HIGHLIGHT_STYLE}
                onChange={v => setDraft(d => ({ ...d, heroHighlightStyle: v }))}
                previewText={(draft.heroTitle.match(/\*\*([^*\n|]+?)(?:\|[^*\n]*)?\*\*/)?.[1]) || draft.heroHighlight || "Highlight"}
              />
              {!draft.heroTitle.includes("**") && (
                <div className="rounded-lg p-3 space-y-2" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)" }}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300">
                      Legacy "Highlighted Word" field
                    </span>
                    <button
                      type="button"
                      onClick={() => setDraft(d => ({ ...d, heroHighlight: "" }))}
                      className="text-[10px] font-bold uppercase tracking-wider text-amber-200 hover:text-white px-2.5 py-1 rounded transition-colors"
                      style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.4)" }}
                    >
                      Clear
                    </button>
                  </div>
                  <input
                    type="text"
                    value={draft.heroHighlight}
                    onChange={e => setDraft(d => ({ ...d, heroHighlight: e.target.value }))}
                    placeholder="Edit or clear the legacy highlight word…"
                    className="w-full px-3 py-2 rounded-md bg-white/[0.04] text-white text-sm outline-none focus:ring-2 focus:ring-amber-400/40"
                    style={{ border: "1px solid rgba(251,191,36,0.2)" }}
                  />
                  <p className="text-[10px] text-amber-200/60 leading-snug">
                    Tip: clear this field aur Hero Title mein <code className="text-amber-200">**word**</code> markup use karo — naya word picker activate ho jayega.
                  </p>
                </div>
              )}
            </FieldGroup>
          </SectionPanel>
        )}

        {activeTab === "deepdive" && (
          <div className="space-y-6">
            <SectionPanel title="Deep Dive Header" subtitle="Title for the detailed sector section." icon={Type}>
               <Field 
                 label="Section Title" 
                 value={draft.deepDiveTitle} 
                 onChange={(v: string) => setDraft(d => ({ ...d, deepDiveTitle: v }))} 
               />
            </SectionPanel>

            {draft.deepDiveSectors.map((s, i) => (
              <SectionPanel 
                key={i} 
                title={s.label || "New Card"} 
                subtitle={`Configure the ${s.label?.toLowerCase() || "card"} details.`} 
                icon={Eye}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                     <FieldGroup legend="Content">
                        <div className="grid grid-cols-2 gap-4">
                          <Field label="Label" value={s.label} onChange={(v: string) => setDraft(d => ({ ...d, deepDiveSectors: d.deepDiveSectors.map((card, idx) => idx === i ? { ...card, label: v } : card) }))} />
                          <Field label="Tag" value={s.tag} onChange={(v: string) => setDraft(d => ({ ...d, deepDiveSectors: d.deepDiveSectors.map((card, idx) => idx === i ? { ...card, tag: v } : card) }))} />
                        </div>
                        <Field label="Icon Key" value={s.iconKey} onChange={(v: string) => setDraft(d => ({ ...d, deepDiveSectors: d.deepDiveSectors.map((card, idx) => idx === i ? { ...card, iconKey: v } : card) }))} />
                        <Field label="Description" multiline value={s.desc} onChange={(v: string) => setDraft(d => ({ ...d, deepDiveSectors: d.deepDiveSectors.map((card, idx) => idx === i ? { ...card, desc: v } : card) }))} />
                     </FieldGroup>
                   </div>
                   <div className="space-y-4">
                     <FieldGroup legend="Stats & Color">
                        <Field label="Accent Color" value={s.color} onChange={(v: string) => setDraft(d => ({ ...d, deepDiveSectors: d.deepDiveSectors.map((card, idx) => idx === i ? { ...card, color: v } : card) }))} />
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 block">Statistical Wins</span>
                          {s.wins.map((w, wi) => (
                            <div key={wi} className="flex gap-2">
                              <Field 
                                label="" 
                                value={w} 
                                onChange={(v: string) => setDraft(d => ({ ...d, deepDiveSectors: d.deepDiveSectors.map((card, idx) => idx === i ? { ...card, wins: card.wins.map((stat, sidx) => sidx === wi ? v : stat) } : card) }))} 
                              />
                              <button 
                                onClick={() => setDraft(d => ({ ...d, deepDiveSectors: d.deepDiveSectors.map((card, idx) => idx === i ? { ...card, wins: card.wins.filter((_, sidx) => sidx !== wi) } : card) }))}
                                className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors self-end mb-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => setDraft(d => ({ ...d, deepDiveSectors: d.deepDiveSectors.map((card, idx) => idx === i ? { ...card, wins: [...card.wins, "New Stat"] } : card) }))}
                            className="w-full py-2 rounded-lg bg-white/5 border border-dashed border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3 inline mr-1" /> Add Stat
                          </button>
                        </div>
                     </FieldGroup>
                   </div>
                </div>
                <div className="flex justify-end pt-4">
                   <button 
                     onClick={() => setDraft(d => ({ ...d, deepDiveSectors: d.deepDiveSectors.filter((_, idx) => idx !== i) }))}
                     className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-400/10 transition-colors"
                   >
                     <Trash2 className="w-3.5 h-3.5" /> Remove Card
                   </button>
                </div>
              </SectionPanel>
            ))}
            <button 
              onClick={() => setDraft(d => ({ ...d, deepDiveSectors: [...d.deepDiveSectors, { label: "New Sector", tag: "Tech", iconKey: "code", desc: "Description here...", color: "#837FFB", wins: ["New Stat"] }] }))}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-dashed border-white/20 text-white/50 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" /> Add New Deep Dive Card
            </button>
          </div>
        )}

          </div>
        </div>

        {/* Footer save/preview bar */}
        <div className="mt-10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4" style={{ background: "linear-gradient(135deg, rgba(131,127,251,0.1), rgba(91,87,245,0.04))", border: "1px solid rgba(131,127,251,0.25)" }}>
          <div className="flex-1 text-center md:text-left">
            <p className="text-white font-bold">Ready to go live?</p>
            <p className="text-white/55 text-sm mt-0.5">Your industry sectors will be updated across the site instantly.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/industries" target="_blank" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white/80 transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <ExternalLink className="w-3.5 h-3.5" /> Preview
            </Link>
            <button onClick={onSave} disabled={saving || !dirty} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : <><Save className="w-4 h-4" /> Publish Changes</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Header({ saving, saved, dirty, onSave, tabLabel, tabIndex, tabTotal }: any) {
  return (
    <header className="sticky top-0 z-20" style={{ background: "rgba(8,6,26,0.85)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, #837FFB 0%, #837FFB ${(tabIndex / tabTotal) * 100}%, rgba(255,255,255,0.06) ${(tabIndex / tabTotal) * 100}%, rgba(255,255,255,0.06) 100%)` }} />
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <span className="hidden md:block w-px h-5 bg-white/10" />
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="text-white/35">Editing</span>
          <span className="px-2.5 py-1 rounded-md font-bold tracking-wider uppercase" style={{ background: "rgba(131,127,251,0.12)", color: "#837FFB", border: "1px solid rgba(131,127,251,0.3)", fontSize: 10 }}>{tabLabel}</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          {saved ? <span className="text-xs text-green-400 font-semibold flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Published</span> : dirty ? <span className="text-xs text-amber-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Unpublished</span> : <span className="text-xs text-white/40 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-white/30" /> In sync</span>}
          <button onClick={onSave} disabled={saving || !dirty} className="px-5 py-2 rounded-lg font-semibold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-40" style={{ background: "linear-gradient(135deg, #837FFB, #5B57F5)", boxShadow: "0 4px 16px rgba(131,127,251,0.3)" }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

function SectionPanel({ title, subtitle, icon: Icon, children }: any) {
  return (
    <section className="rounded-2xl overflow-hidden mb-6" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
      <div className="px-7 py-5 flex items-center gap-4" style={{ background: "linear-gradient(135deg, rgba(131,127,251,0.05), rgba(131,127,251,0.01))", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(131,127,251,0.14)", border: "1px solid rgba(131,127,251,0.3)" }}>
          <Icon className="w-5 h-5 text-[#837FFB]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white text-xl font-bold tracking-tight">{title}</h2>
          <p className="text-white/50 text-sm mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="px-7 py-6 space-y-6">{children}</div>
    </section>
  );
}

function FieldGroup({ legend, children }: any) {
  return (
    <div className="rounded-xl p-5 space-y-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="block h-px w-6" style={{ background: "linear-gradient(90deg, #837FFB, transparent)" }} />
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/60">{legend}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, multiline, placeholder }: any) {
  const common = {
    value, placeholder,
    onChange: (e: any) => onChange(e.target.value),
    className: "w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] text-white text-sm outline-none focus:ring-2 focus:ring-[#837FFB]/40 focus:bg-white/[0.06] transition-colors",
    style: { border: "1px solid rgba(255,255,255,0.08)" }
  };
  return (
    <label className="block w-full">
      <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 mb-1.5">{label}</span>
      {multiline ? <textarea {...common} rows={3} /> : <input type="text" {...common} />}
    </label>
  );
}
