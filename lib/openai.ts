export class OpenAIService {
  static async generateBio(interests: string[], activities: string[], role: string): Promise<string> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In production, this would call OpenAI API
    const bioTemplates = [
      `${role} who loves ${interests.slice(0, 2).join(" and ")} - always up for ${activities[0]} with great colleagues! ✨`,
      `Passionate ${role.toLowerCase()} with a love for ${interests[0]} and ${interests[1]}. Let's grab ${activities[0]} and chat! 🚀`,
      `${role} by day, ${interests[0]} enthusiast by heart. Perfect companion for ${activities[0]} breaks! ☕`,
      `Creative ${role.toLowerCase()} who believes the best ideas come over ${activities[0]}. ${interests[0]} lover! 💡`,
      `${role} with a passion for ${interests.join(", ")}. Always ready for spontaneous ${activities[0]} sessions! 🌟`,
    ]

    return bioTemplates[Math.floor(Math.random() * bioTemplates.length)]
  }

  static async suggestActivity(participants: string[], sharedInterests: string[]): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const activities = [
      `Coffee & ${sharedInterests[0]} Chat`,
      `${sharedInterests[0]} Brainstorming Session`,
      `Lunch Discussion about ${sharedInterests[0]}`,
      `${sharedInterests[0]} Workshop`,
      `Casual ${sharedInterests[0]} Meetup`,
    ]

    return activities[Math.floor(Math.random() * activities.length)]
  }
}
