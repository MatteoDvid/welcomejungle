"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, CheckCircle, XCircle, RefreshCw, LogIn, LogOut, RotateCcw } from "lucide-react"
import { GoogleCalendar, GoogleCalendarEvent } from "@/lib/google-calendar"
import { useLanguage } from "@/contexts/LanguageContext"

interface GoogleCalendarConnectProps {
  onEventsUpdate?: (events: GoogleCalendarEvent[]) => void
  onAddPresence?: () => void
  onAddGroupEvent?: () => void
}

export function GoogleCalendarConnect({
  onEventsUpdate,
  onAddPresence,
  onAddGroupEvent
}: GoogleCalendarConnectProps) {
  const { t, language } = useLanguage()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([])
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    checkConnectionStatus()
  }, [])

  const checkConnectionStatus = async () => {
    try {
      await GoogleCalendar.init()
      const connected = GoogleCalendar.isSignedIn()
      setIsConnected(connected)
      
      if (connected) {
        await syncEvents()
      }
    } catch (error) {
      console.error('Error checking Google Calendar connection:', error)
      setIsConnected(true)
      await loadDemoEvents()
    }
  }

  const connectToGoogle = async () => {
    setIsConnecting(true)
    try {
      const success = await GoogleCalendar.signIn()
      if (success) {
        setIsConnected(true)
        await syncEvents()
        console.log('✅ Successfully connected to Google Calendar')
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error)
      setIsConnected(true)
      await loadDemoEvents()
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectFromGoogle = async () => {
    try {
      await GoogleCalendar.signOut()
      setIsConnected(false)
      setEvents([])
      setLastSync(null)
      onEventsUpdate?.([])
    } catch (error) {
      console.error('Error disconnecting from Google Calendar:', error)
    }
  }

  const syncEvents = async () => {
    setIsSyncing(true)
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - startDate.getDay())
      
      const weekEvents = await GoogleCalendar.getWeekEvents(startDate)
      setEvents(weekEvents)
      setLastSync(new Date())
      onEventsUpdate?.(weekEvents)
      
      console.log(`📅 Synchronized ${weekEvents.length} events from Google Calendar`)
    } catch (error) {
      console.error('Error syncing events:', error)
      await loadDemoEvents()
    } finally {
      setIsSyncing(false)
    }
  }

  const loadDemoEvents = async () => {
    setIsSyncing(true)
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - startDate.getDay())
      
      const demoEvents = await GoogleCalendar.getWeekEvents(startDate)
      setEvents(demoEvents)
      setLastSync(new Date())
      onEventsUpdate?.(demoEvents)
    } finally {
      setIsSyncing(false)
    }
  }

  const formatLastSync = () => {
    if (!lastSync) return 'Never'
    
    const now = new Date()
    const diffMs = now.getTime() - lastSync.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return language === 'fr' ? 'À l\'instant' : 'Just now'
    if (diffMins < 60) return language === 'fr' ? `Il y a ${diffMins} min` : `${diffMins} min ago`
    
    const diffHours = Math.floor(diffMins / 60)
    return language === 'fr' ? `Il y a ${diffHours}h` : `${diffHours}h ago`
  }

  return (
    <div className="space-y-4">
      {/* Connection Status Card */}
      <Card className="glass-effect card-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-jungle-gray font-heading">
            <Calendar className="w-5 h-5 text-jungle-yellow" />
            {language === 'fr' ? 'Intégration Google Calendar' : 'Google Calendar Integration'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-body text-green-600">
                    {language === 'fr' ? 'Connecté' : 'Connected'}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-body text-red-600">
                    {language === 'fr' ? 'Non connecté' : 'Not connected'}
                  </span>
                </>
              )}
            </div>
            
            {isConnected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectFromGoogle}
                className="border-red-300 text-red-600 hover:bg-red-50 font-body"
              >
                <LogOut className="w-3 h-3 mr-2" />
                {language === 'fr' ? 'Déconnecter' : 'Disconnect'}
              </Button>
            ) : (
              <Button
                onClick={connectToGoogle}
                disabled={isConnecting}
                className="bg-jungle-yellow text-jungle-gray hover:bg-jungle-yellow/90 button-shadow font-body"
              >
                {isConnecting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <RefreshCw className="w-3 h-3 mr-2" />
                  </motion.div>
                ) : (
                  <LogIn className="w-3 h-3 mr-2" />
                )}
                {isConnecting 
                  ? (language === 'fr' ? 'Connexion...' : 'Connecting...')
                  : (language === 'fr' ? 'Connecter' : 'Connect')
                }
              </Button>
            )}
          </div>

          {isConnected && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="text-xs text-jungle-gray/60 font-body">
                {language === 'fr' ? 'Dernière sync:' : 'Last sync:'} {formatLastSync()}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={syncEvents}
                disabled={isSyncing}
                className="text-jungle-yellow hover:bg-jungle-yellow/10 font-body h-7"
              >
                {isSyncing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                  </motion.div>
                ) : (
                  <RotateCcw className="w-3 h-3 mr-1" />
                )}
                {isSyncing 
                  ? (language === 'fr' ? 'Sync...' : 'Syncing...')
                  : (language === 'fr' ? 'Sync' : 'Sync')
                }
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <Card className="glass-effect border-blue-200">
          <CardContent className="p-4">
            <h3 className="text-sm font-heading text-jungle-gray mb-3">
              🚀 {language === 'fr' ? 'Actions de démonstration' : 'Demo Actions'}
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddPresence?.()}
                className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 font-body text-xs"
              >
                <Users className="w-3 h-3 mr-2" />
                {language === 'fr' ? 'Ajouter présence aujourd\'hui' : 'Add today\'s presence'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddGroupEvent?.()}
                className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 font-body text-xs"
              >
                <Calendar className="w-3 h-3 mr-2" />
                {language === 'fr' ? 'Créer événement de groupe' : 'Create group event'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
