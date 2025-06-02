"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, X, Sparkles, Calendar, MapPin, Users } from "lucide-react"
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
    suggestedActivity: "Coffee & Design Chat",
    activityEmoji: "☕",
    date: "Today, 3:00 PM",
    location: "Café Corner, 2nd Floor",
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
    suggestedActivity: "Tech Talk Lunch",
    activityEmoji: "💻",
    date: "Tomorrow, 12:30 PM",
    location: "Lunch Area, 1st Floor",
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
    suggestedActivity: "Lunchtime Workout",
    activityEmoji: "💪",
    date: "Wednesday, 12:00 PM",
    location: "Office Gym",
  },
]

export function MatchInterface() {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [matches, setMatches] = useState(sampleMatches)
  const [showSuccess, setShowSuccess] = useState(false)
  const [matchedActivity, setMatchedActivity] = useState("")

  const currentMatch = matches[currentMatchIndex]

  const handleJoin = () => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    setMatchedActivity(currentMatch.suggestedActivity)
    setShowSuccess(true)

    // Simulate Slack notification
    setTimeout(() => {
      console.log("Slack notification sent:", {
        message: `🎉 Great news! You've joined "${currentMatch.suggestedActivity}" with ${currentMatch.members.map((m) => m.name).join(", ")}`,
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
      // Reset to beginning or show "no more matches"
      setCurrentMatchIndex(0)
    }
  }

  const getInterestEmoji = (interest: string) => {
    const emojiMap: { [key: string]: string } = {
      tech: "💻",
      design: "🎨",
      coffee: "☕",
      fitness: "💪",
      music: "🎵",
      gaming: "🎮",
      books: "📚",
      food: "🍕",
      travel: "✈️",
      photography: "📸",
    }
    return emojiMap[interest] || "🌟"
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>
          <h2 className="text-4xl font-bold text-primary mb-4">Match Made!</h2>
          <p className="text-xl text-muted-foreground mb-6">You've joined "{matchedActivity}"</p>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            className="text-primary"
          >
            <Sparkles className="w-12 h-12 mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (!currentMatch) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glass-effect border-white/20 text-center p-8">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-primary mb-2">No More Matches</h2>
          <p className="text-muted-foreground">Check back later for new connection opportunities!</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMatch.id}
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Card className="glass-effect border-white/20 overflow-hidden">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="text-6xl"
                  >
                    {currentMatch.activityEmoji}
                  </motion.div>
                </div>
                <CardTitle className="text-2xl text-primary mb-2">{currentMatch.suggestedActivity}</CardTitle>
                <div className="flex items-center justify-center text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {currentMatch.date}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {currentMatch.location}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Members */}
                <div>
                  <div className="flex items-center mb-3">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">Who's joining ({currentMatch.members.length})</span>
                  </div>
                  <div className="space-y-3">
                    {currentMatch.members.map((member, index) => (
                      <motion.div
                        key={member.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Avatar className="w-10 h-10 ring-2 ring-primary/30">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary text-text-dark">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                        <div className="flex space-x-1">
                          {member.interests.slice(0, 2).map((interest) => (
                            <span key={interest} className="text-lg">
                              {getInterestEmoji(interest)}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Shared Interests */}
                <div>
                  <div className="flex items-center mb-3">
                    <Sparkles className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">Shared interests</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentMatch.sharedInterests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="bg-primary/20 text-primary border-primary/30"
                      >
                        {getInterestEmoji(interest)} {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <motion.div className="flex-1" whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="w-full h-14 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500"
                      onClick={handleSkip}
                    >
                      <X className="w-5 h-5 mr-2" />
                      Skip
                    </Button>
                  </motion.div>
                  <motion.div className="flex-1" whileTap={{ scale: 0.95 }}>
                    <Button
                      className="w-full h-14 bg-primary text-text-dark hover:bg-primary/90 glow-effect"
                      onClick={handleJoin}
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Join
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Match Counter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {currentMatchIndex + 1} of {matches.length} matches
          </p>
          <div className="flex justify-center space-x-2 mt-2">
            {matches.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentMatchIndex ? "bg-primary" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
