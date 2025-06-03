"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { 
  Users, 
  Shield, 
  BarChart3, 
  FileText, 
  Activity,
  TrendingUp,
  Calendar,
  UserCheck,
  Building
} from "lucide-react"

export function DashboardRH() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()

  const stats = [
    {
      title: "Employés",
      value: "156",
      subtitle: "total entreprise",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Activité",
      value: "92%",
      subtitle: "taux d'engagement",
      icon: Activity,
      color: "bg-black"
    },
    {
      title: "Matches",
      value: "243",
      subtitle: "ce mois-ci",
      icon: UserCheck,
      color: "bg-purple-500"
    },
    {
      title: "Événements",
      value: "18",
      subtitle: "planifiés",
      icon: Calendar,
      color: "bg-orange-500"
    }
  ]

  const insights = [
    {
      title: "Équipes les plus actives",
      subtitle: "Tech, Marketing, Sales",
      trend: "+15%",
      positive: true
    },
    {
      title: "Nouvelles connexions",
      subtitle: "87 cette semaine",
      trend: "+22%",
      positive: true
    },
    {
      title: "Satisfaction globale",
      subtitle: "4.6/5 moyenne",
      trend: "+0.3",
      positive: true
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
                <Shield className="w-5 h-5 text-jungle-gray" />
              </div>
              <div>
                <h1 className="text-2xl font-heading text-jungle-gray">Dashboard RH</h1>
                <p className="text-jungle-gray/70 font-body">
                  Bienvenue, {user?.name || user?.firstName}
                </p>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray"
            >
              Déconnexion
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
          <Card className="bg-gradient-to-r from-purple-500/20 to-purple-500/10 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-heading text-jungle-gray mb-1">
                    Vue d'ensemble RH
                  </h2>
                  <p className="text-jungle-gray/70 font-body">
                    Insights et gestion de l'engagement des employés
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
          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-jungle-gray">
                  <TrendingUp className="w-5 h-5" />
                  <span>Insights de performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-jungle-yellow/5 transition-colors"
                  >
                    <div>
                      <h4 className="font-heading text-jungle-gray">{insight.title}</h4>
                      <p className="text-sm text-jungle-gray/60 font-body">{insight.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-semibold ${
                        insight.positive ? 'text-black' : 'text-red-600'
                      }`}>
                        {insight.trend}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-jungle-gray">
                  <Building className="w-5 h-5" />
                  <span>Gestion RH</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full justify-start bg-jungle-yellow text-jungle-gray hover:bg-jungle-yellow/90 font-body"
                  size="lg"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Gérer les employés
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray font-body"
                  size="lg"
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Analytics détaillés
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray font-body"
                  size="lg"
                >
                  <FileText className="w-5 h-5 mr-3" />
                  Rapports RH
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start border-jungle-yellow text-jungle-yellow hover:bg-jungle-yellow hover:text-jungle-gray font-body"
                  size="lg"
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Planifier événements
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
} 