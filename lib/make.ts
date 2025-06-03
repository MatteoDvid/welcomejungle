"use client"

interface MakeUserProfile {
  prenom: string
  nom: string
  email: string
  role: string
}

class MakeService {
  private static instance: MakeService
  private webhookURL = "https://hook.eu2.make.com/wxrej34isrle6n3w6i1l52lndi8y3upl"

  private constructor() {}

  static getInstance(): MakeService {
    if (!MakeService.instance) {
      MakeService.instance = new MakeService()
    }
    return MakeService.instance
  }

  /**
   * Envoie un profil utilisateur vers Make.com
   */
  async sendUserProfile(email: string, fullName: string, role: string): Promise<boolean> {
    try {
      // Séparer le prénom et nom
      const nameParts = fullName.trim().split(" ")
      const prenom = nameParts[0] || ""
      const nom = nameParts.slice(1).join(" ") || ""
      
      const userProfile: MakeUserProfile = {
        prenom: prenom,
        nom: nom,
        email: email,
        role: role,
      }

      console.log("🔄 Envoi vers Make.com...", userProfile)

      const response = await fetch(this.webhookURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userProfile)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      console.log("✅ Profil envoyé vers Make.com avec succès !")
      console.log("📧 Email:", email)
      console.log("👤 Nom:", `${prenom} ${nom}`)
      console.log("💼 Rôle:", role)
      
      return true
      
    } catch (error) {
      console.error("❌ Erreur envoi Make.com:", error)
      // Ne pas faire échouer la création/mise à jour de profil si Make.com est indisponible
      return false
    }
  }

  /**
   * Envoie une notification de match vers Make.com
   */
  async sendMatchNotification(userEmail: string, matchedUsers: string[], activity: string): Promise<boolean> {
    try {
      const matchData = {
        userEmail: userEmail,
        matchedUsers: matchedUsers,
        activity: activity,
        timestamp: new Date().toISOString(),
        type: "match_notification"
      }

      const response = await fetch(this.webhookURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(matchData)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      console.log("✅ Notification de match envoyée vers Make.com")
      return true
      
    } catch (error) {
      console.error("❌ Erreur envoi notification Make.com:", error)
      return false
    }
  }

  /**
   * Test de connexion Make.com
   */
  async testConnection(): Promise<boolean> {
    try {
      const testData = {
        type: "test_connection",
        timestamp: new Date().toISOString(),
        message: "Test de connexion Office Pulse Match"
      }

      const response = await fetch(this.webhookURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(testData)
      })

      return response.ok
      
    } catch (error) {
      console.error("❌ Erreur test connexion Make.com:", error)
      return false
    }
  }
}

export const MakeIntegration = MakeService.getInstance()
export type { MakeUserProfile } 