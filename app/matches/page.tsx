"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider } from "@/contexts/AuthContext"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { LanguageSelector } from "@/components/language-selector"
import { MatchCarousel } from "@/components/match-carousel"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

function MatchesContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    // Only employees can access matches after profile creation
    if (!isLoading && user && user.role !== "Employé") {
      const route = {
        "Manager": "/dashboard-manager",
        "RH": "/dashboard-rh",
        "Office Manager": "/dashboard-office"
      }[user.role] || "/login"
      
      router.push(route)
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-jungle-yellow flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-jungle-gray animate-spin mx-auto mb-4" />
          <p className="text-jungle-gray font-body">Chargement des matches...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "Employé") {
    return null // Will redirect
  }

  return <MatchCarousel />
}

export default function MatchesPage() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="relative min-h-screen">
          {/* Language Toggle */}
          <div className="fixed top-4 right-4 z-50">
            <LanguageSelector />
          </div>

          {/* Matches Content */}
          <MatchesContent />
        </div>
      </AuthProvider>
    </LanguageProvider>
  )
} 