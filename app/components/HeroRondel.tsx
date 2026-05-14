"use client";

import { useMemo } from "react";
import { encode, renderSVG } from "@msalia/rondel";

export default function HeroRondel() {
  const svg = useMemo(() => {
    const code = encode("Rondel", {
      rings: 8,
      segmentsPerRing: 48,
      eccBytes: 16,
    });
    return renderSVG(code, {
      size: 280,
      primary: "#6366f1",
      secondary: "#1e1b4b",
    });
  }, []);

  return (
    <div
      className="rondel-glow animate-[spin_60s_linear_infinite]"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
