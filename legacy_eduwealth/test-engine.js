// Samanyav AI - Automated Verification & Test Suite
// Team: KINETIX | Problem ID: SIH26027 | Smart India Hackathon 2026

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Load modules
const { RAIL_DATA } = require('./js/data.js');
const { RailOptimizer } = require('./js/optimizer.js');
const { RailSimulator } = require('./js/simulator.js');
const { RailApproval } = require('./js/approval.js');

console.log('====================================================');
console.log('  SAMANYAV AI — AUTOMATED TEST SUITE (TEAM KINETIX)');
console.log('====================================================\n');

let testsPassed = 0;
let testsTotal = 0;

function test(name, fn) {
  testsTotal++;
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    Error: ${err.message}`);
  }
}

// 1. Data Integrity Tests
test('Demo tasks specified by SIH26027 prompt are present', () => {
  const tms = RAIL_DATA.maintenanceTasks.find(t => t.id === 'TASK-TMS-01');
  const smms = RAIL_DATA.maintenanceTasks.find(t => t.id === 'TASK-SMMS-04');
  const tdms = RAIL_DATA.maintenanceTasks.find(t => t.id === 'TASK-TDMS-07');

  assert(tms, 'TMS demo task missing');
  assert.strictEqual(tms.criticality, 'Critical');
  assert.strictEqual(tms.fromKm, 120.0);
  assert.strictEqual(tms.toKm, 125.0);
  assert.strictEqual(tms.durationHours, 2.0);

  assert(smms, 'SMMS demo task missing');
  assert.strictEqual(smms.criticality, 'High');
  assert.strictEqual(smms.fromKm, 123.0);
  assert.strictEqual(smms.durationHours, 1.0);

  assert(tdms, 'TDMS demo task missing');
  assert.strictEqual(tdms.criticality, 'High');
  assert.strictEqual(tdms.fromKm, 120.0);
  assert.strictEqual(tdms.toKm, 125.0);
  assert.strictEqual(tdms.durationHours, 1.5);
});

// 2. Deterministic AI Scoring Tests
test('Deterministic Task Priority scoring produces consistent results', () => {
  const tms = RAIL_DATA.maintenanceTasks.find(t => t.id === 'TASK-TMS-01');
  const p = RailOptimizer.calculateTaskPriority(tms);

  assert(p.totalScore >= 95, `Expected high priority score for critical task, got ${p.totalScore}`);
  assert.strictEqual(p.breakdown.criticality, 100);
  assert.strictEqual(p.breakdown.urgency, 100);
});

test('Spatial-Temporal Bundling correctly identifies co-located tasks', () => {
  const bundles = RailOptimizer.findBundlingOpportunities(RAIL_DATA.maintenanceTasks);
  assert(bundles.length > 0, 'No bundles identified');
  
  const targetBundle = bundles.find(b => b.bundleId === 'BUNDLE-120-125' || b.kmSpan.includes('125'));
  assert(targetBundle, 'Target KM 120-125 bundle not found');
  assert(targetBundle.tasks.length >= 3, 'Bundle should contain at least 3 co-located tasks');
  assert(targetBundle.hoursSaved > 0, 'Bundling must save hours compared to isolated work');
});

// 3. Candidate Plans Generation Tests
test('Generates at least 3 candidate plans with Plan A ranked #1 Recommended', () => {
  const result = RailOptimizer.generateCandidatePlans(RAIL_DATA.maintenanceTasks, RAIL_DATA.trains);
  assert(result.plans.length >= 3, `Expected at least 3 plans, got ${result.plans.length}`);
  
  const rec = result.recommendedPlan;
  assert.strictEqual(rec.planId, 'PLAN-A');
  assert.strictEqual(rec.status, 'RECOMMENDED');
  assert.strictEqual(rec.rank, 1);
  assert(rec.compositeScore > result.plans[1].compositeScore, 'Recommended plan must have highest score');
  assert(rec.hoursSaved > 1.0, 'Recommended plan must save at least 1 hour of line possession');
});

// 4. What-if Disruption Simulator Tests
test('Simulator Scenario 1: 30-min passenger delay handles buffer absorption', () => {
  const sim = RailSimulator.runScenarioPassengerDelay(30);
  assert.strictEqual(sim.scenario, 'passenger_delay');
  assert.strictEqual(sim.delayMin, 30);
  assert(sim.afterPlan, 'Simulator afterPlan must exist');
  assert(sim.mitigation.length > 0, 'Mitigation explanation must be provided');
});

test('Simulator Scenario 2: 1-hour engineering overrun extends block and triggers regulation', () => {
  const sim = RailSimulator.runScenarioEngineeringOverrun(1.0);
  assert.strictEqual(sim.scenario, 'engineering_overrun');
  assert(sim.afterPlan.window.durationHours >= 3.0, 'Duration must be extended');
  assert(sim.mitigation.includes('BOXN-3109') || sim.mitigation.includes('TSR'), 'Mitigation should address regulation or TSR');
});

test('Simulator Scenario 3: New critical defect dynamically bundles into block', () => {
  const sim = RailSimulator.runScenarioNewDefect();
  assert.strictEqual(sim.scenario, 'new_defect');
  assert(sim.newDefect, 'New defect task must be created');
  assert(sim.afterPlan.bundledTasks.some(t => t.id.includes('EMERGENCY')), 'Emergency task should be bundled into block');
});

// 5. Human Approval Workflow Tests
test('Human approval issues Form T/409B Block Sanction Order', () => {
  const plan = RailOptimizer.generateCandidatePlans(RAIL_DATA.maintenanceTasks, RAIL_DATA.trains).recommendedPlan;
  RailApproval.init(plan);
  
  const res = RailApproval.approveSanction({
    name: 'Rajiv Verma',
    designation: 'Sr.DOM',
    authId: 'IR-DOM-94421'
  });

  assert.strictEqual(res.status, 'SANCTIONED');
  assert(res.sanctionId.startsWith('IR/NCR/PRYJ/BL-'), 'Sanction ID format invalid');
  assert.strictEqual(res.approvedBy.name, 'Rajiv Verma');
});

// 6. Strict Team Name Integrity Check
test('Strict check: Team Name KINETIX is verified and no misspellings exist in project files', () => {
  const filesToCheck = [
    'index.html',
    'package.json',
    'server.js',
    'css/styles.css',
    'js/data.js',
    'js/optimizer.js',
    'js/simulator.js',
    'js/gantt.js',
    'js/approval.js',
    'js/app.js'
  ];

  const forbiddenMisspellings = ['kanetix', 'k-a-n-e-t-i-x', 'kanetx', 'kinetx'];

  filesToCheck.forEach(file => {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf8').toLowerCase();
    
    // Ensure no forbidden spelling exists
    forbiddenMisspellings.forEach(misspelling => {
      assert(
        !content.includes(misspelling),
        `Found forbidden misspelling "${misspelling}" in ${file}`
      );
    });

    // Ensure KINETIX is present in key user-facing files
    if (['index.html', 'js/data.js', 'server.js'].includes(file)) {
      assert(content.includes('kinetix'), `Expected "kinetix" in ${file}`);
    }
  });
});

console.log(`\nResults: ${testsPassed} of ${testsTotal} tests passed.\n`);

if (testsPassed === testsTotal) {
  console.log('>>> ALL VERIFICATION TESTS PASSED SUCCESSFULLY! <<<\n');
  process.exit(0);
} else {
  console.error('>>> SOME TESTS FAILED! <<<\n');
  process.exit(1);
}
