"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, X, Sparkles, Clock, MapPin, Users2, Zap } from "lucide-react"
import confetti from "canvas-confetti"

interface Match {
  id: string
  members: {
    name: string
    role: string
    avatar: string
    interests: string[]
  }[]
  sharedInterests: string[]
  suggestedActivity: string
  activityEmoji: string
  date: string
  location: string
  vibe: string
}

const sampleMatches: Match[] = [
  {
    id: "1",
    members: [
      {
        name: "Sarah Chen",
        role: "UX Designer",
        avatar: "/placeholder.svg?height=40&width=40",
        interests: ["design", "coffee"],
      },
      {
        name: "Mike Johnson",
        role: "Frontend Dev",
        avatar: "/placeholder.svg?height=40&width=40",
        interests: ["tech", "coffee"],
      },
      {
        name: "Emma Wilson",
        role: "Product Manager",
        avatar: "/placeholder.svg?height=40&width=40",
        interests: ["coffee", "books"],
      },
    ],
    sharedInterests: ["coffee", "design"],
    suggestedActivity: "Coffee Chat",
    activityEmoji: "☕",
    date: "15:00",
    location: "Café Corner",
    vibe: "Chill & Creative"
  },
  {
    id: "2",
    members: [
      {
        name: "Alex Rodriguez",
        role: "Backend Dev",
        avatar: "/placeholder.svg?height=40&width=40",
        interests: ["tech", "gaming"],
      },
      {
        name: "Lisa Park",
        role: "DevOps Engineer",
        avatar: "/placeholder.svg?height=40&width=40",
        interests: ["tech", "fitness"],
      },
    ],
    sharedInterests: ["tech", "problem-solving"],
    suggestedActivity: "Tech Talk",
    activityEmoji: "💻",
    date: "12:30",
    location: "Lunch Area",
    vibe: "Geeky & Fun"
  },
  {
    id: "3",
    members: [
      {
        name: "David Kim",
        role: "Data Scientist",
        avatar: "/placeholder.svg?height=40&width=40",
        interests: ["fitness", "music"],
      },
      {
        name: "Rachel Green",
        role: "Marketing Lead",
        avatar: "/placeholder.svg?height=40&width=40",
        interests: ["fitness", "travel"],
      },
      {
        name: "Tom Brown",
        role: "Sales Rep",
        avatar: "/placeholder.svg?height=40&width=40",
        interests: ["fitness", "food"],
      },
    ],
    sharedInterests: ["fitness", "wellness"],
    suggestedActivity: "Workout Session",
    activityEmoji: "💪",
    date: "12:00",
    location: "Office Gym",
    vibe: "Energy Boost"
  },
]

