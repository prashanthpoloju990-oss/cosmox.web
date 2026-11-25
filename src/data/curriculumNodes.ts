import type { CareerRole } from "./careerRoadmaps";

export interface CurriculumNode {
  id: string;
  phase: 1 | 2 | 3 | 4;
  phaseTitle: string;
  phaseBadge: string;
  title: string;
  duration: string;
  isMilestone?: boolean;
  whyMatters: string;
  topics: string[];
  toolsAndLinks: { name: string; note: string; url?: string }[];
  practiceTask?: string;
}

/**
 * Generates an interactive 4-phase curriculum node-tree (7 structured nodes)
 * tailored dynamically for ANY of the 20 job roles in the Cosmox catalog.
 */
export function getRoleCurriculumNodes(role: CareerRole): CurriculumNode[] {
  const tool1 = role.tools[0] ?? "Python";
  const tool2 = role.tools[1] ?? "C++";
  const tool3 = role.tools[2] ?? "Git";
  const stage0 = role.stages[0];
  const stage1 = role.stages[1];
  const primaryEmployer = role.employers[0] ?? "ISRO";
  const secondaryEmployer = role.employers[1] ?? "Skyroot Aerospace";

  return [
    /* ── Phase 1: Core Foundations (2 parallel nodes) ──────────────── */
    {
      id: `${role.id}-n1`,
      phase: 1,
      phaseTitle: "Phase 1: Core Foundations",
      phaseBadge: "PHASE 01 // FOUNDATIONS",
      title: `${tool1} & Core Basics`,
      duration: "1–2 wks",
      whyMatters: `Every space engineer in this discipline starts with rock-solid fundamentals in ${tool1}. Clean syntax, reproducible logic, and methodical thinking prevent catastrophic bugs on actual flight systems.`,
      topics: stage0?.topics?.slice(0, 3) ?? [
        "Core syntax, data types, control flow & memory awareness",
        "Writing clean functions and modular components",
        "Step-by-step logic tracing and methodical debugging",
      ],
      toolsAndLinks: [
        {
          name: `${tool1} Official Docs & Sandbox`,
          note: `Free official documentation, syntax guides, and interactive exercises for ${tool1}.`,
        },
        {
          name: "VS Code & Engineering Linters",
          note: "Recommended workspace setup with syntax highlighting, auto-formatting, and static analysis.",
        },
        {
          name: "Cosmox Starter Notebooks",
          note: "Curated beginner notebooks with worked space-data examples.",
        },
      ],
      practiceTask: `Write 3 small programs using ${tool1} that process a stream of numbers, check for missing values, and print a clean summary table.`,
    },
    {
      id: `${role.id}-n2`,
      phase: 1,
      phaseTitle: "Phase 1: Core Foundations",
      phaseBadge: "PHASE 01 // FOUNDATIONS",
      title: "Git, Linux & Engineering Workflow",
      duration: "1 wk",
      whyMatters:
        "Space teams never work in isolation; verifiable commit histories, peer pull requests, and automated testing are strictly mandatory across aerospace teams. Knowing Git makes your work hireable immediately.",
      topics: [
        "Branching, atomic commits & semantic commit message conventions",
        "Command-line terminal essentials (bash, file permissions, scripts)",
        "Writing professional GitHub READMEs with architecture schematics",
      ],
      toolsAndLinks: [
        {
          name: "Git & GitHub",
          note: "Standard version control platform used by all space startups and open research teams.",
        },
        {
          name: "Linux Shell / Terminal Guide",
          note: "Free interactive terminal tutorial covering pipes, grep, environment variables, and scripts.",
        },
        {
          name: "Cosmox README Blueprint",
          note: "Clean project documentation template tailored for student engineering portfolios.",
        },
      ],
      practiceTask:
        "Initialize a Git repository, create a development branch, commit code with clear notes, and open a pull request with a detailed README description.",
    },

    /* ── Phase 2: Space & Domain Tools (2 branching nodes) ─────────── */
    {
      id: `${role.id}-n3`,
      phase: 2,
      phaseTitle: "Phase 2: Space & Domain Tools",
      phaseBadge: "PHASE 02 // DOMAIN TOOLS",
      title: `${tool2} & Domain Tooling`,
      duration: "2–3 wks",
      whyMatters: `This is where general engineering transitions into space mission systems. Mastering ${tool2} equips you to handle satellite telemetry downlinks, simulation runs, and hardware communication protocols.`,
      topics: stage1?.topics?.slice(0, 3) ?? [
        "Domain-specific data structures & telemetry parsing",
        "Physics simulation constraints, timestamps & coordinate systems",
        "Building validation tests for corrupted and dropped data packets",
      ],
      toolsAndLinks: [
        {
          name: `${tool2} Framework & Library Suite`,
          note: `Primary domain package used for ${role.title} tasks in production missions.`,
        },
        {
          name: "Open Space Agency Datasets",
          note: "Free telemetry logs, satellite images, and trajectory files from ISRO Bhuvan, MOSDAC, and NASA.",
        },
        {
          name: "Cosmox Telemetry Decoder Kit",
          note: "Sample packet parser script with dummy sensor streams.",
        },
      ],
      practiceTask: `Ingest a sample aerospace data file using ${tool2}, parse header bytes, convert raw integers into physical units (temperature, voltage), and log outliers.`,
    },
    {
      id: `${role.id}-n4`,
      phase: 2,
      phaseTitle: "Phase 2: Space & Domain Tools",
      phaseBadge: "PHASE 02 // DOMAIN TOOLS",
      title: `${role.skills[0]?.name ?? "Subsystem Modeling & Flight Constraints"}`,
      duration: "2 wks",
      whyMatters: `${role.skills[0]?.why ?? "Spacecraft subsystems must operate reliably under severe power, mass, and communication constraints."} Understanding system limits lets you design architectures that survive in orbit.`,
      topics: [
        role.skills[0]?.name ?? "Telemetry packet structures & bus protocols",
        role.skills[1]?.name ?? "Fault detection, isolation & recovery (FDIR) logic",
        "Automated stress testing & edge-case scenario simulation",
      ],
      toolsAndLinks: [
        {
          name: `${tool3} & Simulation Harness`,
          note: "Open-source simulator and test workbench for subsystem verification.",
        },
        {
          name: "Aerospace Standards Reference",
          note: "Plain-English guide to satellite bus protocols, packet headers, and reliability rules.",
        },
        {
          name: "Cosmox Peer Squad Forum",
          note: "Connect with students building similar subsystems for live reviews.",
        },
      ],
      practiceTask:
        "Simulate an unexpected sensor failure in code and verify that your script flags a warning and switches to safe mode without crashing.",
    },

    /* ── Phase 3: Hands-On Starter Build (1 central milestone node) ─── */
    {
      id: `${role.id}-n5`,
      phase: 3,
      phaseTitle: "Phase 3: Hands-On Starter Build",
      phaseBadge: "PHASE 03 // CENTRAL MILESTONE",
      isMilestone: true,
      title: `Build: ${role.project.title}`,
      duration: "2–3 wks",
      whyMatters: `Recruiters at ${primaryEmployer} and ${secondaryEmployer} prioritize verified proof-of-work over textbook marks. Building, testing, and publishing ${role.project.title} proves you can ship an end-to-end engineering asset.`,
      topics: [
        role.project.steps[0] ?? "Define architecture, data inputs, and system safety boundaries",
        role.project.steps[1] ?? "Implement core processing engine and telemetry status displays",
        role.project.steps[2] ?? "Package code with automated tests, sample output graphs, and a 1-minute video demo",
      ],
      toolsAndLinks: [
        {
          name: "Project Starter Template",
          note: "Pre-configured repository scaffold with test runner, sample data, and CI action.",
        },
        {
          name: "Architecture & Verification Rubric",
          note: "Cosmox mentor review checklist: code readability, safety assertions, and documentation.",
        },
        {
          name: "GitHub Pages / Demo Deploy",
          note: "Free hosting for your project dashboard or technical project report.",
        },
      ],
      practiceTask: role.project.description,
    },

    /* ── Phase 4: Internship & Interview Prep (2 final nodes) ───────── */
    {
      id: `${role.id}-n6`,
      phase: 4,
      phaseTitle: "Phase 4: Internship & Interview Prep",
      phaseBadge: "PHASE 04 // CAREER READINESS",
      title: `${primaryEmployer} & Startup Eligibility Verification`,
      duration: "1 wk",
      whyMatters: `Knowing the exact CGPA, semester cutoffs, and NOC paperwork for ${primaryEmployer} and private space startups prevents last-minute application disqualifications. Preparation turns anxiety into clarity.`,
      topics: [
        role.eligibility.points[0] ?? "Min. 60% / 6.32 CGPA aggregate in regular B.Tech / BE degree",
        role.eligibility.points[1] ?? `${role.branchFit} branch alignment and semester prerequisites`,
        role.eligibility.points[2] ?? "Institutional permission: obtaining an approved NOC from your college HoD",
      ],
      toolsAndLinks: [
        {
          name: "Official ICRB & IN-SPACe Portal",
          note: "Direct portal links for gazette notifications and student intake calendars.",
        },
        {
          name: "College NOC Letter Template",
          note: "Pre-formatted permission request letter to share with your Department Head.",
        },
        {
          name: "Cosmox Opportunity Radar",
          note: "Live alerts whenever new student windows open for this role.",
        },
      ],
      practiceTask:
        "Draft your 1-page Statement of Purpose (SOP) explaining why you want to work on this spacecraft subsystem, highlighting your starter build.",
    },
    {
      id: `${role.id}-n7`,
      phase: 4,
      phaseTitle: "Phase 4: Internship & Interview Prep",
      phaseBadge: "PHASE 04 // CAREER READINESS",
      title: "Portfolio README & Technical Mock Interview",
      duration: "1–2 wks",
      whyMatters: `Aerospace interviewers test how you reason through unexpected system failures. Practicing plain-English answers to real technical screening questions gives you composure during interviews.`,
      topics: [
        `Interview Q1: “${role.eligibility.questions[0]}”`,
        `Interview Q2: “${role.eligibility.questions[1]}”`,
        `Interview Q3: “${role.eligibility.questions[2]}”`,
      ],
      toolsAndLinks: [
        {
          name: "Aerospace Portfolio Showcase Rubric",
          note: "How to structure your GitHub repo, screenshots, and demo GIF so recruiters notice it.",
        },
        {
          name: "Technical Q&A Practice Bank",
          note: `Curated answer outlines for common interview questions asked at ${primaryEmployer} and ${secondaryEmployer}.`,
        },
        {
          name: "Cosmox Mock Interview Simulator",
          note: "Practice answering questions out loud with immediate feedback on technical clarity.",
        },
      ],
      practiceTask:
        "Record a 2-minute screen recording walking through your starter build: explain what problem it solves, how you tested it, and what you would improve next.",
    },
  ];
}
