import type { Metadata } from "next";

import { ContactPage } from "@/features/contact";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Contact",
  "Une photo vous parle ? Écrivez-moi depuis la carte postale, par WhatsApp ou par e-mail.",
);

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ photo?: string }>;
}) {
  const { photo } = await searchParams;
  return <ContactPage photoId={photo} />;
}
