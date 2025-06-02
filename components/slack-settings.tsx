"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Slack, Bell, MessageSquare, Send, Check, Settings } from "lucide-react"

interface NotificationSettings {
  dailyReminders: boolean
  matchNotifications: boolean
  eventReminders: boolean
  weeklyDigest: boolean
  reminderTime: string
}

export function SlackSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    dailyReminders: true,
    matchNotifications: true,
    eventReminders: true,
    weeklyDigest: false,
    reminderTime: "09:00",
  })
  const [isConnected, setIsConnected] = useState(true)
  const [testMessageSent, setTestMessageSent] = useState(false)
  const [customMessage, setCustomMessage] = useState(
    "🎉 Great news! You have a new match for coffee with Sarah and Mike at 3:00 PM today in the Café Corner!",
  )

  const updateSetting = (key: keyof NotificationSettings, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const sendTestMessage = async () => {
    setTestMessageSent(true)
    // Simulate Slack API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Test Slack message sent:", customMessage)

    setTimeout(() => {
      setTestMessageSent(false)
    }, 3000)
  }

  const connectSlack = () => {
    // Simulate Slack OAuth flow
    setIsConnected(true)
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Slack Integration ⚡</h1>
          <p className="text-muted-foreground">Stay connected with your office matches and reminders</p>
        </motion.div>

        {/* Connection Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Slack className="w-6 h-6 mr-2 text-primary" />
                  Slack Connection
                </div>
                <Badge
                  variant={isConnected ? "default" : "destructive"}
                  className={isConnected ? "bg-accent text-white" : ""}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Connected to Slack</p>
                      <p className="text-sm text-muted-foreground">
                        Notifications will be sent to #office-pulse-matches
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/20">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Slack className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Connect your Slack workspace</h3>
                  <p className="text-muted-foreground mb-4">
                    Get notified about matches, reminders, and office updates directly in Slack
                  </p>
                  <Button onClick={connectSlack} className="bg-primary text-text-dark hover:bg-primary/90 glow-effect">
                    <Slack className="w-4 h-4 mr-2" />
                    Connect to Slack
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        {isConnected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-effect border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-primary" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <Label className="text-base font-medium">Daily Presence Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminded to update your office presence</p>
                      </div>
                      <Switch
                        checked={settings.dailyReminders}
                        onCheckedChange={(checked) => updateSetting("dailyReminders", checked)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <Label className="text-base font-medium">Match Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get notified when you have new matches</p>
                      </div>
                      <Switch
                        checked={settings.matchNotifications}
                        onCheckedChange={(checked) => updateSetting("matchNotifications", checked)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <Label className="text-base font-medium">Event Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminded about upcoming events and meetups</p>
                      </div>
                      <Switch
                        checked={settings.eventReminders}
                        onCheckedChange={(checked) => updateSetting("eventReminders", checked)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <Label className="text-base font-medium">Weekly Digest</Label>
                        <p className="text-sm text-muted-foreground">
                          Weekly summary of your connections and activities
                        </p>
                      </div>
                      <Switch
                        checked={settings.weeklyDigest}
                        onCheckedChange={(checked) => updateSetting("weeklyDigest", checked)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Test Message */}
        {isConnected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass-effect border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                  Test Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="test-message" className="text-base font-medium">
                    Preview Message
                  </Label>
                  <Textarea
                    id="test-message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="mt-2 min-h-[100px] bg-white/5 border-white/20"
                    placeholder="Customize your test message..."
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <div>
                    <p className="font-medium text-primary">Send Test Notification</p>
                    <p className="text-sm text-muted-foreground">
                      This will send a test message to your Slack to verify the integration
                    </p>
                  </div>
                  <Button
                    onClick={sendTestMessage}
                    disabled={testMessageSent}
                    className="bg-primary text-text-dark hover:bg-primary/90 glow-effect"
                  >
                    {testMessageSent ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Sent!
                      </motion.div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Test
                      </>
                    )}
                  </Button>
                </div>

                {testMessageSent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-lg bg-accent/10 border border-accent/30"
                  >
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-accent mr-2" />
                      <span className="text-accent font-medium">Test message sent successfully!</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Check your Slack workspace for the notification
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
