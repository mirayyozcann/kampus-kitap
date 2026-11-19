import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import ListingForm from "@/components/ListingForm";
import DeleteListingButton from "@/components/DeleteListingButton";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteListing, updateListing } from "../actions";

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
    <>
      <p className="mb-8 text-sm text-muted">
        İlan no {listing.id} · {listing.createdAt.toLocaleDateString("tr-TR")}{" "}
        tarihinde yayınlandı ·{" "}
        <Link href={`/ilan/${listing.id}`} className="underline">
          İlanı gör
        </Link>
      </p>

      <ListingForm
        mode="edit"
        cancelHref={`/ilan/${listing.id}`}
        action={updateListing.bind(null, listing.id)}
        submitLabel="Kaydet"
        defaults={{
          title: listing.title,
          course: listing.course,
          department: listing.department,
          price: listing.price,
          condition: listing.condition,
          description: listing.description,
        }}
      />

      <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">Tehlikeli alan</h2>
        <p className="mt-1 text-sm text-red-900/70">
          İlanı sildiğinde geri alamazsın.
        </p>
        <div className="mt-4">
          <DeleteListingButton action={deleteListing.bind(null, listing.id)} />
        </div>
      </div>
    </>
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

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-10">
          <Link href="/" className="text-sm text-paper/70 hover:text-paper">
            ← Tüm ilanlar
          </Link>
          <h1 className="rise mt-4 text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            İlanı <span className="marker-sweep">düzenle</span>
          </h1>
          <p className="mt-3 max-w-lg text-lg text-paper/70">
            Değiştirdiğin her şey anında özetleniyor. Fiyatı düşürürsen kapakta
            indirim görünür.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-32 pt-10">
        <Suspense fallback={<p className="text-muted">Yükleniyor...</p>}>
          <DuzenleForm params={params} />
        </Suspense>
      </section>
    </main>
  );
}