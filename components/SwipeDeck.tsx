"use client";
import { useEffect, useState } from "react";
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
  const [isDraggingTop, setIsDraggingTop] = useState(false);

  // Lance l’animation d’emoji puis enlève la carte ~450ms après
  const commitSwipe = (dir: "left" | "right" | "up") => {
    const map: Record<string, string> = {
      left: "🍺", // Vovo
      right: "🙈", // Doro
      up: "⚖️", // Doro et Vovo
    };
    setEffectEmoji(map[dir]);
    // Retire la carte après la petite anim
    setTimeout(() => {
      setStack((s) => s.slice(0, -1));
      setPhotoIndex(0);
      setEffectEmoji(null);
      setIsDraggingTop(false);
    }, 450);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md aspect-[3/4] relative select-none">

        {/* Deck */}
        <AnimatePresence initial={false}>
          {stack.map((p, i) => {
            const isTop = i === stack.length - 1;
            const isNext = i === stack.length - 2; // carte juste en dessous

            return (
              <Card
                key={p.id}
                p={p}
                isTop={isTop}
                isNext={isNext}
                onSwipe={commitSwipe}
                photoIndex={isTop ? photoIndex : 0}
                setPhotoIndex={setPhotoIndex}
                setIsDraggingTop={setIsDraggingTop}
              />
            );
          })}
        </AnimatePresence>

        {/* Boutons */}
        <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-4">
          <Btn onClick={() => commitSwipe("left")}>Vovo</Btn>
          <Btn onClick={() => commitSwipe("up")}>Doro et Vovo</Btn>
          <Btn onClick={() => commitSwipe("right")}>Doro</Btn>
        </div>

        {/* Effet emoji au centre */}
        <AnimatePresence>
          {effectEmoji && (
            <motion.div
              key={effectEmoji}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              <div className="text-6xl drop-shadow">{effectEmoji}</div>
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
  setIsDraggingTop,
}: {
  p: Profile;
  isTop: boolean;
  isNext: boolean;
  onSwipe: (d: "left" | "right" | "up") => void;
  photoIndex: number;
  setPhotoIndex: (fn: any) => void;
  setIsDraggingTop: (v: boolean) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

  // Opacités des labels directionnels
  const opR = useTransform(x, [50, 120], [0, 1]); // droite → DORO
  const opL = useTransform(x, [-120, -50], [1, 0]); // gauche → VOVO
  const opU = useTransform(y, [-140, -60], [1, 0]); // haut → DORO ET VOVO

  // La carte du dessous (next) reste visible et “respire” pendant qu’on drag
  const scaleBase = isTop ? 1 : isNext ? 0.96 : 0.92;
  const yBase = isTop ? 0 : isNext ? 10 : 20;

  const handleDragEnd = (_: any, info: { offset: { x: number; y: number } }) => {
    const offX = info.offset.x;
    const offY = info.offset.y;
    const t = 120;

    if (offX > t) return onSwipe("right");
    if (offX < -t) return onSwipe("left");
    if (offY < -t) return onSwipe("up");

    // sinon, retour au centre
    setIsDraggingTop(false);
  };

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ scale: scaleBase, y: yBase, opacity: isTop ? 0 : 1 }}
      animate={{ scale: scaleBase, y: yBase, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ zIndex: isTop ? 20 : isNext ? 10 : 0 }}
    >
      <motion.div
        drag={isTop}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragStart={() => isTop && setIsDraggingTop(true)}
        onDragEnd={handleDragEnd}
        style={{ x, y, rotate, willChange: "transform" }}
        className="w-full h-full rounded-3xl shadow-xl overflow-hidden bg-black relative"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.photos[photoIndex % p.photos.length]}
          alt={p.name}
          className="w-full h-full object-cover"
          draggable={false}
          onDoubleClick={() => setPhotoIndex((n: number) => n + 1)}
        />

        {/* Gradients haut/bas pour lisibilité */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />

        {/* Infos */}
        <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow">
          <h2 className="text-2xl font-semibold">{p.name}</h2>
          <p className="text-sm opacity-90">{p.bio}</p>
          <p className="text-xs opacity-70 mt-1">Double-tap la photo pour changer</p>
        </div>

        {/* Labels directionnels renommés */}
        <motion.div
          className="absolute top-5 left-5 px-3 py-1 rounded-xl border-2 text-sm font-bold"
          style={{ opacity: opL }}
        >
          VOVO
        </motion.div>
        <motion.div
          className="absolute top-5 right-5 px-3 py-1 rounded-xl border-2 text-sm font-bold"
          style={{ opacity: opR }}
        >
          DORO
        </motion.div>
        <motion.div
          className="absolute top-5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl border-2 text-sm font-bold"
          style={{ opacity: opU }}
        >
          DORO ET VOVO
        </motion.div>
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
      className="px-5 py-3 rounded-2xl shadow bg-white hover:bg-slate-50 text-slate-900 font-medium"
    >
      {children}
    </button>
  );
}
