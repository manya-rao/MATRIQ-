// EduWealth AI - Master Application Controller
// Orchestrates views, routing, modals, notifications, theme toggling, and demo resets

class EduApp {
  constructor() {
    this.currentView = 'landing';
    this.unreadNotificationsCount = 1;
  }

  init() {
    // Apply saved theme
    const state = window.eduState.getState();
    document.documentElement.setAttribute('data-theme', state.user.theme || 'dark');

    // Subscribe to state updates to keep stats & notifications in sync
    window.eduState.subscribe((newState) => {
      this.updateGlobalHeader(newState);
    });

    // Check if onboarding was completed, default to landing page if first visit, or allow direct navigation
    this.setupNavigation();
    this.setupGlobalModals();
    this.setupNotificationDrawer();
    this.setupThemeToggle();
    this.setupDemoReset();
    this.setupOnboarding();

    // Initial view navigation based on URL hash or default to 'landing'
    const initialHash = window.location.hash.replace('#', '') || 'landing';
    this.navigateTo(initialHash);

    this.updateGlobalHeader(state);
    if (window.lucide) window.lucide.createIcons();
  }

  navigateTo(viewId) {
    const validViews = [
      'landing', 'dashboard', 'academy', 'expenses', 'coach',
      'budget', 'simulator', 'goals', 'safety', 'ecowealth',
      'progress', 'profile'
    ];
    if (!validViews.includes(viewId)) viewId = 'landing';

    this.currentView = viewId;
    window.location.hash = viewId;

    // Update active state in navbars (desktop + mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
      const target = link.getAttribute('data-view');
      if (target === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Hide all view sections
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.add('hidden');
    });

