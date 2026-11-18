"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Header() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut();
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-ink"
        >
          KampüsKitap
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          {isPending ? null : session ? (
            <>
              <span className="hidden px-2 text-muted sm:inline">
                {session.user.name}
              </span>
              <button
                onClick={handleSignOut}
                className="rounded-lg px-3 py-2 text-ink hover:bg-chip"
              >
                Çıkış yap
              </button>
              <Link
                href="/ilan/yeni"
                className="rounded-lg bg-ink px-4 py-2 font-medium text-paper hover:opacity-90"
              >
                İlan ver
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/giris"
                className="rounded-lg px-3 py-2 text-ink hover:bg-chip"
              >
                Giriş yap
              </Link>
              <Link
                href="/kayit"
                className="rounded-lg bg-ink px-4 py-2 font-medium text-paper hover:opacity-90"
              >
                Kayıt ol
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}