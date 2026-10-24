import React, { useState } from 'react';
import { useRecovery } from '../../context/RecoveryContext';
import { MoodType, JournalEntry } from '../../types';
import {
  BookOpen,
  Lock,
  Plus,
  Smile,
  Sparkles,
  Tag,
  Calendar,
  Moon,
  Activity,
  CheckCircle2,
  Heart
} from 'lucide-react';

const MOOD_OPTIONS: { type: MoodType; label: string; icon: string; color: string }[] = [
  { type: 'peaceful', label: 'Peaceful', icon: '🕊️', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { type: 'grateful', label: 'Grateful', icon: '🙏', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { type: 'hopeful', label: 'Hopeful', icon: '🌱', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { type: 'healing', label: 'Healing', icon: '🌸', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { type: 'exhausted', label: 'Exhausted', icon: '😴', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { type: 'anxious', label: 'Anxious', icon: '🌧️', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  { type: 'overwhelmed', label: 'Overwhelmed', icon: '🌊', color: 'bg-purple-100 text-purple-800 border-purple-300' },
];

export const RecoveryJournal: React.FC = () => {
  const { journalEntries, addJournalEntry, todayMetric, patient } = useRecovery();

  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [mood, setMood] = useState<MoodType>('peaceful');
  const [tagInput, setTagInput] = useState<string>('Fourth Trimester, Recovery');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);

    addJournalEntry({
      date: `October 24, 2026 (Day ${patient.daysPostpartum})`,
      mood,
      title,
      content,
      tags,
      painLevel: todayMetric.painIndex,
      sleepHours: todayMetric.sleepHours,
      isPrivateEncrypted: true
    });

    setTitle('');
    setContent('');
    setTagInput('Recovery');
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-terracotta-500" />
            Private Encrypted Fourth-Trimester Journal
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Safe, non-judgmental space to unpack emotions, maternal reflections, and healing milestones.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="px-4 py-2.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold transition-all shadow-glow-terracotta flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {isAddingNew ? 'Cancel Entry' : 'Write Today’s Reflection'}
        </button>
      </div>

      {/* New Entry Form */}
      {isAddingNew && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-md rounded-3xl p-6 border-2 border-terracotta-200 shadow-card animate-fade-in space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-cream-200">
            <span className="text-xs font-bold text-terracotta-700 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> End-to-End Client Encrypted
            </span>
            <span className="text-xs text-slate-400">Day {patient.daysPostpartum}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              How are you feeling right now?
            </label>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setMood(m.type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    mood === m.type
                      ? `${m.color} ring-2 ring-sage-400 shadow-sm scale-105`
                      : 'bg-cream-50 text-slate-600 border-slate-200 hover:bg-cream-100'
                  }`}
                >
                  <span>{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Entry Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. A peaceful morning with baby Aarav..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-cream-50 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Thoughts & Reflections:
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Express what feels real right now — triumphs, tears, tender moments..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-terracotta-400 bg-cream-50 resize-none font-normal leading-relaxed"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tags (comma separated):
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="C-Section, Baby Swaddle, Sleep, Gratitude"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-cream-50 text-slate-700"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-glow-terracotta transition-all"
            >
              Save Private Reflection
            </button>
          </div>
        </form>
      )}

      {/* Journal Entries List */}
      <div className="space-y-4">
        {journalEntries.map((entry) => {
          const moodMeta = MOOD_OPTIONS.find((m) => m.type === entry.mood) || MOOD_OPTIONS[0];

          return (
            <div
              key={entry.id}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-sage-200/80 shadow-card hover:shadow-soft transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${moodMeta.color}`}
                  >
                    <span>{moodMeta.icon}</span>
                    <span>{moodMeta.label}</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {entry.date}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-terracotta-500" /> Pain: {entry.painLevel}/10
                  </span>
                  <span className="flex items-center gap-1">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" /> Sleep: {entry.sleepHours}h
                  </span>
                  <span className="flex items-center gap-1 text-slate-400" title="Client-Side Encrypted">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">{entry.title}</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1 whitespace-pre-line font-medium">
                  {entry.content}
                </p>
              </div>

              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {entry.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cream-200 text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
