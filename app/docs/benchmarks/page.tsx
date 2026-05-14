import Markdown from "@/app/components/Markdown";
import PrevNext from "@/app/components/docs/PrevNext";

const content = `
# Benchmarks

Performance benchmarks measured on Apple M-series, Node.js, single-threaded.
773 tests across 24 test files verify correctness across all configurations.

## Encoding Pipeline

| Operation | p50 | p95 | ops/s |
|-----------|-----|-----|-------|
| \`encode\` (string → bits) | 0.01ms | 0.02ms | 118,000+ |
| \`rsEncode\` (payload → codeword) | <0.01ms | <0.01ms | 452,000+ |
| \`rsDecode\` (no errors) | <0.01ms | <0.01ms | 400,000+ |
| \`rsDecode\` (2 byte errors) | 0.02ms | 0.06ms | 41,000+ |
| \`decode\` (bits → string) | 0.01ms | 0.01ms | 118,000+ |
| \`bytesToBits\` / \`bitsToBytes\` | <0.01ms | <0.01ms | 347,000+ |

Encoding and decoding are sub-millisecond — fast enough to run inline on every keystroke
without any perceptible delay.

## Rendering

| Operation | p50 | p95 | ops/s |
|-----------|-----|-----|-------|
| \`renderSVG\` (300px) | 0.02ms | 0.03ms | 50,000+ |
| \`renderSVG\` (600px) | 0.02ms | 0.02ms | 57,000+ |

SVG rendering is resolution-independent and extremely fast. The renderer merges consecutive
1-bits into single arc strokes, keeping the SVG path count low.

## Scan Pipeline

Each stage of the scanning pipeline, measured independently:

| Operation | p50 | p95 | ops/s |
|-----------|-----|-----|-------|
| \`toGrayscale\` (300×300) | 0.24ms | 0.26ms | 4,100+ |
| \`solveHomography\` | 0.02ms | 0.02ms | 62,000+ |
| \`warpPerspective\` (→300px) | 1.73ms | 1.94ms | 577+ |
| \`refineCenterFromDot\` | 0.27ms | 0.30ms | 3,700+ |
| \`analyzeOrientation\` | 0.84ms | 0.94ms | 1,187+ |
| \`validateCircularCode\` | 0.26ms | 0.30ms | 3,800+ |
| \`scoreFrame\` | 0.51ms | 0.64ms | 1,968+ |
| \`samplePolarGrid\` | 0.07ms | 0.16ms | 13,400+ |
| \`detectCircle\` (Hough, 320px) | 6.41ms | 6.65ms | 156+ |

The pipeline bottleneck is \`warpPerspective\` — bilinear interpolation over ~90K pixels.
Hough circle detection is the slowest individual stage but is only used as a fallback
when the ML model is not loaded.

## End-to-End

| Operation | p50 | p95 | ops/s |
|-----------|-----|-----|-------|
| \`scanFrame\` (known detection) | 3.4ms | 4.4ms | ~297 |
| Full roundtrip (encode → render → rasterize → scan) | 3.9ms | 5.0ms | ~259 |

With known detection (skipping Hough), the full decode pipeline runs at **~297 fps** —
nearly 10x faster than the 30 fps camera rate. This leaves ample headroom for
frame scoring, consensus voting, and UI rendering.

## Capacity

Grid capacity in characters by configuration. Byte mode shown first, alphanumeric in parentheses.
ECC = 2 bytes (corrects 1 byte error):

| Rings | 32 segments | 48 segments |
|-------|-------------|-------------|
| 4 | 5 (6) | 10 (14) |
| 5 | 8 (10) | 13 (18) |
| 6 | 10 (14) | 16 (22) |
| 7 | 12 (16) | 20 (28) |
| 8 | 14 (20) | 23 (32) |

With ECC = 8 bytes (corrects 4 byte errors), subtract 6 from the byte-mode column.
Numeric mode is even more efficient — approximately 2.4x the byte-mode capacity.

## Auto-Sizing

When \`encode()\` is called without explicit parameters, it auto-selects the optimal
configuration. Here's what it picks for common inputs:

| Input | Rings | Segments | ECC | Used/Capacity |
|-------|-------|----------|-----|---------------|
| \`"Hi"\` | 4 | 48 | 8 | 96/112 bits |
| \`"hello"\` | 4 | 48 | 8 | 112/112 bits |
| \`"1234567890"\` | 4 | 48 | 7 | 112/112 bits |
| \`"https://example.com"\` | 6 | 48 | 4 | 160/160 bits |

The auto-sizer minimizes rings first (smallest visual code), then maximizes
ECC with the remaining capacity. It searches across segment candidates [32, 48]
and constrains rings to [4, 8] and ECC to [2, 8] bytes.

## Test Coverage

| Area | Tests |
|------|-------|
| Encoding / decoding / modes | 80+ |
| Auto-sizing (all permutations) | 40+ |
| Layout geometry | 34 |
| Reed-Solomon codec | 48 |
| SVG rendering | 14 |
| Scan pipeline | 406 |
| Benchmarks | 21 |
| End-to-end roundtrips | 130+ |
| **Total** | **773** |
`;

export default function BenchmarksPage() {
  return (
    <>
      <Markdown>{content}</Markdown>
      <PrevNext current="/docs/benchmarks" />
    </>
  );
}
