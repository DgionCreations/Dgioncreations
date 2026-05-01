import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Silence benign Spline/Three chatter — WebGL is gracefully handled in splite.tsx
const block = /WebGL context|Error creating WebGL|Multiple instances of Three|CONTEXT_LOST_WEBGL|Context (Lost|Restored)|THREE\.WebGLRenderer|updating from \d+ to \d+|\[Spline\]/i;
const _err = console.error.bind(console);
const _warn = console.warn.bind(console);
const _log = console.log.bind(console);
const isBlocked = (args: unknown[]) => args.some(a => typeof a === "string" && block.test(a));
console.error = (...a: unknown[]) => { if (isBlocked(a)) return; _err(...a); };
console.warn = (...a: unknown[]) => { if (isBlocked(a)) return; _warn(...a); };
console.log = (...a: unknown[]) => { if (isBlocked(a)) return; _log(...a); };
window.addEventListener("error", (e) => { if (e.message && block.test(e.message)) e.preventDefault(); }, true);

createRoot(document.getElementById("root")!).render(<App />);