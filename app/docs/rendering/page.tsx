"use client";

import Markdown from "@/app/components/Markdown";
import PrevNext from "@/app/components/docs/PrevNext";
import RenderDemo from "@/app/components/live/RenderDemo";

const intro = `
# Rendering

Rondel provides SVG and Canvas renderers for displaying encoded circular codes.

## SVG Rendering

The primary renderer produces an SVG string. SVG output is resolution-independent,
compact, and ideal for web display and print.

\`\`\`typescript
import { encode, renderSVG } from "@msalia/rondel";

const code = encode("Hello!", { rings: 5, segmentsPerRing: 48, eccBytes: 8 });

const svg = renderSVG(code, {
  size: 400,         // viewport size in pixels
  primary: "#1a237e", // arc/dot color
  secondary: "#c5cae9", // background ring color
});

document.getElementById("container").innerHTML = svg;
\`\`\`

### SVG Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`size\` | \`number\` | \`300\` | SVG viewport width and height |
| \`primary\` | \`string\` | \`"#000"\` | Color for active arcs and the center dot |
| \`secondary\` | \`string\` | \`"#ccc"\` | Color for inactive arcs (background rings) |

The renderer merges consecutive 1-bits into single SVG arc strokes with round line caps,
producing clean, minimal SVG output. You can also pass a plain number to \`renderSVG()\`
as a shorthand for \`{ size: number }\`.
`;

const afterDemo = `
## Canvas Rendering

For raster output or when you need a \`HTMLCanvasElement\`, use \`renderCanvas()\`.
Internally this renders the SVG and draws it to a canvas.

\`\`\`typescript
import { encode, renderCanvas } from "@msalia/rondel";

const code = encode("Canvas output", { rings: 5, segmentsPerRing: 48, eccBytes: 8 });
const canvas = renderCanvas(code, 400);

document.body.appendChild(canvas);
\`\`\`

> **Note:** \`renderCanvas()\` always uses black/gray colors.
> For custom colors, use \`renderSVG()\` with color options and render the SVG
> string to a canvas yourself via an \`Image\` element.

## Using SVG in React

Since \`renderSVG()\` returns a string, use \`dangerouslySetInnerHTML\` to inject it:

\`\`\`tsx
import { useMemo } from "react";
import { encode, renderSVG } from "@msalia/rondel";

function RondelDisplay({ text }: { text: string }) {
  const svg = useMemo(() => {
    const code = encode(text, { rings: 5, segmentsPerRing: 48, eccBytes: 8 });
    return renderSVG(code, { size: 300, primary: "#6366f1", secondary: "#1e1b4b" });
  }, [text]);

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}
\`\`\`

## Download as File

To let users download a rondel as an SVG file:

\`\`\`typescript
const blob = new Blob([svg], { type: "image/svg+xml" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "rondel.svg";
a.click();
URL.revokeObjectURL(url);
\`\`\`

## API

\`\`\`typescript
// Render to SVG string
renderSVG(code: EncodedCode, opts?: SVGRenderOptions | number): string

// Render to canvas element
renderCanvas(code: EncodedCode, size?: number): HTMLCanvasElement
\`\`\`
`;

export default function RenderingPage() {
  return (
    <>
      <Markdown>{intro}</Markdown>
      <RenderDemo />
      <Markdown>{afterDemo}</Markdown>
      <PrevNext current="/docs/rendering" />
    </>
  );
}
