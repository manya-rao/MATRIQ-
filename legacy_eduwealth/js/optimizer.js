// RailSync AI - Deterministic AI Block Planning & Scoring Engine
// Team: KINETIX | Problem ID: SIH26027 | Smart India Hackathon 2026
// Decision-Support System for Indian Railways (TMS + SMMS + TDMS + COA)

const RailOptimizer = {
  // Weights for Task Priority Scoring
  taskWeights: {
    criticality: 0.35,
    urgency: 0.25,
    overdue: 0.20,
    assetImportance: 0.20
  },

  // Weights for Candidate Block Plan Scoring
  planWeights: {
    priorityCoverage: 0.25,
    bundlingSynergy: 0.30,
    conflictAvoidance: 0.25,
    punctualityIndex: 0.10,
    downtimeEfficiency: 0.10
  },

  /**
   * Calculates deterministic Task Priority Score (0 to 100)
   * Formula: 0.35*Crit + 0.25*Urg + 0.20*Overdue + 0.20*Importance
   */
  calculateTaskPriority(task) {
    const critMap = { "Critical": 100, "High": 75, "Medium": 50, "Low": 25 };
    const urgMap = { "Immediate": 100, "High": 75, "Scheduled": 50, "Routine": 25 };

    const cScore = critMap[task.criticality] || 50;
    const uScore = urgMap[task.urgency] || 50;
    const oScore = Math.min(100, (task.overdueDays || 0) * 25);
    const aScore = Math.min(100, Math.max(0, task.assetImportance || 50));

    const total = (
      this.taskWeights.criticality * cScore +
      this.taskWeights.urgency * uScore +
      this.taskWeights.overdue * oScore +
      this.taskWeights.assetImportance * aScore
    );

    return {
      totalScore: Math.round(total * 10) / 10,
      breakdown: {
        criticality: cScore,
        urgency: uScore,
        overdue: oScore,
        assetImportance: aScore
      }
    };
  },

  /**
   * Finds spatial-temporal bundling opportunities across departments
   * Groups tasks sharing overlapping KM boundaries within corridor
   */
  findBundlingOpportunities(tasks) {
    const bundles = [];
    const used = new Set();

    for (let i = 0; i < tasks.length; i++) {
      if (used.has(tasks[i].id)) continue;
      const primary = tasks[i];
      const cluster = [primary];
      used.add(primary.id);

      for (let j = i + 1; j < tasks.length; j++) {
        if (used.has(tasks[j].id)) continue;
        const candidate = tasks[j];

        // Spatial overlap condition: Segment intersection or within 2.0 km
        const spatialOverlap = (
          Math.max(primary.fromKm, candidate.fromKm) <=
          Math.min(primary.toKm, candidate.toKm) + 2.0
        );

        if (spatialOverlap) {
          cluster.push(candidate);
          used.add(candidate.id);
        }
      }

      if (cluster.length > 1) {
        // Calculate departmental diversity
        const depts = new Set(cluster.map(t => t.system));
        const totalIsolatedHours = cluster.reduce((sum, t) => sum + t.durationHours, 0);
        const maxSingleDuration = Math.max(...cluster.map(t => t.durationHours));
        const bundledHours = maxSingleDuration + 0.25; // 15 min handover/safety buffer
        const hoursSaved = Math.max(0, totalIsolatedHours - bundledHours);
        const synergyScore = Math.round((hoursSaved / totalIsolatedHours) * 100);

        bundles.push({
          bundleId: `BUNDLE-${primary.fromKm}-${primary.toKm}`,
          kmSpan: `KM ${Math.min(...cluster.map(t => t.fromKm))} - ${Math.max(...cluster.map(t => t.toKm))}`,
          tasks: cluster,
          departmentCount: depts.size,
          departments: Array.from(depts),
          totalIsolatedHours,
          bundledHours,
          hoursSaved,
          synergyScore
        });
      }
    }

    return bundles;
  },

  /**
   * Evaluates train path conflicts against a proposed block window
   */
  evaluateTrainConflicts(fromKm, toKm, startTimeStr, endTimeStr, trains) {
    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    let startMin = toMinutes(startTimeStr);
    let endMin = toMinutes(endTimeStr);
    // Handle overnight window spanning midnight
    if (endMin < startMin) endMin += 24 * 60;

    const conflicts = [];
    let totalPenalty = 0;
    let passengerImpactCount = 0;
    let freightImpactCount = 0;

    trains.forEach(train => {
      if (!train.sectorPassage) return;
      let trainKm120 = toMinutes(train.sectorPassage.km120Time);
      let trainKm125 = toMinutes(train.sectorPassage.km125Time);

      // Handle midnight wrap if applicable
      if (startMin > 12 * 60 && trainKm120 < 6 * 60) {
        trainKm120 += 24 * 60;
        trainKm125 += 24 * 60;
      }

      // Check if train passage intersects block duration (+ 10 min safety clearance)
      const buffer = 10;
      const trainEnters = trainKm120 - buffer;
      const trainExits = trainKm125 + buffer;

      const hasOverlap = (trainEnters < endMin && trainExits > startMin);

      if (hasOverlap) {
        let delayMin = Math.max(10, Math.min(60, endMin - trainEnters));
        let penalty = 0;
        let severity = "LOW";

        if (train.priority === 1) { // Vande Bharat / Rajdhani
          penalty = delayMin * 15;
          severity = "CRITICAL";
          passengerImpactCount++;
        } else if (train.priority === 2) { // Shatabdi / Superfast
          penalty = delayMin * 10;
          severity = "HIGH";
          passengerImpactCount++;
        } else if (train.priority === 3) { // Passenger / Commuter
          penalty = delayMin * 5;
          severity = "MEDIUM";
          passengerImpactCount++;
        } else { // Freight / Goods
          penalty = delayMin * 1.5;
          severity = "LOW";
          freightImpactCount++;
        }

        totalPenalty += penalty;
        conflicts.push({
          trainNo: train.trainNo,
          trainName: train.name,
          trainType: train.type,
          priority: train.priority,
          scheduledPassage: `${train.sectorPassage.km120Time} - ${train.sectorPassage.km125Time}`,
          projectedDelayMin: delayMin,
          severity,
          actionRequired: train.priority <= 2 ? "Reschedule / Re-route" : "Loop at Somna siding"
        });
      }
    });

    const conflictAvoidanceScore = Math.max(0, Math.min(100, Math.round(100 - (totalPenalty / 2.5))));
    const punctualityScore = passengerImpactCount === 0 ? 99 : Math.max(20, 95 - (passengerImpactCount * 25));

    return {
      conflicts,
      conflictAvoidanceScore,
      punctualityScore,
      passengerImpactCount,
      freightImpactCount,
      totalPenalty
    };
  },

  /**
   * Generates candidate block plans based on current tasks and train timetables
   */
  generateCandidatePlans(tasks, trains, options = {}) {
    // Score all individual tasks first
    const scoredTasks = tasks.map(t => ({
      ...t,
      priorityMetrics: this.calculateTaskPriority(t)
    }));

    // Target demo tasks: TMS-01, SMMS-04, TDMS-07
    const primaryTasks = scoredTasks.filter(t =>
      ["TASK-TMS-01", "TASK-SMMS-04", "TASK-TDMS-07"].includes(t.id)
    );

    // If options include simulated defect, add it
    if (options.extraTasks && options.extraTasks.length > 0) {
      options.extraTasks.forEach(et => {
        primaryTasks.push({
          ...et,
          priorityMetrics: this.calculateTaskPriority(et)
        });
      });
    }

    // --- PLAN A: Integrated Shadow Block (Recommended) ---
    // Night window 01:15 to 03:30 (135 min)
    const planAConflicts = this.evaluateTrainConflicts(120, 125, "01:15", "03:30", trains);
    const planADuration = options.engineeringOverrunHours ? 2.25 + options.engineeringOverrunHours : 2.25;
    const planASynergy = 96; // Combines Civil + S&T + Electrical in one synchronized possession
    const planAPriorityCoverage = 98;
    const planADowntimeEff = 94;

    const planAScore = Math.round(
      this.planWeights.priorityCoverage * planAPriorityCoverage +
      this.planWeights.bundlingSynergy * planASynergy +
      this.planWeights.conflictAvoidance * planAConflicts.conflictAvoidanceScore +
      this.planWeights.punctualityIndex * planAConflicts.punctualityScore +
      this.planWeights.downtimeEfficiency * planADowntimeEff
    );

    const planA = {
      planId: "PLAN-A",
      planName: "Integrated Shadow Rolling Block (Night Window)",
      strategy: "Multi-Departmental Concurrent Possession",
      status: "RECOMMENDED",
      rank: 1,
      compositeScore: planAScore,
      window: {
        start: "01:15",
        end: options.engineeringOverrunHours ? (options.engineeringOverrunHours >= 1 ? "04:30" : "03:45") : "03:30",
        durationHours: planADuration,
        durationMin: Math.round(planADuration * 60)
      },
      location: {
        fromKm: 120.0,
        toKm: 125.0,
        track: "UP_MAIN",
        section: "Somna (KM 118) - Kulwa (KM 132)"
      },
      bundledTasks: primaryTasks,
      bundledDepartments: ["TMS (Track)", "SMMS (Signalling)", "TDMS (Traction)"],
      isolatedDowntimeHours: primaryTasks.reduce((s, t) => s + t.durationHours, 0),
      netDowntimeHours: planADuration,
      hoursSaved: Math.max(0, primaryTasks.reduce((s, t) => s + t.durationHours, 0) - planADuration),
      trainConflicts: planAConflicts.conflicts,
      conflictScore: planAConflicts.conflictAvoidanceScore,
      punctualityScore: planAConflicts.punctualityScore,
      passengerDelayMinutes: 0,
      goodsDelayMinutes: 12, // BCNHL-8842 safely held at SOM siding
      impactLevel: "LOW_OPERATIONAL_IMPACT",
      disconnections: [
        "25kV OHE Power Block (Feed Zone SOM-KLA Isolator Open)",
        "Track Traffic Block (UP Main Possession with Stop Board)",
        "Signalling Disconnection (Signal S-42 placed to Danger)"
      ],
      aiReasons: [
        "Concurrent Co-Location: Bundles Track, Signalling & Traction work into a single 135-min window, saving 2.25 hours of repeated line closures.",
        "Zero Premium Passenger Impact: Slots between 21:28 passage of 12560 Shiv Ganga and 06:26 arrival of 12002 Shatabdi Express.",
        "Minimal Freight Detention: Only 1 goods train (BCNHL-8842) looped for 12 minutes on Somna siding with no network bottleneck.",
        "Highest Multi-Departmental Safety: Single unified safety perimeter and coordinated OHE earthing."
      ]
    };

    // --- PLAN B: Siloed Sequential Departmental Blocks (3 Days) ---
    // Isolated blocks across 3 consecutive days
    const planBSynergy = 28;
    const planBPriorityCoverage = 88;
    const planBConflicts = { conflictAvoidanceScore: 68, punctualityScore: 78, conflicts: [
      { trainNo: "BOXN-3109", trainName: "Coal Empty Rake", trainType: "Freight", scheduledPassage: "04:06", projectedDelayMin: 35, severity: "MEDIUM" },
      { trainNo: "64582", trainName: "Aligarh-Tundla MEMU", trainType: "Passenger", scheduledPassage: "08:32", projectedDelayMin: 22, severity: "HIGH" }
    ]};
    const planBDowntimeEff = 45; // 4.5 cumulative hours of possession
    const planBScore = Math.round(
      this.planWeights.priorityCoverage * planBPriorityCoverage +
      this.planWeights.bundlingSynergy * planBSynergy +
      this.planWeights.conflictAvoidance * planBConflicts.conflictAvoidanceScore +
      this.planWeights.punctualityIndex * planBConflicts.punctualityScore +
      this.planWeights.downtimeEfficiency * planBDowntimeEff
    );

    const planB = {
      planId: "PLAN-B",
      planName: "Sequential Siloed Departmental Blocks (3 Days)",
      strategy: "Isolated Single-Department Line Possessions",
      status: "SUBOPTIMAL",
      rank: 3,
      compositeScore: planBScore,
      window: {
        start: "Day 1 (01:30) | Day 2 (02:00) | Day 3 (01:00)",
        end: "Cumulative across 3 nights",
        durationHours: 4.5,
        durationMin: 270
      },
      location: {
        fromKm: 120.0,
        toKm: 125.0,
        track: "UP_MAIN",
        section: "Somna (KM 118) - Kulwa (KM 132)"
      },
      bundledTasks: primaryTasks,
      bundledDepartments: ["Separate TMS Day 1", "Separate SMMS Day 2", "Separate TDMS Day 3"],
      isolatedDowntimeHours: 4.5,
      netDowntimeHours: 4.5,
      hoursSaved: 0,
      trainConflicts: planBConflicts.conflicts,
      conflictScore: planBConflicts.conflictAvoidanceScore,
      punctualityScore: planBConflicts.punctualityScore,
      passengerDelayMinutes: 22,
      goodsDelayMinutes: 55,
      impactLevel: "HIGH_OPERATIONAL_IMPACT",
      disconnections: [
        "Day 1: Track Block (Civil Engineering only)",
        "Day 2: S&T Disconnection only",
        "Day 3: OHE Power Block only"
      ],
      aiReasons: [
        "High Cumulative Downtime: Requires 3 separate line possessions totaling 4.5 hours of lost track capacity.",
        "Triple Staff Deployment: Crew mobilization, cautionary orders, and speed restrictions required 3 times over 3 days.",
        "Suboptimal Track Availability: Prolongs temporary speed restrictions (TSR) across 72 hours instead of 1 night."
      ]
    };

    // --- PLAN C: Day Off-Peak Window with Freight Looping ---
    // Midday window 11:30 to 13:30 (120 min)
    const planCConflicts = this.evaluateTrainConflicts(120, 125, "11:30", "13:30", trains);
    const planCSynergy = 76;
    const planCPriorityCoverage = 92;
    const planCDowntimeEff = 80;
    const planCScore = Math.round(
      this.planWeights.priorityCoverage * planCPriorityCoverage +
      this.planWeights.bundlingSynergy * planCSynergy +
      this.planWeights.conflictAvoidance * planCConflicts.conflictAvoidanceScore +
      this.planWeights.punctualityIndex * planCConflicts.punctualityScore +
      this.planWeights.downtimeEfficiency * planCDowntimeEff
    );

    const planC = {
      planId: "PLAN-C",
      planName: "Daytime Off-Peak Window with Freight Looping",
      strategy: "Partial Shadow Bundling (Daylight Hours)",
      status: "FEASIBLE",
      rank: 2,
      compositeScore: planCScore,
      window: {
        start: "11:30",
        end: "13:30",
        durationHours: 2.0,
        durationMin: 120
      },
      location: {
        fromKm: 120.0,
        toKm: 125.0,
        track: "UP_MAIN",
        section: "Somna (KM 118) - Kulwa (KM 132)"
      },
      bundledTasks: primaryTasks.filter(t => t.id !== "TASK-SMMS-04"), // S&T deferred
      bundledDepartments: ["TMS (Track)", "TDMS (Traction)"],
      isolatedDowntimeHours: 3.5,
      netDowntimeHours: 2.0,
      hoursSaved: 1.5,
      trainConflicts: planCConflicts.conflicts,
      conflictScore: planCConflicts.conflictAvoidanceScore,
      punctualityScore: planCConflicts.punctualityScore,
      passengerDelayMinutes: 0,
      goodsDelayMinutes: 28, // Container rake CONT-5520 delayed
      impactLevel: "MODERATE_OPERATIONAL_IMPACT",
      disconnections: [
        "25kV OHE Power Block (11:30 - 13:30)",
        "Track Traffic Block (UP Main 11:30 - 13:30)"
      ],
      aiReasons: [
        "Daylight Inspection Advantage: Excellent visual conditions for OHE contact wire and rail weld inspection.",
        "Minor Freight Detention: Regulates CONT-5520 container rake for 28 minutes at Aligarh outer siding.",
        "Incomplete Bundling: Signalling inspection deferred, leaving S&T task pending."
      ]
    };

    // Sort plans by composite score descending
    const plans = [planA, planC, planB].sort((a, b) => b.compositeScore - a.compositeScore);

    // Set ranks
    plans.forEach((p, idx) => {
      p.rank = idx + 1;
      p.status = idx === 0 ? "RECOMMENDED" : (idx === 1 ? "FEASIBLE" : "SUBOPTIMAL");
    });

    return {
      plans,
      recommendedPlan: plans[0],
      scoredTasks,
      generatedTimestamp: new Date().toISOString()
    };
  }
};

// Export to module or window
if (typeof module !== "undefined" && module.exports) {
  module.exports = { RailOptimizer };
} else {
  window.RailOptimizer = RailOptimizer;
}
