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
import { Eye, EyeOff, LogIn, Sparkles } from "lucide-react"

interface LoginPageProps {
  onLogin: (role: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

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

  const demoCredentials = [
    { email: "emma@jungle.com", role: "Employee" },
    { email: "tom@jungle.com", role: "Manager" },
    { email: "lucas@jungle.com", role: "Office Manager" },
    { email: "sarah.hr@jungle.com", role: "HR" },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-jungle-background">
        <div className="absolute inset-0 bg-gradient-to-br from-jungle-accent/10 via-transparent to-jungle-green/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,200,87,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(42,157,143,0.1),transparent_50%)]" />

        {/* Floating Elements */}
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-jungle-accent/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="glass-effect border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4"
              >
                <div className="w-16 h-16 mx-auto bg-jungle-accent rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-jungle-textDark" />
                </div>
                <CardTitle className="text-3xl font-bold text-jungle-accent mb-2">Office Pulse Match</CardTitle>
                <p className="text-jungle-textLight/70">Connect with colleagues and plan your office presence</p>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Label htmlFor="email" className="text-jungle-textLight">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@jungle.com"
                    className="mt-1 bg-white/10 border-white/20 text-jungle-textLight placeholder:text-jungle-textLight/50"
                    required
                  />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <Label htmlFor="password" className="text-jungle-textLight">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="bg-white/10 border-white/20 text-jungle-textLight placeholder:text-jungle-textLight/50 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-jungle-textLight/50 hover:text-jungle-textLight"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Alert className="border-red-500/50 bg-red-500/10">
                      <AlertDescription className="text-red-400">{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-jungle-accent text-jungle-textDark hover:bg-jungle-accent/90 glow-effect h-12 text-lg font-semibold"
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
              </form>

              {/* Demo Credentials */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-4 border-t border-white/20"
              >
                <p className="text-sm text-jungle-textLight/70 mb-3 text-center">
                  Demo Credentials (Password: jungle123)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {demoCredentials.map((cred, index) => (
                    <motion.button
                      key={cred.email}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      onClick={() => {
                        setEmail(cred.email)
                        setPassword("jungle123")
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-xs text-jungle-textLight/80 hover:text-jungle-textLight"
                    >
                      <div className="font-medium">{cred.role}</div>
                      <div className="text-jungle-textLight/60">{cred.email}</div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
