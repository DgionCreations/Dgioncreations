import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Check,
  AlertCircle,
  Type,
  Layers,
  Workflow,
  Award,
  CheckSquare,
  Globe2,
  Quote,
  Rocket,
  Zap,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  Eye,
} from "lucide-react";
import { useContent, saveContent } from "@/lib/use-content";
import {
  SERVICES_CONTENT_KEY,
  defaultServicesContent,
  type ServicesContent,
  type ServicesStat,
  type ServiceCard,
  type ApproachPhase,
  type IndustryPill,
  type FeaturedCard,
  DEFAULT_HERO_KICKER_STYLE,
  DEFAULT_HERO_HEADLINE_STYLE,
  DEFAULT_HERO_HIGHLIGHT_STYLE,
  DEFAULT_HERO_DESCRIPTION_STYLE,
  DEFAULT_STAT_VALUE_STYLE,
  DEFAULT_STAT_LABEL_STYLE,
  DEFAULT_SERVICES_SECTION_TITLE_STYLE,
  DEFAULT_SERVICE_CARD_TITLE_STYLE,
  DEFAULT_SERVICE_CARD_DESC_STYLE,
  DEFAULT_SECTION_KICKER_STYLE,
  DEFAULT_SECTION_HEADING_STYLE,
  DEFAULT_SECTION_HIGHLIGHT_STYLE,
  DEFAULT_SECTION_DESCRIPTION_STYLE,
  DEFAULT_PHASE_TITLE_STYLE,
  DEFAULT_PHASE_DESC_STYLE,
  DEFAULT_DELIVERABLE_ITEM_STYLE,
  DEFAULT_INDUSTRY_PILL_STYLE,
  DEFAULT_TESTIMONIAL_QUOTE_STYLE,
  DEFAULT_CTA_HEADING_STYLE,
  DEFAULT_CTA_HIGHLIGHT_STYLE,
  DEFAULT_CTA_DESCRIPTION_STYLE,
  DEFAULT_FEATURED_CARD_TITLE_STYLE,
  DEFAULT_FEATURED_CARD_DESC_STYLE,
} from "@/content/services";
import { type IconKey } from "@/content/icons";
import TextStyleEditor from "@/components/admin/TextStyleEditor";
import IconSelect from "@/components/admin/IconSelect";
import ImageField from "@/components/admin/ImageField";
import WordHighlightPicker from "@/components/admin/WordHighlightPicker";

