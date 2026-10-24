// Samanyav AI - Human-in-the-Loop Approval & Sanction Workflow Engine
// Team: KINETIX | Problem ID: SIH26027 | Smart India Hackathon 2026
// Simulates Indian Railways BDMS / COA Block Sanction Order issuance

const RailApproval = {
  state: {
    status: "PENDING_REVIEW", // PENDING_REVIEW, SANCTIONED, REJECTED, DISPATCHED
    sanctionId: "IR/NCR/PRYJ/BL-2026-09-041",
    approvedBy: null,
    approvalTimestamp: null,
    targetPlan: null,
    remarks: "",
    auditTrail: [
      {
        timestamp: "2026-09-05T01:00:00+05:30",
        actor: "Samanyav AI Optimizer (KINETIX Engine)",
        action: "PLAN_GENERATED",
        detail: "Plan A (Integrated Shadow Block 01:15-03:30) formulated with composite score 95/100."
      },
      {
        timestamp: "2026-09-05T01:05:00+05:30",
        actor: "COA Interface Module",
        action: "CONFLICT_CHECK_PASSED",
        detail: "Zero passenger conflicts verified against 22436 Vande Bharat & 12302 Rajdhani."
      }
    ]
  },

  /**
   * Initialize approval workflow with a target plan
   */
  init(plan) {
    this.state.targetPlan = plan;
    this.state.status = "PENDING_REVIEW";
    this.state.approvedBy = null;
    this.state.approvalTimestamp = null;
  },

  /**
   * Submit Human Approval & Issue Block Sanction
   */
  approveSanction(officerData) {
    this.state.status = "SANCTIONED";
    this.state.approvedBy = {
      name: officerData.name || "Rajiv Verma",
      designation: officerData.designation || "Sr. Divisional Operations Manager (Sr.DOM)",
      station: "Prayagraj Division (NCR)",
      authId: officerData.authId || "IR-DOM-94421"
    };
    this.state.approvalTimestamp = new Date().toISOString();
    this.state.remarks = officerData.remarks || "Sanctioned as proposed. Ensure co-ordinated earthing and caution order at Somna.";

    this.state.auditTrail.push({
      timestamp: this.state.approvalTimestamp,
      actor: `${this.state.approvedBy.name} (${this.state.approvedBy.designation})`,
      action: "SANCTION_APPROVED",
      detail: `Formal block sanction granted for Window ${this.state.targetPlan ? this.state.targetPlan.window.start : "01:15"} - ${this.state.targetPlan ? this.state.targetPlan.window.end : "03:30"}.`
    });

    this.state.auditTrail.push({
      timestamp: new Date(Date.now() + 1000).toISOString(),
      actor: "Samanyav BDMS Bridge",
      action: "DISPATCHED_TO_BDMS_COA",
      detail: "Disconnection Notice and Caution Orders transmitted to Section Controller console & Station Masters SOM/KLA."
    });

    return {
      success: true,
      sanctionId: this.state.sanctionId,
      status: this.state.status,
      approvedBy: this.state.approvedBy,
      approvalTimestamp: this.state.approvalTimestamp,
      auditTrail: this.state.auditTrail
    };
  },

  /**
   * Formats printable / viewable Block Sanction Memo (Form T/409B)
   */
  generateSanctionDocumentHtml() {
    const plan = this.state.targetPlan;
    const isApproved = this.state.status === "SANCTIONED";

    return `
      <div class="sanction-memo-card p-6 bg-slate-900 border border-slate-700 rounded-xl text-slate-200">
        <div class="flex justify-between items-start border-b border-slate-700 pb-4 mb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                INDIAN RAILWAYS / NORTH CENTRAL RAILWAY
              </span>
              <span class="text-xs font-mono text-slate-400">PRAYAGRAJ DIVISION</span>
            </div>
            <h3 class="text-xl font-black text-white mt-1">FORM T/409B: INTEGRATED BLOCK SANCTION ORDER</h3>
            <p class="text-xs text-slate-400">Automated Planning Support by Samanyav AI | Team <strong>KINETIX</strong> (SIH26027)</p>
          </div>
          <div class="text-right">
            <div class="text-xs text-slate-400">Sanction Ref ID</div>
            <div class="text-sm font-mono font-bold text-amber-400">${this.state.sanctionId}</div>
            <div class="text-xs mt-1">
              Status: <span class="${isApproved ? 'text-emerald-400 font-bold' : 'text-amber-400 font-semibold'}">${this.state.status}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-xs bg-slate-950/70 p-4 rounded-lg border border-slate-800">
          <div>
            <span class="text-slate-400 block">Corridor Section</span>
            <strong class="text-white">SOMNA (KM 118) - KULWA (KM 132)</strong>
          </div>
          <div>
            <span class="text-slate-400 block">Track Affected</span>
            <strong class="text-emerald-400">UP MAIN LINE</strong>
          </div>
          <div>
            <span class="text-slate-400 block">Sanctioned Window</span>
            <strong class="text-amber-400">${plan ? plan.window.start : "01:15"} to ${plan ? plan.window.end : "03:30"} (${plan ? plan.window.durationMin : 135} mins)</strong>
          </div>
          <div>
            <span class="text-slate-400 block">Block Mode</span>
            <strong class="text-sky-400">SHADOW BUNDLED (3 DEPTS)</strong>
          </div>
        </div>

        <div class="mb-4">
          <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Co-ordinated Departmental Works Permitted:</h4>
          <div class="space-y-2">
            <div class="flex items-center justify-between p-2 rounded bg-blue-950/40 border border-blue-900/50 text-xs">
              <div><strong class="text-blue-400">[TMS - Civil]</strong> Rail defect repair (USFD weld flaw) KM 120-125</div>
              <span class="text-slate-400">SSE/P-Way/Aligarh</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded bg-emerald-950/40 border border-emerald-900/50 text-xs">
              <div><strong class="text-emerald-400">[SMMS - S&T]</strong> Signal S-42 clamp lock & Axle counter test KM 123</div>
              <span class="text-slate-400">SSE/Signal/Somna</span>
            </div>
            <div class="flex items-center justify-between p-2 rounded bg-amber-950/40 border border-amber-900/50 text-xs">
              <div><strong class="text-amber-400">[TDMS - TRD]</strong> 25kV OHE contact wire stagger & isolator check KM 120-125</div>
              <span class="text-slate-400">SSE/TRD/Tundla</span>
            </div>
          </div>
        </div>

        <div class="p-3 bg-slate-950/60 rounded border border-slate-800 text-xs mb-4">
          <strong class="text-amber-400 block mb-1">Mandatory Safety Precautions Before Granting Power/Traffic Permit:</strong>
          <ul class="list-disc list-inside space-y-1 text-slate-300">
            <li>OHE Section Insulator 119/2 open; earthing discharge rods clamped on either side of work site.</li>
            <li>Station Master Somna to hold Freight train BCNHL-8842 at Somna Loop Line #2 with scotch blocks placed.</li>
            <li>Red Stop Banner Boards and hand flags positioned at 600m and 1200m distance as per G&SR Rule 15.09.</li>
            <li>All 3 departments must report "Track Clear & Fit" individually before restoration of 25kV traction power.</li>
          </ul>
        </div>

        ${isApproved ? `
          <div class="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-lg flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-emerald-400">DIGITALLY SIGNED & SANCTIONED</div>
              <div class="text-sm font-semibold text-white">${this.state.approvedBy.name} (${this.state.approvedBy.designation})</div>
              <div class="text-xs text-slate-400 font-mono mt-0.5">Authorization Code: ${this.state.approvedBy.authId} | Verified at ${new Date(this.state.approvalTimestamp).toLocaleTimeString()}</div>
            </div>
            <div class="text-right">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ✓ BDMS & COA SYNCHRONIZED
              </span>
            </div>
          </div>
        ` : `
          <div class="p-4 bg-amber-950/30 border border-amber-800/60 rounded-lg flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-amber-400">ACTION REQUIRED: CONTROLLER SIGN-OFF</div>
              <div class="text-xs text-slate-300 mt-0.5">Decision-support plan generated by Samanyav AI. Awaiting Section Controller / Sr.DOM digital sanction.</div>
            </div>
            <button id="btn-trigger-approval-modal" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded shadow transition">
              Review & Authorize Sanction
            </button>
          </div>
        `}
      </div>
    `;
  }
};

// Export to module or window
if (typeof module !== "undefined" && module.exports) {
  module.exports = { RailApproval };
} else {
  window.RailApproval = RailApproval;
}
