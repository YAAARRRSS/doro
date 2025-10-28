"use client";

import { useEffect, useState } from "react";

/** Données du profil, stockées en localStorage */
type ProfileData = {
  firstName: string;
  age: number | "";
  heightCm: number | "";
  photos: string[]; // Data URLs (prévisualisation)
};

const LS_KEY = "doro.profile";

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData>({
    firstName: "",
    age: "",
    heightCm: "",
    photos: [],
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Charger depuis localStorage (côté client uniquement)
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ProfileData>;
        setData({
          firstName: parsed.firstName ?? "",
          age: typeof parsed.age === "number" ? parsed.age : "",
          heightCm: typeof parsed.heightCm === "number" ? parsed.heightCm : "",
          photos: Array.isArray(parsed.photos) ? parsed.photos : [],
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Upload des photos -> DataURL pour preview locale
  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const limit = 9;
    const current = data.photos.length;

    const toRead = Array.from(files).slice(0, Math.max(0, limit - current));
    const readAsDataURL = (f: File) =>
      new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result));
        fr.onerror = reject;
        fr.readAsDataURL(f);
      });

    const urls = await Promise.all(toRead.map(readAsDataURL));
    setData((d) => ({ ...d, photos: [...d.photos, ...urls] }));
  };

  const removePhoto = (idx: number) => {
    setData((d) => ({ ...d, photos: d.photos.filter((_, i) => i !== idx) }));
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const errors: string[] = [];
      if (!data.firstName.trim()) errors.push("Prénom requis");
      if (data.age !== "" && (data.age < 18 || data.age > 110)) errors.push("Âge invalide");
      if (data.heightCm !== "" && (data.heightCm < 120 || data.heightCm > 230)) errors.push("Taille invalide");

      if (errors.length) {
        setMessage(errors.join(" • "));
        setSaving(false);
        return;
      }

      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          ...data,
          age: data.age === "" ? null : data.age,
          heightCm: data.heightCm === "" ? null : data.heightCm,
        })
      );
      setMessage("Profil enregistré ✅");
    } catch {
      setMessage("Erreur: impossible d'enregistrer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold mb-4">Mon profil</h1>

      <div className="grid gap-6">
        {/* Identité */}
        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-black/70">Prénom</span>
            <input
              type="text"
              className="h-10 rounded-lg border px-3 outline-none focus:ring-2 focus:ring-black/10"
              value={data.firstName}
              onChange={(e) => setData((d) => ({ ...d, firstName: e.target.value }))}
              placeholder="Ex: Kilyann"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-sm text-black/70">Âge</span>
              <input
                type="number"
                inputMode="numeric"
                min={18}
                max={110}
                className="h-10 rounded-lg border px-3 outline-none focus:ring-2 focus:ring-black/10"
                value={data.age}
                onChange={(e) =>
                  setData((d) => ({ ...d, age: e.target.value === "" ? "" : Number(e.target.value) }))
                }
                placeholder="Ex: 26"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm text-black/70">Taille (cm)</span>
              <input
                type="number"
                inputMode="numeric"
                min={120}
                max={230}
                className="h-10 rounded-lg border px-3 outline-none focus:ring-2 focus:ring-black/10"
                value={data.heightCm}
                onChange={(e) =>
                  setData((d) => ({ ...d, heightCm: e.target.value === "" ? "" : Number(e.target.value) }))
                }
                placeholder="Ex: 180"
              />
            </label>
          </div>
        </div>

        {/* Uploader + Préviews */}
        <div className="grid gap-3">
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 rounded-full border px-4 py-2 cursor-pointer hover:bg-black/5">
              <span>Ajouter des photos</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
            </label>
            <span className="text-sm text-black/60">Jusqu’à 9 photos (stockées localement)</span>
          </div>

          {data.photos.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {data.photos.map((src, i) => (
                <div key={i} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`photo-${i + 1}`}
                    className="w-full aspect-square object-cover rounded-xl border"
                  />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1.5 right-1.5 h-7 px-2 rounded-md bg-black/70 text-white text-xs opacity-0 group-hover:opacity-100 transition"
                    title="Retirer"
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-6 text-center text-black/60">
              Aucune photo pour l’instant. Ajoute-en avec le bouton ci-dessus.
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="h-10 px-4 rounded-lg bg-black text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer le profil"}
          </button>
          {message && <span className="text-sm text-black/70">{message}</span>}
        </div>
      </div>
    </div>
  );
}
