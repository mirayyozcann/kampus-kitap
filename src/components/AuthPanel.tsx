import Link from "next/link";
import type { ReactNode } from "react";

const SPINES = [
  { color: "#AFA9EC", h: "h-20" },
  { color: "#5DCAA5", h: "h-14" },
  { color: "#F0997B", h: "h-24" },
  { color: "#ED93B1", h: "h-16" },
  { color: "#85B7EB", h: "h-20" },
  { color: "#97C459", h: "h-14" },
  { color: "#AFA9EC", h: "h-24" },
  { color: "#F0997B", h: "h-16" },
];

export default function AuthPanel({
  title,
  text,
}: {
  title: ReactNode;
  text: string;
}) {
  return (
    <section className="hidden flex-col justify-between bg-ink p-12 text-paper lg:flex">
      <Link href="/" className="text-lg font-semibold tracking-tight">
        KampüsKitap
      </Link>
      <div>
        <h1 className="max-w-md text-5xl font-semibold leading-[1.05] tracking-tight">
          {title}
        </h1>
        <p className="mt-4 max-w-sm text-lg text-paper/70">{text}</p>
      </div>
      <div aria-hidden="true" className="flex items-end gap-1">
        {SPINES.map((s, i) => (
          <div
            key={i}
            className={`w-8 ${s.h} rounded-t-sm`}
            style={{ backgroundColor: s.color }}
          />
        ))}
      </div>
    </section>
  );
}