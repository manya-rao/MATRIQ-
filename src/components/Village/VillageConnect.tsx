import React, { useState } from 'react';
import { useRecovery } from '../../context/RecoveryContext';
import { VillageBroadcast } from '../../types';
import {
  Users,
  Utensils,
  Moon,
  Heart,
  Sparkles,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  MessageCircle,
  Share2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const QUICK_BROADCAST_TEMPLATES: {
  category: VillageBroadcast['category'];
  title: string;
  defaultMsg: string;
  icon: any;
  color: string;
  btnStyle: string;
}[] = [
  {
    category: 'sleep',
    title: 'Need 2 Hours Uninterrupted Sleep',
    defaultMsg: 'Aarav is fed & swaddled. Can someone cover watch from 2:00 PM to 4:00 PM so I can sleep deeply without baby monitor alert anxiety?',
    icon: Moon,
    color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    btnStyle: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
  },
  {
    category: 'meal',
    title: 'Need Warm Nourishing Meal',
    defaultMsg: 'Would love a bowl of warm lentil soup, rice, or light lactation-friendly meal dropped off at the door.',
    icon: Utensils,
    color: 'bg-amber-50 border-amber-200 text-amber-900',
    btnStyle: 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
  },
  {
    category: 'emotional',
    title: 'Need Gentle Emotional Check-in',
    defaultMsg: 'Feeling a little overwhelmed by fourth-trimester fatigue. Just need a cup of tea, a quiet listening ear, and a calming hug.',
    icon: Heart,
    color: 'bg-rose-50 border-rose-200 text-rose-900',
    btnStyle: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
  },
  {
    category: 'milestone',
    title: 'Feeling Great Today / Milestone!',
    defaultMsg: 'Day 12 today! Feeling my physical strength returning, walked in the garden, and baby Aarav slept peacefully!',
    icon: Sparkles,
    color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    btnStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
  }
];

export const VillageConnect: React.FC = () => {
  const { broadcasts, sendVillageBroadcast, caregivers, patient } = useRecovery();

  const [activeTemplate, setActiveTemplate] = useState<typeof QUICK_BROADCAST_TEMPLATES[0] | null>(null);
  const [customMsg, setCustomMsg] = useState<string>('');
  const [toastSent, setToastSent] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleSelectTemplate = (t: typeof QUICK_BROADCAST_TEMPLATES[0]) => {
    setActiveTemplate(t);
    setCustomMsg(t.defaultMsg);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTemplate) return;

    sendVillageBroadcast(activeTemplate.category, activeTemplate.title, customMsg);

    if (activeTemplate.category === 'milestone') {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }

    setToastSent(true);
    setActiveTemplate(null);
    setCustomMsg('');

    setTimeout(() => {
      setToastSent(false);
    }, 4000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText(window.location.origin + '/village/priya-sharma-day12');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Village Banner */}
      <div className="bg-gradient-to-r from-terracotta-600 via-terracotta-700 to-rose-700 text-white rounded-3xl p-6 sm:p-7 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 bg-white/20 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-terracotta-200">
                It Takes a Village
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Village Connect — Caregiver Support Hub
            </h2>
            <p className="text-xs sm:text-sm text-terracotta-100 max-w-xl mt-1 leading-relaxed">
              Never hesitate to ask for micro-help. Broadcast specific, guilt-free care requests directly to your trusted circle of partners, family, and doulas in 1-tap.
            </p>
          </div>

          <button
            onClick={handleCopyShareLink}
            className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Share2 className="w-4 h-4" />
            {copiedLink ? 'Share Link Copied!' : 'Share Village Link'}
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {toastSent && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-900 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          Broadcast SMS & simulated push notification dispatched to Arjun Sharma & Sunita Sharma!
        </div>
      )}

      {/* 1-Tap Quick Action Broadcast Cards */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-sage-200/80 shadow-card space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">1-Tap Caregiver Micro-Broadcasts</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a care prompt to immediately notify your designated caregivers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_BROADCAST_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            const isSelected = activeTemplate?.category === tmpl.category;
            return (
              <div
                key={tmpl.category}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? `${tmpl.color} ring-2 ring-terracotta-500 shadow-md scale-102`
                    : 'bg-cream-50/60 hover:bg-cream-100 border-slate-200'
                }`}
              >
                <div>
                  <div className="p-2.5 rounded-xl bg-white shadow-sm inline-block mb-3">
                    <Icon className="w-5 h-5 text-slate-800" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{tmpl.title}</h4>
                </div>
                <span className="text-[10px] font-bold text-terracotta-600 mt-3 flex items-center gap-1">
                  1-Tap Send ➔
                </span>
              </div>
            );
          })}
        </div>

        {/* Custom Message Drawer if Template Selected */}
        {activeTemplate && (
          <form
            onSubmit={handleBroadcast}
            className="mt-4 p-5 rounded-2xl bg-cream-50 border-2 border-terracotta-300 animate-fade-in space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <activeTemplate.icon className="w-4 h-4 text-terracotta-600" />
                Customize Request: {activeTemplate.title}
              </span>
              <button
                type="button"
                onClick={() => setActiveTemplate(null)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>

            <textarea
              rows={3}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-white resize-none"
              required
            />

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTemplate.btnStyle}`}
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Broadcast to Support Circle
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Grid: Caregiver Circle & Live Village Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Caregiver Network List */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-sage-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sage-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-sage-600" />
              Designated Village Circle
            </h3>
            <span className="text-xs font-bold text-sage-700 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-200">
              {caregivers.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {caregivers.map((cg) => (
              <div
                key={cg.id}
                className="p-3.5 rounded-2xl bg-cream-50/70 border border-slate-200 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>{cg.name}</span>
                    {cg.isPrimarySOS && (
                      <span className="text-[10px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.2 rounded-full border border-red-200">
                        Primary SOS
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">{cg.relationship}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${cg.phone}`}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                    title={`Call ${cg.name}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`mailto:${cg.email}`}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                    title={`Email ${cg.name}`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Broadcast Feed */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-sage-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sage-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-terracotta-600" />
              Live Village Activity & Responses
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">Real-time sync</span>
          </div>

          <div className="space-y-3.5">
            {broadcasts.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-cream-50/60 border border-sage-200/70 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{b.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        b.status === 'acknowledged'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {b.sentAt}
                  </span>
                </div>

                <p className="text-slate-700 font-medium leading-relaxed">{b.message}</p>

                {b.responses && b.responses.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                    {b.responses.map((resp, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-start gap-2"
                      >
                        <Heart className="w-3.5 h-3.5 text-terracotta-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900 mr-1.5">{resp.responder}:</span>
                          <span className="text-slate-700">{resp.message}</span>
                          <span className="text-[10px] text-slate-400 ml-2 font-normal">{resp.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
