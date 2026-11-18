"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createListing(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/giris");

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

  await prisma.listing.create({
    data: {
      title,
      course,
      department,
      condition,
      price,
      description: description || null,
      sellerId: session.user.id,
    },
  });

  redirect("/");
}