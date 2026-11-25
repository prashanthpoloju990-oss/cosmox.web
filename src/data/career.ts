export interface CareerStage {
  index: string;
  kicker: string;
  rail: string;
  navLabel: string;
  title: string;
  body: string;
  telemetry: {
    output: string;
    benchmark: string;
    status: string;
    readiness: number;
  };
}

export const CAREER_STAGES: CareerStage[] = [
  {
    index: "01",
    kicker: "Branch → Track",
    rail: "Branch-to-Track Translation",
    navLabel: "Translate",
    title: "Translate Your Degree Into a Space Track",
    body: "CSE / Data Science, ECE / EEE and Mechanical students map straight into Flight Software, Satellite EO-AI, Avionics / RF or Propulsion / Structures, without switching majors.",
    telemetry: {
      output: "Branch → track matrix",
      benchmark: "3 tracks · 6 target employers",
      status: "TRACK LOCKED",
      readiness: 25,
    },
  },
  {
    index: "02",
    kicker: "Stack → Interview",
    rail: "Industry-Tested Skill Stack",
    navLabel: "Stack",
    title: "Master the Tools Startups Actually Test",
    body: "Cosmox replaces vague textbook advice with the exact stacks used in real space-tech intern interviews, grouped by domain, with honest effort estimates.",
    telemetry: {
      output: "Domain skill stack · 4 domains",
      benchmark: "Intern interview parity",
      status: "STACK LOADED",
      readiness: 50,
    },
  },
  {
    index: "03",
    kicker: "Build → Verify",
    rail: "Proof-of-Work Portfolio Builds",
    navLabel: "Proof",
    title: "Ship Proof-of-Work Projects, Not Just Certificates",
    body: "Students build verifiable GitHub repositories and hardware or simulation demos, artifacts aerospace hiring teams can actually inspect, run and question.",
    telemetry: {
      output: "Mission build spec · public repo",
      benchmark: "1 verified artifact per track",
      status: "BUILD IN PROGRESS",
      readiness: 75,
    },
  },
  {
    index: "04",
    kicker: "Criteria → Window",
    rail: "Eligibility & Scheme Readiness",
    navLabel: "Eligibility",
    title: "Apply With Verified Eligibility & Zero Missed Windows",
    body: "Cosmox decodes official criteria into a flight checklist, so you file on time with complete documentation. Every scheme, every cut-off, one view.",
    telemetry: {
      output: "Eligibility flight checklist",
      benchmark: "ISRO ≥ 60% / 6.32 CGPA",
      status: "APPLY WINDOW OPEN",
      readiness: 100,
    },
  },
];
