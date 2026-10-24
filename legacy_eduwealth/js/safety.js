// EduWealth AI - Financial Safety Center Module
// Protect Your Wealth 🛡️, Scam spotter interactive game, red flag breakdowns

class SafetyManager {
  constructor() {
    this.currentScenarioIndex = 0;
    this.gameScore = 0;
    this.answeredScenarios = {};
  }

  render(containerId = 'safety-view') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const state = window.eduState.getState();
    const scenarios = state.scamScenarios;
    const current = scenarios[this.currentScenarioIndex];

    container.innerHTML = `
      <div class="space-y-8 animate-fade-in">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Financial Safety Center 🛡️</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Protect Your Wealth
              </span>
            </div>
            <p class="text-sm text-slate-400 mt-1">Defend your hard-earned money against predatory loan apps, phishing, and fake investment schemes.</p>
          </div>
          <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <span class="text-2xl">🚨</span>
            <div class="text-xs">
              <span class="text-slate-400 block">National Cyber Crime Helpline:</span>
              <strong class="text-white text-sm">Dial 1930 / cybercrime.gov.in</strong>
            </div>
          </div>
        </div>

        <!-- Interactive Mini-Game: "Can You Spot the Scam?" -->
        <div class="card-fintech p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-900/90 to-rose-950/30 border border-slate-700/80 rounded-2xl relative overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-rose-400">Interactive Simulation Challenge</span>
              <h3 class="text-xl md:text-2xl font-black text-white mt-1">Can You Spot the Scam? 🕵️‍♂️</h3>
              <p class="text-xs text-slate-400">Inspect the simulated incoming communication below and decide if it is legitimate or malicious.</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs text-slate-400">Scenario ${this.currentScenarioIndex + 1} of ${scenarios.length}</span>
              <div class="px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-mono font-bold border border-slate-700">
                Score: ${this.gameScore} / ${scenarios.length}
              </div>
            </div>
          </div>

          <!-- Scenario Message Box (Simulated Phone/SMS View) -->
          <div class="max-w-xl mx-auto rounded-2xl bg-slate-950 border-2 border-slate-800 p-5 shadow-2xl space-y-4">
            <!-- Simulated Message Header -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span class="font-semibold text-slate-200">${current.sender}</span>
              </div>
              <span class="text-[10px] text-slate-500">Incoming Message</span>
            </div>

            <!-- Message Text -->
            <div class="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans select-all">
              ${current.message}
            </div>

            <!-- Action Choice Buttons -->
            <div id="scam-action-buttons" class="grid grid-cols-2 gap-3 pt-2">
              <button id="btn-choice-safe" class="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md">
                <span>🛡️</span> It's SAFE
              </button>
              <button id="btn-choice-scam" class="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md">
                <span>🚨</span> It's a SCAM!
              </button>
            </div>

            <!-- Result Feedback Box (Hidden initially) -->
            <div id="scam-feedback-box" class="hidden p-4 rounded-xl text-xs space-y-3"></div>
          </div>
        </div>

        <!-- 4 Educational Pillars of Wealth Protection -->
        <div>
          <h3 class="text-xl font-bold text-white mb-4">Core Knowledge: Spotting Predatory Traps</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 1. Fake Investment Schemes -->
            <div class="card-fintech p-6 border-l-4 border-l-rose-500 space-y-3">
              <div class="flex items-center gap-2 text-rose-400 font-bold text-base">
                <i data-lucide="trending-down" class="w-5 h-5"></i>
                <h4>Fake Investment Schemes & Ponzi Pools</h4>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">
                Fraudulent entities lure students with promises of 100%–300% guaranteed monthly returns on crypto arbitrage or foreign exchange.
              </p>
              <div class="space-y-1.5 pt-2">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Warning Signs:</span>
                <ul class="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Guaranteed returns with zero downside risk</li>
                  <li>Pressure to recruit other friends or hostel mates</li>
                  <li>No SEBI or RBI registration or corporate CIN number</li>
                </ul>
              </div>
            </div>

            <!-- 2. Online Scams & Phishing -->
            <div class="card-fintech p-6 border-l-4 border-l-amber-500 space-y-3">
              <div class="flex items-center gap-2 text-amber-400 font-bold text-base">
                <i data-lucide="shield-alert" class="w-5 h-5"></i>
                <h4>Phishing, Fake Portals & UPI Frauds</h4>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">
                Cyber criminals clone bank login portals and send fake scholarship lottery notices to capture credentials.
              </p>
              <div class="space-y-1.5 pt-2">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Warning Signs:</span>
                <ul class="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Requests to enter your 6-digit UPI PIN to "receive" cash</li>
                  <li>Domain typos (e.g., sbi-login.support instead of onlinesbi.sbi)</li>
                  <li>Threats that your bank account or phone SIM will be blocked</li>
                </ul>
              </div>
            </div>

            <!-- 3. Predatory Loan Apps -->
            <div class="card-fintech p-6 border-l-4 border-l-purple-500 space-y-3">
              <div class="flex items-center gap-2 text-purple-400 font-bold text-base">
                <i data-lucide="alert-triangle" class="w-5 h-5"></i>
                <h4>Predatory Instant Loan Apps</h4>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">
                Apps advertising "Instant 5-Minute Student Loans with No Documents" charge 40% upfront deduction and access phone contacts.
              </p>
              <div class="space-y-1.5 pt-2">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Warning Signs:</span>
                <ul class="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Requests full access to Contacts, Photos, and Media</li>
                  <li>Deducts 30–50% upfront as "processing fees"</li>
                  <li>Unlicensed lenders not affiliated with RBI-registered NBFCs</li>
                </ul>
              </div>
            </div>

            <!-- 4. Gambling & High-Risk Speculation -->
            <div class="card-fintech p-6 border-l-4 border-l-cyan-500 space-y-3">
              <div class="flex items-center gap-2 text-cyan-400 font-bold text-base">
                <i data-lucide="crosshair" class="w-5 h-5"></i>
                <h4>Gambling & "Color Prediction" Apps</h4>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">
                App disguised as trading or gaming that lure students to bet on colors or random numbers are rigged casinos.
              </p>
              <div class="space-y-1.5 pt-2">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Core Truth:</span>
                <ul class="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  <li>Algorithms are programmed so the user loses all capital</li>
                  <li>Creates addictive dopamine reward loops</li>
                  <li>Real wealth is built through long-term compounding, not gambling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container, current, scenarios);
    if (window.lucide) window.lucide.createIcons();
  }

  bindEvents(container, current, scenarios) {
    const btnSafe = container.querySelector('#btn-choice-safe');
    const btnScam = container.querySelector('#btn-choice-scam');
    const actionsBox = container.querySelector('#scam-action-buttons');
    const feedbackBox = container.querySelector('#scam-feedback-box');

    const handleChoice = (userChoseScam) => {
      const isCorrect = userChoseScam === current.isScam;
      if (isCorrect) {
        this.gameScore++;
        window.eduState.addXP(40, 'Correctly identified financial safety scenario!');
      }

      actionsBox.classList.add('hidden');
      feedbackBox.classList.remove('hidden');

      feedbackBox.className = `p-4 rounded-xl text-xs space-y-3 block ${isCorrect ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200' : 'bg-rose-950/60 border border-rose-500/40 text-rose-200'}`;
      
      feedbackBox.innerHTML = `
        <div class="flex items-center gap-2 font-bold text-sm">
          <span>${isCorrect ? '🎯 Bullseye!' : '⚠️ Be Careful!'}</span>
          <span>This message is actually <strong>${current.isScam ? 'a DANGEROUS SCAM' : 'SAFE and Legitimate'}</strong>.</span>
        </div>

        <p class="leading-relaxed text-slate-300">${current.explanation}</p>

        ${current.redFlags.length ? `
          <div class="pt-2 border-t border-slate-800">
            <span class="font-bold text-rose-400 block mb-1">Key Red Flags in this Message:</span>
            <ul class="list-disc list-inside space-y-0.5 text-slate-300">
              ${current.redFlags.map(rf => `<li>${rf}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="pt-2 flex justify-end">
          <button id="btn-next-scam-scenario" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all">
            ${this.currentScenarioIndex + 1 < scenarios.length ? 'Next Scenario →' : 'Complete Challenge 🏆'}
          </button>
        </div>
      `;

      feedbackBox.querySelector('#btn-next-scam-scenario').onclick = () => {
        if (this.currentScenarioIndex + 1 < scenarios.length) {
          this.currentScenarioIndex++;
          this.render();
        } else {
          // Finished all scenarios
          window.eduState.unlockBadge('b3'); // Scam Detective badge
          if (window.confetti) {
            window.confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
          }
          window.eduApp.showToast(`Challenge complete! Score: ${this.gameScore}/${scenarios.length}`, 'success');
          this.currentScenarioIndex = 0;
          this.render();
        }
      };
    };

    if (btnSafe) btnSafe.onclick = () => handleChoice(false);
    if (btnScam) btnScam.onclick = () => handleChoice(true);
  }
}

window.safetyManager = new SafetyManager();
