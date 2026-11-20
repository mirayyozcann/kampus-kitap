import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { auth } from "@/lib/auth";
import { coverColor } from "@/lib/cover";
import { prisma } from "@/lib/prisma";

async function Kitaplik() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/giris");

  const listings = await prisma.listing.findMany({
    where: { sellerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const total = listings.reduce((sum, l) => sum + l.price, 0);
  const firstName = session.user.name.trim().split(/\s+/)[0];

  return (
    <>
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-10">
          <p className="text-sm text-paper/60">Merhaba, {firstName}</p>
          <h1 className="rise mt-2 text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            <span className="marker-sweep">Kitaplığın</span>
          </h1>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/15 px-5 py-3">
              <p className="text-3xl font-semibold tracking-tight">
                {listings.length}
              </p>
              <p className="text-sm text-paper/60">aktif ilan</p>
            </div>
            <div className="rounded-2xl border border-white/15 px-5 py-3">
              <p className="text-3xl font-semibold tracking-tight">
                {total} TL
              </p>
              <p className="text-sm text-paper/60">toplam değer</p>
            </div>
            <Link
              href="/ilan/yeni"
              className="flex items-center rounded-2xl bg-marker px-6 py-3 font-semibold text-ink hover:opacity-90"
            >
              + Yeni ilan
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-12 text-center">
            <p className="text-xl font-semibold">Kitaplığın boş</p>
            <p className="mt-1 text-muted">
              Dolabında duran ders kitaplarına yeni bir ev bul.
            </p>
            <Link
              href="/ilan/yeni"
              className="mt-6 inline-block rounded-xl bg-ink px-6 py-3 font-medium text-paper hover:opacity-90"
            >
              İlk ilanını ver
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {listings.map((listing, i) => (
              <div
                key={listing.id}
                className="rise"
                style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
              >
                <Link href={`/ilan/${listing.id}`} className="group block">
                  <div
                    className="relative aspect-[4/5] overflow-hidden rounded-l-sm rounded-r-lg shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:-rotate-1"
                    style={{ backgroundColor: coverColor(listing.department) }}
                  >
                    <div className="absolute inset-y-0 left-0 w-3 bg-black/15" />
                    <div className="flex h-full flex-col justify-between py-4 pl-6 pr-4">
                      <span className="self-start rounded-sm bg-marker px-1.5 text-lg font-semibold leading-snug text-ink">
                        {listing.course}
                      </span>
                      <div>
                        <h3 className="line-clamp-3 text-xl font-semibold leading-tight tracking-tight text-ink">
                          {listing.title}
                        </h3>
                        <div className="mt-3 flex items-end justify-between gap-2">
                          <p className="line-clamp-2 max-w-[55%] text-xs text-ink/70">
                            {listing.department}
                          </p>
                          <span className="rotate-3 rounded-md bg-ink px-2 py-1 text-sm font-semibold text-paper">
                            {listing.price} TL
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="mt-3 flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted">
                    {listing.createdAt.toLocaleDateString("tr-TR")}
                  </span>
                  <Link
                    href={`/ilan/${listing.id}/duzenle`}
                    className="rounded-lg border border-line bg-white px-3 py-1.5 font-medium hover:border-ink"
                  >
                    Düzenle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default function IlanlarimPage() {
  return (
    <main className="min-h-screen bg-paper">
      <Header />
      <Suspense
        fallback={<p className="px-4 py-12 text-muted">Yükleniyor...</p>}
      >
        <Kitaplik />
      </Suspense>
    </main>
  );
}