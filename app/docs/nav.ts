export interface NavItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const docsNav: NavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/getting-started" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Encoding", href: "/docs/encoding" },
      { title: "Rendering", href: "/docs/rendering" },
      { title: "Error Correction", href: "/docs/error-correction" },
    ],
  },
  {
    title: "Scanning",
    items: [
      { title: "Detection Pipeline", href: "/docs/scanning" },
    ],
  },
  {
    title: "Integrations",
    items: [
      { title: "React Hooks", href: "/docs/react" },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "API Reference", href: "/docs/api" },
      { title: "Benchmarks", href: "/docs/benchmarks" },
    ],
  },
];
