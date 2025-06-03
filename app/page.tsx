"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LoginPage } from "@/components/login-page"
import { ProfileCreation } from "@/components/profile-creation"
import { MatchCarousel } from "@/components/match-carousel"
import { WeeklyCalendar } from "@/components/weekly-calendar"
import { SlackNotifications } from "@/components/slack-notifications"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Navigation } from "@/components/navigation"
import { AuthService } from "@/lib/auth"
// import { SheetsService } from "@/lib/sheets"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { LanguageSelector } from "@/components/language-selector"
import { ProfileView } from "@/components/profile-view"

type UserRole = "employee" | "manager" | "hr" | "office_manager"
type Page = "profile" | "matches" | "calendar" | "notifications" | "admin"

export default function OfficePulseMatch() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>("employee")
  const [currentPage, setCurrentPage] = useState<Page>("profile")
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const user = AuthService.getCurrentUser()
      if (user) {
        setIsAuthenticated(true)
        setUserRole(user.role as UserRole)

        // Check if profile is complete for ALL users
        // const profile = await SheetsService.getProfile(user.email)
        // if (profile) {
        //   setIsProfileComplete(true)
        //   // Si l'utilisateur a un profil, aller directement aux matches ou admin
        //   if (user.role === "employee") {
        //     setCurrentPage("matches")
        //   } else {
        //     setCurrentPage("admin")
        //   }
        // } else {
        //   // Tous les utilisateurs peuvent créer un profil
        //   setCurrentPage("profile")
        // }
        // Temporarily assume profile is not complete to allow flow to profile creation
        setIsProfileComplete(false); 
        setCurrentPage("profile");

      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = (role: string) => {
    setIsAuthenticated(true)
    setUserRole(role as UserRole)
    // Tous les rôles commencent par créer un profil
    setCurrentPage("profile")
  }

  const handleProfileComplete = () => {
    setIsProfileComplete(true)
    // Après la création du profil, rediriger selon le rôle
    if (userRole === "employee") {
      setCurrentPage("matches")
    } else {
      setCurrentPage("admin")
    }
  }

  const handleLogout = () => {
    AuthService.logout()
    setIsAuthenticated(false)
    setIsProfileComplete(false)
    setCurrentPage("profile")
  }

  const handlePageChange = (page: string) => {
    setCurrentPage(page as Page)
  }

  const renderPage = () => {
    // Si le profil n'est pas complet, montrer la création de profil pour tous
    if (!isProfileComplete && currentPage === "profile") {
      return <ProfileCreation onComplete={handleProfileComplete} />
    }

    switch (currentPage) {
      case "profile":
        return isProfileComplete ? <ProfileView /> : <ProfileCreation onComplete={handleProfileComplete} />
      case "matches":
        return <MatchCarousel />
      case "calendar":
        return <WeeklyCalendar />
      case "notifications":
        return <SlackNotifications />
      case "admin":
        // Convertir le type pour AdminDashboard
        const adminRole = userRole === "office_manager" ? "office-manager" : userRole as "manager" | "hr"
        return <AdminDashboard userRole={adminRole} />
      default:
        if (userRole === "employee") {
          return <MatchCarousel />
        } else {
          const defaultAdminRole = userRole === "office_manager" ? "office-manager" : userRole as "manager" | "hr"
          return <AdminDashboard userRole={defaultAdminRole} />
        }
    }
  }

  if (isLoading) {
    return (
      <LanguageProvider>
        <div className="min-h-screen jungle-gradient-bg flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-12 h-12 border-3 border-jungle-yellow border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-jungle-gray font-body">Loading...</p>
          </motion.div>
        </div>
      </LanguageProvider>
    )
  }

  if (!isAuthenticated) {
    return (
      <LanguageProvider>
        <LoginPage onLogin={handleLogin} />
      </LanguageProvider>
    )
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen jungle-gradient-bg text-jungle-gray">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-jungle-yellow/8 via-transparent to-jungle-gray/8 pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,205,0,0.12),transparent_50%)] pointer-events-none" />
        
        {/* Decorative elements */}
        <div className="fixed top-20 right-20 w-40 h-40 bg-jungle-yellow/5 rounded-full blur-3xl floating-element" />
        <div className="fixed bottom-20 left-20 w-32 h-32 bg-jungle-gray/5 rounded-full blur-2xl floating-element" style={{ animationDelay: '2s' }} />

        {/* Language Selector - Always visible */}
        <div className="fixed top-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <LanguageSelector />
          </motion.div>
        </div>

        {/* Navigation - only show when profile is complete */}
        {isProfileComplete && (
          <Navigation
            currentPage={currentPage}
            onPageChange={handlePageChange}
            userRole={userRole}
            onLogout={handleLogout}
          />
        )}

        {/* Main Content */}
        <main className={isProfileComplete ? "md:ml-20" : ""}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${userRole}-${currentPage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </LanguageProvider>
  )
}
