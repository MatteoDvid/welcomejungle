"use client"

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
        onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
      >
        <Globe className="w-5 h-5 text-jungle-accent" />
        <span className="text-sm font-medium uppercase">{language}</span>
      </button>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-full right-0 mt-1 bg-jungle-background/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg p-1 hidden group-hover:block"
      >
        <button
          onClick={() => setLanguage('en')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors w-full ${
            language === 'en' ? 'bg-jungle-accent/20 text-jungle-accent' : 'hover:bg-white/10'
          }`}
        >
          <span className="text-2xl">🇬🇧</span>
          <span>English</span>
        </button>
        <button
          onClick={() => setLanguage('fr')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors w-full ${
            language === 'fr' ? 'bg-jungle-accent/20 text-jungle-accent' : 'hover:bg-white/10'
          }`}
        >
          <span className="text-2xl">🇫🇷</span>
          <span>Français</span>
        </button>
      </motion.div>
    </div>
  );
} 