"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Sun, 
  Moon, 
  Globe, 
  Bell, 
  Settings, 
  User,
  ChevronDown,
  LogOut,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface ModernHeaderProps {
  title?: string
  subtitle?: string
  showSearch?: boolean
  actions?: React.ReactNode
}

export function ModernHeader({ 
  title, 
  subtitle, 
  showSearch = false, 
  actions 
}: ModernHeaderProps) {
  const { t, language, toggleLanguage } = useLanguage()
  const { theme, toggleTheme, isDark } = useTheme()
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "employee": return "👤"
      case "manager": return "👔"
      case "hr": return "🛡️"
      case "office_manager": return "🏢"
      default: return "👤"
    }
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      employee: { en: "Employee", fr: "Employé" },
      manager: { en: "Manager", fr: "Manager" },
      hr: { en: "HR", fr: "RH" },
      office_manager: { en: "Office Manager", fr: "Responsable de bureau" }
    }
    return labels[role as keyof typeof labels]?.[language] || role
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gray-900/95"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Title Section */}
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">OP</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Office Pulse
                </h1>
              </div>
            </motion.div>
            
            {title && (
              <div className="hidden md:block">
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-4" />
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar (if enabled) */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t.common.search + "..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            
            {/* Custom Actions */}
            {actions}
            
            {/* Language Switch */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                title={t.common.switchLanguage}
              >
                <Globe className="w-4 h-4" />
                <span className="ml-1 text-xs font-medium">
                  {language.toUpperCase()}
                </span>
              </Button>
            </motion.div>

            {/* Theme Switch */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                title={isDark ? t.common.lightMode : t.common.darkMode}
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </motion.div>

            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Bell className="w-4 h-4" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </motion.div>

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-auto px-2 flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {user.name ? user.name.split(" ").map(n => n[0]).join("") : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {user.name || user.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <span className="mr-1">{getRoleIcon(user.role)}</span>
                          {getRoleLabel(user.role)}
                        </p>
                      </div>
                      <ChevronDown className="h-3 w-3 text-gray-400" />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {user.name ? user.name.split(" ").map(n => n[0]).join("") : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name || user.email}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <span className="mr-1">{getRoleIcon(user.role)}</span>
                          {getRoleLabel(user.role)}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t.nav.profile}</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t.nav.settings}</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 dark:text-red-400"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t.nav.logout}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
} 