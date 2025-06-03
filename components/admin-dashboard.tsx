"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  AlertCircle,
  PlusCircle,
  List,
  Download,
  Smile,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Users,
  MessageSquare,
  Zap,
  CheckCircle,
  Award,
  Clock
} from "lucide-react"
import Chart from "chart.js/auto"
import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface AdminDashboardProps {
  userRole: "manager" | "office-manager" | "hr"
}

export function AdminDashboard({ userRole }: AdminDashboardProps) {
const renderHRView = () => (
  <div className="space-y-6">
    {/* Global Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="glass-effect border-white/20">
        <CardContent className="p-4 text-center">
          <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">156</p>
          <p className="text-sm text-primary">Total Employees</p>
        </CardContent>
      </Card>

      <Card className="glass-effect border-white/20">
        <CardContent className="p-4 text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold">78%</p>
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
          <p className="text-2xl font-bold">85%</p>
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
          <p className="text-3xl font-bold text-green-500">92%</p>
          <Progress value={92} className="h-2" />
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
          <p className="text-3xl font-bold text-yellow-500">68%</p>
          <Progress value={68} className="h-2" />
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

    {/* Fun HR Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
            Top Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { activity: "Coffee Chats", count: 18, growth: "+12%" },
            { activity: "Lunch Meetings", count: 15, growth: "+8%" },
            { activity: "Brainstorming", count: 12, growth: "+15%" },
            { activity: "Fitness Sessions", count: 9, growth: "+22%" },
          ].map((item, idx) => (
            <motion.div
              key={item.activity}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <div>
                <p className="font-medium">{item.activity}</p>
                <p className="text-sm text-muted-foreground">{item.count} matches</p>
              </div>
              <Badge className="bg-accent text-white">{item.growth}</Badge>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-effect border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { user: "Sarah Chen", action: "joined Coffee Chat", time: "2 min ago", type: "match" },
            { user: "Mike Johnson", action: "updated presence", time: "5 min ago", type: "presence" },
            { user: "Emma Wilson", action: "created Team Lunch", time: "12 min ago", type: "event" },
          ].map((activity, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10"
            >
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
        </CardContent>
      </Card>
    </div>
  </div>
)

  const RenderManagerView = () => {
    const chartRef = useRef<Chart | null>(null)

    useEffect(() => {
      const ctx = document.getElementById("skillRadarChart") as HTMLCanvasElement
      if (!ctx) return

      if (chartRef.current) {
        chartRef.current.destroy()
      }

      chartRef.current = new Chart(ctx, {
        type: "radar",
        data: {
          labels: ["Communication", "Technical", "Creativity", "Leadership", "Problem-solving"],
          datasets: [{
            label: "Team A Skills",
            data: [80, 70, 60, 75, 85],
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            borderColor: "rgba(34, 197, 94, 1)",
            pointBackgroundColor: "rgba(34, 197, 94, 1)",
          }]
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: { display: false },
              suggestedMin: 0,
              suggestedMax: 100,
            }
          }
        }
      })

      return () => {
        if (chartRef.current) {
          chartRef.current.destroy()
        }
      }
    }, [])

    return (
      <div className="space-y-6">
        {/* Alerts + Create + Export */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-effect border-white/20">
            <CardContent className="p-4 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500 animate-pulse" />
              <p className="text-xl font-bold text-red-500">New Project Alert!</p>
              <p className="text-sm text-muted-foreground">A new cross-team project is pending approval.</p>
              <Button variant="outline" className="mt-2">
                View Details
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/20">
            <CardContent className="p-4 text-center">
              <PlusCircle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-xl font-bold text-yellow-500">Create New Project</p>
              <p className="text-sm text-muted-foreground">Launch a new initiative with your team.</p>
              <Button className="bg-yellow-500 text-white hover:bg-yellow-600 mt-2">
                + New Project
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/20">
            <CardContent className="p-4 text-center">
              <List className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-xl font-bold text-blue-500">Present Employees</p>
              <p className="text-sm text-muted-foreground">Download today&apos;s attendance list.</p>
              <Button className="bg-blue-500 text-white hover:bg-blue-600 mt-2">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart */}
        <Card className="glass-effect border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
              Team Skill Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="relative" style={{ width: "100%", height: "400px" }}>
              <canvas id="skillRadarChart" />
            </div>
          </CardContent>
        </Card>

        {/* Fun Manager Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-effect border-white/20">
            <CardContent className="p-4 text-center">
              <Smile className="w-8 h-8 mx-auto mb-2 text-pink-500" />
              <p className="text-xl font-bold text-pink-500">Happiness Index</p>
              <p className="text-3xl font-bold">78%</p>
              <p className="text-sm text-muted-foreground">Overall team mood</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-xl font-bold text-purple-500">Project Health</p>
              <p className="text-sm text-muted-foreground">12 ongoing • 2 at risk • 1 delayed</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/20">
            <CardContent className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="text-xl font-bold text-orange-500">Learning Progress</p>
              <p className="text-3xl font-bold">65%</p>
              <p className="text-sm text-muted-foreground">Employees trained this month</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/20">
            <CardContent className="p-4 text-center">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <p className="text-xl font-bold text-yellow-400">Manager Tip</p>
              <p className="text-sm text-muted-foreground">
                &ldquo;Teams with high autonomy outperform by 25%.&rdquo;
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
          {userRole === "manager" && <RenderManagerView />}
          {userRole === "hr" && renderHRView()}
        </motion.div>
      </div>
    </div>
  )
}
