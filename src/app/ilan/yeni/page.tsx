import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import ListingForm from "@/components/ListingForm";
import { auth } from "@/lib/auth";
import { createListing } from "./actions";

async function IlanForm() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/giris");

  return <ListingForm action={createListing} submitLabel="İlanı yayınla" />;
}

export default function YeniIlanPage() {
  return (
    <main className="min-h-screen bg-paper">
      <Header />

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-5xl px-4 pb-12 pt-10">
          <Link href="/" className="text-sm text-paper/70 hover:text-paper">
            ← Tüm ilanlar
          </Link>
          <h1 className="rise mt-4 text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            İlanını <span className="marker-sweep">ver</span>
          </h1>
          <p className="mt-3 max-w-lg text-lg text-paper/70">
            Kapağın üstüne doğrudan yaz. Kitabın ilanlarda tam böyle görünecek.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <Suspense fallback={<p className="text-muted">Yükleniyor...</p>}>
          <IlanForm />
        </Suspense>
      </section>
    </main>
  );
}