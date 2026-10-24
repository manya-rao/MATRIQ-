export type RecoveryZoneId = 'head' | 'chest' | 'abdomen' | 'pelvic';

export type SeverityLevel = 'mild' | 'moderate' | 'severe';

export interface SymptomItem {
  id: string;
  name: string;
  description: string;
  isRedFlag: boolean;
  warningNotice?: string;
}

export interface RecoveryZone {
  id: RecoveryZoneId;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  position3D: [number, number, number];
  primarySymptoms: SymptomItem[];
}

export interface LoggedSymptom {
  id: string;
  zoneId: RecoveryZoneId;
  symptomId: string;
  symptomName: string;
  severity: SeverityLevel;
  notes: string;
  isRedFlag: boolean;
  loggedAt: string; // ISO string
}

export type LochiaStage = 'rubra' | 'serosa' | 'alba' | 'none';
export type LochiaVolume = 'spotting' | 'light' | 'moderate' | 'heavy' | 'soaking_alert';

export interface DailyRecoveryMetric {
  day: number;
  dateStr: string;
  painIndex: number; // 0 - 10
  lochiaStage: LochiaStage;
  lochiaVolume: LochiaVolume;
  sleepHours: number;
  fatigueLevel: number; // 1 - 10
  emotionalScore: number; // 1 - 10
  notes?: string;
}

export interface EPDSQuestion {
  id: number;
  question: string;
  options: {
    label: string;
    score: number;
  }[];
}

export type EPDSRiskLevel = 'low' | 'moderate' | 'high';

export interface EPDSAssessment {
  id: string;
  date: string;
  answers: Record<number, number>;
  totalScore: number;
  q10Score: number; // Question 10 (self harm thoughts)
  riskLevel: EPDSRiskLevel;
  clinicalGuidance: string;
}

export type MoodType = 'grateful' | 'exhausted' | 'anxious' | 'hopeful' | 'overwhelmed' | 'peaceful' | 'healing';

export interface JournalEntry {
  id: string;
  date: string;
  mood: MoodType;
  title: string;
  content: string;
  tags: string[];
  painLevel: number;
  sleepHours: number;
  isPrivateEncrypted: boolean;
}

export interface CaregiverContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimarySOS: boolean;
}

export interface VillageBroadcast {
  id: string;
  category: 'meal' | 'sleep' | 'emotional' | 'milestone' | 'errand';
  title: string;
  message: string;
  sentAt: string;
  status: 'sent' | 'acknowledged' | 'in_progress';
  responses?: { responder: string; message: string; time: string }[];
}

export interface ObstetricUnit {
  id: string;
  name: string;
  distanceKm: number;
  address: string;
  phone: string;
  hasNICU: boolean;
  has24hrOB: boolean;
  estimatedDriveTimeMin: number;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  deliveryType: 'Cesarean Delivery' | 'Vaginal Delivery';
  daysPostpartum: number;
  deliveryDate: string;
  infantName: string;
  infantWeight: string;
  attendingPhysician: string;
  hospitalName: string;
  bloodType: string;
  gravidaPara: string;
  allergies: string[];
}

export interface SBARSummary {
  situation: {
    patientName: string;
    daysPostpartum: number;
    deliveryType: string;
    chiefConcerns: string[];
    currentVitalStatus: string;
  };
  background: {
    obstetricHistory: string;
    deliveryComplications: string;
    chronicConditions: string;
    medications: string[];
  };
  assessment: {
    lochiaProgressionSummary: string;
    incisionOrPerinealStatus: string;
    painTrendDescription: string;
    epdsClinicalScore: string;
    sleepDeficitSummary: string;
  };
  recommendation: {
    suggestedPhysicalExam: string[];
    presumptiveDiagnosticOrders: string[];
    followUpTimeline: string;
    pelvicFloorReferralRequired: boolean;
  };
  generatedAt: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'es';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  language: SupportedLanguage;
}
