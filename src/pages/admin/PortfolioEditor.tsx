import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Save, Check, AlertCircle, Type, BarChart3, Briefcase, MessageSquare, Quote,
  ChevronRight, ExternalLink, Loader2, Plus, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Eye, Layers, ListChecks, Wrench
} from "lucide-react";
import { useContent, saveContent } from "@/lib/use-content";
import {
  PORTFOLIO_CONTENT_KEY,
  defaultPortfolioContent,
  type PortfolioContent,
  type PortfolioMetric,
  type PortfolioProject,
  type PortfolioOutcome,
  type PortfolioTestimonial,
  DEFAULT_HERO_KICKER_STYLE,
  DEFAULT_HERO_TITLE_STYLE,
  DEFAULT_HERO_HIGHLIGHT_STYLE,
  DEFAULT_HERO_DESC_STYLE,
  DEFAULT_PROJECT_TITLE_STYLE,
  DEFAULT_PROJECT_TAGLINE_STYLE,
  DEFAULT_PROJECT_HEADING_STYLE,
  DEFAULT_PROJECT_BODY_STYLE
} from "@/content/portfolio";
import TextStyleEditor from "@/components/admin/TextStyleEditor";
import ImageField from "@/components/admin/ImageField";
import WordHighlightPicker from "@/components/admin/WordHighlightPicker";

