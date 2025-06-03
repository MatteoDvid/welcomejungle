"use client"

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

  async signIn(): Promise<boolean> {
    try {
      if (!this.gapi) {
        await this.init()
      }

      const user = await this.authInstance.signIn({ prompt: 'consent' })

      if (user.isSignedIn()) {
        this.accessToken = user.getAuthResponse().access_token
        const profile = user.getBasicProfile()
        console.log('✅ Google Calendar connected successfully')
        console.log('📧 User:', profile.getEmail())
        console.log('👤 Name:', profile.getName())

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
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Running in demo mode')
        localStorage.setItem('google-calendar-demo', 'true')
        return true
      }
      return false
    }
  }

  isSignedIn(): boolean {
    if (!this.authInstance) return false
    try {
      return this.authInstance.isSignedIn.get() || localStorage.getItem('google-calendar-demo') === 'true'
    } catch {
      return localStorage.getItem('google-calendar-demo') === 'true'
    }
  }

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

    return JSON.parse(localStorage.getItem('google-user') || '{"email":"demo@jungle.com","name":"Demo User","picture":""}')
  }

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

  async createPresenceEvent(presence: PresenceEvent): Promise<boolean> {
    // FORCE sending to Google Script even in demo mode
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwCf_f5WVihikZ8vW2w95Yh47Q8BocokfLwVvA-raQwgZDHnD6uWfo3EDzW5yTp4S7Q/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(presence)
      })

      const result = await response.json()
      if (result.success) {
        console.log('✅ Presence saved to Google Sheets')
        return true
      } else {
        console.error('❌ Failed to save presence:', result.error)
        return false
      }
    } catch (error) {
      console.error('❌ Network error sending presence:', error)
      return false
    }
  }

  async getPresencesFromSheets(date: string): Promise<PresenceEvent[]> {
    return [] // You can implement reading from Google Sheets if needed
  }
}

export const GoogleCalendar = GoogleCalendarService.getInstance()
export type { GoogleCalendarEvent, PresenceEvent }
