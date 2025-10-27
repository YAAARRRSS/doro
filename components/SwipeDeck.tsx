"use client";
import { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

type Profile = { id: string; name: string; bio: string; photos: string[] };

export default function SwipeDeck() {
  const initial: Profile[] = [
    { id: "1", name: "Léa, 25", bio: "Escalade • Café • Voyages", photos: ["https://picsum.photos/id/1011/800/1200","https://picsum.photos/id/1012/800/1200"] },
    { id: "2", name: "Adam, 28", bio: "Tech • Vélo • Cuisine", photos: ["https://picsum.photos/id/1015/800/1200","https://picsum.photos/id/1016/800/1200"] },
    { id: "3", name: "Maya, 27", bio: "Piano • Randonnée • Chats", photos: ["https://picsum.photos/id/1024/800/1200","https://picsum.photos/id/1025/800/1200"] },
  ];

  const [stack, setStack] = useState<Profile[]>(initial);
  const [photoIndex, setPhotoIndex] = useState(0);

  const onSwipe = (dir: "left" | "right" | "up") => {
    setStack((s) => s.slice(0, -1));
    setPhotoIndex(0);
    console.log("Swiped", dir);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md aspect-[3/4] relative select-none">
        <AnimatePresence initial={false}>
          {stack.map((p, i) => (
            <Card
              key={p.id}
              p={p}
              isTop={i === stack.length - 1}
              onSwipe={onSwipe}
              photoIndex={i === stack.length - 1 ? photoIndex : 0}
              setPhotoIndex={setPhotoIndex}
            />
          ))}
        </AnimatePresence>

        <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-4">
          <Btn onClick={() => onSwipe("left")}>Passer</Btn>
          <Btn onClick={() => onSwipe("up")}>Super Like</Btn>
          <Btn onClick={() => onSwipe("right")}>Like</Btn>
        </div>
      </div>
    </div>
  );
}

function Card({
  p,
  isTop,
  onSwipe,
  photoIndex,
  setPhotoIndex,
}: {
  p: Profile;
  isTop: boolean;
  onSwipe: (d: "left" | "right" | "up") => void;
  photoIndex: number;
  setPhotoIndex: (fn: any) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opR = useTransform(x, [50, 120], [0, 1]);
  const opL = useTransform(x, [-120, -50], [1, 0]);
  const opU = useTransform(y, [-140, -60], [1, 0]);

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ scale: 0.95, y: 30, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ zIndex: isTop ? 10 : 0 }}
    >
      <motion.div
        drag={isTop}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragEnd={(_, info) => {
          const { x: dx, y: dy } = info.offset;
          const t = 120;
          if (dx > t) return onSwipe("right");
          if (dx < -t) return onSwipe("left");
          if (dy < -t) return onSwipe("up");
        }}
        style={{ x, y, rotate }}
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

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow">
          <h2 className="text-2xl font-semibold">{p.name}</h2>
          <p className="text-sm opacity-90">{p.bio}</p>
          <p className="text-xs opacity-70 mt-1">Double-tap la photo pour changer</p>
        </div>

        <motion.div className="absolute top-5 left-5 px-3 py-1 rounded-xl border-2 text-sm font-bold" style={{ opacity: opL }}>
          PASS
        </motion.div>
        <motion.div className="absolute top-5 right-5 px-3 py-1 rounded-xl border-2 text-sm font-bold" style={{ opacity: opR }}>
          LIKE
        </motion.div>
        <motion.div className="absolute top-5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl border-2 text-sm font-bold" style={{ opacity: opU }}>
          SUPER
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Btn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="px-5 py-3 rounded-2xl shadow bg-white hover:bg-slate-50 text-slate-900 font-medium">
      {children}
    </button>
  );
}
