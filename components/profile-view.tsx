"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Edit3, Save, X, Upload, Sparkles, Wand2 } from "lucide-react"
// import { SheetsService } from "@/lib/sheets"
import { OpenAIService } from "@/lib/openai"
import { AuthService } from "@/lib/auth"
import { useLanguage } from "@/contexts/LanguageContext"

interface ProfileData {
  email: string
  name: string
  role: string
  officeDays: string[]
  interests: string[]
  activities: string[]
  bio: string
  photo?: File | null
}

export function ProfileView() {
  const { t } = useLanguage()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<ProfileData>({
    email: "",
    name: "",
    role: "",
    officeDays: [],
    interests: [],
    activities: [],
    bio: "",
    photo: null
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingBio, setIsGeneratingBio] = useState(false)
  // const [error, setError] = useState<string | null>(null); // Pour une future gestion d'erreur UI

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

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const user = AuthService.getCurrentUser()
      if (user) {
        // const profileData = await SheetsService.getProfile(user.email)
        // if (profileData) {
        //   setProfile(profileData)
        //   setEditForm(profileData)
        // }
        console.log("Profile loading commented out. User:", user.email);
        // To prevent UI from staying in loading state indefinitely if no profile is found/loaded:
        // We can set profile to null or a default state to show "No profile found" or similar.
        setProfile(null); 
      }
    } catch (error) {
      console.error("Failed to load profile (actual loading is commented out):", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    if (profile) {
      setEditForm({ ...profile })
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (profile) {
      setEditForm({ ...profile })
    }
  }

  const handleSave = async () => {
    setIsSaving(true);
    // setError(null); // Pour une future gestion d'erreur UI
    try {
      if (!editForm.email) {
        console.error("Email is missing in editForm. Cannot save profile.");
        throw new Error("Email is missing. Cannot save profile.");
      }
      
      // Exclure 'photo' des données à sauvegarder
      // La variable _photo est préfixée pour indiquer qu'elle n'est pas utilisée par la suite.
      const { photo: _photo, ...profileDataToSave } = editForm;

      const response = await fetch('/api/save-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileDataToSave),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        console.error("API Error during save:", errorResult.error || `Failed to save profile: ${response.statusText}`);
        throw new Error(errorResult.error || `Failed to save profile: ${response.statusText}`);
      }

      // const result = await response.json(); // Décommenter si le résultat de l'API est utile
      // console.log('Profile updated successfully via API:', result);

      setProfile(editForm); // Mettre à jour l'état local du profil avec les données sauvegardées
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile (catch block):", err);
      // setError(err instanceof Error ? err.message : "An unknown error occurred during save.");
      // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
    } finally {
      setIsSaving(false);
    }
  };

  const generateBio = async () => {
    setIsGeneratingBio(true)
    try {
      const bio = await OpenAIService.generateBio(editForm.interests, editForm.activities, editForm.role)
      setEditForm(prev => ({ ...prev, bio }))
    } catch (error) {
      console.error("Failed to generate bio:", error)
    } finally {
      setIsGeneratingBio(false)
    }
  }

  const toggleSelection = (field: "officeDays" | "interests" | "activities", value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value) 
        : [...prev[field], value]
    }))
  }

  const getInterestEmoji = (id: string) => interests.find(i => i.id === id)?.emoji || "🌟"
  const getActivityEmoji = (id: string) => activities.find(a => a.id === id)?.emoji || "🎯"

  if (isLoading) {
    return (
      <div className="min-h-screen jungle-gradient-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-8 h-8 border-2 border-jungle-yellow border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-jungle-gray font-body">Loading profile...</p>
        </motion.div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen jungle-gradient-bg flex items-center justify-center">
        <Card className="max-w-md w-full glass-effect card-shadow">
          <CardContent className="text-center p-8">
            <p className="text-jungle-gray font-body">No profile found. Please create your profile first.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen jungle-gradient-bg p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-heading text-jungle-yellow mb-2">{t.profile.title}</h1>
            <p className="text-jungle-gray/70 font-body">{t.profile.subtitle}</p>
          </div>
          {!isEditing && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleEdit}
                className="bg-jungle-yellow text-jungle-gray hover:bg-jungle-yellow/90 button-shadow font-body"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {t.profile.update}
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-effect card-shadow">
            <CardHeader>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 ring-4 ring-jungle-yellow/50 card-shadow">
                    <AvatarImage src={profile.photo ? URL.createObjectURL(profile.photo) : undefined} />
                    <AvatarFallback className="bg-jungle-yellow text-jungle-gray text-2xl font-body font-semibold">
                      {profile.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <motion.button
                      className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.accept = "image/*"
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) {
                            setEditForm(prev => ({ ...prev, photo: file }))
                          }
                        }
                        input.click()
                      }}
                    >
                      <Upload className="w-6 h-6 text-white" />
                    </motion.button>
                  )}
                </div>
                
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-jungle-gray font-body font-medium">{t.profile.name}</Label>
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-gray-50/80 border-gray-200 text-jungle-gray font-body"
                        />
                      </div>
                      <div>
                        <Label className="text-jungle-gray font-body font-medium">Role</Label>
                        <Input
                          value={editForm.role}
                          onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                          className="bg-gray-50/80 border-gray-200 text-jungle-gray font-body"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-heading text-jungle-gray mb-1">{profile.name}</h2>
                      <p className="text-jungle-gray/70 font-body text-lg">{profile.role}</p>
                      <p className="text-jungle-gray/60 font-body">{profile.email}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Bio Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-heading text-jungle-gray">Bio</h3>
                  {isEditing && (
                    <Button
                      onClick={generateBio}
                      disabled={isGeneratingBio}
                      variant="outline"
                      size="sm"
                      className="border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray font-body"
                    >
                      {isGeneratingBio ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Wand2 className="w-4 h-4 mr-1" />
                        </motion.div>
                      ) : (
                        <Sparkles className="w-4 h-4 mr-1" />
                      )}
                      Generate
                    </Button>
                  )}
                </div>
                {isEditing ? (
                  <Textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    className="bg-gray-50/80 border-gray-200 text-jungle-gray font-body min-h-[100px]"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-jungle-gray font-body bg-gray-50/50 p-4 rounded-lg">
                    {profile.bio || "No bio available"}
                  </p>
                )}
              </div>

              {/* Office Days */}
              <div>
                <h3 className="text-lg font-heading text-jungle-gray mb-4">Office Days</h3>
                {isEditing ? (
                  <div className="grid grid-cols-5 gap-2">
                    {days.map(day => (
                      <motion.div
                        key={day.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={editForm.officeDays.includes(day.id) ? "default" : "outline"}
                          className={`w-full h-16 flex flex-col items-center justify-center transition-all ${
                            editForm.officeDays.includes(day.id)
                              ? "bg-jungle-yellow text-jungle-gray button-shadow"
                              : "border-gray-200 hover:bg-gray-50 hover:border-jungle-yellow/50 text-jungle-gray subtle-shadow"
                          }`}
                          onClick={() => toggleSelection("officeDays", day.id)}
                        >
                          <span className="text-lg mb-1">{day.emoji}</span>
                          <span className="text-xs font-medium">{day.short}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.officeDays.map(dayId => {
                      const day = days.find(d => d.id === dayId)
                      return (
                        <Badge key={dayId} className="bg-jungle-yellow/10 text-jungle-yellow border border-jungle-yellow/20 font-body">
                          {day?.emoji} {day?.label}
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Interests */}
              <div>
                <h3 className="text-lg font-heading text-jungle-gray mb-4">Interests</h3>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {interests.map(interest => (
                      <motion.div
                        key={interest.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={editForm.interests.includes(interest.id) ? "default" : "outline"}
                          className={`w-full h-14 flex flex-col items-center justify-center transition-all ${
                            editForm.interests.includes(interest.id)
                              ? "bg-jungle-yellow text-jungle-gray button-shadow"
                              : "border-gray-200 hover:bg-gray-50 hover:border-jungle-yellow/50 text-jungle-gray subtle-shadow"
                          }`}
                          onClick={() => toggleSelection("interests", interest.id)}
                        >
                          <span className="text-lg mb-1">{interest.emoji}</span>
                          <span className="text-xs">{interest.label}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map(interestId => (
                      <Badge key={interestId} className="bg-jungle-yellow/10 text-jungle-yellow border border-jungle-yellow/20 font-body">
                        {getInterestEmoji(interestId)} {interests.find(i => i.id === interestId)?.label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Activities */}
              <div>
                <h3 className="text-lg font-heading text-jungle-gray mb-4">Preferred Activities</h3>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {activities.map(activity => (
                      <motion.div
                        key={activity.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={editForm.activities.includes(activity.id) ? "default" : "outline"}
                          className={`w-full h-16 flex flex-col items-center justify-center transition-all ${
                            editForm.activities.includes(activity.id)
                              ? "bg-jungle-yellow text-jungle-gray button-shadow"
                              : "border-gray-200 hover:bg-gray-50 hover:border-jungle-yellow/50 text-jungle-gray subtle-shadow"
                          }`}
                          onClick={() => toggleSelection("activities", activity.id)}
                        >
                          <span className="text-lg mb-1">{activity.emoji}</span>
                          <span className="text-xs">{activity.label}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.activities.map(activityId => (
                      <Badge key={activityId} className="bg-jungle-yellow/10 text-jungle-yellow border border-jungle-yellow/20 font-body">
                        {getActivityEmoji(activityId)} {activities.find(a => a.id === activityId)?.label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Actions */}
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 pt-6 border-t border-gray-200"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-gray-200 hover:bg-gray-50 text-jungle-gray font-body"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-jungle-yellow text-jungle-gray hover:bg-jungle-yellow/90 button-shadow font-body"
                    >
                      {isSaving ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                        </motion.div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 