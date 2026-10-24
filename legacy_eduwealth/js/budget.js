// EduWealth AI - Smart Budget Module
// Personalized allocation planning, interactive sliders, and AI recommendations

class BudgetManager {
  constructor() {
    this.allocationChart = null;
  }

  render(containerId = 'budget-view') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const state = window.eduState.getState();
    const budget = state.budget;
    const income = state.user.monthlyIncome || 15000;
    const currentExpenses = window.eduState.getTotalExpenses();

    const totalAllocated = budget.needs + budget.wants + budget.savings + budget.emergencyFund;
    const remaining = income - totalAllocated;

    // Percentages
    const needsPct = Math.round((budget.needs / income) * 100);
    const wantsPct = Math.round((budget.wants / income) * 100);
    const savingsPct = Math.round((budget.savings / income) * 100);
    const emergencyPct = Math.round((budget.emergencyFund / income) * 100);

    container.innerHTML = `
      <div class="space-y-6 animate-fade-in">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Smart Budget Planner 📐</h2>
            <p class="text-sm text-slate-400 mt-1">Design your personalized cash flow envelope. Align spending with student goals.</p>
          </div>
          <div class="flex items-center gap-2">
            <button id="btn-budget-preset" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2">
              <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Reset to Recommended
            </button>
          </div>
        </div>

        <!-- Income & Balance Banner -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="card-fintech p-5">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Monthly Income</span>
            <div class="text-2xl sm:text-3xl font-extrabold mt-1 text-white">₹${income.toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-400 mt-1">Total available to budget</div>
          </div>
          <div class="card-fintech p-5">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Allocated</span>
            <div class="text-2xl sm:text-3xl font-extrabold mt-1 ${totalAllocated > income ? 'text-rose-400' : 'text-indigo-400'}">
              ₹${totalAllocated.toLocaleString('en-IN')}
            </div>
            <div class="text-xs text-slate-400 mt-1">${Math.round((totalAllocated / income) * 100)}% of income allocated</div>
          </div>
          <div class="card-fintech p-5">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Unallocated Balance</span>
            <div class="text-2xl sm:text-3xl font-extrabold mt-1 ${remaining < 0 ? 'text-rose-400' : 'text-emerald-400'}">
              ₹${remaining.toLocaleString('en-IN')}
            </div>
            <div class="text-xs text-slate-400 mt-1">${remaining === 0 ? 'Every rupee assigned! (Zero-Based Budget)' : (remaining > 0 ? 'Surplus ready to save' : 'Deficit! Please reduce items')}</div>
          </div>
        </div>

        <!-- AI Budget Suggestions -->
        <div class="card-fintech p-5 bg-gradient-to-r from-emerald-950/40 via-slate-900/50 to-indigo-950/30 border border-emerald-500/30 rounded-2xl">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <i data-lucide="bot" class="w-5 h-5"></i>
            </div>
            <div class="space-y-2 flex-1">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-base text-emerald-300">AI Budget Recommendations</h4>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">Optimized</span>
              </div>
              <p class="text-sm text-slate-300 leading-relaxed">
                💡 <strong>Discretionary Tuning:</strong> You could reduce entertainment spending by <strong>₹500</strong> and redirect it toward your emergency fund. This builds an extra ₹3,000 safety net in 6 months!
              </p>
              <p class="text-sm text-slate-300 leading-relaxed">
                🛡️ <strong>Safety Net Status:</strong> Your emergency fund allocation of <strong>₹${budget.emergencyFund.toLocaleString('en-IN')}/month</strong> is healthy. Within 12 months, you'll have ₹18,000 safeguarded against laptop repairs or unforeseen travels.
              </p>
            </div>
          </div>
        </div>

        <!-- Interactive Sliders and Visualizer -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Sliders Form (7 cols) -->
          <div class="card-fintech p-6 lg:col-span-7 space-y-6">
            <h3 class="font-bold text-lg text-white">Interactive Budget Allocation</h3>
            <p class="text-xs text-slate-400 -mt-4">Adjust the sliders to test different allocations and see immediate outcomes.</p>

            <!-- Needs Slider -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span class="font-semibold text-slate-200 flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-blue-500"></span> Needs (50-60%)
                </span>
                <span class="font-bold text-white text-base" id="val-needs">₹${budget.needs.toLocaleString('en-IN')} <span class="text-xs text-slate-400">(${needsPct}%)</span></span>
              </div>
              <input type="range" id="slider-needs" min="3000" max="12000" step="250" value="${budget.needs}" class="w-full">
              <p class="text-xs text-slate-400">Hostel/room rent, campus meals, commute, textbooks, basic utilities.</p>
            </div>

            <!-- Wants Slider -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span class="font-semibold text-slate-200 flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-purple-500"></span> Wants (15-25%)
                </span>
                <span class="font-bold text-white text-base" id="val-wants">₹${budget.wants.toLocaleString('en-IN')} <span class="text-xs text-slate-400">(${wantsPct}%)</span></span>
              </div>
              <input type="range" id="slider-wants" min="500" max="6000" step="250" value="${budget.wants}" class="w-full">
              <p class="text-xs text-slate-400">Cafeteria snacks, movies, video games, clothing, dining out.</p>
            </div>

            <!-- Long-Term Savings Slider -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span class="font-semibold text-slate-200 flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-emerald-500"></span> Long-Term Savings & Goals (15-25%)
                </span>
                <span class="font-bold text-white text-base" id="val-savings">₹${budget.savings.toLocaleString('en-IN')} <span class="text-xs text-slate-400">(${savingsPct}%)</span></span>
              </div>
              <input type="range" id="slider-savings" min="500" max="6000" step="250" value="${budget.savings}" class="w-full">
              <p class="text-xs text-slate-400">Wealth milestone starter, post-graduation fund, index fund investing.</p>
            </div>

            <!-- Emergency Fund Slider -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-sm">
                <span class="font-semibold text-slate-200 flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-amber-500"></span> Emergency Buffer (5-10%)
                </span>
                <span class="font-bold text-white text-base" id="val-emergency">₹${budget.emergencyFund.toLocaleString('en-IN')} <span class="text-xs text-slate-400">(${emergencyPct}%)</span></span>
              </div>
              <input type="range" id="slider-emergency" min="250" max="3000" step="250" value="${budget.emergencyFund}" class="w-full">
              <p class="text-xs text-slate-400">High-yield liquid savings account for medical or hardware emergencies.</p>
            </div>

            <div class="pt-4 border-t border-slate-800 flex justify-end">
              <button id="btn-save-budget" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-2 shadow-md">
                <i data-lucide="check" class="w-4 h-4"></i> Save & Apply Budget
              </button>
            </div>
          </div>

          <!-- Visual Breakdown & Comparison (5 cols) -->
          <div class="card-fintech p-6 lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <h3 class="font-bold text-lg text-white mb-1">Budget Allocation Visual</h3>
              <p class="text-xs text-slate-400 mb-4">Proportion of your ₹${income.toLocaleString('en-IN')} monthly income</p>
              
              <div class="relative h-56 flex items-center justify-center">
                <canvas id="budget-donut-chart"></canvas>
              </div>
            </div>

            <!-- Budget vs Actual Spending Comparison -->
            <div class="space-y-3 pt-4 border-t border-slate-800">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Budget vs. Actual Expense Status</h4>
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-slate-300">Total Actual Outflow (₹${currentExpenses})</span>
                  <span class="text-emerald-400 font-bold">₹${budget.needs + budget.wants} Allowed</span>
                </div>
                <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-indigo-500 h-full rounded-full transition-all" style="width: ${Math.min(100, Math.round((currentExpenses / (budget.needs + budget.wants)) * 100))}%;"></div>
                </div>
              </div>

              <div class="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 text-xs text-slate-300 flex items-center gap-3">
                <i data-lucide="shield-check" class="w-5 h-5 text-emerald-400 flex-shrink-0"></i>
                <span>You are currently spending <strong>₹${currentExpenses}</strong> out of an allowable <strong>₹${budget.needs + budget.wants}</strong> for needs and wants. Good job!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderDonut(budget, income);
    this.bindEvents(container);

    if (window.lucide) window.lucide.createIcons();
  }

  renderDonut(budget, income) {
    const ctx = document.getElementById('budget-donut-chart');
    if (!ctx || !window.Chart) return;

    if (this.allocationChart) this.allocationChart.destroy();
    this.allocationChart = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Needs', 'Wants', 'Savings', 'Emergency Fund'],
        datasets: [{
          data: [budget.needs, budget.wants, budget.savings, budget.emergencyFund],
          backgroundColor: ['#3b82f6', '#a855f7', '#10b981', '#f59e0b'],
          borderColor: '#111827',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 }, boxWidth: 12 }
          }
        },
        cutout: '68%'
      }
    });
  }

  bindEvents(container) {
    const sNeeds = container.querySelector('#slider-needs');
    const sWants = container.querySelector('#slider-wants');
    const sSavings = container.querySelector('#slider-savings');
    const sEmergency = container.querySelector('#slider-emergency');

    const updateLiveLabels = () => {
      const state = window.eduState.getState();
      const income = state.user.monthlyIncome || 15000;
      const n = parseInt(sNeeds.value, 10);
      const w = parseInt(sWants.value, 10);
      const s = parseInt(sSavings.value, 10);
      const e = parseInt(sEmergency.value, 10);

      container.querySelector('#val-needs').innerHTML = `₹${n.toLocaleString('en-IN')} <span class="text-xs text-slate-400">(${Math.round((n/income)*100)}%)</span>`;
      container.querySelector('#val-wants').innerHTML = `₹${w.toLocaleString('en-IN')} <span class="text-xs text-slate-400">(${Math.round((w/income)*100)}%)</span>`;
      container.querySelector('#val-savings').innerHTML = `₹${s.toLocaleString('en-IN')} <span class="text-xs text-slate-400">(${Math.round((s/income)*100)}%)</span>`;
      container.querySelector('#val-emergency').innerHTML = `₹${e.toLocaleString('en-IN')} <span class="text-xs text-slate-400">(${Math.round((e/income)*100)}%)</span>`;

      if (this.allocationChart) {
        this.allocationChart.data.datasets[0].data = [n, w, s, e];
        this.allocationChart.update();
      }
    };

    [sNeeds, sWants, sSavings, sEmergency].forEach(slider => {
      if (slider) slider.addEventListener('input', updateLiveLabels);
    });

    const btnSave = container.querySelector('#btn-save-budget');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const n = parseInt(sNeeds.value, 10);
        const w = parseInt(sWants.value, 10);
        const s = parseInt(sSavings.value, 10);
        const e = parseInt(sEmergency.value, 10);

        window.eduState.updateBudget({
          needs: n,
          wants: w,
          savings: s,
          emergencyFund: e
        });
        window.eduApp.showToast('Budget allocation successfully updated!', 'success');
        this.render();
      });
    }

    const btnPreset = container.querySelector('#btn-budget-preset');
    if (btnPreset) {
      btnPreset.addEventListener('click', () => {
        window.eduState.updateBudget({
          needs: 8000,
          wants: 3000,
          savings: 2500,
          emergencyFund: 1500
        });
        window.eduApp.showToast('Reset to recommended 50/20/20/10 allocation', 'info');
        this.render();
      });
    }
  }
}

window.budgetManager = new BudgetManager();
