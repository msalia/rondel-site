"use client";

import { useState, useMemo } from "react";
import { encode, renderSVG } from "@msalia/rondel";

const PRESETS = [
  { label: "URL", text: "https://rondel.dev" },
  { label: "Email", text: "hello@example.com" },
  { label: "Short", text: "Hi!" },
  { label: "Long", text: "The quick brown fox jumps over the lazy dog" },
];

const COLORS = [
  { label: "Indigo", primary: "#4f46e5", secondary: "#312e81" },
  { label: "Mono", primary: "#000000", secondary: "#d0d0d0" },
  { label: "Emerald", primary: "#059669", secondary: "#064e3b" },
  { label: "Rose", primary: "#e11d48", secondary: "#4c0519" },
  { label: "Amber", primary: "#d97706", secondary: "#451a03" },
];

export default function Generator() {
  const [text, setText] = useState("https://rondel.dev");
  const [rings, setRings] = useState(8);
  const [segments, setSegments] = useState(64);
  const [eccBytes, setEccBytes] = useState(16);
  const [size, setSize] = useState(380);
  const [colorIdx, setColorIdx] = useState(0);

  const { svg, stats, error } = useMemo(() => {
    if (!text.trim()) return { svg: "", stats: null, error: null };
    try {
      const code = encode(text, {
        rings,
        segmentsPerRing: segments,
        eccBytes,
      });
      const color = COLORS[colorIdx];
      const svgStr = renderSVG(code, {
        size,
        primary: color.primary,
        secondary: color.secondary,
      });

      return {
        svg: svgStr,
        error: null,
        stats: {
          totalBits: code.bits.length,
          dataBits: code.bits.filter((b: number) => b === 1).length,
          rings: code.rings,
          segments: code.segmentsPerRing,
          eccBytes,
          correctable: Math.floor(eccBytes / 2),
        },
      };
    } catch (e) {
      return {
        svg: "",
        stats: null,
        error: e instanceof Error ? e.message : "Encoding failed",
      };
    }
  }, [text, rings, segments, eccBytes, size, colorIdx]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Controls */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm text-muted mb-1.5">Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-3.5 py-2.5 text-foreground focus:outline-none focus:border-accent transition-colors"
            placeholder="Enter text to encode..."
          />
          <div className="flex gap-2 mt-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setText(p.text)}
                className="px-2.5 py-1 text-xs rounded-md bg-card border border-border text-muted hover:text-foreground hover:border-accent/50 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">Rings</label>
            <select
              value={rings}
              onChange={(e) => setRings(Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:border-accent"
            >
              {[3, 4, 5, 6, 7, 8].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">Segments</label>
            <select
              value={segments}
              onChange={(e) => setSegments(Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:border-accent"
            >
              {[32, 48, 64, 80].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1.5">ECC Bytes</label>
            <select
              value={eccBytes}
              onChange={(e) => setEccBytes(Number(e.target.value))}
              className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:border-accent"
            >
              {[8, 16, 24, 32].map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1.5">Color</label>
          <div className="flex gap-2">
            {COLORS.map((c, i) => (
              <button
                key={c.label}
                onClick={() => setColorIdx(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-colors ${
                  i === colorIdx
                    ? "border-accent text-foreground"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: c.primary }}
                />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-card border border-border rounded-lg px-3.5 py-2.5">
              <span className="text-muted">Capacity</span>
              <p className="font-mono text-foreground">{stats.totalBits} bits</p>
            </div>
            <div className="bg-card border border-border rounded-lg px-3.5 py-2.5">
              <span className="text-muted">Error correction</span>
              <p className="font-mono text-foreground">
                {stats.correctable} bytes
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-950/50 border border-red-900 rounded-lg px-3.5 py-2.5 text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Rondel Output */}
      <div className="flex flex-col items-center">
        <div
          className="rondel-glow"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        {svg && (
          <button
            onClick={() => {
              const blob = new Blob([svg], { type: "image/svg+xml" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "rondel.svg";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="mt-4 px-4 py-2 text-sm rounded-lg border border-border text-muted hover:text-foreground hover:border-accent/50 transition-colors"
          >
            Download SVG
          </button>
        )}
      </div>
    </div>
  );
}
