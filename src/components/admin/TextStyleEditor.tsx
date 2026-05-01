import { Minus, Plus, Bold, Italic, Underline, Palette, Sliders } from "lucide-react";
import {
  FONT_CATEGORY_ORDER,
  FONT_FAMILIES,
  FONT_SIZE_PRESETS,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  type FontCategory,
  type FontFamily,
  type TextStyle,
} from "@/content/typography";

/**
 * TextStyleEditor — one Word-style toolbar for a single TextStyle slot.
 *
 *   [ Font family ▼ ]  [ Size ▼ ]  [ − 14 + ]  [ B ]  [ I ]  [ U ]  [ 🎨 ] [ 🔘 ]
 */
export default function TextStyleEditor({
  label,
  value,
  fallback,
  onChange,
  previewText,
}: {
  label: string;
  value: TextStyle;
  fallback: TextStyle;
  onChange: (v: TextStyle) => void;
  previewText?: string;
}) {
  const clamp = (n: number) =>
    Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, Math.round(n)));
  const patch = (p: Partial<TextStyle>) => onChange({ ...value, ...p });

  const grouped: Record<FontCategory, FontFamily[]> = FONT_CATEGORY_ORDER.reduce(
    (acc, cat) => {
      acc[cat] = [];
      return acc;
    },
    {} as Record<FontCategory, FontFamily[]>
  );
  (Object.keys(FONT_FAMILIES) as FontFamily[]).forEach((key) => {
    grouped[FONT_FAMILIES[key].category].push(key);
  });

  return (
    <div
      className="rounded-xl p-3 space-y-3"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
          {label}
        </span>
        <button
          type="button"
          onClick={() => onChange(fallback)}
          className="text-[10px] font-semibold uppercase tracking-wider text-white/40 hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Font family */}
        <select
          value={value.fontFamily}
          onChange={(e) => patch({ fontFamily: e.target.value as FontFamily })}
          className="px-3 py-1.5 rounded-md bg-white/5 text-white text-sm outline-none focus:ring-2 focus:ring-[#837FFB]/40 min-w-[160px]"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            fontFamily: FONT_FAMILIES[value.fontFamily]?.stack ?? FONT_FAMILIES.inter.stack,
          }}
        >
          {FONT_CATEGORY_ORDER.map((cat) => {
            const keys = grouped[cat];
            if (!keys || keys.length === 0) return null;
            return (
              <optgroup key={cat} label={cat} className="bg-[#0D0B24] text-white">
                {keys.map((key) => (
                  <option key={key} value={key} style={{ fontFamily: FONT_FAMILIES[key].stack }}>
                    {FONT_FAMILIES[key].label}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>

        {/* Size stepper */}
        <div className="flex items-center rounded-md overflow-hidden bg-white/5 border border-white/10">
          <button type="button" onClick={() => patch({ fontSize: clamp(value.fontSize - 1) })} className="px-2 py-1.5 text-white/50 hover:text-white"><Minus className="w-3 h-3" /></button>
          <input
            type="number"
            value={value.fontSize}
            onChange={(e) => patch({ fontSize: clamp(parseInt(e.target.value) || 16) })}
            className="w-10 bg-transparent text-white text-xs text-center outline-none"
          />
          <button type="button" onClick={() => patch({ fontSize: clamp(value.fontSize + 1) })} className="px-2 py-1.5 text-white/50 hover:text-white"><Plus className="w-3 h-3" /></button>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
          <ToggleButton active={!!value.bold} onClick={() => patch({ bold: !value.bold })}><Bold className="w-3.5 h-3.5" /></ToggleButton>
          <ToggleButton active={!!value.italic} onClick={() => patch({ italic: !value.italic })}><Italic className="w-3.5 h-3.5" /></ToggleButton>
          <ToggleButton active={!!value.underline} onClick={() => patch({ underline: !value.underline })}><Underline className="w-3.5 h-3.5" /></ToggleButton>
        </div>

        {/* Color & Opacity */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
          <div className="flex items-center gap-2">
            <div 
              className="relative w-7 h-7 rounded-lg border border-white/20 overflow-hidden"
              style={{ background: value.color || "#ffffff" }}
            >
              <input type="color" value={value.color || "#ffffff"} onChange={e => patch({ color: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-difference opacity-50"><Palette className="w-3.5 h-3.5 text-white" /></div>
            </div>
            <input type="text" value={value.color || "#ffffff"} onChange={e => patch({ color: e.target.value })} className="w-16 bg-transparent text-[10px] text-white font-mono outline-none border-b border-white/10" />
          </div>

          <div className="flex items-center gap-2 group">
            <Sliders className="w-3.5 h-3.5 text-white/30 group-hover:text-[#837FFB] transition-colors" />
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">Opacity: {Math.round((value.opacity ?? 1) * 100)}%</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={value.opacity ?? 1} 
                onChange={e => patch({ opacity: parseFloat(e.target.value) })}
                className="w-20 accent-[#837FFB] h-1 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-lg p-4 bg-black/40 border border-white/5 relative min-h-[60px] flex items-center justify-center">
        <div
          style={{
            fontFamily: FONT_FAMILIES[value.fontFamily]?.stack ?? FONT_FAMILIES.inter.stack,
            fontSize: `${Math.min(value.fontSize, 40)}px`,
            fontWeight: value.bold ? 700 : 400,
            fontStyle: value.italic ? "italic" : "normal",
            textDecoration: value.underline ? "underline" : "none",
            color: value.color || "#ffffff",
            opacity: value.opacity ?? 1,
            lineHeight: 1.2,
            textAlign: "center"
          }}
        >
          {previewText?.trim() ? previewText : "The quick brown fox"}
        </div>
        <div className="absolute bottom-1 right-2 text-[8px] font-mono text-white/20 uppercase tracking-widest">
          Preview
        </div>
      </div>
    </div>
  );
}

function ToggleButton({ active, onClick, children }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded-md transition-all ${active ? "bg-[#837FFB] text-white shadow-[0_0_10px_rgba(131,127,251,0.4)]" : "text-white/40 hover:text-white hover:bg-white/5"}`}
    >
      {children}
    </button>
  );
}
