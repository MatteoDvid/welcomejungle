"use client"

// Déclarations TypeScript pour Google API
declare global {
  interface Window {
    gapi: any
  }
}

interface GoogleCalendarEvent {
  id: string
  title: string
  description?: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees?: Array<{
    email: string
    displayName?: string
    responseStatus: 'accepted' | 'declined' | 'tentative' | 'needsAction'
  }>
  location?: string
  creator?: {
    email: string
    displayName?: string
  }
  organizer?: {
    email: string
    displayName?: string
  }
  status?: 'confirmed' | 'tentative' | 'cancelled'
}

interface PresenceEvent {
  userId: string
  userEmail: string
  userName: string
  date: string
  status: 'present' | 'absent' | 'remote'
  location?: string
  notes?: string
  groups?: string[]
}

interface CalendarConfig {
  apiKey: string
  clientId: string
  sharedCalendarId: string
  sheetsId: string
}

class GoogleCalendarService {
  private static instance: GoogleCalendarService
  private accessToken: string | null = null
  private gapi: any = null
  private authInstance: any = null
  private config: CalendarConfig

  private constructor() {
    this.config = {
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || 'AIzaSyDemo_ReplaceWithRealKey',
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '123456789-demo.apps.googleusercontent.com',
      sharedCalendarId: process.env.NEXT_PUBLIC_COMPANY_CALENDAR_ID || 'office-pulse-shared@company.com',
      sheetsId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '1abcd-demo-sheets-id'
    }
  }

