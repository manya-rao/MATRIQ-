import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  PatientProfile,
  DailyRecoveryMetric,
  RecoveryZoneId,
  LoggedSymptom,
  SeverityLevel,
  EPDSAssessment,
  JournalEntry,
  CaregiverContact,
  VillageBroadcast,
  SupportedLanguage
} from '../types';
import {
  MOCK_PATIENT,
  MOCK_14_DAY_METRICS,
  MOCK_BASELINE_EPDS,
  MOCK_JOURNAL_ENTRIES,
  MOCK_CAREGIVERS,
  MOCK_VILLAGE_BROADCASTS
} from '../data/mockProfile';
import { evaluateEmergencyRules, EmergencyTriggerResult } from '../utils/emergencyRules';
import { playCalmChime, playHotspotClick, playEmergencyAlarm } from '../utils/soundEffects';

interface RecoveryContextType {
  patient: PatientProfile;
  metrics: DailyRecoveryMetric[];
  todayMetric: DailyRecoveryMetric;
  symptoms: LoggedSymptom[];
  selectedZoneId: RecoveryZoneId | null;
  activeTab: '3d-map' | 'analytics' | 'epds' | 'sbar' | 'village' | 'navigator';
  isSafeSpaceModalOpen: boolean;
  emergencyStatus: EmergencyTriggerResult;
  epdsHistory: EPDSAssessment[];
  latestEPDS: EPDSAssessment;
  journalEntries: JournalEntry[];
  caregivers: CaregiverContact[];
  broadcasts: VillageBroadcast[];
  language: SupportedLanguage;
  soundEnabled: boolean;
  highContrast: boolean;

  setSelectedZoneId: (zoneId: RecoveryZoneId | null) => void;
  setActiveTab: (tab: '3d-map' | 'analytics' | 'epds' | 'sbar' | 'village' | 'navigator') => void;
  logSymptom: (zoneId: RecoveryZoneId, symptomId: string, symptomName: string, severity: SeverityLevel, notes: string, isRedFlag: boolean) => void;
  removeSymptom: (id: string) => void;
  updateTodayMetric: (update: Partial<DailyRecoveryMetric>) => void;
  triggerEmergencyOverride: (customCondition?: string, customReason?: string) => void;
  closeEmergencyOverride: () => void;
  submitEPDS: (answers: Record<number, number>) => EPDSAssessment;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  sendVillageBroadcast: (category: VillageBroadcast['category'], title: string, message: string) => void;
  resetToDemoProfile: () => void;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleSound: () => void;
  toggleHighContrast: () => void;
}

const RecoveryContext = createContext<RecoveryContextType | undefined>(undefined);

