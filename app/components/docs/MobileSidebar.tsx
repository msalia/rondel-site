"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/app/docs/nav";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted border border-border rounded-md hover:text-foreground transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 4h12v1.5H2V4zm0 3.25h12v1.5H2v-1.5zm0 3.25h12V12H2v-1.5z" />
        </svg>
        Menu
      </button>
      {open && (
        <nav className="mt-3 p-4 bg-card border border-border rounded-lg space-y-4">
          {docsNav.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                {group.title}
              </h4>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                          active
                            ? "text-accent bg-accent/10 font-medium"
                            : "text-muted hover:text-foreground"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      )}
    </div>
  );
}
