"use client";

import { useState, useMemo, useEffect } from "react";
import { encode, decode, renderSVG } from "@msalia/rondel";
import { useTheme } from "@/app/components/ThemeProvider";

export default function ScannerDemo() {
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState("Scan me!");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState<number | null>(null);
  const [decoded, setDecoded] = useState<string | null>(null);

  const { theme } = useTheme();
  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard
  useEffect(() => setMounted(true), []);

  const { svg, code } = useMemo(() => {
    if (!mounted || !text.trim()) return { svg: "", code: null };
    try {
      const c = encode(text);
      const s = renderSVG(c, {
        size: 200,
        primary: theme === "dark" ? "#6366f1" : "#4f46e5",
        secondary: theme === "dark" ? "#1e1b4b" : "#e0e7ff",
      });
      return { svg: s, code: c };
    } catch {
      return { svg: "", code: null };
    }
  }, [text, mounted, theme]);

  const steps = [
    "Detecting code in frame...",
    "Resolving corners & perspective warp...",
    "Analyzing orientation ring...",
    "Sampling polar grid (8 rings × 48 segments)...",
    "Running Reed-Solomon decode...",
  ];

  const handleScan = () => {
    if (!code) return;
    setRunning(true);
    setDecoded(null);
    setStep(0);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setStep(i);
      } else {
        clearInterval(interval);
        try {
          const result = decode(code.bits, code.eccBytes);
          setDecoded(result);
        } catch (e) {
          setDecoded(`Error: ${e instanceof Error ? e.message : "decode failed"}`);
        }
        setStep(null);
        setRunning(false);
      }
    }, 400);
  };

  return (
    <div className="live-demo">
      <span className="live-demo-label">Live Example — Scanning Pipeline</span>
      <div className="space-y-4">
        <p className="text-xs text-muted">
          This demo simulates the scanning pipeline stages on an encoded rondel,
          running the actual Reed-Solomon decode on the bit data.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted mb-1">Text to encode &amp; scan</label>
              <input
                type="text"
                value={text}
                onChange={(e) => { setText(e.target.value); setDecoded(null); setStep(null); }}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <button
              onClick={handleScan}
              disabled={running || !code}
              className="px-4 py-2 text-sm rounded-lg bg-accent text-white hover:bg-accent/90 disabled:opacity-50 transition-colors"
            >
              {running ? "Scanning..." : "Run Pipeline"}
            </button>
          </div>
          <div className="flex items-center justify-center">
            {svg && <div className="rondel-glow" dangerouslySetInnerHTML={{ __html: svg }} />}
          </div>
        </div>

        {step !== null && (
          <div className="bg-background border border-border rounded-lg px-3 py-2.5 space-y-1">
            {steps.map((s, i) => (
              <p key={i} className={`text-xs font-mono ${i < step ? "text-emerald-400" : i === step ? "text-accent animate-pulse" : "text-muted/30"}`}>
                {i < step ? "✓" : i === step ? "▸" : " "} {s}
              </p>
            ))}
          </div>
        )}

        {decoded && (
          <div className="bg-background border border-emerald-800 rounded-lg px-3 py-2.5">
            <span className="text-xs text-muted">Decoded result</span>
            <p className="font-mono text-sm text-emerald-400">{decoded}</p>
          </div>
        )}
      </div>
    </div>
  );
}
