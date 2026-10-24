// EduWealth AI - Wealth Goal Planner Module
// Visual progress tracking, multi-goal roadmaps, and monthly target calculations

class GoalsManager {
  render(containerId = 'goals-view') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const state = window.eduState.getState();
    const goals = state.goals;
    const primaryGoal = goals.find(g => g.isPrimary) || goals[0];

    // Primary goal calculations
    const primaryTarget = primaryGoal ? primaryGoal.targetAmount : 100000;
    const primaryCurrent = primaryGoal ? primaryGoal.currentAmount : 20000;
    const primaryMonths = primaryGoal ? primaryGoal.deadlineMonths : 24;
    const primaryRemaining = Math.max(0, primaryTarget - primaryCurrent);
    const primaryMonthlyTarget = Math.ceil(primaryRemaining / primaryMonths);
    const primaryProgressPct = Math.min(100, Math.round((primaryCurrent / primaryTarget) * 100));

    container.innerHTML = `
      <div class="space-y-6 animate-fade-in">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Wealth Goal Planner 🎯</h2>
            <p class="text-sm text-slate-400 mt-1">Translate ambitious student dreams into manageable monthly milestones.</p>
          </div>
          <button id="btn-open-add-goal" class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-md transition-all text-sm">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> Create New Goal
          </button>
        </div>

        <!-- Featured Primary Goal Card -->
        <div class="card-fintech p-6 md:p-8 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-purple-950/50 border border-indigo-500/40 relative overflow-hidden rounded-2xl">
          <div class="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  Primary Milestone
                </span>
                <h3 class="text-2xl font-black text-white mt-2 flex items-center gap-2">
                  <span>${primaryGoal ? primaryGoal.icon : '🎯'}</span> ${primaryGoal ? primaryGoal.title : 'Wealth Starter Milestone'}
                </h3>
              </div>
              <div class="text-left sm:text-right">
                <span class="text-xs text-slate-400">Target Timeframe</span>
                <div class="text-base font-bold text-slate-200">${primaryMonths} Months (2 Years)</div>
              </div>
            </div>

            <!-- Mathematical Breakdown -->
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 py-4 border-y border-slate-800/80">
              <div>
                <span class="text-xs text-slate-400 uppercase font-semibold">Current Savings</span>
                <div class="text-2xl font-black text-white mt-1">₹${primaryCurrent.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span class="text-xs text-slate-400 uppercase font-semibold">Target Goal</span>
                <div class="text-2xl font-black text-indigo-400 mt-1">₹${primaryTarget.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span class="text-xs text-slate-400 uppercase font-semibold">Remaining Needed</span>
                <div class="text-2xl font-black text-rose-400 mt-1">₹${primaryRemaining.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <span class="text-xs text-slate-400 uppercase font-semibold">Required Monthly</span>
                <div class="text-2xl font-black text-emerald-400 mt-1">₹${primaryMonthlyTarget.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <!-- Visual Progress Tracker Representation (ASCII + Bar) -->
            <div class="space-y-2">
              <div class="flex justify-between text-xs font-mono font-bold">
                <span class="text-emerald-400">₹${primaryCurrent.toLocaleString('en-IN')} Saved</span>
                <span class="text-indigo-400">${primaryProgressPct}% Achieved</span>
                <span class="text-slate-400">Target: ₹${primaryTarget.toLocaleString('en-IN')}</span>
              </div>
              
              <!-- Large Custom Progress Bar -->
              <div class="w-full bg-slate-800/80 h-5 rounded-full overflow-hidden p-1 border border-slate-700">
                <div class="bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700 relative" style="width: ${primaryProgressPct}%;">
                  <span class="absolute right-2 top-0.5 w-2 h-2 rounded-full bg-white animate-ping"></span>
                </div>
              </div>

              <!-- Retro Visual String Tracker -->
              <div class="hidden sm:block text-center font-mono text-xs text-slate-400 pt-1">
                ₹${primaryCurrent.toLocaleString('en-IN')} ━━━━━━━░░░░░ ₹${primaryTarget.toLocaleString('en-IN')}
              </div>
            </div>

            <div class="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between gap-4">
              <div class="flex items-center gap-2">
                <i data-lucide="sparkles" class="w-4 h-4 text-amber-400"></i>
                <span>At your current ₹9,000 monthly savings rate, you are on track to achieve this milestone <strong>10 months ahead of schedule!</strong></span>
              </div>
              <button class="btn-deposit-goal px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex-shrink-0" data-id="${primaryGoal ? primaryGoal.id : 'goal-1'}">
                + Add Savings
              </button>
            </div>
          </div>
        </div>

        <!-- All Active Goals Grid -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-lg text-white">Active Student Goals (${goals.length})</h3>
            <span class="text-xs text-slate-400">Click "+ Add Savings" to advance any goal</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${goals.map(g => {
              const progress = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              const remaining = Math.max(0, g.targetAmount - g.currentAmount);
              const monthly = Math.ceil(remaining / g.deadlineMonths);
              return `
                <div class="card-fintech p-6 flex flex-col justify-between border border-slate-800 hover:border-indigo-500/50 transition-all">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-3xl">${g.icon}</span>
                      <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                        ${g.category}
                      </span>
                    </div>

