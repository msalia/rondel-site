import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/app/components/Nav";
import ThemeProvider from "@/app/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rondel — Circular Barcode Format",
  description:
    "Encode text into concentric ring patterns. ML detection, perspective correction, and Reed-Solomon error correction.",
};

const themeScript = `
(function(){
  var t = localStorage.getItem('theme');
  if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', t === 'dark');
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{themeScript}</Script>
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <Nav />
          <div className="pt-14">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
