import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Save, Check, AlertCircle, Type, Plus, Trash2,
  ChevronRight, ExternalLink, Loader2, Calendar, Workflow, Sparkles, Target, Heart, Rocket
} from "lucide-react";
import { toast } from "sonner";
import { useContent, saveContent } from "@/lib/use-content";
import {
  ABOUT_CONTENT_KEY,
  defaultAboutContent,
  type AboutContent,
  DEFAULT_ABOUT_KICKER_STYLE,
  DEFAULT_ABOUT_TITLE_STYLE,
  DEFAULT_ABOUT_HIGHLIGHT_STYLE,
  DEFAULT_ABOUT_DESC_STYLE
} from "@/content/about";
import TextStyleEditor from "@/components/admin/TextStyleEditor";
import WordHighlightPicker from "@/components/admin/WordHighlightPicker";
import ImageField from "@/components/admin/ImageField";

const TABS = [
  { id: "hero",     label: "Hero Section", icon: Type,     hint: "Page title & description" },
  { id: "values",   label: "Core Values",  icon: Sparkles, hint: "Craft, Clarity, Care, Speed" },
  { id: "spiral",   label: "Spiral Journey", icon: Workflow, hint: "Wavy path with images" },
  { id: "timeline", label: "Vertical Timeline", icon: Calendar, hint: "Glider milestone track" },
  { id: "why",      label: "Why Choose",   icon: Workflow, hint: "3 Pillars of excellence" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AboutEditor() {
  const { data, loading } = useContent<AboutContent>(ABOUT_CONTENT_KEY, defaultAboutContent);
  const [draft, setDraft] = useState<AboutContent>(defaultAboutContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("hero");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(data);

  useEffect(() => {
    if (!loading) setDraft(data);
  }, [loading, data]);

  const onSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const cleanDraft = {
        ...draft,
        spiralTimeline: (draft.spiralTimeline || []).map(item => ({
          ...item,
          images: (item.images || []).filter(img => img && img.trim() !== "")
        }))
      };
      await saveContent<AboutContent>(ABOUT_CONTENT_KEY, cleanDraft);
      setSaved(true);
      toast.success("About page published successfully!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const activeIndex = TABS.findIndex(t => t.id === activeTab);

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)" }}>
      <header className="sticky top-0 z-20" style={{ background: "rgba(8,6,26,0.85)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> <span>Dashboard</span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            {saved ? <span className="text-xs text-green-400 font-semibold flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Published</span> : dirty ? <span className="text-xs text-amber-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Unpublished Changes</span> : null}
            
            <button 
              onClick={() => {
                if (window.confirm("Are you sure? This will replace all current text and images with the new project-focused defaults.")) {
                  setDraft(defaultAboutContent);
                }
              }}
              className="px-4 py-2 rounded-lg font-bold text-white/60 text-xs transition-all hover:text-white border border-white/10 hover:bg-white/5"
            >
              Restore Defaults
            </button>

            <button 
              onClick={onSave} 
              disabled={saving || !dirty} 
              className="px-6 py-2 rounded-lg font-bold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #837FFB, #5B57F5)", boxShadow: "0 4px 16px rgba(131,127,251,0.3)" }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-white/40">
            <Link to="/admin" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#837FFB]">About Page</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Edit Story</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl p-5 bg-white/2 border border-white/5">
              <div className="space-y-2">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full rounded-xl p-3 text-left transition-all flex items-center gap-3 ${isActive ? "bg-[#837FFB]/10 border border-[#837FFB]/30" : "hover:bg-white/5 border border-transparent"}`}>
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#837FFB]" : "text-white/40"}`} />
                      <div>
                        <h3 className={`text-sm font-bold ${isActive ? "text-white" : "text-white/60"}`}>{t.label}</h3>
                        <p className="text-white/30 text-[10px] mt-0.5">{t.hint}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            {activeTab === "hero" && (
              <SectionPanel title="Hero Section" subtitle="The top of the About page." icon={Type}>
                <FieldGroup legend="Kicker">
                  <Field label="Kicker text" value={draft.heroKicker} onChange={v => setDraft(d => ({ ...d, heroKicker: v }))} />
                  <TextStyleEditor 
                    label="Kicker Style" 
                    value={draft.heroKickerStyle ?? DEFAULT_ABOUT_KICKER_STYLE} 
                    fallback={DEFAULT_ABOUT_KICKER_STYLE}
                    onChange={v => setDraft(d => ({ ...d, heroKickerStyle: v }))}
                    previewText={draft.heroKicker}
                  />
                </FieldGroup>
                
                <FieldGroup legend="Title">
                  <Field label="Main title (use **word** for highlights)" multiline value={draft.heroTitle} onChange={v => setDraft(d => ({ ...d, heroTitle: v }))} />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <TextStyleEditor 
                      label="Title Style" 
                      value={draft.heroTitleStyle ?? DEFAULT_ABOUT_TITLE_STYLE} 
                      fallback={DEFAULT_ABOUT_TITLE_STYLE}
                      onChange={v => setDraft(d => ({ ...d, heroTitleStyle: v }))}
                      previewText="Main Title Text"
                    />
                    <TextStyleEditor 
                      label="Highlight Style" 
                      value={draft.heroHighlightStyle ?? DEFAULT_ABOUT_HIGHLIGHT_STYLE} 
                      fallback={DEFAULT_ABOUT_HIGHLIGHT_STYLE}
                      onChange={v => setDraft(d => ({ ...d, heroHighlightStyle: v }))}
                      previewText="Highlighted Word"
                    />
                  </div>
                </FieldGroup>

                <FieldGroup legend="Description">
                  <Field label="Hero description" multiline value={draft.heroDesc} onChange={v => setDraft(d => ({ ...d, heroDesc: v }))} />
                  <TextStyleEditor 
                    label="Description Style" 
                    value={draft.heroDescStyle ?? DEFAULT_ABOUT_DESC_STYLE} 
                    fallback={DEFAULT_ABOUT_DESC_STYLE}
                    onChange={v => setDraft(d => ({ ...d, heroDescStyle: v }))}
                    previewText={draft.heroDesc}
                  />
                </FieldGroup>
              </SectionPanel>
            )}

            {activeTab === "values" && (
              <SectionPanel title="Core Values" subtitle="Edit the studio's DNA section." icon={Sparkles}>
                <FieldGroup legend="Header">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Section Title" value={draft.valuesTitle || ""} onChange={v => setDraft(d => ({ ...d, valuesTitle: v }))} />
                    <Field label="Highlight Word" value={draft.valuesHighlight || ""} onChange={v => setDraft(d => ({ ...d, valuesHighlight: v }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <TextStyleEditor 
                      label="Title Style" 
                      value={draft.valuesTitleStyle ?? DEFAULT_ABOUT_TITLE_STYLE} 
                      fallback={DEFAULT_ABOUT_TITLE_STYLE}
                      onChange={v => setDraft(d => ({ ...d, valuesTitleStyle: v }))}
                      previewText={draft.valuesTitle || "Section Title"}
                    />
                    <TextStyleEditor 
                      label="Highlight Style" 
                      value={draft.valuesHighlightStyle ?? DEFAULT_ABOUT_HIGHLIGHT_STYLE} 
                      fallback={DEFAULT_ABOUT_HIGHLIGHT_STYLE}
                      onChange={v => setDraft(d => ({ ...d, valuesHighlightStyle: v }))}
                      previewText={draft.valuesHighlight || "Highlight"}
                    />
                  </div>
                </FieldGroup>
                <div className="space-y-4">
                  {draft.values.map((v, i) => {
                    const id = `value-${i}`;
                    const isOpen = expandedId === id;
                    const icons: Record<string, any> = { Sparkles, Target, Heart, Rocket };
                    const Icon = icons[v.icon] || Sparkles;
                    return (
                      <div key={i} className="rounded-xl overflow-hidden transition-all" style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${isOpen ? "rgba(131,127,251,0.25)" : "rgba(255,255,255,0.08)"}` }}>
                        <div className="flex items-center gap-3 px-4 py-3.5 bg-white/[0.02]">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#837FFB]/10 border border-[#837FFB]/20">
                            <Icon className="w-5 h-5 text-[#837FFB]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-bold truncate">{v.title || "Untitled Value"}</p>
                            <p className="text-white/40 text-[10px] truncate uppercase tracking-widest font-mono">Value 0{i + 1}</p>
                          </div>
                          <button onClick={() => setExpandedId(isOpen ? null : id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-[#837FFB] transition-all">
                            {isOpen ? "Close" : "Edit"}
                          </button>
                          <button onClick={() => setDraft(d => ({ ...d, values: d.values.filter((_, idx) => idx !== i) }))} className="p-1.5 text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        {isOpen && (
                          <div className="p-5 space-y-4 bg-black/20 border-t border-white/5">
                            <div className="grid grid-cols-2 gap-4">
                              <Field label="Title" value={v.title} onChange={val => setDraft(d => {
                                const list = [...d.values];
                                list[i] = { ...list[i], title: val };
                                return { ...d, values: list };
                              })} />
                              <label className="block w-full">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5 ml-1">Icon</span>
                                <select className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:ring-2 focus:ring-[#837FFB]/40" value={v.icon} onChange={e => setDraft(d => {
                                  const list = [...d.values];
                                  list[i] = { ...list[i], icon: e.target.value };
                                  return { ...d, values: list };
                                })}>
                                  <option value="Sparkles">Sparkles</option>
                                  <option value="Target">Target</option>
                                  <option value="Heart">Heart</option>
                                  <option value="Rocket">Rocket</option>
                                </select>
                              </label>
                            </div>
                            <Field label="Description" multiline value={v.desc} onChange={val => setDraft(d => {
                              const list = [...d.values];
                              list[i] = { ...list[i], desc: val };
                              return { ...d, values: list };
                            })} />
                            <div className="grid grid-cols-2 gap-6">
                              <Field 
                                label="Target URL" 
                                value={v.url || ""} 
                                placeholder="/services" 
                                onChange={val => setDraft(d => {
                                  const list = [...d.values];
                                  list[i] = { ...list[i], url: val };
                                  return { ...d, values: list };
                                })} 
                              />
                              <ImageField 
                                label="Card Image"
                                value={v.image || ""}
                                folder="about/values"
                                onChange={val => setDraft(d => {
                                  const list = [...d.values];
                                  list[i] = { ...list[i], image: val };
                                  return { ...d, values: list };
                                })}
                              />
                            </div>
                            <div className="pt-6 border-t border-white/5 space-y-6">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-[#837FFB]">Item Typography</p>
                              <div className="grid grid-cols-2 gap-4">
                                <TextStyleEditor 
                                  label="Title Style" 
                                  value={v.titleStyle ?? draft.valuesItemTitleStyle ?? { fontSize: 24, bold: true, fontFamily: "inter" }} 
                                  fallback={draft.valuesItemTitleStyle ?? { fontSize: 24, bold: true, fontFamily: "inter" }}
                                  onChange={ts => setDraft(d => {
                                    const list = [...d.values];
                                    list[i] = { ...list[i], titleStyle: ts };
                                    return { ...d, values: list };
                                  })}
                                  previewText={v.title}
                                />
                                <TextStyleEditor 
                                  label="Description Style" 
                                  value={v.descStyle ?? draft.valuesItemDescStyle ?? { fontSize: 14, fontFamily: "inter" }} 
                                  fallback={draft.valuesItemDescStyle ?? { fontSize: 14, fontFamily: "inter" }}
                                  onChange={ts => setDraft(d => {
                                    const list = [...d.values];
                                    list[i] = { ...list[i], descStyle: ts };
                                    return { ...d, values: list };
                                  })}
                                  previewText={v.desc}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <button onClick={() => setDraft(d => ({ ...d, values: [...d.values, { icon: "Sparkles", title: "New Value", desc: "..." }] }))} className="w-full py-4 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white transition-all flex items-center justify-center gap-2 hover:bg-white/5"><Plus className="w-4 h-4" /> Add Value</button>
                  <FieldGroup legend="Item Typography">
                    <div className="grid grid-cols-2 gap-4">
                      <TextStyleEditor 
                        label="Value Title Style" 
                        value={draft.valuesItemTitleStyle ?? { fontSize: 24, bold: true, fontFamily: "inter" }} 
                        fallback={{ fontSize: 24, bold: true, fontFamily: "inter" }}
                        onChange={v => setDraft(d => ({ ...d, valuesItemTitleStyle: v }))}
                        previewText="Value Title"
                      />
                      <TextStyleEditor 
                        label="Value Desc Style" 
                        value={draft.valuesItemDescStyle ?? { fontSize: 14, fontFamily: "inter" }} 
                        fallback={{ fontSize: 14, fontFamily: "inter" }}
                        onChange={v => setDraft(d => ({ ...d, valuesItemDescStyle: v }))}
                        previewText="Value description text goes here."
                      />
                    </div>
                  </FieldGroup>
                </div>
              </SectionPanel>
            )}

            {activeTab === "spiral" && (
              <SectionPanel title="Spiral Journey" subtitle="Wavy path with images." icon={Workflow}>
                <div className="space-y-4">
                  {draft.spiralTimeline.map((m, i) => {
                    const id = `spiral-${i}`;
                    const isOpen = expandedId === id;
                    return (
                      <div key={i} className="rounded-xl overflow-hidden transition-all" style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${isOpen ? "rgba(131,127,251,0.25)" : "rgba(255,255,255,0.08)"}` }}>
                        <div className="flex items-center gap-3 px-4 py-3.5 bg-white/[0.02]">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-[#837FFB] font-bold text-xs">
                            {m.year}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-bold truncate">{m.title || "Untitled Milestone"}</p>
                            <p className="text-white/40 text-[10px] truncate uppercase tracking-widest font-mono">Milestone 0{i + 1}</p>
                          </div>
                          <button onClick={() => setExpandedId(isOpen ? null : id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-[#837FFB] transition-all">
                            {isOpen ? "Close" : "Edit"}
                          </button>
                          <button onClick={() => setDraft(d => ({ ...d, spiralTimeline: d.spiralTimeline.filter((_, idx) => idx !== i) }))} className="p-1.5 text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        {isOpen && (
                          <div className="p-5 space-y-4 bg-black/20 border-t border-white/5">
                            <div className="grid grid-cols-2 gap-4">
                              <Field 
                                label="Quarter / Time Period" 
                                value={m.year} 
                                placeholder="e.g. Q1 2024"
                                onChange={v => setDraft(d => {
                                  const list = [...d.spiralTimeline];
                                  list[i] = { ...list[i], year: v };
                                  return { ...d, spiralTimeline: list };
                                })} 
                              />
                              <Field label="Title" value={m.title} onChange={v => setDraft(d => {
                                const list = [...d.spiralTimeline];
                                list[i] = { ...list[i], title: v };
                                return { ...d, spiralTimeline: list };
                              })} />
                            </div>
                            <Field label="Description" multiline value={m.desc} onChange={v => setDraft(d => {
                              const list = [...d.spiralTimeline];
                              list[i] = { ...list[i], desc: v };
                              return { ...d, spiralTimeline: list };
                            })} />
                            <div className="space-y-3">
                              <div className="flex items-center justify-between px-1">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40">Images Gallery</span>
                                <button onClick={() => setDraft(d => {
                                  const list = [...d.spiralTimeline];
                                  list[i] = { ...list[i], images: [...(list[i].images || []), ""] };
                                  return { ...d, spiralTimeline: list };
                                })} className="text-[10px] font-bold text-[#837FFB] hover:text-white transition-colors">+ Add Image URL</button>
                              </div>
                              <div className="space-y-2">
                                {(m.images || []).map((img, imgIdx) => (
                                  <div key={imgIdx} className="relative group">
                                    <ImageField 
                                      label={`Image 0${imgIdx + 1}`}
                                      value={img}
                                      folder={`about/spiral/${m.year}`}
                                      onChange={val => setDraft(d => {
                                        const list = [...d.spiralTimeline];
                                        const imgs = [...(list[i].images || [])];
                                        imgs[imgIdx] = val;
                                        list[i] = { ...list[i], images: imgs };
                                        return { ...d, spiralTimeline: list };
                                      })}
                                    />
                                    <button 
                                      onClick={() => setDraft(d => {
                                        const list = [...d.spiralTimeline];
                                        list[i] = { ...list[i], images: (list[i].images || []).filter((_, idx) => idx !== imgIdx) };
                                        return { ...d, spiralTimeline: list };
                                      })} 
                                      className="absolute top-0 right-0 p-2 text-white/20 hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="pt-6 border-t border-white/5 space-y-6">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-[#837FFB]">Item Typography</p>
                              <div className="grid grid-cols-2 gap-4">
                                <TextStyleEditor 
                                  label="Title Style" 
                                  value={m.titleStyle ?? draft.spiralItemTitleStyle ?? { fontSize: 32, bold: true, fontFamily: "inter" }} 
                                  fallback={draft.spiralItemTitleStyle ?? { fontSize: 32, bold: true, fontFamily: "inter" }}
                                  onChange={ts => setDraft(d => {
                                    const list = [...d.spiralTimeline];
                                    list[i] = { ...list[i], titleStyle: ts };
                                    return { ...d, spiralTimeline: list };
                                  })}
                                  previewText={m.title}
                                />
                                <TextStyleEditor 
                                  label="Description Style" 
                                  value={m.descStyle ?? draft.spiralItemDescStyle ?? { fontSize: 16, fontFamily: "inter" }} 
                                  fallback={draft.spiralItemDescStyle ?? { fontSize: 16, fontFamily: "inter" }}
                                  onChange={ts => setDraft(d => {
                                    const list = [...d.spiralTimeline];
                                    list[i] = { ...list[i], descStyle: ts };
                                    return { ...d, spiralTimeline: list };
                                  })}
                                  previewText={m.desc}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <button onClick={() => setDraft(d => ({ ...d, spiralTimeline: [...d.spiralTimeline, { year: "2024", title: "New", desc: "...", images: [] }] }))} className="w-full py-4 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white transition-all flex items-center justify-center gap-2 hover:bg-white/5"><Plus className="w-4 h-4" /> Add Milestone</button>
                  <FieldGroup legend="Item Typography">
                    <div className="grid grid-cols-2 gap-4">
                      <TextStyleEditor 
                        label="Milestone Title Style" 
                        value={draft.spiralItemTitleStyle ?? { fontSize: 32, bold: true, fontFamily: "inter" }} 
                        fallback={{ fontSize: 32, bold: true, fontFamily: "inter" }}
                        onChange={v => setDraft(d => ({ ...d, spiralItemTitleStyle: v }))}
                        previewText="Milestone Title"
                      />
                      <TextStyleEditor 
                        label="Milestone Desc Style" 
                        value={draft.spiralItemDescStyle ?? { fontSize: 16, fontFamily: "inter" }} 
                        fallback={{ fontSize: 16, fontFamily: "inter" }}
                        onChange={v => setDraft(d => ({ ...d, spiralItemDescStyle: v }))}
                        previewText="Milestone description text."
                      />
                    </div>
                  </FieldGroup>
                </div>
              </SectionPanel>
            )}

            {activeTab === "timeline" && (
              <SectionPanel title="Vertical Timeline" subtitle="Glider track." icon={Calendar}>
                <FieldGroup legend="Header">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Kicker" value={draft.sectionKicker || ""} onChange={v => setDraft(d => ({ ...d, sectionKicker: v }))} />
                    <Field label="Highlight Word" value={draft.sectionHighlight || ""} onChange={v => setDraft(d => ({ ...d, sectionHighlight: v }))} />
                  </div>
                  <Field label="Title" value={draft.sectionTitle || ""} onChange={v => setDraft(d => ({ ...d, sectionTitle: v }))} multiline />
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <TextStyleEditor 
                      label="Kicker Style" 
                      value={draft.sectionKickerStyle ?? DEFAULT_ABOUT_KICKER_STYLE} 
                      fallback={DEFAULT_ABOUT_KICKER_STYLE}
                      onChange={v => setDraft(d => ({ ...d, sectionKickerStyle: v }))}
                      previewText={draft.sectionKicker || "Kicker"}
                    />
                    <TextStyleEditor 
                      label="Title Style" 
                      value={draft.sectionTitleStyle ?? DEFAULT_ABOUT_TITLE_STYLE} 
                      fallback={DEFAULT_ABOUT_TITLE_STYLE}
                      onChange={v => setDraft(d => ({ ...d, sectionTitleStyle: v }))}
                      previewText={draft.sectionTitle || "Section Title"}
                    />
                    <TextStyleEditor 
                      label="Highlight Style" 
                      value={draft.sectionHighlightStyle ?? DEFAULT_ABOUT_HIGHLIGHT_STYLE} 
                      fallback={DEFAULT_ABOUT_HIGHLIGHT_STYLE}
                      onChange={v => setDraft(d => ({ ...d, sectionHighlightStyle: v }))}
                      previewText={draft.sectionHighlight || "Highlight"}
                    />
                  </div>
                </FieldGroup>
                <div className="space-y-4">
                  {draft.journeyTimeline.map((m, i) => {
                    const id = `journey-${i}`;
                    const isOpen = expandedId === id;
                    return (
                      <div key={i} className="rounded-xl overflow-hidden transition-all" style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${isOpen ? "rgba(131,127,251,0.25)" : "rgba(255,255,255,0.08)"}` }}>
                        <div className="flex items-center gap-3 px-4 py-3.5 bg-white/[0.02]">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-[#837FFB] font-bold text-xs">
                            {m.year}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-bold truncate">{m.title || "Untitled Milestone"}</p>
                            <p className="text-white/40 text-[10px] truncate uppercase tracking-widest font-mono">Milestone 0{i + 1}</p>
                          </div>
                          <button onClick={() => setExpandedId(isOpen ? null : id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-[#837FFB] transition-all">
                            {isOpen ? "Close" : "Edit"}
                          </button>
                          <button onClick={() => setDraft(d => ({ ...d, journeyTimeline: d.journeyTimeline.filter((_, idx) => idx !== i) }))} className="p-1.5 text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        {isOpen && (
                          <div className="p-5 space-y-4 bg-black/20 border-t border-white/5">
                            <div className="grid grid-cols-2 gap-4">
                              <Field label="Quarter" value={m.year} onChange={v => setDraft(d => {
                                const list = [...d.journeyTimeline];
                                list[i] = { ...list[i], year: v };
                                return { ...d, journeyTimeline: list };
                              })} />
                              <Field label="Title" value={m.title} onChange={v => setDraft(d => {
                                const list = [...d.journeyTimeline];
                                list[i] = { ...list[i], title: v };
                                return { ...d, journeyTimeline: list };
                              })} />
                            </div>
                            <Field label="Description" multiline value={m.desc} onChange={v => setDraft(d => {
                              const list = [...d.journeyTimeline];
                              list[i] = { ...list[i], desc: v };
                              return { ...d, journeyTimeline: list };
                            })} />
                            <div className="space-y-3">
                              <div className="flex items-center justify-between px-1">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40">Images Gallery</span>
                                <button onClick={() => setDraft(d => {
                                  const list = [...d.journeyTimeline];
                                  list[i] = { ...list[i], images: [...(list[i].images || []), ""] };
                                  return { ...d, journeyTimeline: list };
                                })} className="text-[10px] font-bold text-[#837FFB] hover:text-white transition-colors">+ Add Image URL</button>
                              </div>
                              <div className="space-y-2">
                                {(m.images || []).map((img, imgIdx) => (
                                  <div key={imgIdx} className="relative group">
                                    <ImageField 
                                      label={`Image 0${imgIdx + 1}`}
                                      value={img}
                                      folder={`about/journey/${m.year}`}
                                      onChange={val => setDraft(d => {
                                        const list = [...d.journeyTimeline];
                                        const imgs = [...(list[i].images || [])];
                                        imgs[imgIdx] = val;
                                        list[i] = { ...list[i], images: imgs };
                                        return { ...d, journeyTimeline: list };
                                      })}
                                    />
                                    <button 
                                      onClick={() => setDraft(d => {
                                        const list = [...d.journeyTimeline];
                                        list[i] = { ...list[i], images: (list[i].images || []).filter((_, idx) => idx !== imgIdx) };
                                        return { ...d, journeyTimeline: list };
                                      })} 
                                      className="absolute top-0 right-0 p-2 text-white/20 hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="pt-6 border-t border-white/5 space-y-6">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-[#837FFB]">Item Typography</p>
                              <div className="grid grid-cols-2 gap-4">
                                <TextStyleEditor 
                                  label="Title Style" 
                                  value={m.titleStyle ?? draft.journeyItemTitleStyle ?? { fontSize: 30, bold: true, fontFamily: "inter" }} 
                                  fallback={draft.journeyItemTitleStyle ?? { fontSize: 30, bold: true, fontFamily: "inter" }}
                                  onChange={ts => setDraft(d => {
                                    const list = [...d.journeyTimeline];
                                    list[i] = { ...list[i], titleStyle: ts };
                                    return { ...d, journeyTimeline: list };
                                  })}
                                  previewText={m.title}
                                />
                                <TextStyleEditor 
                                  label="Description Style" 
                                  value={m.descStyle ?? draft.journeyItemDescStyle ?? { fontSize: 18, fontFamily: "inter" }} 
                                  fallback={draft.journeyItemDescStyle ?? { fontSize: 18, fontFamily: "inter" }}
                                  onChange={ts => setDraft(d => {
                                    const list = [...d.journeyTimeline];
                                    list[i] = { ...list[i], descStyle: ts };
                                    return { ...d, journeyTimeline: list };
                                  })}
                                  previewText={m.desc}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <button onClick={() => setDraft(d => ({ ...d, journeyTimeline: [...d.journeyTimeline, { year: "2024", title: "New", desc: "..." }] }))} className="w-full py-4 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white transition-all flex items-center justify-center gap-2 hover:bg-white/5"><Plus className="w-4 h-4" /> Add Item</button>
                  <FieldGroup legend="Item Typography">
                    <div className="grid grid-cols-2 gap-4">
                      <TextStyleEditor 
                        label="Journey Item Title Style" 
                        value={draft.journeyItemTitleStyle ?? { fontSize: 30, bold: true, fontFamily: "inter" }} 
                        fallback={{ fontSize: 30, bold: true, fontFamily: "inter" }}
                        onChange={v => setDraft(d => ({ ...d, journeyItemTitleStyle: v }))}
                        previewText="Journey Title"
                      />
                      <TextStyleEditor 
                        label="Journey Item Desc Style" 
                        value={draft.journeyItemDescStyle ?? { fontSize: 18, fontFamily: "inter" }} 
                        fallback={{ fontSize: 18, fontFamily: "inter" }}
                        onChange={v => setDraft(d => ({ ...d, journeyItemDescStyle: v }))}
                        previewText="Journey description text."
                      />
                    </div>
                  </FieldGroup>
                </div>
              </SectionPanel>
            )}

            {activeTab === "why" && (
              <SectionPanel title="Why Choose" subtitle="3 Pillars." icon={Workflow}>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Field label="Title" value={draft.whyTitle} onChange={v => setDraft(d => ({ ...d, whyTitle: v }))} />
                  <Field label="Highlight" value={draft.whyHighlight} onChange={v => setDraft(d => ({ ...d, whyHighlight: v }))} />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <TextStyleEditor 
                    label="Title Style" 
                    value={draft.whyTitleStyle ?? DEFAULT_ABOUT_TITLE_STYLE} 
                    fallback={DEFAULT_ABOUT_TITLE_STYLE}
                    onChange={v => setDraft(d => ({ ...d, whyTitleStyle: v }))}
                    previewText={draft.whyTitle}
                  />
                  <TextStyleEditor 
                    label="Highlight Style" 
                    value={draft.whyHighlightStyle ?? DEFAULT_ABOUT_HIGHLIGHT_STYLE} 
                    fallback={DEFAULT_ABOUT_HIGHLIGHT_STYLE}
                    onChange={v => setDraft(d => ({ ...d, whyHighlightStyle: v }))}
                    previewText={draft.whyHighlight}
                  />
                </div>
                <div className="space-y-4">
                  {draft.whyPillars.map((p, i) => (
                    <div key={i} className="rounded-xl p-5 bg-white/2 border border-white/5 space-y-4">
                      <Field label="Title" value={p.title} onChange={v => setDraft(d => {
                        const list = [...d.whyPillars];
                        list[i] = { ...list[i], title: v };
                        return { ...d, whyPillars: list };
                      })} />
                      <Field label="Description" multiline value={p.description} onChange={v => setDraft(d => {
                        const list = [...d.whyPillars];
                        list[i] = { ...list[i], description: v };
                        return { ...d, whyPillars: list };
                      })} />
                      <TextStyleEditor 
                        label="Description Style" 
                        value={p.descriptionStyle ?? draft.whyPillarDescStyle ?? { fontSize: 14, fontFamily: "inter" }} 
                        fallback={draft.whyPillarDescStyle ?? { fontSize: 14, fontFamily: "inter" }}
                        onChange={ts => setDraft(d => {
                          const list = [...d.whyPillars];
                          list[i] = { ...list[i], descriptionStyle: ts };
                          return { ...d, whyPillars: list };
                        })}
                        previewText={p.description}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <ImageField 
                          label="Pillar Image"
                          value={p.img || ""}
                          folder="about/why"
                          onChange={val => setDraft(d => {
                            const list = [...d.whyPillars];
                            list[i] = { ...list[i], img: val };
                            return { ...d, whyPillars: list };
                          })}
                        />
                        <ImageField 
                          label="Pillar Video"
                          value={p.video || ""}
                          accept="video"
                          folder="about/why/videos"
                          onChange={val => setDraft(d => {
                            const list = [...d.whyPillars];
                            list[i] = { ...list[i], video: val };
                            return { ...d, whyPillars: list };
                          })}
                        />
                      </div>
                    </div>
                  ))}
                  <FieldGroup legend="Pillar Typography">
                    <div className="grid grid-cols-2 gap-4">
                      <TextStyleEditor 
                        label="Pillar Title Style" 
                        value={draft.whyPillarTitleStyle ?? { fontSize: 24, bold: true, fontFamily: "inter" }} 
                        fallback={{ fontSize: 24, bold: true, fontFamily: "inter" }}
                        onChange={v => setDraft(d => ({ ...d, whyPillarTitleStyle: v }))}
                        previewText="Pillar Title"
                      />
                      <TextStyleEditor 
                        label="Pillar Desc Style" 
                        value={draft.whyPillarDescStyle ?? { fontSize: 14, fontFamily: "inter" }} 
                        fallback={{ fontSize: 14, fontFamily: "inter" }}
                        onChange={v => setDraft(d => ({ ...d, whyPillarDescStyle: v }))}
                        previewText="Pillar description text."
                      />
                    </div>
                  </FieldGroup>
                </div>
              </SectionPanel>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionPanel({ title, subtitle, icon: Icon, children }: any) {
  return (
    <section className="rounded-2xl overflow-hidden bg-white/2 border border-white/5">
      <div className="px-7 py-5 flex items-center gap-4 border-b border-white/5 bg-white/2">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#837FFB]/10 border border-[#837FFB]/20">
          <Icon className="w-5 h-5 text-[#837FFB]" />
        </div>
        <div>
          <h2 className="text-white font-bold">{title}</h2>
          <p className="text-white/40 text-xs mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="p-7 space-y-6">{children}</div>
    </section>
  );
}

function FieldGroup({ legend, children }: any) {
  return (
    <div className="space-y-4">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 block">{legend}</span>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, multiline }: any) {
  const common = {
    value,
    onChange: (e: any) => onChange(e.target.value),
    className: "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#837FFB]/40 outline-none transition-all"
  };
  return (
    <label className="block w-full">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5 ml-1">{label}</span>
      {multiline ? <textarea {...common} rows={4} /> : <input type="text" {...common} />}
    </label>
  );
}
