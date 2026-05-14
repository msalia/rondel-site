"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@/app/components/ThemeProvider";

export default function Markdown({ children }: { children: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard
  useEffect(() => setMounted(true), []);

  const isDark = !mounted || theme === "dark";
  const style = isDark ? oneDark : oneLight;

  const codeStyle: React.CSSProperties = {
    background: isDark ? "#0f0f13" : "#f8f8fa",
    margin: 0,
    padding: "1rem 1.25rem",
    fontSize: "0.875rem",
    lineHeight: 1.6,
    border: "none",
    borderRadius: 0,
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const code = String(children).replace(/\n$/, "");

          if (!match) {
            return <code {...props}>{children}</code>;
          }

          return (
            <div className="my-4 border border-border rounded-lg overflow-hidden">
              <div
                className="flex items-center px-4 py-1.5 border-b border-border"
                style={{ background: isDark ? "#0a0a12" : "#f0f0f4" }}
              >
                <span className="text-[11px] text-muted/60 font-mono">{match[1]}</span>
              </div>
              <SyntaxHighlighter
                language={match[1]}
                style={style}
                customStyle={codeStyle}
                codeTagProps={{ style: { fontFamily: "var(--font-geist-mono)" } }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          );
        },
        pre({ children }) {
          return <>{children}</>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
