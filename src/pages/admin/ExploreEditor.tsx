import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Check,
  AlertCircle,
  Type,
  LayoutGrid,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Eye,
  ExternalLink,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useContent, saveContent } from "@/lib/use-content";
import {
  EXPLORE_CONTENT_KEY,
  defaultExploreContent,
  type ExploreContent,
  type ExploreCard,
  DEFAULT_HEADING_STYLE,
  DEFAULT_HIGHLIGHT_STYLE,
  DEFAULT_CARD_TITLE_STYLE,
  DEFAULT_CARD_SUMMARY_STYLE,
} from "@/content/explore";
import TextStyleEditor from "@/components/admin/TextStyleEditor";
import ImageField from "@/components/admin/ImageField";
import WordHighlightPicker from "@/components/admin/WordHighlightPicker";

/* Tab registry — sidebar nav and content rendering both reference this. */
const TABS = [
  { id: "section-heading", label: "Section Heading", icon: Type,       hint: "Kicker + 3-part heading" },
  { id: "cards",           label: "Gallery Cards",   icon: LayoutGrid, hint: "Reorder & edit top 6 cards" },
  { id: "pillars",         label: "Pillars List",    icon: LayoutGrid, hint: "Edit alternating rows below" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function ExploreEditor() {
  const { data, loading } = useContent<ExploreContent>(EXPLORE_CONTENT_KEY, defaultExploreContent);
  const [draft, setDraft] = useState<ExploreContent>(defaultExploreContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>(TABS[0].id);

  const dirty = JSON.stringify(draft) !== JSON.stringify(data);

  useEffect(() => {
    if (!loading) setDraft(data);
  }, [loading, data]);

  const onSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await saveContent<ExploreContent>(EXPLORE_CONTENT_KEY, draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const updateCard = (id: string, patch: Partial<ExploreCard>) =>
    setDraft((d) => ({ ...d, cards: d.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));

  const moveCard = (id: string, dir: -1 | 1) =>
    setDraft((d) => {
      const idx = d.cards.findIndex((c) => c.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= d.cards.length) return d;
      const next = [...d.cards];
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...d, cards: next };
    });

  const resetCard = (id: string) => {
    const original = defaultExploreContent.cards.find((c) => c.id === id);
    if (!original) return;
    updateCard(id, original);
  };

  const addCard = () => {
    const nextId = `card-${Date.now()}`;
    setDraft(d => ({
      ...d,
      cards: [...d.cards, {
        id: nextId,
        eyebrow: "VIEW DETAILS",
        title: "New Panel",
        summary: "Description of this new panel...",
        badge: "NEW",
        url: "/services",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
        accent: "#837FFB",
        tint: "#0D0B24"
      }]
    }));
    setExpandedId(nextId);
  };

  const removeCard = (id: string) => {
    setDraft(d => ({
      ...d,
      cards: d.cards.filter(c => c.id !== id)
    }));
    if (expandedId === id) setExpandedId(null);
  };

  /* Pillar Cards (Bottom alternating section) */
  const updatePillar = (id: string, patch: Partial<ExploreCard>) =>
    setDraft((d) => ({ ...d, pillarCards: (d.pillarCards || []).map((c) => (c.id === id ? { ...c, ...patch } : c)) }));

  const movePillar = (id: string, dir: -1 | 1) =>
    setDraft((d) => {
      const pillars = d.pillarCards || [];
      const idx = pillars.findIndex((c) => c.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= pillars.length) return d;
      const next = [...pillars];
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...d, pillarCards: next };
    });

  const resetPillar = (id: string) => {
    const original = defaultExploreContent.pillarCards.find((c) => c.id === id);
    if (!original) return;
    updatePillar(id, original);
  };

  const addPillar = () => {
    const nextId = `pillar-${Date.now()}`;
    setDraft(d => ({
      ...d,
      pillarCards: [...(d.pillarCards || []), {
        id: nextId,
        eyebrow: "VIEW DETAILS",
        title: "New Pillar",
        summary: "Description...",
        badge: "NEW",
        url: "/services",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
        accent: "#837FFB",
        tint: "#0D0B24"
      }]
    }));
    setExpandedId(nextId);
  };

  const removePillar = (id: string) => {
    setDraft(d => ({
      ...d,
      pillarCards: (d.pillarCards || []).filter(c => c.id !== id)
    }));
    if (expandedId === id) setExpandedId(null);
  };

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
        sectionLabel={TABS[activeIndex]?.label ?? ""}
        sectionIndex={activeIndex + 1}
        sectionTotal={TABS.length}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-white/40">
            <Link to="/admin" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#837FFB]">Explore Dgion</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Home Page — Explore Dgion</h1>
          <p className="text-white/45 text-sm mt-2 max-w-xl">
            The stacked 6-card scroll section below the hero. Reorder cards, edit
            copy, swap images, or tweak typography.
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
            {activeTab === "section-heading" && (
            <SectionCard
              id="section-heading"
              index={1}
              total={TABS.length}
              title="Section Heading"
              subtitle="Small kicker label plus the 3-part heading that intros the card stack."
              icon={Type}
            >
              <FieldGroup legend="Copy">
                <Field
                  label="Kicker (small uppercase label)"
                  value={draft.kicker}
                  onChange={(v) => setDraft((d) => ({ ...d, kicker: v }))}
                />
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3 items-start">
                  <Field
                    label="Hero Heading (use line breaks + **word** markup for highlights)"
                    multiline
                    value={draft.headingBefore}
                    onChange={(v) => setDraft((d) => ({ ...d, headingBefore: v }))}
                  />
                  <WordHighlightPicker
                    value={draft.headingBefore}
                    onChange={(v: string) => setDraft((d) => ({ ...d, headingBefore: v }))}
                    baseStyle={draft.headingStyle ?? DEFAULT_HEADING_STYLE}
                    highlightStyle={draft.highlightStyle ?? DEFAULT_HIGHLIGHT_STYLE}
                  />
                </div>
                {(draft.headingHighlight || draft.headingAfter) && !draft.headingBefore.includes("**") && (
                  <div className="rounded-lg p-3 text-[11px] text-amber-300/70" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.2)" }}>
                    <strong className="text-amber-300">Legacy fields active:</strong> "Highlighted word" ({draft.headingHighlight}) + "After-highlight" ({draft.headingAfter}) abhi alag fields se aa rahe hain. Naya word picker use karne ke liye Hero Heading mein woh word ka chip click karein — legacy fields auto unused ho jayenge.
                  </div>
                )}
                {!draft.headingBefore.includes("**") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Highlighted word (legacy)"
                      value={draft.headingHighlight}
                      onChange={(v) => setDraft((d) => ({ ...d, headingHighlight: v }))}
                    />
                    <Field
                      label="Heading — after highlight (legacy)"
                      value={draft.headingAfter}
                      onChange={(v) => setDraft((d) => ({ ...d, headingAfter: v }))}
                    />
                  </div>
                )}
                <p className="text-[11px] text-white/35 leading-relaxed">
                  Tip: include leading/trailing spaces inside each piece (e.g.
                  "Everything you " ending with a space) so the rendered heading
                  has proper word gaps around the highlight.
                </p>
              </FieldGroup>

              <FieldGroup legend="Typography">
                <TextStyleEditor
                  label="Plain heading"
                  value={draft.headingStyle ?? DEFAULT_HEADING_STYLE}
                  fallback={DEFAULT_HEADING_STYLE}
                  onChange={(v) => setDraft((d) => ({ ...d, headingStyle: v }))}
                  previewText={(draft.headingBefore.split("\n")[0] || "Heading").replace(/\*\*([^*\n]+?)(?:\|[^*\n]*)?\*\*/g, "$1")}
                />
                <TextStyleEditor
                  label="Highlighted word"
                  value={draft.highlightStyle ?? DEFAULT_HIGHLIGHT_STYLE}
                  fallback={DEFAULT_HIGHLIGHT_STYLE}
                  onChange={(v) => setDraft((d) => ({ ...d, highlightStyle: v }))}
                  previewText={(draft.headingBefore.match(/\*\*([^*\n|]+?)(?:\|[^*\n]*)?\*\*/)?.[1]) || draft.headingHighlight || "Highlight"}
                />
              </FieldGroup>
            </SectionCard>
            )}

            {activeTab === "pillars" && (
            <SectionCard
              id="pillars"
              index={3}
              total={TABS.length}
              title="Pillars Section Heading"
              subtitle="Edit the kicker and main heading for the detailed alternating section below the gallery."
              icon={Type}
            >
              <FieldGroup legend="Introduction">
                <Field
                  label="Kicker (e.g. EXPLORE DGION)"
                  value={draft.detailsKicker}
                  onChange={(v) => setDraft((d) => ({ ...d, detailsKicker: v }))}
                />
              </FieldGroup>

              <FieldGroup legend="Main Heading (3 parts)">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field
                    label="Part 1 (Before Highlight)"
                    value={draft.detailsHeadingBefore}
                    onChange={(v) => setDraft((d) => ({ ...d, detailsHeadingBefore: v }))}
                  />
                  <Field
                    label="Part 2 (Highlighted)"
                    value={draft.detailsHeadingHighlight}
                    onChange={(v) => setDraft((d) => ({ ...d, detailsHeadingHighlight: v }))}
                  />
                  <Field
                    label="Part 3 (After Highlight)"
                    value={draft.detailsHeadingAfter}
                    onChange={(v) => setDraft((d) => ({ ...d, detailsHeadingAfter: v }))}
                  />
                </div>
                <p className="text-[10px] text-white/30 italic">
                  Example: "The Pillars of" + "Excellence" + "" (Part 3 can be empty).
                </p>
              </FieldGroup>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold">Pillar Rows</h3>
                    <p className="text-white/40 text-xs mt-1">Manage the 4 detailed alternating rows below the gallery.</p>
                  </div>
                  <button
                    onClick={addPillar}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#837FFB]/10 border border-[#837FFB]/30 text-[#837FFB] text-xs font-bold uppercase tracking-widest hover:bg-[#837FFB]/20 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>

                <div className="space-y-3">
                  {(draft.pillarCards || []).map((card, i) => {
                    const isOpen = expandedId === card.id;
                    return (
                      <div
                        key={card.id}
                        className="rounded-xl overflow-hidden transition-all"
                        style={{
                          background: "rgba(255,255,255,0.025)",
                          border: `1px solid ${isOpen ? "rgba(131,127,251,0.25)" : "rgba(255,255,255,0.08)"}`,
                        }}
                      >
                        {/* Row header */}
                        <div className="flex items-center gap-3 px-4 py-3.5">
                          {/* Reorder */}
                          <div className="flex flex-col shrink-0">
                            <button
                              type="button"
                              onClick={() => movePillar(card.id, -1)}
                              disabled={i === 0}
                              className="p-0.5 rounded text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-25"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => movePillar(card.id, 1)}
                              disabled={i === (draft.pillarCards?.length ?? 0) - 1}
                              className="p-0.5 rounded text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-25"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          <div
                            className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold tracking-widest"
                            style={{ background: `linear-gradient(135deg, ${card.accent}, ${card.tint})`, color: "#fff" }}
                          >
                            0{i + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{card.title}</p>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">{card.badge}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => resetPillar(card.id)}
                            className="p-2 text-white/40 hover:text-white"
                            title="Reset Row"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          
                          {confirmDeleteId === card.id ? (
                            <div className="flex items-center gap-2">
                              <button onClick={() => { removePillar(card.id); setConfirmDeleteId(null); }} className="p-1.5 rounded bg-red-500 text-white"><Check className="w-3 h-3" /></button>
                              <button onClick={() => setConfirmDeleteId(null)} className="p-1.5 rounded bg-white/10 text-white"><X className="w-3 h-3" /></button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(card.id)}
                              className="p-2 text-white/40 hover:text-red-400"
                              title="Remove Row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setExpandedId(isOpen ? null : card.id)}
                            className="text-[10px] font-bold uppercase tracking-widest text-[#837FFB] hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5"
                          >
                            {isOpen ? "Close" : "Edit"}
                          </button>
                        </div>

                        {/* Expanded editor */}
                        {isOpen && (
                          <div className="px-5 pb-6 pt-4 space-y-5 bg-black/20 border-t border-white/5">
                            <FieldGroup legend="Copy">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Title" value={card.title} onChange={(v) => updatePillar(card.id, { title: v })} />
                                <Field label="Badge" value={card.badge} onChange={(v) => updatePillar(card.id, { badge: v })} />
                              </div>
                              <Field label="Summary" multiline value={card.summary} onChange={(v) => updatePillar(card.id, { summary: v })} />
                            </FieldGroup>
                            <FieldGroup legend="Visual">
                              <ImageField
                                label="Row Image"
                                value={card.image}
                                onChange={(v) => updatePillar(card.id, { image: v })}
                                folder="pillars"
                              />
                            </FieldGroup>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <FieldGroup legend="Typography">
                <TextStyleEditor
                  label="Plain heading"
                  value={draft.detailsHeadingStyle ?? DEFAULT_HEADING_STYLE}
                  fallback={DEFAULT_HEADING_STYLE}
                  onChange={(v) => setDraft((d) => ({ ...d, detailsHeadingStyle: v }))}
                  previewText={draft.detailsHeadingBefore || "The Pillars of"}
                />
                <TextStyleEditor
                  label="Highlighted word"
                  value={draft.detailsHighlightStyle ?? DEFAULT_HIGHLIGHT_STYLE}
                  fallback={DEFAULT_HIGHLIGHT_STYLE}
                  onChange={(v) => setDraft((d) => ({ ...d, detailsHighlightStyle: v }))}
                  previewText={draft.detailsHeadingHighlight || "Excellence"}
                />
              </FieldGroup>
            </SectionCard>
            )}

            {activeTab === "cards" && (
            <SectionCard
              id="cards"
              index={2}
              total={TABS.length}
              title={`Cards · ${draft.cards.length}`}
              subtitle="Reorder cards with the chevrons. Click Edit to open copy, image, colors, and typography."
              icon={LayoutGrid}
            >
              <div className="space-y-3">
                {draft.cards.map((card, i) => {
                  const isOpen = expandedId === card.id;
                  return (
                    <div
                      key={card.id}
                      className="rounded-xl overflow-hidden transition-all"
                      style={{
                        background: "rgba(255,255,255,0.025)",
                        border: `1px solid ${isOpen ? "rgba(131,127,251,0.25)" : "rgba(255,255,255,0.08)"}`,
                        boxShadow: isOpen ? "0 0 32px rgba(131,127,251,0.08)" : undefined,
                      }}
                    >
                      {/* Row header */}
                      <div className="flex items-center gap-3 px-4 py-3.5">
                        {/* Reorder */}
                        <div className="flex flex-col shrink-0">
                          <button
                            type="button"
                            onClick={() => moveCard(card.id, -1)}
                            disabled={i === 0}
                            className="p-0.5 rounded text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-25 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCard(card.id, 1)}
                            disabled={i === draft.cards.length - 1}
                            className="p-0.5 rounded text-white/50 hover:text-white hover:bg-white/5 disabled:opacity-25 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Accent swatch + index */}
                        <div
                          className="w-11 h-11 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold tracking-widest"
                          style={{
                            background: `linear-gradient(135deg, ${card.accent}, ${card.tint})`,
                            color: "#fff",
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
                          }}
                        >
                          0{i + 1}
                        </div>

                        {/* Summary */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">
                            {card.title || <span className="text-white/40">Untitled</span>}
                          </p>
                          <p className="text-white/40 text-xs truncate flex items-center gap-2">
                            <span
                              className="px-1.5 py-0.5 rounded-sm text-[9px] uppercase tracking-widest font-bold"
                              style={{ background: `${card.accent}30`, color: card.accent }}
                            >
                              {card.badge}
                            </span>
                            <span className="font-mono opacity-70">{card.url}</span>
                          </p>
                        </div>

                        {/* Actions */}
                        <button
                          type="button"
                          onClick={() => resetCard(card.id)}
                          className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                          title="Reset to default"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        
                        {confirmDeleteId === card.id ? (
                          <div className="flex items-center gap-2 px-1 bg-red-500/10 rounded-lg border border-red-500/20 py-1">
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest pl-2">Sure?</span>
                            <button
                              type="button"
                              onClick={() => {
                                removeCard(card.id);
                                setConfirmDeleteId(null);
                              }}
                              className="p-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
                              title="Yes, delete"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-1.5 rounded-md bg-white/10 text-white/70 hover:text-white transition-colors"
                              title="Cancel"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(card.id)}
                            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Remove card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setExpandedId(isOpen ? null : card.id)}
                          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#837FFB] hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors"
                        >
                          {isOpen ? "Close" : "Edit"}
                          <ChevronDown
                            className="w-3 h-3 transition-transform"
                            style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                          />
                        </button>
                      </div>

                      {/* Expanded editor */}
                      {isOpen && (
                        <div
                          className="px-5 pb-6 pt-4 space-y-5"
                          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.15)" }}
                        >
                          <FieldGroup legend="Copy">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Field
                                label="Eyebrow (CTA suffix — 'VIEW ___')"
                                value={card.eyebrow}
                                onChange={(v) => updateCard(card.id, { eyebrow: v })}
                              />
                              <Field
                                label="Title (big pill text)"
                                value={card.title}
                                onChange={(v) => updateCard(card.id, { title: v })}
                              />
                              <Field
                                label="Badge (tiny uppercase pill)"
                                value={card.badge}
                                onChange={(v) => updateCard(card.id, { badge: v })}
                              />
                              <Field
                                label="Destination URL"
                                value={card.url}
                                onChange={(v) => updateCard(card.id, { url: v })}
                                placeholder="/services"
                              />
                            </div>
                            <Field
                              label="Summary"
                              multiline
                              value={card.summary}
                              onChange={(v) => updateCard(card.id, { summary: v })}
                            />
                          </FieldGroup>

                          <FieldGroup legend="Visual">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <ImageField
                                label="Gallery Image (Top 3D section)"
                                value={card.image}
                                onChange={(v) => updateCard(card.id, { image: v })}
                                folder="cards"
                                placeholder="https://images.unsplash.com/... or upload"
                                previewHeight="h-40"
                              />
                              <ImageField
                                label="Details Image (Bottom alternating section)"
                                value={card.detailsImage || ""}
                                onChange={(v) => updateCard(card.id, { detailsImage: v })}
                                folder="cards/details"
                                placeholder="Leave empty to use Gallery Image"
                                previewHeight="h-40"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <ColorField
                                label="Accent color (badge + brand touches)"
                                value={card.accent}
                                onChange={(v) => updateCard(card.id, { accent: v })}
                              />
                              <ColorField
                                label="Tint (deep base behind image)"
                                value={card.tint}
                                onChange={(v) => updateCard(card.id, { tint: v })}
                              />
                            </div>
                          </FieldGroup>

                          <FieldGroup legend="Typography">
                            <TextStyleEditor
                              label="Title"
                              value={card.titleStyle ?? DEFAULT_CARD_TITLE_STYLE}
                              fallback={DEFAULT_CARD_TITLE_STYLE}
                              onChange={(v) => updateCard(card.id, { titleStyle: v })}
                              previewText={card.title}
                            />
                            <TextStyleEditor
                              label="Summary"
                              value={card.summaryStyle ?? DEFAULT_CARD_SUMMARY_STYLE}
                              fallback={DEFAULT_CARD_SUMMARY_STYLE}
                              onChange={(v) => updateCard(card.id, { summaryStyle: v })}
                              previewText={card.summary}
                            />
                          </FieldGroup>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-white/35 leading-relaxed mt-2">
                Tip: use the chevrons on the left of each row to reorder. The Reset icon restores a card to its defaults.
              </p>
              <button
                onClick={addCard}
                className="w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-dashed border-white/20 text-white/50 hover:text-white transition-all hover:bg-white/10"
              >
                <Plus className="w-5 h-5" /> Add Explore Card
              </button>
            </SectionCard>
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
            {sectionLabel}
          </span>
          <span className="text-white/25 font-mono text-[10px]">
            {sectionIndex} / {sectionTotal}
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

/* ────────────────────────────── SectionCard ────────────────────────────── */

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
    <section id={id} ref={cardRef} className="scroll-mt-24 mb-6">
      <div
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
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-white/35 mb-1">
              <span>Section</span>
              <span className="text-[#837FFB]">{String(index).padStart(2, "0")}</span>
              <span>·</span>
              <span>{String(total).padStart(2, "0")}</span>
            </div>
            <h2 className="text-white text-xl font-bold tracking-tight">{title}</h2>
            <p className="text-white/50 text-sm mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="px-7 py-6 space-y-6">{children}</div>
      </div>
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

/* ────────────────────────────── Field / ColorField ────────────────────────────── */

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

function ColorField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 mb-1.5">
        {label}
      </span>
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

/** Native <input type="color"> requires #rrggbb — fall back so the swatch
 *  never blanks out when the stored value is invalid or a shorthand. */
function normalizeHex(v: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    const r = v[1], g = v[2], b = v[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#837FFB";
}
