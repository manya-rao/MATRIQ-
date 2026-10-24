import React from 'react';
import { useRecovery } from '../../context/RecoveryContext';
import { AlertOctagon, PhoneCall, ArrowRight } from 'lucide-react';

export const RedFlagBanner: React.FC = () => {
  const { emergencyStatus, triggerEmergencyOverride } = useRecovery();

  if (!emergencyStatus.isTriggered) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-emergency-dark text-white p-3.5 sm:p-4 rounded-3xl shadow-glow-emergency border-2 border-red-300 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in no-print">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-xl shrink-0 animate-pulse">
          <AlertOctagon className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-black/25 px-2 py-0.5 rounded-full inline-block mb-0.5">
            Clinical Warning Detected
          </span>
          <h4 className="text-xs sm:text-sm font-bold">
            {emergencyStatus.conditionName}: {emergencyStatus.clinicalReason}
          </h4>
        </div>
      </div>

      <button
        onClick={() => triggerEmergencyOverride()}
        className="px-4 py-2 rounded-xl bg-white hover:bg-red-50 text-emergency-base font-black text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 w-full sm:w-auto justify-center"
      >
        <span>Open SafeSpace™ Protocol</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
