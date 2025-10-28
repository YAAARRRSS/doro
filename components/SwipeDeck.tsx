"use client";
import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";

type Profile = { id: string; name: string; bio: string; photos: string[] };

export default function SwipeDeck() {
  const initial: Profile[] = [
    {
      id: "1",
      name: "Léa, 25",
      bio: "Escalade • Café • Voyages",
      photos: [
        "https://picsum.photos/id/1011/800/1200",
        "https://picsum.photos/id/1012/800/1200",
      ],
    },
    {
      id: "2",
      name: "Adam, 28",
      bio: "Tech • Vélo • Cuisine",
      photos: [
        "https://picsum.photos/id/1015/800/1200",
        "https://picsum.photos/id/1016/800/1200",
      ],
    },
    {
      id: "3",
      name: "Maya, 27",
      bio: "Piano • Randonnée • Chats",
      photos: [
        "https://picsum.photos/id/1024/800/1200",
        "https://picsum.photos/id/1025/800/1200",
      ],
    },
  ];

  const [stack, setStack] = useState<Profile[]>(initial);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [effectEmoji, setEffectEmoji] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const commitSwipe = (dir: "left" | "right" | "up") => {
    const emoji: Record<typeof dir, string> = {
      left: "🍺",     // Vovo
      right: "🙈",    // Doro
      up: "⚖️",       // Doro et Vovo
    } as const;

    setEffectEmoji(emoji[dir]);

    // Retire la carte après l’anim
    setTimeout(() => {
      setStack((s) => s.slice(0, -1));
      setPhotoIndex(0);
      setEffectEmoji(null);
      setDragging(false);
    }, 650);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md aspect-[3/4] relative select-none z-10">
        <AnimatePresence initial={false}>
          {stack.map((p, i) => {
            const isTop = i === stack.length - 1;
            const isNext = i === stack.length - 2;
            return (
              <Card
                key={p.id}
                p={p}
                isTop={isTop}
                isNext={isNext}
                onSwipe={commitSwipe}
                photoIndex={isTop ? photoIndex : 0}
                setPhotoIndex={setPhotoIndex}
                setDragging={setDragging}
              />
            );
          })}
        </AnimatePresence>

        {/* Boutons d’action */}
        <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-4">
          <Btn onClick={() => commitSwipe("left")}>Vovo</Btn>
          <Btn onClick={() => commitSwipe("up")}>Doro et Vovo</Btn>
          <Btn onClick={() => commitSwipe("right")}>Doro</Btn>
        </div>

        {/* Emoji au moment du swipe validé */}
        <AnimatePresence>
          {effectEmoji && (
            <motion.div
              key="swipe-emoji"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.7, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -10 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              style={{ zIndex: 50 }}
            >
              <div className="text-[90px] md:text-[120px] drop-shadow-2xl">
                {effectEmoji}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Card({
  p,
  isTop,
  isNext,
  onSwipe,
  photoIndex,
  setPhotoIndex,
  setDragging,
}: {
  p: Profile;
  isTop: boolean;
  isNext: boolean;
  onSwipe: (d: "left" | "right" | "up") => void;
  photoIndex: number;
  setPhotoIndex: (fn: any) => void;
  setDragging: (b: boolean) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-18, 0, 18]);

  // Progressions pour le texte géant (0 → 1)
  const leftProg = useTransform(x, [-40, -180], [0, 1], { clamp: true });
  const rightProg = useTransform(x, [40, 180], [0, 1], { clamp: true });
  const upProg = useTransform(y, [-40, -180], [0, 1], { clamp: true });

  // Choisit dynamiquement quel texte afficher selon le plus fort signal
  const label = ((): "VOVO" | "DORO" | "DORO ET VOVO" | "" => {
    // ces valeurs seront évaluées par framer au runtime
    // on ne peut pas lire directement leftProg.get() dans render, donc on affiche les 3 en superposition avec leur propre opacité
    return "";
  })();

  const handleDragEnd = (_: any, info: { offset: { x: number; y: number } }) => {
    const { x: dx, y: dy } = info.offset;
    const t = 120;

    if (dx > t) return onSwipe("right");
    if (dx < -t) return onSwipe("left");
    if (dy < -t) return onSwipe("up");

    setDragging(false);
  };

  // Pile : la carte “next” reste visible
  const baseScale = isTop ? 1 : isNext ? 0.965 : 0.93;
  const baseY = isTop ? 0 : isNext ? 10 : 22;

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ scale: baseScale, y: baseY, opacity: isTop ? 0 : 1 }}
      animate={{ scale: baseScale, y: baseY, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      style={{ zIndex: isTop ? 30 : isNext ? 20 : 10 }}
    >
      <motion.div
        drag={isTop}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragStart={() => isTop && setDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x, y, rotate, willChange: "transform" }}
        className="w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-black relative"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.photos[photoIndex % p.photos.length]}
          alt={p.name}
          className="w-full h-full object-cover"
          draggable={false}
          onDoubleClick={() => setPhotoIndex((n: number) => n + 1)}
        />

        {/* Gradients de lisibilité */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />

        {/* Infos */}
        <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow">
          <h2 className="text-2xl font-semibold">{p.name}</h2>
          <p className="text-sm opacity-90">{p.bio}</p>
          <p className="text-xs opacity-70 mt-1">Double-tap la photo pour changer</p>
        </div>

        {/* === TEXTE GÉANT qui suit le mouvement === */}
        {/* Vovo (gauche) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: leftProg, scale: useTransform(leftProg, [0, 1], [0.8, 1]) }}
        >
          <span className="text-white text-5xl md:text-7xl font-extrabold drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            VOVO
          </span>
        </motion.div>

        {/* Doro (droite) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: rightProg, scale: useTransform(rightProg, [0, 1], [0.8, 1]) }}
        >
          <span className="text-white text-5xl md:text-7xl font-extrabold drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            DORO
          </span>
        </motion.div>

        {/* Doro et Vovo (haut) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: upProg, scale: useTransform(upProg, [0, 1], [0.8, 1]) }}
        >
          <span className="text-white text-4xl md:text-6xl font-extrabold text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            DORO ET VOVO
          </span>
        </motion.div>

        {/* (On a retiré les petits labels d’angle pour un rendu plus propre) */}
      </motion.div>
    </motion.div>
  );
}

function Btn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-3 rounded-2xl shadow bg-white/95 hover:bg-white text-slate-900 font-medium"
    >
      {children}
    </button>
  );
}
