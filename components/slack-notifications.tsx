"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Slack, Bell, MessageSquare, Send, Check, Settings, Zap } from "lucide-react"
import { SlackService } from "@/lib/slack"

interface NotificationSettings {
  dailyReminders: boolean
  matchNotifications: boolean
  eventReminders: boolean
  weeklyDigest: boolean
  reminderTime: string
}

export function SlackNotifications() {
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
  const [isSending, setIsSending] = useState(false)

  const updateSetting = (key: keyof NotificationSettings, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const sendTestMessage = async () => {
    setIsSending(true)
    try {
      await SlackService.sendTestMessage("current-user", customMessage)
      setTestMessageSent(true)
      setTimeout(() => {
        setTestMessageSent(false)
      }, 3000)
    } catch (error) {
      console.error("Failed to send test message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const connectSlack = () => {
    // Simulate Slack OAuth flow
    setIsConnected(true)
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-jungle-background">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-jungle-accent/5 via-transparent to-black/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-jungle-accent mb-2">Slack Integration ⚡</h1>
          <p className="text-jungle-textLight/70">Stay connected with your office matches and reminders</p>
        </motion.div>

        {/* Connection Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Slack className="w-6 h-6 mr-2 text-jungle-accent" />
                  Slack Connection
                </div>
                <Badge
                  variant={isConnected ? "default" : "destructive"}
                  className={isConnected ? "bg-black text-white" : ""}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-black/10 border border-black/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-jungle-textLight">Connected to Slack</p>
                      <p className="text-sm text-jungle-textLight/70">
                        Notifications will be sent to #office-pulse-matches
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-jungle-textLight hover:bg-white/10"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </motion.div>
              ) : (
                <div className="text-center py-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Slack className="w-16 h-16 mx-auto mb-4 text-jungle-textLight/50" />
                  </motion.div>
                  <h3 className="text-lg font-medium mb-2 text-jungle-textLight">Connect your Slack workspace</h3>
                  <p className="text-jungle-textLight/70 mb-4">
                    Get notified about matches, reminders, and office updates directly in Slack
                  </p>
                  <Button
                    onClick={connectSlack}
                    className="bg-jungle-accent text-jungle-textDark hover:bg-jungle-accent/90 glow-effect"
                  >
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
                  <Bell className="w-5 h-5 mr-2 text-jungle-accent" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="space-y-1">
                        <Label className="text-base font-medium text-jungle-textLight">Daily Presence Reminders</Label>
                        <p className="text-sm text-jungle-textLight/70">Get reminded to update your office presence</p>
                      </div>
                      <Switch
                        checked={settings.dailyReminders}
                        onCheckedChange={(checked) => updateSetting("dailyReminders", checked)}
                        className="data-[state=checked]:bg-jungle-accent"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="space-y-1">
                        <Label className="text-base font-medium text-jungle-textLight">Match Notifications</Label>
                        <p className="text-sm text-jungle-textLight/70">Get notified when you have new matches</p>
                      </div>
                      <Switch
                        checked={settings.matchNotifications}
                        onCheckedChange={(checked) => updateSetting("matchNotifications", checked)}
                        className="data-[state=checked]:bg-jungle-accent"
                      />
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="space-y-1">
                        <Label className="text-base font-medium text-jungle-textLight">Event Reminders</Label>
                        <p className="text-sm text-jungle-textLight/70">
                          Get reminded about upcoming events and meetups
                        </p>
                      </div>
                      <Switch
                        checked={settings.eventReminders}
                        onCheckedChange={(checked) => updateSetting("eventReminders", checked)}
                        className="data-[state=checked]:bg-jungle-accent"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="space-y-1">
                        <Label className="text-base font-medium text-jungle-textLight">Weekly Digest</Label>
                        <p className="text-sm text-jungle-textLight/70">
                          Weekly summary of your connections and activities
                        </p>
                      </div>
                      <Switch
                        checked={settings.weeklyDigest}
                        onCheckedChange={(checked) => updateSetting("weeklyDigest", checked)}
                        className="data-[state=checked]:bg-jungle-accent"
                      />
                    </motion.div>
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
                  <MessageSquare className="w-5 h-5 mr-2 text-jungle-accent" />
                  Test Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="test-message" className="text-base font-medium text-jungle-textLight">
                    Preview Message
                  </Label>
                  <Textarea
                    id="test-message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="mt-2 min-h-[100px] bg-white/5 border-white/20 text-jungle-textLight placeholder:text-jungle-textLight/50"
                    placeholder="Customize your test message..."
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-jungle-accent/10 border border-jungle-accent/30"
                >
                  <div>
                    <p className="font-medium text-jungle-accent">Send Test Notification</p>
                    <p className="text-sm text-jungle-textLight/70">
                      This will send a test message to your Slack to verify the integration
                    </p>
                  </div>
                  <Button
                    onClick={sendTestMessage}
                    disabled={testMessageSent || isSending}
                    className="bg-jungle-accent text-jungle-textDark hover:bg-jungle-accent/90 glow-effect"
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
                    ) : isSending ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="flex items-center"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Sending...
                      </motion.div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Test
                      </>
                    )}
                  </Button>
                </motion.div>

                {testMessageSent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-lg bg-gray-100 border border-gray-300"
                  >
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-black mr-2" />
                      <span className="text-black font-medium">Test message sent successfully!</span>
                    </div>
                    <p className="text-sm text-jungle-textLight/70 mt-1">
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
