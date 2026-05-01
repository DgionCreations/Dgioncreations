import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { ICONS, ICON_KEYS, type IconKey } from "@/content/icons";

/**
 * IconSelect — popover-style icon picker. Shows the currently-selected icon
 * plus a chevron; clicking opens a grid of every icon in the registry, each
 * rendered in its own shape so the user picks visually rather than by name.
 */
export default function IconSelect({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: IconKey;
  onChange: (v: IconKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = (ICONS[value] ?? ICONS["sparkles" as IconKey])?.component;

  return (
    <div className="relative">
      {label && (
        <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-white/45 mb-1.5">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white text-sm outline-none focus:ring-2 focus:ring-[#837FFB]/40"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {SelectedIcon && <SelectedIcon className="w-4 h-4 text-[#837FFB] shrink-0" />}
        <span className="flex-1 text-left truncate">
          {ICONS[value]?.label ?? value}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* Click-outside scrim */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute left-0 right-0 mt-1 z-40 rounded-lg max-h-80 overflow-y-auto p-2"
            style={{
              background: "#0D0B24",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div className="grid grid-cols-8 gap-1">
              {ICON_KEYS.map((key) => {
                const Icon = ICONS[key].component;
                const isActive = key === value;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      onChange(key);
                      setOpen(false);
                    }}
                    title={ICONS[key].label}
                    className="relative aspect-square rounded-md flex items-center justify-center transition-colors"
                    style={{
                      background: isActive ? "rgba(131,127,251,0.25)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isActive ? "rgba(131,127,251,0.5)" : "rgba(255,255,255,0.06)"}`,
                      color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                        e.currentTarget.style.color = "#fff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                      }
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {isActive && (
                      <Check className="absolute top-0.5 right-0.5 w-2.5 h-2.5 text-[#837FFB]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
