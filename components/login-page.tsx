"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthService } from "@/lib/auth"
import { Eye, EyeOff, LogIn, Sparkles, Users, Shield, UserCheck, Building2 } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/contexts/LanguageContext"

interface LoginPageProps {
  onLogin: (role: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const { t } = useLanguage()
  const [step, setStep] = useState<"role" | "login">("role")
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const roles = [
    {
      id: "employee",
      label: t.login.employee,
      icon: UserCheck,
      emoji: "👤",
      description: "Access your matches and calendar",
      color: "bg-blue-500",
      demo: { email: "emma@jungle.com", password: "jungle123" }
    },
    {
      id: "manager",
      label: t.login.manager,
      icon: Users,
      emoji: "👥",
      description: "Manage your team activities",
      color: "bg-green-500",
      demo: { email: "tom@jungle.com", password: "jungle123" }
    },
    {
      id: "hr",
      label: t.login.hr,
      icon: Shield,
      emoji: "🛡️",
      description: "Company-wide insights and management",
      color: "bg-purple-500",
      demo: { email: "sarah.hr@jungle.com", password: "jungle123" }
    },
    {
      id: "office_manager",
      label: t.login.officeManager,
      icon: Building2,
      emoji: "🏢",
      description: "Office management and events",
      color: "bg-orange-500",
      demo: { email: "lucas@jungle.com", password: "jungle123" }
    }
  ]

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
    const role = roles.find(r => r.id === roleId)
    if (role) {
      setEmail(role.demo.email)
      setPassword(role.demo.password)
    }
    setStep("login")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = await AuthService.login(email, password)
      if (user) {
        onLogin(user.role)
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderRoleSelection = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-4xl"
    >
      <Card className="glass-effect card-shadow">
        <CardHeader className="text-center pb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            {/* Logo Welcome to the Jungle */}
            <motion.div 
              className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-full h-full rounded-full bg-jungle-yellow flex items-center justify-center p-3 button-shadow">
                <Image
                  src="/Logo-Welcome-To-The-Jungle-1500x1500.png"
                  alt="Welcome to the Jungle"
                  width={72}
                  height={72}
                  className="w-18 h-18 object-contain"
                />
              </div>
            </motion.div>
            <CardTitle className="text-4xl font-heading text-jungle-yellow mb-3 drop-shadow-sm">Office Pulse Match</CardTitle>
            <p className="text-jungle-gray/70 font-body text-lg">{t.login.subtitle}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-2xl font-heading text-jungle-gray mb-2">{t.login.selectRole}</h2>
            <p className="text-jungle-gray/60 font-body">Choose your role to access your personalized dashboard</p>
          </motion.div>
        </CardHeader>

        <CardContent className="pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect(role.id)}
                className="cursor-pointer group"
              >
                <Card className="h-full glass-effect border-gray-200 hover:border-jungle-yellow/50 transition-all duration-300 group-hover:shadow-lg">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="relative">
                      <motion.div 
                        className={`w-16 h-16 mx-auto rounded-full ${role.color}/10 flex items-center justify-center mb-4 group-hover:${role.color}/20 transition-colors`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-3xl">{role.emoji}</span>
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="text-xl font-heading text-jungle-gray mb-2">{role.label}</h3>
                      <p className="text-sm text-jungle-gray/60 font-body">{role.description}</p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full border-jungle-yellow/30 text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray transition-all font-body group-hover:border-jungle-yellow"
                      >
                        <role.icon className="w-4 h-4 mr-2" />
                        Select Role
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-jungle-gray/60 font-body">
              👆 Click on any role to proceed with demo credentials
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderLoginForm = () => {
    const currentRole = roles.find(r => r.id === selectedRole)
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="glass-effect card-shadow">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-4"
            >
              {/* Logo Welcome to the Jungle */}
              <motion.div 
                className="w-20 h-20 mx-auto mb-4 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-full h-full rounded-full bg-jungle-yellow flex items-center justify-center p-2 button-shadow">
                  <Image
                    src="/Logo-Welcome-To-The-Jungle-1500x1500.png"
                    alt="Welcome to the Jungle"
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </motion.div>
              <CardTitle className="text-3xl font-heading text-jungle-yellow mb-2 drop-shadow-sm">Office Pulse Match</CardTitle>
              
              {currentRole && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-2 mb-4"
                >
                  <span className="text-2xl">{currentRole.emoji}</span>
                  <span className="text-lg font-body text-jungle-gray">{currentRole.label}</span>
                </motion.div>
              )}
              
              <p className="text-jungle-gray/70 font-body">Welcome back! Please sign in to continue</p>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Label htmlFor="email" className="text-jungle-gray font-body font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@jungle.com"
                  className="mt-1 bg-gray-50/80 border-gray-200 text-jungle-gray placeholder:text-jungle-gray/50 font-body subtle-shadow focus:ring-2 focus:ring-jungle-yellow/20 transition-all"
                  required
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Label htmlFor="password" className="text-jungle-gray font-body font-medium">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-gray-50/80 border-gray-200 text-jungle-gray placeholder:text-jungle-gray/50 pr-10 font-body subtle-shadow focus:ring-2 focus:ring-jungle-yellow/20 transition-all"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-jungle-gray/50 hover:text-jungle-gray transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </motion.button>
                </div>
              </motion.div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-50 border border-red-200 subtle-shadow"
                >
                  <p className="text-red-600 font-body text-sm">{error}</p>
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-jungle-yellow text-jungle-gray hover:bg-jungle-yellow/90 button-shadow h-12 text-lg font-semibold font-body"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                      </motion.div>
                    ) : (
                      <LogIn className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </motion.div>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-between items-center pt-4 border-t border-gray-200"
            >
              <Button
                variant="ghost"
                onClick={() => setStep("role")}
                className="text-jungle-gray/60 hover:text-jungle-gray font-body"
              >
                ← Change Role
              </Button>
              <p className="text-xs text-jungle-gray/60 font-body">
                Demo mode • Auto-filled
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 jungle-gradient-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-jungle-yellow/10 via-transparent to-jungle-gray/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,205,0,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(88,88,88,0.1),transparent_50%)]" />

        {/* Floating Elements */}
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-jungle-yellow/20 rounded-full floating-element"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Decorative circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-jungle-yellow/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-jungle-gray/5 rounded-full blur-2xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {step === "role" ? renderRoleSelection() : renderLoginForm()}
      </div>
    </div>
  )
}
