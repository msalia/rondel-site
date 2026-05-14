import Markdown from "@/app/components/Markdown";
import PrevNext from "@/app/components/docs/PrevNext";

const content = `
# API Reference

Complete reference for all exported functions, types, and constants.

## Encoding & Decoding

### encode

\`\`\`typescript
encode(input: string, opts?: CircularCodeOptions): EncodedCode
\`\`\`

Encodes text into a circular code. Automatically selects the optimal encoding mode (numeric, alphanumeric, or byte). Appends a version/length header and Reed-Solomon parity bytes.

### decode

\`\`\`typescript
decode(bits: number[], eccBytes?: number): string
\`\`\`

Decodes a bit array back to text with Reed-Solomon error correction.

### detectMode

\`\`\`typescript
detectMode(input: string): ModeType
\`\`\`

Returns the optimal encoding mode: \`0\` (NUMERIC), \`1\` (ALPHANUMERIC), or \`2\` (BYTE).

### bytesToBits / bitsToBytes

\`\`\`typescript
bytesToBits(bytes: Iterable<number>): number[]
bitsToBytes(bits: number[]): Uint8Array
\`\`\`

Convert between byte arrays and bit arrays.

### rsEncode / rsDecode

\`\`\`typescript
rsEncode(data: number[], eccBytes: number): number[]
rsDecode(received: number[], eccBytes: number): number[]
\`\`\`

Low-level Reed-Solomon encode/decode. \`rsEncode\` appends parity bytes; \`rsDecode\` corrects errors in-place.

## Rendering

### renderSVG

\`\`\`typescript
renderSVG(code: EncodedCode, opts?: SVGRenderOptions | number): string
\`\`\`

Renders an encoded circular code to an SVG string. Pass a number as shorthand for \`{ size: number }\`.

### renderCanvas

\`\`\`typescript
renderCanvas(code: EncodedCode, size?: number): HTMLCanvasElement
\`\`\`

Renders to an HTML canvas element (always black/gray).

## Scanning

### scanFrame

\`\`\`typescript
scanFrame(source: ImageBuffer, options?: ScanFrameOptions): ScanFrameResult
\`\`\`

Full detection-to-decode pipeline on a single frame.

### scanFromVideo

\`\`\`typescript
scanFromVideo(video: HTMLVideoElement, options?: ScanOptions): Promise<string>
\`\`\`

Continuous scanning from a video stream with multi-frame consensus. Returns a promise that resolves when a code is confirmed or times out.

### processFrame

\`\`\`typescript
processFrame(video: HTMLVideoElement, options?: ScanOptions): ScanResult | null
\`\`\`

Process a single frame from a video element. Returns \`null\` if no code is detected.

### detectCode

\`\`\`typescript
detectCode(buf: ImageBuffer): DetectionResult
\`\`\`

Detect circular codes in an image using the ML model or Hough circle fallback.

### rectifyCode

\`\`\`typescript
rectifyCode(
  frame: ImageBuffer,
  detection: DetectionResult,
  rings: number,
  outputSize?: number,
  segmentsPerRing?: number
): RectifyResult
\`\`\`

Warp, validate, and orient a detected code.

### sampleAndDecode

\`\`\`typescript
sampleAndDecode(
  frame: ImageBuffer,
  detection: DetectionResult,
  rings: number,
  segments: number,
  eccBytes: number,
  outputSize?: number
): string
\`\`\`

End-to-end single-frame decode from detection result.

### resolveCorners

\`\`\`typescript
resolveCorners(detection: DetectionResult, padding?: number): Point[]
\`\`\`

Compute 4 corners from a detection result with optional padding (default 1.15).

### Perspective & Geometry

\`\`\`typescript
solveHomography(src: Point[], dst: Point[]): number[]
warpPerspective(src: ImageBuffer, corners: Point[], outputSize: number): ImageBuffer
estimateCircleCorners(cx: number, cy: number, r: number, padding?: number, angle?: number): Point[]
flipHorizontal(buf: ImageBuffer): ImageBuffer
\`\`\`

### Orientation & Validation

\`\`\`typescript
analyzeOrientation(buf: ImageBuffer, rings: number, size: number, ...): OrientationAnalysis
validateCircularCode(buf: ImageBuffer, rings: number, size: number, ...): ValidationResult
\`\`\`

### Sampling & Consensus

\`\`\`typescript
samplePolarGrid(
  frame: ImageBuffer, cx: number, cy: number,
  codeSize: number, rings: number, segs: number,
  angle: number, inverted: boolean
): number[]

scoreFrame(buf: ImageBuffer, cx: number, cy: number, r: number): FrameScore

// Multi-frame consensus
new MultiFrameConsensus(bufferSize: number)
  .add(result: string): void
  .getConsensus(required: number): string | null
\`\`\`

## ML Detection

\`\`\`typescript
loadModel(modelPath?: string): Promise<void>
loadModelFromFiles(json: ArrayBuffer, specs: object, data: ArrayBuffer): Promise<void>
isModelLoaded(): boolean
getLoadedModel(): Model | null
detectWithModel(buf: ImageBuffer): DetectionResult[]
runModelPrediction(model: Model, input: Tensor): Tensor
parseDetections(...): DetectionResult[]

MODEL_INPUT_SIZE = 320
\`\`\`

## React

\`\`\`typescript
useCircularScanner(options?: ScanOptions): {
  videoRef: RefObject<HTMLVideoElement>;
  result: { data: string } | null;
  scanning: boolean;
}
\`\`\`

## Image Utilities

\`\`\`typescript
getOrCreateCanvas(size: number, key?: string, ctxOptions?: object): HTMLCanvasElement
createBuffer(w: number, h: number): ImageBuffer
canvasToBuffer(canvas: HTMLCanvasElement): ImageBuffer
bufferToCanvas(buf: ImageBuffer): HTMLCanvasElement
captureFrameToBuffer(video: HTMLVideoElement, size?: number): ImageBuffer
flipBufferHorizontal(buf: ImageBuffer): ImageBuffer
toGrayscale(data: Uint8ClampedArray, pixelCount: number): Uint8Array
\`\`\`

## Types

\`\`\`typescript
interface CircularCodeOptions {
  rings?: number;          // default: 5
  segmentsPerRing?: number; // default: 48
  eccBytes?: number;       // default: 4
}

interface EncodedCode {
  bits: number[];
  rings: number;
  segmentsPerRing: number;
}

interface SVGRenderOptions {
  size?: number;    // default: 300
  primary?: string;  // default: "#000"
  secondary?: string; // default: "#ccc"
}

interface ImageBuffer {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

interface Point { x: number; y: number; }

interface DetectionResult {
  x: number; y: number;
  width: number; height: number;
  confidence: number;
  corners?: Point[];
}

interface ScanOptions {
  rings?: number;
  segmentsPerRing?: number;
  eccBytes?: number;
  modelUrl?: string;
  consensusSize?: number;     // default: 7
  consensusRequired?: number; // default: 3
  timeout?: number;           // default: 30000
}

interface ScanFrameResult {
  decoded: string | null;
  detection: DetectionResult | null;
  confidence: number;
}

type ModeType = 0 | 1 | 2;  // NUMERIC | ALPHANUMERIC | BYTE
\`\`\`

## Constants

| Constant | Value | Description |
|----------|-------|-------------|
| \`DEFAULT_RINGS\` | 5 | Default number of data rings |
| \`DEFAULT_SEGMENTS_PER_RING\` | 48 | Default base segments |
| \`DEFAULT_ECC_BYTES\` | 4 | Default parity bytes |
| \`DEFAULT_CODE_SIZE\` | 300 | Default render size (px) |
| \`DEFAULT_CAPTURE_SIZE\` | 320 | Default capture resolution |
| \`CONFIDENCE_THRESHOLD\` | 0.5 | ML detection confidence threshold |
| \`DEFAULT_CORNER_PADDING\` | 1.15 | Corner padding multiplier |
| \`DEFAULT_MIN_FRAME_SCORE\` | 0.3 | Min frame quality to attempt decode |
| \`DEFAULT_CONSENSUS_SIZE\` | 7 | Rolling buffer size |
| \`DEFAULT_CONSENSUS_REQUIRED\` | 3 | Frames needed for consensus |
| \`SCAN_TIMEOUT_MS\` | 30000 | Default scan timeout |
`;

export default function APIReferencePage() {
  return (
    <>
      <Markdown>{content}</Markdown>
      <PrevNext current="/docs/api" />
    </>
  );
}
