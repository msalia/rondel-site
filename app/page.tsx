import HeroRondel from "./components/HeroRondel";
import Generator from "./components/Generator";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pt-24 pb-20">
        <HeroRondel />
        <h1 className="mt-10 text-5xl font-bold tracking-tight sm:text-6xl">
          Rondel
        </h1>
        <p className="mt-4 max-w-xl text-center text-lg text-muted leading-relaxed">
          A circular barcode format that encodes text into concentric ring
          patterns. ML detection, perspective correction, and Reed-Solomon error
          correction built in.
        </p>
        <div className="mt-8 flex gap-4">
          <a
            href="#try"
            className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Try it
          </a>
          <a
            href="https://github.com/msalia/rondel"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground hover:border-accent/50 transition-colors"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* What is it */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">
            What is a Rondel?
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            A 2D barcode arranged as concentric rings of arc segments around a
            central dot. Each arc represents one bit — dark for 1, light for 0.
            The code is read by identifying the center, determining orientation,
            and sampling each segment&apos;s brightness.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-2">Center Dot</h3>
              <p className="text-sm text-muted leading-relaxed">
                Solid circle at the geometric center. Used as a detection anchor
                and for sub-pixel center refinement during scanning.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-2">Data Rings</h3>
              <p className="text-sm text-muted leading-relaxed">
                Each ring is divided into arc segments that scale with
                circumference. Inner rings get fewer segments, outer rings get
                more — keeping arc length constant.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-2">Orientation Ring</h3>
              <p className="text-sm text-muted leading-relaxed">
                Outermost ring with an asymmetric pattern that encodes rotation
                angle, reflection state, and polarity for reliable scanning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>

          <div className="mt-10 space-y-10">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 text-accent text-sm font-bold">
                  1
                </span>
                Encode
              </h3>
              <p className="mt-2 text-muted leading-relaxed ml-10">
                Text is converted to UTF-8 bytes, wrapped with a version and
                length header, then protected with Reed-Solomon parity bytes.
                The byte stream becomes a bit array mapped to ring segments
                starting from ring 1.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 text-accent text-sm font-bold">
                  2
                </span>
                Render
              </h3>
              <p className="mt-2 text-muted leading-relaxed ml-10">
                The SVG renderer draws concentric arcs — merging consecutive
                1-bits into single strokes with round line caps. The layout math
                maintains constant arc length across all rings so inner segments
                stay readable.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 text-accent text-sm font-bold">
                  3
                </span>
                Detect
              </h3>
              <p className="mt-2 text-muted leading-relaxed ml-10">
                A YOLOv8n-Pose model predicts bounding boxes and 4 corner
                keypoints for each detected code. Falls back to Hough circle
                detection when the model is unavailable.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 text-accent text-sm font-bold">
                  4
                </span>
                Decode
              </h3>
              <p className="mt-2 text-muted leading-relaxed ml-10">
                Perspective correction via 4-point homography, center
                refinement, orientation recovery from the asymmetric ring,
                polar-grid sampling with adaptive thresholds, and Reed-Solomon
                error correction to recover the original text.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Try it */}
      <section id="try" className="px-6 py-20 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Try It</h2>
          <Generator />
        </div>
      </section>

      {/* Install */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Install</h2>
          <pre className="code-block mt-6 font-mono">
            <code>npm install github:msalia/rondel</code>
          </pre>

          <h3 className="text-lg font-semibold mt-10 mb-4">Quick Start</h3>
          <pre className="code-block font-mono">
            <code>{`import { encode, renderSVG } from "@msalia/rondel";

const code = encode("Hello, world!", {
  rings: 5,
  segmentsPerRing: 48,
  eccBytes: 16,
});

const svg = renderSVG(code, {
  size: 400,
  primary: "#1a237e",
  secondary: "#c5cae9",
});`}</code>
          </pre>

          <h3 className="text-lg font-semibold mt-10 mb-4">
            Scan from Camera (React)
          </h3>
          <pre className="code-block font-mono">
            <code>{`import { useCircularScanner } from "@msalia/rondel";

function Scanner() {
  const { videoRef, result } = useCircularScanner({
    modelUrl: "/models/circular_code/model.json",
  });

  return (
    <div>
      <video ref={videoRef} />
      {result && <p>Found: {result.data}</p>}
    </div>
  );
}`}</code>
          </pre>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="font-mono text-accent">~280 fps</p>
              <p className="text-muted mt-1">Decode speed (known detection)</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="font-mono text-accent">685 tests</p>
              <p className="text-muted mt-1">Across 24 test files</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="font-mono text-accent">GF(256)</p>
              <p className="text-muted mt-1">Reed-Solomon error correction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border text-center text-sm text-muted">
        <p>
          Rondel is{" "}
          <a
            href="https://github.com/msalia/rondel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-accent transition-colors"
          >
            open source
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
