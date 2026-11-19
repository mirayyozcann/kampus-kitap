"use client";

import { useState } from "react";
import Link from "next/link";
import { coverColor } from "@/lib/cover";

const CONDITIONS = [
  { name: "Yeni", note: "Hiç kullanılmadı" },
  { name: "Az kullanılmış", note: "Temiz, not ya da çizik yok" },
  { name: "Yıpranmış", note: "Çizik ya da notlar var" },
];

const DEPARTMENTS = [
  "Bilgisayar Mühendisliği",
  "Elektrik-Elektronik",
  "Makine Mühendisliği",
  "Matematik",
  "Fizik",
  "Kimya",
  "İşletme",
  "İktisat",
  "Hukuk",
  "Psikoloji",
];

type Defaults = {
  title?: string;
  course?: string;
  department?: string;
  price?: number;
  condition?: string;
  description?: string | null;
};

function short(text: string, max = 40) {
  const t = text.trim();
  if (!t) return "boş";
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

export default function ListingForm({
  action,
  defaults = {},
  submitLabel,
  mode = "create",
  cancelHref = "/",
}: {
  action: (formData: FormData) => Promise<void>;
  defaults?: Defaults;
  submitLabel: string;
  mode?: "create" | "edit";
  cancelHref?: string;
}) {
  const [title, setTitle] = useState(defaults.title ?? "");
  const [course, setCourse] = useState(defaults.course ?? "");
  const [department, setDepartment] = useState(defaults.department ?? "");
  const [price, setPrice] = useState(
    defaults.price !== undefined ? String(defaults.price) : "",
  );
  const [condition, setCondition] = useState(
    defaults.condition ?? "Az kullanılmış",
  );
  const [description, setDescription] = useState(defaults.description ?? "");

  const isEdit = mode === "edit";
  const cover = department.trim() ? coverColor(department) : "#D3D1C7";
  const filled = [title, course, department, price].filter(
    (v) => v.trim() !== "",
  ).length;

  const oldPrice = defaults.price;
  const newPrice = price === "" ? null : Number(price);
  const priceChanged =
    isEdit &&
    oldPrice !== undefined &&
    newPrice !== null &&
    newPrice !== oldPrice;
  const discount =
    priceChanged &&
    newPrice !== null &&
    oldPrice !== undefined &&
    oldPrice > 0 &&
    newPrice < oldPrice
      ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
      : null;

  const changes: { label: string; from: string; to: string }[] = [];
  if (isEdit) {
    if (title.trim() !== (defaults.title ?? "").trim()) {
      changes.push({
        label: "Kitap adı",
        from: short(defaults.title ?? ""),
        to: short(title),
      });
    }
    if (
      course.trim().toUpperCase() !==
      (defaults.course ?? "").trim().toUpperCase()
    ) {
      changes.push({
        label: "Ders kodu",
        from: short(defaults.course ?? ""),
        to: short(course.toUpperCase()),
      });
    }
    if (department.trim() !== (defaults.department ?? "").trim()) {
      changes.push({
        label: "Bölüm",
        from: short(defaults.department ?? ""),
        to: short(department),
      });
    }
    if (priceChanged) {
      changes.push({
        label: "Fiyat",
        from: `${oldPrice} TL`,
        to: `${newPrice} TL`,
      });
    }
    if (condition !== (defaults.condition ?? "")) {
      changes.push({
        label: "Durum",
        from: defaults.condition ?? "",
        to: condition,
      });
    }
    if (description.trim() !== (defaults.description ?? "").trim()) {
      changes.push({
        label: "Açıklama",
        from: short(defaults.description ?? ""),
        to: short(description),
      });
    }
  }

  return (
    <form action={action} className="grid gap-10 lg:grid-cols-[22rem_1fr]">
      <div className="mx-auto w-full max-w-sm lg:mx-0">
        <p className="mb-3 text-sm font-medium text-muted">
          {isEdit ? "Kapağı düzenle" : "Kapağa doğrudan yaz"}
        </p>
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-l-sm rounded-r-xl shadow-lg transition-colors duration-300"
          style={{ backgroundColor: cover }}
        >
          <div className="absolute inset-y-0 left-0 w-4 bg-black/15" />
          <div className="flex h-full flex-col justify-between py-5 pl-9 pr-5">
            <input
              name="course"
              type="text"
              required
              maxLength={12}
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="BIL 201"
              className="w-36 self-start rounded-sm bg-marker px-2 py-0.5 text-xl font-semibold uppercase text-ink outline-none placeholder:text-ink/40 focus:ring-2 focus:ring-ink"
            />

            <div>
              <textarea
                name="title"
                rows={3}
                required
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                placeholder="Kitabın adını yaz"
                className="w-full resize-none bg-transparent text-3xl font-semibold leading-tight tracking-tight text-ink outline-none placeholder:text-ink/40"
              />
              <div className="mt-3 flex items-end justify-between gap-2">
                <p className="line-clamp-2 max-w-[50%] text-sm text-ink/70">
                  {department.trim() || "Bölüm"}
                </p>
                <div className="flex flex-col items-end">
                  {priceChanged && (
                    <span className="mb-1 rotate-3 text-sm font-medium text-ink/60 line-through">
                      {oldPrice} TL
                    </span>
                  )}
                  <label className="flex rotate-3 items-baseline gap-1 rounded-md bg-ink px-3 py-1.5 text-paper">
                    <input
                      name="price"
                      type="number"
                      required
                      min={0}
                      step={1}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      className="w-16 bg-transparent text-right text-xl font-semibold outline-none placeholder:text-paper/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span className="text-sm">TL</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {isEdit ? (
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">Değişiklik özeti</h2>
              {discount !== null && (
                <span className="rounded-full bg-marker px-3 py-1 text-sm font-semibold text-ink">
                  %{discount} indirim
                </span>
              )}
            </div>
            {changes.length === 0 ? (
              <p className="mt-2 text-sm text-muted">
                Henüz bir şey değiştirmedin. Kapağın üstünden ya da aşağıdaki
                alanlardan düzenle.
              </p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {changes.map((c) => (
                  <li
                    key={c.label}
                    className="flex flex-wrap items-baseline gap-x-2"
                  >
                    <span className="font-medium">{c.label}</span>
                    <span className="text-muted line-through">{c.from}</span>
                    <span aria-hidden="true">→</span>
                    <span className="font-medium text-ink">{c.to}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div>
            <div className="h-1.5 overflow-hidden rounded-full bg-chip">
              <div
                className="h-full rounded-full bg-marker transition-all duration-300"
                style={{ width: `${(filled / 4) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-muted">
              {filled === 4
                ? "Kapak hazır, yayınlayabilirsin."
                : `${filled}/4 zorunlu alan dolu`}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium" htmlFor="department">
            Bölüm
          </label>
          <input
            id="department"
            name="department"
            type="text"
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Yaz ya da aşağıdan seç"
            className="mt-1.5 h-12 w-full rounded-xl border border-line bg-white px-4 text-ink outline-none focus:border-ink"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {DEPARTMENTS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDepartment(d)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  department === d
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-white text-ink hover:border-muted"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-medium">Durum</legend>
          <div className="mt-1.5 grid gap-2 sm:grid-cols-3">
            {CONDITIONS.map((c) => (
              <label
                key={c.name}
                className={`cursor-pointer rounded-xl border p-3 transition ${
                  condition === c.name
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-white text-ink hover:border-muted"
                }`}
              >
                <input
                  type="radio"
                  name="condition"
                  value={c.name}
                  checked={condition === c.name}
                  onChange={() => setCondition(c.name)}
                  className="sr-only"
                />
                <span className="block font-medium">{c.name}</span>
                <span
                  className={`mt-0.5 block text-xs ${
                    condition === c.name ? "text-paper/70" : "text-muted"
                  }`}
                >
                  {c.note}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block text-sm font-medium">
          Açıklama
          <span className="ml-1 font-normal text-muted">(isteğe bağlı)</span>
          <textarea
            name="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Kapağı, notları, hangi dönemde okunduğu..."
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-ink"
          />
        </label>

        {!isEdit && (
          <button
            type="submit"
            className="h-14 w-full rounded-xl bg-marker text-lg font-semibold text-ink hover:opacity-90"
          >
            {submitLabel}
          </button>
        )}
      </div>

      {isEdit && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <p className="text-sm text-muted">
              {changes.length === 0
                ? "Değişiklik yok"
                : `${changes.length} değişiklik`}
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={cancelHref}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink hover:bg-chip"
              >
                Vazgeç
              </Link>
              <button
                type="submit"
                className="h-11 rounded-xl bg-marker px-6 font-semibold text-ink hover:opacity-90"
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}