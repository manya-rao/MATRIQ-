MATRIQ — Intelligent Postpartum Recovery Companion

Tagline: Recovery deserves care, too.

MATRIQ is an AI-assisted, WebGL-powered postpartum health technology platform designed specifically for mothers in the critical fourth trimester. Unlike traditional pregnancy or baby-tracking applications, MATRIQ places the mother's physiological recovery, psychological well-being, and urgent safety at the center of the clinical workflow.

Key Differentiators & Core Features
1. Interactive 3D WebGL Recovery Zone Map
Built using React Three Fiber and Three.js, featuring an abstract, non-intimidating 3D anatomical model.

Includes 4 interactive 3D glowing hotspots (Head & Neck, Chest & Breasts, Abdomen & Uterus, Pelvic & Perineal) with smooth camera transitions for quick, zone-based symptom logging.

2. Deterministic "SafeSpace" Emergency Escalation System
Bypasses LLM processing latency entirely to prioritize maternal safety.

Instantly detects severe red-flag symptoms (hemorrhage indicators, severe preeclampsia signs, postpartum psychosis) via a hardcoded medical rule engine.

Triggers 1-tap emergency SOS dialing, GPS routing to the nearest obstetric unit, and SMS alerts to a designated support network.

3. 14-Day Dynamic Recovery Analytics
Interactive canvas charts tracking physical discomfort, lochia progression, sleep restoration, and emotional indices over time.

Uses structured Gemini AI prompts to synthesize daily check-ins into 2-sentence clinical progress summaries.

4. EPDS Clinical Mental Health Screening & Encrypted Journal
Full 10-question Edinburgh Postnatal Depression Scale (EPDS) screening tool with automatic risk stratification (Low, Moderate, High).

Features client-side zero-knowledge encrypted journaling for emotional privacy.

5. 1-Click "SBAR" Clinical Doctor Briefing Generator
Automatically packages multi-week recovery data, symptom logs, and EPDS trends into a standardized SBAR (Situation, Background, Assessment, Recommendation) PDF format for quick review during 10-minute postpartum checkups.

6. Support Network Hub ("Village Connect")
A consent-driven broadcast portal enabling mothers to request immediate assistance ("Need meals", "Need 2 hours of quiet sleep", "Need emotional check-in") from family and caregivers.

Tech Stack & System Architecture
┌────────────────────────────────────────────────────────────────────────┐
│                        MATRIQ Frontend (Web / PWA)                      │
│   Next.js 14 (App Router) + Tailwind CSS + Framer Motion + Three.js   │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│        Deterministic Safety Layer    │  │    AI / LLM Processing Layer │
│   Rule Engine (Hardcoded Medical     │  │   Gemini 1.5 Pro / Flash API │
│   Red-Flags & EPDS Scoring Rules)    │  │   (Trend Summaries, NLP,     │
└───────────────────┬──────────────────┘  │    Language Translations)    │
                    │                     └──────────────┬───────────────┘
                    │                                    │
                    └───────────────────┬────────────────┘
                                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Backend & Database Stack                        │
│            Next.js API Routes + Supabase (PostgreSQL, Auth)            │
└────────────────────────────────────────────────────────────────────────┘
Frontend Framework: Next.js 14 (App Router), TypeScript, Tailwind CSS

3D & UI Motion: @react-three/fiber, @react-three/drei, framer-motion, lucide-react

Data Visualization: recharts

Database & Auth: Supabase (PostgreSQL, RLS policies)

AI Processing: Google Gemini API (Structured JSON mode)

Getting Started
Prerequisites
Node.js: v18.17.0 or higher

npm or pnpm installed

Installation & Local Setup
Clone the Repository:

Bash
git clone https://github.com/your-username/matriq-prototype.git
cd matriq-prototype
Install Dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env.local file in the root directory and add your API keys:

Code snippet
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
Run the Development Server:

Bash
npm run dev
Open http://localhost:3000 in your browser to view the application.

License
Distributed under the MIT License. See LICENSE for details.