export function MatchInterface() {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [matches, setMatches] = useState(sampleMatches)
  const [showSuccess, setShowSuccess] = useState(false)
  const [matchedActivity, setMatchedActivity] = useState("")

  const currentMatch = matches[currentMatchIndex]

  const handleJoin = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFE666', '#000000', '#FFFFFF']
    })

    setMatchedActivity(currentMatch.suggestedActivity)
    setShowSuccess(true)

    setTimeout(() => {
      console.log("Slack notification sent:", {
        message: `🎉 You joined "${currentMatch.suggestedActivity}" with ${currentMatch.members.length} colleagues!`,
        channel: "#office-pulse-matches",
      })
    }, 1000)

    setTimeout(() => {
      setShowSuccess(false)
      nextMatch()
    }, 3000)
  }

  const handleSkip = () => {
    nextMatch()
  }

  const nextMatch = () => {
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1)
    } else {
      setCurrentMatchIndex(0)
    }
  }

  const getInterestEmoji = (interest: string) => {
    const emojiMap: { [key: string]: string } = {
      tech: "💻", design: "🎨", coffee: "☕", fitness: "💪", music: "🎵",
      gaming: "🎮", books: "📚", food: "🍕", travel: "✈️", photography: "📸",
      "problem-solving": "🧩", wellness: "🧘"
    }
    return emojiMap[interest] || "🌟"
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, repeat: 3 }}
            className="text-9xl mb-8"
          >
            🎉
          </motion.div>
          <div className="text-6xl mb-6">✨</div>
          <h2 className="text-4xl font-bold text-black mb-4">Match!</h2>
          <div className="text-3xl mb-4">{currentMatch.activityEmoji}</div>
          <p className="text-xl text-black opacity-75">"{matchedActivity}"</p>
        </motion.div>
      </div>
    )
  }

  if (!currentMatch) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glass-effect text-center p-12">
          <div className="text-8xl mb-6">🎯</div>
          <h2 className="text-3xl font-bold text-black mb-4">All Done!</h2>
          <p className="text-black opacity-70">New matches coming soon ✨</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMatch.id}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card className="glass-effect border-0 overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                {/* Header avec emoji principal */}
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 text-center relative">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    className="text-8xl mb-4"
                  >
                    {currentMatch.activityEmoji}
                  </motion.div>
                  <h1 className="text-2xl font-bold text-black mb-2">
                    {currentMatch.suggestedActivity}
                  </h1>
                  <div className="text-black opacity-60 text-sm font-medium">
                    {currentMatch.vibe}
                  </div>
                  
                  {/* Info rapide en haut */}
                  <div className="flex justify-center items-center gap-6 mt-4 text-xs">
                    <div className="flex items-center gap-1 bg-black/10 px-3 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">{currentMatch.date}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/10 px-3 py-1 rounded-full">
                      <MapPin className="w-3 h-3" />
                      <span className="font-medium">{currentMatch.location}</span>
                    </div>
                  </div>
                </div>

                {/* Avatars des membres en cercle */}
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-center mb-4">
                    <Users2 className="w-4 h-4 mr-2 text-black opacity-70" />
                    <span className="text-sm font-medium text-black opacity-70">
                      {currentMatch.members.length} people joining
                    </span>
                  </div>
                  
                  <div className="flex justify-center items-center gap-4 mb-6">
                    {currentMatch.members.map((member, index) => (
                      <motion.div
                        key={member.name}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                      >
                        <Avatar className="w-16 h-16 ring-4 ring-yellow-200 mx-auto mb-2">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-black text-white text-lg font-bold">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-xs font-medium text-black">
                          {member.name.split(" ")[0]}
                        </div>
                        <div className="text-xs text-black opacity-50">
                          {member.role.split(" ")[0]}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Intérêts partagés avec emojis */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <Sparkles className="w-4 h-4 text-black opacity-70" />
                      <span className="text-sm font-medium text-black opacity-70">Shared vibes</span>
                    </div>
                    <div className="flex justify-center gap-3">
                      {currentMatch.sharedInterests.map((interest) => (
                        <div
                          key={interest}
                          className="bg-yellow-100 text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                        >
                          <span className="text-lg">{getInterestEmoji(interest)}</span>
                          {interest}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Boutons d'action redesignés */}
                <div className="p-6 bg-gradient-to-t from-gray-50 to-white">
                  <div className="flex gap-4">
                    <motion.div 
                      className="flex-1"
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full h-16 text-2xl border-2 border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 rounded-2xl"
                        onClick={handleSkip}
                      >
                        <X className="w-6 h-6" />
                      </Button>
                    </motion.div>
                    
                    <motion.div 
                      className="flex-1"
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Button
                        className="w-full h-16 text-2xl bg-black text-white hover:bg-gray-800 rounded-2xl shadow-lg border-0"
                        onClick={handleJoin}
                      >
                        <Heart className="w-6 h-6 mr-2" />
                        Join
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Indicateur de progression minimaliste */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center mt-6"
        >
          <div className="flex justify-center gap-2">
            {matches.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentMatchIndex 
                    ? "bg-black w-6" 
                    : "bg-black/20"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-black opacity-50 mt-2">
            {currentMatchIndex + 1} / {matches.length}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
