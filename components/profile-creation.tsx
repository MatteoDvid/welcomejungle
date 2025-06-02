"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight, ChevronLeft, Upload, Sparkles, Wand2 } from "lucide-react"
import { SheetsService } from "@/lib/sheets"
import { OpenAIService } from "@/lib/openai"
import { AuthService } from "@/lib/auth"

const interests = [
  { id: "tech", label: "Tech", emoji: "💻" },
  { id: "design", label: "Design", emoji: "🎨" },
  { id: "coffee", label: "Coffee", emoji: "☕" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "books", label: "Books", emoji: "📚" },
  { id: "food", label: "Food", emoji: "🍕" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "photography", label: "Photography", emoji: "📸" },
  { id: "art", label: "Art", emoji: "🎭" },
  { id: "movies", label: "Movies", emoji: "🎬" },
]

const activities = [
  { id: "coffee", label: "Coffee", emoji: "☕" },
  { id: "lunch", label: "Lunch", emoji: "🍽️" },
  { id: "brainstorming", label: "Brainstorming", emoji: "💡" },
  { id: "walking", label: "Walking", emoji: "🚶" },
  { id: "workshop", label: "Workshop", emoji: "🛠️" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "workout", label: "Workout", emoji: "🏋️" },
  { id: "reading", label: "Reading", emoji: "📖" },
]

const days = [
  { id: "monday", label: "Monday", emoji: "📅", short: "Mon" },
  { id: "tuesday", label: "Tuesday", emoji: "📅", short: "Tue" },
  { id: "wednesday", label: "Wednesday", emoji: "📅", short: "Wed" },
  { id: "thursday", label: "Thursday", emoji: "📅", short: "Thu" },
  { id: "friday", label: "Friday", emoji: "📅", short: "Fri" },
]

interface ProfileCreationProps {
  onComplete: () => void
}

