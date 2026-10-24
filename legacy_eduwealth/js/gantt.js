// RailSync AI - Interactive SVG Gantt & Time-Distance Chart
// Team: KINETIX | Problem ID: SIH26027 | Smart India Hackathon 2026
// Visualizes train trajectories against maintenance block windows

const RailGantt = {
  /**
   * Render Time-Distance Chart for a selected block plan
   * @param {string} containerId DOM ID of container element
   * @param {object} plan The block plan object (Plan A, B, or C)
   * @param {Array} trains List of trains
   * @param {object} options Additional display options
   */
  render(containerId, plan, trains, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Dimensions
    const width = options.width || container.clientWidth || 920;
    const height = options.height || 360;
    const margin = { top: 40, right: 30, bottom: 40, left: 60 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Time domain: 00:00 to 08:00 (focus window for night & morning blocks)
    // In minutes from midnight: 0 to 480
    const minTime = options.minTimeMinutes !== undefined ? options.minTimeMinutes : 0;
    const maxTime = options.maxTimeMinutes !== undefined ? options.maxTimeMinutes : 480;

    // Distance domain: KM 100 (Aligarh) to KM 160 (Tundla)
    const minKm = 100;
    const maxKm = 160;

    // Coordinate conversion
    const timeToX = (min) => margin.left + ((min - minTime) / (maxTime - minTime)) * chartWidth;
    const kmToY = (km) => margin.top + ((km - minKm) / (maxKm - minKm)) * chartHeight;

    const timeStrToMinutes = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    // Build SVG
    let svgHtml = `
      <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" class="gantt-svg">
        <defs>
          <linearGradient id="blockGradientA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.35" />
            <stop offset="50%" stop-color="#10b981" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.35" />
          </linearGradient>
          <linearGradient id="blockGradientWarning" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.4" />
          </linearGradient>
          <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="10" stroke="#f59e0b" stroke-width="2" stroke-opacity="0.6" />
          </pattern>
        </defs>

        <!-- Background & Grid -->
        <rect x="${margin.left}" y="${margin.top}" width="${chartWidth}" height="${chartHeight}" fill="#0f172a" rx="4" />
    `;

    // Horizontal Station Guides
    RAIL_DATA.stations.forEach(st => {
      const y = kmToY(st.km);
      svgHtml += `
        <line x1="${margin.left}" y1="${y}" x2="${margin.left + chartWidth}" y2="${y}" stroke="#334155" stroke-dasharray="3,3" stroke-width="1" />
        <text x="${margin.left - 8}" y="${y + 4}" fill="#94a3b8" font-size="11" font-weight="600" text-anchor="end">${st.code}</text>
        <text x="${margin.left + chartWidth + 6}" y="${y + 4}" fill="#64748b" font-size="10" text-anchor="start">${st.km} KM</text>
      `;
    });

    // Vertical Time Grid (every 60 min from 00:00 to 08:00)
    for (let m = minTime; m <= maxTime; m += 60) {
      const x = timeToX(m);
      const h = Math.floor(m / 60);
      const timeLabel = `${String(h).padStart(2, "0")}:00`;
      svgHtml += `
        <line x1="${x}" y1="${margin.top}" x2="${x}" y2="${margin.top + chartHeight}" stroke="#1e293b" stroke-width="1" />
        <text x="${x}" y="${margin.top - 12}" fill="#cbd5e1" font-size="11" font-family="monospace" text-anchor="middle">${timeLabel}</text>
        <text x="${x}" y="${margin.top + chartHeight + 18}" fill="#64748b" font-size="10" font-family="monospace" text-anchor="middle">${timeLabel}</text>
      `;
    }

    // Render Proposed Block Windows
    if (plan && plan.window && plan.location) {
      if (plan.planId === "PLAN-A" || plan.planId === "PLAN-C" || options.customWindow) {
        let blockStartMin = timeStrToMinutes(plan.window.start || "01:15");
        let blockEndMin = timeStrToMinutes(plan.window.end || "03:30");
        if (blockEndMin < blockStartMin) blockEndMin += 24 * 60; // overnight

        const bX = timeToX(blockStartMin);
        const bW = timeToX(blockEndMin) - bX;
        const bY = kmToY(plan.location.fromKm || 120);
        const bH = kmToY(plan.location.toKm || 125) - bY;

        const isOverrun = options.isOverrun || false;
        const fillId = isOverrun ? "url(#blockGradientWarning)" : "url(#blockGradientA)";
        const strokeColor = isOverrun ? "#ef4444" : "#38bdf8";

        svgHtml += `
          <!-- Block Possession Zone -->
          <g class="block-possession-group">
            <rect x="${bX}" y="${bY}" width="${bW}" height="${bH}" fill="${fillId}" stroke="${strokeColor}" stroke-width="2" rx="4" filter="drop-shadow(0 2px 8px rgba(56,189,248,0.3))" />
            <rect x="${bX}" y="${bY}" width="${bW}" height="${bH}" fill="url(#diagonalHatch)" rx="4" />
            
            <!-- Block Label -->
            <rect x="${bX + 8}" y="${bY + 6}" width="160" height="22" rx="3" fill="#0284c7" fill-opacity="0.9" />
            <text x="${bX + 14}" y="${bY + 21}" fill="#ffffff" font-size="11" font-weight="700">
              ⚡ INTEGRATED BLOCK (${plan.window.start}-${plan.window.end})
            </text>
            
            <text x="${bX + 14}" y="${bY + 38}" fill="#38bdf8" font-size="10" font-weight="600">
              TMS + SMMS + TDMS (KM 120-125)
            </text>
          </g>
        `;
      } else if (plan.planId === "PLAN-B") {
        // Render 3 separate siloed blocks
        const blocks = [
          { name: "Day 1 TMS", start: "01:30", end: "03:30", color: "#2563eb" },
          { name: "Day 2 SMMS", start: "02:00", end: "03:00", color: "#10b981" },
          { name: "Day 3 TDMS", start: "01:00", end: "02:30", color: "#f59e0b" }
        ];

        blocks.forEach((b, i) => {
          const bStart = timeStrToMinutes(b.start);
          const bEnd = timeStrToMinutes(b.end);
          const bX = timeToX(bStart);
          const bW = timeToX(bEnd) - bX;
          const bY = kmToY(120 + i * 1.5);
          const bH = 18;

          svgHtml += `
            <rect x="${bX}" y="${bY}" width="${bW}" height="${bH}" fill="${b.color}" fill-opacity="0.5" stroke="${b.color}" stroke-width="1.5" rx="3" />
            <text x="${bX + 6}" y="${bY + 13}" fill="#ffffff" font-size="9" font-weight="700">${b.name} (${b.start}-${b.end})</text>
          `;
        });
      }
    }

    // Render Train Trajectories (Time vs Distance Lines)
    trains.forEach(train => {
      if (!train.sectorPassage) return;
      const tStart = timeStrToMinutes(train.entryTime);
      const tExit = timeStrToMinutes(train.exitTime);

      // Only plot trains falling in or near 00:00 - 08:00
      if (tStart > maxTime && tExit > maxTime) return;

      const x1 = timeToX(tStart);
      const y1 = kmToY(train.entryKm);
      const x2 = timeToX(tExit);
      const y2 = kmToY(train.exitKm);

      // Color coding by train class
      let lineColor = "#60a5fa";
      let strokeW = 2;
      let dashArray = "none";

      if (train.priority === 1) {
        lineColor = "#ef4444"; // Vande Bharat / Rajdhani (Red / Critical)
        strokeW = 3;
      } else if (train.priority === 2) {
        lineColor = "#fb923c"; // Shatabdi / Superfast (Orange)
        strokeW = 2.5;
      } else if (train.priority === 3) {
        lineColor = "#a78bfa"; // Commuter / MEMU (Purple)
        strokeW = 2;
      } else {
        lineColor = "#34d399"; // Goods / Freight (Green)
        strokeW = 2;
        dashArray = train.currentDelayMin > 0 ? "5,3" : "none";
      }

      // Draw train line
      svgHtml += `
        <g class="train-line-group" data-train="${train.trainNo}">
          <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${lineColor}" stroke-width="${strokeW}" stroke-dasharray="${dashArray}" opacity="0.95" />
          
          <!-- Train label badge -->
          <circle cx="${x1}" cy="${y1}" r="3" fill="${lineColor}" />
          <circle cx="${x2}" cy="${y2}" r="3" fill="${lineColor}" />
          <text x="${x1 + 4}" y="${y1 - 6}" fill="${lineColor}" font-size="10" font-weight="700">
            ${train.trainNo} ${train.name.split(" ")[0]}
          </text>
        </g>
      `;
    });

    // Axis Labels & Title
    svgHtml += `
        <!-- X Axis Label -->
        <text x="${width / 2}" y="${height - 6}" fill="#94a3b8" font-size="11" font-weight="600" text-anchor="middle">
          TIME OF DAY (HOURS:MINUTES) — 24-HR TIMETABLE PROJECTION
        </text>
        <!-- Y Axis Label -->
        <text x="18" y="${height / 2}" fill="#94a3b8" font-size="11" font-weight="600" text-anchor="middle" transform="rotate(-90 18 ${height / 2})">
          CORRIDOR LOCATION (KM POST / STATIONS)
        </text>
      </svg>
    `;

    container.innerHTML = svgHtml;
  }
};

// Export to module or window
if (typeof module !== "undefined" && module.exports) {
  module.exports = { RailGantt };
} else {
  window.RailGantt = RailGantt;
}
