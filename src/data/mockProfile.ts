import {
  PatientProfile,
  DailyRecoveryMetric,
  RecoveryZone,
  CaregiverContact,
  ObstetricUnit,
  JournalEntry,
  EPDSQuestion,
  EPDSAssessment,
  VillageBroadcast
} from '../types';

export const MOCK_PATIENT: PatientProfile = {
  id: 'pt-2026-9921',
  name: 'Priya Sharma',
  age: 29,
  deliveryType: 'Cesarean Delivery',
  daysPostpartum: 12,
  deliveryDate: 'October 12, 2026',
  infantName: 'Aarav Sharma',
  infantWeight: '3.4 kg (7 lbs 8 oz)',
  attendingPhysician: 'Dr. Ananya Iyer, MD, FACOG',
  hospitalName: 'Apollo Cradle & Children’s Hospital',
  bloodType: 'O Positive',
  gravidaPara: 'G1P1 (Primiparous)',
  allergies: ['Penicillin (mild rash)'],
};

export const RECOVERY_ZONES: RecoveryZone[] = [
  {
    id: 'head',
    name: 'Head & Neck Zone',
    subtitle: 'Neurological & Emotional Wellness',
    description: 'Monitors postpartum preeclampsia signs, intracranial pressure, tension headaches, and sensory changes.',
    color: '#7A9A8B',
    position3D: [0, 1.45, 0.15],
    primarySymptoms: [
      {
        id: 'headache_severe',
        name: 'Persistent Severe Throbbing Headache',
        description: 'Does not respond to acetaminophen; pulsatile behind the eyes.',
        isRedFlag: true,
        warningNotice: 'Potential sign of Postpartum Preeclampsia. Seek emergency triage.'
      },
      {
        id: 'vision_changes',
        name: 'Auras, Flashing Lights, or Blurred Vision',
        description: 'Sudden visual disturbances, blind spots, or double vision.',
        isRedFlag: true,
        warningNotice: 'Hypertensive crisis indicator. Immediate medical escalation required.'
      },
      {
        id: 'postpartum_fatigue',
        name: 'Tension Headache & Brain Fog',
        description: 'Dull band-like ache related to interrupted sleep and posture.',
        isRedFlag: false
      },
      {
        id: 'neck_stiffness',
        name: 'Neck & Upper Trapezius Soreness',
        description: 'Stiffness from nursing and holding infant for extended intervals.',
        isRedFlag: false
      }
    ]
  },
  {
    id: 'chest',
    name: 'Chest & Breasts Zone',
    subtitle: 'Lactation & Cardiopulmonary Health',
    description: 'Tracks breast tissue engorgement, duct patency, nipple integrity, and cardiopulmonary stability.',
    color: '#D97757',
    position3D: [0, 0.75, 0.35],
    primarySymptoms: [
      {
        id: 'chest_pain_sob',
        name: 'Sudden Sharp Chest Pain / Shortness of Breath',
        description: 'Pain worsens when breathing in, accompanied by rapid heartbeat.',
        isRedFlag: true,
        warningNotice: 'High-risk Pulmonary Embolism symptom. Immediate emergency evaluation required.'
      },
      {
        id: 'mastitis_fever',
        name: 'Wedge-Shaped Redness + Fever (>100.4°F / 38°C)',
        description: 'Hot, tender quadrant on breast with flu-like chills and body aches.',
        isRedFlag: true,
        warningNotice: 'Acute Mastitis infection. Requires timely antibiotic prescription.'
      },
      {
        id: 'duct_clog',
        name: 'Localized Firm Sore Lump (No Fever)',
        description: 'Blocked milk duct, localized soreness, relieved partially by nursing/warm compress.',
        isRedFlag: false
      },
      {
        id: 'nipple_soreness',
        name: 'Nipple Tenderness / Superficial Grazing',
        description: 'Initial discomfort during latch establishment, improving mid-feed.',
        isRedFlag: false
      }
    ]
  },
  {
    id: 'abdomen',
    name: 'Abdomen & Incision Zone',
    subtitle: 'C-Section Incision & Uterine Involution',
    description: 'Supervises transverse Pfannenstiel scar healing, fascial recovery, and uterine cramping/involution.',
    color: '#E29980',
    position3D: [0, 0.05, 0.38],
    primarySymptoms: [
      {
        id: 'incision_infection',
        name: 'Incision Dehiscence, Purulent Oozing, or Spreading Redness',
        description: 'Yellow/green discharge, separation of edges, or heat radiating from scar.',
        isRedFlag: true,
        warningNotice: 'Surgical site infection risk. Requires physician wound inspection today.'
      },
      {
        id: 'severe_abdominal_pain',
        name: 'Severe Rigid Abdominal Pain & Rebound Tenderness',
        description: 'Intense cramping that suddenly escalates beyond normal afterpains.',
        isRedFlag: true,
        warningNotice: 'Potential hematoma or peritoneal inflammation. Immediate review advised.'
      },
      {
        id: 'afterpains_involution',
        name: 'Mild Uterine Cramping During Breastfeeding',
        description: 'Oxytocin-triggered contractions returning uterus to pre-pregnancy size.',
        isRedFlag: false
      },
      {
        id: 'scar_itching_tingling',
        name: 'Incision Itching, Numbness & Prickling',
        description: 'Normal sensory nerve regeneration and cutaneous remodeling around scar.',
        isRedFlag: false
      }
    ]
  },
  {
    id: 'pelvic',
    name: 'Pelvic & Perineal Zone',
    subtitle: 'Lochia Progression & Pelvic Floor Healing',
    description: 'Assesses postpartum discharge stages (Rubra -> Serosa -> Alba), pelvic floor heaviness, and urinary continence.',
    color: '#8FB0A0',
    position3D: [0, -0.65, 0.25],
    primarySymptoms: [
      {
        id: 'hemorrhage_soaking',
        name: 'Soaking 1+ Heavy Maternity Pad per Hour',
        description: 'Continuous bright red flooding, passing clots larger than a golf ball.',
        isRedFlag: true,
        warningNotice: 'Secondary Postpartum Hemorrhage. Call Emergency Services / OB Triage immediately!'
      },
      {
        id: 'foul_lochia',
        name: 'Foul-Smelling Vaginal Discharge with Chills',
        description: 'Lochia with an offensive, putrid odor differing from normal metallic scent.',
        isRedFlag: true,
        warningNotice: 'High suspicion of Endometritis / uterine cavity infection. Urgent treatment needed.'
      },
      {
        id: 'normal_lochia_serosa',
        name: 'Brownish-Pink Moderate Discharge (Lochia Serosa)',
        description: 'Expected normal progression for Day 10–14 postpartum with minimal odor.',
        isRedFlag: false
      },
      {
        id: 'pelvic_heaviness',
        name: 'Mild Pelvic Floor Pressure / Fullness',
        description: 'Sensation of downward gravity when standing for long periods; eased by rest.',
        isRedFlag: false
      }
    ]
  }
];

