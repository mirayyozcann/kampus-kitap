import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { auth } from "@/lib/auth";
import { createListing } from "./actions";

const inputClass = "mt-1 w-full rounded-lg border px-3 py-2 text-gray-900";

async function IlanForm() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/giris");

  return (
    <form
      action={createListing}
      className="rounded-xl border bg-white p-6 shadow-sm"
    >
      <h1 className="text-xl font-bold text-gray-900">İlan Ver</h1>
      <p className="mt-1 text-sm text-gray-500">
        Satmak istediğin ders kitabının bilgilerini gir.
      </p>

      <label className="mt-6 block text-sm font-medium text-gray-700">
        Kitap adı
        <input name="title" type="text" required className={inputClass} />
      </label>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Ders kodu (ör. BIL 201)
        <input name="course" type="text" required className={inputClass} />
      </label>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Bölüm
        <input name="department" type="text" required className={inputClass} />
      </label>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Fiyat (TL)
        <input
          name="price"
          type="number"
          required
          min={0}
          step={1}
          className={inputClass}
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Durum
        <select name="condition" required className={inputClass}>
          <option value="Yeni">Yeni</option>
          <option value="Az kullanılmış">Az kullanılmış</option>
          <option value="Yıpranmış">Yıpranmış</option>
        </select>
      </label>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Açıklama (isteğe bağlı)
        <textarea name="description" rows={3} className={inputClass} />
      </label>

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        İlanı Yayınla
      </button>
    </form>
  );
}

export default function YeniIlanPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-lg px-4 py-10">
        <Suspense fallback={<p className="text-gray-500">Yükleniyor...</p>}>
          <IlanForm />
        </Suspense>
      </div>
    </main>
  );
}