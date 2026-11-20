"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { coverColor } from "@/lib/cover";

function navClass(active: boolean) {
  return `py-2 text-sm font-medium transition ${
    active
      ? "text-paper underline decoration-marker decoration-2 underline-offset-[10px]"
      : "text-paper/70 hover:text-paper"
  }`;
}

function NavLinks({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname();

  return (
    <div className="ml-8 hidden items-center gap-6 md:flex">
      <Link href="/" className={navClass(pathname === "/")}>
        Kitaplar
      </Link>
      {loggedIn && (
        <Link
          href="/ilanlarim"
          className={navClass(pathname === "/ilanlarim")}
        >
          İlanlarım
        </Link>
      )}
    </div>
  );
}

function HeaderSearch() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <form action="/" method="get" className="hidden md:block">
      <input
        name="q"
        type="text"
        placeholder="Ders kodu ara"
        className="h-10 w-40 rounded-full border border-white/20 bg-white/10 px-4 text-sm text-paper outline-none transition-all placeholder:text-paper/50 focus:w-56 focus:border-marker"
      />
    </form>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span aria-hidden="true" className="flex items-end gap-0.5">
        <span className="h-5 w-1.5 rounded-t-sm bg-[#AFA9EC]" />
        <span className="h-7 w-1.5 rounded-t-sm bg-[#5DCAA5]" />
        <span className="h-6 w-1.5 rounded-t-sm bg-[#F0997B]" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-paper">
        Kampüs
        <span className="ml-0.5 rounded-sm bg-marker px-1 text-ink">Kitap</span>
      </span>
    </Link>
  );
}

export default function Header() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  const name = session?.user.name.trim() ?? "";
  const initial = name.charAt(0).toLocaleUpperCase("tr-TR");
  const firstName = name.split(/\s+/)[0];

  return (
    <header className="relative z-30 bg-ink text-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center">
          <Logo />
          <Suspense fallback={null}>
            <NavLinks loggedIn={!!session} />
          </Suspense>
        </div>

        <nav className="flex items-center gap-2 text-sm">
          <Suspense fallback={null}>
            <HeaderSearch />
          </Suspense>

          {isPending ? null : session ? (
            <>
              <Link
                href="/ilan/yeni"
                className="rounded-xl bg-marker px-4 py-2.5 font-semibold text-ink hover:opacity-90"
              >
                + İlan ver
              </Link>

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={open}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1 pl-1 pr-3 hover:border-white/50"
                >
                  <span
                    className="grid h-9 w-9 place-items-center rounded-full text-base font-semibold text-ink"
                    style={{ backgroundColor: coverColor(name) }}
                  >
                    {initial}
                  </span>
                  <span className="hidden max-w-[8rem] truncate font-medium text-paper sm:inline">
                    {firstName}
                  </span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 text-paper/60 transition ${
                      open ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 8l5 5 5-5" />
                  </svg>
                </button>

                {open && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-64 rounded-2xl border border-line bg-white p-2 text-ink shadow-xl"
                  >
                    <div className="flex items-center gap-3 rounded-xl bg-paper p-3">
                      <span
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg font-semibold text-ink"
                        style={{ backgroundColor: coverColor(name) }}
                      >
                        {initial}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{name}</p>
                        <p className="truncate text-xs text-muted">
                          {session.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <Link
                        href="/ilanlarim"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="block rounded-xl px-3 py-2.5 hover:bg-chip"
                      >
                        <span className="block font-medium">İlanlarım</span>
                        <span className="block text-xs text-muted">
                          Kitaplığını yönet
                        </span>
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                        className="block w-full rounded-xl px-3 py-2.5 text-left font-medium text-red-700 hover:bg-red-50"
                      >
                        Çıkış yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/giris"
                className="rounded-xl px-3 py-2.5 text-paper/80 hover:text-paper"
              >
                Giriş yap
              </Link>
              <Link
                href="/kayit"
                className="rounded-xl bg-marker px-4 py-2.5 font-semibold text-ink hover:opacity-90"
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