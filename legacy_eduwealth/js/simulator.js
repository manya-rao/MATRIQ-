// EduWealth AI - Virtual Investment Simulator Module
// Completely virtual portfolio, fictional securities, interactive trading & risk education

class SimulatorManager {
  constructor() {
    this.performanceChart = null;
    this.activeTradeAsset = null;
    this.activeTradeType = 'BUY';
  }

  render(containerId = 'simulator-view') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const state = window.eduState.getState();
    const summary = window.eduState.getPortfolioSummary();
    const holdings = state.portfolio.holdings;
    const available = state.availableAssets;
    const tradeHistory = state.portfolio.tradeHistory;

    container.innerHTML = `
      <div class="space-y-6 animate-fade-in">
        <!-- Prominent Simulation Disclaimer Banner -->
        <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="text-2xl">⚠️</span>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  SIMULATION — NO REAL MONEY
                </span>
                <span class="text-xs text-amber-200/80 hidden sm:inline">Zero Financial Risk</span>
              </div>
              <p class="text-xs text-slate-300 mt-0.5">
                This sandbox environment uses fictional assets for educational practice. No real money or brokerage accounts are connected.
              </p>
            </div>
          </div>
          <span class="text-xs text-amber-400 font-mono hidden md:block">Practice Sandbox v1.0</span>
        </div>

        <!-- Header & Portfolio Metric Cards -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold tracking-tight">Virtual Investment Simulator 📈</h2>
            <p class="text-sm text-slate-400 mt-1">Learn market concepts, asset allocation, and volatility risk safely.</p>
          </div>
        </div>

        <!-- 4 Portfolio Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="card-fintech p-5 border-l-4 border-l-indigo-500">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Virtual Value</span>
            <div class="text-2xl sm:text-3xl font-black mt-1 text-white">₹${summary.totalVirtualValue.toLocaleString('en-IN')}</div>
            <div class="text-xs ${summary.gainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-semibold mt-1 flex items-center gap-1">
              <i data-lucide="${summary.gainLoss >= 0 ? 'trending-up' : 'trending-down'}" class="w-3.5 h-3.5"></i>
              ${summary.gainLoss >= 0 ? '+' : ''}₹${summary.gainLoss.toLocaleString('en-IN')} (${summary.totalReturnPct}%)
            </div>
          </div>

          <div class="card-fintech p-5 border-l-4 border-l-emerald-500">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Virtual Cash Balance</span>
            <div class="text-2xl sm:text-3xl font-black mt-1 text-emerald-400">₹${summary.cash.toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-400 mt-1">Available to buy practice assets</div>
          </div>

          <div class="card-fintech p-5 border-l-4 border-l-purple-500">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Invested Holdings Value</span>
            <div class="text-2xl sm:text-3xl font-black mt-1 text-purple-400">₹${summary.holdingsValue.toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-400 mt-1">Across ${holdings.length} practice securities</div>
          </div>

          <div class="card-fintech p-5 border-l-4 border-l-cyan-500">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Initial Virtual Seed</span>
            <div class="text-2xl sm:text-3xl font-black mt-1 text-cyan-400">₹${summary.initialCash.toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-400 mt-1">Virtual practice allocation</div>
          </div>
        </div>

        <!-- Educational Risk Note Banner -->
        <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center gap-3 text-xs text-slate-300">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
            <i data-lucide="info" class="w-4 h-4"></i>
          </div>
          <div>
            <strong class="text-white">Core Principle of Investing:</strong> Higher potential return generally comes with higher risk and price fluctuations. Diversifying across stocks, mutual funds, and bonds balances your risk profile!
          </div>
        </div>

        <!-- Simulated Portfolio Performance Chart -->
        <div class="card-fintech p-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 class="font-bold text-lg text-white flex items-center gap-2">
                <i data-lucide="line-chart" class="w-5 h-5 text-indigo-400"></i> Simulated Portfolio Performance Trajectory
              </h3>
              <p class="text-xs text-slate-400">Hypothetical growth compared to seed ₹10,000 capital</p>
            </div>
            <span class="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Return: +${summary.totalReturnPct}%
            </span>
          </div>
          <div class="relative h-64">
            <canvas id="sim-performance-chart"></canvas>
          </div>
        </div>

        <!-- Available Fictional Securities for Trading -->
        <div class="card-fintech p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-lg text-white">Market Sandbox: Practice Securities</h3>
              <p class="text-xs text-slate-400">Trade hypothetical assets to experience order execution and price changes</p>
            </div>
            <span class="text-xs text-slate-400 font-mono">Live Simulator Feed</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            ${available.map(asset => {
              const owned = holdings.find(h => h.symbol === asset.symbol);
              const ownedShares = owned ? owned.shares : 0;
              return `
                <div class="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all">
                  <div>
                    <div class="flex items-center justify-between">
                      <span class="font-mono text-xs font-bold text-indigo-400">${asset.symbol}</span>
                      <span class="text-[10px] px-2 py-0.5 rounded-full ${this.getRiskBadge(asset.risk)}">
                        ${asset.risk} Risk
                      </span>
                    </div>
                    <h4 class="font-bold text-sm text-white mt-1">${asset.name}</h4>
                    <p class="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">${asset.description}</p>
                  </div>