    // Show target view
    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) {
      targetSection.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Toggle Landing Navigation vs App Dashboard Navigation
    const navApp = document.getElementById('navbar-app');
    const navLanding = document.getElementById('navbar-landing');
    if (viewId === 'landing') {
      if (navApp) navApp.classList.add('hidden');
      if (navLanding) navLanding.classList.remove('hidden');
    } else {
      if (navApp) navApp.classList.remove('hidden');
      if (navLanding) navLanding.classList.add('hidden');
    }

    // Trigger module renderers
    this.renderActiveView(viewId);
    if (window.lucide) window.lucide.createIcons();
  }

  renderActiveView(viewId) {
    switch (viewId) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'academy':
        if (window.academyManager) window.academyManager.render();
        break;
      case 'expenses':
        if (window.expenseManager) window.expenseManager.render();
        break;
      case 'coach':
        this.renderAICoachView();
        break;
      case 'budget':
        if (window.budgetManager) window.budgetManager.render();
        break;
      case 'simulator':
        if (window.simulatorManager) window.simulatorManager.render();
        break;
      case 'goals':
        if (window.goalsManager) window.goalsManager.render();
        break;
      case 'safety':
        if (window.safetyManager) window.safetyManager.render();
        break;
      case 'ecowealth':
        if (window.ecoWealthManager) window.ecoWealthManager.render();
        break;
      case 'progress':
        if (window.progressManager) window.progressManager.render();
        break;
      case 'profile':
        this.renderProfile();
        break;
    }
  }

  setupNavigation() {
    // Global delegated click handler for all elements with data-view-target
    document.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('[data-view-target]');
      if (targetBtn) {
        e.preventDefault();
        const target = targetBtn.getAttribute('data-view-target');
        if (target) {
          this.navigateTo(target);
          const mobileMenu = document.getElementById('mobile-menu-drawer');
          if (mobileMenu) mobileMenu.classList.add('hidden');
        }
      }
    });

    // Handle browser back/forward and hash links
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      const validViews = [
        'landing', 'dashboard', 'academy', 'expenses', 'coach',
        'budget', 'simulator', 'goals', 'safety', 'ecowealth',
        'progress', 'profile'
      ];
      if (validViews.includes(hash) && hash !== this.currentView) {
        this.navigateTo(hash);
      }
    });

    // Mobile hamburger toggle
    const btnMobileToggle = document.getElementById('btn-mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu-drawer');
    if (btnMobileToggle && mobileMenu) {
      btnMobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // Close mobile menu on clicking backdrop
    if (mobileMenu) {
      mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) mobileMenu.classList.add('hidden');
      });
    }
  }

  updateGlobalHeader(state) {
    // Update student name & greeting
    const studentNames = document.querySelectorAll('.bind-student-name');
    studentNames.forEach(el => el.textContent = state.user.name || 'Student');

    // Update health score badge
    const healthBadges = document.querySelectorAll('.bind-health-score');
    healthBadges.forEach(el => el.textContent = `${state.user.healthScore}/100`);

    // Update learning score
    const xpBadges = document.querySelectorAll('.bind-learning-score');
    xpBadges.forEach(el => el.textContent = `${state.user.learningScore} XP`);

    // Update notifications counter
    const unreadCount = state.notifications.filter(n => n.unread).length;
    const notifBadge = document.getElementById('notif-badge-counter');
    if (notifBadge) {
      if (unreadCount > 0) {
        notifBadge.textContent = unreadCount;
        notifBadge.classList.remove('hidden');
      } else {
        notifBadge.classList.add('hidden');
      }
    }
  }

  // --- DASHBOARD RENDERER ---
  renderDashboard() {
    const container = document.getElementById('dashboard-content-area');
    if (!container) return;

    const state = window.eduState.getState();
    const user = state.user;
    const income = user.monthlyIncome || 15000;
    const expenses = window.eduState.getTotalExpenses();
    const savings = Math.max(0, income - expenses);
    const health = user.healthScore || 78;

    // Primary goal progress
    const primaryGoal = state.goals.find(g => g.isPrimary) || state.goals[0];
    const goalRatio = primaryGoal ? Math.round((primaryGoal.currentAmount / primaryGoal.targetAmount) * 100) : 42;

    container.innerHTML = `
      <div class="space-y-8 animate-fade-in">
        <!-- Dashboard Greeting Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              Good morning, <span class="bind-student-name text-gradient-primary">${user.name}</span> 👋
            </h1>
            <p class="text-sm text-slate-400 mt-1">Here’s your financial progress this month. You're building wealth one smart decision at a time.</p>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            <button class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md" data-view-target="expenses">
              <i data-lucide="plus-circle" class="w-4 h-4"></i> Add Expense
            </button>
            <button class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center gap-1.5" data-view-target="coach">
              <i data-lucide="bot" class="w-4 h-4 text-purple-400"></i> Ask AI Coach
            </button>
            <button class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all flex items-center gap-1.5" data-view-target="simulator">
              <i data-lucide="trending-up" class="w-4 h-4 text-emerald-400"></i> Practice Trading
            </button>
          </div>
        </div>

        <!-- Four Major Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Card 1: Monthly Income -->
          <div class="card-fintech p-6 relative overflow-hidden border-l-4 border-l-blue-500">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Income</span>
              <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <i data-lucide="wallet" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-3xl font-black text-white">₹${income.toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span class="text-emerald-400 font-semibold">Stipend & Allowance</span>
            </div>
          </div>

          <!-- Card 2: Total Expenses -->
          <div class="card-fintech p-6 relative overflow-hidden border-l-4 border-l-rose-500">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Expenses</span>
              <div class="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <i data-lucide="credit-card" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-3xl font-black text-white">₹${expenses.toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-400 mt-2 flex items-center justify-between">
              <span>${Math.round((expenses / income) * 100)}% of income spent</span>
              <span class="text-emerald-400 font-semibold">Under Budget</span>
            </div>
          </div>

          <!-- Card 3: Current Savings -->
          <div class="card-fintech p-6 relative overflow-hidden border-l-4 border-l-emerald-500">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Current Savings</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <i data-lucide="piggy-bank" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-3xl font-black text-emerald-400">₹${savings.toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span class="text-emerald-400 font-semibold">${Math.round((savings / income) * 100)}% savings rate</span>
              <span>(Target: >30%)</span>
            </div>
          </div>

          <!-- Card 4: Goal Progress -->
          <div class="card-fintech p-6 relative overflow-hidden border-l-4 border-l-purple-500">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Goal Progress</span>
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <i data-lucide="target" class="w-4 h-4"></i>
              </div>
            </div>
            <div class="text-3xl font-black text-purple-400">${goalRatio}%</div>
            <div class="text-xs text-slate-400 mt-2 flex items-center justify-between">
              <span>₹1 Lakh Goal in 24m</span>
              <span class="text-indigo-400 font-semibold">On Track</span>
            </div>
          </div>
        </div>

        <!-- Middle Row: Financial Health Score + AI Insights Card -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Circular Financial Health Score (5 cols) -->
          <div class="card-fintech p-6 lg:col-span-5 flex flex-col justify-between space-y-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-lg text-white">Financial Health Score</h3>
                <p class="text-xs text-slate-400">Dynamic score based on savings, budget & safety</p>
              </div>
              <button class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold" data-view-target="progress">View Details →</button>
            </div>

            <!-- Circular Progress Indicator -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
              <div class="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                <svg class="w-full h-full health-score-ring" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" stroke-width="8"></circle>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#dashHealthGrad)" stroke-width="8" stroke-dasharray="264" stroke-dashoffset="${264 - (264 * health / 100)}" stroke-linecap="round" class="health-score-circle"></circle>
                  <defs>
                    <linearGradient id="dashHealthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#6366f1" />
                      <stop offset="100%" stop-color="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span class="text-3xl font-black text-white">${health}</span>
                  <span class="text-[10px] text-slate-400 uppercase font-semibold">/ 100</span>
                </div>
              </div>

              <div class="space-y-2 text-xs text-slate-300">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Savings Discipline: <strong>Excellent (60%)</strong></span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                  <span>Budget Adherence: <strong>Good</strong></span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Investing Literacy: <strong>Moderate (55%)</strong></span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>Scam Defense: <strong>High (90%)</strong></span>
                </div>
              </div>
            </div>

            <div class="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 text-xs text-slate-300 flex items-center gap-2">
              <i data-lucide="award" class="w-4 h-4 text-amber-400 flex-shrink-0"></i>
              <span>You have unlocked <strong>4 of 5 Student Badges</strong>! Complete the Wealth Planner badge next.</span>
            </div>
          </div>

          <!-- AI Financial Coach Live Insight (7 cols) -->
          <div class="card-fintech p-6 lg:col-span-7 flex flex-col justify-between space-y-6 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/30 border border-indigo-500/30">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <i data-lucide="bot" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-base text-white">EduWealth AI Coach Intelligence</h3>
                    <span class="text-[11px] text-indigo-300">Live Context Analysis</span>
                  </div>
                </div>
                <button class="text-xs px-3 py-1 rounded-full bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 transition-colors border border-indigo-500/40" data-view-target="coach">
                  Open Chat Interface →
                </button>
              </div>

              <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <p class="text-xs text-slate-300 leading-relaxed">
                  💡 <strong>Analysis on ₹${expenses.toLocaleString('en-IN')} Monthly Outflow:</strong> You spent approximately <strong>₹3,500</strong> toward discretionary expenses. Food is your highest allocation at ₹3,000. Trimming non-essential snacks by ₹1,000/mo would increase your annual savings by <strong>₹12,000</strong>!
                </p>
                <p class="text-xs text-slate-400 leading-relaxed">
                  🎯 <strong>Roadmap to ₹1 Lakh:</strong> Saving ₹4,167/month reaches your target within 24 months. At your current ₹9,000 surplus, you are well ahead of schedule!
                </p>
              </div>
            </div>

            <!-- Quick Action Prompts to Coach -->
            <div>
              <span class="text-[11px] text-slate-400 block mb-2 font-medium">Ask Coach with 1 Click:</span>
              <div class="flex flex-wrap gap-2">
                <button class="quick-coach-btn px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-all flex items-center gap-1" data-query="Analyze my spending">
                  📊 Analyze my spending
                </button>
                <button class="quick-coach-btn px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-all flex items-center gap-1" data-query="How can I reach ₹1 lakh?">
                  🎯 How to reach ₹1 lakh?
                </button>
                <button class="quick-coach-btn px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-all flex items-center gap-1" data-query="Teach me about scams">
                  🛡️ Teach me about scams
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Third Row: Quick Hub for Modules (Academy, Simulator, Safety, EcoWealth) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="card-fintech p-5 flex flex-col justify-between border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer" data-view-target="academy">
            <div>
              <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <i data-lucide="graduation-cap" class="w-5 h-5"></i>
              </div>
              <h4 class="font-bold text-base text-white">Financial Academy</h4>
              <p class="text-xs text-slate-400 mt-1">6 courses, bite-sized lessons, quizzes, and 720 XP earned.</p>
            </div>
            <span class="text-xs text-indigo-400 font-semibold mt-4 block">Explore Courses →</span>
          </div>

          <div class="card-fintech p-5 flex flex-col justify-between border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer" data-view-target="simulator">
            <div>
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <i data-lucide="trending-up" class="w-5 h-5"></i>
              </div>
              <h4 class="font-bold text-base text-white">Investment Simulator</h4>
              <p class="text-xs text-slate-400 mt-1">Virtual portfolio: ₹10,850 (+8.5% return). Zero real money.</p>
            </div>
            <span class="text-xs text-emerald-400 font-semibold mt-4 block">Practice Trading →</span>
          </div>

          <div class="card-fintech p-5 flex flex-col justify-between border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer" data-view-target="safety">
            <div>
              <div class="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                <i data-lucide="shield-alert" class="w-5 h-5"></i>
              </div>
              <h4 class="font-bold text-base text-white">Financial Safety</h4>
              <p class="text-xs text-slate-400 mt-1">"Can You Spot the Scam?" challenge. Protect yourself from fraud.</p>
            </div>
            <span class="text-xs text-rose-400 font-semibold mt-4 block">Take Safety Quiz →</span>
          </div>

          <div class="card-fintech p-5 flex flex-col justify-between border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer" data-view-target="ecowealth">
            <div>
              <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                <i data-lucide="sprout" class="w-5 h-5"></i>
              </div>
              <h4 class="font-bold text-base text-white">EcoWealth 🌱</h4>
              <p class="text-xs text-slate-400 mt-1">Save ₹12,600/year on utilities and compound it to ₹84,200.</p>
            </div>
            <span class="text-xs text-cyan-400 font-semibold mt-4 block">Calculate Green Wealth →</span>
          </div>
        </div>

        <!-- Section 20 Requirement: FINAL DASHBOARD MESSAGE -->
        <div class="card-fintech p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl text-center space-y-4">
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">The Student Roadmap</span>
          <h3 class="text-xl md:text-2xl font-black text-white">Your Education-to-Wealth Journey</h3>
          
          <!-- Visual 7-Stage Flow -->
          <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3 py-2 text-xs md:text-sm font-bold text-slate-200">
            <span class="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">🎓 Learn</span>
            <span class="text-indigo-400">➔</span>
            <span class="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">💼 Earn</span>
            <span class="text-indigo-400">➔</span>
            <span class="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">💰 Budget</span>
            <span class="text-indigo-400">➔</span>
            <span class="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">🏦 Save</span>
            <span class="text-indigo-400">➔</span>
            <span class="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">📈 Invest</span>
            <span class="text-indigo-400">➔</span>
            <span class="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-1.5">🛡️ Protect</span>
            <span class="text-indigo-400">➔</span>
            <span class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 text-white shadow-md flex items-center gap-1.5">🚀 Build Wealth</span>
          </div>

          <p class="text-xs md:text-sm text-slate-300 italic max-w-xl mx-auto">
            “Small financial decisions today can create stronger financial opportunities tomorrow.”
          </p>
        </div>
      </div>
    `;

    // Bind navigation click events inside dashboard
    container.querySelectorAll('[data-view-target]').forEach(elem => {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        const target = elem.getAttribute('data-view-target');
        this.navigateTo(target);
      });
    });

    // Quick coach buttons
    container.querySelectorAll('.quick-coach-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        this.navigateTo('coach');
        setTimeout(() => {
          if (window.eduCoach) {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) chatInput.value = query;
            document.getElementById('btn-send-chat')?.click();
          }
        }, 150);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // --- AI COACH VIEW RENDERER ---
  renderAICoachView() {
    const container = document.getElementById('coach-view');
    if (!container) return;

    const state = window.eduState.getState();
    const messages = window.eduCoach.messages;
    const prompts = window.eduCoach.getQuickPrompts();

    container.innerHTML = `
      <div class="h-[calc(100vh-140px)] flex flex-col card-fintech border border-slate-800 overflow-hidden animate-fade-in">
        <!-- Coach Top Bar -->
        <div class="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
              🤖
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-base text-white">EduWealth AI Coach</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">Online</span>
              </div>
              <p class="text-xs text-slate-400">Context-aware financial mentor for ${state.user.name}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 hidden sm:inline-block">
              ⚠️ Educational Guidance Only • No Real Investment Advice
            </span>
          </div>
        </div>

        <!-- Chat Messages Container -->
        <div id="chat-messages-container" class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          ${messages.map(m => this.renderChatMessage(m)).join('')}
        </div>

        <!-- Quick Action Chips -->
        <div class="p-3 border-t border-slate-800/80 bg-slate-900/30 overflow-x-auto flex items-center gap-2">
          <span class="text-xs text-slate-400 flex-shrink-0 font-medium pl-1">Suggested:</span>
          ${prompts.map(p => `
            <button class="chip-quick-prompt text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex-shrink-0 transition-all" data-query="${p.query}">
              ${p.label}
            </button>
          `).join('')}
        </div>

        <!-- Input Box -->
        <div class="p-4 border-t border-slate-800 bg-slate-900/60">
          <form id="chat-form" class="flex items-center gap-2">
            <input type="text" id="chat-input" placeholder="Ask about saving, budget rules, investing basics, or reaching your goals..." class="flex-1 px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors">
            <button type="submit" id="btn-send-chat" class="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-2 shadow-md">
              <span>Send</span> <i data-lucide="send" class="w-4 h-4"></i>
            </button>
          </form>
        </div>
      </div>
    `;

    this.bindCoachEvents(container);
    this.scrollChatToBottom();
    if (window.lucide) window.lucide.createIcons();
  }

  renderChatMessage(msg) {
    const isAi = msg.sender === 'ai';
    return `
      <div class="flex items-start gap-3 ${isAi ? '' : 'flex-row-reverse'}">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${isAi ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'}">
          ${isAi ? '🤖' : '👤'}
        </div>
        <div class="max-w-2xl ${isAi ? 'chat-bubble-ai text-slate-200' : 'chat-bubble-user text-white'} p-4 shadow-sm text-sm space-y-2 leading-relaxed">
          <div class="prose prose-invert text-xs md:text-sm whitespace-pre-wrap">${this.formatMarkdown(msg.text)}</div>
          <span class="text-[10px] text-slate-400 block text-right mt-1">${msg.timestamp || ''}</span>
        </div>
      </div>
    `;
  }

  formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/• /g, '• ');
  }

  bindCoachEvents(container) {
    const form = container.querySelector('#chat-form');
    const input = container.querySelector('#chat-input');
    const msgContainer = container.querySelector('#chat-messages-container');

    const handleSend = (query) => {
      if (!query.trim()) return;
      input.value = '';

      // Append user message immediately
      const userBubble = document.createElement('div');
      userBubble.innerHTML = this.renderChatMessage({
        sender: 'user',
        text: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      msgContainer.appendChild(userBubble.firstElementChild);

      // Append AI typing bubble
      const aiBubbleWrapper = document.createElement('div');
      aiBubbleWrapper.innerHTML = this.renderChatMessage({
        sender: 'ai',
        text: 'Analyzing your finances and preparing guidance...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      const aiElem = aiBubbleWrapper.firstElementChild;
      msgContainer.appendChild(aiElem);
      this.scrollChatToBottom();

      const textTarget = aiElem.querySelector('.prose');

      window.eduCoach.handleUserQuery(
        query,
        (partial) => {
          if (textTarget) textTarget.innerHTML = this.formatMarkdown(partial);
          this.scrollChatToBottom();
        },
        (finalText) => {
          if (textTarget) textTarget.innerHTML = this.formatMarkdown(finalText);
          this.scrollChatToBottom();
          if (window.lucide) window.lucide.createIcons();
        }
      );
    };

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        handleSend(input.value);
      };
    }

    container.querySelectorAll('.chip-quick-prompt').forEach(btn => {
      btn.onclick = () => {
        const q = btn.getAttribute('data-query');
        handleSend(q);
      };
    });
  }

  scrollChatToBottom() {
    const el = document.getElementById('chat-messages-container');
    if (el) el.scrollTop = el.scrollHeight;
  }

  // --- PROFILE RENDERER ---
  renderProfile() {
    const container = document.getElementById('profile-view');
    if (!container) return;

    const state = window.eduState.getState();
    const user = state.user;
    const badges = state.badges;
    const goals = state.goals;

    container.innerHTML = `
      <div class="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <!-- Header Card -->
        <div class="card-fintech p-6 md:p-8 bg-gradient-to-r from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
          <div class="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-xl flex-shrink-0">
            ${user.name.charAt(0)}
          </div>
          <div class="space-y-2 text-center sm:text-left flex-1">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 class="text-2xl md:text-3xl font-bold text-white">${user.name}</h2>
              <span class="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Level ${user.levelNumber}: ${user.levelName}
              </span>
            </div>
            <p class="text-sm text-slate-300">${user.course} • ${user.college}</p>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
              <span>Age: <strong class="text-white">${user.age}</strong></span>
              <span>Level: <strong class="text-white">${user.educationLevel}</strong></span>
              <span>Financial Score: <strong class="text-amber-400 font-bold">${user.learningScore} XP</strong></span>
            </div>
          </div>
        </div>

        <!-- Privacy & Security Statement (Section 15 Compliance) -->
        <div class="card-fintech p-5 border-l-4 border-l-emerald-500 bg-emerald-950/20">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i data-lucide="shield-check" class="w-5 h-5"></i>
            </div>
            <div class="space-y-1">
              <h4 class="font-bold text-sm text-emerald-300">Privacy & Data Security Guarantee</h4>
              <p class="text-xs text-slate-300 leading-relaxed">
                EduWealth AI is built on privacy-first educational principles. We <strong>never store or request</strong> bank passwords, credit/debit card numbers, UPI PINs, or sensitive banking credentials. All simulation calculations happen privately inside your local browser.
              </p>
            </div>
          </div>
        </div>

        <!-- Badges Earned Showcase -->
        <div class="card-fintech p-6">
          <h3 class="font-bold text-lg text-white mb-4">Milestone Badges</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${badges.map(b => `
              <div class="p-3.5 rounded-xl border ${b.unlocked ? 'bg-slate-800/40 border-slate-700 text-slate-200' : 'bg-slate-900/30 border-slate-800/60 opacity-50'} flex items-center gap-3">
                <span class="text-3xl">${b.icon}</span>
                <div>
                  <h4 class="font-bold text-xs text-white">${b.name}</h4>
                  <p class="text-[10px] text-slate-400 leading-tight mt-0.5">${b.desc}</p>
                  <span class="text-[9px] font-semibold text-emerald-400 mt-1 block">
                    ${b.unlocked ? `Unlocked on ${b.unlockedAt || 'Recently'}` : 'Locked'}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Registered Goals Overview -->
        <div class="card-fintech p-6">
          <h3 class="font-bold text-lg text-white mb-4">Your Financial Targets</h3>
          <div class="space-y-3">
            ${goals.map(g => `
              <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">${g.icon}</span>
                  <div>
                    <h4 class="font-bold text-sm text-white">${g.title}</h4>
                    <span class="text-xs text-slate-400">Target: ₹${g.targetAmount.toLocaleString('en-IN')} in ${g.deadlineMonths} months</span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-sm font-bold text-emerald-400">₹${g.currentAmount.toLocaleString('en-IN')}</span>
                  <span class="text-[11px] text-slate-400 block">${Math.round((g.currentAmount / g.targetAmount) * 100)}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Demo Control Center -->
        <div class="card-fintech p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 class="font-bold text-sm text-white">Prototype Controls</h4>
            <p class="text-xs text-slate-400">Reset demo state to Manya's default starting values</p>
          </div>
          <button id="btn-reset-demo" class="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-all flex items-center gap-2">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i> Reset Demo Data
          </button>
        </div>
      </div>
    `;

    container.querySelector('#btn-reset-demo')?.addEventListener('click', () => {
      if (confirm('Reset prototype data to default demo state?')) {
        window.eduState.resetDemoData();
        this.showToast('Demo data successfully restored!', 'info');
        this.renderProfile();
      }
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // --- MODAL CONTROLS ---
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  setupGlobalModals() {
    // Backdrop click close
    document.querySelectorAll('.app-modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        }
      });
      // Close button inside modal
      modal.querySelectorAll('.btn-close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        });
      });
    });

    // Add Expense Modal Form
    const addExpenseForm = document.getElementById('form-add-expense');
    if (addExpenseForm) {
      addExpenseForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('input-expense-name').value;
        const amount = document.getElementById('input-expense-amount').value;
        const category = document.getElementById('input-expense-category').value;
        const date = document.getElementById('input-expense-date').value;

        window.eduState.addExpense({ name, amount, category, date });
        this.hideModal('modal-add-expense');
        this.showToast(`Logged ₹${amount} for ${name}`, 'success');
        addExpenseForm.reset();

        if (this.currentView === 'expenses' && window.expenseManager) {
          window.expenseManager.render();
        } else if (this.currentView === 'dashboard') {
          this.renderDashboard();
        }
      };
    }

    // Add Goal Modal Form
    const addGoalForm = document.getElementById('form-add-goal');
    if (addGoalForm) {
      addGoalForm.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('input-goal-title').value;
        const targetAmount = document.getElementById('input-goal-amount').value;
        const deadlineMonths = document.getElementById('input-goal-months').value;
        const category = document.getElementById('input-goal-category').value;
        const icon = document.getElementById('input-goal-icon').value || '🎯';

        window.eduState.addGoal({ title, targetAmount, deadlineMonths, category, icon });
        this.hideModal('modal-add-goal');
        this.showToast(`New goal created: ${title}`, 'success');
        addGoalForm.reset();

        if (this.currentView === 'goals' && window.goalsManager) {
          window.goalsManager.render();
        }
      };
    }
  }

  // --- MULTI-STEP ONBOARDING WIZARD ---
  setupOnboarding() {
    let currentStep = 1;
    const modal = document.getElementById('modal-onboarding');
    if (!modal) return;

    const showStep = (step) => {
      currentStep = step;
      [1, 2, 3, 4].forEach(s => {
        const el = document.getElementById(`onboarding-step-${s}`);
        if (el) {
          if (s === step) el.classList.remove('hidden');
          else el.classList.add('hidden');
        }
      });
    };

    // Step 1 -> Step 2
    document.getElementById('btn-onboard-next-1')?.addEventListener('click', () => {
      const name = document.getElementById('onboard-name').value.trim();
      const age = document.getElementById('onboard-age').value;
      const edu = document.getElementById('onboard-edu').value;
      const college = document.getElementById('onboard-college').value.trim();

      if (!name) {
        this.showToast('Please enter your name', 'error');
        return;
      }

      window.eduState.updateUser({
        name,
        age: parseInt(age, 10) || 20,
        educationLevel: edu,
        college: college || 'University'
      });
      showStep(2);
    });

    // Step 2 -> Step 3
    document.getElementById('btn-onboard-next-2')?.addEventListener('click', () => {
      const income = parseFloat(document.getElementById('onboard-income').value) || 15000;
      const expenses = parseFloat(document.getElementById('onboard-expenses').value) || 6000;
      const savings = parseFloat(document.getElementById('onboard-savings').value) || 9000;

      window.eduState.updateUser({
        monthlyIncome: income,
        monthlyExpenses: expenses,
        currentSavings: savings
      });
      showStep(3);
    });

    // Step 3 -> Step 4 (Celebration)
    document.getElementById('btn-onboard-next-3')?.addEventListener('click', () => {
      const goalCategory = document.getElementById('onboard-goal-category').value;
      const goalAmount = parseFloat(document.getElementById('onboard-goal-target').value) || 100000;
      const goalMonths = parseInt(document.getElementById('onboard-goal-months').value, 10) || 24;

      window.eduState.updateUser({
        primaryGoal: `Build ${goalCategory}`,
        primaryGoalTarget: goalAmount,
        primaryGoalMonths: goalMonths,
        onboardingComplete: true
      });

      showStep(4);
      if (window.confetti) {
        window.confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }
    });

    // Step 4 -> Dashboard
    document.getElementById('btn-onboard-finish')?.addEventListener('click', () => {
      this.hideModal('modal-onboarding');
      this.navigateTo('dashboard');
      this.showToast('Welcome to EduWealth AI! Your journey starts now.', 'success');
    });

    // Landing "Get Started" opens onboarding or dashboard
    document.querySelectorAll('.btn-trigger-get-started').forEach(btn => {
      btn.onclick = () => {
        showStep(1);
        this.showModal('modal-onboarding');
      };
    });
  }

  // --- NOTIFICATION DRAWER ---
  setupNotificationDrawer() {
    const drawer = document.getElementById('notification-drawer');
    const toggleBtn = document.getElementById('btn-toggle-notifs');
    const closeBtn = document.getElementById('btn-close-notifs');
    const markReadBtn = document.getElementById('btn-mark-notifs-read');

    if (toggleBtn && drawer) {
      toggleBtn.onclick = () => {
        drawer.classList.toggle('translate-x-full');
        this.renderNotificationsList();
      };
    }

    if (closeBtn && drawer) {
      closeBtn.onclick = () => {
        drawer.classList.add('translate-x-full');
      };
    }

    if (markReadBtn) {
      markReadBtn.onclick = () => {
        window.eduState.markAllNotificationsRead();
        this.renderNotificationsList();
        this.showToast('All notifications marked as read', 'info');
      };
    }
  }

  renderNotificationsList() {
    const list = document.getElementById('notifications-list-container');
    if (!list) return;

    const notifs = window.eduState.getState().notifications;
    list.innerHTML = notifs.map(n => `
      <div class="p-3.5 rounded-xl border ${n.unread ? 'bg-indigo-950/30 border-indigo-500/40' : 'bg-slate-800/30 border-slate-700/50'} space-y-1 transition-all">
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs text-white">${n.title}</span>
          <span class="text-[10px] text-slate-400">${n.time}</span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">${n.message}</p>
      </div>
    `).join('');
  }

  // --- THEME & DEMO CONTROLS ---
  setupThemeToggle() {
    const toggleBtns = document.querySelectorAll('.btn-theme-toggle');
    toggleBtns.forEach(btn => {
      btn.onclick = () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        window.eduState.setTheme(next);
        this.showToast(`Switched to ${next} theme`, 'info');
      };
    });
  }

  setupDemoReset() {
    document.querySelectorAll('.btn-trigger-demo-reset').forEach(btn => {
      btn.onclick = () => {
        if (confirm('Restore Manya’s complete demo profile and reset changes?')) {
          window.eduState.resetDemoData();
          this.navigateTo('dashboard');
          this.showToast('Demo data restored successfully!', 'success');
        }
      };
    });
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    const colors = {
      success: 'border-emerald-500/40 bg-slate-900/95 text-emerald-300',
      error: 'border-rose-500/40 bg-slate-900/95 text-rose-300',
      info: 'border-indigo-500/40 bg-slate-900/95 text-indigo-300'
    };

    const icons = {
      success: 'check-circle-2',
      error: 'alert-circle',
      info: 'info'
    };

    toast.className = `p-3.5 rounded-xl border shadow-xl flex items-center gap-3 text-xs font-semibold animate-fade-in ${colors[type] || colors.info}`;
    toast.innerHTML = `
      <i data-lucide="${icons[type] || 'info'}" class="w-4 h-4 flex-shrink-0"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Instantiate global app controller
window.eduApp = new EduApp();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.eduApp.init();
});
