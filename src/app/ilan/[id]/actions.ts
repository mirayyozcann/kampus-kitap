"use server";

import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireOwner(id: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/giris");

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.sellerId !== session.user.id) notFound();

  return listing;
}

export async function updateListing(id: number, formData: FormData) {
  await requireOwner(id);

  const title = String(formData.get("title") ?? "").trim();
  const course = String(formData.get("course") ?? "").trim().toUpperCase();
  const department = String(formData.get("department") ?? "").trim();
  const condition = String(formData.get("condition") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));

  if (!title || !course || !department || !condition) {
    throw new Error("Zorunlu alanlar boş bırakılamaz.");
  }
  if (!Number.isInteger(price) || price < 0) {
    throw new Error("Geçerli bir fiyat gir.");
  }

  await prisma.listing.update({
    where: { id },
    data: {
      title,
      course,
      department,
      condition,
      price,
      description: description || null,
    },
  });

  redirect(`/ilan/${id}`);
}

export async function deleteListing(id: number) {
  await requireOwner(id);
  await prisma.listing.delete({ where: { id } });
  redirect("/");
}