export type BranchOption = "CSE" | "ECE" | "MECH";
export type TargetOption = "STARTUP" | "ISRO" | "HACKATHON";

export interface SkillItem {
  name: string;
  category: string;
  priority: "CRITICAL" | "HIGH" | "CORE";
  coverage: number; // 0 to 100
}

export interface SynthesisPlan {
  branchId: BranchOption;
  targetId: TargetOption;
  flightCode: string;
  statusText: string;
  confidence: string;
  skills: SkillItem[];
  starterBuild: {
    repoTitle: string;
    deliverable: string;
    timeline: string;
    artifactType: string;
  };
  eligibilityGate: {
    title: string;
    criteria: string;
    verifiedRule: string;
    targetEcosystem: string;
  };
}

export const BRANCH_OPTIONS: { id: BranchOption; label: string; sub: string }[] = [
  { id: "CSE", label: "CSE / DATA SCIENCE", sub: "Software & AI" },
  { id: "ECE", label: "ECE / EMBEDDED", sub: "Avionics & RF" },
  { id: "MECH", label: "MECH / AERO", sub: "Structures & Thermo" },
];

export const TARGET_OPTIONS: { id: TargetOption; label: string; sub: string }[] = [
  { id: "STARTUP", label: "SPACE STARTUP INTERN", sub: "Skyroot / Dhruva / Pixxel" },
  { id: "ISRO", label: "ISRO / NRSC TRAINEE", sub: "Govt R&D Residency" },
  { id: "HACKATHON", label: "SPACE HACKATHON", sub: "BAH / IN-SPACe Squads" },
];

