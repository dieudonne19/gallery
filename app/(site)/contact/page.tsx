import type { Metadata } from "next";

import { ContactPage } from "@/features/contact";

export const metadata: Metadata = { title: "Contact" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ photo?: string }>;
}) {
  const { photo } = await searchParams;
  return <ContactPage photoId={photo} />;
}
