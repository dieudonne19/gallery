import type { Metadata } from "next";

import { AboutPage } from "@/features/about";

export const metadata: Metadata = { title: "À propos" };

export default function Page() {
  return <AboutPage />;
}
