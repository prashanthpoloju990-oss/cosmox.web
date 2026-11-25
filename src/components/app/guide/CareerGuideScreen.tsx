import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { ArrowRight, CheckSeal } from "@/components/Icons";
import {
  getGuideBranch,
  type GuideBranch,
  type GuideGoal,
  type GuidePlanOptions,
} from "@/data/careerGuide";
import type { GuideProgress } from "@/hooks/useGuideProgress";
import type { StudentSession } from "@/utils/session";

/* ── Branch & Goal Definitions ────────────────────────────── */

interface BranchOption {
  id: GuideBranch;
  label: string;
}

const BRANCHES: BranchOption[] = [
  { id: "cse", label: "CSE / Data Science" },
  { id: "ece", label: "ECE / Electronics" },
  { id: "mech", label: "Mechanical / Aero" },
];

interface GoalOption {
  id: GuideGoal;
  label: string;
}

const GOALS: GoalOption[] = [
  { id: "startup", label: "Space Startup Internship" },
  { id: "isro", label: "ISRO Student Program" },
  { id: "hackathon", label: "Win a Space Hackathon" },
];

/* ── Dynamic Career Engine Matrix (9 Combinations) ────────── */

interface CareerPlanConfig {
  matchedRole: string;
  branchFit: string;
  roleExplanation: string;
  keySkill: string;
  eligibility: string;
  targetTeams: string;
  roadmapRoleId: string;
  month1: {
    title: string;
    bullets: [string, string];
    tools: [string, string];
  };
  month2: {
    title: string;
    projectTitle: string;
    description: string;
    tools: [string, string];
  };
  month3: {
    title: string;
    bullets: [string, string];
  };
}

