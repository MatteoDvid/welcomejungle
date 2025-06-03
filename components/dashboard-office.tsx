"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { 
  Building2, 
  Calendar, 
  Coffee, 
  Users, 
  Activity,
  MapPin,
  Clock,
  Zap,
  Settings
} from "lucide-react"

export function DashboardOffice() {
  const { user, logout } = useAuth()
  const { t, language } = useLanguage()

  const stats = [
    {
      title: language === 'fr' ? "Espaces" : "Spaces",
      value: "24",
      subtitle: language === 'fr' ? "zones gérées" : "managed areas",
      icon: Building2,
      color: "bg-blue-500"
    },
    {
      title: language === 'fr' ? "Événements" : "Events",
      value: "12",
      subtitle: language === 'fr' ? "cette semaine" : "this week",
      icon: Calendar,
      color: "bg-black"
    },
    {
      title: language === 'fr' ? "Participants" : "Participants",
      value: "89",
      subtitle: language === 'fr' ? "moyens/événement" : "avg/event",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      title: language === 'fr' ? "Satisfaction" : "Satisfaction",
      value: "4.7",
      subtitle: language === 'fr' ? "note moyenne" : "average rating",
      icon: Activity,
      color: "bg-orange-500"
    }
  ]

  const upcomingEvents = [
    {
      title: "Coffee & Connect",
      time: "09:00",
      date: language === 'fr' ? "Aujourd'hui" : "Today",
      location: language === 'fr' ? "Cafétéria" : "Cafeteria",
      attendees: 25
    },
    {
      title: language === 'fr' ? "Yoga Session" : "Yoga Session",
      time: "18:00",
      date: language === 'fr' ? "Aujourd'hui" : "Today",
      location: language === 'fr' ? "Salle Zen" : "Zen Room",
      attendees: 15
    },
    {
      title: language === 'fr' ? "Team Lunch" : "Team Lunch",
      time: "12:30",
      date: language === 'fr' ? "Demain" : "Tomorrow",
      location: language === 'fr' ? "Terrasse" : "Terrace",
      attendees: 40
    }
  ]

  return (
    <div className="min-h-screen bg-jungle-yellow">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-jungle-yellow rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-jungle-gray" />
              </div>
              <div>
                <h1 className="text-2xl font-heading text-jungle-gray">{t.dashboard.office.title}</h1>
                <p className="text-jungle-gray/70 font-body">
                  {t.dashboard.welcome.replace('{name}', user?.name || user?.firstName || '')}
                </p>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray"
            >
              {t.nav.logout}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-orange-500/20 to-orange-500/10 border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-heading text-jungle-gray mb-1">
                    Gestion des espaces
                  </h2>
                  <p className="text-jungle-gray/70 font-body">
                    Organisez et animez la vie de bureau
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-jungle-gray/60 font-body">
                    {new Date().toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.color}/10 rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-jungle-gray">{stat.value}</p>
                      <p className="text-sm text-jungle-gray/60 font-body">{stat.subtitle}</p>
                    </div>
                  </div>
                  <h3 className="font-heading text-jungle-gray">{stat.title}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-jungle-gray">
                  <Calendar className="w-5 h-5" />
                  <span>Événements à venir</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-jungle-yellow/5 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-jungle-yellow/20 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-jungle-yellow" />
                      </div>
                      <div>
                        <h4 className="font-heading text-jungle-gray">{event.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-jungle-gray/60 font-body">
                          <span>{event.date} à {event.time}</span>
                          <span>•</span>
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-jungle-gray">
                        {event.attendees} inscrits
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Office Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-jungle-gray">
                  <Settings className="w-5 h-5" />
                  <span>Gestion des espaces</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full justify-start bg-jungle-yellow text-jungle-gray hover:bg-jungle-yellow/90 font-body"
                  size="lg"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Organiser événement
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray font-body"
                  size="lg"
                >
                  <Building2 className="w-5 h-5 mr-3" />
                  Réserver espaces
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray font-body"
                  size="lg"
                >
                  <Coffee className="w-5 h-5 mr-3" />
                  Gérer restauration
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray font-body"
                  size="lg"
                >
                  <Zap className="w-5 h-5 mr-3" />
                  Activités spontanées
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
} 