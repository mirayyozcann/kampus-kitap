import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ShareButton from "@/components/ShareButton";
import { auth } from "@/lib/auth";
import { coverColor } from "@/lib/cover";
import { prisma } from "@/lib/prisma";

const CONDITIONS = ["Yeni", "Az kullanılmış", "Yıpranmış"];

function timeAgo(date: Date, now: number) {
  const days = Math.floor((now - date.getTime()) / 86_400_000);
  if (days <= 0) return "Bugün yayınlandı";
  if (days === 1) return "Dün yayınlandı";
  if (days < 30) return `${days} gün önce yayınlandı`;
  return `${date.toLocaleDateString("tr-TR")} tarihinde yayınlandı`;
}

async function IlanDetay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listingId = Number(id);

  if (!Number.isInteger(listingId)) notFound();

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { seller: { select: { name: true } } },
  });

  if (!listing) notFound();

  const related = await prisma.listing.findMany({
    where: {
      course: { equals: listing.course, mode: "insensitive" },
      NOT: { id: listing.id },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const session = await auth.api.getSession({ headers: await headers() });
  const isOwner = session?.user.id === listing.sellerId;

  const now = Date.now();
  const cover = coverColor(listing.department);
  const level = Math.max(0, CONDITIONS.indexOf(listing.condition));

  return (
    <>
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-5xl px-4 pb-14 pt-8">
          <Link href="/" className="text-sm text-paper/70 hover:text-paper">
            ← Tüm ilanlar
          </Link>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[19rem_1fr]">
            <div
              className="rise relative mx-auto aspect-[4/5] w-full max-w-[17rem] -rotate-3 overflow-hidden rounded-l-sm rounded-r-xl shadow-2xl lg:mx-0 lg:max-w-none"
              style={{ backgroundColor: cover }}
            >
              <div className="absolute inset-y-0 left-0 w-4 bg-black/15" />
              <div className="flex h-full flex-col justify-between py-6 pl-10 pr-6">
                <span className="self-start rounded-sm bg-marker px-2 py-0.5 text-2xl font-semibold text-ink">
                  {listing.course}
                </span>
                <div>
                  <h1 className="line-clamp-5 text-4xl font-semibold leading-tight tracking-tight text-ink">
                    {listing.title}
                  </h1>
                  <p className="mt-4 text-sm text-ink/70">
                    {listing.department}
                  </p>
                </div>
              </div>
            </div>

            <div className="rise" style={{ animationDelay: "120ms" }}>
              <p className="text-sm text-paper/60">
                {listing.department} · {timeAgo(listing.createdAt, now)}
              </p>

              <p className="mt-4 inline-block -rotate-2 rounded-lg bg-marker px-5 py-2 text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
                {listing.price} TL
              </p>

              <div className="mt-8 max-w-sm">
                <p className="text-sm text-paper/60">Kitabın durumu</p>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {CONDITIONS.map((c, i) => (
                    <div key={c}>
                      <div
                        className={`h-2 rounded-full ${
                          i === level ? "bg-marker" : "bg-white/20"
                        }`}
                      />
                      <p
                        className={`mt-1.5 text-xs ${
                          i === level
                            ? "font-semibold text-paper"
                            : "text-paper/50"
                        }`}
                      >
                        {c}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {isOwner && (
                  <Link
                    href={`/ilan/${listing.id}/duzenle`}
                    className="rounded-xl bg-marker px-5 py-2.5 font-semibold text-ink hover:opacity-90"
                  >
                    Düzenle
                  </Link>
                )}
                <ShareButton />
              </div>
              {isOwner && (
                <p className="mt-3 text-sm text-paper/60">Bu senin ilanın.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
          <div>
            {listing.description ? (
              <div className="relative -rotate-1 rounded-sm bg-[#FFF3A8] p-6 shadow-sm">
                <div className="absolute -top-3 left-8 h-6 w-16 rotate-2 bg-black/10" />
                <p className="text-xs font-semibold uppercase tracking-widest text-ink/60">
                  Satıcının notu
                </p>
                <p className="mt-2 whitespace-pre-wrap text-lg leading-relaxed text-ink">
                  {listing.description}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-line p-6 text-muted">
                Satıcı bu ilana not bırakmamış.
              </div>
            )}

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-8 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-muted">Ders kodu</dt>
                <dd className="mt-0.5 font-medium">{listing.course}</dd>
              </div>
              <div>
                <dt className="text-muted">Bölüm</dt>
                <dd className="mt-0.5 font-medium">{listing.department}</dd>
              </div>
              <div>
                <dt className="text-muted">Durum</dt>
                <dd className="mt-0.5 font-medium">{listing.condition}</dd>
              </div>
              <div>
                <dt className="text-muted">İlan no</dt>
                <dd className="mt-0.5 font-medium">#{listing.id}</dd>
              </div>
            </dl>
          </div>

          <aside className="h-fit rounded-2xl border border-line bg-white p-6">
            <p className="text-sm text-muted">Satıcı</p>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="grid h-12 w-12 place-items-center rounded-full text-lg font-semibold text-ink"
                style={{ backgroundColor: cover }}
              >
                {listing.seller.name.trim().charAt(0).toLocaleUpperCase("tr-TR")}
              </div>
              <div>
                <p className="font-medium">{listing.seller.name}</p>
                <p className="text-sm text-muted">KampüsKitap üyesi</p>
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold tracking-tight">
              {listing.course} için diğer ilanlar
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/ilan/${r.id}`}
                  className="group block"
                >
                  <div
                    className="relative aspect-[4/5] overflow-hidden rounded-l-sm rounded-r-lg transition duration-200 group-hover:-translate-y-1"
                    style={{ backgroundColor: coverColor(r.department) }}
                  >
                    <div className="absolute inset-y-0 left-0 w-3 bg-black/15" />
                    <div className="flex h-full flex-col justify-between py-3 pl-6 pr-3">
                      <span className="self-start rounded-sm bg-marker px-1 text-sm font-semibold text-ink">
                        {r.course}
                      </span>
                      <div>
                        <p className="line-clamp-3 text-base font-semibold leading-tight text-ink">
                          {r.title}
                        </p>
                        <span className="mt-2 inline-block rounded-md bg-ink px-2 py-0.5 text-xs font-semibold text-paper">
                          {r.price} TL
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
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
      <Suspense
        fallback={<p className="px-4 py-12 text-muted">Yükleniyor...</p>}
      >
        <IlanDetay params={params} />
      </Suspense>
    </main>
  );
}