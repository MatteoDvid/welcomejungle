import type React from "react"
import type { Metadata } from "next"
import { Work_Sans } from "next/font/google"
import "./globals.css"

// Work Sans pour le body
const workSans = Work_Sans({ 
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: 'swap'
})

export const metadata: Metadata = {
  title: "Welcome to the Jungle - Office Pulse Match",
  description: "Connect with colleagues based on interests and availability",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Welcome+font:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${workSans.className} bg-background text-foreground min-h-screen`}>{children}</body>
    </html>
  )
}
