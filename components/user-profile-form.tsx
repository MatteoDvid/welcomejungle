"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { User, Mail, Briefcase, Loader2, CheckCircle } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface FormData {
  prenom: string
  nom: string
  email: string
  role: string
}

export function UserProfileForm() {
  const { t } = useLanguage()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    prenom: "",
    nom: "",
    email: "",
    role: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const roles = [
    { value: "Employé", label: t.login.employee },
    { value: "RH", label: t.login.hr },
    { value: "Manager", label: t.login.manager },
    { value: "Office Manager", label: t.login.officeManager }
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Prénom requis"
    }

    if (!formData.nom.trim()) {
      newErrors.nom = "Nom requis"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Format d'email invalide (ex: nom@domaine.com)"
    }

    if (!formData.role) {
      newErrors.role = "Rôle requis"
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
        email: formData.email.trim().toLowerCase(),
        role: formData.role
      }

      // Construct the GET request URL with query parameters
      const webhookUrl = new URL("https://hook.eu2.make.com/wxrej34isrle6n3w6i1l52lndi8y3upl")
      webhookUrl.searchParams.append("prenom", cleanData.prenom)
      webhookUrl.searchParams.append("nom", cleanData.nom)
      webhookUrl.searchParams.append("email", cleanData.email)
      webhookUrl.searchParams.append("role", cleanData.role)

      console.log("📤 Envoi des données vers la base...")

      // Send GET request to Make webhook
      const response = await fetch(webhookUrl.toString(), {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      })

      if (!response.ok) {
        throw new Error("Erreur de connexion à la base de données")
      }

      console.log("✅ Données enregistrées avec succès!")

      // Show success state
      setIsSuccess(true)

      // Navigate to matching screen after a brief delay
      setTimeout(() => {
        router.push("/matches")
      }, 1500)

    } catch (error) {
      console.error("❌ Erreur:", error)
      setErrors({ email: "Impossible d'enregistrer vos données. Vérifiez votre connexion internet et réessayez." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
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
                Redirection vers vos matches...
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
          className="w-full max-w-lg"
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
                Créer votre profil
              </CardTitle>
              <p className="text-jungle-gray/70 font-body text-center">
                Quelques informations pour commencer
              </p>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="prenom" className="text-jungle-gray font-body font-semibold">
                    Prénom *
                  </Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jungle-gray/40" />
                    <Input
                      id="prenom"
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => updateField("prenom", e.target.value)}
                      className={`pl-12 bg-gray-50 border-gray-200 focus:border-jungle-yellow focus:ring-jungle-yellow ${
                        errors.prenom ? "border-red-500" : ""
                      }`}
                      placeholder="Votre prénom"
                    />
                  </div>
                  {errors.prenom && (
                    <p className="text-red-500 text-sm mt-1 font-body">{errors.prenom}</p>
                  )}
                </motion.div>

                {/* Last Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="nom" className="text-jungle-gray font-body font-semibold">
                    Nom *
                  </Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jungle-gray/40" />
                    <Input
                      id="nom"
                      type="text"
                      value={formData.nom}
                      onChange={(e) => updateField("nom", e.target.value)}
                      className={`pl-12 bg-gray-50 border-gray-200 focus:border-jungle-yellow focus:ring-jungle-yellow ${
                        errors.nom ? "border-red-500" : ""
                      }`}
                      placeholder="Votre nom"
                    />
                  </div>
                  {errors.nom && (
                    <p className="text-red-500 text-sm mt-1 font-body">{errors.nom}</p>
                  )}
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="email" className="text-jungle-gray font-body font-semibold">
                    Email *
                  </Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jungle-gray/40" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={`pl-12 bg-gray-50 border-gray-200 focus:border-jungle-yellow focus:ring-jungle-yellow ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 font-body">{errors.email}</p>
                  )}
                </motion.div>

                {/* Role */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Label htmlFor="role" className="text-jungle-gray font-body font-semibold">
                    Rôle *
                  </Label>
                  <div className="relative mt-2">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jungle-gray/40 z-10" />
                    <Select value={formData.role} onValueChange={(value) => updateField("role", value)}>
                      <SelectTrigger className={`pl-12 bg-gray-50 border-gray-200 focus:border-jungle-yellow focus:ring-jungle-yellow ${
                        errors.role ? "border-red-500" : ""
                      }`}>
                        <SelectValue placeholder="Sélectionnez votre rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1 font-body">{errors.role}</p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
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
                        Envoi en cours...
                      </motion.div>
                    ) : (
                      "Créer mon profil"
                    )}
                  </Button>
                  
                  {/* Show errors if any */}
                  {Object.values(errors).some(error => error) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <p className="text-red-700 font-body text-sm text-center">
                        ⚠️ {Object.values(errors).find(error => error)}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 