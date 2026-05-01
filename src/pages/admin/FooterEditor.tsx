import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Save, Check, AlertCircle, Type, Link as LinkIcon, Share2, 
  Mail, MessageSquare, ChevronRight, ExternalLink, Loader2, Plus, Trash2, Palette, Settings2
} from "lucide-react";
import { useContent, saveContent } from "@/lib/use-content";
import {
  FOOTER_CONTENT_KEY,
  defaultFooterContent,
  type FooterContent,
  type FooterLink,
  type FooterSocial,
  type FooterContact
} from "@/content/footer";
import TextStyleEditor from "@/components/admin/TextStyleEditor";

const TABS = [
  { id: "style",    label: "Footer Style",   icon: Palette,       hint: "Fonts, sizes, colors" },
  { id: "brand",    label: "Brand & Social", icon: Type,          hint: "Description & social icons" },
  { id: "links",    label: "Link Columns",   icon: LinkIcon,      hint: "Services, Company, Resources" },
  { id: "contact",  label: "Contact Info",   icon: Mail,          hint: "Email, phone, address" },
  { id: "bottom",   label: "Footer Bottom",  icon: MessageSquare, hint: "Copyright & legal links" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function FooterEditor() {
  const { data, loading } = useContent<FooterContent>(FOOTER_CONTENT_KEY, defaultFooterContent);
  const [draft, setDraft] = useState<FooterContent>(defaultFooterContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("style");

  const dirty = JSON.stringify(draft) !== JSON.stringify(data);

  useEffect(() => {
    if (!loading) setDraft(data);
  }, [loading, data]);

  const onSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await saveContent<FooterContent>(FOOTER_CONTENT_KEY, draft);
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

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-white/40">
            <Link to="/admin" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#837FFB]">Footer Settings</span>
          </div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Footer — Global Branding</h1>
          <p className="text-white/45 text-sm mt-2 max-w-xl">
            Edit the brand story, social links, and navigation menus shown at the bottom of every page.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl flex items-start gap-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-sm text-red-300">{error}</div>
          </div>
        )}

        {/* Tab navigation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="relative rounded-2xl p-4 text-left transition-all overflow-hidden group"
                style={{
                  background: isActive ? "linear-gradient(135deg, rgba(131,127,251,0.14), rgba(131,127,251,0.04))" : "rgba(255,255,255,0.025)",
                  border: `1px solid ${isActive ? "rgba(131,127,251,0.5)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: isActive ? "rgba(131,127,251,0.22)" : "rgba(255,255,255,0.04)" }}>
                    <Icon className="w-4 h-4" style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.4)" }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[12px] font-bold truncate leading-tight" style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.7)" }}>{t.label}</h3>
                    <p className="text-white/40 text-[9px] mt-0.5 line-clamp-1">{t.hint}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "style" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl flex items-center justify-between gap-4 mb-4" style={{ background: "rgba(131,127,251,0.08)", border: "1px solid rgba(131,127,251,0.2)" }}>
              <div className="flex items-center gap-3">
                <Settings2 className="w-5 h-5 text-[#837FFB]" />
                <div>
                  <p className="text-xs font-bold text-white">Looking to change the text or link names?</p>
                  <p className="text-[10px] text-white/50">Switch to the content tabs above (Brand, Links, etc.)</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab("links")}
                className="px-4 py-2 rounded-lg bg-[#837FFB] text-white text-[11px] font-bold hover:scale-105 transition-transform"
              >
                Edit Link Names
              </button>
            </div>

            <SectionPanel title="Footer Typography" subtitle="Adjust the font size, style, and colors for column headers and links." icon={Palette}>
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#837FFB]">Brand & Identity</p>
                  <TextStyleEditor 
                    label="Brand Title Style"
                    value={draft.brandTitleStyle} 
                    fallback={defaultFooterContent.brandTitleStyle}
                    onChange={v => setDraft(d => ({ ...d, brandTitleStyle: v }))} 
                    previewText={draft.brandName || "Dgion"}
                  />
                  <TextStyleEditor 
                    label="Description Style"
                    value={draft.brandDescriptionStyle} 
                    fallback={defaultFooterContent.brandDescriptionStyle}
                    onChange={v => setDraft(d => ({ ...d, brandDescriptionStyle: v }))} 
                    previewText={draft.brandDescription || "A creative AI digital agency..."}
                  />
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#837FFB]">Main Navigation</p>
                  <TextStyleEditor 
                    label="Column Headers"
                    value={draft.columnTitleStyle} 
                    fallback={defaultFooterContent.columnTitleStyle}
                    onChange={v => setDraft(d => ({ ...d, columnTitleStyle: v }))} 
                    previewText="SERVICES • COMPANY • RESOURCES"
                  />
                  <TextStyleEditor 
                    label="Link Style"
                    value={draft.linkStyle} 
                    fallback={defaultFooterContent.linkStyle}
                    onChange={v => setDraft(d => ({ ...d, linkStyle: v }))} 
                    previewText="Home • About Us • Web Development"
                  />
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#837FFB]">Contact & Support</p>
                  <TextStyleEditor 
                    label="Contact Info Style"
                    value={draft.contactItemStyle} 
                    fallback={defaultFooterContent.contactItemStyle}
                    onChange={v => setDraft(d => ({ ...d, contactItemStyle: v }))} 
                    previewText="hello@dgion.com • +1 (555) 012-3456"
                  />
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#837FFB]">Footer Bottom (Legal)</p>
                  <TextStyleEditor 
                    label="Copyright Style"
                    value={draft.copyrightStyle} 
                    fallback={defaultFooterContent.copyrightStyle}
                    onChange={v => setDraft(d => ({ ...d, copyrightStyle: v }))} 
                    previewText={draft.copyrightText || "© 2025 Dgion. All rights reserved."}
                  />
                  <TextStyleEditor 
                    label="Legal Link Style"
                    value={draft.bottomLinkStyle} 
                    fallback={defaultFooterContent.bottomLinkStyle}
                    onChange={v => setDraft(d => ({ ...d, bottomLinkStyle: v }))} 
                    previewText="Terms • Privacy • Cookies"
                  />
                </div>
              </div>
            </SectionPanel>
          </div>
        )}

        {activeTab === "brand" && (
          <div className="space-y-6">
            <SectionPanel title="Brand Identity" subtitle="Company name and the elevator pitch shown in the first column." icon={Type}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Brand Name" value={draft.brandName} onChange={v => setDraft(d => ({ ...d, brandName: v }))} />
                <Field label="Brand Link (URL)" value={draft.brandHref} onChange={v => setDraft(d => ({ ...d, brandHref: v }))} />
              </div>
              <Field label="Description" multiline value={draft.brandDescription} onChange={v => setDraft(d => ({ ...d, brandDescription: v }))} />
            </SectionPanel>

            <SectionPanel title="Social Presence" subtitle="Icons and links to your social media profiles." icon={Share2}>
              <div className="space-y-4">
                {draft.socialLinks.map((s, i) => (
                  <div key={i} className="rounded-xl p-4 bg-white/2 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Platform 0{i + 1}</span>
                      <button 
                        onClick={() => setDraft(d => ({ ...d, socialLinks: d.socialLinks.filter((_, idx) => idx !== i) }))}
                        className="p-1.5 rounded-lg text-white/30 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Label" value={s.label} onChange={v => setDraft(d => {
                        const list = [...d.socialLinks];
                        list[i] = { ...list[i], label: v };
                        return { ...d, socialLinks: list };
                      })} />
                      <Field label="Icon Key" value={s.iconKey} onChange={v => setDraft(d => {
                        const list = [...d.socialLinks];
                        list[i] = { ...list[i], iconKey: v };
                        return { ...d, socialLinks: list };
                      })} placeholder="twitter, github, etc." />
                    </div>
                    <Field label="URL" value={s.href} onChange={v => setDraft(d => {
                      const list = [...d.socialLinks];
                      list[i] = { ...list[i], href: v };
                      return { ...d, socialLinks: list };
                    })} />
                  </div>
                ))}
                <button 
                  onClick={() => setDraft(d => ({ ...d, socialLinks: [...d.socialLinks, { label: "New", iconKey: "link", href: "#" }] }))}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/50 hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Social Link
                </button>
              </div>
            </SectionPanel>
          </div>
        )}

        {activeTab === "links" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LinkColumnEditor 
              title={draft.servicesTitle}
              onTitleChange={v => setDraft(d => ({ ...d, servicesTitle: v }))}
              links={draft.servicesLinks} 
              onChange={v => setDraft(d => ({ ...d, servicesLinks: v }))} 
            />
            <LinkColumnEditor 
              title={draft.companyTitle}
              onTitleChange={v => setDraft(d => ({ ...d, companyTitle: v }))}
              links={draft.companyLinks} 
              onChange={v => setDraft(d => ({ ...d, companyLinks: v }))} 
            />
            <LinkColumnEditor 
              title={draft.resourcesTitle}
              onTitleChange={v => setDraft(d => ({ ...d, resourcesTitle: v }))}
              links={draft.resourceLinks} 
              onChange={v => setDraft(d => ({ ...d, resourceLinks: v }))} 
            />
          </div>
        )}

        {activeTab === "contact" && (
          <SectionPanel title={draft.contactTitle} subtitle="Direct contact information shown in the last column." icon={Mail}>
            <div className="mb-6 pb-6 border-b border-white/5">
              <Field label="Column Title" value={draft.contactTitle} onChange={v => setDraft(d => ({ ...d, contactTitle: v }))} />
            </div>
            <div className="space-y-4">
              {draft.contactInfo.map((c, i) => (
                <div key={i} className="rounded-xl p-4 bg-white/2 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Entry 0{i + 1}</span>
                    <button 
                      onClick={() => setDraft(d => ({ ...d, contactInfo: d.contactInfo.filter((_, idx) => idx !== i) }))}
                      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Text" value={c.text} onChange={v => setDraft(d => ({ ...d, contactInfo: d.contactInfo.map((item, idx) => idx === i ? { ...item, text: v } : item) }))} />
                    <Field label="Icon Key" value={c.iconKey} onChange={v => setDraft(d => ({ ...d, contactInfo: d.contactInfo.map((item, idx) => idx === i ? { ...item, iconKey: v } : item) }))} placeholder="mail, phone, map-pin" />
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setDraft(d => ({ ...d, contactInfo: [...d.contactInfo, { text: "info@example.com", iconKey: "mail" }] }))}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/50 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Contact Entry
              </button>
            </div>
          </SectionPanel>
        )}

        {activeTab === "bottom" && (
          <div className="space-y-6">
            <SectionPanel title="Copyright" subtitle="The legal line at the very bottom." icon={Type}>
              <Field label="Copyright Text" value={draft.copyrightText} onChange={v => setDraft(d => ({ ...d, copyrightText: v }))} />
            </SectionPanel>

            <SectionPanel title="Legal Links" subtitle="Small links like Terms and Privacy policy." icon={LinkIcon}>
              <div className="space-y-4">
                {draft.bottomLinks.map((l, i) => (
                  <div key={i} className="flex items-end gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Field label="Label" value={l.text} onChange={v => setDraft(d => ({ ...d, bottomLinks: d.bottomLinks.map((item, idx) => idx === i ? { ...item, text: v } : item) }))} />
                      <Field label="URL" value={l.href} onChange={v => setDraft(d => ({ ...d, bottomLinks: d.bottomLinks.map((item, idx) => idx === i ? { ...item, href: v } : item) }))} />
                    </div>
                    <button 
                      onClick={() => setDraft(d => ({ ...d, bottomLinks: d.bottomLinks.filter((_, idx) => idx !== i) }))}
                      className="p-2.5 rounded-lg text-white/30 hover:text-red-400 transition-colors mb-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => setDraft(d => ({ ...d, bottomLinks: [...d.bottomLinks, { text: "New Link", href: "#" }] }))}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 border border-dashed border-white/20 text-white/40 hover:text-white transition-colors text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Legal Link
                </button>
              </div>
            </SectionPanel>
          </div>
        )}

        {/* Footer save bar */}
        <div className="mt-10 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4" style={{ background: "linear-gradient(135deg, rgba(131,127,251,0.1), rgba(91,87,245,0.04))", border: "1px solid rgba(131,127,251,0.25)" }}>
          <div className="flex-1 text-center md:text-left">
            <p className="text-white font-bold">Ready to update your footer?</p>
            <p className="text-white/55 text-sm mt-0.5">Your branding and links will be updated globally across the entire site.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white/80 transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <ExternalLink className="w-3.5 h-3.5" /> Preview Site
            </Link>
            <button onClick={onSave} disabled={saving || !dirty} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #837FFB, #5B57F5)" }}>
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : <><Save className="w-4 h-4" /> Publish Changes</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function LinkColumnEditor({ title, onTitleChange, links, onChange }: { title: string, onTitleChange: (v: string) => void, links: FooterLink[], onChange: (v: FooterLink[]) => void }) {
  return (
    <SectionPanel title={title} subtitle={`${links.length} active links`} icon={LinkIcon}>
      <div className="mb-6 pb-6 border-b border-white/5">
        <Field label="Column Title" value={title} onChange={onTitleChange} />
      </div>
      <div className="space-y-4">
        {links.map((l, i) => (
          <div key={i} className="rounded-xl p-3 bg-white/[0.03] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Link 0{i + 1}</span>
              <button 
                onClick={() => onChange(links.filter((_, idx) => idx !== i))}
                className="p-1 rounded text-white/20 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <Field label="Text" value={l.text} onChange={(v: string) => onChange(links.map((item, idx) => idx === i ? { ...item, text: v } : item))} />
            <Field label="URL" value={l.href} onChange={(v: string) => onChange(links.map((item, idx) => idx === i ? { ...item, href: v } : item))} />
          </div>
        ))}
        <button 
          onClick={() => onChange([...links, { text: "New Link", href: "#" }])}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/40 hover:text-white transition-colors text-xs"
        >
          <Plus className="w-3.5 h-3.5" /> Add to {title}
        </button>
      </div>
    </SectionPanel>
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
    <section className="rounded-2xl overflow-hidden mb-6 h-full flex flex-col" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
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