export function ProfileCreation({ onComplete }: ProfileCreationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    officeDays: [] as string[],
    interests: [] as string[],
    activities: [] as string[],
    photo: null as File | null,
    bio: "",
  })
  const [isGeneratingBio, setIsGeneratingBio] = useState(false)
  const [bioGenerated, setBioGenerated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const steps = ["Basic Info", "Office Days", "Interests", "Activities", "Photo", "Bio"]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      await handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsSaving(true)
    try {
      const user = AuthService.getCurrentUser()
      if (user) {
        await SheetsService.saveProfile({
          email: user.email,
          name: formData.name,
          role: formData.role,
          officeDays: formData.officeDays,
          interests: formData.interests,
          activities: formData.activities,
          bio: formData.bio,
        })
      }
      onComplete()
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSelection = (field: "officeDays" | "interests" | "activities", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((item) => item !== value) : [...prev[field], value],
    }))
  }

  const generateBio = async () => {
    setIsGeneratingBio(true)
    try {
      const bio = await OpenAIService.generateBio(formData.interests, formData.activities, formData.role)
      setFormData((prev) => ({ ...prev, bio }))
      setBioGenerated(true)
    } catch (error) {
      console.error("Failed to generate bio:", error)
    } finally {
      setIsGeneratingBio(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-6xl mb-4"
              >
                👋
              </motion.div>
              <h2 className="text-3xl font-bold text-jungle-accent mb-2">Welcome to Office Pulse!</h2>
              <p className="text-jungle-textLight/70">Let's get you set up to connect with amazing colleagues</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-jungle-textLight">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="mt-1 bg-white/10 border-white/20 text-jungle-textLight placeholder:text-jungle-textLight/50"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-jungle-textLight">
                  Role
                </Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Product Designer, Software Engineer"
                  className="mt-1 bg-white/10 border-white/20 text-jungle-textLight placeholder:text-jungle-textLight/50"
                />
              </div>
            </div>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-6xl mb-4"
              >
                🏢
              </motion.div>
              <h2 className="text-3xl font-bold text-jungle-accent mb-2">When are you in the office?</h2>
              <p className="text-jungle-textLight/70">Select the days you're typically in the office</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {days.map((day, index) => (
                <motion.div
                  key={day.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={formData.officeDays.includes(day.id) ? "default" : "outline"}
                    className={`w-full h-24 flex flex-col items-center justify-center ${
                      formData.officeDays.includes(day.id)
                        ? "bg-jungle-accent text-jungle-textDark glow-effect"
                        : "border-white/20 hover:bg-white/10 text-jungle-textLight"
                    }`}
                    onClick={() => toggleSelection("officeDays", day.id)}
                  >
                    <span className="text-2xl mb-1">{day.emoji}</span>
                    <span className="text-sm font-medium">{day.short}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="text-6xl mb-4"
              >
                🌟
              </motion.div>
              <h2 className="text-3xl font-bold text-jungle-accent mb-2">What are you passionate about?</h2>
              <p className="text-jungle-textLight/70">Select your interests to find like-minded colleagues</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {interests.map((interest, index) => (
                <motion.div
                  key={interest.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={formData.interests.includes(interest.id) ? "default" : "outline"}
                    className={`w-full h-16 flex flex-col items-center justify-center ${
                      formData.interests.includes(interest.id)
                        ? "bg-jungle-accent text-jungle-textDark glow-effect"
                        : "border-white/20 hover:bg-white/10 text-jungle-textLight"
                    }`}
                    onClick={() => toggleSelection("interests", interest.id)}
                  >
                    <span className="text-xl mb-1">{interest.emoji}</span>
                    <span className="text-xs">{interest.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-6xl mb-4"
              >
                🤝
              </motion.div>
              <h2 className="text-3xl font-bold text-jungle-accent mb-2">How do you like to connect?</h2>
              <p className="text-jungle-textLight/70">Choose your preferred activities for meeting colleagues</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={formData.activities.includes(activity.id) ? "default" : "outline"}
                    className={`w-full h-20 flex flex-col items-center justify-center ${
                      formData.activities.includes(activity.id)
                        ? "bg-jungle-accent text-jungle-textDark glow-effect"
                        : "border-white/20 hover:bg-white/10 text-jungle-textLight"
                    }`}
                    onClick={() => toggleSelection("activities", activity.id)}
                  >
                    <span className="text-2xl mb-1">{activity.emoji}</span>
                    <span className="text-sm">{activity.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-6xl mb-4"
              >
                📸
              </motion.div>
              <h2 className="text-3xl font-bold text-jungle-accent mb-2">Add your photo</h2>
              <p className="text-jungle-textLight/70">Help colleagues recognize you around the office</p>
            </div>
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <Avatar className="w-32 h-32 ring-4 ring-jungle-accent/50">
                  <AvatarImage src={formData.photo ? URL.createObjectURL(formData.photo) : undefined} />
                  <AvatarFallback className="bg-jungle-accent text-jungle-textDark text-4xl">
                    {formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "👤"}
                  </AvatarFallback>
                </Avatar>
                <motion.div
                  className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <Upload className="w-8 h-8 text-white" />
                </motion.div>
              </div>
              <Button
                variant="outline"
                className="border-jungle-accent text-jungle-accent hover:bg-jungle-accent hover:text-jungle-textDark"
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = "image/*"
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      setFormData((prev) => ({ ...prev, photo: file }))
                    }
                  }
                  input.click()
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="text-6xl mb-4"
              >
                ✨
              </motion.div>
              <h2 className="text-3xl font-bold text-jungle-accent mb-2">Generate your bio</h2>
              <p className="text-jungle-textLight/70">Let AI create a fun intro based on your interests</p>
            </div>
            <div className="space-y-6">
              {formData.bio ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-lg glass-effect border border-jungle-accent/30"
                >
                  <motion.p
                    className={`text-lg text-center ${bioGenerated ? "typing-effect" : ""}`}
                    initial={{ width: 0 }}
                    animate={{ width: bioGenerated ? "100%" : "auto" }}
                    transition={{ duration: 2 }}
                  >
                    {formData.bio}
                  </motion.p>
                </motion.div>
              ) : (
                <div className="text-center">
                  <Button
                    onClick={generateBio}
                    disabled={isGeneratingBio || formData.interests.length === 0}
                    className="bg-jungle-accent text-jungle-textDark hover:bg-jungle-accent/90 glow-effect"
                    size="lg"
                  >
                    {isGeneratingBio ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Wand2 className="w-5 h-5 mr-2" />
                      </motion.div>
                    ) : (
                      <Sparkles className="w-5 h-5 mr-2" />
                    )}
                    {isGeneratingBio ? "Generating..." : "Generate My Bio"}
                  </Button>
                </div>
              )}
              {formData.bio && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBioGenerated(false)
                      generateBio()
                    }}
                    disabled={isGeneratingBio}
                    className="border-jungle-accent text-jungle-accent hover:bg-jungle-accent hover:text-jungle-textDark"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Another
                  </Button>
                </div>
              )}
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
        return formData.name && formData.role
      case 1:
        return formData.officeDays.length > 0
      case 2:
        return formData.interests.length > 0
      case 3:
        return formData.activities.length > 0
      case 4:
        return true // Photo is optional
      case 5:
        return formData.bio
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-jungle-background">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-jungle-accent/5 via-transparent to-jungle-green/5 pointer-events-none" />

      <Card className="w-full max-w-2xl glass-effect border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-sm text-jungle-textLight/70">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
            </CardTitle>
            <span className="text-sm text-jungle-accent font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-8">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="border-white/20 hover:bg-white/10 text-jungle-textLight"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSaving}
              className="bg-jungle-accent text-jungle-textDark hover:bg-jungle-accent/90 glow-effect"
            >
              {isSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                </motion.div>
              ) : currentStep === steps.length - 1 ? (
                "Complete Setup"
              ) : (
                "Next"
              )}
              {!isSaving && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
