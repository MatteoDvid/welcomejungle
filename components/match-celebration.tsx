"use client"

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MatchCelebrationProps {
  show: boolean;
  onComplete: () => void;
  matchedUser?: {
    name: string;
    avatar?: string;
  };
}

export function MatchCelebration({ show, onComplete, matchedUser }: MatchCelebrationProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (show) {
      // Lancer les confettis
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#ffc857', '#2a9d8f', '#3a506b'],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#ffc857', '#2a9d8f', '#3a506b'],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="bg-jungle-background/90 backdrop-blur-md border-2 border-jungle-accent rounded-3xl p-12 text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <Heart className="w-24 h-24 text-jungle-accent fill-jungle-accent" />
                <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400" />
                <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-yellow-400" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-jungle-accent mb-4"
            >
              {t.matches.matchFound}
            </motion.h2>

            {matchedUser && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-white/80"
              >
                {t.notifications.newMatch}
              </motion.p>
            )}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="mt-6"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-jungle-accent/20 rounded-full">
                <span className="text-jungle-accent animate-pulse">✨</span>
                <span className="text-jungle-accent font-medium">
                  {matchedUser?.name || "Someone special"}
                </span>
                <span className="text-jungle-accent animate-pulse">✨</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 