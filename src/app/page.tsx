import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const CONDITIONS = ["Yeni", "Az kullanılmış", "Yıpranmış"];

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

async function Browse({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const q = first(params.q);
  const conditionRaw = first(params.condition);
  const condition = CONDITIONS.includes(conditionRaw) ? conditionRaw : "";
  const maxPriceRaw = first(params.maxPrice);
  const maxPriceNum = Number(maxPriceRaw);
  const maxPrice =
    maxPriceRaw !== "" && Number.isFinite(maxPriceNum) && maxPriceNum >= 0
      ? Math.floor(maxPriceNum)
      : null;

  const hasFilter = q !== "" || condition !== "" || maxPrice !== null;

  const listings = await prisma.listing.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { course: { contains: q, mode: "insensitive" } },
                { title: { contains: q, mode: "insensitive" } },
                { department: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        condition ? { condition } : {},
        maxPrice !== null ? { price: { lte: maxPrice } } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  const inputClass = "rounded-lg border bg-white px-3 py-2 text-gray-900";

  return (
    <>
      <form
        action="/"
        method="get"
        className="mb-6 grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]"
      >
        <input
          name="q"
          type="text"
          defaultValue={q}
          placeholder="Ders kodu, kitap adı veya bölüm (ör. BIL 201)"
          className={inputClass}
        />
        <select
          name="condition"
          defaultValue={condition}
          className={inputClass}
        >
          <option value="">Tüm durumlar</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          name="maxPrice"
          type="number"
          min={0}
          defaultValue={maxPriceRaw}
          placeholder="En yüksek fiyat (TL)"
          className={inputClass}
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
        >
          Ara
        </button>
      </form>

      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
        <span>{listings.length} ilan bulundu</span>
        {hasFilter && (
          <Link href="/" className="text-indigo-600 hover:underline">
            Filtreleri temizle
          </Link>
        )}
      </div>

      {listings.length === 0 ? (
        <p className="rounded-xl border bg-white p-6 text-center text-gray-500">
          {hasFilter
            ? "Aramana uygun ilan bulunamadı."
            : "Henüz ilan yok. İlk ilanı sen ver!"}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/ilan/${listing.id}`}
              className="block rounded-xl border bg-white p-4 shadow-sm hover:shadow-md"
            >
              <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                {listing.course}
              </span>
              <h4 className="mt-3 font-semibold text-gray-900">
                {listing.title}
              </h4>
              <p className="mt-1 text-sm text-gray-500">{listing.department}</p>
              <p className="mt-1 text-sm text-gray-500">{listing.condition}</p>
              {listing.description && (
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {listing.description}
                </p>
              )}
              <p className="mt-3 text-lg font-bold text-gray-900">
                {listing.price} TL
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="mx-auto max-w-5xl px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Ders kitabını bul, kampüste al-sat
        </h2>
        <p className="mt-3 text-gray-600">
          Ders koduna göre ara, uygun fiyatlı kitabı bul.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <Suspense fallback={<p className="text-gray-500">Yükleniyor...</p>}>
          <Browse searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}