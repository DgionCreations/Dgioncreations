import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Save, Check, AlertCircle, Type, Mail, MapPin, Plus, Trash2,
  ChevronRight, ExternalLink, Loader2, MessageSquare, ShieldCheck, Zap, HelpCircle, Eye
} from "lucide-react";
import { useContent, saveContent } from "@/lib/use-content";
import {
  CONTACT_CONTENT_KEY,
  defaultContactContent,
  type ContactContent,
  type TrustBadge,
  type QuickAction,
  type FAQ,
  DEFAULT_CONTACT_KICKER_STYLE,
  DEFAULT_CONTACT_TITLE_STYLE,
  DEFAULT_CONTACT_DESC_STYLE
} from "@/content/contact";
import TextStyleEditor from "@/components/admin/TextStyleEditor";
import IconSelect from "@/components/admin/IconSelect";
import WordHighlightPicker from "@/components/admin/WordHighlightPicker";
import { type IconKey } from "@/content/icons";
import { defaultTextStyle } from "@/content/typography";

const TABS = [
  { id: "hero",    label: "Hero & Form",   icon: MessageSquare, hint: "Titles and form labels" },
  { id: "cards",   label: "Contact Info",  icon: Mail,          hint: "Orbiting info badges" },
  { id: "badges",  label: "Trust Badges",  icon: ShieldCheck,   hint: "Strip under the hero" },
  { id: "actions", label: "Quick Actions", icon: Zap,           hint: "Book / WhatsApp / Brief" },
  { id: "faqs",    label: "FAQ",           icon: HelpCircle,    hint: "Question & answer list" },
  { id: "map",     label: "Map & Office",  icon: MapPin,        hint: "Address and location" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ContactEditor() {
  const { data, loading } = useContent<ContactContent>(CONTACT_CONTENT_KEY, defaultContactContent);
  const [draft, setDraft] = useState<ContactContent>(defaultContactContent);
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
      await saveContent<ContactContent>(CONTACT_CONTENT_KEY, draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const addCard = () => {
    setDraft(d => ({
      ...d,
      cards: [...d.cards, { label: "New", value: "info@example.com", logo: "mail", color: "#837FFB", bg: "#837FFB" }]
    }));
  };

  const removeCard = (idx: number) => {
    setDraft(d => ({
      ...d,
      cards: d.cards.filter((_, i) => i !== idx)
    }));
  };

  const updateBadge = (idx: number, patch: Partial<TrustBadge>) => {
    setDraft(d => ({
      ...d,
      trustBadges: (d.trustBadges ?? []).map((b, i) => i === idx ? { ...b, ...patch } : b),
    }));
  };

  const addBadge = () => {
    setDraft(d => ({
      ...d,
      trustBadges: [
        ...(d.trustBadges ?? []),
        { 
          iconKey: "sparkles", 
          label: "New badge", 
          labelStyle: { ...defaultTextStyle, fontSize: 12, bold: true, color: "#837FFB" },
          value: "Value", 
          valueStyle: { ...defaultTextStyle, fontSize: 16, bold: true },
          sub: "Supporting line.", 
          subStyle: { ...defaultTextStyle, fontSize: 12, color: "rgba(255,255,255,0.35)" },
          color: "#837FFB" 
        },
      ],
    }));
  };

  const removeBadge = (idx: number) => {
    setDraft(d => ({
      ...d,
      trustBadges: (d.trustBadges ?? []).filter((_, i) => i !== idx),
    }));
  };

  const updateAction = (idx: number, patch: Partial<QuickAction>) => {
    setDraft(d => ({
      ...d,
      quickActions: (d.quickActions ?? []).map((a, i) => i === idx ? { ...a, ...patch } : a),
    }));
  };

  const addAction = () => {
    setDraft(d => ({
      ...d,
      quickActions: [
        ...(d.quickActions ?? []),
        { iconKey: "sparkles", title: "New action", desc: "Short description.", cta: "Open", href: "https://" },
      ],
    }));
  };

  const removeAction = (idx: number) => {
    setDraft(d => ({
      ...d,
      quickActions: (d.quickActions ?? []).filter((_, i) => i !== idx),
    }));
  };

  const updateFaq = (idx: number, patch: Partial<FAQ>) => {
    setDraft(d => ({
      ...d,
      faqs: (d.faqs ?? []).map((f, i) => i === idx ? { ...f, ...patch } : f),
    }));
  };

  const addFaq = () => {
    setDraft(d => ({
      ...d,
      faqs: [
        ...(d.faqs ?? []),
        { q: "New question?", a: "Answer goes here." },
      ],
    }));
  };

  const removeFaq = (idx: number) => {
    setDraft(d => ({
      ...d,
      faqs: (d.faqs ?? []).filter((_, i) => i !== idx),
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
            <span className="text-[#837FFB]">Contact Page</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Contact — Get In Touch</h1>
          <p className="text-white/45 text-sm mt-2 max-w-xl">
            Edit your contact details, form text, and office location for the maps.
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
                to="/#contact"
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
            <SectionPanel title="Hero Section" subtitle="Main titles for the contact page." icon={Type}>
              <FieldGroup legend="Kicker">
                <Field label="Hero Kicker" value={draft.heroKicker} onChange={v => setDraft(d => ({ ...d, heroKicker: v }))} />
                <TextStyleEditor 
                  label="Kicker Style" 
                  value={draft.heroKickerStyle ?? DEFAULT_CONTACT_KICKER_STYLE} 
                  fallback={DEFAULT_CONTACT_KICKER_STYLE} 
                  onChange={v => setDraft(d => ({ ...d, heroKickerStyle: v }))}
                  previewText={draft.heroKicker}
                />
              </FieldGroup>

              <FieldGroup legend="Headline">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3 items-start">
                  <Field label="Hero Title" multiline value={draft.heroTitle} onChange={v => setDraft(d => ({ ...d, heroTitle: v }))} />
                  <WordHighlightPicker
                    value={draft.heroTitle}
                    onChange={(v: string) => setDraft(d => ({ ...d, heroTitle: v }))}
                    baseStyle={draft.heroTitleStyle ?? DEFAULT_CONTACT_TITLE_STYLE}
                    highlightStyle={draft.heroHighlightStyle ?? { ...DEFAULT_CONTACT_TITLE_STYLE, color: "#837FFB" }}
                  />
                </div>
                <TextStyleEditor
                  label="Title Style"
                  value={draft.heroTitleStyle ?? DEFAULT_CONTACT_TITLE_STYLE}
                  fallback={DEFAULT_CONTACT_TITLE_STYLE}
                  onChange={v => setDraft(d => ({ ...d, heroTitleStyle: v }))}
                  previewText={(draft.heroTitle.split("\n")[0] || "Designing").replace(/\*\*/g, "")}
                />
                <TextStyleEditor
                  label="Highlight Style"
                  value={draft.heroHighlightStyle ?? DEFAULT_CONTACT_TITLE_STYLE}
                  fallback={{ ...DEFAULT_CONTACT_TITLE_STYLE, color: "#837FFB" }}
                  onChange={v => setDraft(d => ({ ...d, heroHighlightStyle: v }))}
                  previewText={(draft.heroTitle.match(/\*\*([^*\n]+)\*\*/)?.[1]) || "Next-Gen"}
                />
              </FieldGroup>

              <FieldGroup legend="Description">
                <Field label="Hero Description" multiline value={draft.heroDesc} onChange={v => setDraft(d => ({ ...d, heroDesc: v }))} />
                <TextStyleEditor
                  label="Description Style"
                  value={draft.heroDescStyle ?? DEFAULT_CONTACT_DESC_STYLE}
                  fallback={DEFAULT_CONTACT_DESC_STYLE}
                  onChange={v => setDraft(d => ({ ...d, heroDescStyle: v }))}
                  previewText={draft.heroDesc}
                />
              </FieldGroup>

            </SectionPanel>
            <SectionPanel title="Interactive Orbit & Form" subtitle="The floating 3D circle and contact form labels." icon={MessageSquare}>
              <Field label="Center Orb Text" value={draft.orbText} onChange={v => setDraft(d => ({ ...d, orbText: v }))} />
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Field label="Form Header" value={draft.formHeader} onChange={v => setDraft(d => ({ ...d, formHeader: v }))} />
                <Field label="Form Subheader" value={draft.formSubHeader} onChange={v => setDraft(d => ({ ...d, formSubHeader: v }))} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Field label="Submit Button" value={draft.formSubmitLabel} onChange={v => setDraft(d => ({ ...d, formSubmitLabel: v }))} />
                <Field label="Schedule Link" value={draft.formScheduleLabel} onChange={v => setDraft(d => ({ ...d, formScheduleLabel: v }))} />
              </div>
            </SectionPanel>

            <SectionPanel title={'"Other Ways" Header'} subtitle="Section intro above the 3 quick-action cards (call / Slack / brief)." icon={MessageSquare}>
              <Field label="Kicker (small caps above heading)" value={draft.otherWaysKicker ?? ""} onChange={(v: string) => setDraft(d => ({ ...d, otherWaysKicker: v }))} />
              <TextStyleEditor 
                label="Kicker Style" 
                value={draft.otherWaysKickerStyle ?? { fontSize: 14, fontFamily: "inter", bold: true, color: "#837FFB" }} 
                fallback={{ fontSize: 14, fontFamily: "inter", bold: true, color: "#837FFB" }}
                onChange={v => setDraft(d => ({ ...d, otherWaysKickerStyle: v }))}
                previewText={draft.otherWaysKicker}
              />

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="space-y-4">
                  <Field label="Heading Prefix" value={draft.otherWaysTitle ?? ""} onChange={(v: string) => setDraft(d => ({ ...d, otherWaysTitle: v }))} />
                  <TextStyleEditor 
                    label="Title Style" 
                    value={draft.otherWaysTitleStyle ?? { fontSize: 48, fontFamily: "inter", bold: true, color: "#FFFFFF" }} 
                    fallback={{ fontSize: 48, fontFamily: "inter", bold: true, color: "#FFFFFF" }}
                    onChange={v => setDraft(d => ({ ...d, otherWaysTitleStyle: v }))}
                    previewText={draft.otherWaysTitle}
                  />
                </div>
                <div className="space-y-4">
                  <Field label="Highlighted Word" value={draft.otherWaysHighlight ?? ""} onChange={(v: string) => setDraft(d => ({ ...d, otherWaysHighlight: v }))} />
                  <TextStyleEditor 
                    label="Highlight Style" 
                    value={draft.otherWaysHighlightStyle ?? { fontSize: 48, fontFamily: "inter", bold: true, color: "#837FFB" }} 
                    fallback={{ fontSize: 48, fontFamily: "inter", bold: true, color: "#837FFB" }}
                    onChange={v => setDraft(d => ({ ...d, otherWaysHighlightStyle: v }))}
                    previewText={draft.otherWaysHighlight}
                  />
                </div>
              </div>
            </SectionPanel>

            <SectionPanel title="FAQ Header" subtitle="Section intro above the Frequently Asked Questions list." icon={MessageSquare}>
              <Field label="Kicker (small caps above heading)" value={draft.faqKicker ?? ""} onChange={(v: string) => setDraft(d => ({ ...d, faqKicker: v }))} />
              <TextStyleEditor 
                label="Kicker Style" 
                value={draft.faqKickerStyle ?? { fontSize: 14, fontFamily: "inter", bold: true, color: "#837FFB" }} 
                fallback={{ fontSize: 14, fontFamily: "inter", bold: true, color: "#837FFB" }}
                onChange={v => setDraft(d => ({ ...d, faqKickerStyle: v }))}
                previewText={draft.faqKicker}
              />

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="space-y-4">
                  <Field label="Heading Prefix" value={draft.faqTitle ?? ""} onChange={(v: string) => setDraft(d => ({ ...d, faqTitle: v }))} />
                  <TextStyleEditor 
                    label="Title Style" 
                    value={draft.faqTitleStyle ?? { fontSize: 48, fontFamily: "inter", bold: true, color: "#FFFFFF" }} 
                    fallback={{ fontSize: 48, fontFamily: "inter", bold: true, color: "#FFFFFF" }}
                    onChange={v => setDraft(d => ({ ...d, faqTitleStyle: v }))}
                    previewText={draft.faqTitle}
                  />
                </div>
                <div className="space-y-4">
                  <Field label="Highlighted Word" value={draft.faqHighlight ?? ""} onChange={(v: string) => setDraft(d => ({ ...d, faqHighlight: v }))} />
                  <TextStyleEditor 
                    label="Highlight Style" 
                    value={draft.faqHighlightStyle ?? { fontSize: 48, fontFamily: "inter", bold: true, color: "#837FFB" }} 
                    fallback={{ fontSize: 48, fontFamily: "inter", bold: true, color: "#837FFB" }}
                    onChange={v => setDraft(d => ({ ...d, faqHighlightStyle: v }))}
                    previewText={draft.faqHighlight}
                  />
                </div>
              </div>
            </SectionPanel>
          </div>
        )}

        {activeTab === "cards" && (
          <div className="space-y-6">
            {draft.cards.map((card, i) => (
              <SectionPanel 
                key={i} 
                title={card.label || "New Card"} 
                subtitle={`Configure the contact details for this badge.`} 
                icon={Mail}
              >
                <div className="absolute top-5 right-7">
                  <button 
                    onClick={() => removeCard(i)}
                    className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    title="Remove Card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Label" value={card.label} onChange={v => setDraft(d => ({ ...d, cards: d.cards.map((c, idx) => idx === i ? { ...c, label: v } : c) }))} />
                  <Field label="Value" value={card.value} onChange={v => setDraft(d => ({ ...d, cards: d.cards.map((c, idx) => idx === i ? { ...c, value: v } : c) }))} />
                  <Field label="Logo URL (SimpleIcons)" value={card.logo} onChange={v => setDraft(d => ({ ...d, cards: d.cards.map((c, idx) => idx === i ? { ...c, logo: v } : c) }))} />
                  <Field label="Accent Color (Hex)" value={card.color} onChange={v => setDraft(d => ({ ...d, cards: d.cards.map((c, idx) => idx === i ? { ...c, color: v, bg: v } : c) }))} />
                </div>
              </SectionPanel>
            ))}
            <button 
              onClick={addCard}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-dashed border-white/20 text-white/50 hover:text-white transition-all hover:bg-white/10"
            >
              <Plus className="w-5 h-5" /> Add Contact Badge
            </button>
          </div>
        )}

        {activeTab === "badges" && (
          <div className="space-y-6">
            {(draft.trustBadges ?? []).map((badge, i) => (
              <SectionPanel
                key={i}
                title={badge.label || "New Badge"}
                subtitle="Trust badge shown on the strip below the hero."
                icon={ShieldCheck}
              >
                <div className="absolute top-5 right-7">
                  <button
                    onClick={() => removeBadge(i)}
                    className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    title="Remove Badge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <IconSelect
                    label="Icon"
                    value={(badge.iconKey as IconKey) || "sparkles"}
                    onChange={(v) => updateBadge(i, { iconKey: v })}
                  />
                  <Field label="Accent Color (Hex)" value={badge.color} onChange={(v: string) => updateBadge(i, { color: v })} />
                  <Field label="Label Text" value={badge.label} onChange={(v: string) => updateBadge(i, { label: v })} />
                  <Field label="Value Text" value={badge.value} onChange={(v: string) => updateBadge(i, { value: v })} />
                </div>
                <Field label="Sub-text" multiline value={badge.sub} onChange={(v: string) => updateBadge(i, { sub: v })} />
                
                <div className="mt-8 pt-8 border-t border-white/5 space-y-8">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#837FFB]">Typography Settings</p>
                  
                  <TextStyleEditor 
                    label="Label Style (Small Caps)" 
                    value={badge.labelStyle ?? defaultTextStyle} 
                    fallback={defaultTextStyle}
                    onChange={v => updateBadge(i, { labelStyle: v })}
                    previewText={badge.label}
                  />

                  <TextStyleEditor 
                    label="Value Style (Bold)" 
                    value={badge.valueStyle ?? defaultTextStyle} 
                    fallback={defaultTextStyle}
                    onChange={v => updateBadge(i, { valueStyle: v })}
                    previewText={badge.value}
                  />

                  <TextStyleEditor 
                    label="Description Style" 
                    value={badge.subStyle ?? defaultTextStyle} 
                    fallback={defaultTextStyle}
                    onChange={v => updateBadge(i, { subStyle: v })}
                    previewText={badge.sub}
                  />
                </div>
              </SectionPanel>
            ))}
            <button
              onClick={addBadge}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-dashed border-white/20 text-white/50 hover:text-white transition-all hover:bg-white/10"
            >
              <Plus className="w-5 h-5" /> Add Trust Badge
            </button>
          </div>
        )}

        {activeTab === "actions" && (
          <div className="space-y-6">
            <div className="rounded-2xl p-5 text-sm text-white/55" style={{ background: "rgba(131,127,251,0.06)", border: "1px solid rgba(131,127,251,0.2)" }}>
              <strong className="text-white/80">Tip:</strong> Each card should do a <em>different</em> real action — typically a Calendly/Cal.com link for booking, a <code className="text-[#837FFB]">https://wa.me/&lt;number&gt;</code> link for WhatsApp, and a <code className="text-[#837FFB]">mailto:</code> for email. Change the section header in "Hero & Form" tab → "Other Ways" Header.
            </div>
            {(draft.quickActions ?? []).map((action, i) => (
              <SectionPanel
                key={i}
                title={action.title || "New Action"}
                subtitle={action.href ? action.href.slice(0, 60) + (action.href.length > 60 ? "…" : "") : "Link target for this card."}
                icon={Zap}
              >
                <div className="absolute top-5 right-7">
                  <button
                    onClick={() => removeAction(i)}
                    className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    title="Remove Action"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <IconSelect
                    label="Icon"
                    value={(action.iconKey as IconKey) || "sparkles"}
                    onChange={(v) => updateAction(i, { iconKey: v })}
                  />
                  <Field label="Card Title" value={action.title} onChange={(v: string) => updateAction(i, { title: v })} />
                </div>
                <TextStyleEditor 
                  label="Title Style" 
                  value={action.titleStyle ?? { fontSize: 20, fontFamily: "inter", bold: true, color: "#FFFFFF" }} 
                  fallback={{ fontSize: 20, fontFamily: "inter", bold: true, color: "#FFFFFF" }}
                  onChange={v => updateAction(i, { titleStyle: v })}
                  previewText={action.title}
                />

                <Field label="Accent Color (hex — e.g. #25D366 for WhatsApp)" value={action.accent ?? ""} onChange={(v: string) => updateAction(i, { accent: v })} />
                <Field label="Hover Reveal Text (leave empty to disable effect)" value={action.revealText ?? ""} onChange={(v: string) => updateAction(i, { revealText: v })} />
                
                <div className="space-y-4">
                  <Field label="Description" multiline value={action.desc} onChange={(v: string) => updateAction(i, { desc: v })} />
                  <TextStyleEditor 
                    label="Description Style" 
                    value={action.descStyle ?? { fontSize: 14, fontFamily: "inter", color: "rgba(255,255,255,0.55)" }} 
                    fallback={{ fontSize: 14, fontFamily: "inter", color: "rgba(255,255,255,0.55)" }}
                    onChange={v => updateAction(i, { descStyle: v })}
                    previewText={action.desc}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="space-y-4">
                    <Field label="CTA Button Text" value={action.cta} onChange={(v: string) => updateAction(i, { cta: v })} />
                    <TextStyleEditor 
                      label="CTA Style" 
                      value={action.ctaStyle ?? { fontSize: 14, fontFamily: "inter", bold: true }} 
                      fallback={{ fontSize: 14, fontFamily: "inter", bold: true }}
                      onChange={v => updateAction(i, { ctaStyle: v })}
                      previewText={action.cta}
                    />
                  </div>
                  <Field label="Link (https:// / mailto: / tel: / wa.me)" value={action.href} onChange={(v: string) => updateAction(i, { href: v })} />
                </div>

              </SectionPanel>
            ))}
            <button
              onClick={addAction}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-dashed border-white/20 text-white/50 hover:text-white transition-all hover:bg-white/10"
            >
              <Plus className="w-5 h-5" /> Add Quick Action
            </button>
          </div>
        )}

        {activeTab === "faqs" && (
          <div className="space-y-6">
            <div className="rounded-2xl p-5 text-sm text-white/55" style={{ background: "rgba(131,127,251,0.06)", border: "1px solid rgba(131,127,251,0.2)" }}>
              <strong className="text-white/80">Tip:</strong> Keep answers short and concrete. Avoid mentioning specific prices publicly — let discovery conversations handle that. Section heading ("JUST ASK / Clear Answers. Real Direction") is set in the "Hero & Form" tab.
            </div>
            {(draft.faqs ?? []).map((faq, i) => (
              <SectionPanel
                key={i}
                title={faq.q || "New question"}
                subtitle={(faq.a || "").slice(0, 100) + ((faq.a || "").length > 100 ? "…" : "")}
                icon={HelpCircle}
              >
                <div className="absolute top-5 right-7">
                  <button
                    onClick={() => removeFaq(i)}
                    className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    title="Remove FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Field label="Question" value={faq.q} onChange={(v: string) => updateFaq(i, { q: v })} />
                <Field label="Answer" multiline value={faq.a} onChange={(v: string) => updateFaq(i, { a: v })} />
              </SectionPanel>
            ))}
            <button
              onClick={addFaq}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-dashed border-white/20 text-white/50 hover:text-white transition-all hover:bg-white/10"
            >
              <Plus className="w-5 h-5" /> Add FAQ
            </button>
          </div>
        )}

        {activeTab === "map" && (
          <SectionPanel title="Office Location" subtitle="Physical address and Google Maps integration." icon={MapPin}>
            <Field label="Office Address" multiline value={draft.officeAddress} onChange={v => setDraft(d => ({ ...d, officeAddress: v }))} />
            <TextStyleEditor 
              label="Address Style" 
              value={draft.officeAddressStyle ?? { fontSize: 14, fontFamily: "inter", color: "rgba(255,255,255,0.4)" }} 
              fallback={{ fontSize: 14, fontFamily: "inter", color: "rgba(255,255,255,0.4)" }}
              onChange={v => setDraft(d => ({ ...d, officeAddressStyle: v }))}
              previewText={draft.officeAddress}
            />

            <Field label="Maps Search Query" value={draft.officeQuery} onChange={v => setDraft(d => ({ ...d, officeQuery: v }))} />
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="space-y-4">
                <Field label="Map Kicker" value={draft.mapTitleKicker} onChange={v => setDraft(d => ({ ...d, mapTitleKicker: v }))} />
                <TextStyleEditor 
                  label="Kicker Style" 
                  value={draft.mapTitleKickerStyle ?? { fontSize: 16, fontFamily: "inter", bold: true, color: "#837FFB" }} 
                  fallback={{ fontSize: 16, fontFamily: "inter", bold: true, color: "#837FFB" }}
                  onChange={v => setDraft(d => ({ ...d, mapTitleKickerStyle: v }))}
                  previewText={draft.mapTitleKicker}
                />
              </div>
              <div className="space-y-4">
                <Field label="Map Title" value={draft.mapTitle} onChange={v => setDraft(d => ({ ...d, mapTitle: v }))} />
                <TextStyleEditor 
                  label="Title Style" 
                  value={draft.mapTitleStyle ?? { fontSize: 36, fontFamily: "inter", bold: true, color: "#FFFFFF" }} 
                  fallback={{ fontSize: 36, fontFamily: "inter", bold: true, color: "#FFFFFF" }}
                  onChange={v => setDraft(d => ({ ...d, mapTitleStyle: v }))}
                  previewText={draft.mapTitle}
                />
              </div>
            </div>

            <div className="mt-8">
              <Field label="Map Highlight Word" value={draft.mapHighlight} onChange={v => setDraft(d => ({ ...d, mapHighlight: v }))} />
              <TextStyleEditor 
                label="Highlight Style" 
                value={draft.mapHighlightStyle ?? { fontSize: 36, fontFamily: "inter", bold: true, color: "#837FFB" }} 
                fallback={{ fontSize: 36, fontFamily: "inter", bold: true, color: "#837FFB" }}
                onChange={v => setDraft(d => ({ ...d, mapHighlightStyle: v }))}
                previewText={draft.mapHighlight}
              />
            </div>
          </SectionPanel>
        )}

        {/* Footer save/preview bar */}
        <div className="mt-10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4" style={{ background: "linear-gradient(135deg, rgba(131,127,251,0.1), rgba(91,87,245,0.04))", border: "1px solid rgba(131,127,251,0.25)" }}>
          <div className="flex-1 text-center md:text-left">
            <p className="text-white font-bold">Ready to go live?</p>
            <p className="text-white/55 text-sm mt-0.5">Your contact information will be updated across the site instantly.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/#contact" target="_blank" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white/80 transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <ExternalLink className="w-3.5 h-3.5" /> Preview
            </Link>
            <button onClick={onSave} disabled={saving || !dirty} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #837FFB, #5B57F5)" }}>
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : <><Save className="w-4 h-4" /> Publish Changes</>}
            </button>
          </div>
        </div>
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
    <section className="relative rounded-2xl overflow-hidden mb-6" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
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
