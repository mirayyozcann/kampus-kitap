import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

async function Listings() {
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  if (listings.length === 0) {
    return (
      <p className="rounded-xl border bg-white p-6 text-center text-gray-500">
        Henüz ilan yok. İlk ilanı sen ver!
      </p>
    );
  }

  return (
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
          <h4 className="mt-3 font-semibold text-gray-900">{listing.title}</h4>
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
  );
}

export default function Home() {
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
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Son ilanlar
        </h3>
        <Suspense fallback={<p className="text-gray-500">Yükleniyor...</p>}>
          <Listings />
        </Suspense>
      </section>
    </main>
  );
}