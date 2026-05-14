"use client";

import { useState, useMemo } from "react";
import { encode, decode, renderSVG } from "@msalia/rondel";
import { useTheme } from "@/app/components/ThemeProvider";

export default function ECCDemo() {
  const [eccBytes, setEccBytes] = useState(8);
  const [corruptCount, setCorruptCount] = useState(0);
  const { theme } = useTheme();

  const result = useMemo(() => {
    const text = "Rondel";
    try {
      const code = encode(text, { eccBytes });
      const maxCorrectable = Math.floor(eccBytes / 2);
      const bits = [...code.bits];

      for (let i = 0; i < corruptCount * 8 && i < bits.length; i++) {
        const idx = 16 + i * 3;
        if (idx < bits.length) bits[idx] = bits[idx] === 1 ? 0 : 1;
      }

      let decoded: string | null = null;
      let decodeError: string | null = null;
      try {
        decoded = decode(bits, eccBytes);
      } catch (e) {
        decodeError = e instanceof Error ? e.message : "Decode failed";
      }

      const svg = renderSVG(code, {
        size: 180,
        primary: theme === "dark" ? "#6366f1" : "#4f46e5",
        secondary: theme === "dark" ? "#1e1b4b" : "#e0e7ff",
      });

      return {
        original: text,
        decoded,
        decodeError,
        maxCorrectable,
        corruptedBits: Math.min(corruptCount * 8, bits.length),
        success: decoded === text,
        svg,
      };
    } catch {
      return null;
    }
  }, [eccBytes, corruptCount, theme]);

  return (
    <div className="live-demo">
      <span className="live-demo-label">Live Example — Error Correction</span>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">ECC Bytes</label>
            <select
              value={eccBytes}
              onChange={(e) => { setEccBytes(Number(e.target.value)); setCorruptCount(0); }}
              className="w-full bg-background border border-border rounded-lg px-2 py-2 text-sm text-foreground focus:outline-none focus:border-accent"
            >
              {[2, 4, 6, 8].map((e) => (
                <option key={e} value={e}>{e} bytes (corrects {Math.floor(e / 2)})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">
              Corrupt bytes: {corruptCount}
            </label>
            <input
              type="range"
              min={0}
              max={Math.floor(eccBytes / 2) + 3}
              value={corruptCount}
              onChange={(e) => setCorruptCount(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
        </div>
        {result && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="bg-background border border-border rounded-lg px-3 py-2.5">
                <span className="text-xs text-muted">Original</span>
                <p className="font-mono text-sm text-foreground truncate">{result.original}</p>
              </div>
              <div className={`bg-background border rounded-lg px-3 py-2.5 ${
                result.success ? "border-emerald-800" : result.decodeError ? "border-red-800" : "border-border"
              }`}>
                <span className="text-xs text-muted">Decoded</span>
                <p className={`font-mono text-sm truncate ${
                  result.success ? "text-emerald-400" : result.decodeError ? "text-red-400" : "text-foreground"
                }`}>
                  {result.decoded ?? result.decodeError}
                </p>
              </div>
              <div className="flex gap-3 text-xs text-muted">
                <span>Corrupted: <code className="text-accent">{corruptCount} bytes</code></span>
                <span>Max correctable: <code className="text-accent">{result.maxCorrectable} bytes</code></span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="rondel-glow" dangerouslySetInnerHTML={{ __html: result.svg }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
