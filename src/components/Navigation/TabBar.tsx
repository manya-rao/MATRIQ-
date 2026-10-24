import React from 'react';
import { useRecovery } from '../../context/RecoveryContext';
import {
  Layers,
  TrendingUp,
  Brain,
  FileText,
  Users,
  Sparkles
} from 'lucide-react';

export const TabBar: React.FC = () => {
  const { activeTab, setActiveTab } = useRecovery();

  const tabs = [
    { id: '3d-map', label: '3D Recovery Zone Map', icon: Layers, badge: 'Interactive' },
    { id: 'analytics', label: '14-Day Recovery Trends', icon: TrendingUp, badge: 'Clinical' },
    { id: 'epds', label: 'EPDS Screening & Journal', icon: Brain, badge: 'Mental Health' },
    { id: 'sbar', label: 'SBAR Doctor Briefing', icon: FileText, badge: '1-Click Export' },
    { id: 'village', label: 'Village Connect', icon: Users, badge: 'Care Circle' },
  ] as const;

  return (
    <div className="w-full bg-cream-200/80 p-1.5 rounded-3xl border border-sage-200/90 shadow-2xs no-print">
      <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[150px] py-2.5 px-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm border border-sage-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-sage-600' : 'text-slate-400'
                }`}
              />
              <span>{tab.label}</span>
              {isActive && (
                <span className="hidden xl:inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-sage-100 text-sage-800">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
