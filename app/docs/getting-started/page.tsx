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

Import the functions you need and encode some text:

\`\`\`typescript
import { encode, renderSVG } from "@msalia/rondel";

const code = encode("Hello, world!", {
  rings: 5,           // number of data rings
  segmentsPerRing: 48, // base segments per ring
  eccBytes: 16,        // Reed-Solomon error correction bytes
});

const svg = renderSVG(code, { size: 400 });
\`\`\`
`;

const afterDemo = `
## Configuration Options

The \`encode()\` function accepts a \`CircularCodeOptions\` object:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`rings\` | \`number\` | \`5\` | Number of data rings (3-8) |
| \`segmentsPerRing\` | \`number\` | \`48\` | Base segments per ring |
| \`eccBytes\` | \`number\` | \`4\` | Reed-Solomon parity bytes |

> **Tip:** More rings and segments increase data capacity but make each arc smaller.
> For printed media viewed at a distance, use fewer rings (3-5) with more segments (48-64).
> For digital displays, you can safely use up to 8 rings with 80 segments.

## Decode

To decode a bit array back to the original text:

\`\`\`typescript
import { encode, decode } from "@msalia/rondel";

const code = encode("Test", { rings: 5, segmentsPerRing: 48, eccBytes: 16 });
const text = decode(code.bits, 16);
console.log(text); // "Test"
\`\`\`

## Next Steps

- Learn about [encoding modes](/docs/encoding) — numeric, alphanumeric, and byte
- Customize output with [SVG and Canvas rendering](/docs/rendering)
- Understand [Reed-Solomon error correction](/docs/error-correction)
- Add camera scanning with [React hooks](/docs/react)
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