/* Tab registry — 8 tabs shown side-by-side; clicking a tab swaps the content below. */
const TABS = [
  { id: "hero",         label: "Hero",         icon: Type,         hint: "Headline + CTAs" },
  { id: "stats",        label: "Stats",        icon: Award,        hint: "Hero-level stat strip" },
  { id: "services",     label: "Services",     icon: Layers,       hint: "Cards + home grid" },
  { id: "approach",     label: "Approach",     icon: Workflow,     hint: "4 phases + shared typography" },
  { id: "deliverables", label: "Deliverables", icon: CheckSquare,  hint: "What you get list" },
  { id: "industries",   label: "Industries",   icon: Globe2,       hint: "Sector pills" },
  { id: "featured",     label: "Featured",     icon: Zap,          hint: "Flipping showcase cards" },
  { id: "testimonial",  label: "Testimonial",  icon: Quote,        hint: "Scrubbed quote" },
  { id: "cta",          label: "Closing CTA",  icon: Rocket,       hint: "Bottom call-to-action" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function ServicesEditor() {
  const { data, loading } = useContent<ServicesContent>(SERVICES_CONTENT_KEY, defaultServicesContent);
  const [draft, setDraft] = useState<ServicesContent>(defaultServicesContent);
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
      await saveContent<ServicesContent>(SERVICES_CONTENT_KEY, draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ── List helpers (stats) ───────────────────────── */
  const updateStat = (i: number, patch: Partial<ServicesStat>) =>
    setDraft((d) => ({ ...d, stats: d.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) }));
  const moveStat = (i: number, dir: -1 | 1) => setDraft((d) => {
    const t = i + dir;
    if (t < 0 || t >= d.stats.length) return d;
    const next = [...d.stats];
    [next[i], next[t]] = [next[t], next[i]];
    return { ...d, stats: next };
  });
  const removeStat = (i: number) =>
    setDraft((d) => ({ ...d, stats: d.stats.filter((_, idx) => idx !== i) }));
  const addStat = () =>
    setDraft((d) => ({ ...d, stats: [...d.stats, { value: "100+", label: "New Stat", iconKey: "star" as IconKey }] }));

  /* ── List helpers (services) ────────────────────── */
  const updateService = (id: string, patch: Partial<ServiceCard>) =>
    setDraft((d) => ({ ...d, services: d.services.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  const moveService = (id: string, dir: -1 | 1) => setDraft((d) => {
    const idx = d.services.findIndex((s) => s.id === id);
    const t = idx + dir;
    if (idx < 0 || t < 0 || t >= d.services.length) return d;
    const next = [...d.services];
    [next[idx], next[t]] = [next[t], next[idx]];
    return { ...d, services: next };
  });
  const removeService = (id: string) =>
    setDraft((d) => ({ ...d, services: d.services.filter((s) => s.id !== id) }));
  const addService = () =>
    setDraft((d) => ({
      ...d,
      services: [
        ...d.services,
        { id: `svc-${Date.now()}`, title: "New", full: "New Service", desc: "Short description.", iconKey: "sparkles" as IconKey, color: "#837FFB" },
      ],
    }));

  /* ── List helpers (approach) ────────────────────── */
  const updatePhase = (i: number, patch: Partial<ApproachPhase>) =>
    setDraft((d) => ({ ...d, approach: d.approach.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) }));
  const movePhase = (i: number, dir: -1 | 1) => setDraft((d) => {
    const t = i + dir;
    if (t < 0 || t >= d.approach.length) return d;
    const next = [...d.approach];
    [next[i], next[t]] = [next[t], next[i]];
    return { ...d, approach: next };
  });
  const removePhase = (i: number) =>
    setDraft((d) => ({ ...d, approach: d.approach.filter((_, idx) => idx !== i) }));
  const addPhase = () =>
    setDraft((d) => ({
      ...d,
      approach: [
        ...d.approach,
        { step: String(d.approach.length + 1).padStart(2, "0"), title: "New Phase", desc: "Describe this phase.", iconKey: "sparkles" as IconKey, base: "#837FFB", accent: "#1B1862" },
      ],
    }));

  /* ── List helpers (deliverables) ────────────────── */
  const updateDeliverable = (i: number, value: string) =>
    setDraft((d) => ({ ...d, deliverables: d.deliverables.map((x, idx) => (idx === i ? value : x)) }));
  const moveDeliverable = (i: number, dir: -1 | 1) => setDraft((d) => {
    const t = i + dir;
    if (t < 0 || t >= d.deliverables.length) return d;
    const next = [...d.deliverables];
    [next[i], next[t]] = [next[t], next[i]];
    return { ...d, deliverables: next };
  });
  const removeDeliverable = (i: number) =>
    setDraft((d) => ({ ...d, deliverables: d.deliverables.filter((_, idx) => idx !== i) }));
  const addDeliverable = () =>
    setDraft((d) => ({ ...d, deliverables: [...d.deliverables, "New deliverable"] }));

  /* ── List helpers (industries) ──────────────────── */
  const updateIndustry = (i: number, patch: Partial<IndustryPill>) =>
    setDraft((d) => ({ ...d, industries: d.industries.map((x, idx) => (idx === i ? { ...x, ...patch } : x)) }));
  const moveIndustry = (i: number, dir: -1 | 1) => setDraft((d) => {
    const t = i + dir;
    if (t < 0 || t >= d.industries.length) return d;
    const next = [...d.industries];
    [next[i], next[t]] = [next[t], next[i]];
    return { ...d, industries: next };
  });
  const removeIndustry = (i: number) =>
    setDraft((d) => ({ ...d, industries: d.industries.filter((_, idx) => idx !== i) }));
  const addIndustry = () =>
    setDraft((d) => ({ ...d, industries: [...d.industries, { name: "New", color: "#837FFB" }] }));

  /* ── List helpers (featured flipping cards) ─────── */
  const updateFeatured = (id: string, patch: Partial<FeaturedCard>) =>
    setDraft((d) => ({
      ...d,
      featured: d.featured.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  const moveFeatured = (id: string, dir: -1 | 1) => setDraft((d) => {
    const idx = d.featured.findIndex((c) => c.id === id);
    const t = idx + dir;
    if (idx < 0 || t < 0 || t >= d.featured.length) return d;
    const next = [...d.featured];
    [next[idx], next[t]] = [next[t], next[idx]];
    return { ...d, featured: next };
  });
  const removeFeatured = (id: string) =>
    setDraft((d) => ({ ...d, featured: d.featured.filter((c) => c.id !== id) }));
  const addFeatured = () =>
    setDraft((d) => ({
      ...d,
      featured: [
        ...d.featured,
        {
          id: `feat-${Date.now()}`,
          imageSrc: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop",
          imageAlt: "New card",
          title: "New Card",
          frontDesc: "Short description shown on the front.",
          backDesc: "Longer details shown when the card flips on hover.",
          buttonText: "Learn More",
          buttonUrl: "/services",
        },
      ],
    }));

  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  // Small helper — which tabs surface a count badge.
  const badgeFor = (id: TabId) => {
    switch (id) {
      case "stats":        return draft.stats.length;
      case "services":     return draft.services.length;
      case "approach":     return draft.approach.length;
      case "deliverables": return draft.deliverables.length;
      case "industries":   return draft.industries.length;
      case "featured":     return draft.featured.length;
      default:             return null;
    }
  };

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
        onReset={() => {
          if (confirm("This will replace all current services with the default 9 boxes. Continue?")) {
            setDraft(defaultServicesContent);
          }
        }}
        tabLabel={TABS[activeIndex]?.label ?? ""}
        tabIndex={activeIndex + 1}
        tabTotal={TABS.length}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb + page title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-white/40">
            <Link to="/admin" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#837FFB]">Services</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Services Page</h1>
          <p className="text-white/45 text-sm mt-2 max-w-xl">
            Pick a tab below to edit that part of the services page.
            Service card edits also flow to the home-page grid.
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
                to="/services"
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
        {/* ── Active tab content ── */}

        {activeTab === "hero" && (
          <SectionPanel title="Hero Header" subtitle="Big headline, description, and primary/secondary CTAs." icon={Type}>
            <FieldGroup legend="Kicker">
              <Field
                label="Kicker pill text (above headline)"
                value={draft.heroKicker}
                onChange={(v) => setDraft((d) => ({ ...d, heroKicker: v }))}
                placeholder="Our Expertise"
              />
              <TextStyleEditor
                label="Kicker Style"
                value={draft.heroKickerStyle ?? DEFAULT_HERO_KICKER_STYLE}
                fallback={DEFAULT_HERO_KICKER_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, heroKickerStyle: v }))}
                previewText={draft.heroKicker || "Our Expertise"}
              />
            </FieldGroup>

            <FieldGroup legend="Headline">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3 items-start">
                <Field
                  label="Hero Title (use line breaks + **word** markup for highlights)"
                  multiline
                  value={draft.heroHeadlineLine1}
                  onChange={(v) => setDraft((d) => ({ ...d, heroHeadlineLine1: v }))}
                />
                <WordHighlightPicker
                  value={draft.heroHeadlineLine1}
                  onChange={(v: string) => setDraft((d) => ({ ...d, heroHeadlineLine1: v }))}
                  baseStyle={draft.heroHeadlineStyle ?? DEFAULT_HERO_HEADLINE_STYLE}
                  highlightStyle={draft.heroHighlightStyle ?? DEFAULT_HERO_HIGHLIGHT_STYLE}
                />
              </div>
              <TextStyleEditor
                label="Title Style"
                value={draft.heroHeadlineStyle ?? DEFAULT_HERO_HEADLINE_STYLE}
                fallback={DEFAULT_HERO_HEADLINE_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, heroHeadlineStyle: v }))}
                previewText={(draft.heroHeadlineLine1.split("\n")[0] || "Title").replace(/\*\*([^*\n]+?)(?:\|[^*\n]*)?\*\*/g, "$1")}
              />
              <TextStyleEditor
                label="Highlight Style"
                value={draft.heroHighlightStyle ?? DEFAULT_HERO_HIGHLIGHT_STYLE}
                fallback={DEFAULT_HERO_HIGHLIGHT_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, heroHighlightStyle: v }))}
                previewText={(draft.heroHeadlineLine1.match(/\*\*([^*\n|]+?)(?:\|[^*\n]*)?\*\*/)?.[1]) || draft.heroHighlight || "Highlight"}
              />
              {draft.heroHighlight && !draft.heroHeadlineLine1.includes("**") && (
                <div className="rounded-lg p-3 text-[11px] text-amber-300/70 flex items-start gap-3" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)" }}>
                  <div className="flex-1">
                    <strong className="text-amber-300">Legacy fields active:</strong> "Highlighted word" (<span className="text-amber-200">{draft.heroHighlight}</span>) + "Line 2" (<span className="text-amber-200">{draft.heroHeadlineLine2}</span>) abhi alag fields se aa rahe hain. Hero Title mein chip click karo, ya yahan se Clear karo.
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraft(d => ({ ...d, heroHighlight: "", heroHeadlineLine2: "" }))}
                    className="text-[10px] font-bold uppercase tracking-wider text-amber-200 hover:text-white px-2.5 py-1 rounded shrink-0 transition-colors"
                    style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.4)" }}
                  >
                    Clear
                  </button>
                </div>
              )}
              {!draft.heroHeadlineLine1.includes("**") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Highlighted word (legacy)" value={draft.heroHighlight}
                         onChange={(v) => setDraft((d) => ({ ...d, heroHighlight: v }))} />
                  <Field label="Headline — line 2 (legacy)" value={draft.heroHeadlineLine2}
                         onChange={(v) => setDraft((d) => ({ ...d, heroHeadlineLine2: v }))} />
                </div>
              )}
            </FieldGroup>

            <FieldGroup legend="Description">
              <Field label="Description paragraph" multiline value={draft.heroDescription}
                     onChange={(v) => setDraft((d) => ({ ...d, heroDescription: v }))} />
              <TextStyleEditor
                label="Typography — description"
                value={draft.heroDescriptionStyle ?? DEFAULT_HERO_DESCRIPTION_STYLE}
                fallback={DEFAULT_HERO_DESCRIPTION_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, heroDescriptionStyle: v }))}
                previewText={draft.heroDescription}
              />
            </FieldGroup>

            <FieldGroup legend="Buttons">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Primary button label" value={draft.heroCtaPrimaryLabel}
                       onChange={(v) => setDraft((d) => ({ ...d, heroCtaPrimaryLabel: v }))} />
                <Field label="Primary button URL" value={draft.heroCtaPrimaryUrl}
                       onChange={(v) => setDraft((d) => ({ ...d, heroCtaPrimaryUrl: v }))}
                       placeholder="/contact" />
                <Field label="Secondary button label" value={draft.heroCtaSecondaryLabel}
                       onChange={(v) => setDraft((d) => ({ ...d, heroCtaSecondaryLabel: v }))} />
                <Field label="Secondary button URL" value={draft.heroCtaSecondaryUrl}
                       onChange={(v) => setDraft((d) => ({ ...d, heroCtaSecondaryUrl: v }))}
                       placeholder="/portfolio" />
              </div>
            </FieldGroup>
          </SectionPanel>
        )}

        {activeTab === "stats" && (
          <SectionPanel title={`Stats Strip · ${draft.stats.length}`} subtitle="Four big numbers shown just below the hero." icon={Award}>
            <div className="space-y-3">
              {draft.stats.map((stat, i) => (
                <div
                  key={`${stat.label}-${i}`}
                  className="rounded-xl p-3 space-y-3"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center gap-3">
                    <ReorderCol up={() => moveStat(i, -1)} down={() => moveStat(i, 1)}
                                disableUp={i === 0} disableDown={i === draft.stats.length - 1} />
                    <span className="text-white/30 text-[10px] font-mono tracking-wider uppercase shrink-0">
                      0{i + 1}
                    </span>
                    <span className="flex-1 text-white text-sm font-semibold truncate">{stat.label}</span>
                    <DeleteBtn onClick={() => removeStat(i)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Field label="Value" value={stat.value} onChange={(v) => updateStat(i, { value: v })} placeholder="150+" />
                    <Field label="Label" value={stat.label} onChange={(v) => updateStat(i, { label: v })} placeholder="Projects Delivered" />
                    <IconSelect label="Icon" value={stat.iconKey} onChange={(v) => updateStat(i, { iconKey: v })} />
                  </div>
                </div>
              ))}
            </div>
            <AddBtn onClick={addStat} label="Add stat" />
            <FieldGroup legend="Typography">
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
          </SectionPanel>
        )}

        {activeTab === "services" && (
          <SectionPanel title={`Service Cards · ${draft.services.length}`} subtitle="The expanding horizontal card grid. Edits here also flow to the home page." icon={Layers}>
            <FieldGroup legend="Section heading">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={'Section title (e.g. "Our")'} value={draft.servicesSectionTitle}
                       onChange={(v) => setDraft((d) => ({ ...d, servicesSectionTitle: v }))} />
                <Field label={'Section highlight (e.g. "Services")'} value={draft.servicesSectionHighlight}
                       onChange={(v) => setDraft((d) => ({ ...d, servicesSectionHighlight: v }))} />
              </div>
              <TextStyleEditor
                label="Typography — section title"
                value={draft.servicesSectionTitleStyle ?? DEFAULT_SERVICES_SECTION_TITLE_STYLE}
                fallback={DEFAULT_SERVICES_SECTION_TITLE_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, servicesSectionTitleStyle: v }))}
                previewText={`${draft.servicesSectionTitle} ${draft.servicesSectionHighlight}`.trim()}
              />
            </FieldGroup>

            <div className="space-y-3">
              {draft.services.map((svc, i) => (
                <div
                  key={svc.id}
                  className="rounded-xl p-3 space-y-3"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center gap-3">
                    <ReorderCol up={() => moveService(svc.id, -1)} down={() => moveService(svc.id, 1)}
                                disableUp={i === 0} disableDown={i === draft.services.length - 1} />
                    <div
                      className="w-10 h-10 rounded-lg shrink-0"
                      style={{ background: svc.color, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{svc.full}</p>
                      <p className="text-white/40 text-xs truncate font-mono">{svc.id}</p>
                    </div>
                    <DeleteBtn onClick={() => removeService(svc.id)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Field label="Slug (id — used in URLs)" value={svc.id}
                           onChange={(v) => updateService(svc.id, { id: v })} />
                    <Field label={'Short title (e.g. "SEO")'} value={svc.title}
                           onChange={(v) => updateService(svc.id, { title: v })} />
                    <Field label="Full name" value={svc.full}
                           onChange={(v) => updateService(svc.id, { full: v })} />
                  </div>
                  <Field label="Description" multiline value={svc.desc}
                         onChange={(v) => updateService(svc.id, { desc: v })} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <IconSelect label="Icon (preset)" value={svc.iconKey} onChange={(v) => updateService(svc.id, { iconKey: v })} />
                    <ColorField label="Accent color" value={svc.color} onChange={(v) => updateService(svc.id, { color: v })} />
                  </div>
                  <ImageField
                    label="Custom logo / icon image (optional — overrides preset icon when set)"
                    value={svc.iconImageUrl ?? ""}
                    onChange={(v) => updateService(svc.id, { iconImageUrl: v })}
                    folder="service-icons"
                    placeholder="Upload a logo or paste a URL; leave blank to use the preset icon above"
                    previewHeight="h-24"
                    hint="Transparent PNG/SVG works best. When set, the custom image replaces the preset icon on both the home grid and the services page."
                  />
                  <ImageField
                    label="Hero / backdrop image (shown faded behind the card content)"
                    value={svc.imageUrl ?? ""}
                    onChange={(v) => updateService(svc.id, { imageUrl: v })}
                    folder="service-images"
                    placeholder="Upload a photo or paste a URL — used as the card's background image on hover"
                    previewHeight="h-40"
                    hint="Wide landscape photos (16:9) work best. The image is darkened with an overlay so text stays readable."
                  />

                  <div className="pt-4 mt-4 border-t border-white/10 space-y-4">
                    <div className="flex items-center gap-2 text-[#837FFB] mb-2">
                      <Layers className="w-4 h-4" />
                      <h4 className="text-sm font-bold uppercase tracking-widest">Detail Page Content</h4>
                    </div>
                    <Field 
                      label="Overview Paragraph" 
                      multiline 
                      value={svc.overview || ""} 
                      onChange={(v) => updateService(svc.id, { overview: v })} 
                      placeholder="Detailed explanation of the service..."
                    />
                    
                    <div>
                      <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Stats (e.g. 150+ Websites Delivered)</label>
                      <div className="space-y-2">
                        {(svc.stats || []).map((stat, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => {
                                const newStats = [...(svc.stats || [])];
                                newStats[sIdx] = { ...stat, value: e.target.value };
                                updateService(svc.id, { stats: newStats });
                              }}
                              placeholder="Value (e.g. 150+)"
                              className="w-1/3 px-3 py-2 rounded-lg bg-white/5 text-white text-sm outline-none focus:ring-2 focus:ring-[#837FFB]/40 border border-white/10"
                            />
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const newStats = [...(svc.stats || [])];
                                newStats[sIdx] = { ...stat, label: e.target.value };
                                updateService(svc.id, { stats: newStats });
                              }}
                              placeholder="Label (e.g. Projects Delivered)"
                              className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-white text-sm outline-none focus:ring-2 focus:ring-[#837FFB]/40 border border-white/10"
                            />
                            <button
                              onClick={() => {
                                const newStats = (svc.stats || []).filter((_, i) => i !== sIdx);
                                updateService(svc.id, { stats: newStats });
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            updateService(svc.id, { stats: [...(svc.stats || []), { value: "New", label: "Stat" }] });
                          }}
                          className="text-xs font-bold text-[#837FFB] hover:text-white transition-colors"
                        >
                          + Add Stat
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Features</label>
                      <div className="space-y-2">
                        {(svc.features || []).map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2">
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={feature.title}
                                onChange={(e) => {
                                  const newFeatures = [...(svc.features || [])];
                                  newFeatures[fIdx] = { ...feature, title: e.target.value };
                                  updateService(svc.id, { features: newFeatures });
                                }}
                                placeholder="Feature Title"
                                className="w-full px-3 py-2 rounded-lg bg-white/5 text-white text-sm outline-none focus:ring-2 focus:ring-[#837FFB]/40 border border-white/10"
                              />
                              <input
                                type="text"
                                value={feature.desc}
                                onChange={(e) => {
                                  const newFeatures = [...(svc.features || [])];
                                  newFeatures[fIdx] = { ...feature, desc: e.target.value };
                                  updateService(svc.id, { features: newFeatures });
                                }}
                                placeholder="Feature Description"
                                className="w-full px-3 py-2 rounded-lg bg-white/5 text-white text-sm outline-none focus:ring-2 focus:ring-[#837FFB]/40 border border-white/10"
                              />
                            </div>
                            <button
                              onClick={() => {
                                const newFeatures = (svc.features || []).filter((_, i) => i !== fIdx);
                                updateService(svc.id, { features: newFeatures });
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 mt-1 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            updateService(svc.id, { features: [...(svc.features || []), { title: "New Feature", desc: "Feature description" }] });
                          }}
                          className="text-xs font-bold text-[#837FFB] hover:text-white transition-colors"
                        >
                          + Add Feature
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <AddBtn onClick={addService} label="Add service" />
            <FieldGroup legend="Typography">
              <TextStyleEditor
                label="Card title"
                value={draft.serviceCardTitleStyle ?? DEFAULT_SERVICE_CARD_TITLE_STYLE}
                fallback={DEFAULT_SERVICE_CARD_TITLE_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, serviceCardTitleStyle: v }))}
                previewText={draft.services[0]?.full}
              />
              <TextStyleEditor
                label="Card description"
                value={draft.serviceCardDescStyle ?? DEFAULT_SERVICE_CARD_DESC_STYLE}
                fallback={DEFAULT_SERVICE_CARD_DESC_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, serviceCardDescStyle: v }))}
                previewText={draft.services[0]?.desc}
              />
            </FieldGroup>
          </SectionPanel>
        )}

        {activeTab === "approach" && (
          <SectionPanel title={`Our Approach · ${draft.approach.length}`} subtitle="The 4-phase playbook + shared typography for Approach / Deliverables / Industries headings." icon={Workflow}>
            <FieldGroup legend="Section copy">
              <Field label="Kicker" value={draft.approachKicker}
                     onChange={(v) => setDraft((d) => ({ ...d, approachKicker: v }))} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Heading — before highlight" value={draft.approachHeadingBefore}
                       onChange={(v) => setDraft((d) => ({ ...d, approachHeadingBefore: v }))} />
                <Field label="Highlighted word" value={draft.approachHighlight}
                       onChange={(v) => setDraft((d) => ({ ...d, approachHighlight: v }))} />
                <Field label="Heading — after highlight" value={draft.approachHeadingAfter}
                       onChange={(v) => setDraft((d) => ({ ...d, approachHeadingAfter: v }))} />
              </div>
              <Field label="Description" multiline value={draft.approachDescription}
                     onChange={(v) => setDraft((d) => ({ ...d, approachDescription: v }))} />
            </FieldGroup>

            <div className="space-y-3">
              {draft.approach.map((phase, i) => (
                <div
                  key={`${phase.step}-${i}`}
                  className="rounded-xl p-3 space-y-3"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center gap-3">
                    <ReorderCol up={() => movePhase(i, -1)} down={() => movePhase(i, 1)}
                                disableUp={i === 0} disableDown={i === draft.approach.length - 1} />
                    <div
                      className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold text-white"
                      style={{ background: phase.base, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)" }}
                    >
                      {phase.step}
                    </div>
                    <span className="flex-1 text-white text-sm font-semibold truncate">{phase.title}</span>
                    <DeleteBtn onClick={() => removePhase(i)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Field label={'Step number (e.g. "01")'} value={phase.step}
                           onChange={(v) => updatePhase(i, { step: v })} />
                    <Field label="Title" value={phase.title}
                           onChange={(v) => updatePhase(i, { title: v })} />
                    <IconSelect label="Icon" value={phase.iconKey} onChange={(v) => updatePhase(i, { iconKey: v })} />
                  </div>
                  <Field label="Description" multiline value={phase.desc}
                         onChange={(v) => updatePhase(i, { desc: v })} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <ColorField label="Base color" value={phase.base} onChange={(v) => updatePhase(i, { base: v })} />
                    <ColorField label="Accent (revealed on hover)" value={phase.accent} onChange={(v) => updatePhase(i, { accent: v })} />
                  </div>
                </div>
              ))}
            </div>
            <AddBtn onClick={addPhase} label="Add phase" />

            <FieldGroup legend="Shared section typography (Approach, Deliverables, Industries)">
              <TextStyleEditor
                label="Kicker (small uppercase label)"
                value={draft.sectionKickerStyle ?? DEFAULT_SECTION_KICKER_STYLE}
                fallback={DEFAULT_SECTION_KICKER_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, sectionKickerStyle: v }))}
                previewText={draft.approachKicker}
              />
              <TextStyleEditor
                label="Section heading"
                value={draft.sectionHeadingStyle ?? DEFAULT_SECTION_HEADING_STYLE}
                fallback={DEFAULT_SECTION_HEADING_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, sectionHeadingStyle: v }))}
                previewText={`${draft.approachHeadingBefore}${draft.approachHeadingAfter}`.trim() || draft.deliverablesHeading}
              />
              <TextStyleEditor
                label="Section highlight"
                value={draft.sectionHighlightStyle ?? DEFAULT_SECTION_HIGHLIGHT_STYLE}
                fallback={DEFAULT_SECTION_HIGHLIGHT_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, sectionHighlightStyle: v }))}
                previewText={draft.approachHighlight}
              />
              <TextStyleEditor
                label="Section description"
                value={draft.sectionDescriptionStyle ?? DEFAULT_SECTION_DESCRIPTION_STYLE}
                fallback={DEFAULT_SECTION_DESCRIPTION_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, sectionDescriptionStyle: v }))}
                previewText={draft.approachDescription}
              />
              <TextStyleEditor
                label="Phase title"
                value={draft.phaseTitleStyle ?? DEFAULT_PHASE_TITLE_STYLE}
                fallback={DEFAULT_PHASE_TITLE_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, phaseTitleStyle: v }))}
                previewText={draft.approach[0]?.title}
              />
              <TextStyleEditor
                label="Phase description"
                value={draft.phaseDescStyle ?? DEFAULT_PHASE_DESC_STYLE}
                fallback={DEFAULT_PHASE_DESC_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, phaseDescStyle: v }))}
                previewText={draft.approach[0]?.desc}
              />
            </FieldGroup>
          </SectionPanel>
        )}

        {activeTab === "deliverables" && (
          <SectionPanel title={`Deliverables · ${draft.deliverables.length}`} subtitle='"What you get" checklist shown on the services page.' icon={CheckSquare}>
            <FieldGroup legend="Section copy">
              <Field label="Kicker" value={draft.deliverablesKicker}
                     onChange={(v) => setDraft((d) => ({ ...d, deliverablesKicker: v }))} />
              <Field label="Heading" value={draft.deliverablesHeading}
                     onChange={(v) => setDraft((d) => ({ ...d, deliverablesHeading: v }))} />
            </FieldGroup>

            <div className="space-y-2">
              {draft.deliverables.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl p-2"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <ReorderCol up={() => moveDeliverable(i, -1)} down={() => moveDeliverable(i, 1)}
                              disableUp={i === 0} disableDown={i === draft.deliverables.length - 1} />
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateDeliverable(i, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 text-white text-sm outline-none focus:ring-2 focus:ring-[#837FFB]/40"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                    />
                  </div>
                  <DeleteBtn onClick={() => removeDeliverable(i)} />
                </div>
              ))}
            </div>
            <AddBtn onClick={addDeliverable} label="Add deliverable" />

            <FieldGroup legend="Typography">
              <TextStyleEditor
                label="Deliverable item"
                value={draft.deliverableItemStyle ?? DEFAULT_DELIVERABLE_ITEM_STYLE}
                fallback={DEFAULT_DELIVERABLE_ITEM_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, deliverableItemStyle: v }))}
                previewText={draft.deliverables[0]}
              />
            </FieldGroup>
          </SectionPanel>
        )}

        {activeTab === "industries" && (
          <SectionPanel title={`Industries · ${draft.industries.length}`} subtitle="Right-side 3D card listing sectors you serve." icon={Globe2}>
            <FieldGroup legend="Card copy">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Card label" value={draft.industriesLabel}
                       onChange={(v) => setDraft((d) => ({ ...d, industriesLabel: v }))} />
                <Field label="Card title" value={draft.industriesTitle}
                       onChange={(v) => setDraft((d) => ({ ...d, industriesTitle: v }))} />
              </div>
              <Field label="Description" multiline value={draft.industriesDescription}
                     onChange={(v) => setDraft((d) => ({ ...d, industriesDescription: v }))} />
            </FieldGroup>

            <div className="space-y-2">
              {draft.industries.map((ind, i) => (
                <div
                  key={`${ind.name}-${i}`}
                  className="flex items-center gap-3 rounded-xl p-2"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <ReorderCol up={() => moveIndustry(i, -1)} down={() => moveIndustry(i, 1)}
                              disableUp={i === 0} disableDown={i === draft.industries.length - 1} />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={ind.name}
                      onChange={(e) => updateIndustry(i, { name: e.target.value })}
                      className="px-3 py-2 rounded-lg bg-white/5 text-white text-sm outline-none focus:ring-2 focus:ring-[#837FFB]/40"
                      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                      placeholder="Industry name"
                    />
                    <ColorField label="" value={ind.color} onChange={(v) => updateIndustry(i, { color: v })} />
                  </div>
                  <DeleteBtn onClick={() => removeIndustry(i)} />
                </div>
              ))}
            </div>
            <AddBtn onClick={addIndustry} label="Add industry" />

            <FieldGroup legend="CTA & typography">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="CTA label" value={draft.industriesCtaLabel}
                       onChange={(v) => setDraft((d) => ({ ...d, industriesCtaLabel: v }))} />
                <Field label="CTA URL" value={draft.industriesCtaUrl}
                       onChange={(v) => setDraft((d) => ({ ...d, industriesCtaUrl: v }))} placeholder="/industries" />
              </div>
              <TextStyleEditor
                label="Typography — industry pill"
                value={draft.industryPillStyle ?? DEFAULT_INDUSTRY_PILL_STYLE}
                fallback={DEFAULT_INDUSTRY_PILL_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, industryPillStyle: v }))}
                previewText={draft.industries[0]?.name}
              />
            </FieldGroup>
          </SectionPanel>
        )}

        {activeTab === "featured" && (
          <SectionPanel title={`Featured · ${draft.featured.length}`} subtitle="Hover-flip cards shown above the closing CTA — image + title on front, long description + button on back." icon={Zap}>
            <FieldGroup legend="Section copy">
              <Field label="Kicker" value={draft.featuredKicker}
                     onChange={(v) => setDraft((d) => ({ ...d, featuredKicker: v }))} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Heading — before highlight" value={draft.featuredHeadingBefore}
                       onChange={(v) => setDraft((d) => ({ ...d, featuredHeadingBefore: v }))} />
                <Field label="Highlighted word" value={draft.featuredHighlight}
                       onChange={(v) => setDraft((d) => ({ ...d, featuredHighlight: v }))} />
                <Field label="Heading — after highlight" value={draft.featuredHeadingAfter}
                       onChange={(v) => setDraft((d) => ({ ...d, featuredHeadingAfter: v }))} />
              </div>
              <p className="text-[11px] text-white/35 leading-relaxed">
                This section only renders when there is at least one card. Remove all cards to hide it.
              </p>
            </FieldGroup>

            <div className="space-y-3">
              {draft.featured.map((card, i) => (
                <div
                  key={card.id}
                  className="rounded-xl p-3 space-y-3"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center gap-3">
                    <ReorderCol up={() => moveFeatured(card.id, -1)} down={() => moveFeatured(card.id, 1)}
                                disableUp={i === 0} disableDown={i === draft.featured.length - 1} />
                    <div
                      className="w-10 h-10 rounded-lg shrink-0 overflow-hidden"
                      style={{ background: "#0F0D26", border: "1px solid rgba(131,127,251,0.25)" }}
                    >
                      {card.imageSrc && (
                        <img src={card.imageSrc} alt="" className="w-full h-full object-cover"
                             onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      )}
                    </div>
                    <span className="flex-1 text-white text-sm font-semibold truncate">
                      {card.title || <span className="text-white/40">Untitled</span>}
                    </span>
                    <span className="text-white/30 text-[10px] font-mono uppercase tracking-wider shrink-0">
                      0{i + 1}
                    </span>
                    <DeleteBtn onClick={() => removeFeatured(card.id)} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field label="Title" value={card.title}
                           onChange={(v) => updateFeatured(card.id, { title: v })} />
                    <Field label="Image alt text" value={card.imageAlt}
                           onChange={(v) => updateFeatured(card.id, { imageAlt: v })} />
                  </div>
                  <ImageField
                    label="Front image"
                    value={card.imageSrc}
                    onChange={(v) => updateFeatured(card.id, { imageSrc: v })}
                    folder="featured"
                    placeholder="https://images.unsplash.com/... or upload"
                    previewHeight="h-32"
                  />
                  <Field label="Front description" multiline value={card.frontDesc}
                         onChange={(v) => updateFeatured(card.id, { frontDesc: v })} />
                  <Field label="Back description (shown on hover flip)" multiline value={card.backDesc}
                         onChange={(v) => updateFeatured(card.id, { backDesc: v })} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field label="Button text" value={card.buttonText}
                           onChange={(v) => updateFeatured(card.id, { buttonText: v })} />
                    <Field label="Button URL" value={card.buttonUrl}
                           onChange={(v) => updateFeatured(card.id, { buttonUrl: v })}
                           placeholder="/portfolio" />
                  </div>
                </div>
              ))}
            </div>
            <AddBtn onClick={addFeatured} label="Add featured card" />

            <FieldGroup legend="Typography">
              <TextStyleEditor
                label="Card title"
                value={draft.featuredCardTitleStyle ?? DEFAULT_FEATURED_CARD_TITLE_STYLE}
                fallback={DEFAULT_FEATURED_CARD_TITLE_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, featuredCardTitleStyle: v }))}
                previewText={draft.featured[0]?.title}
              />
              <TextStyleEditor
                label="Card description"
                value={draft.featuredCardDescStyle ?? DEFAULT_FEATURED_CARD_DESC_STYLE}
                fallback={DEFAULT_FEATURED_CARD_DESC_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, featuredCardDescStyle: v }))}
                previewText={draft.featured[0]?.frontDesc}
              />
            </FieldGroup>
          </SectionPanel>
        )}

        {activeTab === "testimonial" && (
          <SectionPanel title="Testimonial" subtitle="The scroll-scrubbed quote rendered between sections." icon={Quote}>
            <FieldGroup legend="Quote">
              <Field label="Quote (no surrounding quotes needed)" multiline value={draft.testimonialQuote}
                     onChange={(v) => setDraft((d) => ({ ...d, testimonialQuote: v }))} />
              <TextStyleEditor
                label="Typography — quote"
                value={draft.testimonialQuoteStyle ?? DEFAULT_TESTIMONIAL_QUOTE_STYLE}
                fallback={DEFAULT_TESTIMONIAL_QUOTE_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, testimonialQuoteStyle: v }))}
                previewText={draft.testimonialQuote}
              />
            </FieldGroup>
          </SectionPanel>
        )}

        {activeTab === "cta" && (
          <SectionPanel title="Closing CTA" subtitle="The call-to-action card at the bottom of the services page." icon={Rocket}>
            <FieldGroup legend="Heading">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field label="Heading — before highlight" value={draft.ctaHeadingBefore}
                       onChange={(v) => setDraft((d) => ({ ...d, ctaHeadingBefore: v }))} />
                <Field label="Highlighted word" value={draft.ctaHighlight}
                       onChange={(v) => setDraft((d) => ({ ...d, ctaHighlight: v }))} />
                <Field label="Heading — after highlight" value={draft.ctaHeadingAfter}
                       onChange={(v) => setDraft((d) => ({ ...d, ctaHeadingAfter: v }))} />
              </div>
              <Field label="Description" multiline value={draft.ctaDescription}
                     onChange={(v) => setDraft((d) => ({ ...d, ctaDescription: v }))} />
            </FieldGroup>

            <FieldGroup legend="Buttons">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Primary button label" value={draft.ctaPrimaryLabel}
                       onChange={(v) => setDraft((d) => ({ ...d, ctaPrimaryLabel: v }))} />
                <Field label="Primary button URL" value={draft.ctaPrimaryUrl}
                       onChange={(v) => setDraft((d) => ({ ...d, ctaPrimaryUrl: v }))} placeholder="/contact" />
                <Field label="Secondary button label" value={draft.ctaSecondaryLabel}
                       onChange={(v) => setDraft((d) => ({ ...d, ctaSecondaryLabel: v }))} />
                <Field label="Secondary button URL" value={draft.ctaSecondaryUrl}
                       onChange={(v) => setDraft((d) => ({ ...d, ctaSecondaryUrl: v }))} placeholder="/process" />
              </div>
            </FieldGroup>

            <FieldGroup legend="Typography">
              <TextStyleEditor
                label="CTA heading"
                value={draft.ctaHeadingStyle ?? DEFAULT_CTA_HEADING_STYLE}
                fallback={DEFAULT_CTA_HEADING_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, ctaHeadingStyle: v }))}
                previewText={`${draft.ctaHeadingBefore}${draft.ctaHeadingAfter}`.trim()}
              />
              <TextStyleEditor
                label="CTA highlight"
                value={draft.ctaHighlightStyle ?? DEFAULT_CTA_HIGHLIGHT_STYLE}
                fallback={DEFAULT_CTA_HIGHLIGHT_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, ctaHighlightStyle: v }))}
                previewText={draft.ctaHighlight}
              />
              <TextStyleEditor
                label="CTA description"
                value={draft.ctaDescriptionStyle ?? DEFAULT_CTA_DESCRIPTION_STYLE}
                fallback={DEFAULT_CTA_DESCRIPTION_STYLE}
                onChange={(v) => setDraft((d) => ({ ...d, ctaDescriptionStyle: v }))}
                previewText={draft.ctaDescription}
              />
            </FieldGroup>
          </SectionPanel>
        )}

          </div>
        </div>

        {/* Footer publish CTA */}
        <div
          className="mt-10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(131,127,251,0.1), rgba(91,87,245,0.04))",
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
              to="/services"
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white/80 transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
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
  saving, saved, dirty, onSave, onReset, tabLabel, tabIndex, tabTotal,
}: {
  saving: boolean;
  saved: boolean;
  dirty: boolean;
  onSave: () => void;
  onReset: () => void;
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
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
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
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/50 hover:text-white text-xs transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset to Defaults</span>
          </button>
          <span className="w-px h-4 bg-white/10" />
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
        <span className="block h-px w-6" style={{ background: "linear-gradient(90deg, #837FFB, transparent)" }} />
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/60">
          {legend}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ────────────────────────────── Field / ColorField / ReorderCol / DeleteBtn / AddBtn ────────────────────────────── */

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
      {label && (
        <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 mb-1.5">
          {label}
        </span>
      )}
      {multiline ? <textarea {...common} rows={3} /> : <input type="text" {...common} />}
    </label>
  );
}

