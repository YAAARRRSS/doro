import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "Doro ou Vovo",
  description: "Prototype swipe dating app",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${poppins.className} relative min-h-screen overflow-hidden`}>
        {/* Fond clair neutre */}
        <div className="fixed inset-0 -z-20 bg-gradient-to-br from-white via-slate-50 to-white" />

        {/* Logo en COULEURS, très grand, toujours derrière */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10 pointer-events-none flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/doro-vovo-logo.png"
            alt="Doro ou Vovo"
            className="select-none w-[96vmin] max-w-[1200px] h-auto opacity-100"
          />
        </div>

        {children}
      </body>
    </html>
  );
}