const TABS = [
  { id: "hero",         label: "Hero & Metrics", icon: Type,          hint: "Page title & top stats" },
  { id: "projects",     label: "Case Studies",   icon: Briefcase,     hint: "Interactive project cards" },
  { id: "outcomes",     label: "Outcomes",       icon: BarChart3,     hint: "Data-driven results cards" },
  { id: "testimonials", label: "Testimonials",   icon: Quote,         hint: "Client success stories" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function PortfolioEditor() {
  const { data, loading } = useContent<PortfolioContent>(PORTFOLIO_CONTENT_KEY, defaultPortfolioContent);
  const [draft, setDraft] = useState<PortfolioContent>(defaultPortfolioContent);
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
      await saveContent<PortfolioContent>(PORTFOLIO_CONTENT_KEY, draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updateMetric = (idx: number, patch: Partial<PortfolioMetric>) => {
    setDraft(d => ({
      ...d,
      metrics: d.metrics.map((m, i) => i === idx ? { ...m, ...patch } : m)
    }));
  };

  const addMetric = () => {
    setDraft(d => ({
      ...d,
      metrics: [...d.metrics, { value: "0+", label: "New Metric", iconKey: "star" }]
    }));
  };

  const removeMetric = (idx: number) => {
    setDraft(d => ({
      ...d,
      metrics: d.metrics.filter((_, i) => i !== idx)
    }));
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
            <span className="text-[#837FFB]">Portfolio Page</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Portfolio — Projects & Outcomes</h1>
          <p className="text-white/45 text-sm mt-2 max-w-xl">
            Showcase your best work and the results you've delivered. Pick a tab to start editing.
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
                to="/portfolio"
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
          <div className="space-y-6">
            <SectionPanel title="Hero Section" subtitle="The top of the portfolio page — set the tone with a powerful headline." icon={Type}>
              <FieldGroup legend="Kicker">
                <Field label="Kicker text" value={draft.heroKicker} onChange={v => setDraft(d => ({ ...d, heroKicker: v }))} />
                <TextStyleEditor 
                  label="Kicker style" 
                  value={draft.heroKickerStyle ?? DEFAULT_HERO_KICKER_STYLE} 
                  fallback={DEFAULT_HERO_KICKER_STYLE} 
                  onChange={v => setDraft(d => ({ ...d, heroKickerStyle: v }))}
                  previewText={draft.heroKicker}
                />
              </FieldGroup>
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
                    baseStyle={draft.heroTitleStyle ?? DEFAULT_HERO_TITLE_STYLE}
                    highlightStyle={draft.heroHighlightStyle ?? DEFAULT_HERO_HIGHLIGHT_STYLE}
                  />
                </div>
                <TextStyleEditor
                  label="Title Style"
                  value={draft.heroTitleStyle ?? DEFAULT_HERO_TITLE_STYLE}
                  fallback={DEFAULT_HERO_TITLE_STYLE}
                  onChange={v => setDraft(d => ({ ...d, heroTitleStyle: v }))}
                  previewText={(draft.heroTitle.split("\n")[0] || "Title").replace(/\*\*([^*\n]+?)(?:\|[^*\n]*)?\*\*/g, "$1")}
                />
                <TextStyleEditor
                  label="Highlight Style"
                  value={draft.heroHighlightStyle ?? DEFAULT_HERO_HIGHLIGHT_STYLE}
                  fallback={DEFAULT_HERO_HIGHLIGHT_STYLE}
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
              <FieldGroup legend="Description">
                <Field label="Description" multiline value={draft.heroDesc} onChange={v => setDraft(d => ({ ...d, heroDesc: v }))} />
                <TextStyleEditor 
                  label="Description style" 
                  value={draft.heroDescStyle ?? DEFAULT_HERO_DESC_STYLE} 
                  fallback={DEFAULT_HERO_DESC_STYLE} 
                  onChange={v => setDraft(d => ({ ...d, heroDescStyle: v }))}
                  previewText={draft.heroDesc}
                />
              </FieldGroup>
            </SectionPanel>

            <SectionPanel title="Metrics" subtitle="Key results shown under the hero — trust signals for your portfolio." icon={BarChart3}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draft.metrics.map((m, i) => (
                  <div key={i} className="rounded-xl p-4 bg-white/2 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Metric 0{i + 1}</span>
                      <button 
                        onClick={() => removeMetric(i)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Value" value={m.value} onChange={v => updateMetric(i, { value: v })} />
                      <Field label="Label" value={m.label} onChange={v => updateMetric(i, { label: v })} />
                    </div>
                    <Field label="Icon Key" value={m.iconKey} onChange={v => updateMetric(i, { iconKey: v })} placeholder="trophy, trending-up, etc." />
                  </div>
                ))}
              </div>
              <button 
                onClick={addMetric}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/50 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Metric
              </button>
            </SectionPanel>
          </div>
        )}

        {activeTab === "projects" && (
          <SectionPanel title="Case Studies" subtitle="Manage the list of projects displayed in the interactive portfolio grid." icon={Briefcase}>
            <div className="space-y-4">
              {draft.projects.map((p, i) => (
                <div key={p.id} className="rounded-xl p-5 bg-white/2 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-white/20 font-mono text-sm">0{i + 1}</span>
                      <span className="text-white font-bold">{p.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          if (i > 0) {
                            const next = [...draft.projects];
                            [next[i], next[i-1]] = [next[i-1], next[i]];
                            setDraft(d => ({ ...d, projects: next }));
                          }
                        }}
                        disabled={i === 0}
                        className="p-1.5 rounded-lg text-white/30 hover:text-white disabled:opacity-20 transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (i < draft.projects.length - 1) {
                            const next = [...draft.projects];
                            [next[i], next[i+1]] = [next[i+1], next[i]];
                            setDraft(d => ({ ...d, projects: next }));
                          }
                        }}
                        disabled={i === draft.projects.length - 1}
                        className="p-1.5 rounded-lg text-white/30 hover:text-white disabled:opacity-20 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDraft(d => ({ ...d, projects: d.projects.filter(proj => proj.id !== p.id) }))}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Title" value={p.title} onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, title: v } : proj) }))} />
                    <Field label="Category" value={p.category} onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, category: v } : proj) }))} />
                    <Field label="Slug (URL)" value={p.slug} onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, slug: v } : proj) }))} />
                    <ImageField 
                      label="Cover Image" 
                      value={p.image} 
                      onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, image: v } : proj) }))} 
                      folder="portfolio"
                    />
                  </div>
                  <Field label="Short Description" multiline value={p.description} onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, description: v } : proj) }))} />

                  <div className="pt-4 mt-4 border-t border-white/10 space-y-6">
                    <div className="flex items-center gap-2 text-[#837FFB] mb-2">
                      <Layers className="w-4 h-4" />
                      <h4 className="text-sm font-bold uppercase tracking-widest">Detail Page Content</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-4">
                        <Field label="Client Name" value={p.client} onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, client: v } : proj) }))} />
                        <TextStyleEditor label="Title Style" value={p.titleStyle ?? DEFAULT_PROJECT_TITLE_STYLE} fallback={DEFAULT_PROJECT_TITLE_STYLE} onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, titleStyle: v } : proj) }))} previewText={p.title} />
                      </div>
                      <div className="space-y-4">
                        <Field label="Industry Label" value={p.industry} onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, industry: v } : proj) }))} />
                        <TextStyleEditor label="Heading Style" value={p.headingStyle ?? DEFAULT_PROJECT_HEADING_STYLE} fallback={DEFAULT_PROJECT_HEADING_STYLE} onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, headingStyle: v } : proj) }))} previewText="EXECUTIVE OVERVIEW" />
                      </div>
                      <div className="space-y-4">
                        <Field label="Tagline" value={p.tagline} onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, tagline: v } : proj) }))} />
                        <TextStyleEditor label="Tagline Style" value={p.taglineStyle ?? DEFAULT_PROJECT_TAGLINE_STYLE} fallback={DEFAULT_PROJECT_TAGLINE_STYLE} onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, taglineStyle: v } : proj) }))} previewText={p.tagline} />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Field label="The Challenge" multiline value={p.challenge} onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, challenge: v } : proj) }))} />
                      </div>
                      <div className="space-y-4">
                        <Field label="Our Solution" multiline value={p.solution} onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, solution: v } : proj) }))} />
                      </div>
                      <div className="space-y-4">
                        <Field label="The Results" multiline value={p.results} onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, results: v } : proj) }))} />
                      </div>
                      <TextStyleEditor label="Body Content Style" value={p.bodyStyle ?? DEFAULT_PROJECT_BODY_STYLE} fallback={DEFAULT_PROJECT_BODY_STYLE} onChange={v => setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, bodyStyle: v } : proj) }))} previewText="This is how the main project description and body text will look." />
                    </div>

                    {/* Stats */}
                    <div>
                      <div className="flex items-center gap-2 text-white/40 mb-3">
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Project Stats</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {p.stats.map((s, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={s.value}
                              onChange={(e) => {
                                const newStats = [...p.stats];
                                newStats[sIdx] = { ...s, value: e.target.value };
                                setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, stats: newStats } : proj) }));
                              }}
                              placeholder="Value"
                              className="w-24 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white"
                            />
                            <input
                              type="text"
                              value={s.label}
                              onChange={(e) => {
                                const newStats = [...p.stats];
                                newStats[sIdx] = { ...s, label: e.target.value };
                                setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, stats: newStats } : proj) }));
                              }}
                              placeholder="Label"
                              className="flex-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white"
                            />
                            <button onClick={() => {
                              const newStats = p.stats.filter((_, idx) => idx !== sIdx);
                              setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, stats: newStats } : proj) }));
                            }} className="p-1 hover:text-red-400 text-white/20">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <button onClick={() => {
                          const newStats = [...p.stats, { value: "0", label: "New Stat" }];
                          setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, stats: newStats } : proj) }));
                        }} className="col-span-full py-2 border border-dashed border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                          + Add Stat
                        </button>
                      </div>
                    </div>

                    {/* Features / Deliverables */}
                    <div>
                      <div className="flex items-center gap-2 text-white/40 mb-3">
                        <ListChecks className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Key Deliverables</span>
                      </div>
                      <div className="space-y-2">
                        {p.features.map((f, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={f}
                              onChange={(e) => {
                                const newFeats = [...p.features];
                                newFeats[fIdx] = e.target.value;
                                setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, features: newFeats } : proj) }));
                              }}
                              className="flex-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white"
                            />
                            <button onClick={() => {
                              const newFeats = p.features.filter((_, idx) => idx !== fIdx);
                              setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, features: newFeats } : proj) }));
                            }} className="p-1 hover:text-red-400 text-white/20">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <button onClick={() => {
                          const newFeats = [...p.features, "New Feature"];
                          setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, features: newFeats } : proj) }));
                        }} className="w-full py-2 border border-dashed border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                          + Add Deliverable
                        </button>
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <div className="flex items-center gap-2 text-white/40 mb-3">
                        <Wrench className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Tech Stack</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {p.tech.map((t, tIdx) => (
                          <div key={tIdx} className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#837FFB]/10 border border-[#837FFB]/20">
                            <input
                              type="text"
                              value={t}
                              onChange={(e) => {
                                const newTech = [...p.tech];
                                newTech[tIdx] = e.target.value;
                                setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, tech: newTech } : proj) }));
                              }}
                              className="bg-transparent text-[10px] font-bold text-[#837FFB] outline-none min-w-[50px]"
                            />
                            <button onClick={() => {
                              const newTech = p.tech.filter((_, idx) => idx !== tIdx);
                              setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, tech: newTech } : proj) }));
                            }} className="hover:text-white text-[#837FFB]/50 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button onClick={() => {
                          const newTech = [...p.tech, "New Tech"];
                          setDraft(d => ({ ...d, projects: d.projects.map(proj => proj.id === p.id ? { ...proj, tech: newTech } : proj) }));
                        }} className="px-3 py-1 border border-dashed border-white/10 rounded text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                          + Add Tech
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setDraft(d => ({ 
                  ...d, 
                  projects: [...d.projects, { 
                    id: Date.now().toString(), 
                    slug: "new-project", 
                    title: "New Project", 
                    category: "App", 
                    description: "Project description...", 
                    image: "",
                    client: "Client Name",
                    industry: "Tech",
                    tagline: "Short tagline...",
                    challenge: "",
                    solution: "",
                    results: "",
                    features: [],
                    tech: [],
                    stats: []
                  }] 
                }))}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/50 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>
          </SectionPanel>
        )}

        {activeTab === "outcomes" && (
          <SectionPanel title="Outcomes" subtitle="Cards showing real-world results — metrics paired with success stories." icon={BarChart3}>
             <div className="space-y-4">
              {draft.outcomes.map((o, i) => (
                <div key={i} className="rounded-xl p-5 bg-white/2 border border-white/5 space-y-4">
                   <div className="flex items-center justify-between">
                    <span className="text-white/20 font-mono text-sm">Outcome 0{i + 1}</span>
                    <button 
                        onClick={() => setDraft(d => ({ ...d, outcomes: d.outcomes.filter((_, idx) => idx !== i) }))}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Big Metric (e.g. 3.2x)" value={o.metric} onChange={v => setDraft(d => ({ ...d, outcomes: d.outcomes.map((item, idx) => idx === i ? { ...item, metric: v } : item) }))} />
                    <Field label="Tag (e.g. E-commerce)" value={o.tag} onChange={v => setDraft(d => ({ ...d, outcomes: d.outcomes.map((item, idx) => idx === i ? { ...item, tag: v } : item) }))} />
                    <Field label="Title" value={o.title} onChange={v => setDraft(d => ({ ...d, outcomes: d.outcomes.map((item, idx) => idx === i ? { ...item, title: v } : item) }))} />
                    <Field label="Accent Color" value={o.color} onChange={v => setDraft(d => ({ ...d, outcomes: d.outcomes.map((item, idx) => idx === i ? { ...item, color: v } : item) }))} placeholder="#837FFB" />
                  </div>
                  <Field label="Short Summary" multiline value={o.desc} onChange={v => setDraft(d => ({ ...d, outcomes: d.outcomes.map((item, idx) => idx === i ? { ...item, desc: v } : item) }))} />
                </div>
              ))}
              <button 
                onClick={() => setDraft(d => ({ ...d, outcomes: [...d.outcomes, { metric: "0%", title: "New Outcome", desc: "Description here...", tag: "General", color: "#837FFB" }] }))}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/50 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Outcome
              </button>
            </div>
          </SectionPanel>
        )}

        {activeTab === "testimonials" && (
          <SectionPanel title="Testimonials" subtitle="Manage client feedback and ratings shown at the bottom of the page." icon={Quote}>
            <div className="space-y-4">
              {draft.testimonials.map((t, i) => (
                <div key={i} className="rounded-xl p-5 bg-white/2 border border-white/5 space-y-4">
                   <div className="flex items-center justify-between">
                    <span className="text-white/20 font-mono text-sm">Testimonial 0{i + 1}</span>
                    <button 
                        onClick={() => setDraft(d => ({ ...d, testimonials: d.testimonials.filter((_, idx) => idx !== i) }))}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Author" value={t.author} onChange={v => setDraft(d => ({ ...d, testimonials: d.testimonials.map((item, idx) => idx === i ? { ...item, author: v } : item) }))} />
                    <Field label="Role/Company" value={t.role} onChange={v => setDraft(d => ({ ...d, testimonials: d.testimonials.map((item, idx) => idx === i ? { ...item, role: v } : item) }))} />
                    <Field label="Rating (1-5)" value={t.rating.toString()} onChange={v => setDraft(d => ({ ...d, testimonials: d.testimonials.map((item, idx) => idx === i ? { ...item, rating: parseInt(v) || 5 } : item) }))} />
                  </div>
                  <Field label="Quote" multiline value={t.quote} onChange={v => setDraft(d => ({ ...d, testimonials: d.testimonials.map((item, idx) => idx === i ? { ...item, quote: v } : item) }))} />
                </div>
              ))}
              <button 
                onClick={() => setDraft(d => ({ ...d, testimonials: [...d.testimonials, { author: "New Client", role: "CEO, Company", quote: "Working with Dgion was...", rating: 5 }] }))}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/50 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Testimonial
              </button>
            </div>
          </SectionPanel>
        )}

          </div>
        </div>

        {/* Footer save/preview bar */}
        <div className="mt-10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4" style={{ background: "linear-gradient(135deg, rgba(131,127,251,0.1), rgba(91,87,245,0.04))", border: "1px solid rgba(131,127,251,0.25)" }}>
          <div className="flex-1 text-center md:text-left">
            <p className="text-white font-bold">Ready to go live?</p>
            <p className="text-white/55 text-sm mt-0.5">Your changes are saved as a draft until you publish them.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/portfolio" target="_blank" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white/80 transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
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
