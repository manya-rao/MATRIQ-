import React, { useState } from 'react';
import { RecoveryProvider, useRecovery } from './context/RecoveryContext';
import { Header } from './components/Navigation/Header';
import { TabBar } from './components/Navigation/TabBar';
import { RecoveryCanvas3D } from './components/Recovery3D/RecoveryCanvas3D';
import { ZoneSymptomLogger } from './components/Recovery3D/ZoneSymptomLogger';
import { RecoveryCharts } from './components/Analytics/RecoveryCharts';
import { EPDSScreening } from './components/EPDS/EPDSScreening';
import { RecoveryJournal } from './components/EPDS/RecoveryJournal';
import { SBARReportModal } from './components/Clinical/SBARReportModal';
import { VillageConnect } from './components/Village/VillageConnect';
import { SafeSpaceModal } from './components/Emergency/SafeSpaceModal';
import { RedFlagBanner } from './components/Emergency/RedFlagBanner';
import { AICareNavigator } from './components/AI/AICareNavigator';
import {
  Sparkles,
  Bot,
  Heart,
  ShieldCheck,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, patient, todayMetric, highContrast } = useRecovery();
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [mentalHealthSubTab, setMentalHealthSubTab] = useState<'epds' | 'journal'>('epds');

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        highContrast ? 'bg-cream-200 text-black' : 'bg-cream-100 text-slate-800'
      }`}
    >
      {/* Sticky Top Navigation */}
      <Header onOpenAI={() => setIsAIOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Persistent Emergency Override Banner (if active) */}
        <RedFlagBanner />

        {/* Global Module Navigation TabBar */}
        <TabBar />

        {/* Tab 1: 3D Recovery Zone Map Viewport */}
        {activeTab === '3d-map' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Helper Intro Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-sage-200/80 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-sage-100 text-sage-800 rounded-2xl">
                  <Layers className="w-4 h-4 text-sage-700" />
                </span>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                    Interactive 3D Anatomical Recovery Zone Map
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Day {patient.daysPostpartum} Postpartum • Cesarean Wound & Pelvic Healing Monitor
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-cream-100 px-3 py-1.5 rounded-2xl border border-sage-200">
                <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Tap any glowing hotspot to focus camera & open clinical logger</span>
              </div>
            </div>

            {/* Main Split Grid: 3D Torso Viewport + Zone Logger */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 h-full">
                <RecoveryCanvas3D />
              </div>
              <div className="lg:col-span-5 h-full">
                <ZoneSymptomLogger />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 14-Day Recovery Trend Analytics */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <RecoveryCharts />
          </div>
        )}

        {/* Tab 3: EPDS Mental Health & Encrypted Journal */}
        {activeTab === 'epds' && (
          <div className="space-y-6 animate-fade-in">
            {/* Sub-tab Switcher between EPDS Quiz & Journal */}
            <div className="flex items-center justify-center">
              <div className="bg-cream-200/90 p-1.5 rounded-2xl border border-sage-200 flex items-center gap-2">
                <button
                  onClick={() => setMentalHealthSubTab('epds')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    mentalHealthSubTab === 'epds'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EPDS Clinical Screening (10 Questions)
                </button>
                <button
                  onClick={() => setMentalHealthSubTab('journal')}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    mentalHealthSubTab === 'journal'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Private Encrypted Journal
                </button>
              </div>
            </div>

            {mentalHealthSubTab === 'epds' ? <EPDSScreening /> : <RecoveryJournal />}
          </div>
        )}

        {/* Tab 4: SBAR Clinical Doctor Briefing */}
        {activeTab === 'sbar' && (
          <div className="animate-fade-in">
            <SBARReportModal />
          </div>
        )}

        {/* Tab 5: Village Connect Support Network */}
        {activeTab === 'village' && (
          <div className="animate-fade-in">
            <VillageConnect />
          </div>
        )}
      </main>

      {/* Floating AI Navigator Drawer */}
      <AICareNavigator isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      {/* Deterministic SafeSpace Emergency Modal (Opens when triggered) */}
      <SafeSpaceModal />

      {/* Floating AI Trigger Button (Bottom Right) */}
      {!isAIOpen && (
        <button
          onClick={() => setIsAIOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-sage-600 to-slate-900 hover:from-sage-700 hover:to-black text-white shadow-glow-sage hover:scale-105 transition-all flex items-center gap-2.5 font-bold text-xs sm:text-sm border border-white/20 no-print"
          title="Open Multilingual AI Care Navigator"
        >
          <Bot className="w-5 h-5 text-terracotta-300 animate-pulse" />
          <span className="hidden sm:inline">Ask AI Care Navigator</span>
        </button>
      )}

      {/* Footer */}
      <footer className="mt-16 bg-cream-200/60 border-t border-sage-200/80 py-8 px-4 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <div className="w-6 h-6 rounded-lg bg-sage-600 text-white flex items-center justify-center font-bold text-xs">
              M
            </div>
            <span className="font-bold text-slate-800">MATRIQ</span>
            <span>— Intelligent Postpartum Recovery Companion</span>
          </div>

          <p className="max-w-xl text-[11px] leading-relaxed text-slate-400">
            <strong>Clinical Notice:</strong> MATRIQ conforms with ACOG Fourth-Trimester guidelines and Edinburgh Postnatal Depression Scale clinical standards. Not a substitute for emergent obstetric evaluation. In acute distress, dial 112 / 911.
          </p>

          <div className="text-[11px] font-semibold text-slate-600">
            Hackathon Competition Prototype 2026
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <RecoveryProvider>
      <AppContent />
    </RecoveryProvider>
  );
};

export default App;
