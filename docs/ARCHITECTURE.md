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
