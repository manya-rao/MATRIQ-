// EduWealth AI - EcoWealth Module 🌱
// Connects sustainable lifestyle habits with expense reduction and compound wealth creation

class EcoWealthManager {
  constructor() {
    this.compoundChart = null;
  }

  render(containerId = 'ecowealth-view') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const summary = window.eduState.getEcoSavingsSummary();
    const state = window.eduState.getState();
    const eco = state.ecoWealth;

    container.innerHTML = `
      <div class="space-y-6 animate-fade-in">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-2xl md:text-3xl font-bold tracking-tight">EcoWealth 🌱</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Green Habits = Real Wealth
              </span>
            </div>
            <p class="text-sm text-slate-400 mt-1">Convert energy conservation and sustainable student habits into compounding financial assets.</p>
          </div>
        </div>

        <!-- 4 Stat Highlight Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="card-fintech p-5 border-l-4 border-l-emerald-500">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Monthly Eco Savings</span>
            <div class="text-2xl sm:text-3xl font-black mt-1 text-emerald-400" id="eco-stat-monthly">₹${summary.monthlyTotalSavings.toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-400 mt-1">Conserved across 3 utilities</div>
          </div>

          <div class="card-fintech p-5 border-l-4 border-l-cyan-500">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Annual Expense Reduction</span>
            <div class="text-2xl sm:text-3xl font-black mt-1 text-cyan-400" id="eco-stat-annual">₹${summary.annualSavings.toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-400 mt-1">Extra cash freed every year</div>
          </div>

          <div class="card-fintech p-5 border-l-4 border-l-indigo-500">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">${summary.projectionYears}-Year Compounded Wealth</span>
            <div class="text-2xl sm:text-3xl font-black mt-1 text-indigo-400" id="eco-stat-future">₹${summary.futureValue.toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-400 mt-1">At ${eco.expectedReturnRate}% hypothetical return</div>
          </div>

          <div class="card-fintech p-5 border-l-4 border-l-amber-500">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Estimated Carbon Offset</span>
            <div class="text-2xl sm:text-3xl font-black mt-1 text-amber-300" id="eco-stat-carbon">~${summary.carbonOffsetTonnes} T</div>
            <div class="text-xs text-slate-400 mt-1">CO₂ emissions avoided</div>
          </div>
        </div>

        <!-- The Value Proposition Banner -->
        <div class="card-fintech p-6 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/30 border border-emerald-500/30 rounded-2xl">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-2xl font-bold">
              🌱
            </div>
            <div class="space-y-2 flex-1">
              <h4 class="font-bold text-base text-emerald-300">The EcoWealth Cycle</h4>
              <p class="text-sm text-slate-200 font-mono font-semibold">
                Sustainability ➔ Expense Reduction ➔ Savings ➔ Wealth Building
              </p>
              <p class="text-xs text-slate-300 leading-relaxed">
                “If you redirected <strong>₹${summary.annualSavings.toLocaleString('en-IN')} per year</strong> from avoided energy and transport waste into long-term compounding, it could grow to <strong>₹${summary.futureValue.toLocaleString('en-IN')}</strong> in ${summary.projectionYears} years!”
              </p>
            </div>
          </div>
        </div>

        <!-- Interactive Sliders and Projection Chart -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Utility Sliders (5 cols) -->
          <div class="card-fintech p-6 lg:col-span-5 space-y-6">
            <h3 class="font-bold text-lg text-white">Utility Conservation Sliders</h3>
            <p class="text-xs text-slate-400 -mt-4">Adjust your estimated monthly utility savings from sustainable habits.</p>

            <!-- Electricity Slider -->
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-slate-200 font-medium flex items-center gap-1.5">
                  <span>⚡</span> Electricity Reduction
                </span>
                <span class="font-bold text-white" id="val-eco-elec">₹${eco.electricityReduction}/mo</span>
              </div>
              <input type="range" id="slider-eco-elec" min="0" max="1000" step="50" value="${eco.electricityReduction}" class="w-full">
              <span class="text-[11px] text-slate-400 block">Switching off idle hostel fans, LED bulbs, unplugging laptop chargers.</span>
            </div>

            <!-- Water & Essentials Slider -->
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-slate-200 font-medium flex items-center gap-1.5">
                  <span>💧</span> Water & Laundry Conservation
                </span>
                <span class="font-bold text-white" id="val-eco-water">₹${eco.waterReduction}/mo</span>
              </div>
              <input type="range" id="slider-eco-water" min="0" max="500" step="25" value="${eco.waterReduction}" class="w-full">
              <span class="text-[11px] text-slate-400 block">Full laundry loads, fixing leaky taps, using reusable campus water bottles.</span>
            </div>

            <!-- Commute Slider -->
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-slate-200 font-medium flex items-center gap-1.5">
                  <span>🚲</span> Transit & Fuel Conservation
                </span>
                <span class="font-bold text-white" id="val-eco-transport">₹${eco.transportReduction}/mo</span>
              </div>
              <input type="range" id="slider-eco-transport" min="0" max="2000" step="50" value="${eco.transportReduction}" class="w-full">
              <span class="text-[11px] text-slate-400 block">Campus cycling, student metro pass, carpooling with classmates.</span>
            </div>

            <!-- Return Rate Slider -->
            <div class="space-y-2 pt-3 border-t border-slate-800">
              <div class="flex justify-between text-sm">
                <span class="text-slate-200 font-medium">Assumed Compounding Rate:</span>
                <span class="font-bold text-emerald-400" id="val-eco-rate">${eco.expectedReturnRate}% p.a.</span>
              </div>
              <input type="range" id="slider-eco-rate" min="6" max="14" step="1" value="${eco.expectedReturnRate}" class="w-full">
              <span class="text-[11px] text-slate-400 block">Illustrative long-term diversified index fund return.</span>
            </div>
          </div>

          <!-- Compound Growth Chart (7 cols) -->
          <div class="card-fintech p-6 lg:col-span-7 flex flex-col justify-between">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-bold text-lg text-white flex items-center gap-2">
                  <i data-lucide="trending-up" class="w-5 h-5 text-emerald-400"></i> Compounded Wealth Trajectory
                </h3>
                <p class="text-xs text-slate-400">Comparing total principal saved vs. compound interest gains</p>
              </div>
              <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                5-Year Horizon
              </span>
            </div>

            <div class="relative h-64">
              <canvas id="eco-compound-chart"></canvas>
            </div>

            <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800 text-xs">
              <div class="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <span class="text-slate-400 block">Total Cash Conserved:</span>
                <strong class="text-white text-base" id="eco-summary-principal">₹${summary.totalPrincipal.toLocaleString('en-IN')}</strong>
              </div>
              <div class="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                <span class="text-emerald-400 block">Compound Earnings Created:</span>
                <strong class="text-emerald-300 text-base" id="eco-summary-gains">+₹${summary.totalGains.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderChart(summary, eco);
    this.bindEvents(container);

    if (window.lucide) window.lucide.createIcons();
  }

  renderChart(summary, eco) {
    const ctx = document.getElementById('eco-compound-chart');
    if (!ctx || !window.Chart) return;

    const years = [1, 2, 3, 4, 5];
    const r = eco.expectedReturnRate / 100;
    const monthlyRate = r / 12;
    const P = summary.monthlyTotalSavings;

    const principalPoints = [];
    const futurePoints = [];

    years.forEach(y => {
      const m = y * 12;
      const principal = P * m;
      const fv = Math.round(P * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate));
      principalPoints.push(principal);
      futurePoints.push(fv);
    });

    if (this.compoundChart) this.compoundChart.destroy();
    this.compoundChart = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
        datasets: [
          {
            label: 'Total Accumulated Wealth (₹)',
            data: futurePoints,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#10b981',
            pointRadius: 4
          },
          {
            label: 'Cash Saved Without Growth (₹)',
            data: principalPoints,
            borderColor: '#6366f1',
            borderDash: [4, 4],
            fill: false,
            tension: 0.1,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
          },
          y: {
            grid: { color: '#1e293b' },
            ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
          }
        }
      }
    });
  }

  bindEvents(container) {
    const sElec = container.querySelector('#slider-eco-elec');
    const sWater = container.querySelector('#slider-eco-water');
    const sTrans = container.querySelector('#slider-eco-transport');
    const sRate = container.querySelector('#slider-eco-rate');

    const updateLive = () => {
      const elec = parseInt(sElec.value, 10);
      const water = parseInt(sWater.value, 10);
      const trans = parseInt(sTrans.value, 10);
      const rate = parseInt(sRate.value, 10);

      window.eduState.updateEcoWealth({
        electricityReduction: elec,
        waterReduction: water,
        transportReduction: trans,
        expectedReturnRate: rate
      });

      const summary = window.eduState.getEcoSavingsSummary();
      const eco = window.eduState.getState().ecoWealth;

      container.querySelector('#val-eco-elec').textContent = `₹${elec}/mo`;
      container.querySelector('#val-eco-water').textContent = `₹${water}/mo`;
      container.querySelector('#val-eco-transport').textContent = `₹${trans}/mo`;
      container.querySelector('#val-eco-rate').textContent = `${rate}% p.a.`;

      container.querySelector('#eco-stat-monthly').textContent = `₹${summary.monthlyTotalSavings.toLocaleString('en-IN')}`;
      container.querySelector('#eco-stat-annual').textContent = `₹${summary.annualSavings.toLocaleString('en-IN')}`;
      container.querySelector('#eco-stat-future').textContent = `₹${summary.futureValue.toLocaleString('en-IN')}`;
      container.querySelector('#eco-stat-carbon').textContent = `~${summary.carbonOffsetTonnes} T`;

      container.querySelector('#eco-summary-principal').textContent = `₹${summary.totalPrincipal.toLocaleString('en-IN')}`;
      container.querySelector('#eco-summary-gains').textContent = `+₹${summary.totalGains.toLocaleString('en-IN')}`;

      this.renderChart(summary, eco);
    };

    [sElec, sWater, sTrans, sRate].forEach(s => {
      if (s) s.addEventListener('input', updateLive);
    });
  }
}

window.ecoWealthManager = new EcoWealthManager();
