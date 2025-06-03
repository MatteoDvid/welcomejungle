"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, X, Users, Coffee, MessageCircle, Calendar, Sparkles, ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface GroupMember {
  id: string
  name: string
  role: string
  avatar: string
  interests: string[]
  activities: string[]
  bio: string
  officeDays: string[]
}

interface MatchGroup {
  id: string
  name: string
  description: string
  activity: string
  members: GroupMember[]
  matchPercentage: number
  nextMeeting: string
  emoji: string
}

export function MatchCarousel() {
  const { t, language } = useLanguage()
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const [joinedGroups, setJoinedGroups] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  // Force re-render when language changes
  useEffect(() => {
    // Component will re-render automatically when language changes
  }, [language]);

  // Sample group data - in real app this would come from API
  const groups: MatchGroup[] = [
    {
      id: "coffee-lovers",
      name: "Coffee Culture Club",
      description: "Perfect blend of caffeine enthusiasts who love deep conversations over great coffee",
      activity: "coffee",
      emoji: "☕",
      matchPercentage: 92,
      nextMeeting: "Tuesday 3:00 PM - Lobby Café",
      members: [
        {
          id: "sarah-1",
          name: "Sarah Chen",
          role: "UX Designer",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=150&h=150&fit=crop&crop=face",
          interests: ["design", "coffee", "books"],
          activities: ["coffee", "brainstorming"],
          bio: "Love creating user experiences and discussing design over coffee",
          officeDays: ["monday", "tuesday", "wednesday"]
        },
        {
          id: "mike-1",
          name: "Mike Johnson",
          role: "Frontend Developer", 
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          interests: ["tech", "coffee", "gaming"],
          activities: ["coffee", "brainstorming"],
          bio: "Code by day, game by night, coffee all the time",
          officeDays: ["tuesday", "wednesday", "thursday"]
        },
        {
          id: "emma-1",
          name: "Emma Wilson",
          role: "Product Manager",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          interests: ["coffee", "books", "travel"],
          activities: ["coffee", "lunch"],
          bio: "Passionate about products and people, fueled by good coffee",
          officeDays: ["monday", "wednesday", "friday"]
        },
        {
          id: "alex-1",
          name: "Alex Rodriguez",
          role: "Data Analyst",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          interests: ["tech", "coffee", "fitness"],
          activities: ["coffee", "workout"],
          bio: "Data enthusiast who loves coffee breaks and gym sessions",
          officeDays: ["tuesday", "thursday", "friday"]
        }
      ]
    },
    {
      id: "fitness-squad",
      name: "Fitness Friday Squad",
      description: "High-energy team focused on staying fit and motivating each other",
      activity: "fitness",
      emoji: "💪",
      matchPercentage: 88,
      nextMeeting: "Friday 6:00 PM - Office Gym",
      members: [
        {
          id: "lisa-1",
          name: "Lisa Park",
          role: "Marketing Specialist",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
          interests: ["fitness", "travel", "photography"],
          activities: ["workout", "walking"],
          bio: "Marketing by day, fitness enthusiast always",
          officeDays: ["monday", "wednesday", "friday"]
        },
        {
          id: "david-1",
          name: "David Kim",
          role: "Backend Developer",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
          interests: ["fitness", "tech", "music"],
          activities: ["workout", "brainstorming"],
          bio: "Building strong code and strong muscles",
          officeDays: ["tuesday", "thursday", "friday"]
        },
        {
          id: "maria-1",
          name: "Maria Garcia",
          role: "HR Specialist",
          avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
          interests: ["fitness", "books", "food"],
          activities: ["workout", "lunch"],
          bio: "People person who believes in healthy mind and body",
          officeDays: ["monday", "tuesday", "wednesday"]
        }
      ]
    },
    {
      id: "lunch-bunch",
      name: "Lunch & Learn Bunch",
      description: "Foodies who combine great meals with interesting conversations",
      activity: "lunch",
      emoji: "🍽️",
      matchPercentage: 85,
      nextMeeting: "Wednesday 12:30 PM - Italian Corner",
      members: [
        {
          id: "tom-1",
          name: "Tom Anderson",
          role: "Sales Manager",
          avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
          interests: ["food", "travel", "books"],
          activities: ["lunch", "brainstorming"],
          bio: "Closing deals and discovering new cuisines",
          officeDays: ["monday", "tuesday", "thursday"]
        },
        {
          id: "jenny-1",
          name: "Jenny Liu",
          role: "Graphic Designer",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
          interests: ["design", "food", "art"],
          activities: ["lunch", "coffee"],
          bio: "Creating beautiful designs and appreciating good food",
          officeDays: ["tuesday", "wednesday", "friday"]
        },
        {
          id: "carlos-1",
          name: "Carlos Rodriguez",
          role: "DevOps Engineer",
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
          interests: ["tech", "food", "gaming"],
          activities: ["lunch", "gaming"],
          bio: "Deploying code and exploring restaurants",
          officeDays: ["monday", "wednesday", "thursday"]
        },
        {
          id: "ana-1",
          name: "Ana Sofia",
          role: "Content Writer",
          avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
          interests: ["books", "food", "travel"],
          activities: ["lunch", "reading"],
          bio: "Crafting stories and savoring flavors",
          officeDays: ["tuesday", "thursday", "friday"]
        }
      ]
    },
    {
      id: "game-night",
      name: "Game Night Gang",
      description: "Gaming enthusiasts who love both digital and board games",
      activity: "gaming",
      emoji: "🎮",
      matchPercentage: 90,
      nextMeeting: "Thursday 7:00 PM - Gaming Lounge",
      members: [
        {
          id: "kevin-1",
          name: "Kevin Zhang",
          role: "Software Engineer",
          avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
          interests: ["gaming", "tech", "movies"],
          activities: ["gaming", "brainstorming"],
          bio: "Coding and gaming are my two passions",
          officeDays: ["monday", "tuesday", "friday"]
        },
        {
          id: "rachel-1",
          name: "Rachel Green",
          role: "QA Engineer",
          avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=150&h=150&fit=crop&crop=face",
          interests: ["gaming", "books", "coffee"],
          activities: ["gaming", "coffee"],
          bio: "Finding bugs by day, conquering games by night",
          officeDays: ["tuesday", "wednesday", "thursday"]
        },
        {
          id: "james-1",
          name: "James Wilson",
          role: "UI Designer",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
          interests: ["design", "gaming", "music"],
          activities: ["gaming", "brainstorming"],
          bio: "Designing beautiful interfaces and epic game strategies",
          officeDays: ["monday", "wednesday", "friday"]
        }
      ]
    }
  ]

  const currentGroup = groups[currentGroupIndex]

  const handleJoinGroup = () => {
    if (!currentGroup) return
    
    setIsAnimating(true)
    setJoinedGroups(prev => [...prev, currentGroup.id])
    
    // Simulate Slack integration
    setTimeout(() => {
      // In real app, this would create Slack channel and add user
      console.log(`🎉 Joined "${currentGroup.name}" group! Slack channel created.`)
      handleNext()
    }, 1000)
  }

  const handleNext = () => {
    if (currentGroupIndex < groups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1)
    } else {
      setCurrentGroupIndex(0)
    }
    setIsAnimating(false)
  }

  const handleSkip = () => {
    handleNext()
  }

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case "coffee": return <Coffee className="w-5 h-5" />
      case "fitness": return <Users className="w-5 h-5" />
      case "lunch": return <Coffee className="w-5 h-5" />
      case "gaming": return <Users className="w-5 h-5" />
      default: return <Heart className="w-5 h-5" />
    }
  }

  const getCommonInterests = (members: GroupMember[]) => {
    const allInterests = members.flatMap(m => m.interests)
    const interestCounts = allInterests.reduce((acc: Record<string, number>, interest) => {
      acc[interest] = (acc[interest] || 0) + 1
      return acc
    }, {})
    
    return Object.entries(interestCounts)
      .filter(([_, count]) => count >= 2)
      .map(([interest, _]) => interest)
      .slice(0, 3)
  }

  if (!currentGroup) return null

  return (
    <div className="h-screen jungle-gradient-bg p-2 overflow-hidden">
      <div className="max-w-4xl mx-auto h-full flex flex-col space-y-2">
        {/* Header - Très compact */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex-shrink-0"
        >
          <h1 className="text-2xl font-heading text-jungle-yellow mb-1">🌟 {t.matches.title}</h1>
          <p className="text-jungle-gray/70 font-body text-sm">{t.matches.findPerfectGroup}</p>
          <div className="flex justify-center gap-1 mt-2">
            {groups.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentGroupIndex ? "bg-jungle-yellow w-3" : "bg-jungle-gray/30"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Group Card - Ultra compact */}
        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGroup.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative h-full"
            >
              <Card className="glass-effect card-shadow overflow-hidden h-full flex flex-col">
                {/* Match Percentage Banner */}
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-jungle-yellow text-jungle-gray font-body font-bold text-xs px-2 py-0.5">
                    {currentGroup.matchPercentage}% Match
                  </Badge>
                </div>

                <CardHeader className="text-center pb-2 bg-gradient-to-br from-jungle-yellow/5 to-transparent flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="text-3xl mb-1"
                  >
                    {currentGroup.emoji}
                  </motion.div>
                  <CardTitle className="text-xl font-heading text-jungle-gray mb-1">
                    {currentGroup.name}
                  </CardTitle>
                  <p className="text-jungle-gray/70 font-body text-xs line-clamp-2">
                    {currentGroup.description}
                  </p>
                  
                  {/* Next Meeting Info - Ultra compact */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-2 p-1.5 bg-jungle-yellow/10 rounded border border-jungle-yellow/20"
                  >
                    <div className="flex items-center justify-center gap-1 text-jungle-gray">
                      <Calendar className="w-3 h-3" />
                      <span className="font-body text-xs">{t.matches.nextMeeting}: {currentGroup.nextMeeting}</span>
                    </div>
                  </motion.div>
                </CardHeader>

                <CardContent className="flex-1 space-y-2 p-3 min-h-0 overflow-y-auto">
                  {/* Common Interests - Ultra compact */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-xs font-heading text-jungle-gray mb-1">🎯 {t.matches.commonInterests}</h3>
                    <div className="flex flex-wrap gap-1">
                      {getCommonInterests(currentGroup.members).map((interest, index) => (
                        <motion.div
                          key={interest}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        >
                          <Badge className="bg-jungle-yellow/10 text-jungle-yellow border border-jungle-yellow/20 font-body capitalize text-xs px-1 py-0">
                            {interest}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Group Members - Grid compact 2x2 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex-1 min-h-0"
                  >
                    <h3 className="text-xs font-heading text-jungle-gray mb-2">👥 {t.matches.members} ({currentGroup.members.length})</h3>
                    <div className="grid grid-cols-2 gap-1.5 h-full">
                      {currentGroup.members.map((member, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className="p-1.5 rounded bg-gray-50/50 border border-gray-200/50 hover:border-jungle-yellow/30 transition-all"
                        >
                          <div className="flex items-start gap-1.5">
                            <Avatar className="w-6 h-6 ring-1 ring-jungle-yellow/30 flex-shrink-0">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="bg-jungle-yellow text-jungle-gray font-body font-semibold text-xs">
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-body font-semibold text-jungle-gray text-xs leading-tight">{member.name}</h4>
                              <p className="text-xs text-jungle-gray/60 font-body leading-tight">{member.role}</p>
                              <p className="text-xs text-jungle-gray/70 font-body leading-tight line-clamp-1">{member.bio}</p>
                              <div className="flex flex-wrap gap-0.5 mt-0.5">
                                {member.interests.slice(0, 2).map(interest => (
                                  <Badge key={interest} variant="outline" className="text-xs border-jungle-yellow/30 text-jungle-yellow px-0.5 py-0 h-4 text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </CardContent>

                {/* Action Buttons - En bas, toujours visibles */}
                <div className="border-t border-gray-200/50 p-3 flex-shrink-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center gap-2"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleSkip}
                        variant="outline"
                        size="sm"
                        className="border-gray-300 text-jungle-gray hover:bg-gray-50 font-body text-xs px-3"
                        disabled={isAnimating}
                      >
                        <X className="w-3 h-3 mr-1" />
                        {t.matches.skipGroup}
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleJoinGroup}
                        size="sm"
                        className="bg-jungle-yellow text-jungle-gray hover:bg-jungle-yellow/90 button-shadow font-body text-xs px-4"
                        disabled={isAnimating || joinedGroups.includes(currentGroup.id)}
                      >
                        {isAnimating ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                          </motion.div>
                        ) : joinedGroups.includes(currentGroup.id) ? (
                          <>
                            <MessageCircle className="w-3 h-3 mr-1" />
                            {t.matches.joined}
                          </>
                        ) : (
                          <>
                            <Heart className="w-3 h-3 mr-1" />
                            {t.matches.joinGroup}
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Join Success Message */}
                  {joinedGroups.includes(currentGroup.id) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mt-2 p-2 bg-gray-50 border border-gray-200 rounded"
                    >
                      <p className="text-black font-body text-xs">
                        🎉 {t.matches.welcomeMessage.replace('{groupName}', currentGroup.name)}
                      </p>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Joined Groups Summary - Compact en bas */}
        {joinedGroups.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex-shrink-0"
          >
            <Card className="glass-effect border-gray-200">
              <CardContent className="p-2">
                <h3 className="text-sm font-heading text-jungle-gray mb-1">
                  🎊 {t.matches.yourGroups} ({joinedGroups.length})
                </h3>
                <div className="flex flex-wrap justify-center gap-1 mb-2">
                  {joinedGroups.map(groupId => {
                    const group = groups.find(g => g.id === groupId)
                    return group ? (
                      <Badge key={groupId} className="bg-gray-100 text-black border border-gray-300 font-body text-xs px-1 py-0">
                        {group.emoji} {group.name}
                      </Badge>
                    ) : null
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray font-body text-xs px-3 h-6"
                  onClick={() => window.open('/slack-redirect', '_blank')}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {t.matches.openSlack}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
