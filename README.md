# MATRIQ — Intelligent Postpartum Recovery Companion

### Recovery deserves care, too. 🌿

MATRIQ is a maternal HealthTech prototype designed to support mothers during postpartum recovery through daily health check-ins, recovery trend visualization, emotional well-being tracking, personalized care planning, and safety-first escalation workflows.

While postnatal care often focuses on the newborn, MATRIQ brings the mother's physical and emotional recovery into focus through a supportive, accessible, and privacy-conscious digital experience.

> **Project status:** Prototype in development  
> **Category:** HealthTech · Maternal Wellness · AI-Assisted Care · Digital Health

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Safety and Privacy](#-safety-and-privacy)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Prototype Demonstration](#-prototype-demonstration)
- [Roadmap](#-roadmap)
- [Team Workflow](#-team-workflow)
- [Disclaimer](#-medical-disclaimer)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌸 Overview

Postpartum recovery is a critical phase involving physical healing, hormonal changes, sleep disruption, and emotional adjustment. Mothers may experience symptoms that are difficult to track over time or communicate during short clinical appointments.

**MATRIQ — Intelligent Postpartum Recovery Companion** aims to bridge this gap by providing a centralized digital platform for documenting recovery, identifying concerning patterns, organizing care, and facilitating communication with healthcare providers and trusted support networks.

### Our Vision

To make postpartum care more continuous, accessible, compassionate, and centered on the mother's well-being.

### Design Principles

- **Safety first:** Critical warning signs must never depend on AI response time.
- **Mother-centered care:** Supportive, non-judgmental, and easy-to-understand experiences.
- **Privacy by design:** Sensitive information must be handled with appropriate security controls.
- **Clinician collaboration:** Structured recovery summaries can support conversations with healthcare professionals.
- **Accessible technology:** Responsive interfaces, understandable language, and multilingual support.

---

## 🎯 Problem Statement

Postpartum mothers may face several challenges:

- Limited opportunities to communicate changes in recovery between medical appointments.
- Difficulty remembering daily symptoms, bleeding patterns, sleep, and mood changes.
- Limited visibility into recovery trends over multiple days.
- Emotional health concerns that may go unrecognized or remain unspoken.
- Fragmented communication between mothers, caregivers, and healthcare providers.
- Privacy concerns when recording sensitive emotional or health information.

Existing digital health experiences may address individual aspects of maternal care, but a unified, mother-centered recovery companion can help organize these activities in one place.

---

## 💡 Our Solution

MATRIQ brings postpartum recovery tracking, emotional wellness support, safety escalation, and care coordination into a unified web application.

The platform combines structured daily check-ins and deterministic safety rules with optional AI-assisted summaries, interactive recovery visualization, and clinical export capabilities.

Its goal is not to replace professional care, but to help mothers document their experiences and communicate them more effectively.

---

## ✨ Key Features

### 1. 🚨 SafeSpace — Safety-First Emergency Escalation

A dedicated emergency interface provides clear guidance when a user reports potentially serious postpartum warning signs.

- Deterministic, rule-based red-flag detection.
- High-visibility emergency overlay.
- Quick access to emergency calling and trusted support contacts.
- Guidance for symptoms such as heavy bleeding, chest pain, severe headache, vision changes, and thoughts of self-harm.
- Optional location-based care navigation and support notifications, subject to implementation and user consent.

**Design principle:** Critical warning checks operate independently of AI processing. AI must never delay or override emergency guidance.

### 2. 🧍 Interactive Recovery Map

An interactive body-zone interface helps mothers document discomfort and recovery observations.

- Head and neurological symptoms.
- Chest and breast-related discomfort.
- Abdomen and uterine recovery.
- Pelvic floor, perineal, and C-section incision areas.
- Tap-to-select symptom logging.
- Visual recovery history and timeline.

The visualization can use React Three Fiber for an abstract 3D experience or an accessible interactive SVG as a lightweight alternative.

### 3. 📊 Daily Check-ins and Recovery Trends

A structured check-in experience records daily observations, including:

- Physical discomfort on a 0–10 scale.
- Bleeding flow and reported concerns.
- Sleep duration and perceived restfulness.
- Fatigue and emotional state.
- Body-zone-specific symptoms.

Interactive charts help users review changes over time and prepare for conversations with healthcare professionals.

### 4. 💚 Emotional Well-being and Private Journaling

MATRIQ includes an emotional wellness module designed to encourage reflection and help users organize concerns.

- Mood tracking and emotional check-ins.
- Edinburgh Postnatal Depression Scale (EPDS) screening workflow.
- Supportive journaling with mood tags.
- Links to relevant professional and crisis resources.
- Optional client-side encryption for sensitive journal entries.

Screening results are not diagnoses. A high-risk result or a response indicating possible immediate danger must trigger appropriate safety guidance and professional support rather than relying on an automated score alone.

### 5. 🩺 Clinical Export — SBAR Doctor Summary

MATRIQ is designed to generate a concise, printable recovery summary for clinical appointments using the SBAR format:

- **S — Situation:** Current concern and reason for consultation.
- **B — Background:** Relevant postpartum context and recent history.
- **A — Assessment:** User-reported symptoms and recorded trends.
- **R — Recommendation / Request:** Questions or concerns the mother wants to discuss with her clinician.

The proposed export aggregates recent check-ins, including up to 14 days of observations, flagged concerns, and mood trends.

The report presents user-reported information and does not generate a medical diagnosis.

### 6. 🤝 Village Connect — Support Network

A consent-based support hub helps mothers communicate practical needs to trusted people.

Example status updates:

- “I need meals today.”
- “I need two hours of uninterrupted rest.”
- “I would appreciate help with household tasks.”
- “I'm feeling better today.”

Planned capabilities include invitation codes, secure sharing, caregiver access controls, and revocable permissions.

### 7. 🤖 MATRIQ Care Navigator

An AI-assisted companion designed to help users understand information and organize their recovery records.

Potential capabilities include:

- Plain-language explanations of general postpartum health information.
- Summaries of logged symptoms and changes over time.
- Translation into supported regional languages.
- Structured JSON responses for consistent application behavior.

AI-generated content is informational only. It must not diagnose conditions, replace emergency triage, or override deterministic safety rules.

---

## 🏗️ System Architecture

MATRIQ is designed around a modular, safety-first architecture.

```text
                 MATRIQ WEB APPLICATION
                          |
          +---------------+---------------+
          |               |               |
       Dashboard      Daily Check-in   Recovery Map
          |               |               |
          +---------------+---------------+
                          |
                   Safety Rule Engine
                          |
                +---------+---------+
                |                   |
          Red-Flag Alert       Routine Workflow
                |                   |
        Emergency Guidance    Recovery Data
                                    |
                      +-------------+-------------+
                      |             |             |
                   Database     Trend Engine    SBAR Export
                      |             |
                 Supabase      AI Summaries
                                    |
                              Gemini API
```

### Architectural Responsibilities

| Component | Responsibility |
|---|---|
| Next.js frontend | Application pages, navigation, and responsive user interface |
| Safety rule engine | Deterministic evaluation of configured warning signs |
| Supabase | Authentication, PostgreSQL storage, and optional realtime synchronization |
| Recovery analytics | Aggregation and visualization of user-recorded trends |
| Gemini integration | Optional summaries and plain-language explanations |
| Clinical export | Formatting recorded observations into a printable SBAR summary |
| Encryption module | Client-side encryption for supported private journal data |

The architecture separates emergency handling from AI-assisted workflows to reduce dependence on external model availability and latency.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend framework | Next.js 14, React, TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Interactive 3D | Three.js, React Three Fiber, Drei |
| Data visualization | Recharts |
| Authentication and database | Supabase, PostgreSQL |
| Access control | Supabase Row Level Security (RLS) |
| AI integration | Google Gemini API |
| State management | React Context or Zustand |
| Version control | Git and GitHub |

Technology choices describe the intended architecture. Actual dependencies and implemented integrations should be verified against the current codebase.

---

## 🔐 Safety and Privacy

MATRIQ handles sensitive maternal health information, so safety and privacy are core design requirements.

### Safety Principles

- Evaluate critical warning signs using deterministic rules before any optional AI workflow.
- Display clear emergency instructions without waiting for an AI response.
- Never treat an AI-generated summary as a clinical diagnosis.
- Ensure emergency actions remain visible and accessible on mobile devices.
- Avoid reassuring users that potentially serious symptoms are harmless.
- Provide appropriate escalation for self-harm concerns and other urgent warning signs.

### Privacy Principles

- Apply authentication and authorization to personal health records.
- Enforce database access controls through appropriately configured Supabase RLS policies.
- Keep service-role credentials and Gemini API keys on the server.
- Request explicit consent before sharing information with caregivers.
- Minimize the collection and retention of sensitive data.
- Design journal encryption so encryption keys are not stored alongside readable journal content.

**Important:** End-to-end encryption, secure sharing, and production-grade access controls require implementation and security testing. They should not be considered complete merely because they appear in the design.

---

## 📁 Project Structure

The intended Next.js application structure is:

```text
matriq/
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   ├── check-in/
│   │   ├── recovery/
│   │   ├── emotional-wellness/
│   │   ├── care-plan/
│   │   └── api/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── recovery-map/
│   │   ├── check-in/
│   │   ├── charts/
│   │   ├── emergency/
│   │   └── shared/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── safety-rules/
│   │   ├── encryption/
│   │   └── validation/
│   ├── services/
│   │   ├── ai/
│   │   ├── recovery/
│   │   └── clinical-export/
│   ├── types/
│   └── data/
│       └── mock-recovery-data.ts
├── supabase/
│   └── migrations/
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

This is a proposed structure. Adjust it to match the actual repository if its existing file organization differs.

---

## 🚀 Getting Started

### Prerequisites

Install the following tools:

- Node.js 20 or another version supported by the project's Next.js setup.
- npm.
- Git.
- A code editor such as Visual Studio Code or Antigravity.

Supabase and Gemini credentials are needed only for the corresponding integrations.

### 1. Clone the repository

```bash
git clone https://github.com/manya-rao/MATRIQ-.git
cd MATRIQ-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and add the credentials required by your implementation.

Refer to the [Environment Configuration](#-environment-configuration) section.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note:** These commands assume the repository is configured as a Next.js application. If the current prototype uses a different framework or entry point, follow the scripts defined in its `package.json`.

---

## ⚙️ Environment Configuration

Example `.env.example`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
```

### Security Guidelines

- Never commit `.env.local` or other files containing secrets.
- Keep `GEMINI_API_KEY` on the server.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.
- Use the appropriate current Supabase publishable-key configuration for new projects.
- Validate and authorize all server-side requests.
- Restrict database access with tested RLS policies.

Only add variables that the application actually uses.

---

## 🧪 Prototype Demonstration

The prototype is intended to support a demonstration journey such as:

1. Open the MATRIQ dashboard using seeded demonstration data.
2. Review the postpartum recovery timeline.
3. Complete a daily check-in.
4. Select a body zone and record a symptom.
5. Review recovery and mood trends.
6. Demonstrate deterministic emergency escalation using a controlled test case.
7. Review an example SBAR doctor summary.
8. Explore the emotional wellness module and support network.

Mock data should be clearly labeled as fictional demonstration data. Emergency scenarios must be tested without contacting real emergency services or sending real messages.

---

## 🗺️ Roadmap

### Phase 1 — Core Prototype

- [ ] Responsive dashboard and navigation.
- [ ] Daily postpartum check-in workflow.
- [ ] Recovery map and symptom logging.
- [ ] Recovery trend charts.
- [ ] Seeded demonstration data.
- [ ] Deterministic emergency warning interface.

### Phase 2 — Health and Care Workflows

- [ ] Emotional wellness screening workflow.
- [ ] Private journaling and encryption.
- [ ] SBAR clinical summary export.
- [ ] Personalized care checklist.
- [ ] Appointment management.

### Phase 3 — Integrations

- [ ] Supabase authentication and database persistence.
- [ ] Tested Row Level Security policies.
- [ ] Gemini-assisted summaries and translation.
- [ ] Consent-based caregiver sharing.
- [ ] Location-based care navigation.
- [ ] Accessible multilingual interface.

### Phase 4 — Validation and Deployment

- [ ] Unit and integration testing.
- [ ] Emergency rule verification.
- [ ] Security and privacy review.
- [ ] Accessibility testing.
- [ ] Mobile and cross-browser testing.
- [ ] Clinical review of safety-related content.
- [ ] Deployment monitoring and incident response planning.

Roadmap items are goals, not claims that those features are already implemented.

---

## 👥 Team Workflow

MATRIQ is designed for collaborative development using Git and GitHub.

### Recommended Workflow

1. Create a feature branch from the main branch.
2. Implement one feature or fix at a time.
3. Test the change locally.
4. Open a pull request with a clear description.
5. Review code, security implications, and tests.
6. Merge only after the required checks pass.

Example:

```bash
git checkout -b feature/daily-checkin
git add .
git commit -m "Add daily recovery check-in"
git push -u origin feature/daily-checkin
```

Use pull requests to keep the main branch stable and make collaboration easier.

---

## ⚠️ Medical Disclaimer

MATRIQ is a prototype intended to support postpartum recovery tracking, education, and communication with healthcare professionals.

It is **not a medical device, diagnostic system, or substitute for professional medical care**. Screening scores and AI-generated summaries must not be used as standalone diagnoses.

Potentially serious symptoms require prompt professional evaluation. Emergency guidance must not be delayed while completing a check-in or waiting for AI processing.

All safety-critical content, clinical workflows, privacy controls, and emergency integrations require appropriate validation before real-world deployment.

---

## 🤝 Contributing

Contributions that improve usability, accessibility, privacy, testing, and reliability are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes.
4. Run the relevant tests.
5. Submit a pull request describing the change and its impact.

For safety-related features, include test cases covering both expected alerts and failure scenarios.

---

## 📄 License

A license has not yet been specified. Add an appropriate `LICENSE` file before distributing or reusing the project publicly.

---

## 🌿 MATRIQ

**Recovery deserves care, too.**

Building a more compassionate postpartum experience through thoughtful design, responsible technology, and mother-centered care.
