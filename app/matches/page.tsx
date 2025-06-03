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
    // Ensure user is defined before accessing user.role
    if (!isLoading && user && user.role !== "employee") {
      const route = {
        "manager": "/dashboard-manager",
        "hr": "/dashboard-rh",
        "office_manager": "/dashboard-office",
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

  // Ensure user is defined before checking role for rendering MatchCarousel
  if (!user || user.role !== "employee") {
    // This log helps confirm if we are exiting early due to user/role issues
    console.log('MatchesContent: Exiting early. User:', user, 'IsLoading:', isLoading);
    return null // Will redirect or show nothing if redirect already happened
  }

  // Logic for userEmail with placeholder
  let userEmail = user.email; // Attempt to get the email
  console.log('[MatchesPage] Email from AuthContext:', userEmail); // Log initial email value

  if (!userEmail) {
    console.warn("[MatchesPage] User email is undefined. Using placeholder 'emma@jungle.com' for demo.");
    userEmail = "emma@jungle.com"; // Placeholder for demo
  }
  console.log('[MatchesPage] Final userEmail to be passed to MatchCarousel:', userEmail);

  return <MatchCarousel userEmail={userEmail} />;
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