import Link from "next/link";
import HeroRondel from "@/app/components/HeroRondel";
import Generator from "@/app/components/Generator";
import CodeBlock from "@/app/components/CodeBlock";

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
          A circular barcode format with ML detection, perspective correction,
          and Reed-Solomon error correction.
        </p>

        <div className="mt-6 flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2.5 font-mono text-sm">
          <span className="text-muted">$</span>
          <span>npm install github:msalia/rondel</span>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/docs"
            className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Documentation
          </Link>
          <a
            href="#playground"
            className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-muted hover:text-foreground hover:border-accent/50 transition-colors"
          >
            Playground
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent/10 text-accent mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1.5">Encode Anything</h3>
              <p className="text-sm text-muted leading-relaxed">
                Text, URLs, data — auto-selects numeric, alphanumeric, or byte encoding for optimal density.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent/10 text-accent mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1.5">ML Detection</h3>
              <p className="text-sm text-muted leading-relaxed">
                YOLOv8n-Pose model with 4-corner keypoints. Hough circle fallback when offline.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent/10 text-accent mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1.5">Error Resilient</h3>
              <p className="text-sm text-muted leading-relaxed">
                Reed-Solomon over GF(256) corrects damaged bytes. Configurable from light to maximum protection.
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent/10 text-accent mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m7 8-4 4 4 4" />
                  <path d="m17 8 4 4-4 4" />
                  <path d="m14 4-4 16" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1.5">React Ready</h3>
              <p className="text-sm text-muted leading-relaxed">
                Camera scanning hook with multi-frame consensus. Tree-shakeable — import only what you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Quick Start</h2>
          <p className="mt-4 text-muted leading-relaxed">
            Just pass your text — rings, segments, and error correction are auto-selected:
          </p>
          <CodeBlock language="typescript">{`import { encode, renderSVG } from "@msalia/rondel";

// Auto-sizes for the smallest code with optimal error correction
const code = encode("https://example.com");

const svg = renderSVG(code, {
  size: 400,
  primary: "#1a237e",
  secondary: "#c5cae9",
});`}</CodeBlock>

          <h3 className="text-lg font-semibold mt-10 mb-3">
            Scan from Camera
          </h3>
          <CodeBlock language="tsx">{`import { useCircularScanner } from "@msalia/rondel";

function Scanner() {
  const { videoRef, result } = useCircularScanner({
    rings: 5, segmentsPerRing: 48, eccBytes: 16,
    modelUrl: "/models/circular_code/model.json",
  });

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      {result && <p>Found: {result.data}</p>}
    </div>
  );
}`}</CodeBlock>

          <div className="mt-6 flex gap-3">
            <Link
              href="/docs/getting-started"
              className="text-sm text-accent hover:underline"
            >
              Full installation guide &rarr;
            </Link>
            <Link
              href="/docs/api"
              className="text-sm text-accent hover:underline"
            >
              API reference &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Playground */}
      <section id="playground" className="px-6 py-20 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Playground</h2>
          <p className="text-muted mb-8">
            Encode text and customize the output in real time.
          </p>
          <Generator />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-muted">
          <p>Rondel</p>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="hover:text-foreground transition-colors">
              Docs
            </Link>
            <a
              href="https://github.com/msalia/rondel"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
