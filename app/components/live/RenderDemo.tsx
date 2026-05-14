"use client";

import { useState, useMemo, useEffect } from "react";
import { encode, renderSVG } from "@msalia/rondel";
import { useTheme } from "@/app/components/ThemeProvider";

const DARK_THEMES = [
  { label: "Indigo", primary: "#6366f1", secondary: "#1e1b4b" },
  { label: "Mono", primary: "#d0d0d0", secondary: "#1a1a1a" },
  { label: "Emerald", primary: "#059669", secondary: "#064e3b" },
  { label: "Rose", primary: "#e11d48", secondary: "#4c0519" },
  { label: "Amber", primary: "#d97706", secondary: "#451a03" },
];

const LIGHT_THEMES = [
  { label: "Indigo", primary: "#4f46e5", secondary: "#e0e7ff" },
  { label: "Mono", primary: "#1a1a1a", secondary: "#e5e5e5" },
  { label: "Emerald", primary: "#059669", secondary: "#d1fae5" },
  { label: "Rose", primary: "#e11d48", secondary: "#ffe4e6" },
  { label: "Amber", primary: "#d97706", secondary: "#fef3c7" },
];

const SIZES = [120, 200, 300];

export default function RenderDemo() {
  const [mounted, setMounted] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);
  const [size, setSize] = useState(200);
  const { theme } = useTheme();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard
  useEffect(() => setMounted(true), []);

  const themes = theme === "dark" ? DARK_THEMES : LIGHT_THEMES;

  const results = useMemo(() => {
    if (!mounted) return themes.map(() => "");
    const code = encode("Rondel", { rings: 8, segmentsPerRing: 48, eccBytes: 8 });
    return themes.map((t) =>
      renderSVG(code, { size, primary: t.primary, secondary: t.secondary })
    );
  }, [size, mounted, themes]);

  return (
    <div className="live-demo">
      <span className="live-demo-label">Live Example — SVG Rendering</span>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Size</label>
            <div className="flex gap-1">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                    s === size
                      ? "border-accent text-foreground"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  {s}px
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          {themes.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setThemeIdx(i)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                i === themeIdx ? "border-accent" : "border-border hover:border-accent/30"
              }`}
            >
              <div dangerouslySetInnerHTML={{ __html: results[i].replace(/width="\d+"/, 'width="80"').replace(/height="\d+"/, 'height="80"') }} />
              <span className="text-xs text-muted">{t.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center p-4">
          <div className="rondel-glow" dangerouslySetInnerHTML={{ __html: results[themeIdx] }} />
        </div>
        <div className="text-xs text-muted">
          <p>Primary: <code className="text-accent">{themes[themeIdx].primary}</code> &middot; Secondary: <code className="text-accent">{themes[themeIdx].secondary}</code> &middot; Size: <code className="text-accent">{size}px</code></p>
        </div>
      </div>
    </div>
  );
}
