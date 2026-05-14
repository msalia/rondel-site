"use client";

import Markdown from "@/app/components/Markdown";
import PrevNext from "@/app/components/docs/PrevNext";
import EncodeDemo from "@/app/components/live/EncodeDemo";

const intro = `
# Installation

Get up and running with Rondel in under a minute.

## Install

Install the package from GitHub:

\`\`\`bash
npm install github:msalia/rondel
\`\`\`

If your project uses TensorFlow.js for ML-based scanning, also install the peer dependency:

\`\`\`bash
npm install @tensorflow/tfjs
\`\`\`

## Basic Usage

Just pass your text — Rondel auto-selects the optimal rings, segments, and error correction:

\`\`\`typescript
import { encode, renderSVG } from "@msalia/rondel";

const code = encode("https://example.com");
const svg = renderSVG(code, { size: 400 });
\`\`\`

The returned \`code\` includes the auto-detected configuration:

\`\`\`typescript
code.rings           // 6 (auto-selected)
code.segmentsPerRing // 48 (auto-selected)
code.eccBytes        // 4 (auto-selected, fills remaining capacity)
\`\`\`

You can also pin any parameter and let the rest auto-size:

\`\`\`typescript
const code = encode("Hello!", { eccBytes: 8 });
// rings and segmentsPerRing are auto-selected
\`\`\`
`;

const afterDemo = `
## Configuration Options

All options are optional. When omitted, the encoder auto-sizes for the smallest code
with optimal error correction.

| Option | Type | Auto behavior |
|--------|------|---------------|
| \`rings\` | \`number\` | Fewest rings that fit (4-8) |
| \`segmentsPerRing\` | \`number\` | Best from [32, 48] |
| \`eccBytes\` | \`number\` | Fills remaining capacity (2-8) |

> **Tip:** For most use cases, just call \`encode(text)\` with no options.
> The auto-sizer picks the smallest code with the most error correction.

## Decode

To decode a bit array back to the original text, pass the same \`eccBytes\`:

\`\`\`typescript
import { encode, decode } from "@msalia/rondel";

const code = encode("Test");
const text = decode(code.bits, code.eccBytes);
console.log(text); // "Test"
\`\`\`

## Auto-Size Without Encoding

To preview the configuration without encoding:

\`\`\`typescript
import { autoSize } from "@msalia/rondel";

const result = autoSize("https://example.com");
// { rings: 6, segmentsPerRing: 48, eccBytes: 4, capacityBits: 160, usedBits: 160 }
\`\`\`

## Next Steps

- Learn about [encoding modes](/docs/encoding) — numeric, alphanumeric, and byte
- Customize output with [SVG and Canvas rendering](/docs/rendering)
- Understand [Reed-Solomon error correction](/docs/error-correction)
- Add camera scanning with [React hooks](/docs/react)
- See [benchmarks](/docs/benchmarks) — 297 fps decode, 773 tests
`;

export default function GettingStarted() {
  return (
    <>
      <Markdown>{intro}</Markdown>
      <EncodeDemo />
      <Markdown>{afterDemo}</Markdown>
      <PrevNext current="/docs/getting-started" />
    </>
  );
}
