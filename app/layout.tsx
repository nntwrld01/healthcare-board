import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HealthcareBoard - Find Nearby Hospitals & Healthcare Services",
  description:
    "Locate nearby hospitals and access information about healthcare services. Get real-time navigation and find the right healthcare facility for your needs.",
  keywords: "healthcare, hospitals, medical services, emergency care, navigation, health facilities",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  )
}
