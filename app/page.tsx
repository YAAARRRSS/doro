"use client";

import SwipeDeck from "@/components/SwipeDeck";

function fireSwipe(dir: "left" | "right" | "up") {
  window.dispatchEvent(new CustomEvent("deck-swipe", { detail: dir }));
}

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <SwipeDeck />

      {/* FOOTER FIXE — toujours en bas, centré */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] pointer-events-none">
        <div className="flex items-center justify-center gap-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/vovo-yellow.png"
            alt="Vovo (swipe gauche)"
            width={120}
            height={120}
            className="pointer-events-auto cursor-pointer drop-shadow-xl hover:scale-110 transition-transform"
            onClick={() => fireSwipe("left")}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/doro-vovo-red.png"
            alt="Doro et Vovo (swipe haut)"
            width={120}
            height={120}
            className="pointer-events-auto cursor-pointer drop-shadow-xl hover:scale-110 transition-transform"
            onClick={() => fireSwipe("up")}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/doro-blue.png"
            alt="Doro (swipe droite)"
            width={120}
            height={120}
            className="pointer-events-auto cursor-pointer drop-shadow-xl hover:scale-110 transition-transform"
            onClick={() => fireSwipe("right")}
          />
        </div>
      </div>
    </main>
  );
}
