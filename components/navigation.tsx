"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Calendar, MessageSquare, Bell, Users, BarChart3, Shield, LogOut, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AuthService } from "@/lib/auth"

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
  userRole: "employee" | "manager" | "hr" | "office_manager"
  onLogout: () => void
}

export function Navigation({ currentPage, onPageChange, userRole, onLogout }: NavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const user = AuthService.getCurrentUser()

  const employeePages = [
    { id: "matches", label: "Matches", icon: MessageSquare, emoji: "💫" },
    { id: "calendar", label: "Calendar", icon: Calendar, emoji: "📅" },
    { id: "notifications", label: "Notifications", icon: Bell, emoji: "🔔" },
    { id: "profile", label: "Profile", icon: User, emoji: "👤" },
  ]

  const adminPages = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, emoji: "📊" },
    { id: "team", label: "Team", icon: Users, emoji: "👥" },
    { id: "admin", label: "Admin", icon: Shield, emoji: "🛡️" },
  ]

  const pages = userRole === "employee" ? employeePages : adminPages

  const getRoleTitle = () => {
    switch (userRole) {
      case "manager":
        return "Manager Dashboard"
      case "hr":
        return "HR Dashboard"
      case "office_manager":
        return "Office Manager"
      default:
        return "Office Pulse"
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden md:flex fixed left-0 top-0 h-full z-50 flex-col"
        initial={{ width: 80 }}
        animate={{ width: isExpanded ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="glass-effect h-full p-4 flex flex-col border-r border-white/20">
          {/* Logo */}
          <motion.div
            className="flex items-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-jungle-accent rounded-xl flex items-center justify-center text-2xl">
              <Sparkles className="w-6 h-6 text-jungle-textDark" />
            </div>
            <motion.div
              className="ml-3 overflow-hidden"
              animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? "auto" : 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-xl font-bold text-jungle-accent whitespace-nowrap">{getRoleTitle()}</h1>
            </motion.div>
          </motion.div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            {pages.map((page) => (
              <motion.div key={page.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={currentPage === page.id ? "default" : "ghost"}
                  className={`w-full justify-start h-12 ${
                    currentPage === page.id
                      ? "bg-jungle-accent text-jungle-textDark glow-effect"
                      : "text-jungle-textLight hover:bg-white/10"
                  }`}
                  onClick={() => onPageChange(page.id)}
                >
                  <span className="text-xl mr-3">{page.emoji}</span>
                  <motion.span
                    className="overflow-hidden whitespace-nowrap"
                    animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? "auto" : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {page.label}
                  </motion.span>
                </Button>
              </motion.div>
            ))}
          </nav>

          {/* User Profile */}
          <motion.div className="mt-auto space-y-2">
            <motion.div className="flex items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer">
              <Avatar className="w-10 h-10 ring-2 ring-jungle-accent/50">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-jungle-accent text-jungle-textDark">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <motion.div
                className="ml-3 overflow-hidden"
                animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? "auto" : 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm font-medium whitespace-nowrap text-jungle-textLight">{user?.name || "User"}</p>
                <p className="text-xs text-jungle-textLight/70 whitespace-nowrap capitalize">
                  {userRole.replace("_", " ")}
                </p>
              </motion.div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                className="w-full justify-start h-10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 mr-3" />
                <motion.span
                  className="overflow-hidden whitespace-nowrap"
                  animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? "auto" : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Logout
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="glass-effect border-t border-white/20 p-4">
          <div className="flex justify-around">
            {pages.slice(0, 4).map((page) => (
              <motion.button
                key={page.id}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  currentPage === page.id ? "text-jungle-accent" : "text-jungle-textLight"
                }`}
                onClick={() => onPageChange(page.id)}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-xl mb-1">{page.emoji}</span>
                <span className="text-xs">{page.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
