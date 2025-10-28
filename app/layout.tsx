import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Doro ou Vovo",
  description: "Prototype swipe app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-white">
        {/* Header simple */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-black/5">
          <nav className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold tracking-wide">Doro ou Vovo</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="hover:underline">Accueil</Link>
              <Link href="/profile" className="hover:underline">Profil</Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-6 flex items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
