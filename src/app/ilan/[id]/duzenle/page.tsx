import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateListing } from "../actions";

const inputClass = "mt-1 w-full rounded-lg border px-3 py-2 text-gray-900";
const CONDITIONS = ["Yeni", "Az kullanılmış", "Yıpranmış"];

async function DuzenleForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listingId = Number(id);

  if (!Number.isInteger(listingId)) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/giris");

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing || listing.sellerId !== session.user.id) notFound();

  return (
    <form
      action={updateListing.bind(null, listing.id)}
      className="rounded-xl border bg-white p-6 shadow-sm"
    >
      <h1 className="text-xl font-bold text-gray-900">İlanı Düzenle</h1>

      <label className="mt-6 block text-sm font-medium text-gray-700">
        Kitap adı
        <input
          name="title"
          type="text"
          required
          defaultValue={listing.title}
          className={inputClass}
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Ders kodu
        <input
          name="course"
          type="text"
          required
          defaultValue={listing.course}
          className={inputClass}
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Bölüm
        <input
          name="department"
          type="text"
          required
          defaultValue={listing.department}
          className={inputClass}
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Fiyat (TL)
        <input
          name="price"
          type="number"
          required
          min={0}
          step={1}
          defaultValue={listing.price}
          className={inputClass}
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Durum
        <select
          name="condition"
          required
          defaultValue={listing.condition}
          className={inputClass}
        >
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Açıklama (isteğe bağlı)
        <textarea
          name="description"
          rows={3}
          defaultValue={listing.description ?? ""}
          className={inputClass}
        />
      </label>

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Değişiklikleri Kaydet
      </button>
    </form>
  );
}

export default function DuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-lg px-4 py-10">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">
          ← Tüm ilanlar
        </Link>
        <div className="mt-4">
          <Suspense fallback={<p className="text-gray-500">Yükleniyor...</p>}>
            <DuzenleForm params={params} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}