const CAREER_MATRIX: Record<GuideBranch, Record<GuideGoal, CareerPlanConfig>> = {
  cse: {
    startup: {
      matchedRole: "Satellite Data & Flight Software",
      branchFit: "94% Branch Fit",
      roleExplanation:
        "Directly maps your coding skills into telemetry packet parsing, cloud satellite downlinks, and Earth-observation ML.",
      keySkill: "Python + Free Satellite Maps",
      eligibility: "No Strict CGPA Cutoff (GitHub Project Required)",
      targetTeams: "Pixxel, Skyroot, Dhruva Space, GalaxEye",
      roadmapRoleId: "flight-software-engineer",
      month1: {
        title: "Learn the Basics",
        bullets: [
          "Master Python raster libraries (Rasterio, GeoPandas) & satellite coordinate systems",
          "Download and visualize free Sentinel-2 multispectral tiles of your home city",
        ],
        tools: ["Python", "Git & GitHub"],
      },
      month2: {
        title: "Build Proof of Work",
        projectTitle: "Flood & Crop Monitor Using Free Sentinel-2 Images",
        description:
          "Compare satellite images before and after monsoon rains to map flooded farms and calculate NDVI vegetation health.",
        tools: ["Sentinel-2 Data", "Jupyter Notebook"],
      },
      month3: {
        title: "Apply & Pitch",
        bullets: [
          "Publish a clean GitHub repository with an interactive map demo and architecture README",
          "Send direct applications to startup telemetry leads citing your working demo",
        ],
      },
    },
    isro: {
      matchedRole: "Earth Observation & ICRB Trainee",
      branchFit: "92% Branch Fit",
      roleExplanation:
        "Prepares you for ISRO National Remote Sensing Centre (NRSC) data pipelines and formal student project guidelines.",
      keySkill: "Python + Bhuvan Satellite Portal",
      eligibility: "Min. 60% / 6.32 CGPA (Approved College NOC Required)",
      targetTeams: "ISRO NRSC, URSC Bengaluru, SAC Ahmedabad",
      roadmapRoleId: "satellite-data-ai-engineer",
      month1: {
        title: "Learn the Basics",
        bullets: [
          "Revise core algorithms, orbital physics constraints, and satellite data standards",
          "Explore ISRO Bhuvan open multispectral tiles and sample telemetry packets",
        ],
        tools: ["Python", "ISRO Bhuvan Portal"],
      },
      month2: {
        title: "Build Proof of Work",
        projectTitle: "Reservoir Water Shrinkage Tracker from Space",
        description:
          "Extract 5 years of open reservoir satellite images and plot water surface area changes with clear trend graphs.",
        tools: ["ISRO Open Data", "Pandas & Matplotlib"],
      },
      month3: {
        title: "Apply & Pitch",
        bullets: [
          "Draft your Statement of Purpose (SOP) citing your reservoir analysis project",
          "Obtain an approved NOC from your Head of Department and apply on the official ICRB portal",
        ],
      },
    },
    hackathon: {
      matchedRole: "Space AI & Rapid Prototype Lead",
      branchFit: "96% Branch Fit",
      roleExplanation:
        "Optimized for 36-hour sprint formats like the Bharatiya Antariksh Hackathon where speed and working demos win.",
      keySkill: "Streamlit + Rapid Geo-AI Prototyping",
      eligibility: "Open to All B.Tech Years (Teams of 2–4 Students)",
      targetTeams: "IN-SPACe National Hackathon, Smart India Hackathon",
      roadmapRoleId: "earth-observation-gis-analyst",
      month1: {
        title: "Learn the Basics",
        bullets: [
          "Form a 3-person squad with one hardware/electronics teammate",
          "Deploy interactive Python satellite dashboards in minutes using Streamlit",
        ],
        tools: ["Streamlit", "Python"],
      },
      month2: {
        title: "Build Proof of Work",
        projectTitle: "Real-Time Urban Heat Island Dashboard",
        description:
          "Build a web application where judges pick any Indian city to see surface temperature hotspots from thermal satellite bands.",
        tools: ["Thermal Satellite Data", "Streamlit Cloud"],
      },
      month3: {
        title: "Apply & Pitch",
        bullets: [
          "Rehearse a 3-minute live presentation deck with your teammates",
          "Submit working demo video and repository before the national deadline",
        ],
      },
    },
  },
  ece: {
    startup: {
      matchedRole: "Avionics & Embedded Flight Electronics",
      branchFit: "93% Branch Fit",
      roleExplanation:
        "Build the sensor interfaces, battery power buses, and flight computers that fly inside Indian private satellites.",
      keySkill: "C / C++ Embedded + STM32 & Arduino",
      eligibility: "Working Circuit Hardware Demo Required (No CGPA Cutoff)",
      targetTeams: "Dhruva Space, Skyroot Aerospace, Agnikul, Bellatrix",
      roadmapRoleId: "avionics-embedded-engineer",
      month1: {
        title: "Learn the Basics",
        bullets: [
          "Study I2C, SPI, and CAN bus protocols used on satellite avionics boards",
          "Simulate a small sensor interface circuit in a free breadboard simulator",
        ],
        tools: ["C / C++", "Tinkercad Circuits"],
      },
      month2: {
        title: "Build Proof of Work",
        projectTitle: "CubeSat Telemetry & Power Monitor Board",
        description:
          "Program an STM32 board to log simulated solar panel voltage, battery levels, and temperature every 5 seconds to an SD card.",
        tools: ["STM32 / Arduino", "Oscilloscope / Logic Analyzer"],
      },
      month3: {
        title: "Apply & Pitch",
        bullets: [
          "Record a 90-second workbench video showing your board handling fault inputs",
          "Send your hardware schematic and firmware repo to startup avionics leads",
        ],
      },
    },
    isro: {
      matchedRole: "Satellite Communications & URSC Trainee",
      branchFit: "91% Branch Fit",
      roleExplanation:
        "Directly matches ISRO Satellite Centre (URSC) ground communications and radio frequency engineering labs.",
      keySkill: "RF Communications & Digital Signal Processing",
      eligibility: "Min. 60% / 6.32 CGPA (Semester 6 Complete for Project)",
      targetTeams: "ISRO URSC Bengaluru, SAC Ahmedabad, VSSC Thiruvananthapuram",
      roadmapRoleId: "satellite-communications-rf-engineer",
      month1: {
        title: "Learn the Basics",
        bullets: [
          "Revise modulation techniques, antennas, and noise figures from your syllabus",
          "Decode audio and packet telemetry from passing NOAA weather satellites using free SDR software",
        ],
        tools: ["RTL-SDR", "GQRX / SDR#"],
      },
      month2: {
        title: "Build Proof of Work",
        projectTitle: "Software-Defined Ground Receiver Parser",
        description:
          "Record live satellite downlinks and write a script that separates valid sync words from ambient RF background noise.",
        tools: ["Python", "GNU Radio"],
      },
      month3: {
        title: "Apply & Pitch",
        bullets: [
          "Prepare circuit diagrams and lab reports for your mentor application",
          "Submit department NOC through the formal ISRO internship window",
        ],
      },
    },
    hackathon: {
      matchedRole: "Hardware IoT & Sensor Lead",
      branchFit: "95% Branch Fit",
      roleExplanation:
        "Physical prototypes stand out dramatically against pure software ideas in front of national space hackathon judges.",
      keySkill: "Microcontroller Sensor Fusion & LoRa",
      eligibility: "Open to All B.Tech Years (Cross-Branch Teams)",
      targetTeams: "Bharatiya Antariksh Hackathon, IN-SPACe Student Challenge",
      roadmapRoleId: "cubesat-systems-engineer",
      month1: {
        title: "Learn the Basics",
        bullets: [
          "Pair with a CSE teammate to split hardware reading and cloud dashboard tasks",
          "Test long-range telemetry transmission using low-cost LoRa radio modules",
        ],
        tools: ["ESP32 / LoRa", "PlatformIO"],
      },
      month2: {
        title: "Build Proof of Work",
        projectTitle: "Simulated CanSat Atmospheric Probe",
        description:
          "Pack pressure, altitude, and temperature sensors inside a soda-can frame and transmit real-time telemetry over 100 meters.",
        tools: ["Sensor Suite", "CanSat Scaffold"],
      },
      month3: {
        title: "Apply & Pitch",
        bullets: [
          "Practice an unscripted live demonstration showing sensor readings changing in real time",
          "Compete for top-3 podium and cash prizes at national finals",
        ],
      },
    },
  },
  mech: {
    startup: {
      matchedRole: "Spacecraft Structures & Rocket Propulsion",
      branchFit: "94% Branch Fit",
      roleExplanation:
        "Design lightweight 3D brackets, fairings, and propellant feeds for private Indian orbital launch vehicles.",
      keySkill: "3D CAD (FreeCAD / Onshape) + Structural FEA",
      eligibility: "Portfolio of 3D Models & Fabrication Drawings Required",
      targetTeams: "Skyroot Aerospace, Agnikul Cosmos, Dhruva Space, EtherealX",
      roadmapRoleId: "spacecraft-structures-cad-engineer",
      month1: {
        title: "Learn the Basics",
        bullets: [
          "Learn parametric 3D modeling and sheet metal tolerances in FreeCAD or Onshape",
          "Study aerospace material selection: 6061-T6 Aluminum vs. Carbon Fiber Composites",
        ],
        tools: ["FreeCAD / Onshape", "Engineering Drawing Standards"],
      },
      month2: {
        title: "Build Proof of Work",
        projectTitle: "Lightweight 1U CubeSat Chassis & Solar Bracket",
        description:
          "Design an aerospace-grade deployable bracket optimized for mass reduction with structural stress analysis report.",
        tools: ["FEA Stress Simulation", "3D Printing / Mockup"],
      },
      month3: {
        title: "Apply & Pitch",
        bullets: [
          "Export high-resolution rendering and assembly exploded drawings for your portfolio",
          "Present your structural calculations to rocket startup hardware recruiters",
        ],
      },
    },
    isro: {
      matchedRole: "Thermal & Launch Vehicle Simulation Trainee",
      branchFit: "92% Branch Fit",
      roleExplanation:
        "Directly prepares for Vikram Sarabhai Space Centre (VSSC) rocket aerodynamics and URSC thermal engineering.",
      keySkill: "Thermal Modeling & Numerical Simulation",
      eligibility: "Min. 60% / 6.32 CGPA (Pre-Final or Final Year Preferred)",
      targetTeams: "ISRO VSSC Thiruvananthapuram, LPSC Valiamala, URSC Bengaluru",
      roadmapRoleId: "thermal-control-systems-engineer",
      month1: {
        title: "Learn the Basics",
        bullets: [
          "Revise thermodynamics, conduction, radiation, and orbital thermal cycles",
          "Run simple heat dissipation simulations on spacecraft electronic boxes",
        ],
        tools: ["Thermal Simulators", "MATLAB / Python"],
      },
      month2: {
        title: "Build Proof of Work",
        projectTitle: "Orbital Thermal Vacuum Chamber Simulation",
        description:
          "Model how a small satellite heats up in sunlight (+120°C) and freezes in Earth's shadow (-80°C) over a 90-minute orbit.",
        tools: ["Numerical Thermal Model", "Python Scipy"],
      },
      month3: {
        title: "Apply & Pitch",
        bullets: [
          "Synthesize thermal transient graphs into a clean 4-page academic report",
          "Submit formal NOC to VSSC / LPSC student project coordinators",
        ],
      },
    },
    hackathon: {
      matchedRole: "Rapid Mechanical Prototyping Lead",
      branchFit: "95% Branch Fit",
      roleExplanation:
        "Build physical mechanism rigs and deployable solar arrays that judges can touch and evaluate in person.",
      keySkill: "Rapid CAD, Laser-Cutting & 3D Prototyping",
      eligibility: "Open to All B.Tech Years (Mixed Squads Recommended)",
      targetTeams: "IN-SPACe National Hackathon, Student Rocketry Competitions",
      roadmapRoleId: "cubesat-systems-engineer",
      month1: {
        title: "Learn the Basics",
        bullets: [
          "Learn snap-fit joints, spring deployment mechanisms, and hinge design",
          "Team up with an ECE friend to integrate micro-servos with 3D parts",
        ],
        tools: ["Onshape / Fusion 360", "Cardboard / 3D Print"],
      },
      month2: {
        title: "Build Proof of Work",
        projectTitle: "Spring-Loaded Solar Array Deployment Rig",
        description:
          "Build a reliable passive hinge mechanism that folds flat for launch and snaps open in under 0.5 seconds.",
        tools: ["Torsion Springs", "Physical Prototyping Kit"],
      },
      month3: {
        title: "Apply & Pitch",
        bullets: [
          "Film high-speed slow-motion deployment tests to show reliability",
          "Present your working mechanical build on stage during hackathon judging",
        ],
      },
    },
  },
};

