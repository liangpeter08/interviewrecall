import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { GlobalShortcuts } from "@/components/GlobalShortcuts";
import { SiteNav } from "@/components/SiteNav";
import { site } from "@/lib/site";
import { themeBootScript } from "@/lib/storage-key";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${site.name} — Python syntax reference`, template: `%s · ${site.name}` },
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#111213" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="brand">
              <span className="brand-mark" aria-hidden="true">
                py
              </span>
              {site.name}
            </Link>
            <SiteNav />
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <span>Syntax, not solutions. Use during interviews only where reference material is permitted.</span>
          <span>
            Press <kbd>?</kbd> for shortcuts
          </span>
        </footer>
        <GlobalShortcuts />
      </body>
    </html>
  );
}
