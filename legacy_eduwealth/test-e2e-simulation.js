// Samanyav AI - End-to-End Simulation & UI Logic Verification
// Team: KINETIX | Problem ID: SIH26027 | Smart India Hackathon 2026

const { RAIL_DATA } = require('./js/data.js');
const { RailOptimizer } = require('./js/optimizer.js');
const { RailSimulator } = require('./js/simulator.js');
const { RailApproval } = require('./js/approval.js');
const assert = require('assert');

console.log('>>> TESTING END-TO-END UI & SIMULATION FLOWS...\n');

// 1. Initial State
const opt = RailOptimizer.generateCandidatePlans(RAIL_DATA.maintenanceTasks, RAIL_DATA.trains);
console.log('1. Optimizer generated plans:');
opt.plans.forEach(p => {
  console.log(`   - [${p.planId}] ${p.planName} | Score: ${p.compositeScore}/100 | Window: ${p.window.start}-${p.window.end} | Status: ${p.status}`);
});

// Verify Plan A is #1 and has the 3 required demo tasks
const planA = opt.plans.find(p => p.planId === 'PLAN-A');
assert(planA, 'Plan A missing');
assert.strictEqual(planA.status, 'RECOMMENDED');
const tms01 = planA.bundledTasks.find(t => t.id === 'TASK-TMS-01');
const smms04 = planA.bundledTasks.find(t => t.id === 'TASK-SMMS-04');
const tdms07 = planA.bundledTasks.find(t => t.id === 'TASK-TDMS-07');
assert(tms01, 'TASK-TMS-01 missing from bundled tasks');
assert(smms04, 'TASK-SMMS-04 missing from bundled tasks');
assert(tdms07, 'TASK-TDMS-07 missing from bundled tasks');
console.log('   ✓ Verified: Plan A bundles all 3 mandated demo tasks (TMS-01, SMMS-04, TDMS-07).\n');

// 2. Test What-if Scenario 1: Passenger Delay 30 min
console.log('2. Executing Simulator Scenario 1 (Passenger Delay +30m)...');
const sim1 = RailSimulator.runScenarioPassengerDelay(30);
console.log(`   - Target Train: ${sim1.targetTrain.trainNo} (${sim1.targetTrain.name})`);
console.log(`   - Before Score: ${sim1.beforePlan.compositeScore} -> After Score: ${sim1.afterPlan.compositeScore}`);
console.log(`   - Mitigation: ${sim1.mitigation}`);
assert(sim1.mitigation.length > 0);
console.log('   ✓ Scenario 1 completed successfully.\n');

// 3. Test What-if Scenario 2: Engineering Overrun +1 hour
console.log('3. Executing Simulator Scenario 2 (Engineering Overrun +1h)...');
const sim2 = RailSimulator.runScenarioEngineeringOverrun(1.0);
console.log(`   - Extended Duration: ${sim2.extendedDuration}h (Net Block: ${sim2.afterPlan.window.durationHours}h)`);
console.log(`   - Before Score: ${sim2.beforePlan.compositeScore} -> After Score: ${sim2.afterPlan.compositeScore}`);
console.log(`   - Mitigation: ${sim2.mitigation}`);
assert(sim2.afterPlan.window.durationHours >= 3.0);
console.log('   ✓ Scenario 2 completed successfully.\n');

// 4. Test What-if Scenario 3: New Critical Track Defect
console.log('4. Executing Simulator Scenario 3 (New Critical Track Defect)...');
const sim3 = RailSimulator.runScenarioNewDefect();
console.log(`   - Injected Defect: ${sim3.newDefect.id} at KM ${sim3.newDefect.fromKm}`);
console.log(`   - Bundled into window: ${sim3.afterPlan.window.start}-${sim3.afterPlan.window.end}`);
console.log(`   - Mitigation: ${sim3.mitigation}`);
assert(sim3.afterPlan.bundledTasks.some(t => t.id === sim3.newDefect.id));
console.log('   ✓ Scenario 3 completed successfully.\n');

// 5. Test Approval Workflow
console.log('5. Executing Approval Workflow...');
RailApproval.init(planA);
const sanction = RailApproval.approveSanction({
  name: 'Rajiv Verma',
  designation: 'Sr.DOM',
  authId: 'IR-DOM-94421'
});
console.log(`   - Sanction Issued: #${sanction.sanctionId} | Status: ${sanction.status}`);
console.log(`   - Approver: ${sanction.approvedBy.name} (${sanction.approvedBy.designation})`);
assert.strictEqual(sanction.status, 'SANCTIONED');
console.log('   ✓ Approval Workflow completed successfully.\n');

console.log('>>> ALL END-TO-END VERIFICATION CHECKS PASSED!\n');
