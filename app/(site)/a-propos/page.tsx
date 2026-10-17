import type { Metadata } from "next";

import { AboutPage } from "@/features/about";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "À propos",
  "Dieudonné Andrianjato, développeur web et designer. La photographie est entrée dans ma vie avec le tout premier appareil photo de mon père.",
);

export default function Page() {
  return <AboutPage />;
}
