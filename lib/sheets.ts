export interface Profile {
  id: string
  email: string
  name: string
  role: string
  officeDays: string[]
  interests: string[]
  activities: string[]
  photo?: string
  bio: string
  createdAt: string
}

export interface Match {
  id: string
  participants: string[]
  activity: string
  date: string
  location: string
  status: "pending" | "accepted" | "completed"
  createdAt: string
}

// Demo data - in production this would sync with Google Sheets
const DEMO_PROFILES: Profile[] = [
  {
    id: "1",
    email: "emma@jungle.com",
    name: "Emma Wilson",
    role: "Product Designer",
    officeDays: ["monday", "tuesday", "wednesday"],
    interests: ["design", "coffee", "books"],
    activities: ["coffee", "lunch", "brainstorming"],
    bio: "Creative problem solver with a passion for great design and even better coffee ☕",
    createdAt: new Date().toISOString(),
  },
]

const DEMO_MATCHES: Match[] = []

export class SheetsService {
  // Profiles
  static async saveProfile(profile: Omit<Profile, "id" | "createdAt">): Promise<Profile> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newProfile: Profile = {
      ...profile,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    DEMO_PROFILES.push(newProfile)
    return newProfile
  }

  static async getProfile(email: string): Promise<Profile | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return DEMO_PROFILES.find((p) => p.email === email) || null
  }

  static async getAllProfiles(): Promise<Profile[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return DEMO_PROFILES
  }

  // Matches
  static async saveMatch(match: Omit<Match, "id" | "createdAt">): Promise<Match> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newMatch: Match = {
      ...match,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    DEMO_MATCHES.push(newMatch)
    return newMatch
  }

  static async getMatches(email: string): Promise<Match[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return DEMO_MATCHES.filter((m) => m.participants.includes(email))
  }

  static async getAllMatches(): Promise<Match[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return DEMO_MATCHES
  }
}
