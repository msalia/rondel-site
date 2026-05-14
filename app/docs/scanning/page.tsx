"use client";

import Markdown from "@/app/components/Markdown";
import PrevNext from "@/app/components/docs/PrevNext";
import ScannerDemo from "@/app/components/live/ScannerDemo";

const intro = `
# Detection Pipeline

Rondel's scanning pipeline takes raw pixel data and produces decoded text through
a multi-stage process: detect, rectify, orient, sample, and decode.

## Pipeline Overview

The full scanning pipeline runs through these stages:

1. **Capture** — acquire a frame from a video stream or image as an \`ImageBuffer\`
2. **Detect** — locate the circular code in the frame using ML or Hough circle detection
3. **Resolve corners** — compute 4 corner points from the detection bounding box with padding
4. **Perspective warp** — apply 4-point homography to rectify the code to a square image
5. **Center refinement** — sub-pixel refinement of the center dot position
6. **Orientation analysis** — read the asymmetric outer ring to determine rotation, reflection, and polarity
7. **Validation** — verify that the image contains a valid circular code structure
8. **Polar grid sampling** — sample each ring segment's brightness with adaptive thresholding
9. **Reed-Solomon decode** — error-correct and decode the bit array to text

## Detection Methods

### ML Detection (Primary)

The primary detector is a YOLOv8n-Pose model trained on circular codes.
It takes a 320×320 input image and predicts bounding boxes with 4 corner keypoints
for each detected code.

\`\`\`typescript
import { loadModel, detectWithModel } from "@msalia/rondel";

// Load the YOLO model (once at startup)
await loadModel("/models/circular_code/model.json");

// Detect codes in a frame
const detections = detectWithModel(imageBuffer);
// Returns: { x, y, width, height, confidence, corners: Point[] }[]
\`\`\`

### Hough Circle Detection (Fallback)

When the ML model is not available, Rondel falls back to classical Hough circle detection.
This finds circular shapes in the image and estimates the code boundary from them.

## Scanning Functions

### scanFrame

The all-in-one function that runs the full pipeline on a single frame:

\`\`\`typescript
import { scanFrame } from "@msalia/rondel";

const result = scanFrame(imageBuffer, {
  rings: 5,
  segmentsPerRing: 48,
  eccBytes: 16,
});

if (result.decoded) {
  console.log("Found:", result.decoded);
}
\`\`\`
`;

const afterDemo = `
### scanFromVideo

For continuous scanning from a video stream with multi-frame consensus:

\`\`\`typescript
import { scanFromVideo } from "@msalia/rondel";

const video = document.querySelector("video");
const text = await scanFromVideo(video, {
  rings: 5,
  segmentsPerRing: 48,
  eccBytes: 16,
  consensusSize: 7,     // rolling buffer size
  consensusRequired: 3, // matching frames needed
  timeout: 30000,       // max scan time in ms
});

console.log("Decoded:", text);
\`\`\`

## Perspective Correction

When a code is photographed at an angle, the circular shape appears as an ellipse.
Rondel corrects this using 4-point homography:

1. The detector provides 4 corner keypoints (or they're estimated from the bounding box)
2. \`solveHomography()\` computes a 3×3 transformation matrix mapping the corners to a square
3. \`warpPerspective()\` applies the transformation to produce a rectified image

\`\`\`typescript
import { resolveCorners, solveHomography, warpPerspective } from "@msalia/rondel";

const corners = resolveCorners(detection, 1.15); // 15% padding
const H = solveHomography(corners, [
  { x: 0, y: 0 }, { x: size, y: 0 },
  { x: size, y: size }, { x: 0, y: size },
]);
const rectified = warpPerspective(frame, corners, size);
\`\`\`

## Orientation Recovery

The outermost ring contains an asymmetric pattern with three arcs of different lengths
(large, medium, short) separated by a timing pattern (\`101010\`). The orientation
analyzer reads this ring to determine:

- **Rotation angle** — the angular offset from the reference position
- **Reflection state** — whether the code has been horizontally flipped
- **Polarity** — whether dark and light are inverted

## Multi-Frame Consensus

For camera-based scanning, single-frame decoding can be unreliable due to motion blur
and focus issues. The \`MultiFrameConsensus\` class maintains a rolling buffer
of recent decode results and only reports a match when enough frames agree:

\`\`\`typescript
import { MultiFrameConsensus } from "@msalia/rondel";

const consensus = new MultiFrameConsensus(7); // buffer size

// On each frame:
consensus.add(decodeResult);
const match = consensus.getConsensus(3); // require 3 matching frames
if (match) {
  console.log("Confirmed:", match);
}
\`\`\`

## Frame Quality

Not all frames are worth decoding. The \`scoreFrame()\` function evaluates
sharpness and contrast around the detected code to skip low-quality frames:

\`\`\`typescript
import { scoreFrame } from "@msalia/rondel";

const score = scoreFrame(imageBuffer, centerX, centerY, radius);
if (score.overall >= 0.3) {
  // Frame is worth decoding
}
\`\`\`
`;

export default function ScanningPage() {
  return (
    <>
      <Markdown>{intro}</Markdown>
      <ScannerDemo />
      <Markdown>{afterDemo}</Markdown>
      <PrevNext current="/docs/scanning" />
    </>
  );
}
