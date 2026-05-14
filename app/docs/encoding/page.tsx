"use client";

import Markdown from "@/app/components/Markdown";
import PrevNext from "@/app/components/docs/PrevNext";
import ModesDemo from "@/app/components/live/ModesDemo";
import RoundtripDemo from "@/app/components/live/RoundtripDemo";

const intro = `
# Encoding

How Rondel converts text into a bit stream mapped to ring segments.

## Encoding Pipeline

The encoding process follows these steps:

1. **Mode detection** — the input text is analyzed to determine the most efficient encoding mode
2. **Mode-specific packing** — characters are converted to bits using the selected mode
3. **Header prepend** — a version byte and length header are added
4. **Reed-Solomon** — parity bytes are appended for error correction
5. **Layout mapping** — the byte stream becomes a bit array mapped to ring segments starting from ring 1

## Encoding Modes

Rondel automatically selects the most efficient encoding mode for the input text via \`detectMode()\`.
Three modes are supported:

### Numeric Mode

Groups of 3 digits are packed into 10 bits. This is the most space-efficient mode for
pure numeric strings like phone numbers or IDs.

| Input | Bits | Ratio |
|-------|------|-------|
| 3 digits | 10 bits | 3.33 bits/char |

### Alphanumeric Mode

Pairs of characters from a 45-character set (A-Z, 0-9, space, and 8 special characters:
\`$ % * + - . / :\`) are packed into 11 bits. Rondel uses a V2 header format
that preserves case for all-lowercase inputs.

| Input | Bits | Ratio |
|-------|------|-------|
| 2 chars | 11 bits | 5.5 bits/char |

### Byte Mode

Raw UTF-8 encoding — each byte maps directly to 8 bits. This is the fallback mode
for any text that contains characters outside the alphanumeric charset.

| Input | Bits | Ratio |
|-------|------|-------|
| 1 byte | 8 bits | 8 bits/byte |
`;

const afterModes = `
## Layout Geometry

The bit array is mapped to concentric rings starting from ring 1 (ring 0 is the center dot).
Each ring's segment count scales with its circumference:

\`\`\`text
segments_i = round(baseSegments × (i + 1) / rings)
\`\`\`

This ensures constant arc length across all rings — inner rings get fewer segments,
outer rings get more — so every segment stays readable at any scale.

## The Encode/Decode Roundtrip

The \`encode()\` and \`decode()\` functions are designed as a symmetric pair.
Given the same ECC configuration, decoding the bit array produced by \`encode()\`
always recovers the original text.

\`\`\`typescript
import { encode, decode } from "@msalia/rondel";

const text = "Hello, Rondel!";
const code = encode(text, { rings: 5, segmentsPerRing: 48, eccBytes: 16 });
const decoded = decode(code.bits, 16);

console.log(decoded === text); // true
\`\`\`
`;

const api = `
## API

\`\`\`typescript
// Encode text to a circular code
encode(input: string, opts?: CircularCodeOptions): EncodedCode

// Decode a bit array back to text
decode(bits: number[], eccBytes?: number): string

// Detect the optimal encoding mode for a string
detectMode(input: string): ModeType  // 0=NUMERIC, 1=ALPHANUMERIC, 2=BYTE

// Low-level bitstream conversion
bytesToBits(bytes: Iterable<number>): number[]
bitsToBytes(bits: number[]): Uint8Array
\`\`\`
`;

export default function EncodingPage() {
  return (
    <>
      <Markdown>{intro}</Markdown>
      <ModesDemo />
      <Markdown>{afterModes}</Markdown>
      <RoundtripDemo />
      <Markdown>{api}</Markdown>
      <PrevNext current="/docs/encoding" />
    </>
  );
}
