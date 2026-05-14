"use client";

import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@/app/components/ThemeProvider";

export default function CodeBlock({
  children,
  language,
  copyText,
}: {
  children: string;
  language?: string;
  copyText?: string;
}) {
  const [copied, setCopied] = useState(false);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText ?? children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lang =
    language === "tsx"
      ? "tsx"
      : language === "bash"
        ? "bash"
        : language === "text"
          ? "text"
          : "typescript";

  return (
    <div className="relative group my-4 border border-border rounded-lg overflow-hidden">
      {language && (
        <div
          className="flex items-center px-4 py-1.5 border-b border-border"
          style={{ background: isDark ? "#0a0a12" : "#f0f0f4" }}
        >
          <span className="text-[11px] text-muted/60 font-mono">{language}</span>
        </div>
      )}
      <SyntaxHighlighter
        language={lang}
        style={style}
        customStyle={codeStyle}
        codeTagProps={{ style: { fontFamily: "var(--font-geist-mono)" } }}
      >
        {children}
      </SyntaxHighlighter>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2 py-1 text-[11px] rounded bg-card/80 border border-border text-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
