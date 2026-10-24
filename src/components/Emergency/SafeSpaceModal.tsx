import React, { useState } from 'react';
import { useRecovery } from '../../context/RecoveryContext';
import { MOCK_OB_UNITS } from '../../data/mockProfile';
import {
  AlertOctagon,
  PhoneCall,
  Send,
  MapPin,
  Clock,
  ShieldCheck,
  X,
  CheckCircle2,
  Navigation,
  HeartHandshake,
  AlertTriangle,
  Volume2
} from 'lucide-react';

export const SafeSpaceModal: React.FC = () => {
  const {
    isSafeSpaceModalOpen,
    closeEmergencyOverride,
    emergencyStatus,
    caregivers,
    patient,
    soundEnabled,
    toggleSound
  } = useRecovery();

  const [sosSent, setSosSent] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<string>(MOCK_OB_UNITS[0].id);

  if (!isSafeSpaceModalOpen) return null;

  const primaryCaregiver = caregivers.find((c) => c.isPrimarySOS) || caregivers[0];

  const handleDispatchSOS = () => {
    setSosSent(true);
    // Real-world simulated notification
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-emergency-base overflow-hidden my-auto animate-scale-up">
        {/* Glowing High-Contrast Emergency Header */}
        <div className="bg-gradient-to-r from-emergency-base via-red-700 to-emergency-dark text-white p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl animate-pulse-emergency">
                <AlertOctagon className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold tracking-widest uppercase bg-white/25 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  SafeSpace™ Clinical Override
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {emergencyStatus.conditionName || 'Obstetric Red Flag Alert'}
                </h2>
              </div>
            </div>
            <button
              onClick={closeEmergencyOverride}
              className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Acknowledge and dismiss modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-red-100 font-medium leading-relaxed bg-black/20 p-3 rounded-xl border border-white/10">
            <strong>Clinical Trigger:</strong> {emergencyStatus.clinicalReason || 'Critical red-flag symptom threshold reached. Prioritize immediate clinical evaluation.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Action 1: Instant Emergency Direct Dial & 1-Tap SOS Broadcast */}
          <div className="bg-red-50/80 border border-red-200 rounded-2xl p-4 sm:p-5">
            <h3 className="text-sm font-bold text-red-950 uppercase tracking-wide flex items-center gap-2 mb-3">
              <PhoneCall className="w-4 h-4 text-red-600" />
              Immediate Emergency Dispatch (1-Tap)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Emergency Services Dial */}
              <a
                href="tel:112"
                className="flex items-center justify-center gap-2 py-3.5 px-4 bg-emergency-base hover:bg-emergency-dark text-white rounded-xl font-black text-sm tracking-wide shadow-glow-emergency transition-all text-center"
              >
                <PhoneCall className="w-5 h-5 animate-bounce" />
                Call 112 / 911 (Ambulance)
              </a>

              {/* 1-Tap Support Network SOS Alert */}
              <button
                onClick={handleDispatchSOS}
                disabled={sosSent}
                className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm transition-all border ${
                  sosSent
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-sm'
                }`}
              >
                {sosSent ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    SOS Sent to {primaryCaregiver.name}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-terracotta-600" />
                    Alert {primaryCaregiver.name} ({primaryCaregiver.relationship})
                  </>
                )}
              </button>
            </div>

            {sosSent && (
              <p className="mt-2.5 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Simulated SMS & Push notification dispatched with your live coordinates and vital status.
              </p>
            )}
          </div>

          {/* Action 2: Nearest 24/7 Obstetric Emergency Units */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sage-600" />
                Nearest 24/7 Emergency Obstetric Units (OB-ER)
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">GPS Verified</span>
            </div>

            <div className="space-y-2.5">
              {MOCK_OB_UNITS.map((unit) => {
                const isSelected = selectedUnit === unit.id;
                return (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedUnit(unit.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-red-400 bg-red-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-cream-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">{unit.name}</span>
                        {unit.hasNICU && (
                          <span className="text-[10px] font-bold bg-sage-100 text-sage-800 px-2 py-0.5 rounded-full">
                            Level III NICU
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{unit.address}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] font-medium text-slate-600">
                        <span className="flex items-center gap-1 text-emergency-base font-bold">
                          <Navigation className="w-3 h-3" /> {unit.distanceKm} km away
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> ~{unit.estimatedDriveTimeMin} min drive
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`tel:${unit.phone}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                      >
                        <PhoneCall className="w-3 h-3" /> Call Triage
                      </a>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(unit.name + ' ' + unit.address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3 text-sage-600" /> Navigate
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action 3: ACOG Action Guidelines While Waiting */}
          <div className="bg-cream-100 border border-cream-300 rounded-2xl p-4 sm:p-5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ACOG Clinical Guidelines — While Awaiting Care
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 leading-relaxed font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emergency-base shrink-0 mt-1.5" />
                <span><strong>Do Not Drive Yourself:</strong> Have partner Arjun Sharma or an ambulance transport you.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emergency-base shrink-0 mt-1.5" />
                <span><strong>Positioning:</strong> If bleeding heavily, lie flat with pillows elevating your legs. If feeling short of breath, remain seated upright.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emergency-base shrink-0 mt-1.5" />
                <span><strong>Bring Documents:</strong> Carry your MATRIQ 1-Click SBAR summary or hospital discharge paperwork.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emergency-base shrink-0 mt-1.5" />
                <span><strong>Nil by Mouth:</strong> Avoid eating solid food until evaluated by an obstetrician in case emergency intervention is warranted.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-slate-500 text-center sm:text-left">
            MATRIQ SafeSpace™ rule-engine operates deterministically on device.
          </p>
          <button
            onClick={closeEmergencyOverride}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors"
          >
            I Am Receiving Care / Close Warning
          </button>
        </div>
      </div>
    </div>
  );
};
