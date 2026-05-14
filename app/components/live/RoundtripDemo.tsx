"use client";

import { useState, useMemo } from "react";
import { encode, decode } from "@msalia/rondel";

export default function RoundtripDemo() {
  const [text, setText] = useState("Hello, Rondel!");

  const result = useMemo(() => {
    if (!text.trim()) return null;
    try {
      const code = encode(text, { rings: 8, segmentsPerRing: 48, eccBytes: 8 });
      const decoded = decode(code.bits, 8);
      return {
        encoded: code.bits.slice(0, 64).map((b: number) => b).join(""),
        totalBits: code.bits.length,
        decoded,
        match: decoded === text,
      };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Failed" };
    }
  }, [text]);

  return (
    <div className="live-demo">
      <span className="live-demo-label">Live Example — Encode / Decode Roundtrip</span>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Input text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        {result && !("error" in result) && (
          <div className="space-y-2">
            <div className="bg-background border border-border rounded-lg px-3 py-2.5">
              <span className="text-xs text-muted">Bit stream (first 64 bits)</span>
              <p className="font-mono text-sm text-foreground tracking-wider break-all">
                {result.encoded}
                {result.totalBits > 64 && <span className="text-muted">... ({result.totalBits} total)</span>}
              </p>
            </div>
            <div className={`bg-background border rounded-lg px-3 py-2.5 ${result.match ? "border-emerald-800" : "border-red-800"}`}>
              <span className="text-xs text-muted">Decoded output</span>
              <p className={`font-mono text-sm ${result.match ? "text-emerald-400" : "text-red-400"}`}>
                {result.decoded}
              </p>
            </div>
            <p className="text-xs text-muted">
              {result.match
                ? "Roundtrip successful — decoded output matches input exactly."
                : "Mismatch detected."}
            </p>
          </div>
        )}
        {result && "error" in result && (
          <p className="text-xs text-red-400">{result.error}</p>
        )}
      </div>
    </div>
  );
}
