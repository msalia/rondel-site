# Architecture Decisions

Record important technical decisions here as the project evolves.
Each entry should include: context, decision, and consequences.

---

## ADR-001: Initial Tech Stack

- **Date:** 2026-05-14
- **Context:** Building a showcase and documentation site for the Rondel circular barcode library
- **Decision:** Next.js (App Router) with Tailwind CSS, importing `@msalia/rondel` from GitHub
- **Consequences:** The site both documents and demonstrates the library using live imports. Interactive generator runs client-side via `"use client"` components. Deployed on Dokploy with standalone Next.js output.

## ADR-002: @tensorflow/tfjs as Direct Dependency

- **Date:** 2026-05-14
- **Context:** Rondel's index.js eagerly imports its ML detector module which requires @tensorflow/tfjs, even when only using encode/render functions
- **Decision:** Install @tensorflow/tfjs directly in the site project despite only needing encode/render
- **Consequences:** Adds ~50MB to node_modules but avoids runtime errors. Tree-shaking removes unused code from the client bundle. Long-term fix would be lazy-loading the ML module in the library itself.

## ADR-003: Explicit Platform Binary Installs in Dockerfile

- **Date:** 2026-05-14
- **Context:** Tailwind CSS v4 uses `lightningcss` and `@tailwindcss/oxide` which ship native binaries as optional dependencies. `npm ci` does not install the correct platform-specific packages when the lock file was generated on a different OS (macOS → Linux Docker).
- **Decision:** Explicitly install `lightningcss-linux-x64-gnu` and `@tailwindcss/oxide-linux-x64-gnu` after `npm ci` in the Dockerfile.
- **Consequences:** Pinned versions in the Dockerfile must be updated when Tailwind/lightningcss versions change. The alternative (regenerating lock file on Linux) would require CI or a devcontainer.

## ADR-004: Rondel Package Ships Pre-built dist/

- **Date:** 2026-05-14
- **Context:** Installing `@msalia/rondel` from GitHub caused npm to clone the repo and run `npm install` inside it — installing devDependencies and optional peer deps including `canvas` (native C++ bindings requiring Python/node-gyp). This broke Docker builds on minimal images.
- **Decision:** Commit `dist/` to the rondel repo, remove `prepare` script, remove `canvas` from all dependency lists (keep as documented optional install for Node.js server-side rendering).
- **Consequences:** Contributors must run `npm run build` and commit `dist/` changes. Consumers get pre-built code with zero native build requirements.
