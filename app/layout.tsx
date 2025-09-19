import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { MainNavigation } from "@/components/main-navigation"

export const metadata: Metadata = {
  title: "SAS - Sistema de Inspección Vehicular",
  description: "Sistema completo de inspección vehicular HQ-FO-40 para SAS Servicios Asociados",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="min-h-screen bg-background">
            <MainNavigation />
            <main className="flex-1">{children}</main>
          </div>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
