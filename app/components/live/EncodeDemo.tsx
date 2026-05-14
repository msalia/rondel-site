"use client";

import { useState, useMemo } from "react";
import { encode, renderSVG, detectMode } from "@msalia/rondel";
import { useTheme } from "@/app/components/ThemeProvider";

export default function EncodeDemo() {
  const [text, setText] = useState("Hello!");
  const [rings, setRings] = useState(8);
  const [segments, setSegments] = useState(48);
  const [eccBytes, setEccBytes] = useState(8);
  const { theme } = useTheme();

  const result = useMemo(() => {
    if (!text.trim()) return null;
    try {
      const mode = detectMode(text);
      const code = encode(text, { rings, segmentsPerRing: segments, eccBytes });
      const svg = renderSVG(code, {
        size: 200,
        primary: theme === "dark" ? "#6366f1" : "#4f46e5",
        secondary: theme === "dark" ? "#1e1b4b" : "#e0e7ff",
      });
      return {
        mode: mode === 0 ? "NUMERIC" : mode === 1 ? "ALPHANUMERIC" : "BYTE",
        totalBits: code.bits.length,
        dataBits: code.bits.filter((b: number) => b === 1).length,
        rings: code.rings,
        segments: code.segmentsPerRing,
        svg,
      };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Encoding failed" };
    }
  }, [text, rings, segments, eccBytes, theme]);

  return (
    <div className="live-demo">
      <span className="live-demo-label">Live Example</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-muted mb-1">Text to encode</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-muted mb-1">Rings</label>
              <select
                value={rings}
                onChange={(e) => setRings(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              >
                {[3, 4, 5, 6, 7, 8].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Segments</label>
              <select
                value={segments}
                onChange={(e) => setSegments(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              >
                {[32, 48, 64, 80].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">ECC</label>
              <select
                value={eccBytes}
                onChange={(e) => setEccBytes(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
              >
                {[4, 8, 16, 24, 32].map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>
          {result && !("error" in result) && (
            <div className="text-xs space-y-1 text-muted">
              <p>Mode: <code className="text-accent">{result.mode}</code></p>
              <p>Total bits: <code className="text-accent">{result.totalBits}</code></p>
              <p>Layout: <code className="text-accent">{result.rings} rings &times; {result.segments} segments</code></p>
            </div>
          )}
          {result && "error" in result && (
            <p className="text-xs text-red-400">{result.error}</p>
          )}
        </div>
        <div className="flex items-center justify-center">
          {result && !("error" in result) && (
            <div className="rondel-glow" dangerouslySetInnerHTML={{ __html: result.svg }} />
          )}
        </div>
      </div>
    </div>
  );
}