export const MOCK_14_DAY_METRICS: DailyRecoveryMetric[] = [
  { day: 1, dateStr: 'Oct 12', painIndex: 8, lochiaStage: 'rubra', lochiaVolume: 'heavy', sleepHours: 3.5, fatigueLevel: 9, emotionalScore: 6, notes: 'Post-op recovery in hospital. IV analgesia.' },
  { day: 2, dateStr: 'Oct 13', painIndex: 7, lochiaStage: 'rubra', lochiaVolume: 'heavy', sleepHours: 4.0, fatigueLevel: 9, emotionalScore: 5, notes: 'Catheter removed. First gentle walking down hallway.' },
  { day: 3, dateStr: 'Oct 14', painIndex: 6, lochiaStage: 'rubra', lochiaVolume: 'moderate', sleepHours: 3.5, fatigueLevel: 8, emotionalScore: 5, notes: 'Discharged home. Milk coming in with breast fullness.' },
  { day: 4, dateStr: 'Oct 15', painIndex: 6, lochiaStage: 'rubra', lochiaVolume: 'moderate', sleepHours: 4.0, fatigueLevel: 9, emotionalScore: 4, notes: 'Day 4 hormonal dip (baby blues). Cried during 3 AM feed.' },
  { day: 5, dateStr: 'Oct 16', painIndex: 5, lochiaStage: 'rubra', lochiaVolume: 'moderate', sleepHours: 4.5, fatigueLevel: 8, emotionalScore: 5, notes: 'Stitch tape secure. Partner took over morning swaddle.' },
  { day: 6, dateStr: 'Oct 17', painIndex: 5, lochiaStage: 'rubra', lochiaVolume: 'moderate', sleepHours: 4.0, fatigueLevel: 7, emotionalScore: 6, notes: 'Incision itching began. Ice pack applied over dressing.' },
  { day: 7, dateStr: 'Oct 18', painIndex: 4, lochiaStage: 'serosa', lochiaVolume: 'light', sleepHours: 5.0, fatigueLevel: 7, emotionalScore: 7, notes: 'Lochia transitioned to pinkish-brown (Serosa). Good sign.' },
  { day: 8, dateStr: 'Oct 19', painIndex: 4, lochiaStage: 'serosa', lochiaVolume: 'light', sleepHours: 4.5, fatigueLevel: 7, emotionalScore: 7, notes: 'Pediatrician visit for Aarav. Weight gain confirmed!' },
  { day: 9, dateStr: 'Oct 20', painIndex: 3, lochiaStage: 'serosa', lochiaVolume: 'light', sleepHours: 5.5, fatigueLevel: 6, emotionalScore: 8, notes: 'Managed 2-hour uninterrupted afternoon nap. Felt human.' },
  { day: 10, dateStr: 'Oct 21', painIndex: 3, lochiaStage: 'serosa', lochiaVolume: 'light', sleepHours: 4.5, fatigueLevel: 6, emotionalScore: 7, notes: 'Gentle 10-minute porch walk. Scar intact, clean.' },
  { day: 11, dateStr: 'Oct 22', painIndex: 3, lochiaStage: 'serosa', lochiaVolume: 'spotting', sleepHours: 5.0, fatigueLevel: 5, emotionalScore: 8, notes: 'Lochia significantly tapered to spotting. Mood stable.' },
  { day: 12, dateStr: 'Oct 23', painIndex: 2, lochiaStage: 'serosa', lochiaVolume: 'spotting', sleepHours: 5.5, fatigueLevel: 5, emotionalScore: 8, notes: 'Today (Day 12). C-Section incision flat and pink. EPDS low risk.' },
];

