"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Calendar, Users, MapPin, Clock, Plus, Edit3 } from "lucide-react"

interface DayData {
  date: string
  day: string
  isToday: boolean
  isSelected: boolean
  colleagues: {
    name: string
    avatar: string
    role: string
    interests: string[]
  }[]
  events: {
    title: string
    time: string
    location: string
    attendees: number
    type: "match" | "meeting" | "social"
  }[]
  yourPresence: boolean
}

const weekData: DayData[] = [
  {
    date: "Dec 18",
    day: "Mon",
    isToday: false,
    isSelected: false,
    yourPresence: true,
    colleagues: [
      {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "UX Designer",
        interests: ["design", "coffee"],
      },
      {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Frontend Dev",
        interests: ["tech", "gaming"],
      },
      {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Product Manager",
        interests: ["books", "travel"],
      },
    ],
    events: [
      { title: "Coffee Chat", time: "10:00 AM", location: "Café Corner", attendees: 3, type: "match" },
      { title: "Team Standup", time: "2:00 PM", location: "Conference Room A", attendees: 8, type: "meeting" },
    ],
  },
  {
    date: "Dec 19",
    day: "Tue",
    isToday: true,
    isSelected: true,
    yourPresence: true,
    colleagues: [
      {
        name: "Alex Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Backend Dev",
        interests: ["tech", "fitness"],
      },
      {
        name: "Lisa Park",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "DevOps Engineer",
        interests: ["tech", "music"],
      },
      {
        name: "David Kim",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Data Scientist",
        interests: ["fitness", "photography"],
      },
      {
        name: "Rachel Green",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Marketing Lead",
        interests: ["travel", "food"],
      },
    ],
    events: [
      { title: "Tech Talk Lunch", time: "12:30 PM", location: "Lunch Area", attendees: 4, type: "match" },
      { title: "Happy Hour", time: "5:30 PM", location: "Rooftop Terrace", attendees: 12, type: "social" },
    ],
  },
  {
    date: "Dec 20",
    day: "Wed",
    isToday: false,
    isSelected: false,
    yourPresence: true,
    colleagues: [
      {
        name: "Tom Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Sales Rep",
        interests: ["fitness", "music"],
      },
      {
        name: "Jenny Liu",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Designer",
        interests: ["design", "art"],
      },
    ],
    events: [{ title: "Lunchtime Workout", time: "12:00 PM", location: "Office Gym", attendees: 6, type: "match" }],
  },
  {
    date: "Dec 21",
    day: "Thu",
    isToday: false,
    isSelected: false,
    yourPresence: false,
    colleagues: [],
    events: [],
  },
  {
    date: "Dec 22",
    day: "Fri",
    isToday: false,
    isSelected: false,
    yourPresence: true,
    colleagues: [
      {
        name: "Chris Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Product Owner",
        interests: ["tech", "books"],
      },
      {
        name: "Anna Martinez",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "QA Engineer",
        interests: ["gaming", "coffee"],
      },
    ],
    events: [{ title: "Friday Social", time: "4:00 PM", location: "Main Lobby", attendees: 15, type: "social" }],
  },
]

