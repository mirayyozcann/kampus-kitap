import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import DeleteListingButton from "@/components/DeleteListingButton";
import { auth } from "@/lib/auth";
import { coverColor } from "@/lib/cover";
import { prisma } from "@/lib/prisma";
import { deleteListing } from "./actions";

async function IlanDetay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listingId = Number(id);

  if (!Number.isInteger(listingId)) notFound();

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { seller: { select: { name: true } } },
  });

  if (!listing) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const isOwner = session?.user.id === listing.sellerId;

  return (
    <article>
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-10"
        style={{ backgroundColor: coverColor(listing.department) }}
      >
        <div className="absolute inset-y-0 left-0 w-4 bg-black/15" />
        <div className="pl-4">
          <span className="inline-block rounded-sm bg-marker px-2 text-2xl font-semibold leading-snug text-ink">
            {listing.course}
          </span>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            {listing.title}
          </h1>
          <p className="mt-3 text-ink/70">{listing.department}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_16rem]">
        <div className="order-2 sm:order-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Açıklama
          </h2>
          {listing.description ? (
            <p className="mt-2 whitespace-pre-wrap text-lg leading-relaxed text-ink">
              {listing.description}
            </p>
          ) : (
            <p className="mt-2 text-muted">Satıcı açıklama eklememiş.</p>
          )}
        </div>

        <aside className="order-1 h-fit rounded-2xl border border-line bg-white p-5 sm:order-2">
          <p className="text-4xl font-semibold tracking-tight text-ink">
            {listing.price} TL
          </p>
          <span className="mt-3 inline-block rounded-md bg-chip px-2 py-1 text-sm text-ink">
            {listing.condition}
          </span>

          <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
            <div>
              <dt className="text-muted">Satıcı</dt>
              <dd className="font-medium text-ink">{listing.seller.name}</dd>
            </div>
            <div>
              <dt className="text-muted">İlan tarihi</dt>
              <dd className="font-medium text-ink">
                {listing.createdAt.toLocaleDateString("tr-TR")}
              </dd>
            </div>
          </dl>

          {isOwner && (
            <div className="mt-5 flex items-center gap-2 border-t border-line pt-5">
              <Link
                href={`/ilan/${listing.id}/duzenle`}
                className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper hover:opacity-90"
              >
                Düzenle
              </Link>
              <DeleteListingButton
                action={deleteListing.bind(null, listing.id)}
              />
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}

export default function IlanDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-screen bg-paper">
      <Header />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/" className="text-sm text-muted hover:text-ink">
          ← Tüm ilanlar
        </Link>
        <div className="mt-4">
          <Suspense fallback={<p className="text-muted">Yükleniyor...</p>}>
            <IlanDetay params={params} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}