                    <h4 class="font-bold text-lg text-white mt-2">${g.title}</h4>
                    <span class="text-xs text-slate-400">${g.deadlineMonths} Months Roadmap</span>

                    <div class="mt-4 space-y-2">
                      <div class="flex justify-between text-xs font-semibold">
                        <span class="text-slate-400">Current: <strong class="text-white">₹${g.currentAmount.toLocaleString('en-IN')}</strong></span>
                        <span class="text-indigo-400">${progress}%</span>
                      </div>
                      <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div class="bg-indigo-500 h-full rounded-full transition-all" style="width: ${progress}%;"></div>
                      </div>
                      <div class="flex justify-between text-[11px] text-slate-400">
                        <span>Target: ₹${g.targetAmount.toLocaleString('en-IN')}</span>
                        <span class="text-emerald-400">₹${monthly}/mo target</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button class="btn-deposit-goal flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1" data-id="${g.id}">
                      <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Funds
                    </button>
                    ${!g.isPrimary ? `
                      <button class="btn-delete-goal p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors" data-id="${g.id}" title="Remove Goal">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                      </button>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
    if (window.lucide) window.lucide.createIcons();
  }

  bindEvents(container) {
    const btnOpenAdd = container.querySelector('#btn-open-add-goal');
    if (btnOpenAdd) {
      btnOpenAdd.addEventListener('click', () => {
        window.eduApp.showModal('modal-add-goal');
      });
    }

    container.querySelectorAll('.btn-deposit-goal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openDepositModal(id);
      });
    });

    container.querySelectorAll('.btn-delete-goal').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) {
          window.eduState.deleteGoal(id);
          window.eduApp.showToast('Goal removed', 'info');
          this.render();
        }
      });
    });
  }

  openDepositModal(goalId) {
    const state = window.eduState.getState();
    const goal = state.goals.find(g => g.id === goalId);
    if (!goal) return;

    const modal = document.getElementById('modal-deposit-goal');
    if (!modal) return;

    modal.querySelector('#deposit-goal-title').textContent = goal.title;
    modal.querySelector('#deposit-goal-current').textContent = `₹${goal.currentAmount.toLocaleString('en-IN')}`;
    modal.querySelector('#deposit-goal-target').textContent = `₹${goal.targetAmount.toLocaleString('en-IN')}`;

    const inputAmt = modal.querySelector('#deposit-input-amt');
    inputAmt.value = 1000;

    const btnConfirm = modal.querySelector('#btn-confirm-deposit');
    btnConfirm.onclick = () => {
      const amt = parseFloat(inputAmt.value);
      if (!amt || amt <= 0) {
        window.eduApp.showToast('Please enter a valid deposit amount', 'error');
        return;
      }
      window.eduState.updateGoalProgress(goal.id, amt);
      window.eduApp.hideModal('modal-deposit-goal');
      window.eduApp.showToast(`₹${amt.toLocaleString('en-IN')} added to ${goal.title}!`, 'success');
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
      this.render();
    };

    window.eduApp.showModal('modal-deposit-goal');
  }
}

window.goalsManager = new GoalsManager();
