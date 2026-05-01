import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, X, RotateCcw, Palette, Settings2 } from "lucide-react";
import { textStyleToCss, type TextStyle } from "@/content/typography";
import { MarkupText, parseHighlightInner } from "@/lib/markup-text";

type WordToken = {
  kind: "word";
  text: string;
  highlighted: boolean;
  size?: number;
  color?: string;
  idx: number;
};
type SpaceToken = { kind: "space"; text: string };
type Token = WordToken | SpaceToken;

const TOKEN_RE = /(\*\*[^*\n]+?\*\*)|(\s+)|([^\s*]+)/g;
const MIN_SIZE = 8;
const MAX_SIZE = 200;

function parse(s: string): Token[] {
  const tokens: Token[] = [];
  let wordIdx = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(s)) !== null) {
    if (m[1]) {
      const inner = m[1].slice(2, -2);
      const { text, size, color } = parseHighlightInner(inner);
      tokens.push({ kind: "word", text, highlighted: true, size, color, idx: wordIdx++ });
    } else if (m[2]) {
      tokens.push({ kind: "space", text: m[2] });
    } else if (m[3]) {
      tokens.push({ kind: "word", text: m[3], highlighted: false, idx: wordIdx++ });
    }
  }
  return tokens;
}

function serializeWord(t: WordToken): string {
  if (!t.highlighted) return t.text;
  const attrs: string[] = [];
  if (t.size) attrs.push(`s=${t.size}`);
  if (t.color) attrs.push(`c=${t.color}`);
  return attrs.length ? `**${t.text}|${attrs.join(";")}**` : `**${t.text}**`;
}

function serialize(tokens: Token[]): string {
  return tokens.map((t) => (t.kind === "word" ? serializeWord(t) : t.text)).join("");
}

const clampSize = (n: number) => Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(n)));

