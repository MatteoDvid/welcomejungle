"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion"
import { useLanguage } from "@/contexts/LanguageContext"
import { useTheme } from "@/contexts/ThemeContext"
import { ModernHeader } from "./modern-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { generateAvatar } from "@/lib/avatar-generator"
import confetti from "canvas-confetti"
import {
  Heart,
  X,
  Star,
  MapPin,
  Briefcase,
  Clock,
  Users,
  MessageCircle,
  Zap,
  Coffee,
  Code,
  Palette,
  Music,
  Plane,
  BookOpen,
  Gamepad2,
  Sparkles,
  RotateCcw,
  Info
} from "lucide-react"

interface Colleague {
  id: string
  name: string
  jobTitle: string
  department: string
  location: string
  bio: string
  avatar?: string
  interests: string[]
  skills: string[]
  workStyle: string
  compatibilityScore: number
  commonInterests: string[]
  isOnline: boolean
  nextAvailable?: string
}

const sampleColleagues: Colleague[] = [
  {
    id: "1",
    name: "Sarah Chen",
    jobTitle: "UX Designer",
    department: "Product Design",
    location: "New York, NY",
    bio: "Passionate about creating user-centered designs that make a difference. Love collaborating with cross-functional teams and always eager to learn new technologies.",
    interests: ["design", "coffee", "travel", "music"],
    skills: ["Figma", "User Research", "Prototyping"],
    workStyle: "collaborative",
    compatibilityScore: 92,
    commonInterests: ["design", "coffee"],
    isOnline: true
  },
  {
    id: "2", 
    name: "Marcus Rodriguez",
    jobTitle: "Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    bio: "Full-stack developer with a passion for clean code and beautiful interfaces. When not coding, you'll find me exploring new coffee shops or playing guitar.",
    interests: ["tech", "coffee", "music", "gaming"],
    skills: ["React", "TypeScript", "Node.js"],
    workStyle: "independent",
    compatibilityScore: 87,
    commonInterests: ["tech", "music"],
    isOnline: false,
    nextAvailable: "2:00 PM"
  },
  {
    id: "3",
    name: "Emily Watson",
    jobTitle: "Product Manager",
    department: "Product",
    location: "Austin, TX", 
    bio: "Strategic thinker who loves turning complex problems into simple solutions. Always looking for opportunities to connect with people and learn from different perspectives.",
    interests: ["reading", "travel", "networking", "coffee"],
    skills: ["Strategy", "Analytics", "Leadership"],
    workStyle: "collaborative",
    compatibilityScore: 95,
    commonInterests: ["reading", "networking"],
    isOnline: true
  },
  {
    id: "4",
    name: "David Kim",
    jobTitle: "Data Scientist",
    department: "Analytics",
    location: "Seattle, WA",
    bio: "Love finding insights in data and translating complex analytics into actionable business strategies. Passionate about machine learning and AI applications.",
    interests: ["tech", "reading", "gaming", "travel"],
    skills: ["Python", "Machine Learning", "SQL"],
    workStyle: "structured",
    compatibilityScore: 89,
    commonInterests: ["tech", "reading"],
    isOnline: true
  }
]

const interestIcons: Record<string, any> = {
  "tech": Code,
  "design": Palette,
  "coffee": Coffee,
  "travel": Plane,
  "music": Music,
  "reading": BookOpen,
  "gaming": Gamepad2,
  "networking": Users
}

