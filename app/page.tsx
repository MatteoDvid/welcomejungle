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
import { SheetsService } from "@/lib/sheets"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { LanguageSelector } from "@/components/language-selector"

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
        setUserRole(user.role)

        // Check if profile is complete for ALL users
        const profile = await SheetsService.getProfile(user.email)
        if (profile) {
          setIsProfileComplete(true)
          // Si l'utilisateur a un profil, aller directement aux matches ou admin
          if (user.role === "employee") {
            setCurrentPage("matches")
          } else {
            setCurrentPage("admin")
          }
        } else {
          // Tous les utilisateurs peuvent créer un profil
          setCurrentPage("profile")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = (role: UserRole) => {
    setIsAuthenticated(true)
    setUserRole(role)
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

  const renderPage = () => {
    // Si le profil n'est pas complet, montrer la création de profil pour tous
    if (!isProfileComplete && currentPage === "profile") {
      return <ProfileCreation onComplete={handleProfileComplete} />
    }

    switch (currentPage) {
      case "profile":
        return <ProfileCreation onComplete={handleProfileComplete} />
      case "matches":
        return <MatchCarousel />
      case "calendar":
        return <WeeklyCalendar />
      case "notifications":
        return <SlackNotifications />
      case "admin":
        return <AdminDashboard userRole={userRole} />
      default:
        return userRole === "employee" ? <MatchCarousel /> : <AdminDashboard userRole={userRole} />
    }
  }

  if (isLoading) {
    return (
      <LanguageProvider>
        <div className="min-h-screen bg-jungle-background flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-8 h-8 border-2 border-jungle-accent border-t-transparent rounded-full"
          />
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
      <div className="min-h-screen bg-jungle-background text-jungle-textLight">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-jungle-accent/5 via-transparent to-jungle-green/5 pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,200,87,0.1),transparent_50%)] pointer-events-none" />

        {/* Language Selector - Always visible */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSelector />
        </div>

        {/* Navigation - only show when profile is complete */}
        {isProfileComplete && (
          <Navigation
            currentPage={currentPage}
            onPageChange={setCurrentPage}
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
