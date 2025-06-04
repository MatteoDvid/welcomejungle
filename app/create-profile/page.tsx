"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider } from "@/contexts/AuthContext"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { LanguageSelector } from "@/components/language-selector"
import { ProfileCreationForm } from "@/components/profile-creation-form"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

function CreateProfileContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (!isLoading && user && user.role !== "employee") {
      // Redirect non-employees to their appropriate dashboard
      const route = {
        "manager": "/dashboard-manager",
        "hr": "/dashboard-rh",
        "office_manager": "/dashboard-office"
      }[user.role] || "/login"
      
      router.push(route)
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-jungle-yellow flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-jungle-gray animate-spin mx-auto mb-4" />
          <p className="text-jungle-gray font-body">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "employee") {
    return null // Will redirect
  }

  return <ProfileCreationForm />
}

export default function CreateProfilePage() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="relative min-h-screen">
          {/* Language Toggle - Always visible */}
          <div className="fixed top-4 right-4 z-50">
            <LanguageSelector />
          </div>

          {/* Main Content */}
          <CreateProfileContent />
        </div>
      </AuthProvider>
    </LanguageProvider>
  )
} 