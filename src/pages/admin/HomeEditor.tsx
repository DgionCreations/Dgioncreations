import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Save, Check, AlertCircle,
  Image as ImageIcon, Type, MessageSquare, BarChart3,
  ChevronRight, Eye, ExternalLink, Loader2, Plus, Trash2,
} from "lucide-react";
import { useContent, saveContent } from "@/lib/use-content";
import {
  HERO_CONTENT_KEY,
  defaultHeroContent,
  DEFAULT_BADGE_STYLE,
  DEFAULT_HEADLINE_STYLE,
  DEFAULT_HIGHLIGHT_STYLE,
  DEFAULT_DESCRIPTION_STYLE,
  DEFAULT_STAT_VALUE_STYLE,
  DEFAULT_STAT_LABEL_STYLE,
  DEFAULT_CTA_PRIMARY_STYLE,
  DEFAULT_CTA_SECONDARY_STYLE,
  type HeroContent,
} from "@/content/hero";
import TextStyleEditor from "@/components/admin/TextStyleEditor";
import ImageField from "@/components/admin/ImageField";
import WordHighlightPicker from "@/components/admin/WordHighlightPicker";

/* ──────────────── Tab registry ────────────────
 * Centralised so the sidebar nav and the actual section rendering never
 * drift out of sync. Add a section: add one row here and one
 * `{activeTab === "..."}` block below.
 */
