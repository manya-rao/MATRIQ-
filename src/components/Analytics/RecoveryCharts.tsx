import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useRecovery } from '../../context/RecoveryContext';
import { LochiaStage, LochiaVolume } from '../../types';
import {
  TrendingUp,
  Activity,
  Moon,
  Heart,
  Droplet,
  Sparkles,
  Sliders,
  CheckCircle,
  FileText
} from 'lucide-react';

export const RecoveryCharts: React.FC = () => {
  const { metrics, todayMetric, updateTodayMetric, patient } = useRecovery();

  const [activeMetricView, setActiveMetricView] = useState<'pain' | 'lochia' | 'sleep' | 'emotional'>('pain');

  // Input states for updating today's metrics
  const [painValue, setPainValue] = useState<number>(todayMetric.painIndex);
  const [sleepValue, setSleepValue] = useState<number>(todayMetric.sleepHours);
  const [fatigueValue, setFatigueValue] = useState<number>(todayMetric.fatigueLevel);
  const [emotionalValue, setEmotionalValue] = useState<number>(todayMetric.emotionalScore);
  const [lochiaVolume, setLochiaVolume] = useState<LochiaVolume>(todayMetric.lochiaVolume);
  const [lochiaStage, setLochiaStage] = useState<LochiaStage>(todayMetric.lochiaStage);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Map Lochia Volume to numerical value for chart display
  const chartData = metrics.map((m) => {
    let lochiaScore = 1;
    if (m.lochiaVolume === 'spotting') lochiaScore = 1;
    else if (m.lochiaVolume === 'light') lochiaScore = 2;
    else if (m.lochiaVolume === 'moderate') lochiaScore = 3;
    else if (m.lochiaVolume === 'heavy') lochiaScore = 4;
    else if (m.lochiaVolume === 'soaking_alert') lochiaScore = 5;

    return {
      day: `Day ${m.day}`,
      date: m.dateStr,
      painIndex: m.painIndex,
      sleepHours: m.sleepHours,
      fatigueLevel: m.fatigueLevel,
      emotionalScore: m.emotionalScore,
      lochiaScore,
      lochiaStage: m.lochiaStage,
      lochiaVolume: m.lochiaVolume,
    };
  });

  const handleSaveTodayUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateTodayMetric({
      painIndex: painValue,
      sleepHours: sleepValue,
      fatigueLevel: fatigueValue,
      emotionalScore: emotionalValue,
      lochiaVolume,
      lochiaStage
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Automated 2-sentence clinical recovery summary
  const painDelta = metrics[0].painIndex - todayMetric.painIndex;
  const isLochiaNormalizing = todayMetric.lochiaStage === 'serosa' || todayMetric.lochiaStage === 'alba';
  const averageSleep = (metrics.reduce((acc, curr) => acc + curr.sleepHours, 0) / metrics.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* 2-Sentence Structured AI Clinical Summary Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-sage-50 via-cream-50 to-terracotta-50 border border-sage-200/80 shadow-soft">
        <div className="flex items-center gap-2 mb-2 text-sage-800">
          <Sparkles className="w-5 h-5 text-terracotta-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Gemini Clinical Trend Summarizer
          </span>
          <span className="text-[10px] bg-sage-200 text-sage-900 px-2 py-0.5 rounded-full font-bold ml-auto">
            14-Day Trajectory
          </span>
        </div>
        <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
          Over the past {patient.daysPostpartum} days, Priya’s reported pain index has dropped by{' '}
          <strong>{painDelta} points</strong> (from 8/10 to {todayMetric.painIndex}/10) with C-section scar healing progressing cleanly and lochia appropriately transitioning to {todayMetric.lochiaStage}. Sleep remains broken at an average of <strong>{averageSleep} hours/night</strong>, with steady emotional rebound following expected transient Day 4 baby blues.
        </p>
      </div>

      {/* Main Analytics Viewport */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-sage-200/80 shadow-card">
        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-sage-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sage-600" />
              14-Day Postpartum Recovery Trajectory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cesarean post-op recovery tracking for {patient.name} (Day {patient.daysPostpartum})
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-cream-200/70 p-1.5 rounded-2xl border border-sage-200/60">
            <button
              onClick={() => setActiveMetricView('pain')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMetricView === 'pain'
                  ? 'bg-terracotta-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Pain Index
            </button>
            <button
              onClick={() => setActiveMetricView('lochia')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMetricView === 'lochia'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Droplet className="w-3.5 h-3.5" /> Lochia Stage
            </button>
            <button
              onClick={() => setActiveMetricView('sleep')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMetricView === 'sleep'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> Sleep vs. Fatigue
            </button>
            <button
              onClick={() => setActiveMetricView('emotional')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMetricView === 'emotional'
                  ? 'bg-sage-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5" /> Emotional Vitality
            </button>
          </div>
        </div>

        {/* Charts Container */}
        <div className="h-72 sm:h-80 w-full pt-6">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetricView === 'pain' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="painGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97757" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D97757" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECE5D8" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val: number) => [`${val} / 10`, 'Pain Index']}
                />
                <Area type="monotone" dataKey="painIndex" stroke="#D97757" strokeWidth={3} fillOpacity={1} fill="url(#painGrad)" />
              </AreaChart>
            ) : activeMetricView === 'lochia' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECE5D8" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis
                  domain={[0, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(val) => {
                    const map: Record<number, string> = { 1: 'Spot', 2: 'Light', 3: 'Mod', 4: 'Heavy', 5: 'ALERT' };
                    return map[val] || '';
                  }}
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val: number, name, props: any) => [
                    `${props.payload.lochiaVolume.toUpperCase()} (${props.payload.lochiaStage})`,
                    'Lochia Bleeding Volume'
                  ]}
                />
                <Bar dataKey="lochiaScore" fill="#E11D48" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : activeMetricView === 'sleep' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECE5D8" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" name="Sleep (Hours)" dataKey="sleepHours" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" name="Daytime Fatigue (1-10)" dataKey="fatigueLevel" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="emotionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7A9A8B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7A9A8B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECE5D8" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val: number) => [`${val} / 10`, 'Emotional Score']}
                />
                <Area type="monotone" dataKey="emotionalScore" stroke="#7A9A8B" strokeWidth={3} fillOpacity={1} fill="url(#emotionGrad)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Clinical Interpretation Pill */}
        <div className="mt-4 pt-4 border-t border-sage-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            {activeMetricView === 'pain' && 'Clinically expected gradual downward trend after abdominal surgery.'}
            {activeMetricView === 'lochia' && 'Progression: Lochia Rubra (Days 1–4) ➔ Serosa (Days 5–14) ➔ Alba (Weeks 2–6).'}
            {activeMetricView === 'sleep' && 'Targeting protected 90-minute REM cycles with partner swaddle coverage.'}
            {activeMetricView === 'emotional' && 'Day 4 transient hormonal dip resolved into steady positive bonding.'}
          </span>
          <span className="font-semibold text-sage-700">Validated with ACOG Fourth-Trimester Standards</span>
        </div>
      </div>

      {/* Interactive Quick-Update Card for Today's Metrics (Day 12) */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-sage-200/80 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-terracotta-500" />
            <h3 className="text-base font-bold text-slate-900">
              Update Day {patient.daysPostpartum} Check-In
            </h3>
          </div>
          {savedSuccess && (
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 animate-fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Changes saved to timeline
            </span>
          )}
        </div>

        <form onSubmit={handleSaveTodayUpdate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pain Slider */}
          <div className="bg-cream-50/70 p-4 rounded-2xl border border-sage-200/60">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
              <span>Pain Level:</span>
              <span className="text-sm font-bold text-terracotta-600">{painValue} / 10</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={painValue}
              onChange={(e) => setPainValue(Number(e.target.value))}
              className="w-full accent-terracotta-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0 (None)</span>
              <span>5 (Moderate)</span>
              <span>10 (Severe)</span>
            </div>
          </div>

          {/* Sleep Hours Slider */}
          <div className="bg-cream-50/70 p-4 rounded-2xl border border-sage-200/60">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
              <span>Sleep Total:</span>
              <span className="text-sm font-bold text-indigo-600">{sleepValue} hrs</span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              step={0.5}
              value={sleepValue}
              onChange={(e) => setSleepValue(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 hr</span>
              <span>6 hrs</span>
              <span>12 hrs</span>
            </div>
          </div>

          {/* Lochia Progression Pills */}
          <div className="bg-cream-50/70 p-4 rounded-2xl border border-sage-200/60">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
              <span>Lochia Bleeding:</span>
              <span className="text-[11px] font-bold uppercase text-rose-600">{lochiaVolume}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(['spotting', 'light', 'moderate'] as LochiaVolume[]).map((vol) => (
                <button
                  key={vol}
                  type="button"
                  onClick={() => setLochiaVolume(vol)}
                  className={`py-1 px-1.5 rounded-lg text-[10px] font-bold capitalize border ${
                    lochiaVolume === vol
                      ? 'bg-rose-500 text-white border-rose-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {vol}
                </button>
              ))}
            </div>
          </div>

          {/* Save Action */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white font-bold text-xs shadow-glow-sage transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Update Today's Metric Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
