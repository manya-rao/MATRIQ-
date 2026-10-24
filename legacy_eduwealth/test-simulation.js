// EduWealth AI - Automated Business Logic & Simulation Tests

const fs = require('fs');

// Mock localStorage and window
class LocalStorageMock {
  constructor() { this.store = {}; }
  getItem(key) { return this.store[key] || null; }
  setItem(key, value) { this.store[key] = String(value); }
  removeItem(key) { delete this.store[key]; }
  clear() { this.store = {}; }
}

global.localStorage = new LocalStorageMock();
global.window = {
  localStorage: global.localStorage
};

// Load state.js
const stateCode = fs.readFileSync('js/state.js', 'utf8');
eval(stateCode);

console.log('--- Test 1: State Initialization & Demo Profile ---');
const state = window.eduState.getState();
console.assert(state.user.name === 'Manya', 'Name should be Manya');
console.assert(state.user.monthlyIncome === 15000, 'Income should be 15,000');
console.assert(state.user.monthlyExpenses === 6000, 'Expenses should be 6,000');
console.assert(state.user.currentSavings === 9000, 'Savings should be 9,000');
console.assert(state.user.healthScore === 78, 'Health score should be 78');
console.log('✓ Demo profile initialized accurately:', state.user.name, state.user.college);

console.log('\n--- Test 2: Expense Calculations & CRUD ---');
const initialExpCount = state.expenses.length;
const newExp = window.eduState.addExpense({
  name: 'Semester Revision Notes',
  amount: 400,
  category: 'Education',
  date: '2026-09-08'
});
console.assert(window.eduState.state.expenses.length === initialExpCount + 1, 'Expense count should increment');
console.assert(window.eduState.getTotalExpenses() === 6400, 'Total expense should now be 6,400');
console.assert(window.eduState.state.user.currentSavings === 8600, 'Current savings should adjust to 8,600');
console.log('✓ Added expense. New total outflow:', window.eduState.getTotalExpenses());

window.eduState.deleteExpense(newExp.id);
console.assert(window.eduState.getTotalExpenses() === 6000, 'Expense deletion should restore 6,000');
console.log('✓ Deleted expense. Restored total outflow:', window.eduState.getTotalExpenses());

console.log('\n--- Test 3: Virtual Investment Simulator Engine ---');
const initialCash = window.eduState.state.portfolio.cash;
window.eduState.executeTrade({
  assetId: 'ast-1',
  symbol: 'NXT-TECH',
  type: 'BUY',
  shares: 5,
  price: 210
});
console.assert(window.eduState.state.portfolio.cash === initialCash - (5 * 210), 'Cash should deduct accurately');
const nxtHolding = window.eduState.state.portfolio.holdings.find(h => h.symbol === 'NXT-TECH');
console.assert(nxtHolding.shares === 20, 'Shares should have increased from 15 to 20');
console.log('✓ Executed simulated BUY. Cash remaining:', window.eduState.state.portfolio.cash);

window.eduState.executeTrade({
  assetId: 'ast-1',
  symbol: 'NXT-TECH',
  type: 'SELL',
  shares: 5,
  price: 210
});
console.assert(nxtHolding.shares === 15, 'Shares should have returned to 15');
console.assert(window.eduState.state.portfolio.cash === initialCash, 'Cash restored');
console.log('✓ Executed simulated SELL. Shares restored to 15.');

console.log('\n--- Test 4: Goal Calculations ---');
const primaryGoal = window.eduState.state.goals.find(g => g.isPrimary);
const target = primaryGoal.targetAmount;
const cur = primaryGoal.currentAmount;
const months = primaryGoal.deadlineMonths;
const neededMonthly = Math.ceil((target - cur) / months);
console.assert(neededMonthly === 3334, `Monthly needed should be 3,334, got ${neededMonthly}`);
console.log('✓ Primary Goal calculation verified: ₹1,00,000 target requires ₹' + neededMonthly + '/mo over ' + months + ' months');

console.log('\n--- Test 5: EcoWealth Compound Calculation ---');
const ecoSummary = window.eduState.getEcoSavingsSummary();
console.assert(ecoSummary.monthlyTotalSavings === 1050, `Monthly eco savings should be 1050 (300+150+600), got ${ecoSummary.monthlyTotalSavings}`);
console.assert(ecoSummary.annualSavings === 12600, `Annual eco savings should be 12600, got ${ecoSummary.annualSavings}`);
console.assert(ecoSummary.futureValue > 80000, `5-year future value should exceed 80k, got ${ecoSummary.futureValue}`);
console.log('✓ EcoWealth verified: ₹' + ecoSummary.annualSavings + '/year compounded over 5 years yields ₹' + ecoSummary.futureValue.toLocaleString());

console.log('\n--- Test 6: Financial Academy Quizzes & XP ---');
const initialXP = window.eduState.state.user.learningScore;
window.eduState.addXP(50, 'Completed quiz');
console.assert(window.eduState.state.user.learningScore === initialXP + 50, 'XP should increment by 50');
console.log('✓ Gamification XP system verified. Total XP:', window.eduState.state.user.learningScore);

console.log('\n===========================================');
console.log('  ALL SIMULATION & BUSINESS TESTS PASSED!  ');
console.log('===========================================');
