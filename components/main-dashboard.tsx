"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { ProfileCreationForm } from "@/components/profile-creation-form"
import { MatchCarousel } from "@/components/match-carousel"
import { WeeklyCalendar } from "@/components/weekly-calendar"
import { SlackNotifications } from "@/components/slack-notifications"
import { DashboardManager } from "@/components/dashboard-manager"
import { DashboardRH } from "@/components/dashboard-rh"
import { DashboardOffice } from "@/components/dashboard-office"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageSelector } from "@/components/language-selector"

interface MainDashboardProps {
  initialPage?: string
}

export function MainDashboard({ initialPage = "profile" }: MainDashboardProps) {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const [currentPage, setCurrentPage] = useState(initialPage)

  if (!user) {
    return null
  }

  const getUserRole = () => {
    switch (user.role) {
      case "Manager":
        return "manager"
      case "RH":
        return "hr"
      case "Office Manager":
        return "office_manager"
      default:
        return "employee"
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "profile":
        return <ProfileCreationForm />
      case "matches":
        return <MatchCarousel />
      case "calendar":
        return <WeeklyCalendar />
      case "notifications":
        return <SlackNotifications />
      case "dashboard":
        if (user.role === "Manager") return <DashboardManager />
        if (user.role === "RH") return <DashboardRH />
        if (user.role === "Office Manager") return <DashboardOffice />
        return <MatchCarousel />
      case "team":
        return <WeeklyCalendar />
      case "admin":
        if (user.role === "RH") return <DashboardRH />
        if (user.role === "Office Manager") return <DashboardOffice />
        return <DashboardManager />
      default:
        return <ProfileCreationForm />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jungle-yellow/5 via-white to-jungle-yellow/10">
      {/* Language Toggle - Always visible */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* Navigation */}
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        userRole={getUserRole()}
        onLogout={logout}
      />

      {/* Main Content */}
      <div className="md:ml-20 transition-all duration-300">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          {renderCurrentPage()}
        </motion.div>
      </div>
    </div>
  )
} 