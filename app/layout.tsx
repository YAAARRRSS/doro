import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doro ou Vovo",
  description: "Prototype swipe dating app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="relative min-h-screen overflow-hidden">
        {/* --- Fond dégradé + watermark logo --- */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
        >
          {/* Dégradé doux */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-fuchsia-100 to-sky-100" />
          {/* Watermark centré */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[12vw] md:text-[8vw] font-extrabold tracking-tight text-black/5 select-none">
              Doro&nbsp;ou&nbsp;Vovo
            </div>
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
