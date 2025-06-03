"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, CheckCircle, XCircle, RefreshCw, LogIn, LogOut, RotateCcw, Clock, Users2 } from "lucide-react"
import { GoogleCalendar, GoogleCalendarEvent } from "@/lib/google-calendar"
import { useLanguage } from "@/contexts/LanguageContext"

interface GoogleCalendarConnectProps {
  onEventsUpdate?: (events: GoogleCalendarEvent[]) => void
  onAddPresence?: () => void
  onAddGroupEvent?: (group: string, time: string) => void
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

  const [showGroupForm, setShowGroupForm] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState('Sport')
  const [selectedTime, setSelectedTime] = useState('12:00')

  useEffect(() => {
    checkConnectionStatus()
  }, [])

  const checkConnectionStatus = async () => {
    try {
      await GoogleCalendar.init()
      const connected = GoogleCalendar.isSignedIn()
      setIsConnected(connected)
      if (connected) await syncEvents()
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
      }
    } catch (error) {
      console.error('Connection error:', error)
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
      console.error('Error during disconnect:', error)
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
    } catch (error) {
      console.error('Sync error:', error)
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
      {/* Connexion */}
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
                  <span className="text-sm text-green-600 font-medium">Connecté</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 font-medium">Non connecté</span>
                </>
              )}
            </div>
            {isConnected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectFromGoogle}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-1" /> Déconnecter
              </Button>
            ) : (
              <Button
                onClick={connectToGoogle}
                disabled={isConnecting}
                className="bg-jungle-yellow text-jungle-gray hover:bg-jungle-yellow/90"
              >
                {isConnecting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <LogIn className="w-4 h-4 mr-2" />
                )}
                Connecter
              </Button>
            )}
          </div>

          {isConnected && (
            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span>Dernière sync : {formatLastSync()}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-jungle-yellow"
                onClick={syncEvents}
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Rafraîchir
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      {isConnected && (
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">🚀 Actions de
 démonstration' : 'Demo Actions'}
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
                onClick={() => setShowGroupForm(!showGroupForm)}
                className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 font-body text-xs"
              >
                <Calendar className="w-3 h-3 mr-2" />
                {showGroupForm
                  ? (language === 'fr' ? 'Annuler' : 'Cancel')
                  : (language === 'fr' ? 'Créer événement de groupe' : 'Create group event')}
              </Button>

              {showGroupForm && (
                <div className="space-y-2 mt-2">
                  <div>
                    <label className="text-xs">Choisir le groupe :</label>
                    <select
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="w-full border rounded p-1 text-sm"
                    >
                      <option value="Sport">Sport</option>
                      <option value="Tech">Tech</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs">Choisir l'horaire :</label>
                    <input
  type="time"
  value={selectedTime}
  onChange={(e) => {
    console.log('⏰ Time selected:', e.target.value)  // DEBUG log
    setSelectedTime(e.target.value)
  }}
  className="w-full border rounded p-1 text-sm"
/>

                  </div>
                  <Button
  size="sm"
  className="w-full bg-green-500 text-white hover:bg-green-600"
  onClick={() => {
    console.log('🚀 Creating group event:', selectedGroup, selectedTime)  // DEBUG log
    onAddGroupEvent?.(selectedGroup, selectedTime)
    setShowGroupForm(false)
  }}
>
  Confirmer l’événement
</Button>

                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
