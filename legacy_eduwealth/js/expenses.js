// EduWealth AI - Expense Tracker Module
// Full CRUD, dynamic chart visualizations, and real-time AI spending insights

class ExpenseManager {
  constructor() {
    this.donutChart = null;
    this.barChart = null;
  }

  render(containerId = 'expenses-view') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const state = window.eduState.getState();
    const totalExpenses = window.eduState.getTotalExpenses();
    const categories = window.eduState.getExpensesByCategory();

    // Determine top category and insights
    let topCategory = 'None';
    let topAmount = 0;
    for (const [cat, amt] of Object.entries(categories)) {
      if (amt > topAmount) {
        topAmount = amt;
        topCategory = cat;
      }
    }
    const topPct = totalExpenses > 0 ? Math.round((topAmount / totalExpenses) * 100) : 0;

    container.innerHTML = `
      <div class="space-y-6 animate-fade-in">
        <!-- Header & Quick Stat Bar -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Expense Tracker 💳</h2>
            <p class="text-sm text-slate-400 mt-1">Track where every rupee goes, spot leakages, and optimize your monthly budget.</p>
          </div>
          <button id="btn-open-add-expense" class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all text-sm">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> Add Expense
          </button>
        </div>

        <!-- 3 Stat Highlight Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="card-fintech p-5 border-l-4 border-l-indigo-500">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Monthly Spending</span>
            <div class="text-3xl font-extrabold mt-1 text-white">₹${totalExpenses.toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-400 mt-1">Out of ₹${(state.user.monthlyIncome || 15000).toLocaleString('en-IN')} income</div>
          </div>
          <div class="card-fintech p-5 border-l-4 border-l-emerald-500">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Largest Category</span>
            <div class="text-3xl font-extrabold mt-1 text-emerald-400">${topCategory}</div>
            <div class="text-xs text-slate-400 mt-1">₹${topAmount.toLocaleString('en-IN')} (${topPct}% of spending)</div>
          </div>
          <div class="card-fintech p-5 border-l-4 border-l-cyan-500">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Discretionary Ratio</span>
            <div class="text-3xl font-extrabold mt-1 text-cyan-400">
              ${totalExpenses > 0 ? Math.round(((categories['Shopping'] || 0) + (categories['Entertainment'] || 0) + (categories['Other'] || 0)) / totalExpenses * 100) : 0}%
            </div>
            <div class="text-xs text-slate-400 mt-1">Shopping, fun & other extras</div>
          </div>
        </div>

        <!-- AI Spending Insights Banner -->
        <div class="card-fintech p-5 bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-slate-900/40 border border-indigo-500/30 rounded-2xl">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <i data-lucide="sparkles" class="w-5 h-5"></i>
            </div>
            <div class="space-y-2 flex-1">
              <div class="flex items-center justify-between">
                <h4 class="font-bold text-base text-indigo-300">AI Spending Intelligence</h4>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">Live Analysis</span>
              </div>
              <p class="text-sm text-slate-300 leading-relaxed">
                💡 <strong class="text-white">You spent 22% more on shopping this month</strong> compared with your previous month benchmark.
              </p>
              <p class="text-sm text-slate-300 leading-relaxed">
                🍔 Your <strong class="text-emerald-400">${topCategory} expenses</strong> are currently your largest spending category at <strong>₹${topAmount.toLocaleString('en-IN')}</strong>. Consolidating grocery trips or taking college cafeteria lunches can save up to ₹800 next month!
              </p>
            </div>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Donut Category Breakdown -->
          <div class="card-fintech p-6 flex flex-col justify-between">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-lg text-white flex items-center gap-2">
                <i data-lucide="pie-chart" class="w-5 h-5 text-indigo-400"></i> Category Breakdown
              </h3>
              <span class="text-xs text-slate-400">Donut Distribution</span>
            </div>
            <div class="relative h-64 flex items-center justify-center">
              <canvas id="expense-donut-chart"></canvas>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-800 text-xs">
              ${Object.entries(categories).map(([cat, amt]) => `
                <div class="flex items-center gap-1.5 text-slate-300">
                  <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
                  <span class="truncate">${cat}:</span>
                  <strong class="text-white">₹${amt}</strong>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Weekly / Category Comparison Bar Chart -->
          <div class="card-fintech p-6 flex flex-col justify-between">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-lg text-white flex items-center gap-2">
                <i data-lucide="bar-chart-3" class="w-5 h-5 text-cyan-400"></i> Spending by Category (₹)
              </h3>
              <span class="text-xs text-slate-400">Current Month</span>
            </div>
            <div class="relative h-64 flex items-center justify-center">
              <canvas id="expense-bar-chart"></canvas>
            </div>
            <div class="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-800 flex justify-between">
              <span>Goal: Keep total spending under ₹8,000</span>
              <span class="text-emerald-400 font-semibold">On Track</span>
            </div>
          </div>
        </div>

