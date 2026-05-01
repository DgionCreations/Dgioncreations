import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Check,
  AlertCircle,
  Type,
  Image as ImageIcon,
  Rocket,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  BarChart3,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useContent, saveContent } from "@/lib/use-content";
import {
  CTA_CONTENT_KEY,
  defaultCtaContent,
  type CtaContent,
  type CtaStat,
  DEFAULT_PREHEADER_STYLE,
  DEFAULT_HEADING_STYLE,
  DEFAULT_DESCRIPTION_STYLE,
  DEFAULT_BUTTON_STYLE,
  DEFAULT_STAT_STYLE,
} from "@/content/cta";
import TextStyleEditor from "@/components/admin/TextStyleEditor";
import ImageField from "@/components/admin/ImageField";

/* Tab registry — 4 tabs shown side-by-side; clicking a tab swaps the content below. */
const TABS = [
  { id: "headline",     label: "Headline",     icon: Type,      hint: "Pre-header, heading, description" },
  { id: "button",       label: "Button",       icon: Rocket,    hint: "Label + scroll target" },
  { id: "illustration", label: "Illustration", icon: ImageIcon, hint: "Right-side image + alt" },
  { id: "stats",        label: "Trust Strip",  icon: BarChart3, hint: "Stats under the button" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function CtaEditor() {
  const { data, loading } = useContent<CtaContent>(CTA_CONTENT_KEY, defaultCtaContent);
  const [draft, setDraft] = useState<CtaContent>(defaultCtaContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("headline");

  const dirty = JSON.stringify(draft) !== JSON.stringify(data);

  useEffect(() => {
    if (!loading) setDraft(data);
  }, [loading, data]);

  const onSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await saveContent<CtaContent>(CTA_CONTENT_KEY, draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ── Stats list helpers ── */
  const updateStat = (i: number, patch: Partial<CtaStat>) =>
    setDraft((d) => ({ ...d, stats: d.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) }));

  const moveStat = (i: number, dir: -1 | 1) =>
    setDraft((d) => {
      const target = i + dir;
      if (target < 0 || target >= d.stats.length) return d;
      const next = [...d.stats];
      [next[i], next[target]] = [next[target], next[i]];
      return { ...d, stats: next };
    });

  const removeStat = (i: number) =>
    setDraft((d) => ({ ...d, stats: d.stats.filter((_, idx) => idx !== i) }));

  const addStat = () =>
    setDraft((d) => ({ ...d, stats: [...d.stats, { text: "New Stat" }] }));

  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)" }}
    >
      <Header
        saving={saving}
        saved={saved}
        dirty={dirty}
        onSave={onSave}
        tabLabel={TABS[activeIndex]?.label ?? ""}
        tabIndex={activeIndex + 1}
        tabTotal={TABS.length}
      />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Breadcrumb + page title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-white/40">
            <Link to="/admin" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#837FFB]">CTA Spotlight</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Home Page — CTA Spotlight</h1>
          <p className="text-white/45 text-sm mt-2 max-w-xl">
            The "Ready to Build the Future?" call-to-action card on the home page.
            Pick a tab below to edit that part — changes go live the moment you publish.
          </p>
        </div>

        {error && (
          <div
            className="mb-6 p-4 rounded-xl flex items-start gap-3"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-sm text-red-300">{error}</div>
          </div>
        )}

        {/* ── 4 tab boxes side-by-side ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TABS.map((t, i) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            const badge = t.id === "stats" ? draft.stats.length : null;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className="relative rounded-2xl p-5 text-left transition-all overflow-hidden group"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, rgba(131,127,251,0.14), rgba(131,127,251,0.04))"
                    : "rgba(255,255,255,0.025)",
                  border: `1px solid ${
                    isActive ? "rgba(131,127,251,0.5)" : "rgba(255,255,255,0.08)"
                  }`,
                  boxShadow: isActive
                    ? "0 0 32px rgba(131,127,251,0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : undefined,
                }}
              >
                {/* Active indicator stripe at bottom */}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{
                      background: "linear-gradient(90deg, transparent, #837FFB, transparent)",
                    }}
                  />
                )}

                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all"
                    style={{
                      background: isActive
                        ? "rgba(131,127,251,0.22)"
                        : "rgba(255,255,255,0.04)",
                      border: `1px solid ${
                        isActive ? "rgba(131,127,251,0.45)" : "rgba(255,255,255,0.08)"
                      }`,
                      boxShadow: isActive ? "0 0 24px rgba(131,127,251,0.25)" : undefined,
                    }}
                  >
                    <Icon
                      className="w-5 h-5 transition-colors"
                      style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.55)" }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-white/35 mb-1">
                      <span>Tab</span>
                      <span style={{ color: isActive ? "#837FFB" : "rgba(255,255,255,0.45)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>·</span>
                      <span>{String(TABS.length).padStart(2, "0")}</span>
                    </div>
                    <h3
                      className="text-base font-bold tracking-tight transition-colors"
                      style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.8)" }}
                    >
                      {t.label}
                    </h3>
                    <p className="text-white/50 text-[11px] mt-1 leading-tight">{t.hint}</p>
                  </div>

                  {badge !== null && (
                    <span
                      className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest"
                      style={{
                        background: isActive ? "rgba(131,127,251,0.2)" : "rgba(255,255,255,0.04)",
                        color: isActive ? "#837FFB" : "rgba(255,255,255,0.45)",
                        border: `1px solid ${
                          isActive ? "rgba(131,127,251,0.4)" : "rgba(255,255,255,0.08)"
                        }`,
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Active tab content ── */}
        {activeTab === "headline" && (
          <SectionPanel
            title="Headline & Copy"
            subtitle="Pre-header, main heading, and the supporting paragraph on the card."
            icon={Type}
          >
            <FieldGroup legend="Pre-header">
              <Field
                label="Pre-header text (next to the rocket icon)"
                value={draft.preheaderText}
                onChange={(v) => setDraft((d) => ({ ...d, preheaderText: v }))}
              />
              <TextStyleEditor
                label="Typography — pre-header"
                value={draft.preheaderStyle ?? DEFAULT_PREHEADER_STYLE}
                fallback={DEFAULT_PREHEADER_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, preheaderStyle: v }))}
                previewText={draft.preheaderText}
              />
            </FieldGroup>

            <FieldGroup legend="Main heading">
              <Field
                label="Heading (animated scattered letters)"
                value={draft.heading}
                onChange={(v) => setDraft((d) => ({ ...d, heading: v }))}
              />
              <TextStyleEditor
                label="Typography — heading"
                value={draft.headingStyle ?? DEFAULT_HEADING_STYLE}
                fallback={DEFAULT_HEADING_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, headingStyle: v }))}
                previewText={draft.heading}
              />
            </FieldGroup>

            <FieldGroup legend="Description">
              <Field
                label="Paragraph"
                multiline
                value={draft.description}
                onChange={(v) => setDraft((d) => ({ ...d, description: v }))}
              />
              <TextStyleEditor
                label="Typography — description"
                value={draft.descriptionStyle ?? DEFAULT_DESCRIPTION_STYLE}
                fallback={DEFAULT_DESCRIPTION_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, descriptionStyle: v }))}
                previewText={draft.description}
              />
            </FieldGroup>
          </SectionPanel>
        )}

        {activeTab === "button" && (
          <SectionPanel
            title="Button"
            subtitle="Label + scroll-to target ID for on-page smooth scroll."
            icon={Rocket}
          >
            <FieldGroup legend="Text & action">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Button label"
                  value={draft.buttonText}
                  onChange={(v) => setDraft((d) => ({ ...d, buttonText: v }))}
                />
                <Field
                  label="Scroll-to id (on click)"
                  value={draft.buttonScrollTargetId ?? ""}
                  onChange={(v) => setDraft((d) => ({ ...d, buttonScrollTargetId: v }))}
                  placeholder="contact"
                />
              </div>
              <p className="text-[11px] text-white/35 leading-relaxed">
                The button smoothly scrolls to the element with this id on the same page
                (e.g. "contact" scrolls to the contact form). Leave blank to make the
                button a no-op.
              </p>
            </FieldGroup>

            <FieldGroup legend="Typography">
              <TextStyleEditor
                label="Button text"
                value={draft.buttonStyle ?? DEFAULT_BUTTON_STYLE}
                fallback={DEFAULT_BUTTON_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, buttonStyle: v }))}
                previewText={draft.buttonText}
              />
            </FieldGroup>
          </SectionPanel>
        )}

        {activeTab === "illustration" && (
          <SectionPanel
            title="Illustration"
            subtitle="Right-side image. Upload or paste a URL; alt text is required for accessibility."
            icon={ImageIcon}
          >
            <FieldGroup legend="Image">
              <ImageField
                label="Illustration image"
                value={draft.imageUrl}
                onChange={(v) => setDraft((d) => ({ ...d, imageUrl: v }))}
                folder="cta"
                placeholder="https://images.unsplash.com/... or upload"
                previewHeight="h-48"
              />
              <Field
                label="Alt text (for accessibility)"
                value={draft.imageAlt ?? ""}
                onChange={(v) => setDraft((d) => ({ ...d, imageAlt: v }))}
                placeholder="Team collaborating on a digital project"
              />
            </FieldGroup>
          </SectionPanel>
        )}

        {activeTab === "stats" && (
          <SectionPanel
            title={`Trust Strip · ${draft.stats.length}`}
            subtitle="Short proof points shown below the button. Reorder, add, or remove freely."
            icon={BarChart3}
          >
            <div className="space-y-2">
              {draft.stats.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3 flex items-center gap-3"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex flex-col shrink-0">
                    <button
                      type="button"
                      onClick={() => moveStat(i, -1)}
                      disabled={i === 0}
                      className="p-0.5 rounded text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-25 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStat(i, 1)}
                      disabled={i === draft.stats.length - 1}
                      className="p-0.5 rounded text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-25 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  <span
                    className="w-9 h-9 rounded-md shrink-0 flex items-center justify-center text-[11px] font-mono font-bold"
                    style={{
                      background: "rgba(131,127,251,0.14)",
                      color: "#837FFB",
                      border: "1px solid rgba(131,127,251,0.3)",
                    }}
                  >
                    0{i + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <Field
                      label={`Stat ${i + 1}`}
                      value={stat.text}
                      onChange={(v) => updateStat(i, { text: v })}
                      placeholder="100+ Projects"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeStat(i)}
                    className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                    title="Remove stat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addStat}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white transition-colors"
              style={{
                background: "rgba(131,127,251,0.05)",
                border: "1px dashed rgba(131,127,251,0.3)",
              }}
            >
              <Plus className="w-4 h-4" /> Add stat
            </button>

            <FieldGroup legend="Typography — applies to all stats">
              <TextStyleEditor
                label="Stat text"
                value={draft.statStyle ?? DEFAULT_STAT_STYLE}
                fallback={DEFAULT_STAT_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, statStyle: v }))}
                previewText={draft.stats[0]?.text}
              />
            </FieldGroup>
          </SectionPanel>
        )}

        {/* Footer publish CTA */}
        <div
          className="mt-10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(131,127,251,0.1), rgba(91,87,251,0.04))",
            border: "1px solid rgba(131,127,251,0.25)",
          }}
        >
          <div className="flex-1 text-center md:text-left">
            <p className="text-white font-bold">Ready to go live?</p>
            <p className="text-white/55 text-sm mt-0.5">
              Changes are saved as a draft until you publish them.
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
              disabled={saving || !dirty}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
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

