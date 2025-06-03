"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { User, Mail, Briefcase, Loader2, CheckCircle, Upload, X, Camera, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface FormData {
  prenom: string
  nom: string
  email: string
  role: string
  langue: string
  themes: string[]
  bio: string
  avatar?: File | string
}

interface FormErrors {
  prenom?: string
  nom?: string
  email?: string
  role?: string
  langue?: string
  themes?: string
  bio?: string
  avatar?: string
}

export function ProfileCreationForm() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<FormData>({
    prenom: user?.firstName || "",
    nom: user?.lastName || "",
    email: user?.email || "",
    role: user?.role || "",
    langue: "FR",
    themes: [],
    bio: "",
    avatar: undefined
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [bioGenerated, setBioGenerated] = useState(false)

  const langues = [
    { value: "FR", label: "Français" },
    { value: "EN", label: "English" }
  ]

  const themesOptions = [
    "Sport", "Cuisine", "Technologie", "Voyage", "Lecture", "Musique", 
    "Cinéma", "Art", "Photographie", "Gaming", "Nature", "Yoga",
    "Fitness", "Développement personnel", "Entrepreneuriat", "Marketing",
    "Design", "Innovation", "Environnement", "Mode"
  ]

  // Generate random avatar
  const generateRandomAvatar = () => {
    const avatars = [
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Snowball",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Garfield",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Mittens"
    ]
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)]
    setFormData(prev => ({ ...prev, avatar: randomAvatar }))
    setAvatarPreview(randomAvatar)
  }

  // Generate automatic bio based on themes
  const generateBio = () => {
    if (formData.themes.length === 0) {
      setErrors(prev => ({ ...prev, themes: "Sélectionnez au moins un thème pour générer une bio" }))
      return
    }

    const bioTemplates = [
      `Passionné(e) par ${formData.themes.slice(0, 2).join(' et ')}, je cherche toujours à découvrir de nouvelles expériences et à partager mes centres d'intérêt avec mes collègues.`,
      `Amateur(trice) de ${formData.themes.slice(0, 3).join(', ')}, j'aime créer des liens authentiques et enrichissants au travail.`,
      `Enthousiaste des sujets comme ${formData.themes.slice(0, 2).join(' et ')}, je suis toujours partant(e) pour des discussions inspirantes et des activités communes.`
    ]
    
    const randomBio = bioTemplates[Math.floor(Math.random() * bioTemplates.length)]
    setFormData(prev => ({ ...prev, bio: randomBio }))
    setBioGenerated(true)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: "Veuillez sélectionner une image valide" }))
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: "L'image ne doit pas dépasser 5MB" }))
        return
      }

      setFormData(prev => ({ ...prev, avatar: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      setErrors(prev => ({ ...prev, avatar: undefined }))
    }
  }

  const toggleTheme = (theme: string) => {
    setFormData(prev => ({
      ...prev,
      themes: prev.themes.includes(theme)
        ? prev.themes.filter(t => t !== theme)
        : [...prev.themes, theme]
    }))
    setErrors(prev => ({ ...prev, themes: undefined }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Prénom requis"
    }

    if (!formData.nom.trim()) {
      newErrors.nom = "Nom requis"
    }

    if (formData.themes.length === 0) {
      newErrors.themes = "Sélectionnez au moins un thème"
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio requise"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Clean data before sending
      const cleanData = {
        prenom: formData.prenom.trim(),
        nom: formData.nom.trim(),
        email: formData.email.trim(),
        role: formData.role
      }

      // Construct the GET request URL with query parameters as specified
      const webhookUrl = new URL("https://hook.eu2.make.com/wxrej34isrle6n3w6i1l52lndi8y3upl")
      webhookUrl.searchParams.append("prenom", cleanData.prenom)
      webhookUrl.searchParams.append("nom", cleanData.nom)
      webhookUrl.searchParams.append("email", cleanData.email)
      webhookUrl.searchParams.append("role", cleanData.role)

      console.log("📤 Envoi du profil vers Make.com...")

      // Send GET request to Make webhook
      const response = await fetch(webhookUrl.toString(), {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Erreur de connexion à Make.com")
      }

      console.log("✅ Profil créé avec succès!")

      // Show success state
      setIsSuccess(true)

      // Navigate to matching screen after delay
      setTimeout(() => {
        router.push("/matches")
      }, 2000)

    } catch (error) {
      console.error("❌ Erreur:", error)
      setErrors({ bio: "Impossible de créer le profil. Vérifiez votre connexion internet et réessayez." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-jungle-yellow flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="w-full max-w-md bg-white shadow-2xl border-0">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <CheckCircle className="w-16 h-16 text-black mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-heading text-jungle-gray mb-2">
                Profil créé avec succès !
              </h2>
              <p className="text-jungle-gray/70 font-body mb-4">
                Découvrez vos matches...
              </p>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="inline-block"
              >
                <Loader2 className="w-6 h-6 text-jungle-yellow" />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-jungle-yellow">
      {/* Background Decoration */}
      <div className="fixed inset-0 bg-jungle-yellow">
        <div className="absolute top-20 right-20 w-40 h-40 bg-jungle-gray/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-jungle-gray/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-white shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-jungle-yellow/10 to-transparent p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-center mb-4"
              >
                <div className="w-16 h-16 bg-jungle-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-jungle-gray" />
                </div>
              </motion.div>
              
              <CardTitle className="text-3xl font-heading text-jungle-gray text-center mb-2">
                Complétez votre profil
              </CardTitle>
              <p className="text-jungle-gray/70 font-body text-center">
                Quelques informations pour vous matcher avec vos collègues
              </p>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <Label className="text-jungle-gray font-body font-semibold">Avatar</Label>
                  <div className="mt-4 flex flex-col items-center space-y-4">
                    {avatarPreview ? (
                      <div className="relative">
                        <img 
                          src={avatarPreview} 
                          alt="Avatar preview" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-jungle-yellow shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarPreview("")
                            setFormData(prev => ({ ...prev, avatar: undefined }))
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Uploader
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generateRandomAvatar}
                        className="border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Aléatoire
                      </Button>
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="prenom" className="text-jungle-gray font-body font-semibold">
                      Prénom *
                    </Label>
                    <Input
                      id="prenom"
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => updateField("prenom", e.target.value)}
                      className={`mt-2 bg-gray-50 border-gray-200 focus:border-jungle-yellow focus:ring-jungle-yellow ${
                        errors.prenom ? "border-red-500" : ""
                      }`}
                      placeholder="Votre prénom"
                    />
                    {errors.prenom && (
                      <p className="text-red-500 text-sm mt-1 font-body">{errors.prenom}</p>
                    )}
                  </motion.div>

                  {/* Last Name */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="nom" className="text-jungle-gray font-body font-semibold">
                      Nom *
                    </Label>
                    <Input
                      id="nom"
                      type="text"
                      value={formData.nom}
                      onChange={(e) => updateField("nom", e.target.value)}
                      className={`mt-2 bg-gray-50 border-gray-200 focus:border-jungle-yellow focus:ring-jungle-yellow ${
                        errors.nom ? "border-red-500" : ""
                      }`}
                      placeholder="Votre nom"
                    />
                    {errors.nom && (
                      <p className="text-red-500 text-sm mt-1 font-body">{errors.nom}</p>
                    )}
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email (pre-filled) */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="email" className="text-jungle-gray font-body font-semibold">
                      Email
                    </Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jungle-gray/40" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="pl-12 bg-gray-100 border-gray-200 text-jungle-gray/60"
                      />
                    </div>
                  </motion.div>

                  {/* Role (pre-filled) */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="role" className="text-jungle-gray font-body font-semibold">
                      Rôle
                    </Label>
                    <div className="relative mt-2">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jungle-gray/40" />
                      <Input
                        id="role"
                        value={formData.role}
                        disabled
                        className="pl-12 bg-gray-100 border-gray-200 text-jungle-gray/60"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Language */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Label htmlFor="langue" className="text-jungle-gray font-body font-semibold">
                    Langue préférée
                  </Label>
                  <Select value={formData.langue} onValueChange={(value) => updateField("langue", value)}>
                    <SelectTrigger className="mt-2 bg-gray-50 border-gray-200 focus:border-jungle-yellow focus:ring-jungle-yellow">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {langues.map((langue) => (
                        <SelectItem key={langue.value} value={langue.value}>
                          {langue.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Themes */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Label className="text-jungle-gray font-body font-semibold">
                    Thèmes d'intérêt * (sélectionnez vos centres d'intérêt)
                  </Label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {themesOptions.map((theme) => (
                      <Badge
                        key={theme}
                        variant={formData.themes.includes(theme) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          formData.themes.includes(theme)
                            ? "bg-jungle-yellow text-jungle-gray hover:bg-jungle-yellow/80"
                            : "border-jungle-yellow/50 text-jungle-gray hover:bg-jungle-yellow hover:text-jungle-gray"
                        }`}
                        onClick={() => toggleTheme(theme)}
                      >
                        {theme}
                      </Badge>
                    ))}
                  </div>
                  {errors.themes && (
                    <p className="text-red-500 text-sm mt-2 font-body">{errors.themes}</p>
                  )}
                </motion.div>

                {/* Bio */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="bio" className="text-jungle-gray font-body font-semibold">
                      Bio personnelle *
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateBio}
                      className="border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Générer
                    </Button>
                  </div>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => {
                      updateField("bio", e.target.value)
                      setBioGenerated(false)
                    }}
                    className={`bg-gray-50 border-gray-200 focus:border-jungle-yellow focus:ring-jungle-yellow min-h-[100px] ${
                      errors.bio ? "border-red-500" : ""
                    } ${bioGenerated ? "border-gray-200 bg-gray-50" : ""}`}
                    placeholder="Parlez-nous de vous, vos passions, ce qui vous motive..."
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm mt-1 font-body">{errors.bio}</p>
                  )}
                  {bioGenerated && (
                    <p className="text-black text-sm mt-1 font-body">
                      ✨ Bio générée automatiquement - vous pouvez la modifier
                    </p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-jungle-yellow text-jungle-gray hover:bg-jungle-yellow/90 font-body text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="flex items-center"
                      >
                        <Loader2 className="w-5 h-5 mr-2" />
                        Création du profil...
                      </motion.div>
                    ) : (
                      "Créer mon profil"
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 