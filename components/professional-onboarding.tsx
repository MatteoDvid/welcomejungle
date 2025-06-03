"use client"

import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GoogleSheetsService } from "@/lib/sheets"
import { useLanguage } from "@/contexts/LanguageContext"
import { 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Mail, 
  Building2, 
  Globe, 
  Heart, 
  FileText, 
  Camera,
  Sparkles,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import Image from "next/image"

interface OnboardingData {
  firstName: string
  lastName: string
  email: string
  role: string
  language: string
  selectedThemes: string[]
  bio: string
  avatarURL: string
}

interface ProfessionalOnboardingProps {
  onComplete: () => void
}

export function ProfessionalOnboarding({ onComplete }: ProfessionalOnboardingProps) {
  const { t, language } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    language: language,
    selectedThemes: [],
    bio: "",
    avatarURL: ""
  })

  const steps = [
    { id: "personal", title: t.onboarding?.personal || "Personal Info", icon: User },
    { id: "role", title: t.onboarding?.role || "Role & Language", icon: Building2 },
    { id: "interests", title: t.onboarding?.interests || "Interests", icon: Heart },
    { id: "profile", title: t.onboarding?.profile || "Complete Profile", icon: FileText }
  ]

  const roles = [
    { id: "employee", label: t.login?.employee || "Employee", icon: "👤" },
    { id: "manager", label: t.login?.manager || "Manager", icon: "👥" },
    { id: "hr", label: t.login?.hr || "HR", icon: "🛡️" },
    { id: "office_manager", label: t.login?.officeManager || "Office Manager", icon: "🏢" }
  ]

  const availableThemes = [
    { id: "technology", label: "Technology", icon: "💻", category: "work" },
    { id: "design", label: "Design", icon: "🎨", category: "creative" },
    { id: "marketing", label: "Marketing", icon: "📈", category: "business" },
    { id: "coffee", label: "Coffee", icon: "☕", category: "social" },
    { id: "fitness", label: "Fitness", icon: "💪", category: "lifestyle" },
    { id: "travel", label: "Travel", icon: "✈️", category: "lifestyle" },
    { id: "books", label: "Books", icon: "📚", category: "culture" },
    { id: "music", label: "Music", icon: "🎵", category: "culture" },
    { id: "cooking", label: "Cooking", icon: "👨‍🍳", category: "lifestyle" },
    { id: "gaming", label: "Gaming", icon: "🎮", category: "entertainment" },
    { id: "photography", label: "Photography", icon: "📸", category: "creative" },
    { id: "sports", label: "Sports", icon: "⚽", category: "lifestyle" }
  ]

  const generateAvatar = useCallback(() => {
    const avatarStyles = [
      "adventurer", "avataaars", "big-ears", "big-smile", "croodles",
      "fun-emoji", "icons", "identicon", "initials", "lorelei",
      "micah", "miniavs", "open-peeps", "personas", "pixel-art"
    ]
    const randomStyle = avatarStyles[Math.floor(Math.random() * avatarStyles.length)]
    const seed = `${formData.firstName}${formData.lastName}${Date.now()}`
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}&backgroundColor=FFCD00`
  }, [formData.firstName, formData.lastName])

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleThemeToggle = (themeId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedThemes: prev.selectedThemes.includes(themeId)
        ? prev.selectedThemes.filter(id => id !== themeId)
        : [...prev.selectedThemes, themeId]
    }))
  }

  const generateBio = () => {
    const bios = [
      `Passionate ${formData.role.toLowerCase()} with expertise in ${formData.selectedThemes.slice(0, 2).join(" and ")}. Love connecting with colleagues and exploring new opportunities.`,
      `Creative professional focused on ${formData.selectedThemes.slice(0, 2).join(" and ")}. Always excited to collaborate and share ideas with the team.`,
      `Experienced ${formData.role.toLowerCase()} who enjoys ${formData.selectedThemes.slice(0, 2).join(" and ")}. Looking forward to building meaningful connections at work.`
    ]
    return bios[Math.floor(Math.random() * bios.length)]
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.role) {
      return
    }

    setIsLoading(true)

    try {
      // Generate avatar if not set
      const avatarURL = formData.avatarURL || generateAvatar()
      
      // Generate bio if empty
      const bio = formData.bio || generateBio()

      // Send to Google Sheets
      await GoogleSheetsService.addProfile({
        prenom: formData.firstName,
        nom: formData.lastName,
        email: formData.email,
        role: formData.role,
        langue: formData.language,
        selectedThemes: formData.selectedThemes,
        generatedBio: bio,
        avatarURL
      })

      // Complete onboarding
      onComplete()
    } catch (error) {
      console.error("Error creating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Info
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-jungle-yellow rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <User className="w-10 h-10 text-jungle-gray" />
              </motion.div>
              <h2 className="text-2xl font-heading text-jungle-gray mb-2">Let's get started</h2>
              <p className="text-jungle-gray/70 font-body">Tell us a bit about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-jungle-gray font-body font-medium">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="mt-1 bg-white border-gray-200 text-jungle-gray font-body focus:ring-jungle-yellow focus:border-jungle-yellow"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-jungle-gray font-body font-medium">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="mt-1 bg-white border-gray-200 text-jungle-gray font-body focus:ring-jungle-yellow focus:border-jungle-yellow"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-jungle-gray font-body font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1 bg-white border-gray-200 text-jungle-gray font-body focus:ring-jungle-yellow focus:border-jungle-yellow"
                placeholder="john.doe@company.com"
                required
              />
            </div>
          </motion.div>
        )

      case 1: // Role & Language
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-jungle-yellow rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Building2 className="w-10 h-10 text-jungle-gray" />
              </motion.div>
              <h2 className="text-2xl font-heading text-jungle-gray mb-2">Your Role</h2>
              <p className="text-jungle-gray/70 font-body">Help us understand your position</p>
            </div>

            <div>
              <Label className="text-jungle-gray font-body font-medium mb-4 block">
                Select your role *
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roles.map((role) => (
                  <motion.div
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange("role", role.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.role === role.id
                        ? "border-jungle-yellow bg-jungle-yellow/10"
                        : "border-gray-200 hover:border-jungle-yellow/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{role.icon}</span>
                      <span className="font-body text-jungle-gray">{role.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-jungle-gray font-body font-medium mb-4 block">
                Preferred Language
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {["en", "fr"].map((lang) => (
                  <motion.div
                    key={lang}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange("language", lang)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                      formData.language === lang
                        ? "border-jungle-yellow bg-jungle-yellow/10"
                        : "border-gray-200 hover:border-jungle-yellow/50"
                    }`}
                  >
                    <span className="font-body text-jungle-gray">
                      {lang === "en" ? "🇺🇸 English" : "🇫🇷 Français"}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 2: // Interests
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-jungle-yellow rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Heart className="w-10 h-10 text-jungle-gray" />
              </motion.div>
              <h2 className="text-2xl font-heading text-jungle-gray mb-2">Your Interests</h2>
              <p className="text-jungle-gray/70 font-body">What do you enjoy? Select all that apply</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableThemes.map((theme) => (
                <motion.div
                  key={theme.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThemeToggle(theme.id)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                    formData.selectedThemes.includes(theme.id)
                      ? "border-jungle-yellow bg-jungle-yellow/10"
                      : "border-gray-200 hover:border-jungle-yellow/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{theme.icon}</div>
                  <div className="text-sm font-body text-jungle-gray">{theme.label}</div>
                </motion.div>
              ))}
            </div>

            {formData.selectedThemes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-jungle-yellow/10 rounded-lg"
              >
                <p className="text-sm text-jungle-gray/70 font-body mb-2">Selected interests:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.selectedThemes.map((themeId) => {
                    const theme = availableThemes.find(t => t.id === themeId)
                    return (
                      <Badge
                        key={themeId}
                        className="bg-jungle-yellow text-jungle-gray font-body"
                      >
                        {theme?.icon} {theme?.label}
                      </Badge>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )

      case 3: // Complete Profile
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-jungle-yellow rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <FileText className="w-10 h-10 text-jungle-gray" />
              </motion.div>
              <h2 className="text-2xl font-heading text-jungle-gray mb-2">Complete Your Profile</h2>
              <p className="text-jungle-gray/70 font-body">Final touches to make you shine</p>
            </div>

            {/* Avatar Section */}
            <div className="text-center mb-6">
              <Label className="text-jungle-gray font-body font-medium mb-4 block">
                Profile Picture
              </Label>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24 border-4 border-jungle-yellow/20">
                  <AvatarImage 
                    src={formData.avatarURL || generateAvatar()} 
                    alt="Profile preview" 
                  />
                  <AvatarFallback className="bg-jungle-yellow text-jungle-gray text-2xl font-body">
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleInputChange("avatarURL", generateAvatar())}
                  className="border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray font-body"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate New Avatar
                </Button>
              </div>
            </div>

            {/* Bio Section */}
            <div>
              <Label htmlFor="bio" className="text-jungle-gray font-body font-medium">
                Bio (Optional)
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us a bit about yourself..."
                className="mt-1 bg-white border-gray-200 text-jungle-gray font-body focus:ring-jungle-yellow focus:border-jungle-yellow min-h-[100px]"
              />
              <p className="text-xs text-jungle-gray/60 mt-2 font-body">
                Leave empty to auto-generate based on your interests
              </p>
            </div>

            {/* Summary */}
            <div className="p-4 bg-jungle-yellow/10 rounded-lg">
              <h3 className="font-heading text-jungle-gray mb-3">Profile Summary</h3>
              <div className="space-y-2 text-sm text-jungle-gray/80 font-body">
                <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Role:</strong> {roles.find(r => r.id === formData.role)?.label}</p>
                <p><strong>Language:</strong> {formData.language === "en" ? "English" : "Français"}</p>
                <p><strong>Interests:</strong> {formData.selectedThemes.length} selected</p>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.firstName && formData.lastName && formData.email
      case 1:
        return formData.role
      case 2:
        return true // Interests are optional
      case 3:
        return true // Bio is optional
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-jungle-yellow flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 bg-jungle-yellow pointer-events-none">
        <div className="absolute top-20 right-20 w-40 h-40 bg-jungle-gray/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-jungle-gray/5 rounded-full blur-2xl" />
      </div>

      <Card className="w-full max-w-2xl bg-white card-shadow relative z-10">
        <CardHeader className="text-center pb-6">
          {/* Logo */}
          <motion.div 
            className="w-16 h-16 mx-auto mb-4 flex items-center justify-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <div className="w-full h-full rounded-full bg-jungle-yellow flex items-center justify-center p-2">
              <Image
                src="/Logo-Welcome-To-The-Jungle-1500x1500.png"
                alt="Welcome to the Jungle"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </div>
          </motion.div>

          <CardTitle className="text-2xl font-heading text-jungle-gray mb-2">
            Welcome to Office Pulse Match
          </CardTitle>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 ${
                    index <= currentStep ? "text-jungle-yellow" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      index <= currentStep
                        ? "border-jungle-yellow bg-jungle-yellow text-jungle-gray"
                        : "border-gray-300"
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block">
                      <div
                        className={`w-12 h-0.5 ${
                          index < currentStep ? "bg-jungle-yellow" : "bg-gray-300"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-jungle-gray/60 font-body">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray font-body"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isLoading}
                className="bg-jungle-yellow text-jungle-gray hover:bg-jungle-yellow/90 button-shadow font-body"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Creating Profile..." : "Create My Profile"}
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="bg-jungle-yellow text-jungle-gray hover:bg-jungle-yellow/90 button-shadow font-body"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 