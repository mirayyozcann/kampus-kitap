import { Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const CONDITIONS = ["Yeni", "Az kullanılmış", "Yıpranmış"];
const COVERS = [
  "#AFA9EC",
  "#5DCAA5",
  "#F0997B",
  "#ED93B1",
  "#85B7EB",
  "#97C459",
];

const SPINES = [
  { code: "BIL 201", color: "#AFA9EC", h: "h-20", w: "w-9" },
  { code: "MAT 101", color: "#5DCAA5", h: "h-16", w: "w-8" },
  { code: "FIZ 101", color: "#F0997B", h: "h-24", w: "w-10" },
  { code: "KIM 101", color: "#ED93B1", h: "h-14", w: "w-8" },
  { code: "EEM 201", color: "#85B7EB", h: "h-20", w: "w-9" },
  { code: "ISL 101", color: "#97C459", h: "h-16", w: "w-8" },
  { code: "BIL 301", color: "#AFA9EC", h: "h-24", w: "w-10" },
  { code: "MAT 201", color: "#F0997B", h: "h-14", w: "w-8" },
  { code: "BIL 101", color: "#5DCAA5", h: "h-20", w: "w-9" },
  { code: "FIZ 201", color: "#85B7EB", h: "h-16", w: "w-8" },
  { code: "TAR 101", color: "#ED93B1", h: "h-24", w: "w-10" },
  { code: "ING 101", color: "#97C459", h: "h-14", w: "w-8" },
];

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

function coverColor(department: string) {
  let hash = 0;
  for (const ch of department.toLowerCase()) {
    hash = (hash * 31 + (ch.codePointAt(0) ?? 0)) >>> 0;
  }
  return COVERS[hash % COVERS.length];
}

function parseParams(params: {
  [key: string]: string | string[] | undefined;
}) {
  const q = first(params.q);
  const conditionRaw = first(params.condition);
  const condition = CONDITIONS.includes(conditionRaw) ? conditionRaw : "";
  const maxPriceRaw = first(params.maxPrice);
  const maxPriceNum = Number(maxPriceRaw);
  const maxPrice =
    maxPriceRaw !== "" && Number.isFinite(maxPriceNum) && maxPriceNum >= 0
      ? Math.floor(maxPriceNum)
      : null;

  return {
    q,
    condition,
    maxPriceRaw,
    maxPrice,
    hasFilter: q !== "" || condition !== "" || maxPrice !== null,
  };
}

async function SearchForm({ searchParams }: { searchParams: SearchParams }) {
  const { q, condition, maxPriceRaw, hasFilter } = parseParams(
    await searchParams,
  );

  return (
    <form action="/" method="get">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name="q"
          type="text"
          defaultValue={q}
          placeholder="Ders kodu veya kitap adı (ör. BIL 201)"
          className="flex-1 rounded-2xl bg-white px-5 py-4 text-lg text-ink outline-none placeholder:text-muted focus:ring-4 focus:ring-marker"
        />
        <button
          type="submit"
          className="rounded-2xl bg-marker px-8 py-4 text-lg font-semibold text-ink hover:opacity-90"
        >
          Ara
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <select
          name="condition"
          defaultValue={condition}
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-paper [&>option]:text-ink"
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
          className="w-48 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-paper placeholder:text-paper/50"
        />
        {hasFilter && (
          <Link href="/" className="px-2 text-paper/70 underline">
            Filtreleri temizle
          </Link>
        )}
      </div>
    </form>
  );
}

async function Results({ searchParams }: { searchParams: SearchParams }) {
  const { q, condition, maxPrice, hasFilter } = parseParams(
    await searchParams,
  );

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

  return (
    <>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          {hasFilter ? "Arama sonuçları" : "Son ilanlar"}
        </h2>
        <span className="text-sm text-muted">{listings.length} ilan</span>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-10 text-center">
          <p className="text-lg font-semibold">
            {hasFilter ? "Aramana uygun ilan yok" : "İlk ilanı sen ver"}
          </p>
          <p className="mt-1 text-muted">
            {hasFilter
              ? "Başka bir ders kodu dene ya da filtreleri temizle."
              : "Ders kitabını birkaç dakikada satışa çıkar."}
          </p>
          {!hasFilter && (
            <Link
              href="/ilan/yeni"
              className="mt-5 inline-block rounded-xl bg-ink px-5 py-3 font-medium text-paper hover:opacity-90"
            >
              İlan ver
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing, i) => (
            <Link
              key={listing.id}
              href={`/ilan/${listing.id}`}
              className="rise group block"
              style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
            >
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
              <div className="mt-3 flex items-start justify-between gap-2">
                <p className="line-clamp-2 text-sm text-muted">
                  {listing.description ?? ""}
                </p>
                <span className="shrink-0 rounded-md bg-chip px-2 py-1 text-xs text-ink">
                  {listing.condition}
                </span>
              </div>
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
    <main className="min-h-screen bg-paper">
      <Header />

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-5xl px-4 pt-14">
          <p className="rise inline-block rounded-full border border-white/20 px-3 py-1 text-sm text-paper/80">
            Kampüste ders kitabı al-sat
          </p>
          <h1
            className="rise mt-5 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            Ders kitabını <span className="marker-sweep">bul</span>, kampüste
            sat.
          </h1>
          <p
            className="rise mt-5 max-w-xl text-lg text-paper/70"
            style={{ animationDelay: "160ms" }}
          >
            Ders koduyla ara. Fiyatı, durumu ve satıcıyı karşılaştır.
          </p>

          <div className="rise mt-8" style={{ animationDelay: "240ms" }}>
            <Suspense
              fallback={<div className="h-14 rounded-2xl bg-white/10" />}
            >
              <SearchForm searchParams={searchParams} />
            </Suspense>
          </div>

          <div aria-hidden="true" className="mt-14 flex items-end gap-1 overflow-hidden">
            {[...SPINES, ...SPINES].map((s, i) => (
              <div
                key={i}
                className={`${s.w} ${s.h} flex shrink-0 justify-center rounded-t-sm pt-2`}
                style={{ backgroundColor: s.color }}
              >
                <span className="text-[10px] font-semibold tracking-wide text-ink/70 [writing-mode:vertical-rl]">
                  {s.code}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <Suspense fallback={<p className="text-muted">Yükleniyor...</p>}>
          <Results searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}