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
        {/* --- Fond dégradé + watermark LOGO --- */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          {/* dégradé doux */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-fuchsia-100 to-sky-100" />
          {/* logo centré et discret */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/doro-vovo-logo.png"
              alt="Doro ou Vovo"
              className="w-[70vw] max-w-[520px] opacity-10 select-none"
            />
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
