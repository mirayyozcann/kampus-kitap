import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateListing } from "../actions";

const CONDITIONS = ["Yeni", "Az kullanılmış", "Yıpranmış"];

const inputClass =
  "mt-1.5 h-12 w-full rounded-xl border border-line bg-white px-4 text-ink outline-none focus:border-ink";

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
      className="rounded-2xl border border-line bg-white p-6 sm:p-8"
    >
      <label className="block text-sm font-medium">
        Kitap adı
        <input
          name="title"
          type="text"
          required
          defaultValue={listing.title}
          className={inputClass}
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Ders kodu
          <input
            name="course"
            type="text"
            required
            defaultValue={listing.course}
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium">
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
      </div>

      <label className="mt-4 block text-sm font-medium">
        Bölüm
        <input
          name="department"
          type="text"
          required
          defaultValue={listing.department}
          className={inputClass}
        />
      </label>

      <label className="mt-4 block text-sm font-medium">
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

      <label className="mt-4 block text-sm font-medium">
        Açıklama
        <span className="ml-1 font-normal text-muted">(isteğe bağlı)</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={listing.description ?? ""}
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-ink"
        />
      </label>

      <button
        type="submit"
        className="mt-6 h-12 w-full rounded-xl bg-ink font-medium text-paper hover:opacity-90"
      >
        Değişiklikleri kaydet
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
    <main className="min-h-screen bg-paper">
      <Header />
      <div className="mx-auto max-w-xl px-4 py-10">
        <Link href="/" className="text-sm text-muted hover:text-ink">
          ← Tüm ilanlar
        </Link>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          İlanı <span className="marker-sweep">düzenle</span>
        </h1>
        <div className="mt-8">
          <Suspense fallback={<p className="text-muted">Yükleniyor...</p>}>
            <DuzenleForm params={params} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}