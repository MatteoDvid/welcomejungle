export interface SlackMessage {
  channel: string
  text: string
  user: string
}

export class SlackService {
  static async sendMatchNotification(
    participants: string[],
    activity: string,
    date: string,
    location: string,
  ): Promise<boolean> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const message = `🎉 Great news! You have a new match for "${activity}" on ${date} at ${location}. Participants: ${participants.join(", ")}`

    // In production, this would call Slack API
    console.log("Slack notification sent:", message)

    return true
  }

  static async sendDailyReminder(user: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const message = `🏢 Good morning! Don't forget to update your office presence for today. Check Office Pulse Match for potential connections!`

    console.log("Daily reminder sent to:", user, message)

    return true
  }

  static async sendTestMessage(user: string, customMessage: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    console.log("Test message sent to:", user, customMessage)

    return true
  }
}
