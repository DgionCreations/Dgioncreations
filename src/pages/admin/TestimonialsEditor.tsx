import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Save, Check, AlertCircle, Type, Plus, Trash2,
  ChevronRight, ExternalLink, Loader2, MessageSquare, Eye, User
} from "lucide-react";
import { toast } from "sonner";
import { useContent, saveContent } from "@/lib/use-content";
import {
  TESTIMONIALS_CONTENT_KEY,
  defaultTestimonialsContent,
  type TestimonialsContent,
  type Testimonial,
  DEFAULT_QUOTE_STYLE,
  DEFAULT_AUTHOR_STYLE,
  DEFAULT_TESTIMONIALS_KICKER_STYLE,
  DEFAULT_TESTIMONIALS_TITLE_STYLE,
  DEFAULT_TESTIMONIALS_HIGHLIGHT_STYLE
} from "@/content/testimonials";

import TextStyleEditor from "@/components/admin/TextStyleEditor";
import WordHighlightPicker from "@/components/admin/WordHighlightPicker";

const TABS = [
  { id: "hero",     label: "Hero Section", icon: Type,          hint: "Title & Section Header" },
  { id: "showcase", label: "Showcase Box", icon: Save,          hint: "Featured card & logos" },
  { id: "why",      label: "Feedback Why", icon: MessageSquare, hint: "Why Your Voice Matters" },
  { id: "items",    label: "Testimonials", icon: MessageSquare, hint: "Client reviews & roles" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function TestimonialsEditor() {
  const { data, loading } = useContent<TestimonialsContent>(TESTIMONIALS_CONTENT_KEY, defaultTestimonialsContent);
  const [draft, setDraft] = useState<TestimonialsContent>(defaultTestimonialsContent);
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
      await saveContent<TestimonialsContent>(TESTIMONIALS_CONTENT_KEY, draft);
      setSaved(true);
      toast.success("Testimonials updated successfully!");
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
            <span className="text-[#837FFB]">Testimonials</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">What Clients Say</h1>
          <p className="text-white/45 text-sm mt-2 max-w-xl">
            Manage client reviews and feedback shown in the interactive 3D marquee.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl flex items-start gap-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-sm text-red-300">{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(180deg, rgba(13,11,36,0.9), rgba(8,6,26,0.9))",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)"
              }}
            >
              <div className="space-y-2">
                {TABS.map((t, i) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className="relative w-full rounded-xl p-3 text-left transition-all overflow-hidden group flex items-center gap-3"
                      style={{
                        background: isActive
                          ? "linear-gradient(135deg, rgba(131,127,251,0.18), rgba(131,127,251,0.04))"
                          : "rgba(255,255,255,0.025)",
                        border: `1px solid ${isActive ? "rgba(131,127,251,0.55)" : "rgba(255,255,255,0.06)"}`,
                      }}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: isActive ? "rgba(131,127,251,0.4)" : "rgba(255,255,255,0.04)" }}>
                        <Icon className="w-4 h-4" style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.3)" }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.7)" }}>{t.label}</h3>
                        <p className="text-white/40 text-[10px] mt-0.5">{t.hint}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Editor */}
          <div className="space-y-6">
            {activeTab === "hero" && (
              <SectionPanel title="Header Content" subtitle="Edit the section intro" icon={Type}>
                <FieldGroup legend="Kicker">
                  <Field label="Kicker text" value={draft.heroKicker} onChange={v => setDraft(d => ({ ...d, heroKicker: v }))} />
                  <TextStyleEditor 
                    label="Kicker Style" 
                    value={draft.heroKickerStyle ?? DEFAULT_TESTIMONIALS_KICKER_STYLE} 
                    fallback={DEFAULT_TESTIMONIALS_KICKER_STYLE}
                    onChange={v => setDraft(d => ({ ...d, heroKickerStyle: v }))}
                    previewText={draft.heroKicker || "Testimonials"}
                  />
                </FieldGroup>
                <FieldGroup legend="Title">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
                    <Field label="Hero Title" value={draft.heroTitle} onChange={v => setDraft(d => ({ ...d, heroTitle: v }))} multiline />
                    <WordHighlightPicker 
                      value={draft.heroTitle} 
                      onChange={v => setDraft(d => ({ ...d, heroTitle: v }))}
                      baseStyle={draft.heroTitleStyle ?? DEFAULT_TESTIMONIALS_TITLE_STYLE}
                      highlightStyle={draft.heroHighlightStyle ?? DEFAULT_TESTIMONIALS_HIGHLIGHT_STYLE}
                    />
                  </div>
                  <TextStyleEditor 
                    label="Title Style" 
                    value={draft.heroTitleStyle ?? DEFAULT_TESTIMONIALS_TITLE_STYLE} 
                    fallback={DEFAULT_TESTIMONIALS_TITLE_STYLE}
                    onChange={v => setDraft(d => ({ ...d, heroTitleStyle: v }))}
                    previewText={(draft.heroTitle || "What Clients say").replace(/\*\*([^*\n]+?)(?:\|[^*\n]*)?\*\*/g, "$1")}
                  />
                  <TextStyleEditor 
                    label="Highlight Style" 
                    value={draft.heroHighlightStyle ?? DEFAULT_TESTIMONIALS_HIGHLIGHT_STYLE} 
                    fallback={DEFAULT_TESTIMONIALS_HIGHLIGHT_STYLE}
                    onChange={v => setDraft(d => ({ ...d, heroHighlightStyle: v }))}
                    previewText={((draft.heroTitle || "").match(/\*\*([^*\n|]+?)(?:\|[^*\n]*)?\*\*/)?.[1]) || "say"}
                  />
                </FieldGroup>
              </SectionPanel>
            )}
            
            {activeTab === "showcase" && (
              <SectionPanel title="Animated Showcase" subtitle="Edit the featured card & logo cloud" icon={Save}>
                <FieldGroup legend="Showcase Content">
                  <Field label="Badge Text" value={draft.showcaseBadge} onChange={v => setDraft(d => ({ ...d, showcaseBadge: v }))} />
                  <TextStyleEditor 
                    label="Badge Style" 
                    value={draft.showcaseBadgeStyle ?? { fontSize: 12, fontFamily: "inter", bold: true, color: "#837FFB" }} 
                    fallback={{ fontSize: 12, fontFamily: "inter", bold: true, color: "#837FFB" }}
                    onChange={v => setDraft(d => ({ ...d, showcaseBadgeStyle: v }))}
                    previewText={draft.showcaseBadge || "Trust & Results"}
                  />
                  <Field label="Showcase Title" value={draft.showcaseTitle} onChange={v => setDraft(d => ({ ...d, showcaseTitle: v }))} />
                  <TextStyleEditor 
                    label="Showcase Title Style" 
                    value={draft.showcaseTitleStyle ?? { fontSize: 48, fontFamily: "inter", bold: true, color: "#FFFFFF" }} 
                    fallback={{ fontSize: 48, fontFamily: "inter", bold: true, color: "#FFFFFF" }}
                    onChange={v => setDraft(d => ({ ...d, showcaseTitleStyle: v }))}
                    previewText={draft.showcaseTitle || "What Founders Say"}
                  />
                  <Field label="Showcase Subtitle" value={draft.showcaseSubtitle} onChange={v => setDraft(d => ({ ...d, showcaseSubtitle: v }))} multiline />
                  <TextStyleEditor 
                    label="Showcase Subtitle Style" 
                    value={draft.showcaseSubtitleStyle ?? { fontSize: 18, fontFamily: "inter", color: "rgba(255,255,255,0.5)" }} 
                    fallback={{ fontSize: 18, fontFamily: "inter", color: "rgba(255,255,255,0.5)" }}
                    onChange={v => setDraft(d => ({ ...d, showcaseSubtitleStyle: v }))}
                    previewText={draft.showcaseSubtitle || "Subtitle text..."}
                  />
                </FieldGroup>

                <FieldGroup legend="Trust Logos">
                  <Field label="Logo Cloud Title" value={draft.trustedCompaniesTitle} onChange={v => setDraft(d => ({ ...d, trustedCompaniesTitle: v }))} />
                  <TextStyleEditor 
                    label="Logo Cloud Title Style" 
                    value={draft.trustedCompaniesStyle ?? { fontSize: 12, fontFamily: "inter", bold: true, color: "rgba(131,127,251,0.6)" }} 
                    fallback={{ fontSize: 12, fontFamily: "inter", bold: true, color: "rgba(131,127,251,0.6)" }}
                    onChange={v => setDraft(d => ({ ...d, trustedCompaniesStyle: v }))}
                    previewText={draft.trustedCompaniesTitle || "TRUSTED BY..."}
                  />
                  <Field 
                    label="Companies (Comma Separated)" 
                    value={draft.trustedCompanies?.join(", ")} 
                    onChange={v => setDraft(d => ({ ...d, trustedCompanies: v.split(",").map(s => s.trim()).filter(Boolean) }))} 
                    hint="Enter company names separated by commas (e.g. Google, Apple, Microsoft)"
                  />
                </FieldGroup>
              </SectionPanel>
            )}

            {activeTab === "why" && (
              <SectionPanel title="Why Feedback Matters" subtitle="Edit the right-side content" icon={MessageSquare}>
                <FieldGroup legend="Introduction">
                  <Field label="Kicker Text" value={draft.whyKicker} onChange={v => setDraft(d => ({ ...d, whyKicker: v }))} />
                  <TextStyleEditor 
                    label="Kicker Style" 
                    value={draft.whyKickerStyle ?? { fontSize: 12, fontFamily: "inter", bold: true, color: "#837FFB" }} 
                    fallback={{ fontSize: 12, fontFamily: "inter", bold: true, color: "#837FFB" }}
                    onChange={v => setDraft(d => ({ ...d, whyKickerStyle: v }))}
                    previewText={draft.whyKicker || "Feedback"}
                  />
                  <Field label="Why Title" value={draft.whyTitle} onChange={v => setDraft(d => ({ ...d, whyTitle: v }))} multiline />
                  <WordHighlightPicker 
                    value={draft.whyTitle} 
                    onChange={v => setDraft(d => ({ ...d, whyTitle: v }))}
                    baseStyle={draft.whyTitleStyle ?? { fontSize: 48, fontFamily: "the-seasons", bold: true, color: "#FFFFFF" }}
                    highlightStyle={draft.heroHighlightStyle ?? DEFAULT_TESTIMONIALS_HIGHLIGHT_STYLE}
                  />
                  <TextStyleEditor 
                    label="Why Title Style" 
                    value={draft.whyTitleStyle ?? { fontSize: 48, fontFamily: "the-seasons", bold: true, color: "#FFFFFF" }} 
                    fallback={{ fontSize: 48, fontFamily: "the-seasons", bold: true, color: "#FFFFFF" }}
                    onChange={v => setDraft(d => ({ ...d, whyTitleStyle: v }))}
                    previewText={draft.whyTitle?.replace(/\*\*([^*\n]+?)(?:\|[^*\n]*)?\*\*/g, "$1") || "Why Your Voice Matters"}
                  />
                  <Field label="Why Subtitle" value={draft.whySubtitle} onChange={v => setDraft(d => ({ ...d, whySubtitle: v }))} multiline />
                  <TextStyleEditor 
                    label="Why Subtitle Style" 
                    value={draft.whySubtitleStyle ?? { fontSize: 18, fontFamily: "inter", color: "rgba(255,255,255,0.5)" }} 
                    fallback={{ fontSize: 18, fontFamily: "inter", color: "rgba(255,255,255,0.5)" }}
                    onChange={v => setDraft(d => ({ ...d, whySubtitleStyle: v }))}
                    previewText={draft.whySubtitle || "Your feedback helps us evolve..."}
                  />
                </FieldGroup>

                <FieldGroup legend="Benefit Items">
                  {draft.whyItems.map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 mb-4">
                      <Field label={`Item ${i + 1} Title`} value={item.title} onChange={v => setDraft(d => {
                        const items = [...d.whyItems];
                        items[i] = { ...items[i], title: v };
                        return { ...d, whyItems: items };
                      })} />
                      <Field label={`Item ${i + 1} Description`} value={item.desc} onChange={v => setDraft(d => {
                        const items = [...d.whyItems];
                        items[i] = { ...items[i], desc: v };
                        return { ...d, whyItems: items };
                      })} multiline />
                    </div>
                  ))}
                </FieldGroup>
              </SectionPanel>
            )}

            {activeTab === "items" && (
              <SectionPanel title="Client Testimonials" subtitle="Manage individual reviews" icon={MessageSquare}>
                <div className="space-y-4">
                  {draft.testimonials.map((t, i) => (
                    <div key={i} className="rounded-xl p-5 bg-white/2 border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-white/30" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Review {i + 1}</span>
                        </div>
                        <button 
                          onClick={() => setDraft(d => ({ ...d, testimonials: d.testimonials.filter((_, idx) => idx !== i) }))}
                          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Name" value={t.name} onChange={v => setDraft(d => {
                          const list = [...d.testimonials];
                          list[i] = { ...list[i], name: v, avatar: v.split(" ").map(n => n[0]).join("").toUpperCase() };
                          return { ...d, testimonials: list };
                        })} />
                        <Field label="Role / Company" value={t.role} onChange={v => setDraft(d => {
                          const list = [...d.testimonials];
                          list[i] = { ...list[i], role: v };
                          return { ...d, testimonials: list };
                        })} />
                      </div>
                      <Field label="Testimonial Quote" multiline value={t.quote} onChange={v => setDraft(d => {
                        const list = [...d.testimonials];
                        list[i] = { ...list[i], quote: v };
                        return { ...d, testimonials: list };
                      })} />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
                        <TextStyleEditor 
                          label="Quote Style" 
                          value={t.quoteStyle ?? DEFAULT_QUOTE_STYLE} 
                          fallback={DEFAULT_QUOTE_STYLE}
                          onChange={v => setDraft(d => {
                            const list = [...d.testimonials];
                            list[i] = { ...list[i], quoteStyle: v };
                            return { ...d, testimonials: list };
                          })}
                          previewText="&ldquo;Sample quote...&rdquo;"
                        />
                        <TextStyleEditor 
                          label="Author Style" 
                          value={t.authorStyle ?? DEFAULT_AUTHOR_STYLE} 
                          fallback={DEFAULT_AUTHOR_STYLE}
                          onChange={v => setDraft(d => {
                            const list = [...d.testimonials];
                            list[i] = { ...list[i], authorStyle: v };
                            return { ...d, testimonials: list };
                          })}
                          previewText={t.name || "James Miller"}
                        />
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setDraft(d => ({ ...d, testimonials: [...d.testimonials, { name: "New Client", role: "CEO, Company", quote: "Fantastic work...", avatar: "NC" }] }))}
                    className="w-full py-4 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/40 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Testimonial
                  </button>
                </div>
              </SectionPanel>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Header({ saving, saved, dirty, onSave, tabLabel, tabIndex, tabTotal }: any) {
  return (
    <header className="sticky top-0 z-20" style={{ background: "rgba(8,6,26,0.85)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span>Dashboard</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          {saved ? <span className="text-xs text-green-400 font-semibold flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Published</span> : dirty ? <span className="text-xs text-amber-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Unpublished Changes</span> : null}
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
  );
}

function SectionPanel({ title, subtitle, icon: Icon, children }: any) {
  return (
    <section className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="px-7 py-5 flex items-center gap-4 border-b border-white/5">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(131,127,251,0.1)", border: "1px solid rgba(131,127,251,0.2)" }}>
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
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 block mb-2">{legend}</span>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, multiline }: any) {
  const common = {
    value,
    onChange: (e: any) => onChange(e.target.value),
    className: "w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-[#837FFB]/50 transition-all outline-none"
  };
  return (
    <label className="block w-full">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5 ml-1">{label}</span>
      {multiline ? <textarea {...common} rows={4} /> : <input type="text" {...common} />}
    </label>
  );
}
