export type DispatchCategory = "ALL" | "INTERNSHIPS" | "HACKATHONS" | "STARTUPS";

export interface FlightSpecItem {
  label: string;
  detail: string;
}

export interface DispatchItem {
  id: string;
  category: "INTERNSHIPS" | "HACKATHONS" | "STARTUPS";
  timestamp: string;
  title: string;
  branchBadge: string;
  deadline: string;
  deadlineUrgent?: boolean;
  sampleTag: string;
  image: {
    url: string;
    alt: string;
    schematicLabel: string;
    telemetryText: string;
  };
  flightSpec: {
    eligibility: string;
    stack: string;
    cohortKit: string;
  };
  ctaText: string;
}

export const DISPATCH_CATEGORIES: DispatchCategory[] = [
  "ALL",
  "INTERNSHIPS",
  "HACKATHONS",
  "STARTUPS",
];

export const DISPATCHES: DispatchItem[] = [
  {
    id: "disp-01",
    category: "INTERNSHIPS",
    timestamp: "NOV 2026 // WINDOW",
    title: "ISRO 45-Day Internship Window",
    branchBadge: "CSE / ECE / MECH",
    deadline: "CLOSES IN 14D",
    deadlineUrgent: false,
    sampleTag: "SAMPLE COHORT DISPATCH",
    image: {
      url: "https://images.pexels.com/photos/12467595/pexels-photo-12467595.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      alt: "Space rocket on launchpad gantry",
      schematicLabel: "GANTRY UMBILICAL // PAD 02-SLP",
      telemetryText: "ISRO-HQ // ICRB VERIFIED CUTOFF",
    },
    flightSpec: {
      eligibility:
        "Min. 60% or 6.32 CGPA aggregate in B.Tech / BE Science & Tech (UG/PG regular students).",
      stack:
        "Branch core discipline + HoD recommendation letter & approved institutional NOC.",
      cohortKit:
        "Official Statement of Purpose (SOP) template + 12 past successful screening dossiers.",
    },
    ctaText: "Unlock Alert in Cohort →",
  },
  {
    id: "disp-02",
    category: "HACKATHONS",
    timestamp: "NOV 2026 // SQUAD",
    title: "Bharatiya Antariksh Hackathon Squads",
    branchBadge: "CSE-DS / AERO",
    deadline: "CLOSES IN 09D",
    deadlineUrgent: true,
    sampleTag: "SAMPLE COHORT DISPATCH",
    image: {
      url: "https://images.pexels.com/photos/586056/pexels-photo-586056.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "Satellite gliding over Earth with atmospheric horizon",
      schematicLabel: "LEO PASS VECTOR // AZ 142.4°",
      telemetryText: "IN-SPACe // NATIONAL HACKATHON",
    },
    flightSpec: {
      eligibility:
        "Cross-college STEM squad of 4 with designated Squad Lead & track portfolio links.",
      stack:
        "GeoPandas • Rasterio • PyTorch U-Net or ROS2 onboard flight telemetry pipelines.",
      cohortKit:
        "Peer matchmaking engine + 3 pre-built open-source starter repos & dataset scripts.",
    },
    ctaText: "Unlock Alert in Cohort →",
  },
  {
    id: "disp-03",
    category: "INTERNSHIPS",
    timestamp: "DEC 2026 // CYCLE",
    title: "ISRO Student Project Trainee Cycle",
    branchBadge: "ECE / MECH / AERO",
    deadline: "CLOSES IN 22D",
    deadlineUrgent: false,
    sampleTag: "SAMPLE COHORT DISPATCH",
    image: {
      url: "https://images.pexels.com/photos/18471567/pexels-photo-18471567.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "Oscilloscope and avionics electronics hardware setup",
      schematicLabel: "AVIONICS BUS // CAN-FD & I2C",
      telemetryText: "URSC / VSSC // R&D TRAINEE CALL",
    },
    flightSpec: {
      eligibility:
        "Post-6th semester B.Tech students (45 to 90+ days full-time residency at center).",
      stack:
        "Track proof-of-work: STM32 / VHDL FPGA boards or ANSYS thermal-structural simulation.",
      cohortKit:
        "Center directory guide (URSC, VSSC, SAC) + technical project proposal template.",
    },
    ctaText: "Unlock Alert in Cohort →",
  },
  {
    id: "disp-04",
    category: "STARTUPS",
    timestamp: "DEC 2026 // BATCH",
    title: "Indian Space-Tech Startup Intern Tracker",
    branchBadge: "CSE / ECE / MECH",
    deadline: "CLOSES IN 06D",
    deadlineUrgent: true,
    sampleTag: "SAMPLE COHORT DISPATCH",
    image: {
      url: "https://images.pexels.com/photos/41005/rocket-launch-rocket-take-off-soyuz-41005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      alt: "Rocket launch with booster plume",
      schematicLabel: "PROPULSION STACK // SKYROOT-AGNI",
      telemetryText: "ECOSYSTEM TRACKER // 9 PARTNERS",
    },
    flightSpec: {
      eligibility:
        "Public GitHub or hardware portfolio artifact + passing Cosmox branch assessment.",
      stack:
        "Skyroot (Propulsion/CFD) • Dhruva Space (Avionics) • Pixxel (Satellite EO-ML).",
      cohortKit:
        "Direct referral loop with 9 space startup hiring leads + technical interview drill.",
    },
    ctaText: "Unlock Alert in Cohort →",
  },
];
