"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/AuthContext"
import { User, Mail, Briefcase, Loader2, Eye, EyeOff, LogIn, UserPlus, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export function Login() {
  const { t } = useLanguage()
  const { login, signUp, isLoading } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const roles = [
    { value: "employee", label: t.login.employee, displayName: "Employé" },
    { value: "manager", label: t.login.manager, displayName: "Manager" },
    { value: "hr", label: t.login.hr, displayName: "RH" },
    { value: "office_manager", label: t.login.officeManager, displayName: "Office Manager" }
  ]

  // Predefined test accounts for quick access
  const testAccounts = [
    { email: "alice@company.com", password: "test1234", role: "employee", displayName: "Employé" },
    { email: "manager@company.com", password: "manager22", role: "manager", displayName: "Manager" },
    { email: "rh@company.com", password: "rhpass", role: "hr", displayName: "RH" },
    { email: "office@company.com", password: "office33", role: "office_manager", displayName: "Office Manager" }
  ]

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Format d'email invalide"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Mot de passe requis"
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
    }

    if (mode === 'signup' && !formData.role) {
      newErrors.role = "Rôle requis"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    try {
      let success = false

      if (mode === 'signin') {
        success = await login(formData.email.trim(), formData.password)
      } else {
        success = await signUp(
          formData.email.trim(),
          formData.password,
          formData.role as "employee" | "manager" | "hr" | "office_manager"
        )
      }

      if (!success) {
        setError(mode === 'signin' 
          ? "Email ou mot de passe incorrect" 
          : "Impossible de créer le compte. L'email existe peut-être déjà."
        )
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
    }
  }

  const fillTestAccount = (account: typeof testAccounts[0]) => {
    setFormData({
      email: account.email,
      password: account.password,
      role: account.role
    })
    setMode('signin')
    setError("")
    setErrors({})
  }

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
    setError("")
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FFE666'}}>
      {/* Background uni jaune équilibré - plus de décorations */}
      <div className="fixed inset-0" style={{backgroundColor: '#FFE666'}}></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <Card className="bg-white shadow-2xl border-0 overflow-hidden">
            {/* Header */}
            <CardHeader className="bg-gradient-to-br from-jungle-yellow/10 to-transparent p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-4"
              >
                <div className="w-20 h-20 bg-jungle-yellow rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <div className="text-3xl">🌿</div>
                </div>
              </motion.div>
              
              <CardTitle className="text-3xl font-heading text-jungle-gray mb-2">
                Office Pulse Match
              </CardTitle>
              <p className="text-jungle-gray/70 font-body">
                {mode === 'signin' ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
              </p>
            </CardHeader>

            <CardContent className="p-8">
              {/* Mode Toggle */}
              <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin')
                    setError("")
                    setErrors({})
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-body text-sm transition-all ${
                    mode === 'signin'
                      ? 'bg-jungle-yellow text-jungle-gray shadow-sm'
                      : 'text-jungle-gray/60 hover:text-jungle-gray'
                  }`}
                >
                  <LogIn className="w-4 h-4 inline mr-2" />
                  Se connecter
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup')
                    setError("")
                    setErrors({})
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-body text-sm transition-all ${
                    mode === 'signup'
                      ? 'bg-jungle-yellow text-jungle-gray shadow-sm'
                      : 'text-jungle-gray/60 hover:text-jungle-gray'
                  }`}
                >
                  <UserPlus className="w-4 h-4 inline mr-2" />
                  S'inscrire
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="email" className="text-jungle-gray font-body font-semibold">
                    Email *
                  </Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jungle-gray/40" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={`pl-12 bg-gray-50 border-gray-200 focus:border-jungle-yellow focus:ring-jungle-yellow ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      placeholder="votre.email@company.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 font-body">{errors.email}</p>
                  )}
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="password" className="text-jungle-gray font-body font-semibold">
                    Mot de passe *
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className={`pr-12 bg-gray-50 border-gray-200 focus:border-jungle-yellow focus:ring-jungle-yellow ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-jungle-gray/40 hover:text-jungle-gray"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1 font-body">{errors.password}</p>
                  )}
                </motion.div>

                {/* Role (only for signup) */}
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="role" className="text-jungle-gray font-body font-semibold">
                      Rôle *
                    </Label>
                    <div className="relative mt-2">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jungle-gray/40 z-10" />
                      <Select value={formData.role} onValueChange={(value) => updateField("role", value)}>
                        <SelectTrigger className={`pl-12 bg-gray-50 border-gray-200 focus:border-jungle-yellow focus:ring-jungle-yellow ${
                          errors.role ? "border-red-500" : ""
                        }`}>
                          <SelectValue placeholder="Sélectionnez votre rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.role && (
                      <p className="text-red-500 text-sm mt-1 font-body">{errors.role}</p>
                    )}
                  </motion.div>
                )}

                {/* Error Alert */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700 font-body">
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-jungle-yellow text-jungle-gray hover:bg-jungle-yellow/90 font-body text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="flex items-center"
                      >
                        <Loader2 className="w-5 h-5 mr-2" />
                        {mode === 'signin' ? 'Connexion...' : 'Création...'}
                      </motion.div>
                    ) : (
                      <>
                        {mode === 'signin' ? (
                          <>
                            <LogIn className="w-5 h-5 mr-2" />
                            Se connecter
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-5 h-5 mr-2" />
                            Créer mon compte
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Test Accounts (only in signin mode) */}
              {mode === 'signin' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 pt-6 border-t border-gray-200"
                >
                  <p className="text-sm text-jungle-gray/60 mb-4 text-center font-body">
                    ✨ Connexion rapide - Comptes de démo
                  </p>
                  
                  {/* Comptes en ligne */}
                  <div className="flex flex-col gap-2">
                    {testAccounts.map((account, index) => (
                      <motion.button
                        key={account.email}
                        type="button"
                        onClick={() => fillTestAccount(account)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-jungle-yellow hover:shadow-md transition-all duration-300 text-left overflow-hidden"
                      >
                        {/* Icône de rôle */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-jungle-yellow/10 flex items-center justify-center group-hover:bg-jungle-yellow/20 transition-colors">
                            <span className="text-lg">
                              {account.displayName === "Employé" ? "👤" : 
                               account.displayName === "Manager" ? "👔" : 
                               account.displayName === "RH" ? "🛡️" : "🏢"}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-jungle-gray group-hover:text-jungle-yellow transition-colors">
                                {account.displayName}
                              </span>
                              <span className="text-xs bg-jungle-yellow/20 text-jungle-gray px-2 py-0.5 rounded-full">
                                Démo
                              </span>
                            </div>
                            <div className="text-xs text-jungle-gray/60 truncate group-hover:text-jungle-gray/80 transition-colors">
                              {account.email}
                            </div>
                          </div>
                          
                          {/* Flèche d'action */}
                          <div className="text-jungle-gray/40 group-hover:text-jungle-yellow group-hover:translate-x-1 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Effet de survol */}
                        <div className="absolute inset-0 bg-gradient-to-r from-jungle-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Petite note explicative */}
                  <p className="text-xs text-jungle-gray/50 text-center mt-3 font-body">
                    Cliquez sur un rôle pour vous connecter automatiquement
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 