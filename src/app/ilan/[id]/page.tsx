import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

async function IlanDetay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listingId = Number(id);

  if (!Number.isInteger(listingId)) notFound();

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { seller: { select: { name: true } } },
  });

  if (!listing) notFound();

  return (
    <article className="rounded-xl border bg-white p-6 shadow-sm">
      <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
        {listing.course}
      </span>
      <h1 className="mt-3 text-2xl font-bold text-gray-900">{listing.title}</h1>
      <p className="mt-1 text-gray-500">{listing.department}</p>

      <p className="mt-4 text-3xl font-bold text-gray-900">
        {listing.price} TL
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-500">Durum</dt>
          <dd className="font-medium text-gray-900">{listing.condition}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Satıcı</dt>
          <dd className="font-medium text-gray-900">{listing.seller.name}</dd>
        </div>
        <div>
          <dt className="text-gray-500">İlan tarihi</dt>
          <dd className="font-medium text-gray-900">
            {listing.createdAt.toLocaleDateString("tr-TR")}
          </dd>
        </div>
      </dl>

      {listing.description && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-900">Açıklama</h2>
          <p className="mt-1 whitespace-pre-wrap text-gray-700">
            {listing.description}
          </p>
        </div>
      )}
    </article>
  );
}

export default function IlanDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">
          ← Tüm ilanlar
        </Link>
        <div className="mt-4">
          <Suspense fallback={<p className="text-gray-500">Yükleniyor...</p>}>
            <IlanDetay params={params} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}