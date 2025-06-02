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
} from "lucide-react"

interface AdminDashboardProps {
  userRole: "manager" | "office-manager" | "hr"
}

export function AdminDashboard({ userRole }: AdminDashboardProps) {
  const [selectedMetric, setSelectedMetric] = useState("attendance")

  // Sample data - in real app this would come from API
  const stats = {
    totalEmployees: 156,
    weeklyAttendance: 78,
    activeMatches: 24,
    eventsThisWeek: 12,
    avgDailyPresence: 65,
    matchSuccessRate: 85,
  }

  const attendanceData = [
    { day: "Mon", count: 45, percentage: 65 },
    { day: "Tue", count: 52, percentage: 75 },
    { day: "Wed", count: 48, percentage: 69 },
    { day: "Thu", count: 41, percentage: 59 },
    { day: "Fri", count: 38, percentage: 55 },
  ]

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

  const renderManagerView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Team Attendance */}
      <Card className="glass-effect border-white/20 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary" />
            Team Attendance This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceData.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium w-8">{day.day}</span>
                  <Progress value={day.percentage} className="w-32 h-2" />
                </div>
                <div className="text-right">
                  <span className="font-medium">{day.count}</span>
                  <span className="text-sm text-muted-foreground ml-1">people</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="space-y-4">
        <Card className="glass-effect border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Matches</p>
                <p className="text-2xl font-bold text-primary">{stats.activeMatches}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Events This Week</p>
                <p className="text-2xl font-bold text-accent">{stats.eventsThisWeek}</p>
              </div>
              <Calendar className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-secondary">{stats.matchSuccessRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggest Team Activity */}
      <Card className="glass-effect border-white/20 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-primary" />
            Suggested Team Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg bg-primary/10 border border-primary/30 cursor-pointer"
            >
              <div className="text-center">
                <Coffee className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h4 className="font-medium mb-1">Team Coffee Break</h4>
                <p className="text-sm text-muted-foreground mb-3">Wednesday 3:00 PM</p>
                <Button size="sm" className="bg-primary text-text-dark hover:bg-primary/90">
                  Schedule
                </Button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg bg-accent/10 border border-accent/30 cursor-pointer"
            >
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-accent" />
                <h4 className="font-medium mb-1">Team Lunch</h4>
                <p className="text-sm text-muted-foreground mb-3">Friday 12:30 PM</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-white"
                >
                  Schedule
                </Button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg bg-secondary/10 border border-secondary/30 cursor-pointer"
            >
              <div className="text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-secondary" />
                <h4 className="font-medium mb-1">Brainstorm Session</h4>
                <p className="text-sm text-muted-foreground mb-3">Thursday 2:00 PM</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                >
                  Schedule
                </Button>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderOfficeManagerView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Office Heatmap */}
      <Card className="glass-effect border-white/20 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary" />
            Office Space Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`h-12 rounded-lg flex items-center justify-center text-xs font-medium ${
                  Math.random() > 0.7
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : Math.random() > 0.4
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-accent/20 text-accent border border-accent/30"
                }`}
              >
                {Math.floor(Math.random() * 8) + 1}
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded"></div>
                <span>Low (1-3)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>Medium (4-6)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>High (7+)</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-primary text-primary">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resource Optimization */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle>Resource Optimization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Meeting Rooms</span>
              <Badge className="bg-accent text-white">85% utilized</Badge>
            </div>
            <Progress value={85} className="h-2" />
          </div>

          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Café Area</span>
              <Badge className="bg-primary text-text-dark">92% utilized</Badge>
            </div>
            <Progress value={92} className="h-2" />
          </div>

          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Quiet Zones</span>
              <Badge className="bg-secondary text-white">67% utilized</Badge>
            </div>
            <Progress value={67} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Report */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle>Weekly Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 className="text-lg font-semibold mb-2">Office Efficiency Score</h4>
            <div className="text-3xl font-bold text-primary mb-2">87%</div>
            <p className="text-sm text-muted-foreground">+5% from last week</p>
          </div>

          <Button className="w-full bg-primary text-text-dark hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Download Full Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderHRView = () => (
    <div className="space-y-6">
      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-effect border-white/20">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.totalEmployees}</p>
            <p className="text-sm text-muted-foreground">Total Employees</p>
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

      {/* Analytics & Recent Activity */}
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

      {/* Export Options */}
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-text-dark">
              <Download className="w-4 h-4 mr-2" />
              Attendance Report
            </Button>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Match Analytics
            </Button>
            <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
              <Download className="w-4 h-4 mr-2" />
              Emergency Contacts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
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

        {/* Dashboard Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {userRole === "manager" && renderManagerView()}
          {userRole === "office-manager" && renderOfficeManagerView()}
          {userRole === "hr" && renderHRView()}
        </motion.div>
      </div>
    </div>
  )
}
