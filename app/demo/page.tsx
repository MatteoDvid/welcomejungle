"use client"

import { useState } from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { LanguageSelector } from '@/components/language-selector'
import { MatchCelebration } from '@/components/match-celebration'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Users, Globe, Sparkles } from 'lucide-react'

export default function DemoPage() {
  const [showCelebration, setShowCelebration] = useState(false)

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-jungle-background p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header avec sélecteur de langue */}
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-jungle-accent">
              Démonstration des nouvelles fonctionnalités
            </h1>
            <LanguageSelector />
          </div>

          {/* Test de l'animation de match */}
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-jungle-accent flex items-center gap-2">
                <Heart className="w-6 h-6" />
                Animation de Match
              </CardTitle>
              <CardDescription className="text-jungle-textLight/70">
                Cliquez pour voir l&apos;animation qui apparaît lors d&apos;un match
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowCelebration(true)}
                className="bg-jungle-accent text-jungle-textDark hover:bg-jungle-accent/90"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                                 Déclencher l&apos;animation de match
              </Button>
            </CardContent>
          </Card>

          {/* Info sur les rôles */}
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-black flex items-center gap-2">
                <Users className="w-6 h-6" />
                Rôles avec profils
              </CardTitle>
              <CardDescription className="text-jungle-textLight/70">
                Tous les rôles peuvent maintenant créer des profils
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="font-semibold text-jungle-accent mb-2">✅ Employés</h3>
                  <p className="text-sm text-jungle-textLight/70">Profil + Matches</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="font-semibold text-black mb-2">✅ Managers</h3>
                  <p className="text-sm text-jungle-textLight/70">Profil + Admin</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="font-semibold text-jungle-blue mb-2">✅ RH</h3>
                  <p className="text-sm text-jungle-textLight/70">Profil + Admin</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="font-semibold text-jungle-accent mb-2">✅ Office Manager</h3>
                  <p className="text-sm text-jungle-textLight/70">Profil + Admin</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info sur les langues */}
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-jungle-blue flex items-center gap-2">
                <Globe className="w-6 h-6" />
                Support multilingue
              </CardTitle>
              <CardDescription className="text-jungle-textLight/70">
                                 L&apos;application supporte maintenant le français et l&apos;anglais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-jungle-textLight/70">
                  🇬🇧 English - Interface complète en anglais
                </p>
                <p className="text-sm text-jungle-textLight/70">
                  🇫🇷 Français - Interface complète en français
                </p>
                <p className="text-sm text-jungle-textLight/60 mt-4">
                  Utilisez le sélecteur de langue en haut à droite pour changer de langue.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Composant d'animation de match */}
        <MatchCelebration
          show={showCelebration}
          onComplete={() => setShowCelebration(false)}
          matchedUser={{ name: "Sarah Chen" }}
        />
      </div>
    </LanguageProvider>
  )
} 