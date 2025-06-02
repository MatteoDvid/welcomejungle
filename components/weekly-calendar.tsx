"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Users,
  Filter,
  Settings,
  UserCheck,
  Building2,
  Home,
  X,
  Globe
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { GoogleCalendarConnect } from "@/components/google-calendar-connect"
import { GoogleCalendar, GoogleCalendarEvent, PresenceEvent } from "@/lib/google-calendar"

interface CalendarEvent {
  id: string
  title: string
  startTime: string
  endTime: string
  color: string
  date: string
  type: string
  attendees?: string[]
  location?: string
}

interface GroupFilter {
  id: string
  name: string
  color: string
  members: string[]
}

export function WeeklyCalendar() {
  const { language, setLanguage } = useLanguage()
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())
  const [googleEvents, setGoogleEvents] = useState<GoogleCalendarEvent[]>([])
  const [presences, setPresences] = useState<PresenceEvent[]>([])
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [showOnlyMyGroups, setShowOnlyMyGroups] = useState(false)
  const [userPresenceToday, setUserPresenceToday] = useState<'present' | 'remote' | 'absent'>('absent')
  const [isConnected, setIsConnected] = useState(false)

  // Groupes disponibles
  const availableGroups: GroupFilter[] = [
    { id: 'coffee', name: 'Coffee Culture Club', color: 'bg-yellow-500', members: ['Emma', 'Sarah', 'Mike'] },
    { id: 'fitness', name: 'Fitness Squad', color: 'bg-red-500', members: ['Lisa', 'David', 'Maria'] },
    { id: 'lunch', name: 'Lunch Bunch', color: 'bg-green-500', members: ['Tom', 'Jenny', 'Carlos'] },
    { id: 'ux', name: 'UX Team', color: 'bg-purple-500', members: ['Emma', 'Sarah'] },
    { id: 'dev', name: 'Dev Team', color: 'bg-blue-500', members: ['Tom', 'Mike', 'Alex'] }
  ]

  // Traductions
  const t = {
    calendar: language === 'fr' ? 'Calendrier' : 'Calendar',
    create: language === 'fr' ? 'Créer' : 'Create',
    weekView: language === 'fr' ? 'Vue semaine' : 'Week view',
    dayView: language === 'fr' ? 'Vue jour' : 'Day view',
    today: language === 'fr' ? 'Aujourd\'hui' : 'Today',
    present: language === 'fr' ? 'Présent' : 'Present',
    remote: language === 'fr' ? 'Télétravail' : 'Remote',
    absent: language === 'fr' ? 'Absent' : 'Absent',
    myGroups: language === 'fr' ? 'Mes groupes uniquement' : 'My groups only',
    filters: language === 'fr' ? 'Filtres' : 'Filters',
    whoIsHere: language === 'fr' ? 'Qui est présent' : 'Who\'s here',
    office: language === 'fr' ? 'Bureau' : 'Office',
    home: language === 'fr' ? 'Domicile' : 'Home',
    updatePresence: language === 'fr' ? 'Mettre à jour ma présence' : 'Update my presence'
  }

  // Noms des jours selon la langue
  const dayNames = language === 'fr' 
    ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const fullDayNames = language === 'fr'
    ? ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  // Générer les jours de la semaine
  const generateWeekDays = (startDate: Date) => {
    const days = []
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      days.push({
        date: date,
        dayName: dayNames[i],
        fullDayName: fullDayNames[i],
        dayNumber: date.getDate(),
        isToday: date.toDateString() === new Date().toDateString(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      })
    }
    return days
  }

  // Événements de démonstration selon la langue
  const getDemoEvents = (): CalendarEvent[] => {
    const today = currentWeekStart.toISOString().split('T')[0]
    
    return [
      {
        id: "1",
        title: language === 'fr' ? "Réunion équipe" : "Team Meeting",
        startTime: "09:00",
        endTime: "10:00",
        color: "bg-blue-500",
        date: today,
        type: "meeting",
        attendees: ["Emma", "Tom", "Sarah"],
        location: language === 'fr' ? "Salle A" : "Room A"
      },
      {
        id: "2", 
        title: "Coffee Culture Club",
        startTime: "15:00",
        endTime: "16:00",
        color: "bg-yellow-500",
        date: new Date(currentWeekStart.getTime() + 24*60*60*1000).toISOString().split('T')[0],
        type: "group_activity",
        attendees: ["Emma", "Sarah", "Mike"],
        location: "Lobby Café"
      },
      {
        id: "3",
        title: "Lunch & Learn",
        startTime: "12:30",
        endTime: "13:30", 
        color: "bg-green-500",
        date: new Date(currentWeekStart.getTime() + 2*24*60*60*1000).toISOString().split('T')[0],
        type: "learning",
        attendees: ["Tom", "Jenny", "Carlos"],
        location: language === 'fr' ? "Cafétéria" : "Cafeteria"
      }
    ]
  }

  useEffect(() => {
    // Calculer le début de la semaine (lundi)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const monday = new Date(now)
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    monday.setHours(0, 0, 0, 0)
    setCurrentWeekStart(monday)
    setSelectedDate(now)

    // Charger les présences du jour
    loadTodayPresences()
    
    // Vérifier la connexion Google Calendar
    checkGoogleConnection()
  }, [])

  const loadTodayPresences = async () => {
    const today = new Date().toISOString().split('T')[0]
    try {
      const todayPresences = await GoogleCalendar.getPresencesFromSheets(today)
      setPresences(todayPresences)
    } catch (error) {
      console.error('Error loading presences:', error)
    }
  }

  const checkGoogleConnection = async () => {
    try {
      await GoogleCalendar.init()
      setIsConnected(GoogleCalendar.isSignedIn())
    } catch (error) {
      console.error('Error checking Google connection:', error)
    }
  }

  const weekDays = generateWeekDays(currentWeekStart)
  const allEvents = [...getDemoEvents()]

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeekStart(newStart)
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1))
    setSelectedDate(newDate)
  }

  const getDateRange = () => {
    if (viewMode === 'day') {
      return selectedDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    }
    
    const endDate = new Date(currentWeekStart)
    endDate.setDate(currentWeekStart.getDate() + 6)
    
    const startStr = currentWeekStart.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' })
    const endStr = endDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    
    return `${startStr} - ${endStr}`
  }

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ]

  const getEventPosition = (event: CalendarEvent) => {
    const startHour = parseInt(event.startTime.split(':')[0])
    const endHour = parseInt(event.endTime.split(':')[0])
    const duration = endHour - startHour
    
    return {
      top: `${(startHour - 8) * 60}px`,
      height: `${duration * 60 - 4}px`
    }
  }

  const handleGoogleEventsUpdate = (events: GoogleCalendarEvent[]) => {
    setGoogleEvents(events)
  }

  const handlePresenceUpdate = async (status: 'present' | 'remote' | 'absent') => {
    setUserPresenceToday(status)
    
    const today = new Date().toISOString().split('T')[0]
    const userProfile = GoogleCalendar.getUserProfile()
    
    const presenceEvent: PresenceEvent = {
      userId: 'current-user',
      userEmail: userProfile.email,
      userName: userProfile.name,
      date: today,
      status: status,
      location: status === 'present' ? 'Bureau' : status === 'remote' ? 'Domicile' : '',
      groups: ['Coffee Culture Club', 'UX Team'],
      notes: `Présence mise à jour depuis l'app à ${new Date().toLocaleTimeString()}`
    }

    try {
      await GoogleCalendar.createPresenceEvent(presenceEvent)
      console.log('✅ Présence mise à jour')
      loadTodayPresences() // Recharger les présences
    } catch (error) {
      console.error('❌ Erreur mise à jour présence:', error)
    }
  }

  const filteredEvents = allEvents.filter(event => {
    if (showOnlyMyGroups && selectedGroups.length > 0) {
      return selectedGroups.some(groupId => {
        const group = availableGroups.find(g => g.id === groupId)
        return group && event.attendees?.some(attendee => group.members.includes(attendee))
      })
    }
    return true
  })

  const getPresentUsers = () => {
    return presences.filter(p => p.status === 'present')
  }

  const getRemoteUsers = () => {
    return presences.filter(p => p.status === 'remote')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between max-w-7xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-medium text-gray-800 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
              {t.calendar}
            </h1>
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t.create}
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sélecteur de langue */}
            <Select value={language} onValueChange={(value: 'fr' | 'en') => setLanguage(value)}>
              <SelectTrigger className="w-32">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">🇫🇷 Français</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
              </SelectContent>
            </Select>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => viewMode === 'week' ? navigateWeek('prev') : navigateDay('prev')}
                className="p-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => viewMode === 'week' ? navigateWeek('next') : navigateDay('next')}
                className="p-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-lg text-gray-700 min-w-48 text-center font-medium">
              {getDateRange()}
            </div>
          </div>
        </div>

        {/* Tabs et filtres */}
        <div className="border-t border-gray-100 px-4 py-2 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Tabs value={viewMode} onValueChange={(value: 'week' | 'day') => setViewMode(value)}>
              <TabsList className="grid w-48 grid-cols-2">
                <TabsTrigger value="week">{t.weekView}</TabsTrigger>
                <TabsTrigger value="day">{t.dayView}</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-4">
              {/* Filtres */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{t.filters}:</span>
                <Switch
                  checked={showOnlyMyGroups}
                  onCheckedChange={setShowOnlyMyGroups}
                />
                <span className="text-sm text-gray-600">{t.myGroups}</span>
              </div>

              {/* Statut de connexion */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500">
                  {isConnected ? 'Google Calendar' : 'Déconnecté'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar gauche */}
        <div className="space-y-4">
          {/* Google Calendar Integration */}
          <GoogleCalendarConnect onEventsUpdate={handleGoogleEventsUpdate} />

          {/* Ma présence aujourd'hui */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                {t.updatePresence}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={userPresenceToday === 'present' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePresenceUpdate('present')}
                  className={`flex flex-col gap-1 h-auto py-2 ${userPresenceToday === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs">{t.present}</span>
                </Button>
                <Button
                  variant={userPresenceToday === 'remote' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePresenceUpdate('remote')}
                  className={`flex flex-col gap-1 h-auto py-2 ${userPresenceToday === 'remote' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                >
                  <Home className="w-4 h-4" />
                  <span className="text-xs">{t.remote}</span>
                </Button>
                <Button
                  variant={userPresenceToday === 'absent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePresenceUpdate('absent')}
                  className={`flex flex-col gap-1 h-auto py-2 ${userPresenceToday === 'absent' ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
                >
                  <X className="w-4 h-4" />
                  <span className="text-xs">{t.absent}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Qui est présent */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                {t.whoIsHere}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Au bureau */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">{t.office}</span>
                  <Badge variant="secondary" className="text-xs">
                    {getPresentUsers().length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {getPresentUsers().map((user, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-green-100 text-green-800">
                          {user.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user.userName}</span>
                    </div>
                  ))}
                  {getPresentUsers().length === 0 && (
                    <p className="text-xs text-gray-500">Aucune présence aujourd'hui</p>
                  )}
                </div>
              </div>

              {/* En télétravail */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">{t.home}</span>
                  <Badge variant="secondary" className="text-xs">
                    {getRemoteUsers().length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {getRemoteUsers().map((user, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                          {user.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user.userName}</span>
                    </div>
                  ))}
                  {getRemoteUsers().length === 0 && (
                    <p className="text-xs text-gray-500">Personne en télétravail</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border">
            <Tabs value={viewMode}>
              <TabsContent value="week" className="m-0">
                {/* En-têtes des jours */}
                <div className="grid grid-cols-8 border-b border-gray-200">
                  <div className="p-4 border-r border-gray-200 bg-gray-50"></div>
                  {weekDays.map((day) => (
                    <div key={day.date.toISOString()} className={`p-4 text-center border-r border-gray-200 last:border-r-0 ${day.isWeekend ? 'bg-gray-50' : 'bg-white'}`}>
                      <div className="text-sm text-gray-600">{day.dayName}</div>
                      <div className={`text-xl mt-1 ${day.isToday ? 'bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : 'text-gray-700'}`}>
                        {day.dayNumber}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grille horaire */}
                <div className="grid grid-cols-8">
                  {/* Colonne des heures */}
                  <div className="border-r border-gray-200">
                    {timeSlots.map((time) => (
                      <div key={time} className="h-16 p-2 border-b border-gray-100 text-xs text-gray-500 text-right pr-4 bg-gray-50">
                        {time}
                      </div>
                    ))}
                  </div>

                  {/* Colonnes des jours */}
                  {weekDays.map((day) => (
                    <div key={day.date.toISOString()} className={`border-r border-gray-200 last:border-r-0 relative ${day.isWeekend ? 'bg-gray-50/50' : ''}`}>
                      {timeSlots.map((time) => (
                        <div key={time} className="h-16 border-b border-gray-100 relative">
                          {/* Événements pour ce jour et cette heure */}
                          {filteredEvents
                            .filter(event => {
                              const eventDate = event.date
                              const dayDate = day.date.toISOString().split('T')[0]
                              return eventDate === dayDate && event.startTime.startsWith(time.substring(0, 2))
                            })
                            .map((event) => (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                className={`absolute left-1 right-1 rounded text-white text-xs p-2 cursor-pointer shadow-sm ${event.color}`}
                                style={getEventPosition(event)}
                              >
                                <div className="font-medium truncate">{event.title}</div>
                                <div className="opacity-90">{event.startTime} - {event.endTime}</div>
                                {event.location && (
                                  <div className="opacity-80 text-xs">{event.location}</div>
                                )}
                              </motion.div>
                            ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="day" className="m-0">
                {/* Vue jour */}
                <div className="grid grid-cols-1">
                  <div className="border-b border-gray-200 p-4 bg-gray-50">
                    <h3 className="text-lg font-medium">
                      {selectedDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2">
                    {/* Colonne des heures */}
                    <div className="border-r border-gray-200">
                      {timeSlots.map((time) => (
                        <div key={time} className="h-20 p-3 border-b border-gray-100 text-sm text-gray-500 bg-gray-50">
                          {time}
                        </div>
                      ))}
                    </div>

                    {/* Colonne des événements */}
                    <div className="relative">
                      {timeSlots.map((time) => (
                        <div key={time} className="h-20 border-b border-gray-100 relative p-2">
                          {filteredEvents
                            .filter(event => {
                              const eventDate = event.date
                              const selectedDateStr = selectedDate.toISOString().split('T')[0]
                              return eventDate === selectedDateStr && event.startTime.startsWith(time.substring(0, 2))
                            })
                            .map((event) => (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`rounded text-white text-sm p-3 mb-2 shadow-sm ${event.color}`}
                              >
                                <div className="font-medium">{event.title}</div>
                                <div className="text-xs opacity-90">{event.startTime} - {event.endTime}</div>
                                {event.location && (
                                  <div className="text-xs opacity-80 mt-1">{event.location}</div>
                                )}
                                {event.attendees && (
                                  <div className="text-xs opacity-80 mt-1">
                                    {event.attendees.join(', ')}
                                  </div>
                                )}
                              </motion.div>
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Événements Google Calendar */}
          {googleEvents.length > 0 && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    📅 {language === 'fr' ? 'Événements Google Calendar' : 'Google Calendar Events'} 
                    <Badge variant="secondary">{googleEvents.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {googleEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer"
                      >
                        <h4 className="font-medium text-blue-900 mb-2">{event.title}</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          <div>📅 {new Date(event.start.dateTime).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</div>
                          {event.location && (
                            <div>📍 {event.location}</div>
                          )}
                          {event.attendees && event.attendees.length > 0 && (
                            <div>👥 {event.attendees.length} {language === 'fr' ? 'participants' : 'attendees'}</div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
