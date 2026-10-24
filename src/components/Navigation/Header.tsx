import React from 'react';
import { useRecovery } from '../../context/RecoveryContext';
import { SupportedLanguage } from '../../types';
import {
  AlertOctagon,
  Volume2,
  VolumeX,
  Languages,
  RotateCcw,
  Sparkles,
  Bot,
  Heart,
  ShieldAlert,
  Sun,
  Eye
} from 'lucide-react';

export const Header: React.FC<{ onOpenAI: () => void }> = ({ onOpenAI }) => {
  const {
    patient,
    triggerEmergencyOverride,
    emergencyStatus,
    language,
    setLanguage,
    soundEnabled,
    toggleSound,
    resetToDemoProfile,
    highContrast,
    toggleHighContrast
  } = useRecovery();

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-sage-200/80 px-4 sm:px-8 py-3.5 no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 flex items-center justify-center text-white shadow-soft font-black text-xl tracking-tighter">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                MATRIQ
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream-300/80 text-sage-900 border border-sage-300">
                Postpartum Companion
              </span>
            </div>
            <p className="text-[11px] text-terracotta-600 font-medium tracking-normal hidden sm:block">
              Recovery deserves care, too.
            </p>
          </div>
        </div>

        {/* Center: Postpartum Patient Badge */}
        <div className="hidden lg:flex items-center gap-2.5 bg-white/80 border border-sage-200/90 px-3.5 py-1.5 rounded-2xl shadow-2xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-xs">
            <span className="font-bold text-slate-900">{patient.name}</span>
            <span className="text-slate-400 mx-1.5">•</span>
            <span className="font-semibold text-terracotta-600">
              Day {patient.daysPostpartum} ({patient.deliveryType})
            </span>
          </div>
        </div>

        {/* Right Actions: SOS Trigger, Audio, Language, AI Navigator */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Demo Reset for Judges */}
          <button
            onClick={resetToDemoProfile}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white border border-sage-200 transition-all shadow-2xs"
            title="Reset to Day 12 C-Section baseline demo profile"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sage-600" />
            <span>Reset Demo</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl text-xs border transition-all ${
              soundEnabled
                ? 'bg-white text-sage-700 border-sage-200 hover:bg-sage-50'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={soundEnabled ? 'Acoustic alerts enabled' : 'Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Multilingual Selector */}
          <div className="hidden sm:flex items-center bg-white/80 border border-sage-200 rounded-xl p-0.5 text-xs">
            {(['en', 'hi', 'kn', 'es'] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] uppercase transition-all ${
                  language === lang
                    ? 'bg-sage-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* AI Care Navigator Trigger Button */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-sage-600 to-slate-800 text-white text-xs font-bold shadow-soft hover:shadow-glow-sage transition-all"
          >
            <Bot className="w-4 h-4 text-terracotta-300" />
            <span className="hidden sm:inline">AI Navigator</span>
          </button>

          {/* High-Visibility Deterministic RED FLAG SOS Trigger */}
          <button
            onClick={() => triggerEmergencyOverride()}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl bg-emergency-base hover:bg-emergency-dark text-white text-xs sm:text-sm font-black tracking-wide shadow-glow-emergency animate-pulse-emergency transition-all border-2 border-red-400 shrink-0"
            title="Immediate Red Flag SOS Overrule — Bypasses LLM"
          >
            <AlertOctagon className="w-4 h-4 text-white" />
            <span>RED FLAG SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