/* ────────────────────────────── Header ────────────────────────────── */

function Header({
  saving, saved, dirty, onSave, tabLabel, tabIndex, tabTotal,
}: {
  saving: boolean;
  saved: boolean;
  dirty: boolean;
  onSave: () => void;
  tabLabel: string;
  tabIndex: number;
  tabTotal: number;
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
      <div
        className="h-0.5"
        style={{
          background: `linear-gradient(90deg, #837FFB 0%, #837FFB ${
            (tabIndex / tabTotal) * 100
          }%, rgba(255,255,255,0.06) ${
            (tabIndex / tabTotal) * 100
          }%, rgba(255,255,255,0.06) 100%)`,
        }}
      />
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <span className="hidden md:block w-px h-5 bg-white/10" />
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
            {tabLabel}
          </span>
          <span className="text-white/25 font-mono text-[10px]">
            {tabIndex} / {tabTotal}
          </span>
        </div>
        <div className="flex-1" />
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
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">{saving ? "Publishing..." : "Publish"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ────────────────────────────── SectionPanel ────────────────────────────── */

function SectionPanel({
  title, subtitle, icon: Icon, children,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2), 0 20px 60px rgba(0,0,0,0.15)",
      }}
    >
      <div
        className="px-7 py-5 flex items-center gap-4"
        style={{
          background: "linear-gradient(135deg, rgba(131,127,251,0.05), rgba(131,127,251,0.01))",
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
          <h2 className="text-white text-xl font-bold tracking-tight">{title}</h2>
          <p className="text-white/50 text-sm mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="px-7 py-6 space-y-6">{children}</div>
    </section>
  );
}

/* ────────────────────────────── FieldGroup ────────────────────────────── */

function FieldGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5 space-y-4"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
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

/* ────────────────────────────── Field ────────────────────────────── */

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
      {multiline ? <textarea {...common} rows={3} /> : <input type="text" {...common} />}
    </label>
  );
}
