"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Charger la langue sauvegardée
    try {
      const savedLang = localStorage.getItem('language') as Language;
      if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
        setLanguageState(savedLang);
      }
    } catch (error) {
      console.log('Error loading language from localStorage');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    console.log('🔄 LANGUAGE CHANGE FROM:', language, 'TO:', lang);
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
      console.log('✅ Language saved to localStorage:', lang);
    } catch (error) {
      console.log('❌ Error saving language to localStorage:', error);
    }
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
    toggleLanguage: () => {
      const newLanguage = language === 'en' ? 'fr' : 'en'
      console.log('🚀 TOGGLE LANGUAGE:', language, '->', newLanguage);
      setLanguage(newLanguage)
    },
  };

  if (!mounted) {
    return <div className="min-h-screen jungle-gradient-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-jungle-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-jungle-gray font-body">Loading...</p>
      </div>
    </div>;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 