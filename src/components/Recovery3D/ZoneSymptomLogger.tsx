import React, { useState } from 'react';
import { useRecovery } from '../../context/RecoveryContext';
import { RECOVERY_ZONES } from '../../data/mockProfile';
import { SeverityLevel, SymptomItem } from '../../types';
import {
  AlertTriangle,
  CheckCircle2,
  X,
  Plus,
  Flame,
  Clock,
  Trash2,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const ZoneSymptomLogger: React.FC = () => {
  const {
    selectedZoneId,
    setSelectedZoneId,
    symptoms,
    logSymptom,
    removeSymptom,
    triggerEmergencyOverride
  } = useRecovery();

  const zone = RECOVERY_ZONES.find((z) => z.id === selectedZoneId);

  const [selectedSymptom, setSelectedSymptom] = useState<SymptomItem | null>(null);
  const [severity, setSeverity] = useState<SeverityLevel>('mild');
  const [notes, setNotes] = useState<string>('');
  const [successToast, setSuccessToast] = useState<boolean>(false);

  if (!zone) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-sage-200/80 shadow-card flex flex-col items-center justify-center text-center h-full min-h-[380px]">
        <div className="w-16 h-16 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center mb-4 border border-sage-100">
          <Sparkles className="w-8 h-8 text-sage-500 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Select an Anatomical Zone</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
          Rotate and click any glowing 3D hotspot on the recovery torso model to inspect and log zone-specific healing milestones.
        </p>
        <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs">
          {RECOVERY_ZONES.map((z) => (
            <button
              key={z.id}
              onClick={() => setSelectedZoneId(z.id)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-cream-50 hover:bg-sage-50 text-slate-700 hover:text-sage-800 border border-sage-200/80 transition-all flex items-center gap-2 justify-center"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: z.color }} />
              {z.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const zoneSymptoms = symptoms.filter((s) => s.zoneId === zone.id);

  const handleLogSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymptom) return;

    logSymptom(
      zone.id,
      selectedSymptom.id,
      selectedSymptom.name,
      severity,
      notes,
      selectedSymptom.isRedFlag
    );

    // If severe red-flag symptom logged, offer immediate SafeSpace escalation
    if (selectedSymptom.isRedFlag && (severity === 'severe' || severity === 'moderate')) {
      triggerEmergencyOverride(
        `Critical Alert in ${zone.name}`,
        `Reported ${selectedSymptom.name} with ${severity} severity.`
      );
    }

    setSuccessToast(true);
    setSelectedSymptom(null);
    setNotes('');
    setSeverity('mild');

    setTimeout(() => {
      setSuccessToast(false);
    }, 3000);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 border border-sage-200/80 shadow-card flex flex-col h-full">
      {/* Zone Header */}
      <div className="flex items-start justify-between pb-4 border-b border-sage-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full inline-block shadow-sm"
              style={{ backgroundColor: zone.color }}
            />
            <span className="text-xs uppercase tracking-wider font-bold text-sage-600">
              Zone Assessment
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">{zone.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{zone.subtitle}</p>
        </div>
        <button
          onClick={() => setSelectedZoneId(null)}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Close Zone View"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-semibold text-emerald-800 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Symptom successfully logged into your recovery timeline.
        </div>
      )}

      {/* Symptom Logger Form */}
      <form onSubmit={handleLogSymptom} className="mt-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Observation or Symptom:
          </label>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {zone.primarySymptoms.map((symp) => {
              const isChosen = selectedSymptom?.id === symp.id;
              return (
                <div
                  key={symp.id}
                  onClick={() => setSelectedSymptom(symp)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    isChosen
                      ? 'border-sage-500 bg-sage-50/70 shadow-sm'
                      : 'border-slate-200 hover:border-sage-300 bg-cream-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{symp.name}</span>
                    {symp.isRedFlag ? (
                      <span className="shrink-0 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-red-200">
                        <AlertTriangle className="w-2.5 h-2.5 text-red-600" /> Red Flag
                      </span>
                    ) : (
                      <span className="shrink-0 bg-sage-100 text-sage-800 text-[10px] font-medium px-2 py-0.5 rounded-full">
                        Typical Recovery
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{symp.description}</p>
                  {symp.warningNotice && isChosen && (
                    <div className="mt-2 text-[11px] text-red-700 bg-red-50 p-2 rounded-xl border border-red-200 flex items-start gap-1.5 font-medium">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-600" />
                      <span>{symp.warningNotice}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity Selector */}
        {selectedSymptom && (
          <div className="animate-fade-in pt-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Severity Level:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['mild', 'moderate', 'severe'] as SeverityLevel[]).map((lvl) => {
                const isActive = severity === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                      isActive
                        ? lvl === 'severe'
                          ? 'bg-red-600 text-white border-red-700 shadow-md'
                          : lvl === 'moderate'
                          ? 'bg-terracotta-500 text-white border-terracotta-600 shadow-md'
                          : 'bg-sage-600 text-white border-sage-700 shadow-md'
                        : 'bg-cream-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Freeform Notes */}
        {selectedSymptom && (
          <div className="animate-fade-in">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Personal Notes / Description:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Started after 2 AM feed; noticeable stinging when changing positions..."
              rows={2}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sage-400 bg-cream-50 text-slate-800 resize-none"
            />
          </div>
        )}

        {/* Submit Button */}
        {selectedSymptom && (
          <button
            type="submit"
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
              selectedSymptom.isRedFlag && severity === 'severe'
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-glow-emergency'
                : 'bg-sage-600 hover:bg-sage-700 text-white shadow-glow-sage'
            }`}
          >
            <Plus className="w-4 h-4" />
            Log {zone.name.split(' ')[0]} Symptom
          </button>
        )}
      </form>

      {/* Recently Logged in this Zone */}
      <div className="mt-6 pt-4 border-t border-sage-100 flex-1 overflow-y-auto">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Active Observations ({zoneSymptoms.length})</span>
          <span className="text-[11px] font-normal text-slate-400">Day 12</span>
        </h4>

        {zoneSymptoms.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">
            No symptoms currently logged for this zone.
          </p>
        ) : (
          <div className="space-y-2">
            {zoneSymptoms.map((s) => (
              <div
                key={s.id}
                className="p-2.5 rounded-xl bg-cream-100 border border-sage-200/60 flex items-start justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        s.isRedFlag
                          ? 'bg-red-500'
                          : s.severity === 'severe'
                          ? 'bg-terracotta-500'
                          : 'bg-sage-500'
                      }`}
                    />
                    {s.symptomName}
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                      {s.severity}
                    </span>
                  </div>
                  {s.notes && <p className="text-[11px] text-slate-600 mt-1 italic">{s.notes}</p>}
                </div>
                <button
                  onClick={() => removeSymptom(s.id)}
                  className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
