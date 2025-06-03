"use client"

import { AuthProvider } from "@/contexts/AuthContext"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { LanguageSelector } from "@/components/language-selector"
import { Login } from "@/components/login"

export default function LoginPage() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="relative min-h-screen">
          {/* Language Toggle - Always visible */}
          <div className="fixed top-4 right-4 z-50">
            <LanguageSelector />
          </div>

          {/* Main Content */}
          <Login />
        </div>
      </AuthProvider>
    </LanguageProvider>
  )
} 