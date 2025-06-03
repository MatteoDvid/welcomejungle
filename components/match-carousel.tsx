"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, X, Users, MessageCircle, Sparkles, Clock, MapPin, Star } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import confetti from "canvas-confetti"

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

interface MatchCarouselProps {
  userEmail: string;
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
  color: string
  vibe: string
}

export function MatchCarousel({ userEmail: initialUserEmail }: MatchCarouselProps) {
  // !!!!! DÉBUT DU HACK POUR LA DÉMO !!!!!
  // Forcer userEmail à "emma@jungle.com" si initialUserEmail est undefined.
  // À RETIRER APRÈS LA DÉMO ET CORRIGER LE FLUX DE PROPS NORMAL.
  const userEmail = initialUserEmail || "emma@jungle.com";
  if (!initialUserEmail) {
    console.warn(`[MatchCarousel HACK] initialUserEmail was undefined. Using demo placeholder: ${userEmail}`);
  }
  // !!!!! FIN DU HACK POUR LA DÉMO !!!!!

  const { /* t, */ language } = useLanguage()
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)
  const [joinedGroups, setJoinedGroups] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Force re-render when language changes
  useEffect(() => {
    // Component will re-render automatically when language changes
  }, [language]);

  // Sample group data with colors and vibes
  const groups: MatchGroup[] = [
    {
      id: "coffee-lovers",
      name: "Coffee Culture",
      description: "Caffeine lovers unite ☕",
      activity: "coffee",
      emoji: "☕",
      color: "from-amber-400 to-orange-500",
      vibe: "Cozy & Creative",
      matchPercentage: 92,
      nextMeeting: "Tuesday 15:00 - Lobby Café",
      members: [
        {
          id: "sarah-1",
          name: "Sarah Chen",
          role: "UX Designer",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=150&h=150&fit=crop&crop=face",
          interests: ["design", "coffee", "books"],
          activities: ["coffee", "brainstorming"],
          bio: "Design & Coffee enthusiast",
          officeDays: ["monday", "tuesday", "wednesday"]
        },
        {
          id: "mike-1",
          name: "Mike Johnson",
          role: "Frontend Dev", 
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          interests: ["tech", "coffee", "gaming"],
          activities: ["coffee", "brainstorming"],
          bio: "Code & Coffee addict",
          officeDays: ["tuesday", "wednesday", "thursday"]
        },
        {
          id: "emma-1",
          name: "Emma Wilson",
          role: "Product Manager",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          interests: ["coffee", "books", "travel"],
          activities: ["coffee", "lunch"],
          bio: "Product & Coffee lover",
          officeDays: ["monday", "wednesday", "friday"]
        }
      ]
    },
    {
      id: "fitness-squad",
      name: "Fitness Squad",
      description: "Get pumped together 💪",
      activity: "fitness",
      emoji: "💪",
      color: "from-emerald-400 to-teal-500",
      vibe: "High Energy",
      matchPercentage: 88,
      nextMeeting: "Friday 18:00 - Office Gym",
      members: [
        {
          id: "lisa-1",
          name: "Lisa Park",
          role: "Marketing",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
          interests: ["fitness", "travel", "photography"],
          activities: ["workout", "walking"],
          bio: "Fitness enthusiast",
          officeDays: ["monday", "wednesday", "friday"]
        },
        {
          id: "david-1",
          name: "David Kim",
          role: "Backend Dev",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
          interests: ["fitness", "tech", "music"],
          activities: ["workout", "brainstorming"],
          bio: "Strong code, strong body",
          officeDays: ["tuesday", "thursday", "friday"]
        }
      ]
    },
    {
      id: "lunch-bunch",
      name: "Lunch Gang",
      description: "Food adventures await 🍽️",
      activity: "lunch",
      emoji: "🍽️",
      color: "from-rose-400 to-orange-400",
      vibe: "Foodie Fun",
      matchPercentage: 85,
      nextMeeting: "Wednesday 12:30 - Italian Corner",
      members: [
        {
          id: "tom-1",
          name: "Tom Anderson",
          role: "Sales Manager",
          avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
          interests: ["food", "travel", "books"],
          activities: ["lunch", "brainstorming"],
          bio: "Deal closer & foodie",
          officeDays: ["monday", "tuesday", "thursday"]
        },
        {
          id: "jenny-1",
          name: "Jenny Liu",
          role: "Designer",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
          interests: ["design", "food", "art"],
          activities: ["lunch", "coffee"],
          bio: "Design meets cuisine",
          officeDays: ["tuesday", "wednesday", "friday"]
        }
      ]
    },
    {
      id: "game-night",
      name: "Gaming Squad",
      description: "Level up together 🎮",
      activity: "gaming",
      emoji: "🎮",
      color: "from-slate-500 to-gray-600",
      vibe: "Epic Gaming",
      matchPercentage: 90,
      nextMeeting: "Thursday 19:00 - Gaming Lounge",
      members: [
        {
          id: "kevin-1",
          name: "Kevin Wong",
          role: "Full Stack Dev",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          interests: ["gaming", "tech", "anime"],
          activities: ["gaming", "brainstorming"],
          bio: "Code by day, game by night",
          officeDays: ["monday", "wednesday", "friday"]
        }
      ]
    }
  ]

  const currentGroup = groups[currentGroupIndex]

  const handleJoinGroup = async () => {
    if (joinedGroups.includes(currentGroup.id)) return

    setIsAnimating(true)
    
    // Confetti with group colors
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFE666', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
    })

    // ---- START: Appel API pour mettre à jour Google Sheets ----
    try {
      const groupName = currentGroup.name;
      console.log(`[MatchCarousel] User '${userEmail}' joining group '${groupName}'. Attempting API call.`);

      const response = await fetch('/api/update-user-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, groupName }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('[MatchCarousel] Successfully updated match info in Google Sheets:', result.data);
        // Procéder avec l'UI après succès de l'API
        setTimeout(() => {
          setJoinedGroups([...joinedGroups, currentGroup.id])
          setShowSuccess(true)
          setIsAnimating(false)
          
          setTimeout(() => {
            setShowSuccess(false)
            handleNext()
          }, 2500) // Temps d'affichage du succès
        }, 300) // Petit délai pour que l'animation de confetti soit visible
      } else {
        console.error('[MatchCarousel] Failed to update match info in Google Sheets:', result.error, result.details);
        setIsAnimating(false); 
        // Remplacer les guillemets doubles par des simples pour l'alerte
        const errorMessageForAlert = (typeof result.error === 'string' ? result.error.replace(/"/g, "'") : 'Erreur inconnue');
        alert(`Erreur lors de la mise à jour de votre groupe : ${errorMessageForAlert}`);
         // Fallback pour continuer le flux UI si l'API échoue, ou commenter les lignes ci-dessous pour bloquer
        setTimeout(() => {
          setJoinedGroups([...joinedGroups, currentGroup.id]) // On peut choisir de le faire quand même
          setShowSuccess(true) // ou pas, selon la politique de gestion d'erreur
          setIsAnimating(false)
          setTimeout(() => {
            setShowSuccess(false)
            handleNext()
          }, 2500)
        }, 300)
      }
    } catch (error) {
      console.error('[MatchCarousel] Error calling /api/update-user-match:', error);
      setIsAnimating(false); // Arrêter l'animation de chargement en cas d'erreur réseau
      alert(`Une erreur réseau est survenue en tentant de rejoindre le groupe.`);
       // Fallback pour continuer le flux UI si l'API échoue
      setTimeout(() => {
        setJoinedGroups([...joinedGroups, currentGroup.id])
        setShowSuccess(true)
        setIsAnimating(false)
        setTimeout(() => {
          setShowSuccess(false)
          handleNext()
        }, 2500)
      }, 300)
    }
    // ---- END: Appel API ----

    // La logique UI originale est maintenant dans le bloc `if (response.ok)` ou dans les catch/else
    // setTimeout(() => {
    //   setJoinedGroups([...joinedGroups, currentGroup.id])
    //   setShowSuccess(true)
    //   setIsAnimating(false)
    //   
    //   setTimeout(() => {
    //     setShowSuccess(false)
    //     handleNext()
    //   }, 2500)
    // }, 500)
  }

  const handleNext = () => {
    if (currentGroupIndex < groups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1)
    } else {
      setCurrentGroupIndex(0)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const getInterestEmoji = (interest: string) => {
    const emojiMap: { [key: string]: string } = {
      tech: "💻", design: "🎨", coffee: "☕", fitness: "💪", music: "🎵",
      gaming: "🎮", books: "📚", food: "🍕", travel: "✈️", photography: "📸",
      art: "🎭", anime: "🌸"
    }
    return emojiMap[interest] || "✨"
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen p-3 bg-gradient-to-br from-yellow-50 via-white to-orange-50 match-carousel-bg">
        <div className="max-w-sm mx-auto h-[85vh] flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="text-center"
          >
            {/* Message principal */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-6 mb-4"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)'
              }}
            >
              <h2 className="text-3xl font-bold mb-2" style={{color: '#1e293b'}}>
                🎉 Squad Joined!
              </h2>
              <p className="text-lg mb-2" style={{color: '#64748b'}}>
                Welcome to
              </p>
              <p className="text-xl font-bold" style={{color: '#3b82f6'}}>
                {currentGroup.name}
              </p>
            </motion.div>
            
            {/* Cœurs qui brillent */}
            <motion.div 
              className="flex justify-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.3
                  }}
                  className="text-2xl"
                >
                  💖
                </motion.div>
              ))}
            </motion.div>
            
            {/* Message d'encouragement */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm"
              style={{color: '#64748b'}}
            >
              Check your Slack for details! 💬
            </motion.p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-3 bg-gradient-to-br from-yellow-50 via-white to-orange-50 match-carousel-bg">
      <div className="max-w-sm mx-auto h-[85vh] flex flex-col">
        
        {/* Header moderne - très compact */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-2"
        >
          <h1 className="text-xl font-bold mb-1" style={{color: '#1e293b'}}>
            ✨ Find Your Squad
          </h1>
          <p className="text-xs" style={{color: '#64748b'}}>Connect with amazing colleagues</p>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-1 mt-2">
            {groups.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentGroupIndex 
                    ? "w-4" 
                    : "w-1"
                }`}
                style={{
                  backgroundColor: index === currentGroupIndex ? '#3b82f6' : '#cbd5e1'
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Main Card - avec div blanche explicite */}
        <div className="flex-1 mb-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGroup.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-full"
            >
              {/* Div blanche très explicite au lieu de Card */}
              <div 
                className="h-full rounded-2xl overflow-hidden relative z-10"
                style={{
                  backgroundColor: '#ffffff',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)'
                }}
              >
                <div className="h-full flex flex-col">
                  
                  {/* Header avec couleur de groupe */}
                  <div 
                    className={`bg-gradient-to-br ${currentGroup.color} p-4 text-center relative rounded-t-2xl`}
                    style={{background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      className="text-4xl mb-2"
                    >
                      {currentGroup.emoji}
                    </motion.div>
                    
                    <h2 className="text-lg font-bold mb-1" style={{color: '#ffffff'}}>
                      {currentGroup.name}
                    </h2>
                    
                    <p className="text-xs mb-2" style={{color: 'rgba(255, 255, 255, 0.9)'}}>
                      {currentGroup.description}
                    </p>
                    
                    {/* Match percentage avec étoiles */}
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${
                              i < Math.floor(currentGroup.matchPercentage / 20) 
                                ? 'text-yellow-300 fill-yellow-300' 
                                : 'text-white/30'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="font-bold text-xs" style={{color: '#ffffff'}}>
                        {currentGroup.matchPercentage}% match
                      </span>
                    </div>
                    
                    {/* Vibe tag */}
                    <div 
                      className="inline-block px-2 py-0.5 rounded-full"
                      style={{backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(4px)'}}
                    >
                      <span className="text-xs font-medium" style={{color: '#ffffff'}}>{currentGroup.vibe}</span>
                    </div>
                  </div>

                  {/* Meeting info */}
                  <div 
                    className="p-2" 
                    style={{backgroundColor: '#f8fafc', background: '#f8fafc'}}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" style={{color: '#475569'}} />
                        <span className="text-xs" style={{color: '#475569'}}>
                          {currentGroup.nextMeeting.split(' - ')[0]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" style={{color: '#475569'}} />
                        <span className="text-xs" style={{color: '#475569'}}>
                          {currentGroup.nextMeeting.split(' - ')[1]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Members section */}
                  <div 
                    className="flex-1 p-3 overflow-y-auto" 
                    style={{backgroundColor: '#ffffff', background: '#ffffff'}}
                  >
                    <div className="flex items-center gap-1 mb-2">
                      <Users className="w-3 h-3" style={{color: '#1e293b'}} />
                      <h3 className="text-xs font-bold" style={{color: '#1e293b'}}>
                        Your Squad ({currentGroup.members.length})
                      </h3>
                    </div>
                    
                    <div className="space-y-1.5">
                      {currentGroup.members.map((member, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-2 p-1.5 rounded-lg transition-colors hover:scale-105"
                          style={{
                            backgroundColor: '#f8fafc', 
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          <Avatar className="w-6 h-6 ring-2 ring-blue-100 shadow-sm">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback 
                              className="font-bold text-xs"
                              style={{backgroundColor: '#3b82f6', color: '#ffffff'}}
                            >
                              {member.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs truncate" style={{color: '#1e293b'}}>
                              {member.name}
                            </h4>
                            <p className="text-xs truncate" style={{color: '#64748b'}}>
                              {member.role}
                            </p>
                            
                            {/* Interests avec emojis */}
                            <div className="flex gap-0.5 mt-0.5">
                              {member.interests.slice(0, 3).map(interest => (
                                <span key={interest} className="text-xs">
                                  {getInterestEmoji(interest)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div 
                    className="p-3 border-t rounded-b-2xl" 
                    style={{
                      backgroundColor: '#f8fafc', 
                      background: '#f8fafc',
                      borderTop: '1px solid #e2e8f0'
                    }}
                  >
                    <div className="flex gap-3 items-stretch">
                      <motion.div 
                        className="flex-1"
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <button
                          className="w-full h-12 text-sm rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
                          style={{
                            border: '2px solid #e2e8f0',
                            color: '#64748b',
                            backgroundColor: '#ffffff',
                            background: '#ffffff'
                          }}
                          onClick={handleSkip}
                          disabled={isAnimating}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </motion.div>
                      
                      <motion.div 
                        className="flex-1"
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <button
                          className="w-full h-12 text-sm rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2"
                          style={{
                            backgroundColor: '#FFCD00',
                            background: 'linear-gradient(135deg, #FFCD00 0%, #f7c500 100%)',
                            color: '#585858',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(255, 205, 0, 0.4)'
                          }}
                          onClick={handleJoinGroup}
                          disabled={isAnimating || joinedGroups.includes(currentGroup.id)}
                        >
                          {isAnimating ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <Sparkles className="w-4 h-4" />
                            </motion.div>
                          ) : joinedGroups.includes(currentGroup.id) ? (
                            <>
                              <MessageCircle className="w-4 h-4" />
                              <span>Joined</span>
                            </>
                          ) : (
                            <>
                              <Heart className="w-4 h-4" />
                              <span>Join Squad</span>
                            </>
                          )}
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Groups rejoint - très compact */}
        {joinedGroups.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg p-2"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.8)'
            }}
          >
            <h3 className="font-bold text-center mb-1 text-xs" style={{color: '#1e293b'}}>
              🎊 Your Squads ({joinedGroups.length})
            </h3>
            <div className="flex justify-center gap-1 flex-wrap">
              {joinedGroups.map(groupId => {
                const group = groups.find(g => g.id === groupId)
                return group ? (
                  <div 
                    key={groupId} 
                    className="px-1.5 py-0.5 rounded-full"
                    style={{backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)'}}
                  >
                    <span className="text-xs" style={{color: '#3b82f6'}}>
                      {group.emoji}
                    </span>
                  </div>
                ) : null
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
