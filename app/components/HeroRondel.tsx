"use client";

import { useMemo, useState, useEffect } from "react";
import { encode, renderSVG } from "@msalia/rondel";
import { useTheme } from "@/app/components/ThemeProvider";

export default function HeroRondel() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard
  useEffect(() => setMounted(true), []);

  const svg = useMemo(() => {
    if (!mounted) return "";
    const code = encode("Rondel", {
      rings: 8,
      segmentsPerRing: 48,
      eccBytes: 16,
    });
    return renderSVG(code, {
      size: 280,
      primary: theme === "dark" ? "#6366f1" : "#4f46e5",
      secondary: theme === "dark" ? "#1e1b4b" : "#e0e7ff",
    });
  }, [mounted, theme]);

  if (!mounted) {
    return <div className="w-[280px] h-[280px]" />;
  }

  return (
    <div
      className="rondel-glow animate-[spin_60s_linear_infinite]"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
