// Samanyav AI - Realistic Synthetic Dataset
// Developed by Team: KINETIX | Smart India Hackathon 2026 | Problem ID: SIH26027
// Indian Railways High-Density Network (HDN-1) Corridor: Prayagraj Division (KM 100 - KM 160)
// Decision-Support Prototype | Synthetic Data Modeled on IR TMS, SMMS, TDMS, COA Systems

const RAIL_DATA = {
  metadata: {
    systemName: "Samanyav AI",
    version: "2.4.0",
    teamName: "KINETIX",
    problemId: "SIH26027",
    division: "Prayagraj Division (North Central Railway)",
    corridor: "New Delhi - Pt. Deen Dayal Upadhyaya Route (Sub-section: KM 100 - KM 160)",
    mode: "Decision-Support Simulation (Synthetic Demo Data)",
    lastSyncTimestamp: "2026-09-05T10:30:00+05:30",
    currentSimTime: "01:00", // Baseline simulation clock (early morning block window)
    disclaimer: "Samanyav AI is a decision-support prototype operating on realistic synthetic benchmarks. It does not connect directly to live Indian Railways production servers."
  },

  // Corridor Stations & Geographical Markers
  stations: [
    { code: "ALJN", name: "Aligarh Junction", km: 100.0, loops: 3, platforms: 5 },
    { code: "SOM", name: "Somna", km: 118.2, loops: 2, platforms: 2 },
    { code: "KLA", name: "Kulwa", km: 132.5, loops: 1, platforms: 2 },
    { code: "HRS", name: "Hathras Junction", km: 145.0, loops: 2, platforms: 3 },
    { code: "TDL", name: "Tundla Junction", km: 160.0, loops: 4, platforms: 5 }
  ],

  // Track Assets & Health Monitoring
  trackSegments: [
    { segmentId: "SEC-100-110", fromKm: 100, toKm: 110, track: "UP_MAIN", tci: 88, gmt: 48.5, maxSpeed: 130, tsr: null },
    { segmentId: "SEC-110-120", fromKm: 110, toKm: 120, track: "UP_MAIN", tci: 79, gmt: 51.2, maxSpeed: 130, tsr: null },
    { segmentId: "SEC-120-125", fromKm: 120, toKm: 125, track: "UP_MAIN", tci: 62, gmt: 54.8, maxSpeed: 110, tsr: "TSR 50 km/h (Weld Defect)" },
    { segmentId: "SEC-125-135", fromKm: 125, toKm: 135, track: "UP_MAIN", tci: 84, gmt: 49.1, maxSpeed: 130, tsr: null },
    { segmentId: "SEC-135-145", fromKm: 135, toKm: 145, track: "UP_MAIN", tci: 76, gmt: 52.0, maxSpeed: 120, tsr: null },
    { segmentId: "SEC-145-160", fromKm: 145, toKm: 160, track: "UP_MAIN", tci: 81, gmt: 50.4, maxSpeed: 130, tsr: null }
  ],

  // Maintenance Tasks (TMS = Track, SMMS = Signalling, TDMS = Traction)
  // MUST include the demo tasks specified in the user prompt!
  maintenanceTasks: [
    // --- DEMO TASKS EXPLICITLY MANDATED BY SIH SPECIFICATION ---
    {
      id: "TASK-TMS-01",
      system: "TMS",
      department: "Engineering (Track)",
      title: "Rail defect repair (USFD IMR Weld Flaw)",
      fromKm: 120.0,
      toKm: 125.0,
      track: "UP_MAIN",
      durationHours: 2.0,
      criticality: "Critical", // Critical, High, Medium, Low
      urgency: "Immediate",    // Immediate, High, Scheduled, Routine
      overdueDays: 4,
      assetImportance: 95,     // 1 - 100
      requiresPowerBlock: false,
      requiresTrafficBlock: true,
      description: "Emergency weld repair for detected internal transverse fatigue crack between KM 122/4 and 122/8.",
      crewReady: true,
      machinery: "Flash Butt Welding Plant, Portable Rail Saw"
    },
    {
      id: "TASK-SMMS-04",
      system: "SMMS",
      department: "S&T (Signalling)",
      title: "Signal inspection & Axle Counter Head Check",
      fromKm: 123.0,
      toKm: 123.0,
      track: "UP_MAIN",
      durationHours: 1.0,
      criticality: "High",
      urgency: "High",
      overdueDays: 2,
      assetImportance: 88,
      requiresPowerBlock: false,
      requiresTrafficBlock: true,
      description: "Signal aspect visibility test, clamp lock integrity, and high-frequency axle counter tune at Signal S-42.",
      crewReady: true,
      machinery: "Signal Testing Kit, High-V Multi-meter"
    },
    {
      id: "TASK-TDMS-07",
      system: "TDMS",
      department: "Traction (Electrical/TRD)",
      title: "OHE maintenance & Contact Wire Stagger Check",
      fromKm: 120.0,
      toKm: 125.0,
      track: "UP_MAIN",
      durationHours: 1.5,
      criticality: "High",
      urgency: "High",
      overdueDays: 3,
      assetImportance: 85,
      requiresPowerBlock: true,
      requiresTrafficBlock: true,
      description: "Catenary dropper adjustment, contact wire wear gauging, and insulator cleaning on 25kV AC overhead equipment.",
      crewReady: true,
      machinery: "4-Wheeler OHE Tower Wagon #TRD-44"
    },

    // --- ADDITIONAL REALISTIC CORRIDOR TASKS ---
    {
      id: "TASK-TMS-02",
      system: "TMS",
      department: "Engineering (Track)",
      title: "Plain Track Tamping (CSM-09-32)",
      fromKm: 135.0,
      toKm: 139.0,
      track: "UP_MAIN",
      durationHours: 3.0,
      criticality: "Medium",
      urgency: "Scheduled",
      overdueDays: 1,
      assetImportance: 72,
      requiresPowerBlock: false,
      requiresTrafficBlock: true,
      description: "Routine mechanised packing to restore track twist and longitudinal top parameters.",
      crewReady: true,
      machinery: "09-32 CSM Tamping Machine"
    },
    {
      id: "TASK-SMMS-01",
      system: "SMMS",
      department: "S&T (Signalling)",
      title: "Point Machine Overhaul (Point 112A)",
      fromKm: 145.0,
      toKm: 145.0,
      track: "UP_MAIN",
      durationHours: 1.5,
      criticality: "High",
      urgency: "High",
      overdueDays: 2,
      assetImportance: 82,
      requiresPowerBlock: false,
      requiresTrafficBlock: true,
      description: "Motor insulation overhaul, carbon brush renewal, and obstruction test (5mm gauge) at Hathras Jn.",
      crewReady: true,
      machinery: "Siemens 143mm Throw Gauge Kit"
    },
    {
      id: "TASK-TDMS-01",
      system: "TDMS",
      department: "Traction (Electrical/TRD)",
      title: "Section Insulator Overhaul (KM 145/2)",
      fromKm: 144.5,
      toKm: 145.5,
      track: "UP_MAIN",
      durationHours: 1.5,
      criticality: "High",
      urgency: "High",
      overdueDays: 1,
      assetImportance: 80,
      requiresPowerBlock: true,
      requiresTrafficBlock: true,
      description: "Replacement of arcing horns, runner alignment, and silicon composite insulator testing.",
      crewReady: true,
      machinery: "Tower Wagon #TRD-44"
    },
    {
      id: "TASK-TMS-03",
      system: "TMS",
      department: "Engineering (Track)",
      title: "De-stressing of Long Welded Rail (LWR)",
      fromKm: 105.0,
      toKm: 108.0,
      track: "UP_MAIN",
      durationHours: 2.5,
      criticality: "Medium",
      urgency: "Scheduled",
      overdueDays: 0,
      assetImportance: 68,
      requiresPowerBlock: false,
      requiresTrafficBlock: true,
      description: "Thermal destressing with hydraulic rail tensor to prevent summer track buckling.",
      crewReady: false,
      machinery: "Hydraulic Rail Tensor, Gas Cutters"
    },
    {
      id: "TASK-SMMS-02",
      system: "SMMS",
      department: "S&T (Signalling)",
      title: "Track Circuit Impedance Bond Overhaul",
      fromKm: 118.0,
      toKm: 120.0,
      track: "UP_MAIN",
      durationHours: 1.0,
      criticality: "Low",
      urgency: "Routine",
      overdueDays: 0,
      assetImportance: 55,
      requiresPowerBlock: false,
      requiresTrafficBlock: true,
      description: "Clean choke coils, inspect insulated rail joints (IRJ), verify AC immunization.",
      crewReady: true,
      machinery: "IRJ Test Probe"
    },
    {
      id: "TASK-TDMS-02",
      system: "TDMS",
      department: "Traction (Electrical/TRD)",
      title: "Contact Wire Dropper Adjustment",
      fromKm: 134.0,
      toKm: 138.0,
      track: "UP_MAIN",
      durationHours: 2.0,
      criticality: "Medium",
      urgency: "Scheduled",
      overdueDays: 0,
      assetImportance: 65,
      requiresPowerBlock: true,
      requiresTrafficBlock: true,
      description: "Current carrying dropper replacement and cantilever insulator high-pressure wash.",
      crewReady: true,
      machinery: "TRD Ladder Gang"
    }
  ],

  // Train Movements (Scheduled & Live in Control Office Application - COA)
  trains: [
    {
      trainNo: "22436",
      name: "Vande Bharat Express",
      type: "Vande Bharat / Premium",
      priority: 1, // 1 = highest
      speedKmH: 130,
      origin: "New Delhi (NDLS)",
      destination: "Varanasi (BSB)",
      currentStatus: "On Time",
      currentDelayMin: 0,
      entryKm: 100,
      entryTime: "06:45",
      exitKm: 160,
      exitTime: "07:18",
      sectorPassage: {
        km120Time: "06:56",
        km125Time: "06:59"
      }
    },
    {
      trainNo: "12302",
      name: "Howrah Rajdhani Express",
      type: "Rajdhani / Premium",
      priority: 1,
      speedKmH: 130,
      origin: "New Delhi (NDLS)",
      destination: "Howrah (HWH)",
      currentStatus: "On Time",
      currentDelayMin: 0,
      entryKm: 100,
      entryTime: "17:40",
      exitKm: 160,
      exitTime: "18:13",
      sectorPassage: {
        km120Time: "17:51",
        km125Time: "17:54"
      }
    },
    {
      trainNo: "12002",
      name: "Bhopal Shatabdi Express",
      type: "Shatabdi / Intercity",
      priority: 2,
      speedKmH: 130,
      origin: "New Delhi (NDLS)",
      destination: "Rani Kamlapati (RKMP)",
      currentStatus: "On Time",
      currentDelayMin: 0,
      entryKm: 100,
      entryTime: "06:15",
      exitKm: 160,
      exitTime: "06:48",
      sectorPassage: {
        km120Time: "06:26",
        km125Time: "06:29"
      }
    },
    {
      trainNo: "12560",
      name: "Shiv Ganga Express",
      type: "Superfast Express",
      priority: 2,
      speedKmH: 110,
      origin: "New Delhi (NDLS)",
      destination: "Banaras (BSBS)",
      currentStatus: "On Time",
      currentDelayMin: 0,
      entryKm: 100,
      entryTime: "20:50",
      exitKm: 160,
      exitTime: "21:28",
      sectorPassage: {
        km120Time: "21:03",
        km125Time: "21:07"
      }
    },
    {
      trainNo: "64582",
      name: "Aligarh-Tundla MEMU",
      type: "Passenger / Commuter",
      priority: 3,
      speedKmH: 80,
      origin: "Aligarh (ALJN)",
      destination: "Tundla (TDL)",
      currentStatus: "On Time",
      currentDelayMin: 0,
      entryKm: 100,
      entryTime: "08:10",
      exitKm: 160,
      exitTime: "09:15",
      sectorPassage: {
        km120Time: "08:32",
        km125Time: "08:38"
      }
    },
    {
      trainNo: "BCNHL-8842",
      name: "Bulk Grain Freight (BCNHL)",
      type: "Freight / Goods",
      priority: 4,
      speedKmH: 65,
      origin: "Dadri DFC Yard",
      destination: "Mughalsarai Yard",
      currentStatus: "Looped at SOM siding",
      currentDelayMin: 12,
      entryKm: 100,
      entryTime: "01:05",
      exitKm: 160,
      exitTime: "02:15",
      sectorPassage: {
        km120Time: "01:28",
        km125Time: "01:35"
      }
    },
    {
      trainNo: "BOXN-3109",
      name: "Coal Empty Rake (BOXN)",
      type: "Freight / Goods",
      priority: 4,
      speedKmH: 70,
      origin: "Panki Power House",
      destination: "Singrauli Coalfields",
      currentStatus: "On Time",
      currentDelayMin: 0,
      entryKm: 100,
      entryTime: "03:45",
      exitKm: 160,
      exitTime: "04:50",
      sectorPassage: {
        km120Time: "04:06",
        km125Time: "04:12"
      }
    },
    {
      trainNo: "CONT-5520",
      name: "Double Stack Container (CONCOR)",
      type: "Freight / Container",
      priority: 3,
      speedKmH: 75,
      origin: "Khatuwas Concor",
      destination: "JNPT Port",
      currentStatus: "On Time",
      currentDelayMin: 0,
      entryKm: 100,
      entryTime: "12:10",
      exitKm: 160,
      exitTime: "13:10",
      sectorPassage: {
        km120Time: "12:28",
        km125Time: "12:34"
      }
    }
  ],

  // Departmental Configuration & Contact Officers
  departments: {
    TMS: {
      name: "Engineering (Track)",
      code: "TMS",
      officer: "Sr.DEN / Northern Central Railway",
      color: "#2563eb",
      badgeClass: "badge-tms",
      icon: "hammer"
    },
    SMMS: {
      name: "S&T (Signalling & Telecom)",
      code: "SMMS",
      officer: "Sr.DSTE / Prayagraj",
      color: "#10b981",
      badgeClass: "badge-smms",
      icon: "radio"
    },
    TDMS: {
      name: "Traction (Electrical TRD)",
      code: "TDMS",
      officer: "Sr.DEE (TRD) / Prayagraj",
      color: "#f59e0b",
      badgeClass: "badge-tdms",
      icon: "zap"
    },
    COA: {
      name: "Control Office Application (Operations)",
      code: "COA",
      officer: "Sr.DOM / Chief Controller",
      color: "#8b5cf6",
      badgeClass: "badge-coa",
      icon: "activity"
    }
  },

  // Historical / Weekly / Monthly Benchmark Data
  weeklyData: {
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    blocksDelivered: [4, 6, 5, 7, 5, 8, 4],
    availabilityTrend: [98.4, 98.7, 98.5, 98.9, 98.6, 98.8, 98.6],
    punctualityIndex: [97.2, 98.1, 96.8, 97.5, 98.4, 97.9, 98.2],
    bundledBlockHours: [7.5, 11.0, 9.5, 13.2, 10.0, 15.5, 8.0],
    isolatedEquivalentHours: [12.0, 18.5, 15.0, 21.0, 16.5, 24.0, 13.0]
  }
};

// Export to window for browser and module for node
if (typeof module !== "undefined" && module.exports) {
  module.exports = { RAIL_DATA };
} else {
  window.RAIL_DATA = RAIL_DATA;
}
