"use client"

import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (lang: 'en' | 'fr') => {
    console.log(`🚀 CHANGING LANGUAGE TO: ${lang}`);
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative z-50">
      <motion.button
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/95 hover:bg-white border border-gray-200 shadow-sm transition-all font-body"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-4 h-4 text-jungle-yellow" />
        <span className="text-sm font-medium text-jungle-gray">
          {language === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
        </span>
        <ChevronDown className={`w-3 h-3 text-jungle-gray transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-1 z-[100] min-w-[140px]"
          >
            <motion.button
              onClick={() => handleLanguageChange('en')}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all w-full text-left font-body ${
                language === 'en' 
                  ? 'bg-jungle-yellow/20 text-jungle-gray border border-jungle-yellow/30' 
                  : 'hover:bg-gray-50 text-jungle-gray'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">🇬🇧</span>
              <span className="text-sm font-medium">English</span>
            </motion.button>
            <motion.button
              onClick={() => handleLanguageChange('fr')}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all w-full text-left font-body ${
                language === 'fr' 
                  ? 'bg-jungle-yellow/20 text-jungle-gray border border-jungle-yellow/30' 
                  : 'hover:bg-gray-50 text-jungle-gray'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg">🇫🇷</span>
              <span className="text-sm font-medium">Français</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 