/* ── FAQ Intelligence Bank ────────────────────────────────── */

function getQuickAnswer(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("cgpa") || q.includes("marks") || q.includes("percentage") || q.includes("cutoff")) {
    return "ISRO ICRB programs require at least 60% aggregate marks or a 6.32 CGPA out of 10. Private space startups (Skyroot, Pixxel, Dhruva Space) do NOT enforce strict CGPA cutoffs—they hire based on your GitHub projects, hardware demos, and practical problem-solving skills.";
  }
  if (q.includes("isro") || q.includes("center") || q.includes("ursc") || q.includes("vssc") || q.includes("sac")) {
    return "ISRO offers 45-day summer internships (open to 2nd–4th year students) and final-year student project cycles (after semester 6). An approved permission letter (NOC) from your college Head of Department is strictly required.";
  }
  if (q.includes("startup") || q.includes("internship") || q.includes("hiring") || q.includes("apply") || q.includes("salary") || q.includes("stipend")) {
    return "Top space startups in Hyderabad and Bengaluru recruit year-round with stipends between ₹12,000 to ₹25,000/month. Having one polished starter project with a clear README and 1-minute demo video puts you in the top 5% of student applicants.";
  }
  if (q.includes("hackathon") || q.includes("team") || q.includes("squad") || q.includes("bharatiya") || q.includes("antariksh")) {
    return "National space hackathons like the Bharatiya Antariksh Hackathon welcome students from 1st to 4th year in squads of 2 to 4. Teams that combine a coder (CSE) with a hardware/circuits member (ECE or Mech) win the majority of podium prizes.";
  }
  if (q.includes("first year") || q.includes("1st year") || q.includes("beginner") || q.includes("freshman")) {
    return "In 1st year, you have an immense advantage: focus on Month 1 foundations (Python, basic electronics, or FreeCAD). Many hackathons and startup apprentice programs welcome enthusiastic 1st-year learners who can show self-initiated projects.";
  }
  return "For your selected path, the most important step is completing the Month 2 starter build. Recruiters look for tangible proof that you can take raw telemetry or hardware, test it methodically, and document what you learned.";
}

