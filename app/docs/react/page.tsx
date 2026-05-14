import Markdown from "@/app/components/Markdown";
import PrevNext from "@/app/components/docs/PrevNext";

const content = `
# React Hooks

Rondel provides a React hook for camera-based scanning with built-in multi-frame consensus.

## useCircularScanner

The \`useCircularScanner\` hook manages the full camera scanning lifecycle:
opening the camera stream, running detection on each frame, applying consensus voting,
and returning the decoded result.

\`\`\`tsx
import { useCircularScanner } from "@msalia/rondel";

function Scanner() {
  const { videoRef, result, scanning } = useCircularScanner({
    rings: 5,
    segmentsPerRing: 48,
    eccBytes: 16,
    modelUrl: "/models/circular_code/model.json",
  });

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      {scanning && <p>Scanning...</p>}
      {result && <p>Found: {result.data}</p>}
    </div>
  );
}
\`\`\`

## Options

The hook accepts a \`ScanOptions\` object:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`rings\` | \`number\` | \`5\` | Number of data rings to scan for |
| \`segmentsPerRing\` | \`number\` | \`48\` | Base segments per ring |
| \`eccBytes\` | \`number\` | \`4\` | Reed-Solomon parity bytes |
| \`modelUrl\` | \`string\` | — | URL to the YOLO model JSON file |
| \`consensusSize\` | \`number\` | \`7\` | Rolling buffer size for consensus |
| \`consensusRequired\` | \`number\` | \`3\` | Matching frames needed to confirm |
| \`timeout\` | \`number\` | \`30000\` | Max scan time in milliseconds |

## Return Value

| Property | Type | Description |
|----------|------|-------------|
| \`videoRef\` | \`RefObject<HTMLVideoElement>\` | Ref to attach to a \`<video>\` element |
| \`result\` | \`{ data: string } \\| null\` | Decoded result when consensus is reached |
| \`scanning\` | \`boolean\` | Whether the scanner is actively processing frames |

## How It Works

The hook runs this loop internally:

1. Opens the device camera via \`getUserMedia\` and attaches the stream to the video element
2. On each \`requestAnimationFrame\`, captures the video frame to an \`ImageBuffer\`
3. Runs \`scanFrame()\` to detect, rectify, and decode the circular code
4. Feeds each decode result into a \`MultiFrameConsensus\` buffer
5. When enough frames agree (default: 3 of 7), sets the \`result\`
6. Cleans up the camera stream on unmount

> **Peer dependency:** \`useCircularScanner\` requires React 19+.
> The hook is tree-shakeable — importing only \`encode\`/\`renderSVG\`
> does not pull in React or TensorFlow.js.

## Full Example

\`\`\`tsx
"use client";

import { useState } from "react";
import { useCircularScanner } from "@msalia/rondel";

export default function ScanPage() {
  const [active, setActive] = useState(false);

  const { videoRef, result, scanning } = useCircularScanner(
    active
      ? {
          rings: 5,
          segmentsPerRing: 48,
          eccBytes: 16,
          modelUrl: "/models/circular_code/model.json",
        }
      : undefined
  );

  return (
    <div className="space-y-4">
      <button onClick={() => setActive(!active)}>
        {active ? "Stop" : "Start"} Scanner
      </button>

      {active && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full max-w-md rounded-lg"
        />
      )}

      {scanning && <p>Looking for a rondel...</p>}

      {result && (
        <div className="p-4 bg-green-900/30 rounded-lg">
          <p className="font-mono">{result.data}</p>
        </div>
      )}
    </div>
  );
}
\`\`\`

## Using Without React

If you're not using React, you can build your own scanning loop with the lower-level functions:

\`\`\`typescript
import {
  scanFromVideo,
  processFrame,
  MultiFrameConsensus,
  captureFrameToBuffer,
} from "@msalia/rondel";

// Option 1: One-shot scan from video
const text = await scanFromVideo(videoElement, {
  rings: 5,
  segmentsPerRing: 48,
  eccBytes: 16,
});

// Option 2: Manual frame loop
const consensus = new MultiFrameConsensus(7);

function loop() {
  const buf = captureFrameToBuffer(video, 320);
  const result = processFrame(video, { rings: 5, segmentsPerRing: 48, eccBytes: 16 });

  if (result) {
    consensus.add(result.data);
    const match = consensus.getConsensus(3);
    if (match) {
      console.log("Decoded:", match);
      return;
    }
  }
  requestAnimationFrame(loop);
}
loop();
\`\`\`
`;

export default function ReactPage() {
  return (
    <>
      <Markdown>{content}</Markdown>
      <PrevNext current="/docs/react" />
    </>
  );
}
