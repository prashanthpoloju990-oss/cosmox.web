export type BranchPresetId = "CSE-DS" | "ECE" | "MECH";

export interface BranchPreset {
  id: BranchPresetId;
  label: string;
  track: string;
  code: string;
}

export const BRANCH_PRESETS: BranchPreset[] = [
  {
    id: "CSE-DS",
    label: "CSE-DS • 2nd Year",
    track: "Flight Software & EO-AI",
    code: "TRK-01",
  },
  {
    id: "ECE",
    label: "ECE • 3rd Year",
    track: "Avionics & RF Systems",
    code: "TRK-02",
  },
  {
    id: "MECH",
    label: "MECH • 2nd Year",
    track: "Propulsion & Structures",
    code: "TRK-03",
  },
];

export interface Milestone {
  id: string;
  title: string;
  meta: string;
  tag: string;
}

export const MILESTONES: Record<BranchPresetId, Milestone[]> = {
  "CSE-DS": [
    {
      id: "cs-1",
      title: "Ship EO pipeline notebook",
      meta: "Sentinel-2 NDVI render • public repo",
      tag: "WK 01–02",
    },
    {
      id: "cs-2",
      title: "Parse live telemetry frames",
      meta: "AX.25 decode • 80% test coverage",
      tag: "WK 03–05",
    },
    {
      id: "cs-3",
      title: "Run ROS2 flight loop sim",
      meta: "Gazebo SIL • logged bag file",
      tag: "WK 06–08",
    },
    {
      id: "cs-4",
      title: "Merge first flight-sw PR",
      meta: "Reviewed by squad lead",
      tag: "WK 09–12",
    },
  ],
  ECE: [
    {
      id: "ec-1",
      title: "Bring up STM32 sensor bus",
      meta: "FreeRTOS tasks • logic-analyzer proof",
      tag: "WK 01–02",
    },
    {
      id: "ec-2",
      title: "Close LoRa link budget",
      meta: "3 km margin calc • field test",
      tag: "WK 03–05",
    },
    {
      id: "ec-3",
      title: "Route CubeSat EPS schematic",
      meta: "KiCAD • 4-layer review",
      tag: "WK 06–08",
    },
    {
      id: "ec-4",
      title: "Log SDR ground-station pass",
      meta: "137 MHz APT decode • pass log",
      tag: "WK 09–12",
    },
  ],
  MECH: [
    {
      id: "me-1",
      title: "Sim OpenRocket stability run",
      meta: "Caliber report • margin table",
      tag: "WK 01–02",
    },
    {
      id: "me-2",
      title: "Modal FEA of 3U chassis",
      meta: "1st mode > 120 Hz • ANSYS",
      tag: "WK 03–05",
    },
    {
      id: "me-3",
      title: "Nozzle CFD sweep",
      meta: "Mach plot • delta report",
      tag: "WK 06–08",
    },
    {
      id: "me-4",
      title: "Pass CAD assembly review",
      meta: "Reviewed by structures mentor",
      tag: "WK 09–12",
    },
  ],
};

export interface Opportunity {
  id: string;
  org: string;
  title: string;
  criteria: string;
  deadline: string;
  fit: Record<BranchPresetId, string>;
}

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-isro",
    org: "ISRO • ICRB",
    title: "ISRO 45-Day Internship",
    criteria: "≥ 6.32 CGPA • UG/PG Science & Tech",
    deadline: "CLOSES IN 14D",
    fit: {
      "CSE-DS": "MATCH — CS DISCIPLINE",
      ECE: "MATCH — ECE DISCIPLINE",
      MECH: "MATCH — MECH DISCIPLINE",
    },
  },
  {
    id: "opp-startup",
    org: "STARTUP TRACKER",
    title: "Space Startup Intern Window",
    criteria: "Skyroot / Dhruva / Pixxel roles",
    deadline: "CLOSES IN 06D",
    fit: {
      "CSE-DS": "MATCH — FLIGHT SW + EO-AI",
      ECE: "MATCH — AVIONICS & RF",
      MECH: "MATCH — PROPULSION & CAD",
    },
  },
];

export interface SquadMember {
  code: string;
  role: string;
  status: "ONLINE" | "IN LAB" | "REVIEWING";
  you?: boolean;
}

export const SQUAD = {
  id: "SQUAD #07",
  event: "BHARATIYA ANTARIKSH HACKATHON",
  problem: "PS-04 // LEO DEBRIS CONJUNCTION",
  members: [
    { code: "YOU", role: "TRACK LEAD", status: "ONLINE", you: true },
    { code: "HYD", role: "FLIGHT SW", status: "REVIEWING" },
    { code: "BLR", role: "EO-AI SAT", status: "ONLINE" },
    { code: "MUM", role: "SYS / OPS", status: "IN LAB" },
  ] as SquadMember[],
};
