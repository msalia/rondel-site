import Link from "next/link";
import { docsNav, type NavItem } from "@/app/docs/nav";

const flatItems: NavItem[] = docsNav.flatMap((g) => g.items);

export default function PrevNext({ current }: { current: string }) {
  const idx = flatItems.findIndex((item) => item.href === current);
  const prev = idx > 0 ? flatItems[idx - 1] : null;
  const next = idx < flatItems.length - 1 ? flatItems[idx + 1] : null;

  return (
    <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
      {prev ? (
        <Link href={prev.href} className="group">
          <span className="text-sm text-muted">Previous</span>
          <div className="flex items-center gap-1.5 text-foreground group-hover:text-accent transition-colors">
            <span className="text-muted group-hover:text-accent transition-colors">&lsaquo;</span>
            <span className="font-medium">{prev.title}</span>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link href={next.href} className="group text-right">
          <span className="text-sm text-muted">Next</span>
          <div className="flex items-center gap-1.5 text-foreground group-hover:text-accent transition-colors">
            <span className="font-medium">{next.title}</span>
            <span className="text-muted group-hover:text-accent transition-colors">&rsaquo;</span>
          </div>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