const INITIAL_SYMPTOMS: LoggedSymptom[] = [
  {
    id: 'symp-init-1',
    zoneId: 'abdomen',
    symptomId: 'scar_itching_tingling',
    symptomName: 'Incision Itching, Numbness & Prickling',
    severity: 'mild',
    notes: 'Mild prickling around horizontal incision line; normal healing sensation.',
    isRedFlag: false,
    loggedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'symp-init-2',
    zoneId: 'pelvic',
    symptomId: 'normal_lochia_serosa',
    symptomName: 'Brownish-Pink Moderate Discharge (Lochia Serosa)',
    severity: 'mild',
    notes: 'Using standard light pantyliners; no foul odor.',
    isRedFlag: false,
    loggedAt: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

export const RecoveryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patient] = useState<PatientProfile>(MOCK_PATIENT);
  const [metrics, setMetrics] = useState<DailyRecoveryMetric[]>(MOCK_14_DAY_METRICS);
  const [symptoms, setSymptoms] = useState<LoggedSymptom[]>(INITIAL_SYMPTOMS);
  const [selectedZoneId, setSelectedZoneIdState] = useState<RecoveryZoneId | null>(null);
  const [activeTab, setActiveTabState] = useState<'3d-map' | 'analytics' | 'epds' | 'sbar' | 'village' | 'navigator'>('3d-map');
  const [isSafeSpaceModalOpen, setIsSafeSpaceModalOpen] = useState<boolean>(false);
  const [epdsHistory, setEpdsHistory] = useState<EPDSAssessment[]>([MOCK_BASELINE_EPDS]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);
  const [caregivers] = useState<CaregiverContact[]>(MOCK_CAREGIVERS);
  const [broadcasts, setBroadcasts] = useState<VillageBroadcast[]>(MOCK_VILLAGE_BROADCASTS);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  // Derive latest EPDS assessment
  const latestEPDS = epdsHistory[epdsHistory.length - 1] || MOCK_BASELINE_EPDS;
  // Derive today's metric (Day 12)
  const todayMetric = metrics.find(m => m.day === patient.daysPostpartum) || metrics[metrics.length - 1];

  // Evaluate Deterministic Emergency Rules whenever symptoms, metrics, or EPDS change
  const [emergencyStatus, setEmergencyStatus] = useState<EmergencyTriggerResult>(() =>
    evaluateEmergencyRules(symptoms, todayMetric, latestEPDS)
  );

  useEffect(() => {
    const evaluation = evaluateEmergencyRules(symptoms, todayMetric, latestEPDS);
    setEmergencyStatus(evaluation);

    // If an acute emergency is detected deterministically, trigger the SafeSpace modal immediately
    if (evaluation.isTriggered && evaluation.severity === 'CRITICAL_EMERGENCY') {
      setIsSafeSpaceModalOpen(true);
      playEmergencyAlarm(soundEnabled);
    }
  }, [symptoms, todayMetric, latestEPDS, soundEnabled]);

  const setSelectedZoneId = (zoneId: RecoveryZoneId | null) => {
    setSelectedZoneIdState(zoneId);
    if (zoneId) {
      playHotspotClick(soundEnabled);
    }
  };

  const setActiveTab = (tab: '3d-map' | 'analytics' | 'epds' | 'sbar' | 'village' | 'navigator') => {
    setActiveTabState(tab);
    playHotspotClick(soundEnabled);
  };

  const logSymptom = (
    zoneId: RecoveryZoneId,
    symptomId: string,
    symptomName: string,
    severity: SeverityLevel,
    notes: string,
    isRedFlag: boolean
  ) => {
    const newSymptom: LoggedSymptom = {
      id: `symp-${Date.now()}`,
      zoneId,
      symptomId,
      symptomName,
      severity,
      notes,
      isRedFlag,
      loggedAt: new Date().toISOString()
    };

    setSymptoms(prev => [newSymptom, ...prev]);

    if (isRedFlag || severity === 'severe') {
      playEmergencyAlarm(soundEnabled);
    } else {
      playCalmChime(soundEnabled);
    }
  };

  const removeSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
  };

  const updateTodayMetric = (update: Partial<DailyRecoveryMetric>) => {
    setMetrics(prev =>
      prev.map(m => {
        if (m.day === patient.daysPostpartum) {
          return { ...m, ...update };
        }
        return m;
      })
    );
    playCalmChime(soundEnabled);
  };

  const triggerEmergencyOverride = (customCondition?: string, customReason?: string) => {
    setEmergencyStatus({
      isTriggered: true,
      severity: 'CRITICAL_EMERGENCY',
      conditionName: customCondition || 'Manual Red Flag Emergency Triggered',
      clinicalReason: customReason || 'User tapped the high-visibility emergency SOS override for immediate obstetric triage.',
      immediateActions: [
        'Call 911 / 112 / 108 or proceed to nearest Labor & Delivery triage immediately.',
        'Emergency notification dispatched to primary support Arjun Sharma.',
        'Do not drive alone — have an adult accompany you.'
      ],
      flaggedSymptoms: ['User Emergency SOS Dispatch'],
      timestamp: new Date().toISOString()
    });
    setIsSafeSpaceModalOpen(true);
    playEmergencyAlarm(soundEnabled);
  };

  const closeEmergencyOverride = () => {
    setIsSafeSpaceModalOpen(false);
  };

  const submitEPDS = (answers: Record<number, number>): EPDSAssessment => {
    let totalScore = 0;
    Object.values(answers).forEach(val => {
      totalScore += val;
    });

    const q10Score = answers[10] || 0;
    let riskLevel: EPDSAssessment['riskLevel'] = 'low';
    let guidance = '';

    if (q10Score > 0 || totalScore >= 13) {
      riskLevel = 'high';
      guidance = 'High risk indicated. Clinical guidelines mandate a timely clinical consultation and immediate crisis support if feeling overwhelmed.';
    } else if (totalScore >= 10) {
      riskLevel = 'moderate';
      guidance = 'Moderate risk score. Suggests heightened distress or postpartum anxiety. A proactive check-in with your midwife or counselor is strongly encouraged.';
    } else {
      riskLevel = 'low';
      guidance = 'Your score indicates normal emotional adjustment and coping. Continue protecting sleep windows and sharing feelings with your support village.';
    }

    const assessment: EPDSAssessment = {
      id: `epds-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      answers,
      totalScore,
      q10Score,
      riskLevel,
      clinicalGuidance: guidance
    };

    setEpdsHistory(prev => [...prev, assessment]);
    if (riskLevel === 'high') {
      playEmergencyAlarm(soundEnabled);
    } else {
      playCalmChime(soundEnabled);
    }

    return assessment;
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `j-${Date.now()}`
    };
    setJournalEntries(prev => [newEntry, ...prev]);
    playCalmChime(soundEnabled);
  };

  const sendVillageBroadcast = (
    category: VillageBroadcast['category'],
    title: string,
    message: string
  ) => {
    const newBroadcast: VillageBroadcast = {
      id: `vb-${Date.now()}`,
      category,
      title,
      message,
      sentAt: 'Just now',
      status: 'sent'
    };
    setBroadcasts(prev => [newBroadcast, ...prev]);
    playCalmChime(soundEnabled);

    // Simulate caregiver automatic response after 2.5 seconds
    setTimeout(() => {
      setBroadcasts(current =>
        current.map(b => {
          if (b.id === newBroadcast.id) {
            return {
              ...b,
              status: 'acknowledged',
              responses: [
                {
                  responder: 'Arjun (Partner)',
                  message: 'Got your alert! Taking care of this right away ❤️',
                  time: 'Just now'
                }
              ]
            };
          }
          return b;
        })
      );
      playCalmChime(soundEnabled);
    }, 2500);
  };

  const resetToDemoProfile = () => {
    setMetrics(MOCK_14_DAY_METRICS);
    setSymptoms(INITIAL_SYMPTOMS);
    setSelectedZoneIdState(null);
    setIsSafeSpaceModalOpen(false);
    setEpdsHistory([MOCK_BASELINE_EPDS]);
    setJournalEntries(MOCK_JOURNAL_ENTRIES);
    setBroadcasts(MOCK_VILLAGE_BROADCASTS);
    playCalmChime(soundEnabled);
  };

  const toggleSound = () => setSoundEnabled(prev => !prev);
  const toggleHighContrast = () => setHighContrast(prev => !prev);

  return (
    <RecoveryContext.Provider
      value={{
        patient,
        metrics,
        todayMetric,
        symptoms,
        selectedZoneId,
        activeTab,
        isSafeSpaceModalOpen,
        emergencyStatus,
        epdsHistory,
        latestEPDS,
        journalEntries,
        caregivers,
        broadcasts,
        language,
        soundEnabled,
        highContrast,
        setSelectedZoneId,
        setActiveTab,
        logSymptom,
        removeSymptom,
        updateTodayMetric,
        triggerEmergencyOverride,
        closeEmergencyOverride,
        submitEPDS,
        addJournalEntry,
        sendVillageBroadcast,
        resetToDemoProfile,
        setLanguage,
        toggleSound,
        toggleHighContrast
      }}
    >
      {children}
    </RecoveryContext.Provider>
  );
};

export function useRecovery() {
  const context = useContext(RecoveryContext);
  if (!context) {
    throw new Error('useRecovery must be used within a RecoveryProvider');
  }
  return context;
}
