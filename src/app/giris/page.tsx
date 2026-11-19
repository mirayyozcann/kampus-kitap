"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthPanel from "@/components/AuthPanel";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "mt-1.5 h-12 w-full rounded-xl border border-line bg-white px-4 text-ink outline-none focus:border-ink";

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signIn.email({ email, password });

    setLoading(false);

    if (error) {
      setError("E-posta ya da şifre hatalı.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen bg-paper lg:grid-cols-2">
      <AuthPanel
        title={
          <>
            Kitabın <span className="marker-sweep">hazır</span> mı?
          </>
        }
        text="Giriş yap, ilanlarını yönet ve ders kitabını yeni sahibine ulaştır."
      />

      <section className="flex items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-10 block text-lg font-semibold tracking-tight lg:hidden"
          >
            KampüsKitap
          </Link>

          <h2 className="text-3xl font-semibold tracking-tight">Giriş yap</h2>
          <p className="mt-1 text-muted">Hesabınla devam et.</p>

          <label className="mt-8 block text-sm font-medium">
            E-posta
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="mt-4 block text-sm font-medium">
            Şifre
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </label>

          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 h-12 w-full rounded-xl bg-ink font-medium text-paper hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş yap"}
          </button>

          <p className="mt-6 text-center text-sm text-muted">
            Hesabın yok mu?{" "}
            <Link href="/kayit" className="font-medium text-ink underline">
              Kayıt ol
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}