export type BranchId = "cse" | "ece" | "mech";

export interface BranchPhase {
  tag: string;
  title: string;
  detail: string;
}

export interface Branch {
  id: BranchId;
  tab: string;
  code: string;
  role: string;
  roleNote: string;
  stack: string[];
  project: string;
  projectMeta: string;
  benchmark: string;
  benchmarkNote: string;
  metrics: { label: string; value: string }[];
  trace: number[];
  phases: BranchPhase[];
}

export const BRANCHES: Branch[] = [
  {
    id: "cse",
    tab: "CSE / DS",
    code: "TRK-01 · CSE·DS",
    role: "Flight Software & Satellite Data AI",
    roleNote:
      "Onboard autonomy, downlink pipelines and earth-observation inference — where most space-tech startups hire first.",
    stack: ["Python", "ROS2", "GeoPandas", "Telemetry"],
    project:
      "Decode raw CubeSat beacon frames into a live anomaly dashboard with public replay.",
    projectMeta: "04 WEEKS · SQUAD OF 3 · PUBLIC REPO",
    benchmark: "ISRO SCHEME BENCHMARK: ≥ 60% / 6.32 CGPA",
    benchmarkNote:
      "Mirrors ICRB Scientist/Engineer ‘SC’ screening for the Computer Science discipline.",
    metrics: [
      { label: "Demand", value: "87 / HIGH" },
      { label: "Squads", value: "12 OPEN" },
      { label: "Window", value: "14 MAR" },
    ],
    trace: [18, 24, 22, 31, 29, 42, 47, 44, 58, 63, 71, 84],
    phases: [
      {
        tag: "P1",
        title: "Foundations",
        detail: "Orbital mechanics primer + Python for telemetry streams · 2 weeks",
      },
      {
        tag: "P2",
        title: "Proof-of-work",
        detail: "Ship the beacon decoder, publish the repo and the anomaly report",
      },
      {
        tag: "P3",
        title: "Placement loop",
        detail: "ICRB mock screening + referral ring across 9 startup partners",
      },
    ],
  },
  {
    id: "ece",
    tab: "ECE / EEE",
    code: "TRK-02 · ECE·EEE",
    role: "Avionics, RF Links & Payload Electronics",
    roleNote:
      "Onboard power, S-band comms, FPGA sensor interfacing and EMC-clean boards for small-sat buses.",
    stack: ["VHDL", "STM32", "GNU Radio", "S-Band RF"],
    project:
      "Build a 2U EPS + beacon board and log one verified ground-station contact pass.",
    projectMeta: "06 WEEKS · SQUAD OF 4 · HARDWARE KIT",
    benchmark: "IN-SPACe INTERNSHIP GATE: ≥ 65% / 6.75 CGPA",
    benchmarkNote:
      "Matches IN-SPACe and NSIL internship shortlisting for ECE / EEE candidates.",
    metrics: [
      { label: "Demand", value: "81 / HIGH" },
      { label: "Squads", value: "09 OPEN" },
      { label: "Window", value: "02 APR" },
    ],
    trace: [26, 21, 30, 28, 38, 36, 49, 55, 52, 61, 69, 77],
    phases: [
      {
        tag: "P1",
        title: "Foundations",
        detail: "RF link budgets, PCB bring-up discipline and FPGA timing basics",
      },
      {
        tag: "P2",
        title: "Proof-of-work",
        detail: "Beacon board on-air, decoded pass log signed by a ground station",
      },
      {
        tag: "P3",
        title: "Placement loop",
        detail: "IN-SPACe application pack + hardware interview drill with alumni",
      },
    ],
  },
  {
    id: "mech",
    tab: "MECH / AERO",
    code: "TRK-03 · MECH·AERO",
    role: "Structures, Thermal & Propulsion Analysis",
    roleNote:
      "FEA of primary structure, thermal-vacuum margins, nozzle sizing and feed-system trade studies.",
    stack: ["CATIA", "ANSYS", "OpenRocket", "MATLAB"],
    project:
      "Run a thermal-vacuum FEA sweep on a 3U frame and publish the signed delta report.",
    projectMeta: "05 WEEKS · SQUAD OF 3 · SIM ONLY",
    benchmark: "ISRO ICRB SC-B GATE: ≥ 60% AGGREGATE",
    benchmarkNote:
      "Applies to Mechanical / Aerospace discipline calls at VSSC, URSC and SAC.",
    metrics: [
      { label: "Demand", value: "74 / RISING" },
      { label: "Squads", value: "07 OPEN" },
      { label: "Window", value: "27 MAR" },
    ],
    trace: [14, 19, 17, 26, 33, 30, 41, 46, 53, 50, 62, 68],
    phases: [
      {
        tag: "P1",
        title: "Foundations",
        detail: "Structures, materials and thermal-vacuum fundamentals · 2 weeks",
      },
      {
        tag: "P2",
        title: "Proof-of-work",
        detail: "FEA sweep, margin table and a published design-delta report",
      },
      {
        tag: "P3",
        title: "Placement loop",
        detail: "VSSC / URSC discipline prep + portfolio review with reviewers",
      },
    ],
  },
];

export const SPACE_WORDS = [
  "FLIGHT SOFTWARE",
  "ORBITAL MECHANICS",
  "CUBESAT AVIONICS",
  "REMOTE SENSING AI",
  "PROPULSION SYSTEMS",
  "TELEMETRY & RF",
  "GROUND STATIONS",
  "PAYLOAD DESIGN",
  "ASTRODYNAMICS",
  "MISSION OPERATIONS",
];