export interface User {
  email: string
  role: "employee" | "manager" | "hr" | "office_manager"
  name?: string
  avatar?: string
  firstName?: string
  lastName?: string
}

// Demo users - in production this would come from Google Sheets
const DEMO_USERS: Record<string, User> = {
  "emma@jungle.com": { email: "emma@jungle.com", role: "employee", name: "Emma Wilson" },
  "tom@jungle.com": { email: "tom@jungle.com", role: "manager", name: "Tom Johnson" },
  "lucas@jungle.com": { email: "lucas@jungle.com", role: "office_manager", name: "Lucas Martinez" },
  "sarah.hr@jungle.com": { email: "sarah.hr@jungle.com", role: "hr", name: "Sarah Chen" },
}

const DEMO_PASSWORDS: Record<string, string> = {
  "emma@jungle.com": "jungle123",
  "tom@jungle.com": "jungle123",
  "lucas@jungle.com": "jungle123",
  "sarah.hr@jungle.com": "jungle123",
}

export class AuthService {
  static async login(email: string, password: string): Promise<User | null> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In production, this would query Google Sheets
    const user = DEMO_USERS[email]
    const validPassword = DEMO_PASSWORDS[email]

    if (user && validPassword === password) {
      // Store in localStorage for demo
      localStorage.setItem("currentUser", JSON.stringify(user))
      return user
    }

    return null
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const stored = localStorage.getItem("currentUser")
    return stored ? JSON.parse(stored) : null
  }

  static logout(): void {
    localStorage.removeItem("currentUser")
  }

  static getRouteForRole(role: string): string {
    switch (role) {
      case "employee":
        return "/employee"
      case "manager":
        return "/manager"
      case "hr":
        return "/hr"
      case "office_manager":
        return "/office"
      default:
        return "/login"
    }
  }
}