function ColorField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 mb-1.5">
          {label}
        </span>
      )}
      <div
        className="flex items-center gap-2 rounded-lg px-2 py-1.5"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <input
          type="color"
          value={normalizeHex(value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
          style={{ appearance: "none" }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 bg-transparent text-white text-sm outline-none font-mono"
          placeholder="#837FFB"
        />
      </div>
    </label>
  );
}

function ReorderCol({
  up, down, disableUp, disableDown,
}: { up: () => void; down: () => void; disableUp: boolean; disableDown: boolean }) {
  return (
    <div className="flex flex-col shrink-0">
      <button type="button" onClick={up} disabled={disableUp}
              className="p-0.5 rounded text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-25 disabled:cursor-not-allowed"
              title="Move up">
        <ChevronUp className="w-4 h-4" />
      </button>
      <button type="button" onClick={down} disabled={disableDown}
              className="p-0.5 rounded text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-25 disabled:cursor-not-allowed"
              title="Move down">
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  );
}

function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
            title="Remove">
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white transition-colors"
            style={{ background: "rgba(131,127,251,0.05)", border: "1px dashed rgba(131,127,251,0.3)" }}>
      <Plus className="w-4 h-4" /> {label}
    </button>
  );
}

function normalizeHex(v: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    const r = v[1], g = v[2], b = v[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#837FFB";
}