export default function WordHighlightPicker({
  value,
  onChange,
  highlightStyle,
  baseStyle,
}: {
  value: string;
  onChange: (s: string) => void;
  highlightStyle?: TextStyle;
  baseStyle?: TextStyle;
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const tokens = useMemo(() => parse(value), [value]);
  const words = useMemo(
    () => tokens.filter((t): t is WordToken => t.kind === "word"),
    [tokens]
  );
  const firstHighlightedIdx = useMemo(
    () => words.find((w) => w.highlighted)?.idx ?? null,
    [words]
  );

  // Auto-select the first highlighted word so the size/color panel is visible
  // immediately whenever any word is highlighted — users don't need to discover
  // a click-to-expand interaction.
  useEffect(() => {
    if (selectedIdx === null && firstHighlightedIdx !== null) {
      setSelectedIdx(firstHighlightedIdx);
    }
    if (selectedIdx !== null && !words.some((w) => w.idx === selectedIdx && w.highlighted)) {
      // Selected word lost its highlight (or was deleted) → fall back to first or none.
      setSelectedIdx(firstHighlightedIdx);
    }
  }, [selectedIdx, firstHighlightedIdx, words]);

  const selected = selectedIdx !== null ? words.find((w) => w.idx === selectedIdx) ?? null : null;

  const hlBaseColor = highlightStyle?.color || "#837FFB";
  const hlBaseSize = highlightStyle?.fontSize || baseStyle?.fontSize || 50;
  const chipColorOf = (w: WordToken) => w.color || hlBaseColor;

  const updateWord = (idx: number, patch: Partial<Omit<WordToken, "kind" | "idx">>) => {
    const next: Token[] = tokens.map((t) =>
      t.kind === "word" && t.idx === idx ? { ...t, ...patch } : t
    );
    onChange(serialize(next));
  };

  const toggleHighlight = (idx: number) => {
    const w = words.find((x) => x.idx === idx);
    if (!w) return;
    if (!w.highlighted) {
      updateWord(idx, { highlighted: true });
    }
    setSelectedIdx(idx);
  };

  const removeHighlight = (idx: number) => {
    updateWord(idx, { highlighted: false, size: undefined, color: undefined });
    if (selectedIdx === idx) setSelectedIdx(null);
  };

  const clearAll = () => {
    const next: Token[] = tokens.map((t) =>
      t.kind === "word" ? { ...t, highlighted: false, size: undefined, color: undefined } : t
    );
    onChange(serialize(next));
    setSelectedIdx(null);
  };

  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="block h-px w-4"
            style={{ background: `linear-gradient(90deg, ${hlBaseColor}, transparent)` }}
          />
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/55">
            Word color & size
          </span>
        </div>
        {words.some((w) => w.highlighted) && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[10px] font-semibold uppercase tracking-wider text-white/40 hover:text-white transition-colors"
            title="Remove highlight from every word"
          >
            Clear all
          </button>
        )}
      </div>

      {words.length === 0 ? (
        <div className="text-[10px] text-white/45 text-center py-2">
          Type some text in the field, then chips will appear here.
        </div>
      ) : (
        <div className="flex flex-wrap gap-1">
          {words.map((w) => {
            const isActive = selectedIdx === w.idx;
            const chipCol = chipColorOf(w);
            return (
              <button
                key={w.idx}
                type="button"
                onClick={() => toggleHighlight(w.idx)}
                className="px-2 py-1 rounded text-xs font-semibold transition-all hover:-translate-y-0.5"
                style={{
                  background: w.highlighted ? `${chipCol}33` : "rgba(255,255,255,0.04)",
                  color: w.highlighted ? chipCol : "rgba(255,255,255,0.78)",
                  border: `1px solid ${
                    isActive
                      ? "#ffffff80"
                      : w.highlighted
                      ? chipCol + "80"
                      : "rgba(255,255,255,0.08)"
                  }`,
                  boxShadow: w.highlighted ? `0 0 12px ${chipCol}40` : "none",
                  outline: isActive ? "1px solid rgba(255,255,255,0.35)" : "none",
                  outlineOffset: 2,
                }}
                title={
                  w.highlighted
                    ? "Click to edit this word's size & color"
                    : "Click to highlight this word"
                }
              >
                <span className="inline-flex items-center gap-1">
                  {w.text}
                  {w.size && (
                    <span
                      className="text-[8px] font-mono px-1 rounded"
                      style={{ background: chipCol + "33" }}
                    >
                      {w.size}
                    </span>
                  )}
                  {w.highlighted && (
                    <Settings2 className="w-2.5 h-2.5 opacity-60" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Per-word controls */}
      {selected && selected.highlighted && (
        <div
          className="mt-2 rounded-md p-2.5"
          style={{
            background: "rgba(131,127,251,0.08)",
            border: "1px solid rgba(131,127,251,0.25)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-white/50 uppercase tracking-wider font-bold text-[8px]">
                Editing
              </span>
              <span
                className="px-1.5 py-0.5 rounded font-bold text-[10px]"
                style={{ background: chipColorOf(selected) + "33", color: chipColorOf(selected) }}
              >
                {selected.text}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => updateWord(selected.idx, { size: undefined, color: undefined })}
                className="text-[9px] font-semibold uppercase tracking-wider text-white/45 hover:text-white px-1.5 py-0.5 rounded inline-flex items-center gap-0.5"
                title="Reset to Highlight Style defaults"
              >
                <RotateCcw className="w-2.5 h-2.5" /> Reset
              </button>
              <button
                type="button"
                onClick={() => removeHighlight(selected.idx)}
                className="text-[9px] font-semibold uppercase tracking-wider text-red-300/70 hover:text-red-300 px-1.5 py-0.5 rounded"
                title="Remove highlight from this word"
              >
                Unhighlight
              </button>
              <button
                type="button"
                onClick={() => setSelectedIdx(null)}
                className="p-0.5 rounded text-white/45 hover:text-white"
                title="Close"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Size */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-white/55">
                Size
              </span>
              <div
                className="flex items-center rounded overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    updateWord(selected.idx, {
                      size: clampSize((selected.size ?? hlBaseSize) - 4),
                    })
                  }
                  className="px-1.5 py-1 text-white/70 hover:text-white hover:bg-white/5"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <input
                  type="number"
                  min={MIN_SIZE}
                  max={MAX_SIZE}
                  value={selected.size ?? hlBaseSize}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (!Number.isNaN(n)) updateWord(selected.idx, { size: clampSize(n) });
                  }}
                  className="w-10 px-0.5 py-0.5 bg-transparent text-white text-xs text-center outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() =>
                    updateWord(selected.idx, {
                      size: clampSize((selected.size ?? hlBaseSize) + 4),
                    })
                  }
                  className="px-1.5 py-1 text-white/70 hover:text-white hover:bg-white/5"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
              {selected.size && (
                <button
                  type="button"
                  onClick={() => updateWord(selected.idx, { size: undefined })}
                  className="text-[8px] uppercase tracking-wider text-white/35 hover:text-white"
                  title="Use Highlight Style default size"
                >
                  default
                </button>
              )}
            </div>

            {/* Color */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
              <span className="text-[9px] font-bold uppercase tracking-wider text-white/55">
                Color
              </span>
              <div
                className="relative w-6 h-6 rounded overflow-hidden cursor-pointer group"
                style={{
                  background: selected.color || hlBaseColor,
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
                title="Pick color for this word"
              >
                <input
                  type="color"
                  value={selected.color || hlBaseColor}
                  onChange={(e) => updateWord(selected.idx, { color: e.target.value })}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-difference opacity-40 group-hover:opacity-100">
                  <Palette className="w-3 h-3 text-white" />
                </div>
              </div>
              <input
                type="text"
                value={selected.color || hlBaseColor}
                onChange={(e) => updateWord(selected.idx, { color: e.target.value })}
                className="w-16 px-1.5 py-0.5 rounded bg-white/5 text-white text-[10px] font-mono outline-none focus:ring-1 focus:ring-[#837FFB]/40"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              />
              {selected.color && (
                <button
                  type="button"
                  onClick={() => updateWord(selected.idx, { color: undefined })}
                  className="text-[8px] uppercase tracking-wider text-white/35 hover:text-white"
                  title="Use Highlight Style default color"
                >
                  default
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {value.trim() && (() => {
        const baseFs = baseStyle?.fontSize ?? 18;
        const previewFs = Math.min(baseFs, 24);
        const ratio = previewFs / baseFs;
        const scaledValue = value.replace(/\*\*([^*\n]+?)\*\*/g, (_full, inner: string) => {
          const { text, size, color } = parseHighlightInner(inner);
          const attrs: string[] = [];
          if (size) attrs.push(`s=${Math.round(size * ratio)}`);
          if (color) attrs.push(`c=${color}`);
          return attrs.length ? `**${text}|${attrs.join(";")}**` : `**${text}**`;
        });
        const scaledHl = highlightStyle
          ? {
              ...highlightStyle,
              fontSize: highlightStyle.fontSize
                ? Math.round(highlightStyle.fontSize * ratio)
                : highlightStyle.fontSize,
            }
          : undefined;
        return (
          <div
            className="mt-2.5 rounded px-2.5 py-2 overflow-hidden"
            style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">
              Live preview
            </div>
            <div
              style={{
                ...(baseStyle
                  ? { ...textStyleToCss(baseStyle), fontSize: `${previewFs}px` }
                  : { color: "#fff", fontSize: 18 }),
                lineHeight: 1.2,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              <MarkupText text={scaledValue} highlightStyle={scaledHl} />
            </div>
          </div>
        );
      })()}

      <p className="text-[9px] text-white/35 mt-2 leading-snug">
        Click chip → pick word. <span className="text-white/55">+/−</span> resize, color picker recolor.
      </p>
    </div>
  );
}
