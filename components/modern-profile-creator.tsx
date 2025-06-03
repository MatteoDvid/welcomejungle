"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTheme } from "@/contexts/ThemeContext"
import { ModernHeader } from "./modern-header"
import { BioEditor } from "./bio-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { generateAvatar, avatarStyles, type GeneratedAvatar } from "@/lib/avatar-generator"
import { 
  User, 
  Camera, 
  Wand2, 
  ChevronRight, 
  ChevronLeft,
  Upload,
  Sparkles,
  MapPin,
  Briefcase,
  Heart,
  Code,
  Palette,
  Coffee,
  Globe,
  Music,
  BookOpen,
  Gamepad2,
  Plane,
  Users,
  CheckCircle2,
  Edit3,
  X
} from "lucide-react"

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  jobTitle: string
  department: string
  location: string
  bio: string
  interests: string[]
  skills: string[]
  workStyle: string
  languages: string[]
  avatar?: string
  generatedAvatar?: GeneratedAvatar
}

const interestOptions = [
  { id: "tech", label: "Technology", icon: Code, color: "bg-blue-500" },
  { id: "design", label: "Design", icon: Palette, color: "bg-pink-500" },
  { id: "coffee", label: "Coffee", icon: Coffee, color: "bg-amber-500" },
  { id: "travel", label: "Travel", icon: Plane, color: "bg-green-500" },
  { id: "music", label: "Music", icon: Music, color: "bg-purple-500" },
  { id: "reading", label: "Reading", icon: BookOpen, color: "bg-indigo-500" },
  { id: "gaming", label: "Gaming", icon: Gamepad2, color: "bg-red-500" },
  { id: "networking", label: "Networking", icon: Users, color: "bg-teal-500" },
]

const workStyleOptions = [
  { id: "collaborative", label: "Collaborative", emoji: "🤝" },
  { id: "independent", label: "Independent", emoji: "🎯" },
  { id: "flexible", label: "Flexible", emoji: "🌊" },
  { id: "structured", label: "Structured", emoji: "📋" },
]