export function ModernMatchInterface() {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matches, setMatches] = useState<string[]>([])
  const [showMatch, setShowMatch] = useState(false)
  const [lastAction, setLastAction] = useState<'like' | 'pass' | null>(null)
  const [undoStack, setUndoStack] = useState<number[]>([])

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -50, 0, 50, 200], [0, 1, 1, 1, 0])

  const currentColleague = sampleColleagues[currentIndex]
  const hasMoreCards = currentIndex < sampleColleagues.length

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        handleLike()
      } else {
        handlePass()
      }
    }
  }

  const handleLike = () => {
    if (!hasMoreCards) return
    
    setLastAction('like')
    setUndoStack(prev => [...prev, currentIndex])
    setMatches(prev => [...prev, currentColleague.id])
    
    // Trigger match animation
    setShowMatch(true)
    
    // Confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']
    })
    
    setTimeout(() => {
      setShowMatch(false)
      nextCard()
    }, 2000)
  }

  const handlePass = () => {
    if (!hasMoreCards) return
    
    setLastAction('pass')
    setUndoStack(prev => [...prev, currentIndex])
    nextCard()
  }

  const handleUndo = () => {
    if (undoStack.length === 0) return
    
    const previousIndex = undoStack[undoStack.length - 1]
    setUndoStack(prev => prev.slice(0, -1))
    setCurrentIndex(previousIndex)
    
    if (lastAction === 'like') {
      setMatches(prev => prev.filter(id => id !== sampleColleagues[previousIndex].id))
    }
    
    setLastAction(null)
  }

  const nextCard = () => {
    setCurrentIndex(prev => prev + 1)
    x.set(0)
  }

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 80) return "text-blue-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getCompatibilityBg = (score: number) => {
    if (score >= 90) return "bg-green-100 dark:bg-green-900/20"
    if (score >= 80) return "bg-blue-100 dark:bg-blue-900/20"
    if (score >= 70) return "bg-yellow-100 dark:bg-yellow-900/20"
    return "bg-red-100 dark:bg-red-900/20"
  }

  // Generate avatar for colleague if needed
  if (currentColleague && !currentColleague.avatar) {
    const generatedAvatar = generateAvatar(currentColleague.name, "employee")
    currentColleague.avatar = `data:image/svg+xml;base64,${btoa(generatedAvatar.svg)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <ModernHeader 
        title={t.matches.title}
        subtitle={t.matches.subtitle}
        showSearch={true}
      />

      <div className="container mx-auto px-4 py-8 max-w-lg">
        
        {/* Stats Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {matches.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Matches
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {sampleColleagues.length - currentIndex}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Remaining
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Undo
          </Button>
        </div>

        {/* Match Success Animation */}
        <AnimatePresence>
          {showMatch && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.6 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t.matches.matchFound}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You and {currentColleague?.name} are now connected!
                </p>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Heart className="w-8 h-8 text-red-500 mx-auto" />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Stack */}
        <div className="relative h-[650px] mb-6">
          {!hasMoreCards ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                <div className="text-6xl mb-4">🎊</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  All caught up!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You've seen all available colleagues. Check back later for new connections!
                </p>
                <div className="flex items-center justify-center space-x-2 text-blue-500">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">
                    {matches.length} total matches
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {/* Next Card (background) */}
              {currentIndex + 1 < sampleColleagues.length && (
                <motion.div
                  key={`${currentIndex + 1}-bg`}
                  className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
                  style={{ 
                    zIndex: 1,
                    scale: 0.95,
                    opacity: 0.5 
                  }}
                />
              )}

              {/* Current Card */}
              <motion.div
                key={currentIndex}
                className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl cursor-grab active:cursor-grabbing"
                style={{ 
                  x, 
                  rotate, 
                  opacity,
                  zIndex: 2 
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                whileHover={{ scale: 1.02 }}
                dragElastic={0.2}
              >
                <div className="h-full flex flex-col">
                  
                  {/* Header with Avatar and Status */}
                  <div className="relative p-6 pb-4">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                          <AvatarImage src={currentColleague.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {currentColleague.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        {currentColleague.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {currentColleague.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {currentColleague.jobTitle}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {currentColleague.department}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {currentColleague.location}
                        </p>
                      </div>
                    </div>

                    {/* Compatibility Score */}
                    <div className={`absolute top-6 right-6 px-3 py-1 rounded-full ${getCompatibilityBg(currentColleague.compatibilityScore)}`}>
                      <div className="flex items-center space-x-1">
                        <Star className={`w-4 h-4 ${getCompatibilityColor(currentColleague.compatibilityScore)}`} />
                        <span className={`text-sm font-bold ${getCompatibilityColor(currentColleague.compatibilityScore)}`}>
                          {currentColleague.compatibilityScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="px-6 pb-4">
                    {currentColleague.isOnline ? (
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-sm font-medium">Available now</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">Available at {currentColleague.nextAvailable}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {currentColleague.bio}
                    </p>
                  </div>

                  {/* Common Interests */}
                  {currentColleague.commonInterests.length > 0 && (
                    <div className="px-6 pb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                        Shared Interests
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentColleague.commonInterests.map(interest => {
                          const Icon = interestIcons[interest] || Star
                          return (
                            <Badge
                              key={interest}
                              variant="secondary"
                              className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 flex items-center gap-1"
                            >
                              <Icon className="w-3 h-3" />
                              {interest}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* All Interests */}
                  <div className="px-6 pb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentColleague.interests.map(interest => {
                        const Icon = interestIcons[interest] || Star
                        const isCommon = currentColleague.commonInterests.includes(interest)
                        return (
                          <Badge
                            key={interest}
                            variant={isCommon ? "default" : "outline"}
                            className={`flex items-center gap-1 ${
                              isCommon 
                                ? "bg-blue-500 text-white" 
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            <Icon className="w-3 h-3" />
                            {interest}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="px-6 pb-6 flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentColleague.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Action Buttons */}
        {hasMoreCards && (
          <div className="flex justify-center space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="lg"
                onClick={handlePass}
                className="w-16 h-16 rounded-full border-2 border-gray-300 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 match-button-pass"
              >
                <X className="w-6 h-6 text-gray-600 hover:text-red-500" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="lg"
                onClick={() => {}}
                className="w-16 h-16 rounded-full bg-jungle-yellow text-jungle-gray hover:bg-jungle-yellow/90 match-button-info"
              >
                <Info className="w-6 h-6" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="lg"
                onClick={handleLike}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-jungle-gray to-black hover:from-black hover:to-jungle-gray match-button-like"
              >
                <Heart className="w-6 h-6 text-white" />
              </Button>
            </motion.div>
          </div>
        )}

        {/* Swipe Hints */}
        {hasMoreCards && currentIndex === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center mt-6 text-gray-500 dark:text-gray-400"
          >
            <p className="text-sm">
              💡 Swipe right to match, left to pass
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
} 