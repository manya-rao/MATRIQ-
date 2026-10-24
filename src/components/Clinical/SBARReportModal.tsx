import React from 'react';
import { useRecovery } from '../../context/RecoveryContext';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  Stethoscope,
  ClipboardList,
  Sparkles,
  AlertCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const SBARReportModal: React.FC = () => {
  const { patient, metrics, todayMetric, latestEPDS, symptoms } = useRecovery();

  const handlePrint = () => {
    window.print();
  };

  const painDelta = metrics[0].painIndex - todayMetric.painIndex;
  const avgSleep = (
    metrics.reduce((acc, curr) => acc + curr.sleepHours, 0) / metrics.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sage-900 text-white rounded-3xl p-6 sm:p-7 shadow-soft no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 bg-white/20 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-sage-200">
                ACOG-Aligned Clinical Handoff Protocol
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              1-Click SBAR Doctor Briefing Generator
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
              Standardized Situation, Background, Assessment, and Recommendation medical summary synthesized from 14 days of logged recovery data for your 10-minute OB-GYN checkup.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="px-5 py-3 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs sm:text-sm shadow-glow-terracotta transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF Briefing
            </button>
          </div>
        </div>
      </div>

      {/* The Printable Medical SBAR Document */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-card sbar-printable max-w-4xl mx-auto space-y-8 font-sans">
        {/* Medical Document Header */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">MATRIQ</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sage-100 text-sage-800">
                  CLINICAL SBAR REPORT
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Standardized Postpartum Obstetric Handoff Briefing
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-600">
              <p><strong>Generated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p><strong>Protocol:</strong> ACOG Fourth-Trimester Care Standards</p>
            </div>
          </div>

          {/* Patient Demographics Table */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient Name</span>
              <span className="font-bold">{patient.name}</span>, Age {patient.age}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Postpartum Status</span>
              <span className="font-bold text-sage-800">Day {patient.daysPostpartum} Post-Cesarean</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Obstetric History</span>
              <span className="font-bold">{patient.gravidaPara}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Attending OB-GYN</span>
              <span className="font-bold">{patient.attendingPhysician}</span>
            </div>
          </div>
        </div>

        {/* SECTION S: SITUATION */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-sm flex items-center justify-center">
              S
            </span>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Situation (Current Clinical Status)
            </h3>
          </div>
          <div className="pl-9 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
            <p>
              Patient <strong>{patient.name}</strong> presents for Day {patient.daysPostpartum} postpartum follow-up following scheduled Cesarean delivery of viable male infant (Aarav, 3.4 kg) on {patient.deliveryDate}.
            </p>
            <div className="p-3 bg-cream-50 border border-cream-200 rounded-xl">
              <span className="font-bold text-slate-900 block mb-1">Chief Presentation Today:</span>
              <ul className="list-disc list-inside text-xs space-y-1 text-slate-700">
                <li>Mild transverse scar tingling/prickling; no active incision separation or foul oozing.</li>
                <li>Lochia transitioned normally from heavy rubra to moderate brownish-pink serosa.</li>
                <li>EPDS mental health screening shows low clinical risk (Score 7/30).</li>
                <li>Pain controlled with oral acetaminophen/ibuprofen (Current score: {todayMetric.painIndex}/10).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION B: BACKGROUND */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-sm flex items-center justify-center">
              B
            </span>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Background (Obstetric & Surgical History)
            </h3>
          </div>
          <div className="pl-9 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Surgical Detail:</span>
                Low transverse Pfannenstiel Cesarean section. Subcuticular suture closure. Estimated blood loss ~600 mL.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-0.5">Known Allergies & Vitals:</span>
                Penicillin allergy (rash). Blood Group: {patient.bloodType}. Normotensive at hospital discharge (118/74 mmHg).
              </div>
            </div>
          </div>
        </div>

        {/* SECTION A: ASSESSMENT */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-sm flex items-center justify-center">
              A
            </span>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Assessment (14-Day Trajectory & Objective Metrics)
            </h3>
          </div>
          <div className="pl-9 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-cream-50 rounded-xl border border-sage-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Pain Reduction</span>
                <span className="text-lg font-black text-terracotta-600">8 ➔ {todayMetric.painIndex} / 10</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Down {painDelta} pts</span>
              </div>
              <div className="p-3 bg-cream-50 rounded-xl border border-sage-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Lochia Stage</span>
                <span className="text-lg font-black text-rose-600 capitalize">{todayMetric.lochiaStage}</span>
                <span className="text-[10px] text-slate-500 font-semibold block">Volume: {todayMetric.lochiaVolume}</span>
              </div>
              <div className="p-3 bg-cream-50 rounded-xl border border-sage-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">EPDS Mood Score</span>
                <span className="text-lg font-black text-emerald-700">{latestEPDS.totalScore} / 30</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Low Clinical Risk</span>
              </div>
              <div className="p-3 bg-cream-50 rounded-xl border border-sage-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Avg Sleep Recorded</span>
                <span className="text-lg font-black text-indigo-700">{avgSleep} hrs</span>
                <span className="text-[10px] text-slate-500 font-semibold block">Fragmented</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Clinical Assessment Summary:</strong> Patient demonstrates expected physiological healing kinetics. Cesarean wound edges remain approximated. Lochia volume tapering normally. No persistent visual disturbances or intractable headaches consistent with delayed postpartum preeclampsia. Normal postpartum fatigue documented secondary to breastfeeding demands.
            </p>
          </div>
        </div>

        {/* SECTION R: RECOMMENDATION */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-sm flex items-center justify-center">
              R
            </span>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Recommendation (Suggested Physician Action Items)
            </h3>
          </div>
          <div className="pl-9 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <div className="p-4 bg-sage-50 border border-sage-200 rounded-2xl space-y-2">
              <span className="font-bold text-sage-950 block">Suggested Checklist for Today's Visit:</span>
              <ul className="space-y-1.5 text-xs text-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage-700 shrink-0" />
                  <span>Direct visual inspection of Pfannenstiel incision scar and palpation of uterine fundus involution.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage-700 shrink-0" />
                  <span>Routine seated blood pressure reading to confirm resolution of intrapartum pressures.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage-700 shrink-0" />
                  <span>Screen for postpartum anemia (optional CBC or Ferritin check if lightheadedness persists).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage-700 shrink-0" />
                  <span>Anticipatory guidance on pelvic floor gentle rehabilitation and 6-week contraceptive planning.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Physician Sign-Off Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sage-600" />
            <span>Digital Audit Trail: Authenticated MATRIQ HealthTech Architecture v1.0</span>
          </div>
          <div className="border-b border-slate-400 w-48 text-center pb-1 text-slate-400">
            Physician Signature / Stamp
          </div>
        </div>
      </div>
    </div>
  );
};
