// EduWealth AI - Central State Store & Demo Data
// Manages reactive application state, local storage persistence, and dynamic calculations

const EDU_STORAGE_KEY = 'eduwealth_state_v1';

const DEFAULT_STATE = {
  user: {
    name: 'Manya',
    age: 20,
    educationLevel: 'Undergraduate',
    college: 'National Institute of Technology',
    course: 'Computer Science & Economics',
    monthlyIncome: 15000,
    monthlyExpenses: 6000,
    currentSavings: 9000,
    accumulatedSavings: 20000,
    primaryGoal: 'Reach ₹1,00,000 in 24 months',
    primaryGoalTarget: 100000,
    primaryGoalMonths: 24,
    healthScore: 78,
    learningScore: 720,
    levelName: 'Prudent Builder',
    levelNumber: 4,
    theme: 'dark', // default modern fintech dark theme
    onboardingComplete: true
  },
  badges: [
    { id: 'b1', name: 'First Saver', icon: '🏅', desc: 'Saved your first ₹5,000', unlocked: true, unlockedAt: '2026-08-15' },
    { id: 'b2', name: 'Budget Master', icon: '🏆', desc: 'Maintained 50/30/20 budget for 30 days', unlocked: true, unlockedAt: '2026-08-28' },
    { id: 'b3', name: 'Scam Detective', icon: '🕵️‍♂️', desc: 'Passed all scam awareness tests with 100%', unlocked: true, unlockedAt: '2026-09-02' },
    { id: 'b4', name: 'Investment Explorer', icon: '🚀', desc: 'Executed 5 virtual simulated trades', unlocked: true, unlockedAt: '2026-09-05' },
    { id: 'b5', name: 'Wealth Planner', icon: '👑', desc: 'Set up 3 distinct financial wealth goals', unlocked: false, unlockedAt: null }
  ],
  expenses: [
    { id: 'exp-1', name: 'Campus Cafeteria & Groceries', amount: 3000, category: 'Food', date: '2026-09-02' },
    { id: 'exp-2', name: 'Metro & Bus Pass', amount: 1500, category: 'Travel', date: '2026-09-04' },
    { id: 'exp-3', name: 'Coding Books & Supplies', amount: 1000, category: 'Shopping', date: '2026-09-05' },
    { id: 'exp-4', name: 'Mobile Recharge & Wi-Fi', amount: 500, category: 'Other', date: '2026-09-07' }
  ],
  budget: {
    income: 15000,
    needs: 8000,
    wants: 3000,
    savings: 2500,
    emergencyFund: 1500
  },
  portfolio: {
    initialCash: 10000,
    cash: 3500,
    holdings: [
      { id: 'ast-1', symbol: 'NXT-TECH', name: 'NXT Tech Fund (Stock A)', type: 'Stock', shares: 15, avgBuyPrice: 180, currentPrice: 210, changePct: 16.7 },
      { id: 'ast-2', symbol: 'GREEN-SOL', name: 'GreenEnergy Solutions (Stock B)', type: 'Stock', shares: 10, avgBuyPrice: 120, currentPrice: 135, changePct: 12.5 },
      { id: 'ast-3', symbol: 'BLUE-IDX', name: 'Bluechip Growth Index (Mutual Fund A)', type: 'Mutual Fund', shares: 8, avgBuyPrice: 250, currentPrice: 260, changePct: 4.0 },
      { id: 'ast-4', symbol: 'SOV-SHLD', name: 'Sovereign Shield 7.5% (Bond A)', type: 'Bond', shares: 5, avgBuyPrice: 150, currentPrice: 155, changePct: 3.3 }
    ],
    tradeHistory: [
      { id: 'trd-1', symbol: 'NXT-TECH', type: 'BUY', shares: 15, price: 180, total: 2700, date: '2026-09-01' },
      { id: 'trd-2', symbol: 'GREEN-SOL', type: 'BUY', shares: 10, price: 120, total: 1200, date: '2026-09-03' },
      { id: 'trd-3', symbol: 'BLUE-IDX', type: 'BUY', shares: 8, price: 250, total: 2000, date: '2026-09-04' },
      { id: 'trd-4', symbol: 'SOV-SHLD', type: 'BUY', shares: 5, price: 150, total: 750, date: '2026-09-06' }
    ]
  },
  availableAssets: [
    { id: 'ast-1', symbol: 'NXT-TECH', name: 'NXT Tech Fund (Stock A)', type: 'Stock', price: 210, risk: 'High', description: 'Simulated high-growth index tracking innovation & software firms.', returnYTD: '+18.2%' },
    { id: 'ast-2', symbol: 'GREEN-SOL', name: 'GreenEnergy Solutions (Stock B)', type: 'Stock', price: 135, risk: 'Medium-High', description: 'Fictional clean energy developer with steady revenue growth.', returnYTD: '+12.5%' },
    { id: 'ast-3', symbol: 'BLUE-IDX', name: 'Bluechip Growth Index (Mutual Fund A)', type: 'Mutual Fund', price: 260, risk: 'Moderate', description: 'Simulated basket of top 50 established corporations.', returnYTD: '+9.4%' },
    { id: 'ast-4', symbol: 'SOV-SHLD', name: 'Sovereign Shield 7.5% (Bond A)', type: 'Bond', price: 155, risk: 'Low', description: 'Virtually guaranteed yield paper mimicking sovereign treasury bonds.', returnYTD: '+7.5%' }
  ],
  goals: [
    { id: 'goal-1', title: 'Wealth Starter Milestone', category: 'Build savings', targetAmount: 100000, currentAmount: 20000, deadlineMonths: 24, icon: '🎯', isPrimary: true },
    { id: 'goal-2', title: 'Emergency Cushion', category: 'Emergency fund', targetAmount: 30000, currentAmount: 18000, deadlineMonths: 6, icon: '🛡️', isPrimary: false },
    { id: 'goal-3', title: 'New Coding Laptop', category: 'Buy something', targetAmount: 60000, currentAmount: 27000, deadlineMonths: 10, icon: '💻', isPrimary: false },
    { id: 'goal-4', title: 'Higher Ed & Certifications', category: 'Education', targetAmount: 200000, currentAmount: 30000, deadlineMonths: 36, icon: '🎓', isPrimary: false }
  ],
  courses: [
    {
      id: 'course-1',
      title: 'Money Management',
      icon: 'wallet',
      category: 'Foundation',
      level: 'Beginner',
      xp: 150,
      progress: 100,
      completed: true,
      description: 'Master income tracking, cash flows, and separate true needs from lifestyle wants.',
      lessons: [
        { id: 'l1-1', title: 'Understanding Income & Cash Flow', duration: '5 min', read: true, content: 'Income is the fuel of your financial engine. For students, this includes pocket money, internships, freelance gigs, or stipends. The first rule of wealth building is simple: Cash in must consistently exceed Cash out.' },
        { id: 'l1-2', title: 'Needs vs. Wants: The Student Lens', duration: '6 min', read: true, content: 'Needs are essentials for survival and education: hostel rent, mess fees, course books, basic travel. Wants are lifestyle upgrades: frequent restaurant dining, luxury sneakers, daily cab rides. Prioritizing needs builds the foundation for compound savings.' },
        { id: 'l1-3', title: 'Budgeting Basics: The 50/30/20 Rule', duration: '7 min', read: true, content: 'The 50/30/20 rule allocates 50% of income to Needs, 30% to Wants, and 20% to Savings/Investing. For students with lower fixed costs, aiming for 50% Needs, 20% Wants, and 30% Savings/Emergency fund accelerates wealth generation dramatically.' }
      ],
      quiz: {
        id: 'q1',
        title: 'Money Management Mastery Quiz',
        questions: [
          {
            q: 'Which of the following is considered a NEED for a college student?',
            options: ['Weekend cinema tickets', 'Semester exam study textbook', 'Premium coffee subscription', 'Branded designer backpack'],
            answer: 1,
            explanation: 'Course textbooks and study materials are educational necessities (Needs).'
          },
          {
            q: 'Under the classic 50/30/20 budgeting rule, what does the 20% represent?',
            options: ['Discretionary entertainment', 'Dining out with friends', 'Savings and debt repayment', 'Rent and utility bills'],
            answer: 2,
            explanation: 'The 20% slice is strictly reserved for building savings, emergency funds, and investing.'
          },
          {
            q: 'If your monthly allowance is ₹15,000 and your expenses are ₹6,000, what is your savings rate?',
            options: ['40%', '60%', '25%', '50%'],
            answer: 1,
            explanation: 'Savings = ₹15,000 - ₹6,000 = ₹9,000. Savings rate = (9,000 / 15,000) * 100 = 60%.'
          }
        ]
      }
    },
    {
      id: 'course-2',
      title: 'Saving & Emergency Funds',
      icon: 'piggy-bank',
      category: 'Foundation',
      level: 'Beginner',
      xp: 150,
      progress: 100,
      completed: true,
      description: 'Build your financial safety net, learn painless saving strategies, and master the 30-day rule.',
      lessons: [
        { id: 'l2-1', title: 'Why Every Student Needs an Emergency Cushion', duration: '5 min', read: true, content: 'An emergency fund protects you from unexpected setbacks—a broken phone screen, sudden medical expense, or urgent travel home. Having 3-6 months of basic expenses in a high-yield liquid account prevents you from taking costly predatory loans.' },
        { id: 'l2-2', title: 'Painless Saving Strategies & The 30-Day Rule', duration: '6 min', read: true, content: 'When tempted to buy a non-essential item over ₹1,000, wait 30 days. If you still genuinely need it after 30 days, make the purchase. 80% of impulse buying urges dissolve within the first week.' },
        { id: 'l2-3', title: 'Automating Your Savings: Pay Yourself First', duration: '5 min', read: true, content: 'Do not save what is left after spending; instead, spend what is left after saving! The moment allowance or stipend hits your account, transfer your savings target immediately to a separate fund.' }
      ],
      quiz: {
        id: 'q2',
        title: 'Savings & Emergency Fund Quiz',
        questions: [
          {
            q: 'What is the recommended size of an emergency fund for young adults?',
            options: ['1 week of pocket money', '3 to 6 months of essential living expenses', '10 years of salary', 'Exactly ₹10,000'],
            answer: 1,
            explanation: '3 to 6 months of essential living expenses provides an optimal safety cushion without locking too much cash from long-term investments.'
          },
          {
            q: 'What is the "Pay Yourself First" principle?',
            options: ['Spend on luxury goods before paying tuition', 'Transfer savings immediately upon receiving income before spending', 'Wait until month end to save whatever remains', 'Borrow money to buy gadgets'],
            answer: 1,
            explanation: 'Paying yourself first guarantees that your wealth-building goals are funded before lifestyle expenses creep in.'
          }
        ]
      }
    },
    {
      id: 'course-3',
      title: 'Credit & Loans',
      icon: 'credit-card',
      category: 'Core',
      level: 'Intermediate',
      xp: 180,
      progress: 66,
      completed: false,
      description: 'Demystify credit scores, interest rate math, good vs. risky debt, and avoid instant loan traps.',
      lessons: [
        { id: 'l3-1', title: 'What is a Credit Score and Why It Matters', duration: '6 min', read: true, content: 'A credit score (like CIBIL, 300-900) measures your reliability in repaying debt. A score above 750 unlocks lower interest rates on educational loans, car loans, and future mortgages.' },
        { id: 'l3-2', title: 'Interest Compounding: Friend or Foe?', duration: '7 min', read: true, content: 'When you invest, compounding multiplies your wealth. When you borrow on credit cards (often 36-48% p.a. interest), compounding works against you like an anchor pulling you into debt.' },
        { id: 'l3-3', title: 'Good Debt vs. Risky Debt', duration: '5 min', read: false, content: 'Good debt generates long-term value that exceeds the borrowing cost (e.g. affordable student loan for a high-ROI degree). Risky debt finances depreciating lifestyle desires (e.g. BNPL financing for parties or designer clothes).' },
        { id: 'l3-4', title: 'Spotting Instant Loan App Traps', duration: '6 min', read: false, content: 'Illegal instant loan apps advertise "5-minute cash with no documents." They extract your phone contacts, charge 50-100% upfront fees, and use aggressive extortion. Never download unverified lending apps.' }
      ],
      quiz: {
        id: 'q3',
        title: 'Credit & Debt Literacy Quiz',
        questions: [
          {
            q: 'What is a good CIBIL credit score range in India?',
            options: ['100 - 300', '400 - 550', '750 - 900', 'Above 1,200'],
            answer: 2,
            explanation: 'A score of 750+ is widely considered prime by financial institutions.'
          },
          {
            q: 'Why are Buy-Now-Pay-Later (BNPL) schemes risky for impulse purchases?',
            options: ['They always give free money', 'They normalize borrowing for non-essentials and trigger heavy penalty interest if missed', 'They increase your GPA', 'They are illegal'],
            answer: 1,
            explanation: 'BNPL creates an illusion of affordability, leading to overspending and steep late payment penalties.'
          }
        ]
      }
    },
    {
      id: 'course-4',
      title: 'Taxes & Young Earners',
      icon: 'receipt',
      category: 'Practical',
      level: 'Intermediate',
      xp: 160,
      progress: 50,
      completed: false,
      description: 'Understand salary deductions, basic tax slabs, why filing ITR matters, and tax-saving avenues.',
      lessons: [
        { id: 'l4-1', title: 'Basic Tax Concepts for First-Time Earners', duration: '5 min', read: true, content: 'Income tax is a contribution to nation building deducted from your earnings. In India, individuals earning up to ₹7,00,000 under the New Tax Regime enjoy zero net tax liability thanks to Section 87A rebate.' },
        { id: 'l4-2', title: 'Understanding Salary Slips & CTC vs. In-Hand', duration: '7 min', read: false, content: 'Cost to Company (CTC) includes gross salary, PF contributions, gratuity, and allowances. Your in-hand take-home salary is Gross minus employee PF (12%) and Professional Tax.' },
        { id: 'l4-3', title: 'Why Students Should File a Zero ITR', duration: '5 min', read: false, content: 'Filing an Income Tax Return (ITR) even with zero tax liability creates an official financial track record. It helps in visa approvals, securing higher education loans, and reclaiming TDS on freelance income.' }
      ],
      quiz: {
        id: 'q4',
        title: 'Taxes Demystified Quiz',
        questions: [
          {
            q: 'Under the New Tax Regime in India, what is the rebate threshold where net tax is nil?',
            options: ['₹2,50,000', '₹5,00,000', '₹7,00,000', '₹15,00,000'],
            answer: 2,
            explanation: 'Under the New Tax Regime, taxable income up to ₹7 Lakhs qualifies for full tax rebate under Section 87A.'
          }
        ]
      }
    },
    {
      id: 'course-5',
      title: 'Investing & Wealth Building',
      icon: 'trending-up',
      category: 'Wealth',
      level: 'Advanced',
      xp: 220,
      progress: 40,
      completed: false,
      description: 'Stocks, mutual funds, index funds, bonds, asset allocation, and the power of compounding.',
      lessons: [
        { id: 'l5-1', title: 'Beating Inflation: Why Cash Loses Value', duration: '6 min', read: true, content: 'Inflation (typically 5-7% per year) erodes purchasing power. A ₹100 grocery basket today will cost ₹140 in five years. Leaving all money in a standard savings account (2.5-3%) guarantees real wealth loss. Investing is essential to beat inflation.' },
        { id: 'l5-2', title: 'Stocks, Mutual Funds, and Index Funds Explained', duration: '8 min', read: true, content: 'Stocks represent fractional ownership in a business. Mutual funds pool money from many investors managed by a fund manager. Index funds (like Nifty 50 or Sensex) passively track the top 50 companies with ultra-low fees, making them ideal for young beginners.' },
        { id: 'l5-3', title: 'Risk vs. Return & Time Horizon', duration: '6 min', read: false, content: 'Higher potential returns always carry higher short-term volatility. Stocks fluctuate daily, but over 10-15 year horizons, broad equity indices have historically generated 11-13% annual returns.' },
        { id: 'l5-4', title: 'Diversification: Never Put All Eggs in One Basket', duration: '6 min', read: false, content: 'Spread your investments across equities, fixed income (bonds/PPF), and emergency cash. When one asset underperforms, others stabilize your portfolio.' }
      ],
      quiz: {
        id: 'q5',
        title: 'Investment Fundamentals Quiz',
        questions: [
          {
            q: 'Why are low-cost broad index funds often recommended for beginners?',
            options: ['They guarantee 50% returns in 3 days', 'They offer automatic diversification across top companies with minimal expense ratio', 'They require no research or long-term patience', 'They are managed by celebrities'],
            answer: 1,
            explanation: 'Broad index funds hold dozens of top companies, reducing single-company risk at minimal expense.'
          },
          {
            q: 'What happens to cash held in a savings account when inflation is 6% and interest is 3%?',
            options: ['Purchasing power increases', 'Purchasing power drops by ~3% per year in real terms', 'Value stays identical', 'Money disappears'],
            answer: 1,
            explanation: 'Real Return = Nominal Return (3%) - Inflation (6%) = -3% loss in real purchasing power.'
          }
        ]
      }
    },
    {
      id: 'course-6',
      title: 'Financial Safety & Scam Defense',
      icon: 'shield-check',
      category: 'Protection',
      level: 'Essential',
      xp: 200,
      progress: 90,
      completed: false,
      description: 'Defend against phishing, Ponzi schemes, fake scholarship links, OTP fraud, and gambling apps.',
      lessons: [
        { id: 'l6-1', title: 'The Anatomy of a Financial Scam', duration: '6 min', read: true, content: 'Every financial scam exploits two human emotions: Fear (account blocked, legal notice) or Greed (guaranteed 200% returns, double your money in 24 hours). If an offer sounds too good to be true, it is 100% a scam.' },
        { id: 'l6-2', title: 'Phishing, Fake Job Portals & Scholarship Scams', duration: '7 min', read: true, content: 'Scammers target college students with fake part-time data entry jobs or urgent government scholarship claims. They ask for registration fees or UPI PINs. Remember: You NEVER enter your UPI PIN to RECEIVE money!' },
        { id: 'l6-3', title: 'Gambling & Color Prediction Apps vs. Investing', duration: '6 min', read: true, content: 'Color prediction apps, online rummy, and binary options are structured like casinos where the house always wins. They are rigged algorithms designed to induce dopamine loops and financial ruin.' },
        { id: 'l6-4', title: 'What to Do If You Encounter a Fraud', duration: '5 min', read: true, content: '1. Never share OTP or UPI PIN. 2. Freeze compromised cards immediately. 3. Report financial cyber fraud immediately to National Cyber Crime helpline 1930 (cybercrime.gov.in).' }
      ],
      quiz: {
        id: 'q6',
        title: 'Financial Safety & Defense Quiz',
        questions: [
          {
            q: 'When do you need to enter your 4-digit or 6-digit UPI PIN?',
            options: ['To receive a scholarship refund', 'To accept money from a friend', 'ONLY when deducting money to make a payment or transfer', 'To verify your identity'],
            answer: 2,
            explanation: 'UPI PIN is strictly an authorization for DEBITING funds from your account. You NEVER enter a PIN to receive funds.'
          },
          {
            q: 'A Telegram group promises: "Invest ₹2,000 and get ₹6,000 guaranteed profit in 24 hours." What is this?',
            options: ['A legitimate high-yield crypto hedge fund', 'A classic Ponzi/Advance Fee fraud', 'A government sponsored youth scheme', 'A guaranteed arbitrage'],
            answer: 1,
            explanation: 'No legitimate investment can guarantee 200% returns in 24 hours. This is an advance-fee Ponzi scam.'
          }
        ]
      }
    }
  ],
  scamScenarios: [
    {
      id: 'scam-1',
      sender: 'Telegram: "VIP Crypto Elite Wealth Club"',
      message: '🔥 EXCLUSIVE STUDENT OPPORTUNITY: Invest ₹2,500 now in our algorithmic AI crypto arbitrage pool and withdraw ₹7,500 guaranteed profit within 12 hours! Only 3 spots left! Transfer to UPI: vipwealth@fakebank',
      isScam: true,
      redFlags: [
        'Guaranteed extraordinary return (300% in 12 hours)',
        'Artificial urgency ("Only 3 spots left!")',
        'Anonymous messaging channel with no regulatory license (SEBI/RBI)',
        'Direct transfer to an individual UPI address'
      ],
      explanation: 'Classic advance-fee Ponzi scam. Once you transfer the ₹2,500, the admin will block you or ask for a "processing release fee" of ₹5,000.'
    },
    {
      id: 'scam-2',
      sender: 'HDFC Bank Official SMS (Shortcode: HDFCBK)',
      message: 'Dear Customer, your quarterly savings account interest of ₹184 has been credited to A/C ending in 4092 on 01-Sep. Available balance is ₹9,284. For any dispute, call our official toll-free number 1800-202-6161.',
      isScam: false,
      redFlags: [],
      explanation: 'Safe and authentic. Standard bank informational notification. It does not ask for passwords, contains no suspicious links, and provides an official verified toll-free contact.'
    },
    {
      id: 'scam-3',
      sender: 'WhatsApp: "+1 (849) 392-4912" (HR - TechHire Global)',
      message: 'Congratulations Manya! You have been selected for Part-Time Google Review Evaluator job! Earn ₹3,000 to ₹5,000 daily working 30 mins from home. Please pay a refundable training kit deposit of ₹999 via UPI to activate your portal login.',
      isScam: true,
      redFlags: [
        'Unsolicited job offer from an international unknown number',
        'Unrealistic compensation (₹5,000 for 30 minutes of low-skill work)',
        'Requirement to pay money upfront to get a job'
      ],
      explanation: 'Legitimate employers never ask candidates to pay an upfront "registration", "equipment", or "training" fee. This is a task-based scam.'
    },
    {
      id: 'scam-4',
      sender: 'SMS: "SBI-KYC-ALERT"',
      message: 'URGENT: Your SBI Account will be SUSPENDED within 24 hours due to pending KYC update! Click immediately to verify your Aadhaar and PAN: http://sbi-kyc-update-portal.online/auth',
      isScam: true,
      redFlags: [
        'Panic & extreme urgency ("Account will be suspended in 24 hours")',
        'Suspicious non-government, non-bank URL domain (.online/auth instead of official onlinesbi.sbi)',
        'Banks never send links asking users to input net banking passwords or OTPs'
      ],
      explanation: 'Phishing website designed to capture your netbanking credentials and OTP to drain your account.'
    },
    {
      id: 'scam-5',
      sender: 'Official College Notice Board & Portal',
      message: 'Notice: National Merit Scholarship 2026 portal is now open on official government website scholarships.gov.in. Eligible students may apply using their DigiLocker credentials before 30th September. No fee is charged.',
      isScam: false,
      redFlags: [],
      explanation: 'Safe and legitimate. Points directly to the official government portal (.gov.in) and explicitly states that no fee is charged.'
    }
  ],
  ecoWealth: {
    electricityMonthly: 1500,
    electricityReduction: 300,
    waterMonthly: 500,
    waterReduction: 150,
    transportMonthly: 2000,
    transportReduction: 600,
    expectedReturnRate: 11, // % annual compound growth
    projectionYears: 5
  },
  notifications: [
    { id: 'notif-1', title: 'Savings Target On Track', message: '💡 You are close to reaching your monthly savings target of ₹9,000!', time: '2 hours ago', unread: true, type: 'insight' },
    { id: 'notif-2', title: 'Academy Bonus Available', message: '🎓 Complete the Investment Basics lesson to earn 50 XP and advance to Level 5.', time: '5 hours ago', unread: true, type: 'academy' },
    { id: 'notif-3', title: 'New Safety Challenge', message: '🛡️ Spot the Scam: Can you identify 5 deceptive messages? Earn the Scam Detective badge.', time: '1 day ago', unread: false, type: 'safety' },
    { id: 'notif-4', title: 'Goal Milestone Approaching', message: '🎯 You are 42% closer to your ₹1 lakh wealth goal! Keep your spending within budget.', time: '2 days ago', unread: false, type: 'goal' }
  ],
  chatMessages: [
    { sender: 'ai', text: 'Hello Manya! 👋 I am **EduWealth AI Coach**, your personal guide to building real financial confidence and wealth. How can I help you optimize your money today?', timestamp: '10:00 AM' }
  ]
};

