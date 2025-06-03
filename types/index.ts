import { z } from "zod"

/**
 * Schéma de profil utilisateur pour Office Pulse Match
 * Ajout des champs d'hébergement cross-office ("J'irai dormir chez vous")
 */
export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
  officeDays: z.array(z.string()),
  interests: z.array(z.string()),
  activities: z.array(z.string()),
  photo: z.string().optional(),
  bio: z.string(),
  createdAt: z.string(), // string pour mock/demo
  // --- Hébergement cross-office ---
  city: z.string(),
  hostingAvailable: z.boolean().default(false),
  hostingDetails: z.string().optional(),
  hostingDates: z.array(z.string()).optional(),
})

/**
 * Profil utilisateur typé
 */
export type UserProfile = z.infer<typeof ProfileSchema> 