export const MOCK_CAREGIVERS: CaregiverContact[] = [
  {
    id: 'cg-1',
    name: 'Arjun Sharma',
    relationship: 'Partner / Spouse',
    phone: '+91 98450 12345',
    email: 'arjun.sharma@example.com',
    isPrimarySOS: true
  },
  {
    id: 'cg-2',
    name: 'Sunita Sharma',
    relationship: 'Mother (Postpartum Doula Support)',
    phone: '+91 98450 67890',
    email: 'sunita.sharma@example.com',
    isPrimarySOS: false
  },
  {
    id: 'cg-3',
    name: 'Dr. Ananya Iyer Clinic',
    relationship: 'Primary Obstetrician-Gynecologist',
    phone: '+91 80 2234 5678',
    email: 'triage@cradleclinic.org',
    isPrimarySOS: false
  }
];

export const MOCK_OB_UNITS: ObstetricUnit[] = [
  {
    id: 'unit-1',
    name: 'Apollo Cradle Maternal Emergency Triage',
    distanceKm: 2.3,
    address: 'Plot 15, Koramangala 5th Block, Bangalore',
    phone: '+91 80 4935 0000',
    hasNICU: true,
    has24hrOB: true,
    estimatedDriveTimeMin: 8
  },
  {
    id: 'unit-2',
    name: 'Cloudnine Hospital 24/7 Obstetric Pavilion',
    distanceKm: 4.1,
    address: '1533, 9th Main Road, Jayanagar 3rd Block, Bangalore',
    phone: '+91 80 6792 9999',
    hasNICU: true,
    has24hrOB: true,
    estimatedDriveTimeMin: 14
  },
  {
    id: 'unit-3',
    name: 'Manipal Hospital Emergency & Labor Suite',
    distanceKm: 6.8,
    address: '98 HAL Old Airport Road, Kodihalli, Bangalore',
    phone: '+91 80 2502 4444',
    hasNICU: true,
    has24hrOB: true,
    estimatedDriveTimeMin: 22
  }
];

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j-3',
    date: 'October 23, 2026 (Day 12)',
    mood: 'peaceful',
    title: 'Finding Our Gentle Rhythm',
    content: 'Today felt noticeably easier. For the first time, getting out of bed did not make my lower abdomen wince. Aarav slept a clean 3-hour stretch after nursing. Arjun made warm ginger broth which felt comforting. Taking it one quiet hour at a time.',
    tags: ['C-Section Healing', 'Mindful Moments', 'Partner Care'],
    painLevel: 2,
    sleepHours: 5.5,
    isPrivateEncrypted: true
  },
  {
    id: 'j-2',
    date: 'October 19, 2026 (Day 8)',
    mood: 'hopeful',
    title: 'First Outing to Pediatrician',
    content: 'We braved our first short ride to the clinic. Aarav gained back his birth weight! The seatbelt lightly pressed on my incision so I used a small rolled pillow against my lap which helped immensely. Feeling proud of my body today.',
    tags: ['Milestone', 'Incision Comfort', 'Baby Weight'],
    painLevel: 4,
    sleepHours: 4.5,
    isPrivateEncrypted: true
  },
  {
    id: 'j-1',
    date: 'October 15, 2026 (Day 4)',
    mood: 'overwhelmed',
    title: 'The Hormonal Wave & Tears',
    content: 'The famous "Day 4 crash" arrived. Breast milk surged in with intense engorgement and tingling. I cried over spilled tea at 3 AM. Reading the MATRIQ guidance that this is a normal transient endocrine readjustment kept me anchored.',
    tags: ['Baby Blues', 'Lactation Surge', 'Emotional Wave'],
    painLevel: 6,
    sleepHours: 4.0,
    isPrivateEncrypted: true
  }
];

