"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/app/docs/nav";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-6">
      <nav className="space-y-6">
        {docsNav.map((group) => (
          <div key={group.title}>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              {group.title}
            </h4>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block py-1.5 text-sm transition-colors ${
                        active
                          ? "text-accent font-medium"
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
    </aside>
  );
}