                  <div>
                    <div class="flex items-baseline justify-between py-2 border-t border-slate-800">
                      <div>
                        <span class="text-xs text-slate-400">Price:</span>
                        <div class="text-lg font-black text-white">₹${asset.price}</div>
                      </div>
                      <div class="text-right">
                        <span class="text-xs text-slate-400">Sim. Return:</span>
                        <div class="text-xs font-bold text-emerald-400">${asset.returnYTD}</div>
                      </div>
                    </div>

                    <div class="text-[11px] text-slate-400 mb-3 flex justify-between">
                      <span>You Own:</span>
                      <strong class="text-white">${ownedShares} shares</strong>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <button class="btn-trade-open w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1" data-symbol="${asset.symbol}" data-action="BUY">
                        Buy
                      </button>
                      <button class="btn-trade-open w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-1 ${ownedShares === 0 ? 'opacity-50 cursor-not-allowed' : ''}" data-symbol="${asset.symbol}" data-action="SELL" ${ownedShares === 0 ? 'disabled' : ''}>
                        Sell
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Current Portfolio Holdings Table -->
        <div class="card-fintech p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-lg text-white">Current Virtual Holdings</h3>
              <p class="text-xs text-slate-400">Position valuation and unrealized gains</p>
            </div>
            <span class="text-xs text-slate-400">${holdings.length} Assets in Portfolio</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
              <thead class="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-700/60">
                <tr>
                  <th class="py-3 px-4 rounded-l-lg">Asset</th>
                  <th class="py-3 px-4">Shares</th>
                  <th class="py-3 px-4">Avg Cost</th>
                  <th class="py-3 px-4">Current Price</th>
                  <th class="py-3 px-4">Holding Value</th>
                  <th class="py-3 px-4 text-right rounded-r-lg">Unrealized P&L</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                ${holdings.map(h => {
                  const cost = h.shares * h.avgBuyPrice;
                  const currentVal = h.shares * h.currentPrice;
                  const pnl = currentVal - cost;
                  const pnlPct = Math.round((pnl / cost) * 1000) / 10;
                  return `
                    <tr class="hover:bg-slate-800/30 transition-colors">
                      <td class="py-3 px-4">
                        <div class="font-bold text-white">${h.name}</div>
                        <span class="font-mono text-xs text-indigo-400">${h.symbol}</span>
                      </td>
                      <td class="py-3 px-4 font-semibold text-white">${h.shares}</td>
                      <td class="py-3 px-4 text-slate-300">₹${h.avgBuyPrice}</td>
                      <td class="py-3 px-4 text-slate-300">₹${h.currentPrice}</td>
                      <td class="py-3 px-4 font-bold text-white">₹${currentVal.toLocaleString('en-IN')}</td>
                      <td class="py-3 px-4 text-right font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
                        ${pnl >= 0 ? '+' : ''}₹${pnl} (${pnl >= 0 ? '+' : ''}${pnlPct}%)
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Trade History -->
        <div class="card-fintech p-6">
          <h3 class="font-bold text-lg text-white mb-2">Simulated Order Journal</h3>
          <p class="text-xs text-slate-400 mb-4">Complete audit log of your practice buy and sell decisions</p>

          <div class="space-y-2">
            ${tradeHistory.slice(0, 5).map(tr => `
              <div class="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between text-xs">
                <div class="flex items-center gap-3">
                  <span class="px-2 py-0.5 rounded-full font-bold text-[10px] ${tr.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
                    ${tr.type}
                  </span>
                  <span class="font-bold text-white">${tr.shares} shares of ${tr.symbol}</span>
                  <span class="text-slate-400">@ ₹${tr.price}/share</span>
                </div>
                <div class="flex items-center gap-4">
                  <span class="font-semibold text-white">₹${tr.total.toLocaleString('en-IN')}</span>
                  <span class="text-slate-500">${tr.date}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.renderLineChart();
    this.bindEvents(container);

    if (window.lucide) window.lucide.createIcons();
  }

  getRiskBadge(risk) {
    switch (risk) {
      case 'High': return 'bg-rose-500/20 text-rose-300 border border-rose-500/30';
      case 'Medium-High': return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
      case 'Moderate': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      default: return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
    }
  }

  renderLineChart() {
    const ctx = document.getElementById('sim-performance-chart');
    if (!ctx || !window.Chart) return;

    if (this.performanceChart) this.performanceChart.destroy();
    this.performanceChart = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Current'],
        datasets: [
          {
            label: 'Simulated Portfolio Value (₹)',
            data: [10000, 10150, 10320, 10280, 10600, 10850],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#10b981',
            pointRadius: 4
          },
          {
            label: 'Benchmark Initial Cash (₹)',
            data: [10000, 10000, 10000, 10000, 10000, 10000],
            borderColor: '#64748b',
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
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

  openTradeModal(symbol, action) {
    const state = window.eduState.getState();
    const asset = state.availableAssets.find(a => a.symbol === symbol);
    if (!asset) return;

    const modal = document.getElementById('modal-trade-simulator');
    if (!modal) return;

    this.activeTradeAsset = asset;
    this.activeTradeType = action;

    const owned = state.portfolio.holdings.find(h => h.symbol === symbol);
    const ownedShares = owned ? owned.shares : 0;

    modal.querySelector('#trade-modal-title').textContent = `${action} ${asset.symbol}`;
    modal.querySelector('#trade-asset-name').textContent = asset.name;
    modal.querySelector('#trade-asset-price').textContent = `₹${asset.price}`;
    modal.querySelector('#trade-cash-avail').textContent = `₹${state.portfolio.cash.toLocaleString('en-IN')}`;
    modal.querySelector('#trade-shares-owned').textContent = `${ownedShares} shares`;

    const inputShares = modal.querySelector('#trade-input-shares');
    inputShares.value = 1;
    inputShares.max = action === 'BUY' ? Math.floor(state.portfolio.cash / asset.price) : ownedShares;

    const calcTotal = () => {
      const shares = parseInt(inputShares.value, 10) || 0;
      const total = shares * asset.price;
      modal.querySelector('#trade-total-cost').textContent = `₹${total.toLocaleString('en-IN')}`;
    };

    inputShares.oninput = calcTotal;
    calcTotal();

    const btnConfirm = modal.querySelector('#btn-confirm-trade');
    btnConfirm.textContent = `Confirm Simulated ${action}`;
    btnConfirm.className = `w-full py-3 rounded-xl text-white font-bold text-sm transition-all ${action === 'BUY' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-rose-600 hover:bg-rose-500'}`;

    btnConfirm.onclick = () => {
      const shares = parseInt(inputShares.value, 10);
      if (!shares || shares <= 0) {
        window.eduApp.showToast('Please specify valid share quantity', 'error');
        return;
      }
      try {
        window.eduState.executeTrade({
          assetId: asset.id,
          symbol: asset.symbol,
          type: action,
          shares,
          price: asset.price
        });
        window.eduApp.hideModal('modal-trade-simulator');
        window.eduApp.showToast(`Simulated ${action} of ${shares} shares of ${asset.symbol} completed!`, 'success');
        this.render();
      } catch (err) {
        window.eduApp.showToast(err.message, 'error');
      }
    };

    window.eduApp.showModal('modal-trade-simulator');
  }

  bindEvents(container) {
    container.querySelectorAll('.btn-trade-open').forEach(btn => {
      btn.addEventListener('click', () => {
        const symbol = btn.getAttribute('data-symbol');
        const action = btn.getAttribute('data-action');
        this.openTradeModal(symbol, action);
      });
    });
  }
}

window.simulatorManager = new SimulatorManager();
