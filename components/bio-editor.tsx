"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Wand2, 
  Save, 
  RotateCcw, 
  Shuffle, 
  PenTool,
  Lightbulb,
  Target,
  Heart,
  Zap,
  Coffee,
  X
} from "lucide-react"

interface BioEditorProps {
  initialBio: string
  jobTitle?: string
  interests?: string[]
  onSave: (newBio: string) => void
  onCancel: () => void
}

export function BioEditor({ 
  initialBio, 
  jobTitle = "", 
  interests = [], 
  onSave, 
  onCancel 
}: BioEditorProps) {
  const [bio, setBio] = useState(initialBio)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showPrompts, setShowPrompts] = useState(false)

  const bioTemplates = [
    {
      id: "passionate",
      title: "🔥 Passionate Professional",
      emoji: "🔥",
      template: `${jobTitle} driven by passion and innovation. I believe in creating meaningful impact through my work and building genuine connections with colleagues. Always exploring new ways to grow and contribute to team success.`
    },
    {
      id: "collaborative",
      title: "🤝 Team Collaborator",
      emoji: "🤝",
      template: `Collaborative ${jobTitle} who thrives in team environments. I love bringing diverse perspectives together to solve complex challenges. My goal is to foster an inclusive space where everyone's ideas can flourish.`
    },
    {
      id: "creative",
      title: "🎨 Creative Problem Solver",
      emoji: "🎨",
      template: `Creative ${jobTitle} with a knack for turning abstract ideas into tangible solutions. I approach every project with curiosity and enthusiasm, always looking for innovative ways to exceed expectations.`
    },
    {
      id: "mentor",
      title: "🌟 Mentor & Learner",
      emoji: "🌟",
      template: `${jobTitle} passionate about continuous learning and knowledge sharing. I believe in lifting others up and creating opportunities for growth. Whether mentoring or being mentored, I'm always ready to learn something new.`
    },
    {
      id: "results",
      title: "🎯 Results-Driven",
      emoji: "🎯",
      template: `Results-oriented ${jobTitle} with a strategic mindset. I focus on delivering high-quality work that drives real business impact. My approach combines analytical thinking with creative execution.`
    },
    {
      id: "fun",
      title: "😄 Fun & Professional",
      emoji: "😄",
      template: `${jobTitle} who believes work should be both productive and enjoyable. I bring positive energy to every project and love celebrating team wins. You'll often find me organizing coffee chats or team activities!`
    }
  ]

  const creativePrompts = [
    {
      category: "Personality",
      icon: Heart,
      prompts: [
        "I'm the colleague who always brings...",
        "My coworkers know me as the person who...",
        "I light up when I get to...",
        "You can count on me to..."
      ]
    },
    {
      category: "Work Style",
      icon: Target,
      prompts: [
        "My superpower at work is...",
        "I do my best work when...",
        "I approach challenges by...",
        "My secret to staying productive is..."
      ]
    },
    {
      category: "Passion",
      icon: Zap,
      prompts: [
        "What excites me most about my role is...",
        "I'm genuinely passionate about...",
        "I get energized by...",
        "The impact I want to make is..."
      ]
    },
    {
      category: "Collaboration",
      icon: Coffee,
      prompts: [
        "I love collaborating because...",
        "The best teams I've been on...",
        "I contribute to team success by...",
        "I believe great ideas come from..."
      ]
    }
  ]

  const bioSuggestions = [
    "Add what motivates you daily",
    "Mention your collaboration style",
    "Share a unique skill or hobby",
    "Describe your ideal work environment",
    "Include what you're learning recently",
    "Mention how you like to celebrate wins"
  ]

  const getRandomSuggestion = () => {
    return bioSuggestions[Math.floor(Math.random() * bioSuggestions.length)]
  }

  const analyzeBio = () => {
    const analysis = {
      length: bio.length,
      hasPersonality: /passionate|love|enjoy|excited|enthusiastic/i.test(bio),
      hasCollaboration: /collaborate|team|together|share|connect/i.test(bio),
      hasGoals: /goal|aim|strive|focus|driven/i.test(bio),
      hasUnique: /unique|different|special|creative|innovative/i.test(bio)
    }
    
    return analysis
  }

  const analysis = analyzeBio()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <PenTool className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Your Bio ✨
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Bio Editor */}
        <div className="space-y-6">
          <div className="relative">
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[200px] pr-16 text-base resize-none focus:ring-2 focus:ring-purple-500 border-2"
              placeholder="Tell your story... What makes you unique? What drives you? How do you like to work?"
            />
            
            {/* Character count */}
            <div className="absolute bottom-3 right-3 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs border">
              <span className={`${
                bio.length > 300 ? 'text-red-500' : 
                bio.length > 200 ? 'text-yellow-500' : 'text-gray-400'
              }`}>
                {bio.length}/300
              </span>
            </div>
          </div>

          {/* Bio Analysis */}
          {bio.length > 20 && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                Bio Health Check
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    analysis.length >= 80 ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Good length ({analysis.length} chars)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    analysis.hasPersonality ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Shows personality
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    analysis.hasCollaboration ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Mentions collaboration
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    analysis.hasGoals ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Shows direction/goals
                  </span>
                </div>
              </div>
              
              {!analysis.hasPersonality && (
                <div className="mt-3 text-xs text-blue-600 dark:text-blue-400">
                  💡 Try adding words like "passionate", "love", or "excited" to show your personality
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              Templates
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrompts(!showPrompts)}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Get Ideas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const randomSuggestion = getRandomSuggestion()
                setBio(prevBio => {
                  if (prevBio.trim()) {
                    return `${prevBio.trim()}. ${randomSuggestion}`
                  } else {
                    return randomSuggestion
                  }
                })
              }}
              className="flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Random Tip
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBio(initialBio)}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          {/* Templates */}
          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  📝 Bio Templates
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {bioTemplates.map((template) => (
                    <motion.button
                      key={template.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setBio(template.template)}
                      className="p-3 text-left border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{template.emoji}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {template.title}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {template.template}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Creative Prompts */}
          <AnimatePresence>
            {showPrompts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  💭 Creative Prompts
                </h3>
                {creativePrompts.map((category) => {
                  const Icon = category.icon
                  return (
                    <div key={category.category} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {category.category}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {category.prompts.map((prompt, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => {
                              setBio(prevBio => {
                                if (prevBio.trim()) {
                                  return `${prevBio.trim()} ${prompt}`
                                } else {
                                  return prompt
                                }
                              })
                            }}
                            className="text-left p-2 rounded text-xs border border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
                          >
                            <span className="text-purple-600 dark:text-purple-400">+ {prompt}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <div className="flex items-center space-x-2">
            {interests.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">Your interests:</span>
                {interests.slice(0, 3).map((interest) => (
                  <Badge key={interest} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={() => onSave(bio)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              disabled={bio.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Bio
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
} 