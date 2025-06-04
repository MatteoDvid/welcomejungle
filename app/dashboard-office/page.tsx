"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider } from "@/contexts/AuthContext"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { LanguageSelector } from "@/components/language-selector"
import { DashboardOffice } from "@/components/dashboard-office"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

function DashboardOfficeContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (!isLoading && user && user.role !== "office_manager") {
      // Redirect non-office managers to appropriate routes
      const route = {
        "employee": "/create-profile",
        "manager": "/dashboard-manager", 
        "hr": "/dashboard-rh"
      }[user.role] || "/login"
      
      router.push(route)
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-jungle-yellow flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-jungle-gray animate-spin mx-auto mb-4" />
          <p className="text-jungle-gray font-body">Chargement du dashboard Office...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "office_manager") {
    return null // Will redirect
  }

  return <DashboardOffice />
}

export default function DashboardOfficePage() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="relative min-h-screen">
          {/* Language Toggle - Always visible */}
          <div className="fixed top-4 right-4 z-50">
            <LanguageSelector />
          </div>

          {/* Main Content */}
          <DashboardOfficeContent />
        </div>
      </AuthProvider>
    </LanguageProvider>
  )
} 