/* ── Component ────────────────────────────────────────────── */

interface CareerGuideScreenProps {
  session: StudentSession;
  progress: GuideProgress;
  onViewInternships: (branch: GuideBranch) => void;
}

export function CareerGuideScreen({ session, progress }: CareerGuideScreenProps) {
  const profileBranch = getGuideBranch(session.branch) ?? "cse";
  const firstName = session.name.split(" ")[0];

  const [branch, setBranch] = useState<GuideBranch>(profileBranch);
  const [goal, setGoal] = useState<GuideGoal>("startup");
  const [customQuestion, setCustomQuestion] = useState("");
  const [activeAdvice, setActiveAdvice] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);

  const plan = useMemo(() => CAREER_MATRIX[branch][goal], [branch, goal]);

  const handleUpdateQuery = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customQuestion.trim()) return;
    setActiveAdvice(getQuickAnswer(customQuestion));
  };

  const handlePinPlan = () => {
    const planOptions: GuidePlanOptions = {
      branch,
      year: 2,
      goal,
      experience: "beginner",
    };
    progress.addToHome(planOptions);
    setPinned(true);
    setTimeout(() => setPinned(false), 4500);
  };

  const currentBranchLabel = BRANCHES.find((b) => b.id === branch)?.label ?? "CSE / Data Science";
  const currentGoalLabel = GOALS.find((g) => g.id === goal)?.label ?? "Space Startup Internship";

  return (
    <div className="swap-in w-full space-y-8 pb-16">
      {/* ═════════════════════════════════════════════════════════
          1. CLEAN TOP HEADER & UNIFIED CONTROL STRIP
         ═════════════════════════════════════════════════════════ */}
      <header className="reveal space-y-3">
        <h1 className="font-display text-[36px] leading-[1.06] tracking-[-0.025em] text-ink sm:text-[44px]">
          Your personal <em className="italic text-booster">career</em> engine.
        </h1>
        <p className="max-w-3xl text-[15.5px] leading-[1.6] text-graphite">
          Pick your branch and goal—get a visual skill map, real eligibility check, and a 2-week starter project.
        </p>

        {/* ── Single Unified Control Strip ──────────────────────── */}
        <div className="mt-6 rounded-3xl border border-hairline bg-white/85 p-3 shadow-[0_12px_32px_-20px_rgba(20,21,24,0.15)] backdrop-blur-[18px]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Branch & Goal Pill Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Branch group */}
              <div className="flex items-center gap-1 rounded-full bg-stone/80 p-1">
                {BRANCHES.map((b) => {
                  const active = b.id === branch;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setBranch(b.id);
                        setActiveAdvice(null);
                      }}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all duration-200 whitespace-nowrap",
                        active
                          ? "bg-cobalt text-white shadow-xs"
                          : "text-graphite hover:bg-white hover:text-ink",
                      )}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>

              {/* Goal group */}
              <div className="flex items-center gap-1 rounded-full bg-stone/80 p-1">
                {GOALS.map((g) => {
                  const active = g.id === goal;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setGoal(g.id);
                        setActiveAdvice(null);
                      }}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all duration-200 whitespace-nowrap",
                        active
                          ? "bg-booster text-white shadow-xs"
                          : "text-graphite hover:bg-white hover:text-ink",
                      )}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Custom Question Input Pill */}
            <form onSubmit={handleUpdateQuery} className="flex items-center gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Or ask a specific question (e.g., CGPA needed for ISRO)..."
                className="min-w-[240px] flex-1 rounded-full border border-hairline bg-[#EFECE6] px-4 py-2 text-[13px] text-ink placeholder:text-graphite/60 focus:border-cobalt focus:bg-white focus:outline-none sm:min-w-[290px]"
              />
              <button
                type="submit"
                className="liquid-primary group shrink-0 rounded-full px-4 py-2 text-[12.5px] font-semibold text-white transition-all"
              >
                Update Plan ✨
              </button>
            </form>
          </div>
        </div>

        {/* ── Optional Question Advice Card ─────────────────────── */}
        {activeAdvice && (
          <div className="swap-in mt-3 flex items-start justify-between gap-3 rounded-2xl border border-booster/30 bg-booster/[0.06] p-4 text-ink">
            <div className="flex items-start gap-3">
              <span className="text-lg">💡</span>
              <div>
                <p className="mono text-[9px] font-bold tracking-wider text-booster">
                  CAREER ENGINE INSIGHT // {customQuestion.toUpperCase()}
                </p>
                <p className="mt-1 text-[13.5px] leading-[1.6] text-ink font-medium">
                  {activeAdvice}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveAdvice(null)}
              className="text-graphite hover:text-ink text-sm px-2 py-1"
              aria-label="Dismiss insight"
            >
              ✕
            </button>
          </div>
        )}
      </header>

      {/* ═════════════════════════════════════════════════════════
          2. LIVE VISUAL CAREER GRAPH (LANDING PAGE PROMISE)
         ═════════════════════════════════════════════════════════ */}
      <section
        aria-label="Live visual career graph"
        className="relative mx-auto mt-6 py-4"
      >
        {/* Soft warm radial glow behind the center node */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-booster/[0.12] blur-[90px]" />
          <div className="absolute left-[32%] top-[20%] h-[200px] w-[200px] rounded-full bg-cobalt/[0.08] blur-[80px]" />
        </div>

        {/* 12-Column Horizontal Connected Graph */}
        <div className="relative z-10 grid grid-cols-1 items-center gap-4 lg:grid-cols-12 lg:gap-0">
          {/* ── Left Node (Inputs) ────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-hairline bg-white p-5 shadow-xs transition-all hover:border-graphite/40">
              <div className="flex items-center justify-between">
                <span className="mono text-[8.5px] font-bold tracking-wider text-graphite">
                  INPUT PROFILE
                </span>
                <span className="live-dot h-2 w-2 rounded-full bg-cobalt" />
              </div>
              <p className="mt-2 text-[15px] font-semibold text-ink">
                {firstName} • {currentBranchLabel}
              </p>
              <div className="mt-3 border-t border-hairline pt-2.5">
                <p className="mono text-[8.5px] text-graphite">ACTIVE GOAL</p>
                <p className="mt-0.5 text-[12.5px] font-medium text-booster">
                  {currentGoalLabel}
                </p>
              </div>
            </div>
          </div>

          {/* ── SVG Connector 1 (Left → Center) ───────────────── */}
          <div className="hidden lg:col-span-1 lg:flex items-center justify-center px-1" aria-hidden="true">
            <svg viewBox="0 0 60 20" className="h-6 w-full overflow-visible" fill="none">
              <line x1="0" y1="10" x2="60" y2="10" stroke="#D94E1F" strokeWidth="2" />
              <line
                x1="0"
                y1="10"
                x2="60"
                y2="10"
                stroke="#D94E1F"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="ai-flow-line"
              />
              <circle cx="60" cy="10" r="3" fill="#D94E1F" />
            </svg>
          </div>

          {/* ── Center Matched Track (Focal Highlight) ────────── */}
          <div className="lg:col-span-4">
            <div className="relative rounded-2xl border-2 border-booster bg-white p-5 shadow-[0_16px_36px_-16px_rgba(217,78,31,0.25)] transition-all">
              <div className="flex items-center justify-between gap-2">
                <span className="mono text-[9px] font-bold tracking-wider text-booster">
                  AI MATCHED CAREER TRACK
                </span>
                <span className="liquid-chip mono px-2.5 py-0.5 text-[8.5px] font-semibold text-cobalt">
                  {plan.branchFit}
                </span>
              </div>
              <h2 className="mt-2 font-display text-[25px] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[27px]">
                {plan.matchedRole}
              </h2>
              <p className="mt-2 text-[13px] leading-[1.55] text-graphite">
                {plan.roleExplanation}
              </p>
            </div>
          </div>

          {/* ── SVG Connector 2 (Center → Right 3 Nodes) ──────── */}
          <div className="hidden lg:col-span-1 lg:flex items-center justify-center px-1" aria-hidden="true">
            <svg viewBox="0 0 60 140" className="h-36 w-full overflow-visible" fill="none">
              {/* Branch to Top Node */}
              <path d="M 0 70 C 30 70, 30 20, 60 20" stroke="#D94E1F" strokeWidth="1.8" />
              <circle cx="60" cy="20" r="2.5" fill="#D94E1F" />

              {/* Branch to Middle Node */}
              <path d="M 0 70 L 60 70" stroke="#D94E1F" strokeWidth="2" />
              <circle cx="60" cy="70" r="2.5" fill="#D94E1F" />

              {/* Branch to Bottom Node */}
              <path d="M 0 70 C 30 70, 30 120, 60 120" stroke="#D94E1F" strokeWidth="1.8" />
              <circle cx="60" cy="120" r="2.5" fill="#D94E1F" />
            </svg>
          </div>

          {/* ── Right 3 Connected Output Nodes ────────────────── */}
          <div className="space-y-2.5 lg:col-span-3">
            {/* Output 1: Key Skill */}
            <div className="rounded-2xl border border-hairline bg-white p-3.5 shadow-xs transition-colors hover:border-graphite/40">
              <span className="mono text-[8.5px] font-bold text-cobalt">
                01 // KEY SKILL TO BUILD
              </span>
              <p className="mt-1 text-[13.5px] font-semibold text-ink">
                {plan.keySkill}
              </p>
            </div>

            {/* Output 2: Eligibility */}
            <div className="rounded-2xl border border-hairline bg-white p-3.5 shadow-xs transition-colors hover:border-graphite/40">
              <span className="mono text-[8.5px] font-bold text-booster">
                02 // REAL ELIGIBILITY GATE
              </span>
              <p className="mt-1 text-[13px] font-semibold text-ink">
                {plan.eligibility}
              </p>
            </div>

            {/* Output 3: Target Teams */}
            <div className="rounded-2xl border border-hairline bg-white p-3.5 shadow-xs transition-colors hover:border-graphite/40">
              <span className="mono text-[8.5px] font-bold text-graphite">
                03 // HIRING TARGET TEAMS
              </span>
              <p className="mt-1 text-[13px] font-semibold text-ink">
                {plan.targetTeams}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════
          3. CLEAN 3-STEP ACTION PLAN (ZERO NESTED BOXES)
         ═════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="action-plan-heading"
        className="border-t border-hairline pt-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono text-[10px] text-booster">
              STRUCTURED 3-MONTH CURRICULUM
            </p>
            <h2
              id="action-plan-heading"
              className="mt-1 font-display text-[28px] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[34px]"
            >
              From College Classroom to Launchpad Ready
            </h2>
          </div>
          <p className="max-w-md text-[13.5px] leading-[1.6] text-graphite">
            No walls of text. Follow one clear milestone per month to build verifiable space-tech proof-of-work.
          </p>
        </div>

        {/* 3 Horizontal Columns Separated by Vertical Hairline Dividers */}
        <div className="mt-8 grid grid-cols-1 divide-y divide-hairline md:grid-cols-3 md:divide-x md:divide-y-0">
          {/* ── Month 1: Learn the Basics ─────────────────────── */}
          <div className="py-6 md:px-6 md:py-2 md:first:pl-0">
            <span className="mono text-[9.5px] font-bold text-cobalt">
              MONTH 01 // LEARN THE BASICS
            </span>
            <h3 className="mt-2 text-[17px] font-semibold text-ink">
              {plan.month1.title}
            </h3>

            <ul className="mt-3.5 space-y-2.5">
              {plan.month1.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-ink">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-1.5 pt-3">
              <span className="mono text-[8.5px] text-graphite">Tools:</span>
              {plan.month1.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-stone px-2.5 py-1 text-[11px] font-medium text-ink"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* ── Month 2: Build Proof of Work ──────────────────── */}
          <div className="py-6 md:px-6 md:py-2">
            <span className="mono text-[9.5px] font-bold text-booster">
              MONTH 02 // BUILD PROOF OF WORK
            </span>
            <h3 className="mt-2 text-[17px] font-semibold text-ink">
              {plan.month2.projectTitle}
            </h3>
            <p className="mt-3 text-[13.5px] leading-[1.6] text-graphite">
              {plan.month2.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-1.5 pt-3">
              <span className="mono text-[8.5px] text-graphite">Deliverables:</span>
              {plan.month2.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-stone px-2.5 py-1 text-[11px] font-medium text-ink"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* ── Month 3: Apply & Pitch ────────────────────────── */}
          <div className="py-6 md:px-6 md:py-2 md:last:pr-0">
            <span className="mono text-[9.5px] font-bold text-emerald-700">
              MONTH 03 // APPLY &amp; PITCH
            </span>
            <h3 className="mt-2 text-[17px] font-semibold text-ink">
              Package &amp; Ship Application
            </h3>

            <ul className="mt-3.5 space-y-2.5">
              {plan.month3.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-ink">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Direct Action Links */}
            <div className="mt-6 space-y-3 pt-2">
              <button
                type="button"
                onClick={handlePinPlan}
                className={cn(
                  "flex h-10 w-full items-center justify-center gap-2 rounded-full text-[13px] font-semibold transition-all duration-300",
                  pinned ? "liquid-cobalt text-white" : "liquid-primary text-white",
                )}
              >
                <CheckSeal className="h-4 w-4" />
                <span>
                  {pinned ? "Pinned to My Home Checklist ✓" : "Pin All 3 Steps to My Home Checklist ✓"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.hash = `#/app/roadmaps?role=${plan.roadmapRoleId}`;
                }}
                className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-cobalt transition-colors hover:text-ink"
              >
                <span>Open Full Role Flowchart</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
