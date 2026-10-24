import { LoggedSymptom, DailyRecoveryMetric, EPDSAssessment } from '../types';

export interface EmergencyTriggerResult {
  isTriggered: boolean;
  severity: 'CRITICAL_EMERGENCY' | 'URGENT_EVALUATION' | 'NONE';
  conditionName: string;
  clinicalReason: string;
  immediateActions: string[];
  flaggedSymptoms: string[];
  timestamp: string;
}

/**
 * Deterministic Safety-First Rule Evaluation Engine
 * Pure synchronous client-side evaluation with ZERO network latency.
 * Compliant with ACOG (American College of Obstetricians and Gynecologists)
 * Postpartum Red Flag Warning Protocols.
 */
export function evaluateEmergencyRules(
  symptoms: LoggedSymptom[],
  latestMetrics?: DailyRecoveryMetric,
  latestEPDS?: EPDSAssessment
): EmergencyTriggerResult {
  const flagged: string[] = [];

  // Check 1: Mental Health Crisis / Self-harm (EPDS Question 10)
  if (latestEPDS && latestEPDS.q10Score > 0) {
    return {
      isTriggered: true,
      severity: 'CRITICAL_EMERGENCY',
      conditionName: 'Immediate Postpartum Mental Health Alert',
      clinicalReason: 'Affirmative response detected on EPDS self-harm/crisis screening (Question 10).',
      immediateActions: [
        'Connect immediately to Postpartum Crisis Hotline (988 or 1-800-944-4773).',
        'Notify your primary support partner Arjun Sharma right now.',
        'Do not stay alone; keep your support network present.'
      ],
      flaggedSymptoms: ['EPDS Question 10: Thoughts of self-harm'],
      timestamp: new Date().toISOString()
    };
  }

  // Check 2: Severe Postpartum Hemorrhage
  const hasHemorrhage = symptoms.some(
    s => s.symptomId === 'hemorrhage_soaking' || 
         (s.zoneId === 'pelvic' && s.severity === 'severe' && s.symptomName.toLowerCase().includes('soaking'))
  ) || (latestMetrics?.lochiaVolume === 'soaking_alert');

  if (hasHemorrhage) {
    return {
      isTriggered: true,
      severity: 'CRITICAL_EMERGENCY',
      conditionName: 'Secondary Postpartum Hemorrhage (PPH)',
      clinicalReason: 'Vaginal bleeding reported as soaking through 1 or more heavy sanitary pads per hour or large clots.',
      immediateActions: [
        'Call 911 / 112 / 108 or proceed to nearest Labor & Delivery triage immediately.',
        'Lie flat with feet elevated while waiting for emergency transport.',
        'Notify your OB-GYN emergency line and partner.'
      ],
      flaggedSymptoms: ['Soaking >1 pad/hour', 'Bright red sudden flooding'],
      timestamp: new Date().toISOString()
    };
  }

  // Check 3: Postpartum Preeclampsia / Hypertensive Crisis
  const hasSevereHeadache = symptoms.some(s => s.symptomId === 'headache_severe' && s.severity !== 'mild');
  const hasVisionChanges = symptoms.some(s => s.symptomId === 'vision_changes');

  if (hasSevereHeadache && hasVisionChanges) {
    return {
      isTriggered: true,
      severity: 'CRITICAL_EMERGENCY',
      conditionName: 'Postpartum Preeclampsia with Severe Features',
      clinicalReason: 'Co-occurrence of intractable throbbing headache and visual disturbances (auras, blurred vision) can signal cerebral edema or severe hypertension.',
      immediateActions: [
        'Go directly to the nearest Emergency Obstetric Unit (Apollo Cradle Triage - 2.3 km).',
        'Have someone drive you immediately — do not drive yourself.',
        'Request immediate blood pressure measurement and preeclampsia lab panel upon arrival.'
      ],
      flaggedSymptoms: ['Severe persistent headache', 'Visual auras / blurred vision'],
      timestamp: new Date().toISOString()
    };
  }

  // Check 4: Cardiopulmonary / Pulmonary Embolism (PE)
  const hasChestPain = symptoms.some(s => s.symptomId === 'chest_pain_sob');
  if (hasChestPain) {
    return {
      isTriggered: true,
      severity: 'CRITICAL_EMERGENCY',
      conditionName: 'Cardiopulmonary / Thromboembolic Risk (PE)',
      clinicalReason: 'Chest pain or shortness of breath postpartum warrants rapid rule-out of pulmonary embolism or peripartum cardiomyopathy.',
      immediateActions: [
        'Call 911 / 112 / 108 Emergency Medical Services right away.',
        'Remain seated in an upright position to ease breathing.',
        'Unlock front door and inform primary emergency contact.'
      ],
      flaggedSymptoms: ['Sudden chest pain', 'Shortness of breath'],
      timestamp: new Date().toISOString()
    };
  }

  // Check 5: Severe Systemic Infection (Sepsis / Endometritis / Surgical Site Dehiscence)
  const hasIncisionDehiscence = symptoms.some(s => s.symptomId === 'incision_infection' && s.severity === 'severe');
  const hasFoulLochia = symptoms.some(s => s.symptomId === 'foul_lochia');
  const hasSevereMastitis = symptoms.some(s => s.symptomId === 'mastitis_fever' && s.severity === 'severe');

  if (hasIncisionDehiscence || hasFoulLochia || hasSevereMastitis) {
    const reasons = [];
    if (hasIncisionDehiscence) reasons.push('C-Section incision wound breakdown or purulent discharge');
    if (hasFoulLochia) reasons.push('Putrid/foul-smelling lochia indicative of uterine infection');
    if (hasSevereMastitis) reasons.push('Systemic high fever with breast quadrant erythema');

    return {
      isTriggered: true,
      severity: 'URGENT_EVALUATION',
      conditionName: 'Acute Postpartum Infection / Sepsis Risk',
      clinicalReason: reasons.join('; '),
      immediateActions: [
        'Contact your OB-GYN clinic or attend Emergency triage within 2 hours.',
        'Do not apply over-the-counter creams or ointments to the incision without physician review.',
        'Record your temperature every 30 minutes.'
      ],
      flaggedSymptoms: reasons,
      timestamp: new Date().toISOString()
    };
  }

  // Check 6: Uncontrolled Severe Pain (Pain Score >= 9)
  if (latestMetrics && latestMetrics.painIndex >= 9) {
    return {
      isTriggered: true,
      severity: 'URGENT_EVALUATION',
      conditionName: 'Acute Severe Pain Alert',
      clinicalReason: 'Self-reported pain index >= 9/10 suggests breakthrough visceral pain, wound hematoma, or acute complication.',
      immediateActions: [
        'Contact Dr. Ananya Iyer’s clinic for urgent prescription adjustment or assessment.',
        'Avoid strenuous movement; rest in comfortable side-lying position with pillow support.'
      ],
      flaggedSymptoms: ['Pain Score: 9+/10'],
      timestamp: new Date().toISOString()
    };
  }

  return {
    isTriggered: false,
    severity: 'NONE',
    conditionName: '',
    clinicalReason: '',
    immediateActions: [],
    flaggedSymptoms: [],
    timestamp: new Date().toISOString()
  };
}