export function ModernProfileCreator() {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const [showAvatarGenerator, setShowAvatarGenerator] = useState(false)
  const [showBioEditor, setShowBioEditor] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    department: "",
    location: "",
    bio: "",
    interests: [],
    skills: [],
    workStyle: "",
    languages: []
  })

  const steps = [
    {
      id: "basic",
      title: t.profile.title,
      subtitle: "Let's start with the basics",
      icon: User
    },
    {
      id: "avatar",
      title: "Choose Your Avatar",
      subtitle: "Make it personal",
      icon: Camera
    },
    {
      id: "professional", 
      title: "Professional Info",
      subtitle: "Tell us about your work",
      icon: Briefcase
    },
    {
      id: "interests",
      title: "Interests & Hobbies", 
      subtitle: "What drives you?",
      icon: Heart
    },
    {
      id: "finish",
      title: "All Set!",
      subtitle: "Welcome to Office Pulse",
      icon: CheckCircle2
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInterestToggle = (interestId: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }))
  }

  const generateUserAvatar = () => {
    const fullName = `${profileData.firstName} ${profileData.lastName}`.trim()
    if (fullName.length > 0) {
      const avatar = generateAvatar(fullName, "employee")
      setProfileData(prev => ({ ...prev, generatedAvatar: avatar }))
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData(prev => ({ 
          ...prev, 
          avatar: e.target?.result as string,
          generatedAvatar: undefined 
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBioSave = (newBio: string) => {
    setProfileData(prev => ({ ...prev, bio: newBio }))
    setShowBioEditor(false)
  }

  const handleBioCancel = () => {
    setShowBioEditor(false)
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <ModernHeader 
        title={currentStepData.title}
        subtitle={currentStepData.subtitle}
      />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep
              
              return (
                <motion.div
                  key={step.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0.5 }}
                  animate={{ 
                    opacity: isActive || isCompleted ? 1 : 0.5,
                    scale: isActive ? 1.1 : 1
                  }}
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                    ${isActive 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs text-center font-medium ${
                    isActive || isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </motion.div>
              )
            })}
          </div>
          
          {/* Progress Line */}
          <div className="relative">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <motion.div
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
          >
            {/* Step 0: Basic Info */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome! Let's get started 👋
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    First, tell us your basic information
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      {t.profile.firstName} *
                    </Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="mt-1"
                      placeholder="John"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      {t.profile.lastName} *
                    </Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="mt-1"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t.profile.email} *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                    placeholder="john.doe@company.com"
                  />
                </div>
              </div>
            )}

            {/* Step 1: Avatar */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Choose Your Avatar ✨
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload a photo or generate a stylized avatar
                  </p>
                </div>

                <div className="flex flex-col items-center space-y-6">
                  {/* Current Avatar Display */}
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                      {profileData.avatar ? (
                        <AvatarImage src={profileData.avatar} />
                      ) : profileData.generatedAvatar ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: profileData.generatedAvatar.svg }}
                          className="w-full h-full"
                        />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
                          {profileData.firstName[0]}{profileData.lastName[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>

                  {/* Avatar Options */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      {t.profile.uploadPhoto}
                    </Button>
                    
                    <Button
                      onClick={generateUserAvatar}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Wand2 className="w-4 h-4" />
                      {t.profile.generateAvatar}
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Avatar Styles Preview (if generated) */}
                  {profileData.generatedAvatar && (
                    <div className="w-full">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Try different styles:
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {avatarStyles.slice(0, 6).map((style) => {
                          const fullName = `${profileData.firstName} ${profileData.lastName}`
                          const avatar = generateAvatar(fullName, "employee", style.id)
                          
                          return (
                            <motion.button
                              key={style.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setProfileData(prev => ({ ...prev, generatedAvatar: avatar }))}
                              className="p-2 rounded-lg border-2 border-transparent hover:border-blue-300 transition-colors"
                            >
                              <div 
                                dangerouslySetInnerHTML={{ __html: avatar.svg }}
                                className="w-16 h-16 mx-auto"
                              />
                              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                                {style.name.split(" ")[0]}
                              </p>
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Professional Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Professional Information 💼
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Help colleagues understand your role and expertise
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="jobTitle" className="text-sm font-medium">
                      {t.profile.jobTitle} *
                    </Label>
                    <Input
                      id="jobTitle"
                      value={profileData.jobTitle}
                      onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
                      className="mt-1"
                      placeholder="Software Engineer"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="department" className="text-sm font-medium">
                      {t.profile.department}
                    </Label>
                    <Input
                      id="department"
                      value={profileData.department}
                      onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                      className="mt-1"
                      placeholder="Engineering"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {t.profile.location}
                  </Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="mt-1"
                    placeholder="New York, NY"
                  />
                </div>

                {/* Enhanced Bio Section */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    <Sparkles className="w-4 h-4 inline mr-1 text-purple-500" />
                    Your Story - Tell us what makes you unique! ✨
                  </Label>
                  
                  {/* Bio Display with Edit Button */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        className="min-h-[120px] pr-16 resize-none text-base leading-relaxed"
                        placeholder="✍️ Click 'Advanced Editor' for creative templates and ideas, or start writing your story here..."
                        rows={6}
                      />
                      
                      {/* Character count */}
                      <div className="absolute bottom-3 right-3 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs border">
                        <span className={`${
                          profileData.bio.length > 300 ? 'text-red-500' : 
                          profileData.bio.length > 200 ? 'text-yellow-500' : 'text-gray-400'
                        }`}>
                          {profileData.bio.length}/300
                        </span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowBioEditor(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 hover:border-purple-300"
                      >
                        <Edit3 className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-600 dark:text-purple-400">Advanced Editor</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const quickTemplates = [
                            `Passionate ${profileData.jobTitle || 'professional'} who loves collaborating and solving creative challenges. I believe in building meaningful connections and delivering impactful work.`,
                            `${profileData.jobTitle || 'Team player'} with a knack for turning ideas into reality. Always eager to learn, grow, and contribute to team success!`,
                            `Creative problem-solver who believes the best work happens when diverse minds come together. I'm driven by innovation and continuous improvement.`,
                            `Collaborative ${profileData.jobTitle || 'professional'} passionate about fostering inclusive environments where everyone can thrive and contribute their unique perspective.`
                          ]
                          const randomTemplate = quickTemplates[Math.floor(Math.random() * quickTemplates.length)]
                          setProfileData(prev => ({ ...prev, bio: randomTemplate }))
                        }}
                        className="flex items-center gap-2"
                      >
                        <Wand2 className="w-4 h-4" />
                        Quick Start
                      </Button>

                      {profileData.bio && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setProfileData(prev => ({ ...prev, bio: "" }))}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                          Clear
                        </Button>
                      )}
                    </div>

                    {/* Bio Preview Enhancement */}
                    {profileData.bio.length > 20 ? (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                              Great start! 👏 Your bio preview:
                            </p>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded border text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              "{profileData.bio}"
                            </div>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                              💡 Tip: Use the Advanced Editor for more creative ideas and templates, or continue editing above.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : profileData.bio.length === 0 && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start space-x-2">
                          <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                              Ready to tell your story? ✨
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Click "Quick Start" for instant templates or "Advanced Editor" for personalized prompts and ideas!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Work Style
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {workStyleOptions.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setProfileData(prev => ({ ...prev, workStyle: option.id }))}
                        className={`p-3 rounded-lg border-2 transition-colors text-left ${
                          profileData.workStyle === option.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{option.emoji}</div>
                        <div className="font-medium text-sm">{option.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Interests */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Interests & Hobbies 🎯
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select what you're passionate about to find like-minded colleagues
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {interestOptions.map((interest) => {
                    const Icon = interest.icon
                    const isSelected = profileData.interests.includes(interest.id)
                    
                    return (
                      <motion.button
                        key={interest.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleInterestToggle(interest.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 mx-auto ${
                          isSelected ? interest.color : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                        </div>
                        <div className={`text-xs font-medium ${
                          isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {interest.label}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Selected: {profileData.interests.length} interests
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Finish */}
            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome to Office Pulse! 🎉
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Your profile is all set up. You're ready to discover amazing colleagues and build meaningful connections.
                </p>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 max-w-md mx-auto">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      {profileData.avatar ? (
                        <AvatarImage src={profileData.avatar} />
                      ) : profileData.generatedAvatar ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: profileData.generatedAvatar.svg }}
                          className="w-full h-full"
                        />
                      ) : (
                        <AvatarFallback>
                          {profileData.firstName[0]}{profileData.lastName[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {profileData.firstName} {profileData.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {profileData.jobTitle}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {profileData.interests.slice(0, 3).map(interestId => {
                          const interest = interestOptions.find(i => i.id === interestId)
                          return interest ? (
                            <Badge key={interestId} variant="secondary" className="text-xs">
                              {interest.label}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.profile.previous}
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={
                (currentStep === 0 && (!profileData.firstName || !profileData.lastName || !profileData.email)) ||
                (currentStep === 2 && !profileData.jobTitle)
              }
            >
              {t.profile.next}
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                // Handle profile creation completion
                console.log("Profile created:", profileData)
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Sparkles className="w-4 h-4" />
              {t.profile.finish}
            </Button>
          )}
        </div>
      </div>

      {/* Bio Editor Modal */}
      <AnimatePresence>
        {showBioEditor && (
          <BioEditor
            initialBio={profileData.bio}
            jobTitle={profileData.jobTitle}
            interests={profileData.interests}
            onSave={handleBioSave}
            onCancel={handleBioCancel}
          />
        )}
      </AnimatePresence>
    </div>
  )
} 