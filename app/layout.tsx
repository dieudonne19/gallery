import type { Metadata } from "next"
import { DM_Mono, DM_Sans, Fraunces } from "next/font/google"

import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const fontSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
const fontSerif = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" })
const fontMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
})

export const metadata: Metadata = {
  title: {
    default: "dieudonne.andrianjato — Photographie de paysages",
    template: "%s · dieudonne.andrianjato",
  },
  description: "Photographies de paysages : collines, côtes, couchers de soleil et ciels.",
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
        {children}
        <Toaster />
      </body>
    </html>
  )
}
