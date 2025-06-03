"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Calendar, Users, MapPin, Clock, Plus } from "lucide-react"

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

export function CalendarView() {
  const [selectedDay, setSelectedDay] = useState(1) // Tuesday is selected by default
  const [weeklyData, setWeeklyData] = useState(weekData)

  const togglePresence = (dayIndex: number) => {
    setWeeklyData((prev) =>
      prev.map((day, index) => (index === dayIndex ? { ...day, yourPresence: !day.yourPresence } : day)),
    )
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "match":
        return "bg-black/20 text-black border-black/30"
      case "meeting":
        return "bg-black/20 text-black border-black/30"
      case "social":
        return "bg-black/20 text-black border-black/30"
      default:
        return "bg-black/20 text-black border-black/30"
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
    <div className="force-white-page-override">

      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Your Week at the Office 📅</h1>
          <p className="text-muted-foreground">Plan your presence and discover who else&apos;s around</p>
        </motion.div>

        {/* Week Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-effect border-black/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-black" />
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
                        ? "border-black bg-black/10 glow-effect"
                        : day.isToday
                          ? "border-black bg-black/10"
                          : "border-black/20 bg-black/5 hover:bg-black/10"
                    }`}
                    onClick={() => setSelectedDay(index)}
                  >
                    <div className="text-center space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">{day.day}</p>
                        <p className="font-semibold">{day.date}</p>
                        {day.isToday && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Today
                          </Badge>
                        )}
                      </div>

                      {/* Presence Toggle */}
                      <div className="flex items-center justify-center space-x-2">
                        <Switch
                          checked={day.yourPresence}
                          onCheckedChange={() => togglePresence(index)}
                          className="data-[state=checked]:bg-black"
                        />
                        <span className="text-xs">{day.yourPresence ? "In office" : "Remote"}</span>
                      </div>

                      {/* Colleague Count */}
                      {day.yourPresence && (
                        <div className="flex items-center justify-center space-x-1">
                          <Users className="w-3 h-3 text-black" />
                          <span className="text-xs text-black font-medium">{day.colleagues.length} colleagues</span>
                        </div>
                      )}

                      {/* Events Count */}
                      {day.events.length > 0 && (
                        <div className="flex justify-center">
                          <Badge variant="outline" className="text-xs">
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
            <Card className="glass-effect border-black/20 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-black" />
                  Who&apos;s in the office - {selectedDayData.day}
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
                          className="flex items-center space-x-3 p-3 rounded-lg bg-black/5 hover:bg-black/10 transition-colors"
                        >
                          <Avatar className="w-10 h-10 ring-2 ring-black/30">
                            <AvatarImage src={colleague.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-black text-text-dark">
                              {colleague.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{colleague.name}</p>
                            <p className="text-sm text-muted-foreground">{colleague.role}</p>
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
                      <p className="text-muted-foreground">No colleagues scheduled yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Be the first to plan your office day!</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">🏠</div>
                    <p className="text-muted-foreground">You&apos;re working remotely</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 border-black text-black hover:bg-black hover:text-white"
                      onClick={() => togglePresence(selectedDay)}
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
            <Card className="glass-effect border-black/20 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-black" />
                    Events & Matches
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-black text-black hover:bg-black hover:text-white"
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
                        className="p-4 rounded-lg bg-black/5 hover:bg-black/10 transition-colors border border-black/10"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{event.title}</h4>
                          <Badge className={getEventTypeColor(event.type)}>{event.type}</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
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
                    <p className="text-muted-foreground">No events scheduled</p>
                    <p className="text-sm text-muted-foreground mt-1">Perfect day for spontaneous connections!</p>
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