const TABS = [
  { id: "badge-headline", label: "Badge & Headline", icon: Type,          hint: "Top badge + 3-part headline" },
  { id: "hero-image",     label: "Hero Image",       icon: ImageIcon,     hint: "Right-side visual or 3D scene" },
  { id: "description",    label: "Description & CTAs", icon: MessageSquare, hint: "Paragraph + two action buttons" },
  { id: "stats",          label: "Stats Row",        icon: BarChart3,     hint: "Three number + label pairs" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function HomeEditor() {
  const { data, loading } = useContent<HeroContent>(HERO_CONTENT_KEY, defaultHeroContent);
  const [draft, setDraft] = useState<HeroContent>(defaultHeroContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Which tab is currently active. */
  const [activeTab, setActiveTab] = useState<TabId>(TABS[0].id);

  /** Marks the draft as having unpublished changes so the Publish button can show it. */
  const dirty = JSON.stringify(draft) !== JSON.stringify(data);

  useEffect(() => {
    if (!loading) setDraft(data);
  }, [loading, data]);

  const onSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await saveContent<HeroContent>(HERO_CONTENT_KEY, draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updateStat = (i: number, key: "value" | "label", v: string) => {
    setDraft((d) => ({
      ...d,
      stats: d.stats.map((s, idx) => (idx === i ? { ...s, [key]: v } : s)),
    }));
  };

  const addStat = () => {
    setDraft(d => ({
      ...d,
      stats: [...d.stats, { value: "0", label: "New Stat" }]
    }));
  };

  const removeStat = (idx: number) => {
    setDraft(d => ({
      ...d,
      stats: d.stats.filter((_, i) => i !== idx)
    }));
  };

  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)" }}
    >
      {/* ═══ Top header ═══ */}
      <Header
        saving={saving}
        saved={saved}
        dirty={dirty}
        onSave={onSave}
        sectionLabel={TABS[activeIndex]?.label ?? ""}
        sectionIndex={activeIndex + 1}
        sectionTotal={TABS.length}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-white/40">
            <Link to="/admin" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#837FFB]">Home Page</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Home Page — Hero</h1>
          <p className="text-white/45 text-sm mt-2 max-w-xl">
            Everything above the fold on your home page. Changes publish to the live site
            the moment you hit{" "}
            <span className="text-[#837FFB] font-semibold">Publish</span>.
          </p>
        </div>

        {error && (
          <div
            className="mb-6 p-4 rounded-xl flex items-start gap-3"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
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
                to="/"
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
            {activeTab === "badge-headline" && (
            <SectionCard
              id="badge-headline"
              index={1}
              total={TABS.length}
              title="Badge & Headline"
              subtitle="The first thing visitors read — set the tone with a crisp badge and a 3-part headline."
              icon={Type}
            >
              <FieldGroup legend="Badge">
                <Field
                  label="Top badge text"
                  value={draft.badge}
                  onChange={(v) => setDraft((d) => ({ ...d, badge: v }))}
                />
                <TextStyleEditor
                  label="Typography — badge"
                  value={draft.badgeStyle ?? DEFAULT_BADGE_STYLE}
                  fallback={DEFAULT_BADGE_STYLE}
                  onChange={(v) => setDraft((d) => ({ ...d, badgeStyle: v }))}
                  previewText={draft.badge}
                />
              </FieldGroup>

              <FieldGroup legend="Headline">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3 items-start">
                  <Field
                    label="Hero Title (use line breaks + **word** markup for highlights)"
                    multiline
                    value={draft.headlineTop}
                    onChange={(v) => setDraft((d) => ({ ...d, headlineTop: v }))}
                  />
                  <WordHighlightPicker
                    value={draft.headlineTop}
                    onChange={(v: string) => setDraft((d) => ({ ...d, headlineTop: v }))}
                    baseStyle={draft.headlineStyle ?? DEFAULT_HEADLINE_STYLE}
                    highlightStyle={draft.highlightStyle ?? DEFAULT_HIGHLIGHT_STYLE}
                  />
                </div>
                <TextStyleEditor
                  label="Title Style"
                  value={draft.headlineStyle ?? DEFAULT_HEADLINE_STYLE}
                  fallback={DEFAULT_HEADLINE_STYLE}
                  onChange={(v) => setDraft((d) => ({ ...d, headlineStyle: v }))}
                  previewText={(draft.headlineTop.split("\n")[0] || "Title").replace(/\*\*([^*\n]+?)(?:\|[^*\n]*)?\*\*/g, "$1")}
                />
                <TextStyleEditor
                  label="Highlight Style"
                  value={draft.highlightStyle ?? DEFAULT_HIGHLIGHT_STYLE}
                  fallback={DEFAULT_HIGHLIGHT_STYLE}
                  onChange={(v) => setDraft((d) => ({ ...d, highlightStyle: v }))}
                  previewText={(draft.headlineTop.match(/\*\*([^*\n|]+?)(?:\|[^*\n]*)?\*\*/)?.[1]) || draft.headlineHighlight || "Highlight"}
                />
                {draft.headlineHighlight && !draft.headlineTop.includes("**") && (
                  <div className="rounded-lg p-3 text-[11px] text-amber-300/70" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)" }}>
                    <strong className="text-amber-300">Legacy fields active:</strong> "Highlighted middle" ({draft.headlineHighlight}) + "Line 3" ({draft.headlineBottom}) abhi alag fields se aa rahe hain. Naya word picker use karne ke liye Hero Title mein line breaks daalein aur woh word ka chip click karein — legacy fields auto unused ho jayenge.
                  </div>
                )}
                {!draft.headlineTop.includes("**") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Middle (highlighted, legacy)"
                      value={draft.headlineHighlight}
                      onChange={(v) => setDraft((d) => ({ ...d, headlineHighlight: v }))}
                    />
                    <Field
                      label="Line 3 (legacy)"
                      value={draft.headlineBottom}
                      onChange={(v) => setDraft((d) => ({ ...d, headlineBottom: v }))}
                    />
                  </div>
                )}
              </FieldGroup>
            </SectionCard>
            )}

            {activeTab === "hero-image" && (
            <SectionCard
              id="hero-image"
              index={2}
              total={TABS.length}
              title="Hero Image"
              subtitle="Right-side visual. Leave blank to use the default interactive 3D scene."
              icon={ImageIcon}
            >
              <ImageField
                label="Image"
                value={draft.heroImageUrl ?? ""}
                onChange={(v) => setDraft((d) => ({ ...d, heroImageUrl: v }))}
                folder="hero"
                placeholder="https://example.com/hero.jpg or upload"
                previewHeight="h-56"
                hint="Upload from your computer or paste any public image URL. Leave blank to keep the default 3D robot scene."
              />
            </SectionCard>
            )}

            {activeTab === "description" && (
            <SectionCard
              id="description"
              index={3}
              total={TABS.length}
              title="Description & Call-to-Actions"
              subtitle="Elevator pitch paragraph plus the primary and secondary buttons."
              icon={MessageSquare}
            >
              <FieldGroup legend="Paragraph">
                <Field
                  label="Description"
                  multiline
                  value={draft.description}
                  onChange={(v) => setDraft((d) => ({ ...d, description: v }))}
                />
                <TextStyleEditor
                  label="Typography — paragraph"
                  value={draft.descriptionStyle ?? DEFAULT_DESCRIPTION_STYLE}
                  fallback={DEFAULT_DESCRIPTION_STYLE}
                  onChange={(v) => setDraft((d) => ({ ...d, descriptionStyle: v }))}
                  previewText={draft.description}
                />
              </FieldGroup>

              <FieldGroup legend="Buttons">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Primary button label"
                    value={draft.ctaPrimaryLabel}
                    onChange={(v) => setDraft((d) => ({ ...d, ctaPrimaryLabel: v }))}
                  />
                  <Field
                    label="Secondary button label"
                    value={draft.ctaSecondaryLabel}
                    onChange={(v) => setDraft((d) => ({ ...d, ctaSecondaryLabel: v }))}
                  />
                </div>
                <TextStyleEditor
                  label="Typography — primary button"
                  value={draft.ctaPrimaryStyle ?? DEFAULT_CTA_PRIMARY_STYLE}
                  fallback={DEFAULT_CTA_PRIMARY_STYLE}
                  onChange={(v) => setDraft((d) => ({ ...d, ctaPrimaryStyle: v }))}
                  previewText={draft.ctaPrimaryLabel}
                />
                <TextStyleEditor
                  label="Typography — secondary button"
                  value={draft.ctaSecondaryStyle ?? DEFAULT_CTA_SECONDARY_STYLE}
                  fallback={DEFAULT_CTA_SECONDARY_STYLE}
                  onChange={(v) => setDraft((d) => ({ ...d, ctaSecondaryStyle: v }))}
                  previewText={draft.ctaSecondaryLabel}
                />
              </FieldGroup>
            </SectionCard>
            )}

            {activeTab === "stats" && (
            <SectionCard
              id="stats"
              index={4}
              total={TABS.length}
              title="Stats Row"
              subtitle="Three trust indicators shown under the hero — big number + short label."
              icon={BarChart3}
            >
              <div className="space-y-4">
                {draft.stats.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-mono"
                          style={{
                            background: "rgba(131,127,251,0.15)",
                            color: "#837FFB",
                            border: "1px solid rgba(131,127,251,0.3)",
                          }}
                        >
                          0{i + 1}
                        </span>
                        <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/50">
                          Stat {i + 1}
                        </span>
                      </div>
                      <button 
                        onClick={() => removeStat(i)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label="Value"
                        value={s.value}
                        onChange={(v) => updateStat(i, "value", v)}
                      />
                      <Field
                        label="Label"
                        value={s.label}
                        onChange={(v) => updateStat(i, "label", v)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={addStat}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/50 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Stat Item
              </button>

              <FieldGroup legend="Typography — applies to all stats">
                <TextStyleEditor
                  label="Stat value (big number)"
                  value={draft.statValueStyle ?? DEFAULT_STAT_VALUE_STYLE}
                  fallback={DEFAULT_STAT_VALUE_STYLE}
                  onChange={(v) => setDraft((d) => ({ ...d, statValueStyle: v }))}
                  previewText={draft.stats[0]?.value}
                />
                <TextStyleEditor
                  label="Stat label (caption)"
                  value={draft.statLabelStyle ?? DEFAULT_STAT_LABEL_STYLE}
                  fallback={DEFAULT_STAT_LABEL_STYLE}
                  onChange={(v) => setDraft((d) => ({ ...d, statLabelStyle: v }))}
                  previewText={draft.stats[0]?.label}
                />
              </FieldGroup>
            </SectionCard>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div
          className="mt-10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(131,127,251,0.1), rgba(91,87,245,0.04))",
            border: "1px solid rgba(131,127,251,0.25)",
          }}
        >
          <div className="flex-1 text-center md:text-left">
            <p className="text-white font-bold">Ready to go live?</p>
            <p className="text-white/55 text-sm mt-0.5">
              Your changes are saved as a draft until you publish them.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white/80 transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" /> Preview
            </Link>
            <button
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50 transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #837FFB, #5B57F5)",
                boxShadow: "0 8px 24px rgba(131,127,251,0.35)",
              }}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Publish Changes
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ──────────────── Header ──────────────── */

function Header({
  saving, saved, dirty, onSave, sectionLabel, sectionIndex, sectionTotal,
}: {
  saving: boolean;
  saved: boolean;
  dirty: boolean;
  onSave: () => void;
  sectionLabel: string;
  sectionIndex: number;
  sectionTotal: number;
}) {
  return (
    <header
      className="sticky top-0 z-20"
      style={{
        background: "rgba(8,6,26,0.85)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Progress bar at the very top */}
      <div
        className="h-0.5"
        style={{
          background: `linear-gradient(90deg, #837FFB 0%, #837FFB ${
            (sectionIndex / sectionTotal) * 100
          }%, rgba(255,255,255,0.06) ${
            (sectionIndex / sectionTotal) * 100
          }%, rgba(255,255,255,0.06) 100%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
        <Link
          to="/admin"
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <span className="hidden md:block w-px h-5 bg-white/10" />

        {/* Current section pill */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="text-white/35">Editing</span>
          <span
            className="px-2.5 py-1 rounded-md font-bold tracking-wider uppercase"
            style={{
              background: "rgba(131,127,251,0.12)",
              color: "#837FFB",
              border: "1px solid rgba(131,127,251,0.3)",
              fontSize: 10,
            }}
          >
            {sectionLabel}
          </span>
          <span className="text-white/25 font-mono text-[10px]">
            {sectionIndex} / {sectionTotal}
          </span>
        </div>

        <div className="flex-1" />

        {/* Save status */}
        <div className="flex items-center gap-3">
          {saved ? (
            <span className="flex items-center gap-1.5 text-xs text-green-400 font-semibold">
              <Check className="w-3.5 h-3.5" /> Published
            </span>
          ) : dirty ? (
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Unpublished changes
            </span>
          ) : (
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              In sync
            </span>
          )}

          <button
            onClick={onSave}
            disabled={saving || !dirty}
            className="flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #837FFB, #5B57F5)",
              boxShadow: "0 4px 16px rgba(131,127,251,0.3)",
            }}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{saving ? "Publishing..." : "Publish"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ──────────────── SectionCard ──────────────── */

function SectionCard({
  id, index, total, title, subtitle, icon: Icon, children,
}: {
  id: string;
  index: number;
  total: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  const cardRef = useRef<HTMLElement>(null);

  return (
    <section
      id={id}
      ref={cardRef}
      className="scroll-mt-24 mb-6"
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2), 0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        {/* Section header */}
        <div
          className="px-7 py-5 flex items-center gap-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(131,127,251,0.05), rgba(131,127,251,0.01))",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(131,127,251,0.14)",
              border: "1px solid rgba(131,127,251,0.3)",
              boxShadow: "0 0 24px rgba(131,127,251,0.15)",
            }}
          >
            <Icon className="w-5 h-5 text-[#837FFB]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-white/35 mb-1">
              <span>Section</span>
              <span className="text-[#837FFB]">
                {String(index).padStart(2, "0")}
              </span>
              <span>·</span>
              <span>{String(total).padStart(2, "0")}</span>
            </div>
            <h2 className="text-white text-xl font-bold tracking-tight">{title}</h2>
            <p className="text-white/50 text-sm mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Section body */}
        <div className="px-7 py-6 space-y-6">{children}</div>
      </div>
    </section>
  );
}

/* ──────────────── FieldGroup ──────────────── */

function FieldGroup({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-5 space-y-4"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="block h-px w-6"
          style={{ background: "linear-gradient(90deg, #837FFB, transparent)" }}
        />
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/60">
          {legend}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ──────────────── Field ──────────────── */

function Field({
  label, value, onChange, multiline, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const common = {
    value,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    className: "w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] text-white text-sm outline-none focus:ring-2 focus:ring-[#837FFB]/40 focus:bg-white/[0.06] placeholder-white/25 transition-colors",
    style: { border: "1px solid rgba(255,255,255,0.08)" },
  } as const;
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 mb-1.5">
        {label}
      </span>
      {multiline ? <textarea {...common} rows={4} /> : <input type="text" {...common} />}
    </label>
  );
}
