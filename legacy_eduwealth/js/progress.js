// EduWealth AI - Progress Dashboard Module
// Visual analytics on student financial maturity, habits, and overall health

class ProgressManager {
  constructor() {
    this.radarChart = null;
    this.growthChart = null;
  }

  render(containerId = 'progress-view') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const state = window.eduState.getState();
    const user = state.user;
    const health = user.healthScore;

    // Fixed metrics as required by prompt
    const metrics = {
      learning: 82,
      savingHabit: 68,
      budgetDiscipline: 75,
      investingKnowledge: 55,
      safetyAwareness: 90
    };

    container.innerHTML = `
      <div class="space-y-6 animate-fade-in">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Financial Progress & Maturity 📊</h2>
            <p class="text-sm text-slate-400 mt-1">Holistic assessment of your financial education, habits, discipline, and security.</p>
          </div>
          <div class="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Profile Status: Level ${user.levelNumber} (${user.levelName})
          </div>
        </div>

        <!-- Overall Health Score Banner -->
        <div class="card-fintech p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-2 text-center md:text-left">
            <span class="text-xs uppercase font-bold tracking-wider text-indigo-400">Composite Financial Index</span>
            <h3 class="text-2xl md:text-3xl font-black text-white">Overall Financial Health</h3>
            <p class="text-sm text-slate-300 max-w-lg leading-relaxed">
              Your financial health is in the <strong class="text-emerald-400">Top 15th percentile</strong> of undergraduate peers. Keep maintaining your 60% savings rate and complete the remaining investing modules!
            </p>
          </div>

          <!-- Circular Score Indicator -->
          <div class="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
            <svg class="w-full h-full health-score-ring" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" stroke-width="8"></circle>
              <circle cx="50" cy="50" r="42" fill="none" stroke="url(#healthGrad)" stroke-width="8" stroke-dasharray="264" stroke-dashoffset="${264 - (264 * health / 100)}" stroke-linecap="round" class="health-score-circle"></circle>
              <defs>
                <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
        </div>

        <!-- 5 Development Metric Progress Bars -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <!-- 1. Financial Learning -->
          <div class="card-fintech p-5 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-slate-400 font-semibold uppercase">Learning</span>
                <span class="text-base font-bold text-indigo-400">${metrics.learning}%</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                <div class="bg-indigo-500 h-full rounded-full" style="width: ${metrics.learning}%;"></div>
              </div>
            </div>
            <p class="text-[11px] text-slate-400">Course completions & quizzes</p>
          </div>

          <!-- 2. Saving Habit -->
          <div class="card-fintech p-5 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-slate-400 font-semibold uppercase">Saving Habit</span>
                <span class="text-base font-bold text-emerald-400">${metrics.savingHabit}%</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                <div class="bg-emerald-500 h-full rounded-full" style="width: ${metrics.savingHabit}%;"></div>
              </div>
            </div>
            <p class="text-[11px] text-slate-400">Consistency in saving monthly</p>
          </div>

          <!-- 3. Budget Discipline -->
          <div class="card-fintech p-5 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-slate-400 font-semibold uppercase">Budget Discipline</span>
                <span class="text-base font-bold text-cyan-400">${metrics.budgetDiscipline}%</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                <div class="bg-cyan-500 h-full rounded-full" style="width: ${metrics.budgetDiscipline}%;"></div>
              </div>
            </div>
            <p class="text-[11px] text-slate-400">Expenses kept within envelope</p>
          </div>

          <!-- 4. Investment Knowledge -->
          <div class="card-fintech p-5 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-slate-400 font-semibold uppercase">Investing</span>
                <span class="text-base font-bold text-purple-400">${metrics.investingKnowledge}%</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                <div class="bg-purple-500 h-full rounded-full" style="width: ${metrics.investingKnowledge}%;"></div>
              </div>
            </div>
            <p class="text-[11px] text-slate-400">Asset classes & portfolio practice</p>
          </div>

          <!-- 5. Financial Safety Awareness -->
          <div class="card-fintech p-5 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs text-slate-400 font-semibold uppercase">Safety Awareness</span>
                <span class="text-base font-bold text-rose-400">${metrics.safetyAwareness}%</span>
              </div>
              <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                <div class="bg-rose-500 h-full rounded-full" style="width: ${metrics.safetyAwareness}%;"></div>
              </div>
            </div>
            <p class="text-[11px] text-slate-400">Scam defense & fraud resistance</p>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Multi-Axis Radar Chart -->
          <div class="card-fintech p-6 flex flex-col justify-between">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-bold text-lg text-white flex items-center gap-2">
                  <i data-lucide="radar" class="w-5 h-5 text-indigo-400"></i> Financial Maturity Radar
                </h3>
                <p class="text-xs text-slate-400">Multi-dimensional capability mapping</p>
              </div>
              <span class="text-xs text-slate-400 font-mono">Radar v2.0</span>
            </div>
            <div class="relative h-64 flex items-center justify-center">
              <canvas id="progress-radar-chart"></canvas>
            </div>
          </div>

          <!-- Weekly/Monthly Growth History -->
          <div class="card-fintech p-6 flex flex-col justify-between">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-bold text-lg text-white flex items-center gap-2">
                  <i data-lucide="trending-up" class="w-5 h-5 text-emerald-400"></i> Health Score Progression
                </h3>
                <p class="text-xs text-slate-400">Monthly evolution of your financial health</p>
              </div>
              <span class="text-xs text-emerald-400 font-mono">+18 pts over 4 months</span>
            </div>
            <div class="relative h-64">
              <canvas id="progress-growth-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Next Milestones to Level Up -->
        <div class="card-fintech p-6">
          <h3 class="font-bold text-lg text-white mb-3">Next Action Steps to Reach Level 5</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3">
              <span class="text-xl">📈</span>
              <div class="text-xs">
                <strong class="text-white block">Execute 2 Virtual Trades</strong>
                <span class="text-slate-400">Practice rebalancing your simulator portfolio to earn +50 XP.</span>
              </div>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3">
              <span class="text-xl">🎓</span>
              <div class="text-xs">
                <strong class="text-white block">Finish Taxes Module</strong>
                <span class="text-slate-400">Pass the 2 remaining tax lessons to boost investment score to 70%.</span>
              </div>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-3">
              <span class="text-xl">🌱</span>
              <div class="text-xs">
                <strong class="text-white block">Apply 1 EcoWealth Habit</strong>
                <span class="text-slate-400">Turn off standby appliances to save an extra ₹150/mo.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderCharts(metrics);
    if (window.lucide) window.lucide.createIcons();
  }

  renderCharts(metrics) {
    // Radar Chart
    const radarCtx = document.getElementById('progress-radar-chart');
    if (radarCtx && window.Chart) {
      if (this.radarChart) this.radarChart.destroy();
      this.radarChart = new window.Chart(radarCtx, {
        type: 'radar',
        data: {
          labels: ['Learning', 'Saving Habit', 'Budget Discipline', 'Investing', 'Safety Awareness'],
          datasets: [{
            label: 'Current Score',
            data: [metrics.learning, metrics.savingHabit, metrics.budgetDiscipline, metrics.investingKnowledge, metrics.safetyAwareness],
            backgroundColor: 'rgba(99, 102, 241, 0.25)',
            borderColor: '#6366f1',
            borderWidth: 2,
            pointBackgroundColor: '#6366f1',
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            r: {
              angleLines: { color: '#334155' },
              grid: { color: '#1e293b' },
              pointLabels: { color: '#cbd5e1', font: { family: 'Plus Jakarta Sans', size: 10 } },
              ticks: { display: false, max: 100, min: 0 }
            }
          }
        }
      });
    }

    // Growth Line Chart
    const growthCtx = document.getElementById('progress-growth-chart');
    if (growthCtx && window.Chart) {
      if (this.growthChart) this.growthChart.destroy();
      this.growthChart = new window.Chart(growthCtx, {
        type: 'line',
        data: {
          labels: ['June', 'July', 'August', 'September (Now)'],
          datasets: [{
            label: 'Financial Health Score',
            data: [60, 66, 73, 78],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#10b981',
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
            },
            y: {
              min: 40,
              max: 100,
              grid: { color: '#1e293b' },
              ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
            }
          }
        }
      });
    }
  }
}

window.progressManager = new ProgressManager();