export function WeeklyCalendar() {
  const [selectedDay, setSelectedDay] = useState(1) // Tuesday is selected by default
  const [weeklyData, setWeeklyData] = useState(weekData)
  const [isEditing, setIsEditing] = useState(false)

  const togglePresence = (dayIndex: number) => {
    setWeeklyData((prev) =>
      prev.map((day, index) => (index === dayIndex ? { ...day, yourPresence: !day.yourPresence } : day)),
    )
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "match":
        return "bg-jungle-accent/20 text-jungle-accent border-jungle-accent/30"
      case "meeting":
        return "bg-jungle-blue/20 text-jungle-blue border-jungle-blue/30"
      case "social":
        return "bg-jungle-green/20 text-jungle-green border-jungle-green/30"
      default:
        return "bg-white/10 text-jungle-textLight border-white/20"
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
      art: "🎭",
    }
    return emojiMap[interest] || "🌟"
  }

  const selectedDayData = weeklyData[selectedDay]

  return (
    <div className="min-h-screen p-4 md:p-6 bg-jungle-background">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-jungle-accent/5 via-transparent to-jungle-green/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-jungle-accent mb-2">Your Week at the Office 📅</h1>
          <p className="text-jungle-textLight/70">Plan your presence and discover who else is around</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 border-jungle-accent text-jungle-accent hover:bg-jungle-accent hover:text-jungle-textDark"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? "Done Editing" : "Edit Schedule"}
          </Button>
        </motion.div>

        {/* Week Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-jungle-accent" />
                Week of December 18-22, 2023
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {weeklyData.map((day, index) => (
                  <motion.div
                    key={day.day}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedDay === index
                        ? "border-jungle-accent bg-jungle-accent/10 glow-effect"
                        : day.isToday
                          ? "border-jungle-green bg-jungle-green/10"
                          : "border-white/20 bg-white/5 hover:bg-white/10"
                    }`}
                    onClick={() => setSelectedDay(index)}
                  >
                    <div className="text-center space-y-3">
                      <div>
                        <p className="text-sm text-jungle-textLight/70">{day.day}</p>
                        <p className="font-semibold text-jungle-textLight">{day.date}</p>
                        {day.isToday && (
                          <Badge variant="secondary" className="text-xs mt-1 bg-jungle-green text-white">
                            Today
                          </Badge>
                        )}
                      </div>

                      {/* Presence Toggle */}
                      <div className="flex items-center justify-center space-x-2">
                        <Switch
                          checked={day.yourPresence}
                          onCheckedChange={() => togglePresence(index)}
                          disabled={!isEditing}
                          className="data-[state=checked]:bg-jungle-accent"
                        />
                        <span className="text-xs text-jungle-textLight">
                          {day.yourPresence ? "In office" : "Remote"}
                        </span>
                      </div>

                      {/* Colleague Count */}
                      {day.yourPresence && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center justify-center space-x-1"
                        >
                          <Users className="w-3 h-3 text-jungle-accent" />
                          <span className="text-xs text-jungle-accent font-medium">
                            {day.colleagues.length} colleagues
                          </span>
                        </motion.div>
                      )}

                      {/* Events Count */}
                      {day.events.length > 0 && (
                        <div className="flex justify-center">
                          <Badge variant="outline" className="text-xs border-jungle-accent/50 text-jungle-accent">
                            {day.events.length} event{day.events.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selected Day Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colleagues Present */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-effect border-white/20 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-jungle-accent" />
                  Who's in the office - {selectedDayData.day}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDayData.yourPresence ? (
                  selectedDayData.colleagues.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDayData.colleagues.map((colleague, index) => (
                        <motion.div
                          key={colleague.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <Avatar className="w-10 h-10 ring-2 ring-jungle-accent/30">
                            <AvatarImage src={colleague.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-jungle-accent text-jungle-textDark">
                              {colleague.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-jungle-textLight">{colleague.name}</p>
                            <p className="text-sm text-jungle-textLight/70">{colleague.role}</p>
                          </div>
                          <div className="flex space-x-1">
                            {colleague.interests.slice(0, 3).map((interest) => (
                              <span key={interest} className="text-lg" title={interest}>
                                {getInterestEmoji(interest)}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🏢</div>
                      <p className="text-jungle-textLight/70">No colleagues scheduled yet</p>
                      <p className="text-sm text-jungle-textLight/50 mt-1">Be the first to plan your office day!</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🏠</div>
                    <p className="text-jungle-textLight/70">You're working remotely</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 border-jungle-accent text-jungle-accent hover:bg-jungle-accent hover:text-jungle-textDark"
                      onClick={() => togglePresence(selectedDay)}
                      disabled={!isEditing}
                    >
                      Switch to office
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Events & Matches */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-effect border-white/20 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-jungle-accent" />
                    Events & Matches
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-jungle-accent text-jungle-accent hover:bg-jungle-accent hover:text-jungle-textDark"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Event
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDayData.events.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDayData.events.map((event, index) => (
                      <motion.div
                        key={event.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-jungle-textLight">{event.title}</h4>
                          <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-jungle-textLight/70">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {event.attendees} attendees
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📅</div>
                    <p className="text-jungle-textLight/70">No events scheduled</p>
                    <p className="text-sm text-jungle-textLight/50 mt-1">Perfect day for spontaneous connections!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
