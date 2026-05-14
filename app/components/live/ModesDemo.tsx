"use client";

import { useState, useMemo } from "react";
import { detectMode, encode } from "@msalia/rondel";

const EXAMPLES = [
  { label: "Numeric", text: "3141592653" },
  { label: "Alphanumeric", text: "HELLO WORLD" },
  { label: "Byte", text: "Hello, world!" },
  { label: "Unicode", text: "Rondel" },
];

const MODE_NAMES: Record<number, string> = { 0: "NUMERIC", 1: "ALPHANUMERIC", 2: "BYTE" };
const MODE_DESCRIPTIONS: Record<number, string> = {
  0: "3 digits → 10 bits. Most efficient for pure numbers.",
  1: "2 chars → 11 bits. Supports A-Z, 0-9, and 9 special characters.",
  2: "1 byte → 8 bits. Raw UTF-8 encoding for any text.",
};

export default function ModesDemo() {
  const [text, setText] = useState("Hello, world!");

  const result = useMemo(() => {
    if (!text.trim()) return null;
    try {
      const mode = detectMode(text);
      const code = encode(text, { rings: 8, segmentsPerRing: 48, eccBytes: 4 });
      const utf8Bytes = new TextEncoder().encode(text).length;
      return {
        mode,
        modeName: MODE_NAMES[mode],
        description: MODE_DESCRIPTIONS[mode],
        totalBits: code.bits.length,
        textBytes: utf8Bytes,
      };
    } catch {
      return null;
    }
  }, [text]);

  return (
    <div className="live-demo">
      <span className="live-demo-label">Live Example — Encoding Modes</span>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Try different inputs</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
          />
          <div className="flex gap-2 mt-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setText(ex.text)}
                className="px-2.5 py-1 text-xs rounded-md border border-border text-muted hover:text-foreground hover:border-accent/30 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
        {result && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-background border border-border rounded-lg px-3 py-2.5">
              <span className="text-xs text-muted">Detected Mode</span>
              <p className="font-mono text-accent">{result.modeName}</p>
            </div>
            <div className="bg-background border border-border rounded-lg px-3 py-2.5">
              <span className="text-xs text-muted">Input Size</span>
              <p className="font-mono text-foreground">{result.textBytes} bytes</p>
            </div>
            <div className="bg-background border border-border rounded-lg px-3 py-2.5">
              <span className="text-xs text-muted">Encoded Bits</span>
              <p className="font-mono text-foreground">{result.totalBits} bits</p>
            </div>
          </div>
        )}
        {result && (
          <p className="text-xs text-muted">{result.description}</p>
        )}
      </div>
    </div>
  );
}
