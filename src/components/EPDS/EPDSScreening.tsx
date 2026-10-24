import React, { useState } from 'react';
import { useRecovery } from '../../context/RecoveryContext';
import { EPDS_QUESTIONS } from '../../data/mockProfile';
import { EPDSAssessment } from '../../types';
import {
  Brain,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EPDSScreening: React.FC = () => {
  const { latestEPDS, submitEPDS, triggerEmergencyOverride } = useRecovery();

  const [answers, setAnswers] = useState<Record<number, number>>(latestEPDS.answers || {});
  const [submittedAssessment, setSubmittedAssessment] = useState<EPDSAssessment | null>(latestEPDS);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [isRetaking, setIsRetaking] = useState<boolean>(false);

  const currentQ = EPDS_QUESTIONS[activeQuestionIndex];
  const allAnswered = EPDS_QUESTIONS.every((q) => answers[q.id] !== undefined);

  const handleSelectOption = (qId: number, score: number) => {
    const updated = { ...answers, [qId]: score };
    setAnswers(updated);

    // Auto-advance to next question if not at end
    if (activeQuestionIndex < EPDS_QUESTIONS.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
    }
  };

  const handleCalculateScore = () => {
    const result = submitEPDS(answers);
    setSubmittedAssessment(result);
    setIsRetaking(false);

    if (result.riskLevel === 'low') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else if (result.riskLevel === 'high' || result.q10Score > 0) {
      triggerEmergencyOverride(
        'EPDS Clinical Mood Elevation Alert',
        'Edinburgh Postnatal Depression Scale score flagged high risk (Score: ' +
          result.totalScore +
          '/30' +
          (result.q10Score > 0 ? ', affirmative on self-harm question 10' : '') +
          ').'
      );
    }
  };

  const handleStartRetake = () => {
    setIsRetaking(true);
    setActiveQuestionIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sage-700 via-sage-800 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 bg-white/20 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-sage-200">
                Gold Standard Clinical Assessment
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Edinburgh Postnatal Depression Scale (EPDS)
            </h2>
            <p className="text-xs sm:text-sm text-sage-100 max-w-xl mt-1 leading-relaxed">
              A validated 10-question clinical screening tool endorsed by ACOG and AAP to evaluate emotional wellbeing in the postpartum recovery period.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shrink-0">
            <Lock className="w-4 h-4 text-emerald-300" />
            <span className="text-xs font-medium text-emerald-100">
              100% Private & Client-Side Encrypted
            </span>
          </div>
        </div>
      </div>

      {/* Screen Quiz or Latest Assessment Result */}
      {!isRetaking && submittedAssessment ? (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sage-100">
            <div>
              <span className="text-xs font-semibold text-slate-400">
                Latest Screening Completed: {submittedAssessment.date}
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h3 className="text-2xl font-black text-slate-900">
                  Total Score: {submittedAssessment.totalScore} / 30
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border ${
                    submittedAssessment.riskLevel === 'high'
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : submittedAssessment.riskLevel === 'moderate'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}
                >
                  {submittedAssessment.riskLevel === 'high'
                    ? 'Elevated Risk Tier'
                    : submittedAssessment.riskLevel === 'moderate'
                    ? 'Moderate Risk Tier'
                    : 'Low Risk Tier'}
                </span>
              </div>
            </div>

            <button
              onClick={handleStartRetake}
              className="px-4 py-2.5 rounded-xl bg-sage-50 hover:bg-sage-100 text-sage-800 font-bold text-xs border border-sage-200 transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <RefreshCw className="w-4 h-4 text-sage-600" /> Retake 10-Question EPDS
            </button>
          </div>

          {/* Clinical Interpretation Card */}
          <div
            className={`p-5 rounded-2xl border ${
              submittedAssessment.riskLevel === 'high'
                ? 'bg-red-50/70 border-red-200 text-red-950'
                : submittedAssessment.riskLevel === 'moderate'
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {submittedAssessment.riskLevel === 'high' ? (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              ) : submittedAssessment.riskLevel === 'moderate' ? (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-sm font-bold">Clinical Care Assessment:</h4>
                <p className="text-xs leading-relaxed font-medium">
                  {submittedAssessment.clinicalGuidance}
                </p>
                {submittedAssessment.q10Score > 0 && (
                  <p className="text-xs font-bold text-red-700 mt-2">
                    ⚠️ Affirmative response noted on Question 10 (self-harm thoughts). Please seek support immediately.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Crisis Hotline & Support Integration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-cream-50 border border-sage-200/60 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Postpartum Support International (PSI)</h4>
                <p className="text-[11px] text-slate-500">Free, confidential 24/7 maternal mental health helpline</p>
                <a href="tel:18009444773" className="text-xs font-bold text-indigo-600 hover:underline mt-0.5 block">
                  Call or Text: 1-800-944-4773
                </a>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-sage-200/60 flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Tele-Health Maternal Counselor</h4>
                <p className="text-[11px] text-slate-500">Included in your Apollo Cradle care plan</p>
                <button
                  onClick={() => alert('Tele-health counseling appointment request sent to your care coordinator.')}
                  className="text-xs font-bold text-rose-600 hover:underline mt-0.5 block"
                >
                  Schedule Priority 20-Min Check-In
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Interface */
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-card space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Question {activeQuestionIndex + 1} of 10</span>
              <span>
                {Math.round(((Object.keys(answers).length) / 10) * 100)}% Complete
              </span>
            </div>
            <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-sage-500 transition-all duration-300 rounded-full"
                style={{ width: `${((activeQuestionIndex + 1) / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Active Question Box */}
          <div className="pt-2">
            <p className="text-xs font-bold text-sage-600 uppercase tracking-wider mb-1">
              Over the past 7 days:
            </p>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>

            {/* Answer Options */}
            <div className="mt-5 space-y-2.5">
              {currentQ.options.map((opt, i) => {
                const isSelected = answers[currentQ.id] === opt.score;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, opt.score)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-sage-500 bg-sage-50/80 text-sage-950 shadow-sm'
                        : 'border-slate-200 hover:border-sage-300 bg-cream-50/50 text-slate-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 ${
                        isSelected
                          ? 'border-sage-600 bg-sage-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quiz Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-sage-100">
            <button
              onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeQuestionIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
            >
              Previous Question
            </button>

            {activeQuestionIndex < EPDS_QUESTIONS.length - 1 ? (
              <button
                onClick={() => setActiveQuestionIndex((prev) => Math.min(EPDS_QUESTIONS.length - 1, prev + 1))}
                disabled={answers[currentQ.id] === undefined}
                className="px-5 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-bold transition-all disabled:opacity-40 shadow-glow-sage"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleCalculateScore}
                disabled={!allAnswered}
                className="px-6 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-black transition-all shadow-glow-terracotta disabled:opacity-40"
              >
                Calculate EPDS Score
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