  static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService()
    }
    return GoogleCalendarService.instance
  }

  // Initialiser Google API avec OAuth 2.0
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve()
        return
      }

      if (!window.gapi) {
        const script = document.createElement('script')
        script.src = 'https://apis.google.com/js/api.js'
        script.onload = () => {
          window.gapi.load('client:auth2', () => {
            this.initializeGapiClient().then(resolve).catch(reject)
          })
        }
        script.onerror = reject
        document.head.appendChild(script)
      } else {
        this.initializeGapiClient().then(resolve).catch(reject)
      }
    })
  }

  private async initializeGapiClient(): Promise<void> {
    await window.gapi.client.init({
      apiKey: this.config.apiKey,
      clientId: this.config.clientId,
      discoveryDocs: [
        'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
        'https://sheets.googleapis.com/$discovery/rest?version=v4'
      ],
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/spreadsheets'
      ].join(' ')
    })
    
    this.gapi = window.gapi
    this.authInstance = this.gapi.auth2.getAuthInstance()
  }

  // Authentification OAuth 2.0
  async signIn(): Promise<boolean> {
    try {
      if (!this.gapi) {
        await this.init()
      }

      const user = await this.authInstance.signIn({
        prompt: 'consent'
      })
      
      if (user.isSignedIn()) {
        this.accessToken = user.getAuthResponse().access_token
        const profile = user.getBasicProfile()
        
        console.log('✅ Google Calendar connected successfully')
        console.log('📧 User:', profile.getEmail())
        console.log('👤 Name:', profile.getName())
        
        // Stocker les infos utilisateur
        localStorage.setItem('google-user', JSON.stringify({
          email: profile.getEmail(),
          name: profile.getName(),
          picture: profile.getImageUrl()
        }))
        
        return true
      }
      return false
    } catch (error) {
      console.error('❌ Google Calendar authentication failed:', error)
      // Mode démo pour développement
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Running in demo mode')
        localStorage.setItem('google-calendar-demo', 'true')
        return true
      }
      return false
    }
  }

  // Vérifier si connecté
  isSignedIn(): boolean {
    if (!this.authInstance) return false
    try {
      return this.authInstance.isSignedIn.get() || localStorage.getItem('google-calendar-demo') === 'true'
    } catch {
      return localStorage.getItem('google-calendar-demo') === 'true'
    }
  }

  // Récupérer le profil utilisateur
  getUserProfile() {
    try {
      if (this.authInstance?.isSignedIn.get()) {
        const user = this.authInstance.currentUser.get()
        const profile = user.getBasicProfile()
        return {
          email: profile.getEmail(),
          name: profile.getName(),
          picture: profile.getImageUrl()
        }
      }
    } catch (error) {
      console.error('Error getting user profile:', error)
    }
    
    // Fallback demo user
    return JSON.parse(localStorage.getItem('google-user') || '{"email":"demo@jungle.com","name":"Demo User","picture":""}')
  }

  // Déconnexion
  async signOut(): Promise<void> {
    try {
      if (this.authInstance) {
        await this.authInstance.signOut()
      }
      this.accessToken = null
      localStorage.removeItem('google-calendar-demo')
      localStorage.removeItem('google-user')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // GET https://www.googleapis.com/calendar/v3/calendars/primary/events
  async getWeekEvents(startDate: Date): Promise<GoogleCalendarEvent[]> {
    if (!this.isSignedIn()) {
      return this.getDemoWeekEvents(startDate)
    }

    try {
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 7)

      // Récupérer événements du calendrier principal
      const primaryResponse = await this.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      })

      // Récupérer événements du calendrier partagé d'entreprise
      let sharedEvents = []
      try {
        const sharedResponse = await this.gapi.client.calendar.events.list({
          calendarId: this.config.sharedCalendarId,
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          singleEvents: true,
          orderBy: 'startTime'
        })
        sharedEvents = sharedResponse.result.items || []
      } catch (error) {
        console.warn('Could not access shared calendar:', error)
      }

      const allEvents = [
        ...(primaryResponse.result.items || []),
        ...sharedEvents
      ]

      return allEvents.map((event: any) => ({
        id: event.id,
        title: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
        attendees: event.attendees || [],
        location: event.location,
        creator: event.creator,
        organizer: event.organizer,
        status: event.status
      }))
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      return this.getDemoWeekEvents(startDate)
    }
  }

  // POST https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events
  async createPresenceEvent(presence: PresenceEvent): Promise<boolean> {
    if (!this.isSignedIn()) {
      console.log('🔄 Demo mode: Would create presence event for', presence.userName, presence.date)
      await this.syncToGoogleSheets(presence)
      await this.sendSlackNotification(presence)
      return true
    }

    try {
      const startDateTime = new Date(`${presence.date}T09:00:00`)
      const endDateTime = new Date(`${presence.date}T18:00:00`)

      const event = {
        summary: `Présence - ${presence.userName}`,
        description: `Status: ${presence.status}\nGroups: ${presence.groups?.join(', ') || 'Aucun'}\nNotes: ${presence.notes || ''}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'Europe/Paris'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'Europe/Paris'
        },
        attendees: [{
          email: presence.userEmail,
          displayName: presence.userName
        }],
        location: presence.location || 'Bureau',
        extendedProperties: {
          private: {
            type: 'office-pulse-presence',
            userId: presence.userId,
            status: presence.status,
            groups: JSON.stringify(presence.groups || [])
          }
        },
        colorId: presence.status === 'present' ? '10' : presence.status === 'remote' ? '5' : '8' // Vert, Bleu, Rouge
      }

      const response = await this.gapi.client.calendar.events.insert({
        calendarId: this.config.sharedCalendarId,
        resource: event
      })

      console.log('✅ Presence event created successfully:', response.result.id)
      
      // Synchroniser avec Google Sheets
      await this.syncToGoogleSheets(presence)
      
      // Envoyer notification Slack
      await this.sendSlackNotification(presence)
      
      return true
    } catch (error) {
      console.error('Error creating presence event:', error)
      return false
    }
  }

  // Synchroniser avec Google Sheets
  private async syncToGoogleSheets(presence: PresenceEvent): Promise<void> {
    if (!this.isSignedIn()) {
      console.log('🔄 Demo mode: Would sync to Google Sheets')
      return
    }

    try {
      const values = [[
        new Date().toISOString(), // Timestamp
        presence.userId,
        presence.userName,
        presence.userEmail,
        presence.date,
        presence.status,
        presence.location || '',
        presence.groups?.join(', ') || '',
        presence.notes || '',
        'App' // Source
      ]]

      await this.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: this.config.sheetsId,
        range: 'Présences!A:J',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: { values }
      })

      console.log('✅ Synced to Google Sheets')
    } catch (error) {
      console.error('Error syncing to Google Sheets:', error)
    }
  }

  // Envoyer notification Slack via Make/Zapier
  private async sendSlackNotification(presence: PresenceEvent): Promise<void> {
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL
      if (!webhookUrl) {
        console.log('🔄 Demo mode: Would send Slack notification')
        return
      }

      const statusEmoji = presence.status === 'present' ? '🏢' : presence.status === 'remote' ? '🏠' : '❌'
      const message = `${statusEmoji} ${presence.userName} est ${presence.status === 'present' ? 'présent(e) au bureau' : presence.status === 'remote' ? 'en télétravail' : 'absent(e)'} le ${new Date(presence.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} !`

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: message,
          user: presence.userName,
          email: presence.userEmail,
          status: presence.status,
          date: presence.date,
          groups: presence.groups || [],
          location: presence.location
        })
      })

      console.log('✅ Slack notification sent')
    } catch (error) {
      console.error('Error sending Slack notification:', error)
    }
  }

  // Créer un événement de groupe
  async createGroupEvent(
    groupName: string, 
    activity: string, 
    date: string, 
    time: string, 
    attendees: string[], 
    location: string
  ): Promise<boolean> {
    if (!this.isSignedIn()) {
      console.log('🔄 Demo mode: Would create group event', groupName, activity)
      return true
    }

    try {
      const startDateTime = new Date(`${date}T${time}:00`)
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000) // 1 heure par défaut

      const event = {
        summary: `${groupName} - ${activity}`,
        description: `Activité de groupe organisée par ${groupName}\nActivité: ${activity}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'Europe/Paris'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'Europe/Paris'
        },
        attendees: attendees.map(email => ({ email })),
        location: location,
        extendedProperties: {
          private: {
            type: 'office-pulse-group-activity',
            groupName: groupName,
            activity: activity
          }
        },
        colorId: '7' // Bleu turquoise pour les activités de groupe
      }

      await this.gapi.client.calendar.events.insert({
        calendarId: this.config.sharedCalendarId,
        resource: event
      })

      console.log('✅ Group event created successfully')
      return true
    } catch (error) {
      console.error('Error creating group event:', error)
      return false
    }
  }

  // Récupérer les présences depuis Google Sheets
  async getPresencesFromSheets(date: string): Promise<PresenceEvent[]> {
    if (!this.isSignedIn()) {
      return this.getDemoPresences(date)
    }

    try {
      const response = await this.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.config.sheetsId,
        range: 'Présences!A:J'
      })

      const rows = response.result.values || []
      const presences: PresenceEvent[] = []

      for (let i = 1; i < rows.length; i++) { // Skip header
        const row = rows[i]
        if (row[4] === date) { // Date column
          presences.push({
            userId: row[1],
            userName: row[2],
            userEmail: row[3],
            date: row[4],
            status: row[5] as 'present' | 'absent' | 'remote',
            location: row[6],
            groups: row[7] ? row[7].split(', ') : [],
            notes: row[8]
          })
        }
      }

      return presences
    } catch (error) {
      console.error('Error getting presences from Sheets:', error)
      return this.getDemoPresences(date)
    }
  }

  // Données de démonstration
  private getDemoWeekEvents(startDate: Date): GoogleCalendarEvent[] {
    const events: GoogleCalendarEvent[] = []
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      // Réunion d'équipe le lundi
      if (date.getDay() === 1) {
        events.push({
          id: `team-meeting-${date.toISOString()}`,
          title: 'Réunion d\'équipe hebdomadaire',
          description: 'Point hebdomadaire avec toute l\'équipe',
          start: {
            dateTime: new Date(date.setHours(9, 0)).toISOString(),
            timeZone: 'Europe/Paris'
          },
          end: {
            dateTime: new Date(date.setHours(10, 0)).toISOString(),
            timeZone: 'Europe/Paris'
          },
          attendees: [
            { email: 'emma@jungle.com', displayName: 'Emma Wilson', responseStatus: 'accepted' },
            { email: 'tom@jungle.com', displayName: 'Tom Anderson', responseStatus: 'accepted' },
            { email: 'sarah.hr@jungle.com', displayName: 'Sarah HR', responseStatus: 'tentative' }
          ],
          location: 'Salle de réunion A',
          status: 'confirmed'
        })
      }

      // Présence Emma
      if (date.getDay() >= 1 && date.getDay() <= 5) {
        events.push({
          id: `presence-emma-${date.toISOString()}`,
          title: 'Présence - Emma Wilson',
          description: 'Status: present\nGroups: Coffee Culture Club, UX Team',
          start: {
            dateTime: new Date(date.setHours(9, 0)).toISOString(),
            timeZone: 'Europe/Paris'
          },
          end: {
            dateTime: new Date(date.setHours(18, 0)).toISOString(),
            timeZone: 'Europe/Paris'
          },
          attendees: [
            { email: 'emma@jungle.com', displayName: 'Emma Wilson', responseStatus: 'accepted' }
          ],
          location: 'Bureau',
          status: 'confirmed'
        })
      }
    }

    return events
  }

  private getDemoPresences(date: string): PresenceEvent[] {
    return [
      {
        userId: 'emma-001',
        userName: 'Emma Wilson',
        userEmail: 'emma@jungle.com',
        date: date,
        status: 'present',
        location: 'Bureau - Floor 2',
        groups: ['Coffee Culture Club', 'UX Team'],
        notes: 'Working on Office Pulse Match project'
      },
      {
        userId: 'tom-002',
        userName: 'Tom Anderson',
        userEmail: 'tom@jungle.com',
        date: date,
        status: 'remote',
        location: 'Home',
        groups: ['Dev Team'],
        notes: 'Remote work day'
      }
    ]
  }
}

export const GoogleCalendar = GoogleCalendarService.getInstance()
export type { GoogleCalendarEvent, PresenceEvent } 