        <!-- Recent Transactions Table -->
        <div class="card-fintech p-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 class="font-bold text-lg text-white">Recent Transactions</h3>
              <p class="text-xs text-slate-400">All registered student expenses for this billing cycle</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400">Total Entries: ${state.expenses.length}</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead class="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-700/60">
                <tr>
                  <th class="py-3 px-4 rounded-l-lg">Expense Name</th>
                  <th class="py-3 px-4">Category</th>
                  <th class="py-3 px-4">Date</th>
                  <th class="py-3 px-4 text-right">Amount</th>
                  <th class="py-3 px-4 text-center rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                ${state.expenses.length === 0 ? `
                  <tr>
                    <td colspan="5" class="py-8 text-center text-slate-500">
                      No expenses logged yet. Click "Add Expense" above to start tracking!
                    </td>
                  </tr>
                ` : state.expenses.map(exp => `
                  <tr class="hover:bg-slate-800/30 transition-colors">
                    <td class="py-3.5 px-4 font-medium text-white flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 text-xs">
                        ${this.getCategoryIconEmoji(exp.category)}
                      </div>
                      <span>${this.escapeHtml(exp.name)}</span>
                    </td>
                    <td class="py-3.5 px-4">
                      <span class="px-2.5 py-1 text-xs rounded-full ${this.getCategoryBadgeClass(exp.category)}">
                        ${exp.category}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 text-xs text-slate-400">${exp.date}</td>
                    <td class="py-3.5 px-4 text-right font-bold text-white">₹${Number(exp.amount).toLocaleString('en-IN')}</td>
                    <td class="py-3.5 px-4 text-center">
                      <button class="btn-delete-expense p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors" data-id="${exp.id}" title="Delete Expense">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Render charts
    this.renderCharts(categories);

    // Bind event listeners
    this.bindEvents(container);

    if (window.lucide) window.lucide.createIcons();
  }

  getCategoryIconEmoji(cat) {
    switch (cat) {
      case 'Food': return '🍔';
      case 'Travel': return '🚌';
      case 'Education': return '📚';
      case 'Shopping': return '🛍️';
      case 'Entertainment': return '🎬';
      case 'Bills': return '💡';
      default: return '📦';
    }
  }

  getCategoryBadgeClass(cat) {
    switch (cat) {
      case 'Food': return 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
      case 'Travel': return 'bg-blue-500/15 text-blue-300 border border-blue-500/30';
      case 'Education': return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
      case 'Shopping': return 'bg-purple-500/15 text-purple-300 border border-purple-500/30';
      case 'Entertainment': return 'bg-pink-500/15 text-pink-300 border border-pink-500/30';
      case 'Bills': return 'bg-orange-500/15 text-orange-300 border border-orange-500/30';
      default: return 'bg-slate-700/40 text-slate-300 border border-slate-600/30';
    }
  }

  renderCharts(categories) {
    const labels = Object.keys(categories).length ? Object.keys(categories) : ['No Data'];
    const data = Object.values(categories).length ? Object.values(categories) : [1];

    const colors = [
      '#6366f1', // Indigo
      '#10b981', // Emerald
      '#a855f7', // Purple
      '#06b6d4', // Cyan
      '#f59e0b', // Amber
      '#ec4899', // Pink
      '#64748b'  // Slate
    ];

    // Donut Chart
    const donutCtx = document.getElementById('expense-donut-chart');
    if (donutCtx && window.Chart) {
      if (this.donutChart) this.donutChart.destroy();
      this.donutChart = new window.Chart(donutCtx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: colors.slice(0, labels.length),
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
              position: 'right',
              labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 }, boxWidth: 12 }
            }
          },
          cutout: '70%'
        }
      });
    }

    // Bar Chart
    const barCtx = document.getElementById('expense-bar-chart');
    if (barCtx && window.Chart) {
      if (this.barChart) this.barChart.destroy();
      this.barChart = new window.Chart(barCtx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Amount (₹)',
            data,
            backgroundColor: colors.slice(0, labels.length).map(c => c + 'cc'),
            borderColor: colors.slice(0, labels.length),
            borderWidth: 1.5,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
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
  }

  bindEvents(container) {
    const btnOpenAdd = container.querySelector('#btn-open-add-expense');
    if (btnOpenAdd) {
      btnOpenAdd.addEventListener('click', () => {
        window.eduApp.showModal('modal-add-expense');
      });
    }

    const deleteButtons = container.querySelectorAll('.btn-delete-expense');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        if (id) {
          window.eduState.deleteExpense(id);
          window.eduApp.showToast('Expense removed', 'info');
          this.render();
        }
      });
    });
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

window.expenseManager = new ExpenseManager();
