# Local Setup

## Prerequisites

- Node.js 20+
- npm
- git
- gh CLI (authenticated)

## Getting Started

1. Clone the repo:
   ```bash
   git clone git@github.com:msalia/rondel-site.git
   cd rondel-site
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Project Structure

```
rondel-site/
  app/
    layout.tsx          Root layout with Geist fonts and dark theme
    page.tsx            Main showcase page (hero, docs, generator, install)
    globals.css         Tailwind theme and custom styles
    components/
      HeroRondel.tsx    Animated rondel in the hero section
      Generator.tsx     Interactive encoder with controls and SVG output
  docs/                 Project documentation
  public/               Static assets
  Dockerfile            Multi-stage production build
  next.config.ts        Next.js config with standalone output
  empty-module.js       Browser shim for Node.js-only imports
  CLAUDE.md             Project context for Claude Code
```