class EduStateManager {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(EDU_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            user: { ...DEFAULT_STATE.user, ...(parsed.user || {}) },
            badges: Array.isArray(parsed.badges) && parsed.badges.length ? parsed.badges : DEFAULT_STATE.badges,
            expenses: Array.isArray(parsed.expenses) ? parsed.expenses : DEFAULT_STATE.expenses,
            budget: { ...DEFAULT_STATE.budget, ...(parsed.budget || {}) },
            portfolio: {
              ...DEFAULT_STATE.portfolio,
              ...(parsed.portfolio || {}),
              holdings: Array.isArray(parsed.portfolio?.holdings) ? parsed.portfolio.holdings : DEFAULT_STATE.portfolio.holdings,
              tradeHistory: Array.isArray(parsed.portfolio?.tradeHistory) ? parsed.portfolio.tradeHistory : DEFAULT_STATE.portfolio.tradeHistory
            },
            availableAssets: Array.isArray(parsed.availableAssets) && parsed.availableAssets.length ? parsed.availableAssets : DEFAULT_STATE.availableAssets,
            goals: Array.isArray(parsed.goals) && parsed.goals.length ? parsed.goals : DEFAULT_STATE.goals,
            courses: Array.isArray(parsed.courses) && parsed.courses.length ? parsed.courses : DEFAULT_STATE.courses,
            scamScenarios: Array.isArray(parsed.scamScenarios) && parsed.scamScenarios.length ? parsed.scamScenarios : DEFAULT_STATE.scamScenarios,
            ecoWealth: { ...DEFAULT_STATE.ecoWealth, ...(parsed.ecoWealth || {}) },
            notifications: Array.isArray(parsed.notifications) ? parsed.notifications : DEFAULT_STATE.notifications,
            chatMessages: Array.isArray(parsed.chatMessages) && parsed.chatMessages.length ? parsed.chatMessages : DEFAULT_STATE.chatMessages
          };
        }
      }
    } catch (e) {
      console.warn('Could not load stored state, falling back to default:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(EDU_STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
    this.notify();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => {
      try {
        fn(this.state);
      } catch (err) {
        console.error('State subscriber error:', err);
      }
    });
  }

  resetDemoData() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
  }

  // --- Profile / User updates ---
  updateUser(updates) {
    this.state.user = { ...this.state.user, ...updates };
    this.recalculateHealthScore();
    this.saveState();
  }

  setTheme(theme) {
    this.state.user.theme = theme;
    this.saveState();
  }

  // --- Expense Tracker ---
  addExpense(expense) {
    const newExpense = {
      id: 'exp-' + Date.now(),
      name: expense.name.trim(),
      amount: parseFloat(expense.amount),
      category: expense.category || 'Other',
      date: expense.date || new Date().toISOString().split('T')[0]
    };
    this.state.expenses.unshift(newExpense);
    this.recalculateFinancials();
    this.saveState();
    return newExpense;
  }

  deleteExpense(id) {
    this.state.expenses = this.state.expenses.filter(e => e.id !== id);
    this.recalculateFinancials();
    this.saveState();
  }

  getTotalExpenses() {
    return this.state.expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }

  getExpensesByCategory() {
    const map = {};
    this.state.expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + (Number(e.amount) || 0);
    });
    return map;
  }

  // --- Budget Planning ---
  updateBudget(allocations) {
    this.state.budget = { ...this.state.budget, ...allocations };
    this.recalculateHealthScore();
    this.saveState();
  }

  // --- Investment Simulator ---
  executeTrade({ assetId, symbol, type, shares, price }) {
    const sharesNum = parseInt(shares, 10);
    const priceNum = parseFloat(price);
    const totalCost = sharesNum * priceNum;

    if (type === 'BUY') {
      if (this.state.portfolio.cash < totalCost) {
        throw new Error('Insufficient virtual cash balance for this trade.');
      }
      this.state.portfolio.cash -= totalCost;

      const existing = this.state.portfolio.holdings.find(h => h.id === assetId || h.symbol === symbol);
      if (existing) {
        const totalShares = existing.shares + sharesNum;
        const totalCostBasis = (existing.shares * existing.avgBuyPrice) + totalCost;
        existing.avgBuyPrice = Math.round((totalCostBasis / totalShares) * 10) / 10;
        existing.shares = totalShares;
      } else {
        const asset = this.state.availableAssets.find(a => a.id === assetId || a.symbol === symbol);
        this.state.portfolio.holdings.push({
          id: assetId,
          symbol,
          name: asset ? asset.name : symbol,
          type: asset ? asset.type : 'Stock',
          shares: sharesNum,
          avgBuyPrice: priceNum,
          currentPrice: priceNum,
          changePct: 0
        });
      }
    } else if (type === 'SELL') {
      const existing = this.state.portfolio.holdings.find(h => h.id === assetId || h.symbol === symbol);
      if (!existing || existing.shares < sharesNum) {
        throw new Error('You do not own enough shares to execute this sell order.');
      }
      this.state.portfolio.cash += totalCost;
      existing.shares -= sharesNum;
      if (existing.shares === 0) {
        this.state.portfolio.holdings = this.state.portfolio.holdings.filter(h => h.id !== existing.id);
      }
    }

    this.state.portfolio.tradeHistory.unshift({
      id: 'trd-' + Date.now(),
      symbol,
      type,
      shares: sharesNum,
      price: priceNum,
      total: totalCost,
      date: new Date().toISOString().split('T')[0]
    });

    // Award XP for hands-on practice
    this.addXP(25, `Simulated trade: ${type} ${sharesNum} ${symbol}`);
    this.saveState();
  }

  getPortfolioSummary() {
    let holdingsValue = 0;
    let totalCostBasis = 0;

    this.state.portfolio.holdings.forEach(h => {
      holdingsValue += h.shares * h.currentPrice;
      totalCostBasis += h.shares * h.avgBuyPrice;
    });

    const totalVirtualValue = this.state.portfolio.cash + holdingsValue;
    const initialCash = this.state.portfolio.initialCash;
    const totalReturnPct = Math.round(((totalVirtualValue - initialCash) / initialCash) * 1000) / 10;

    return {
      cash: this.state.portfolio.cash,
      holdingsValue,
      totalVirtualValue,
      initialCash,
      totalReturnPct,
      gainLoss: totalVirtualValue - initialCash
    };
  }

  // --- Wealth Goals ---
  addGoal(goal) {
    const newGoal = {
      id: 'goal-' + Date.now(),
      title: goal.title.trim(),
      category: goal.category || 'Build savings',
      targetAmount: parseFloat(goal.targetAmount),
      currentAmount: parseFloat(goal.currentAmount || 0),
      deadlineMonths: parseInt(goal.deadlineMonths, 10) || 12,
      icon: goal.icon || '🎯',
      isPrimary: false
    };
    this.state.goals.push(newGoal);

    // Check Wealth Planner badge criteria (3 or more goals)
    if (this.state.goals.length >= 3) {
      this.unlockBadge('b5');
    }

    this.saveState();
    return newGoal;
  }

  deleteGoal(id) {
    this.state.goals = this.state.goals.filter(g => g.id !== id);
    this.saveState();
  }

  updateGoalProgress(id, addedSavings) {
    const goal = this.state.goals.find(g => g.id === id);
    if (goal) {
      goal.currentAmount = Math.min(goal.targetAmount, goal.currentAmount + parseFloat(addedSavings));
      this.saveState();
    }
  }

  // --- Financial Academy & Gamification ---
  completeQuiz(courseId, score, total) {
    const course = this.state.courses.find(c => c.id === courseId);
    if (course) {
      const pct = Math.round((score / total) * 100);
      if (pct >= 66) {
        course.completed = true;
        course.progress = 100;
        this.addXP(course.xp, `Completed course quiz: ${course.title}`);
      }
    }
    this.saveState();
  }

  addXP(amount, reason) {
    this.state.user.learningScore += amount;
    // Level scaling: Level = floor(XP / 200) + 1
    const newLevel = Math.min(10, Math.floor(this.state.user.learningScore / 200) + 1);
    this.state.user.levelNumber = newLevel;

    const levelTitles = [
      'Financial Novice',
      'Curious Saver',
      'Smart Budgeter',
      'Prudent Builder',
      'Wealth Explorer',
      'Portfolio Architect',
      'Financial Master'
    ];
    this.state.user.levelName = levelTitles[newLevel - 1] || 'Financial Champion';

    this.addNotification({
      title: `+${amount} XP Earned! ⚡`,
      message: reason,
      type: 'academy'
    });
  }

  unlockBadge(badgeId) {
    const badge = this.state.badges.find(b => b.id === badgeId);
    if (badge && !badge.unlocked) {
      badge.unlocked = true;
      badge.unlockedAt = new Date().toISOString().split('T')[0];
      this.addXP(100, `Unlocked Badge: ${badge.name}!`);
      this.addNotification({
        title: `🏆 New Badge Unlocked: ${badge.name}!`,
        message: badge.desc,
        type: 'badge'
      });
      return badge;
    }
    return null;
  }

  // --- Notifications ---
  addNotification({ title, message, type = 'insight' }) {
    this.state.notifications.unshift({
      id: 'notif-' + Date.now(),
      title,
      message,
      time: 'Just now',
      unread: true,
      type
    });
    this.saveState();
  }

  markAllNotificationsRead() {
    this.state.notifications.forEach(n => (n.unread = false));
    this.saveState();
  }

  // --- EcoWealth Calculations ---
  updateEcoWealth(values) {
    this.state.ecoWealth = { ...this.state.ecoWealth, ...values };
    this.saveState();
  }

  getEcoSavingsSummary() {
    const {
      electricityReduction,
      waterReduction,
      transportReduction,
      expectedReturnRate,
      projectionYears
    } = this.state.ecoWealth;

    const monthlyTotalSavings = electricityReduction + waterReduction + transportReduction;
    const annualSavings = monthlyTotalSavings * 12;

    // Compound future value calculation: FV of monthly annuity
    // FV = P * [ ((1 + r/12)^(n*12) - 1) / (r/12) ]
    const r = (expectedReturnRate || 10) / 100;
    const n = projectionYears || 5;
    const monthlyRate = r / 12;
    const months = n * 12;
    const futureValue = Math.round(monthlyTotalSavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
    const totalPrincipal = monthlyTotalSavings * months;
    const totalGains = futureValue - totalPrincipal;

    return {
      monthlyTotalSavings,
      annualSavings,
      projectionYears: n,
      futureValue,
      totalPrincipal,
      totalGains,
      carbonOffsetTonnes: Math.round((annualSavings / 3000) * 10) / 10 // ~1 tonne carbon saved per ₹3,000 energy conserved
    };
  }

  // --- Internal recalculations ---
  recalculateFinancials() {
    const totalExp = this.getTotalExpenses();
    this.state.user.monthlyExpenses = totalExp;
    this.state.user.currentSavings = Math.max(0, this.state.user.monthlyIncome - totalExp);
    this.recalculateHealthScore();
  }

  recalculateHealthScore() {
    // Health score components (out of 100):
    // 1. Savings Rate (30 pts): target >= 30% gets full points
    const income = this.state.user.monthlyIncome || 15000;
    const savings = this.state.user.currentSavings || 9000;
    const savingsRate = savings / income;
    const savingsScore = Math.min(30, Math.round((savingsRate / 0.35) * 30));

    // 2. Budget Discipline (25 pts): expenses within budget
    const exp = this.state.user.monthlyExpenses || 6000;
    const budgetCap = (this.state.budget.needs + this.state.budget.wants) || 11000;
    const budgetScore = exp <= budgetCap ? 25 : Math.max(5, Math.round(25 - ((exp - budgetCap) / 500)));

    // 3. Learning / Safety XP (25 pts): based on course progress
    const completedCourses = this.state.courses.filter(c => c.completed).length;
    const learningScore = Math.min(25, Math.round((completedCourses / this.state.courses.length) * 25));

    // 4. Wealth Goals (20 pts): progress towards primary goal
    const primary = this.state.goals.find(g => g.isPrimary) || this.state.goals[0];
    const goalRatio = primary ? (primary.currentAmount / primary.targetAmount) : 0.2;
    const goalScore = Math.min(20, Math.round(goalRatio * 20));

    const total = Math.min(99, Math.max(40, savingsScore + budgetScore + learningScore + goalScore));
    this.state.user.healthScore = total;
  }
}

// Global singleton instance
window.eduState = new EduStateManager();
