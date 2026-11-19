"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const SPINES = [
  { color: "#AFA9EC", h: "h-20" },
  { color: "#5DCAA5", h: "h-14" },
  { color: "#F0997B", h: "h-24" },
  { color: "#ED93B1", h: "h-16" },
  { color: "#85B7EB", h: "h-20" },
  { color: "#97C459", h: "h-14" },
  { color: "#AFA9EC", h: "h-24" },
  { color: "#F0997B", h: "h-16" },
];

const labelClass =
  "block text-xs font-semibold uppercase tracking-widest text-muted";
const lineInput =
  "mt-1 h-11 w-full border-b-2 border-line bg-transparent text-lg text-ink outline-none focus:border-ink";

export default function KayitPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signUp.email({ name, email, password });

    setLoading(false);

    if (error) {
      setError(
        "Kayıt olunamadı. Bu e-posta zaten kayıtlı olabilir ya da şifren çok kısa.",
      );
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-ink text-paper">
      <div className="mx-auto grid min-h-screen max-w-5xl items-center gap-10 px-4 py-12 lg:grid-cols-2">
        <div>
          <Link href="/" className="text-lg font-semibold tracking-tight">
            KampüsKitap
          </Link>
          <h1 className="rise mt-10 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Dolabındaki kitaplara <span className="marker-sweep">yeni</span> bir
            ev bul.
          </h1>
          <p className="mt-4 max-w-sm text-lg text-paper/70">
            Üye ol, birkaç dakikada ilan ver. Ders koduyla aranırsın.
          </p>
          <div
            aria-hidden="true"
            className="mt-12 hidden items-end gap-1 lg:flex"
          >
            {SPINES.map((s, i) => (
              <div
                key={i}
                className={`w-8 ${s.h} rounded-t-sm`}
                style={{ backgroundColor: s.color }}
              />
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rise w-full max-w-md justify-self-center overflow-hidden rounded-xl bg-paper text-ink shadow-2xl lg:rotate-2"
        >
          <div className="flex items-center justify-between bg-marker px-6 py-3">
            <span className="text-sm font-semibold uppercase tracking-widest">
              Üye kartı
            </span>
            <span className="text-sm font-semibold">KampüsKitap</span>
          </div>

          <div className="p-6 sm:p-8">
            <label className="block">
              <span className={labelClass}>Ad soyad</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={lineInput}
              />
            </label>

            <label className="mt-6 block">
              <span className={labelClass}>E-posta</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={lineInput}
              />
            </label>

            <label className="mt-6 block">
              <span className={labelClass}>Şifre (en az 8 karakter)</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={lineInput}
              />
            </label>

            {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 h-12 w-full rounded-xl bg-ink font-medium text-paper hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Üyeliği başlat"}
            </button>

            <p className="mt-5 text-center text-sm text-muted">
              Zaten üye misin?{" "}
              <Link href="/giris" className="font-medium text-ink underline">
                Giriş yap
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}