export const EPDS_QUESTIONS: EPDSQuestion[] = [
  {
    id: 1,
    question: '1. I have been able to laugh and see the funny side of things:',
    options: [
      { label: 'As much as I always could', score: 0 },
      { label: 'Not quite so much now', score: 1 },
      { label: 'Definitely not so much now', score: 2 },
      { label: 'Not at all', score: 3 }
    ]
  },
  {
    id: 2,
    question: '2. I have looked forward with enjoyment to things:',
    options: [
      { label: 'As much as I ever did', score: 0 },
      { label: 'Rather less than I used to', score: 1 },
      { label: 'Definitely less than I used to', score: 2 },
      { label: 'Hardly at all', score: 3 }
    ]
  },
  {
    id: 3,
    question: '3. I have blamed myself unnecessarily when things went wrong:',
    options: [
      { label: 'Yes, most of the time', score: 3 },
      { label: 'Yes, some of the time', score: 2 },
      { label: 'Not very often', score: 1 },
      { label: 'No, never', score: 0 }
    ]
  },
  {
    id: 4,
    question: '4. I have been anxious or worried for no good reason:',
    options: [
      { label: 'No, not at all', score: 0 },
      { label: 'Hardly ever', score: 1 },
      { label: 'Yes, sometimes', score: 2 },
      { label: 'Yes, very often', score: 3 }
    ]
  },
  {
    id: 5,
    question: '5. I have felt scared or panicky for no good reason:',
    options: [
      { label: 'Yes, quite a lot', score: 3 },
      { label: 'Yes, sometimes', score: 2 },
      { label: 'No, not much', score: 1 },
      { label: 'No, not at all', score: 0 }
    ]
  },
  {
    id: 6,
    question: '6. Things have been getting on top of me (feeling overwhelmed):',
    options: [
      { label: 'Yes, most of the time I haven’t been able to cope', score: 3 },
      { label: 'Yes, sometimes I haven’t been coping as well as usual', score: 2 },
      { label: 'No, most of the time I have coped quite well', score: 1 },
      { label: 'No, I have been coping as well as ever', score: 0 }
    ]
  },
  {
    id: 7,
    question: '7. I have been so unhappy that I have had difficulty sleeping:',
    options: [
      { label: 'Yes, most of the time', score: 3 },
      { label: 'Yes, sometimes', score: 2 },
      { label: 'Not very often', score: 1 },
      { label: 'No, not at all', score: 0 }
    ]
  },
  {
    id: 8,
    question: '8. I have felt sad or miserable:',
    options: [
      { label: 'Yes, most of the time', score: 3 },
      { label: 'Yes, quite often', score: 2 },
      { label: 'Not very often', score: 1 },
      { label: 'No, not at all', score: 0 }
    ]
  },
  {
    id: 9,
    question: '9. I have been so unhappy that I have been crying:',
    options: [
      { label: 'Yes, most of the time', score: 3 },
      { label: 'Yes, quite often', score: 2 },
      { label: 'Only occasionally', score: 1 },
      { label: 'No, never', score: 0 }
    ]
  },
  {
    id: 10,
    question: '10. The thought of harming myself or my baby has occurred to me:',
    options: [
      { label: 'Yes, quite often', score: 3 },
      { label: 'Sometimes', score: 2 },
      { label: 'Hardly ever', score: 1 },
      { label: 'Never', score: 0 }
    ]
  }
];

