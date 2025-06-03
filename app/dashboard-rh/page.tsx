"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider } from "@/contexts/AuthContext"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { LanguageSelector } from "@/components/language-selector"
import { DashboardRH } from "@/components/dashboard-rh"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

function DashboardRHContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (!isLoading && user && user.role !== "RH") {
      // Redirect non-RH to appropriate routes
      const route = {
        "Employé": "/create-profile",
        "Manager": "/dashboard-manager", 
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
          <p className="text-jungle-gray font-body">Chargement du dashboard RH...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "RH") {
    return null // Will redirect
  }

  return <DashboardRH />
}

export default function DashboardRHPage() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="relative min-h-screen">
          {/* Language Toggle - Always visible */}
          <div className="fixed top-4 right-4 z-50">
            <LanguageSelector />
          </div>

          {/* Main Content */}
          <DashboardRHContent />
        </div>
      </AuthProvider>
    </LanguageProvider>
  )
} 