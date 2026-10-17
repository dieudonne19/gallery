import type { Metadata, Viewport } from "next"
import { DM_Mono, DM_Sans, Fraunces } from "next/font/google"

import "./globals.css"
import { SkipLink } from "@/components/shared/SkipLink"
import { Toaster } from "@/components/ui/sonner"
import { baseOpenGraph } from "@/lib/metadata"
import { AUTHOR_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site"

const fontSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
const fontSerif = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" })
const fontMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR_NAME }],
  creator: AUTHOR_NAME,
  // Chaque page est sa propre référence : /?categorie=cotes pointe vers /, pas de contenu en double.
  alternates: { canonical: "./" },
  openGraph: { ...baseOpenGraph, title: SITE_TITLE, description: SITE_DESCRIPTION },
  twitter: { card: "summary", title: SITE_TITLE, description: SITE_DESCRIPTION },
}

export const viewport: Viewport = {
  themeColor: "#f6f3ec",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} font-sans antialiased`}
    >
      <body>
        <SkipLink />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