export const MOCK_BASELINE_EPDS: EPDSAssessment = {
  id: 'epds-day-10',
  date: 'October 21, 2026',
  answers: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 0, 6: 1, 7: 1, 8: 1, 9: 0, 10: 0 },
  totalScore: 7,
  q10Score: 0,
  riskLevel: 'low',
  clinicalGuidance: 'Your score of 7 reflects normal fourth-trimester adjustments and fatigue without significant depressive risk. Continue supportive daily routines and sleep protection.'
};

export const MOCK_VILLAGE_BROADCASTS: VillageBroadcast[] = [
  {
    id: 'vb-1',
    category: 'sleep',
    title: 'Need 2 Hours Uninterrupted Sleep',
    message: 'Aarav is fed and burped. Could someone take the swaddle shift from 2:00 PM to 4:00 PM so I can sleep deeply?',
    sentAt: 'Today at 1:15 PM',
    status: 'acknowledged',
    responses: [
      { responder: 'Arjun', message: 'I’m on it! Heading upstairs now.', time: '1:18 PM' }
    ]
  },
  {
    id: 'vb-2',
    category: 'meal',
    title: 'Need Warm Nourishing Meal',
    message: 'Craving warm khichdi or lentil soup with steamed veggies for dinner.',
    sentAt: 'Yesterday at 4:30 PM',
    status: 'acknowledged',
    responses: [
      { responder: 'Mom (Sunita)', message: 'Prepared fresh moong dal khichdi with ghee, dropping it off by 6 PM!', time: '4:45 PM' }
    ]
  },
  {
    id: 'vb-3',
    category: 'milestone',
    title: 'Recovery Milestone Reached!',
    message: 'Day 12 today! Incision is healing nicely and I walked around the courtyard in the morning sun!',
    sentAt: '2 days ago',
    status: 'acknowledged',
    responses: [
      { responder: 'Arjun', message: 'So proud of your strength Priya ❤️', time: '9:05 AM' },
      { responder: 'Sunita', message: 'Wonderful progress beti, keep resting!', time: '9:20 AM' }
    ]
  }
];