export const SYNTHESIS_MATRIX: Record<string, SynthesisPlan> = {
  "CSE-STARTUP": {
    branchId: "CSE",
    targetId: "STARTUP",
    flightCode: "FP-CS-STU-01",
    statusText: "STARTUP BENCHMARK READY",
    confidence: "94% FIT",
    skills: [
      { name: "Python + GeoPandas (EO Data)", category: "Satellite Data AI", priority: "CRITICAL", coverage: 88 },
      { name: "ROS2 Telemetry Loops", category: "Flight Software", priority: "HIGH", coverage: 74 },
      { name: "C++ Flight RT Basics", category: "Core Embedded", priority: "CORE", coverage: 65 },
    ],
    starterBuild: {
      repoTitle: "cubesat-sentinel2-pipeline",
      deliverable: "Automated ingestion pipeline computing NDVI indices from Sentinel-2 L2A tiles with GeoTIFF export.",
      timeline: "7 DAYS // 12 COMMITS",
      artifactType: "VERIFIED REPO",
    },
    eligibilityGate: {
      title: "STARTUP HIRING SCREENING RULE",
      criteria: "Public GitHub repo with documentation + passing Cosmox technical sprint.",
      verifiedRule: "No CGPA cutoff gate. Prioritizes verified proof-of-work and clean Python/C++ test coverage.",
      targetEcosystem: "Pixxel, SatSure, GalaxEye, Dhruva Space, Skyroot Aerospace",
    },
  },
  "CSE-ISRO": {
    branchId: "CSE",
    targetId: "ISRO",
    flightCode: "FP-CS-ISR-02",
    statusText: "ICRB CRITERIA MATCHED",
    confidence: "91% FIT",
    skills: [
      { name: "C / C++ Real-Time OS", category: "Flight Systems", priority: "CRITICAL", coverage: 85 },
      { name: "Satellite Image Processing", category: "NRSC Remote Sensing", priority: "HIGH", coverage: 80 },
      { name: "Linux Socket Telemetry", category: "Ground Network", priority: "CORE", coverage: 70 },
    ],
    starterBuild: {
      repoTitle: "bhuvan-wms-tile-decoder",
      deliverable: "Decoder script parsing ISRO Bhuvan open web map tiles into geo-referenced flood inundation polygons.",
      timeline: "7 DAYS // 9 COMMITS",
      artifactType: "PROOF-OF-WORK",
    },
    eligibilityGate: {
      title: "ISRO SCHEME RULE // ICRB CUTOFF",
      criteria: "Min. 60% or 6.32 CGPA aggregate in B.Tech Computer Science / IT (UG/PG).",
      verifiedRule: "Post-6th Sem for B.Tech Project Trainee • Valid Institutional HoD NOC & Project Proposal required.",
      targetEcosystem: "NRSC Hyderabad, URSC Bengaluru, SAC Ahmedabad, ISTRAC Ground Station",
    },
  },
  "CSE-HACKATHON": {
    branchId: "CSE",
    targetId: "HACKATHON",
    flightCode: "FP-CS-HCK-03",
    statusText: "SQUAD DISPATCH READY",
    confidence: "96% FIT",
    skills: [
      { name: "PyTorch EO Object Detection", category: "Payload ML", priority: "CRITICAL", coverage: 92 },
      { name: "FastAPI Telemetry Replay", category: "Mission Control UI", priority: "HIGH", coverage: 78 },
      { name: "Dockerized Geo-Stack", category: "Deployment", priority: "CORE", coverage: 72 },
    ],
    starterBuild: {
      repoTitle: "bah-debris-orbit-tracker",
      deliverable: "Live orbital conjunction predictor calculating collision risk between LEO debris and active satellites.",
      timeline: "5 DAYS // SQUAD DEMO",
      artifactType: "HACKATHON SQUAD",
    },
    eligibilityGate: {
      title: "NATIONAL SPACE HACKATHON GATE",
      criteria: "Cross-college team of 4 STEM students with defined roles (Lead, EO-ML, Systems, UI).",
      verifiedRule: "Open to 1st–4th year B.Tech • IN-SPACe / ISRO problem statements evaluated by scientist juries.",
      targetEcosystem: "Bharatiya Antariksh Hackathon, Smart India Space Edition, NASA Space Apps",
    },
  },
  "ECE-STARTUP": {
    branchId: "ECE",
    targetId: "STARTUP",
    flightCode: "FP-EC-STU-04",
    statusText: "AVIONICS BENCHMARK READY",
    confidence: "93% FIT",
    skills: [
      { name: "STM32 + FreeRTOS Avionics", category: "Onboard Computing", priority: "CRITICAL", coverage: 90 },
      { name: "LoRa / S-Band Link Budget", category: "RF Telemetry", priority: "HIGH", coverage: 82 },
      { name: "KiCAD 4-Layer CubeSat EPS", category: "Hardware PCB", priority: "CORE", coverage: 75 },
    ],
    starterBuild: {
      repoTitle: "stm32-cubesat-eps-firmware",
      deliverable: "Firmware reading solar MPPT voltages, battery temp via I2C, and firing AX.25 beacon packets over SPI RF.",
      timeline: "7 DAYS // HARDWARE REPO",
      artifactType: "VERIFIED FIRMWARE",
    },
    eligibilityGate: {
      title: "AVIONICS INTERN BENCHMARK",
      criteria: "Hands-on MCU bring-up demo or PCB Gerber files + passing lab hardware evaluation.",
      verifiedRule: "Startups look for EMC/EMI awareness and verified bench testing using logic analyzers.",
      targetEcosystem: "Dhruva Space, Skyroot Aerospace, Agnikul Cosmos, Bellatrix Aerospace",
    },
  },
  "ECE-ISRO": {
    branchId: "ECE",
    targetId: "ISRO",
    flightCode: "FP-EC-ISR-05",
    statusText: "URSC / VSSC CRITERIA MATCHED",
    confidence: "90% FIT",
    skills: [
      { name: "VHDL / Verilog FPGA Design", category: "Payload Processing", priority: "CRITICAL", coverage: 87 },
      { name: "RF Microwave Fundamentals", category: "Ground Transceiver", priority: "HIGH", coverage: 84 },
      { name: "CAN-FD & SpaceWire Protocols", category: "Spacecraft Bus", priority: "CORE", coverage: 68 },
    ],
    starterBuild: {
      repoTitle: "vhdl-telemetry-framer",
      deliverable: "Synthesizable VHDL module implementing CCSDS TM sync marker detection and Reed-Solomon parity check.",
      timeline: "7 DAYS // SIM REPORT",
      artifactType: "SIMULATION TESTBENCH",
    },
    eligibilityGate: {
      title: "ISRO ECE ELIGIBILITY RULE",
      criteria: "Min. 60% or 6.32 CGPA aggregate in B.Tech Electronics & Communication (UG/PG).",
      verifiedRule: "HoD NOC + Project Work proposal aligned with URSC satellite bus or VSSC telemetry divisions.",
      targetEcosystem: "URSC Bengaluru (Avionics), VSSC Thiruvananthapuram, SAC Ahmedabad, MCF Hassan",
    },
  },
  "ECE-HACKATHON": {
    branchId: "ECE",
    targetId: "HACKATHON",
    flightCode: "FP-EC-HCK-06",
    statusText: "GROUND STATION SQUAD READY",
    confidence: "95% FIT",
    skills: [
      { name: "GNU Radio SDR Downlink", category: "Ground Station RF", priority: "CRITICAL", coverage: 89 },
      { name: "ESP32 Sensor Bus Payload", category: "CanSat Telemetry", priority: "HIGH", coverage: 85 },
      { name: "Antenna Az-El Rotator Control", category: "RF Mechanics", priority: "CORE", coverage: 70 },
    ],
    starterBuild: {
      repoTitle: "gnuradio-noaa-apt-decoder",
      deliverable: "Flowgraph capturing 137 MHz weather satellite APT downlinks with automated image rendering.",
      timeline: "4 DAYS // ON-AIR DEMO",
      artifactType: "SDR PASS LOG",
    },
    eligibilityGate: {
      title: "HARDWARE HACKATHON GATE",
      criteria: "Working bench prototype or software-defined radio pass log presented live to mentors.",
      verifiedRule: "Eligible for IN-SPACe CANSAT Student Competitions and National Space Day Challenges.",
      targetEcosystem: "IN-SPACe Student CanSat, Antariksh Hackathon, Rover Challenge India",
    },
  },
  "MECH-STARTUP": {
    branchId: "MECH",
    targetId: "STARTUP",
    flightCode: "FP-ME-STU-07",
    statusText: "PROPULSION / STRUCTURAL FIT",
    confidence: "92% FIT",
    skills: [
      { name: "OpenRocket + MATLAB CFD", category: "Trajectory & Aerodynamics", priority: "CRITICAL", coverage: 88 },
      { name: "ANSYS Structural & Modal FEA", category: "Launch Vibration", priority: "HIGH", coverage: 82 },
      { name: "Additive Manufacturing (Inconel)", category: "Propulsion Chamber", priority: "CORE", coverage: 71 },
    ],
    starterBuild: {
      repoTitle: "3u-cubesat-vibration-fea",
      deliverable: "Modal analysis report showing 1st natural frequency > 120 Hz for a 3U CubeSat chassis under PSLV load.",
      timeline: "7 DAYS // FEA REPORT",
      artifactType: "DELTA SIM REPORT",
    },
    eligibilityGate: {
      title: "STARTUP PROPULSION SCREENING",
      criteria: "Portfolio of FEA simulations, CAD assemblies, or documented rocketry test-bench firings.",
      verifiedRule: "Direct interview with startup propulsion leads (Agnikul, Skyroot) on thermal-vacuum stress margins.",
      targetEcosystem: "Skyroot Aerospace, Agnikul Cosmos, Bellatrix Aerospace, Manastu Space",
    },
  },
  "MECH-ISRO": {
    branchId: "MECH",
    targetId: "ISRO",
    flightCode: "FP-ME-ISR-08",
    statusText: "VSSC / LPSC CRITERIA MATCHED",
    confidence: "89% FIT",
    skills: [
      { name: "Cryogenic & Liquid Propulsion", category: "Engine Cycles", priority: "CRITICAL", coverage: 86 },
      { name: "Thermal Vacuum Simulation", category: "Spacecraft Environment", priority: "HIGH", coverage: 80 },
      { name: "Composite Materials Analysis", category: "Payload Fairing", priority: "CORE", coverage: 68 },
    ],
    starterBuild: {
      repoTitle: "converging-diverging-nozzle-cfd",
      deliverable: "2D axisymmetric compressible flow simulation through a bell nozzle calculating Mach number distribution.",
      timeline: "7 DAYS // REPORT PDF",
      artifactType: "AERO-THERMAL SUITE",
    },
    eligibilityGate: {
      title: "ISRO MECHANICAL SCHEME GATE",
      criteria: "Min. 60% aggregate in B.Tech Mechanical / Aerospace Engineering.",
      verifiedRule: "Pre-requisite: 6 semesters completed. Residency at LPSC Valiamala or VSSC propulsion facilities.",
      targetEcosystem: "VSSC Thiruvananthapuram, LPSC Valiamala, SDSC SHAR Sriharikota, URSC Thermal Group",
    },
  },
  "MECH-HACKATHON": {
    branchId: "MECH",
    targetId: "HACKATHON",
    flightCode: "FP-ME-HCK-09",
    statusText: "STRUCTURAL SQUAD READY",
    confidence: "94% FIT",
    skills: [
      { name: "Fusion360 Generative Design", category: "Mass Optimization", priority: "CRITICAL", coverage: 91 },
      { name: "Aero-Deceleration Simulation", category: "Parachute Deployment", priority: "HIGH", coverage: 83 },
      { name: "Rapid 3D Print Prototyping", category: "Mechanisms", priority: "CORE", coverage: 78 },
    ],
    starterBuild: {
      repoTitle: "cansat-payload-ejection-mech",
      deliverable: "Dual-spring deployable solar panel latch mechanism with simulated torque release margins.",
      timeline: "5 DAYS // CAD + STL",
      artifactType: "MECHANICAL CAD SUITE",
    },
    eligibilityGate: {
      title: "ROCKETRY & ROVER CHALLENGE GATE",
      criteria: "CAD assembly files + structural margin of safety calculations submitted with squad application.",
      verifiedRule: "Evaluated on payload mass fraction, deployment reliability, and drop-test survival video.",
      targetEcosystem: "Indian Rover Challenge, IN-SPACe Model Rocketry Meet, Space Innovation Challenge",
    },
  },
};
