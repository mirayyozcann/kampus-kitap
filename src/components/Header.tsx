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
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          KampüsKitap
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {isPending ? null : session ? (
            <>
              <Link
                href="/ilan/yeni"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                İlan Ver
              </Link>
              <span className="text-gray-700">{session.user.name}</span>
              <button
                onClick={handleSignOut}
                className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link
                href="/giris"
                className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Giriş Yap
              </Link>
              <Link
                href="/kayit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}