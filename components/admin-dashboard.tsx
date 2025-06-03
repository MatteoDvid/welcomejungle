"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  TrendingUp,
  Calendar,
  MessageSquare,
  Download,
  MapPin,
  BarChart3,
  Clock,
  Coffee,
  Zap,
  CheckCircle,
  Award,
  List,
} from "lucide-react"

interface AdminDashboardProps {
  userRole: "manager" | "office-manager" | "hr"
}

export function AdminDashboard({ userRole }: AdminDashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState("attendance")

  const stats = {
    totalEmployees: 156,
    weeklyAttendance: 78,
    activeMatches: 24,
    eventsThisWeek: 12,
    avgDailyPresence: 65,
    matchSuccessRate: 85,
    satisfactionScore: 92,
    careerProgression: 68,
  }

  const topMatches = [
    { activity: "Coffee Chats", count: 18, growth: "+12%" },
    { activity: "Lunch Meetings", count: 15, growth: "+8%" },
    { activity: "Brainstorming", count: 12, growth: "+15%" },
    { activity: "Fitness Sessions", count: 9, growth: "+22%" },
  ]

  const recentActivity = [
    { user: "Sarah Chen", action: "joined Coffee Chat", time: "2 min ago", type: "match" },
    { user: "Mike Johnson", action: "updated presence", time: "5 min ago", type: "presence" },
    { user: "Emma Wilson", action: "created Team Lunch", time: "12 min ago", type: "event" },
    { user: "Alex Rodriguez", action: "joined Workout Session", time: "18 min ago", type: "match" },
  ]

  const renderHRView = () => (
    <div className="space-y-6">
      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-effect border-white/20">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.totalEmployees}</p>
            <p className="text-sm text-primary">Total Employees</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold">{stats.weeklyAttendance}%</p>
            <p className="text-sm text-muted-foreground">Weekly Attendance</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-secondary" />
            <p className="text-2xl font-bold">342</p>
            <p className="text-sm text-muted-foreground">Total Matches</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.matchSuccessRate}%</p>
            <p className="text-sm text-muted-foreground">Engagement Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional HR Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Satisfaction Survey
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-3xl font-bold text-green-500">{stats.satisfactionScore}%</p>
            <Progress value={stats.satisfactionScore} className="h-2" />
            <p className="text-sm text-muted-foreground">Based on latest survey results</p>
            <Button variant="outline" className="mt-2">
              View Details
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Career Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-3xl font-bold text-yellow-500">{stats.careerProgression}%</p>
            <Progress value={stats.careerProgression} className="h-2" />
            <p className="text-sm text-muted-foreground">Employees promoted this year</p>
            <Button variant="outline" className="mt-2">
              See Promotions
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <List className="w-5 h-5 mr-2 text-blue-500" />
              Employee List Export
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Export the full list of employees with roles and contact details.
            </p>
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Existing Analytics & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Top Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMatches.map((match, index) => (
                <motion.div
                  key={match.activity}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div>
                    <p className="font-medium">{match.activity}</p>
                    <p className="text-sm text-muted-foreground">{match.count} matches</p>
                  </div>
                  <Badge className="bg-accent text-white">{match.growth}</Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback className="bg-primary text-text-dark text-xs">
                      {activity.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      activity.type === "match"
                        ? "border-primary text-primary"
                        : activity.type === "event"
                        ? "border-accent text-accent"
                        : "border-secondary text-secondary"
                    }
                  >
                    {activity.type}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            {userRole === "manager"
              ? "Team Dashboard 👥"
              : userRole === "office-manager"
              ? "Office Management 🏢"
              : "HR Analytics 📊"}
          </h1>
          <p className="text-muted-foreground">
            {userRole === "manager"
              ? "Monitor your team's office presence and connections"
              : userRole === "office-manager"
              ? "Optimize office space and resources"
              : "Global insights and employee engagement metrics"}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {userRole === "manager" && renderManagerView()}
          {userRole === "office-manager" && renderOfficeManagerView()}
          {userRole === "hr" && renderHRView()}
        </motion.div>
      </div>
    </div>
  )
}
