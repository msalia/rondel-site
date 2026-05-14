import Markdown from "@/app/components/Markdown";
import PrevNext from "@/app/components/docs/PrevNext";

const content = `
# Introduction

Rondel is a circular barcode format that encodes text into concentric ring patterns.
It includes encoding, rendering, ML-based detection, and Reed-Solomon error correction.

## What is a Rondel?

A Rondel is a 2D barcode arranged as concentric rings of arc segments around a central dot.
Each arc represents one bit — dark for 1, light for 0. The format is designed for:

- **Aesthetic integration** — circular codes blend naturally into designs, logos, and printed media
- **Robust scanning** — ML detection with Hough circle fallback, perspective correction, and multi-frame consensus
- **Error resilience** — Reed-Solomon coding over GF(256) corrects up to \`eccBytes / 2\` corrupted bytes

## Anatomy of a Rondel

Every rondel has three structural components:

1. **Center dot** — a solid circle at the geometric center, used as a detection anchor and for sub-pixel center refinement during scanning.
2. **Data rings** — concentric rings divided into arc segments. The number of segments per ring scales with circumference, keeping arc length constant so inner segments stay readable.
3. **Orientation ring** — the outermost ring contains a timing pattern (\`101010\`) and three asymmetric arcs (large/medium/short) that encode rotation angle, reflection state, and polarity.

## Quick Example

\`\`\`typescript
import { encode, renderSVG } from "@msalia/rondel";

// Encode text into a circular code
const code = encode("Hello, world!", {
  rings: 5,
  segmentsPerRing: 48,
  eccBytes: 16,
});

// Render as SVG
const svg = renderSVG(code, {
  size: 400,
  primary: "#1a237e",
  secondary: "#c5cae9",
});

document.body.innerHTML = svg;
\`\`\`

## Architecture

| Module | Purpose |
|--------|---------|
| \`core/\` | Encoding, decoding, bitstream operations, layout math, and mode detection |
| \`ecc/\` | Reed-Solomon error correction over GF(256) with Berlekamp-Massey decoding |
| \`render/\` | SVG and Canvas rendering with color theming |
| \`scan/\` | ML detection, Hough fallback, perspective correction, polar sampling, and consensus |
| \`react/\` | React hook for camera-based scanning with multi-frame consensus |
`;

export default function DocsIntro() {
  return (
    <>
      <Markdown>{content}</Markdown>
      <PrevNext current="/docs" />
    </>
  );
}
