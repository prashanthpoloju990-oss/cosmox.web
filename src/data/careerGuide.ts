import { branchCode } from "@/utils/session";

export const GUIDE_BRANCHES = {
  cse: "CSE / Data Science",
  ece: "ECE",
  mech: "Mechanical",
} as const;

export type GuideBranch = keyof typeof GUIDE_BRANCHES;
export type GuideGoal = "startup" | "isro" | "hackathon";
export type GuideExperience = "beginner" | "basics" | "projects";

export const GUIDE_GOALS: { id: GuideGoal; title: string; hint: string }[] = [
  { id: "startup", title: "Get a Space Startup Internship", hint: "Explore Skyroot, Dhruva Space or Pixxel." },
  { id: "isro", title: "Prepare for ISRO Student Programs", hint: "45-day internships and sixth-semester rules." },
  { id: "hackathon", title: "Win a National Space Hackathon", hint: "Try the Bharatiya Antariksh Hackathon." },
];

export const GUIDE_EXPERIENCE: { id: GuideExperience; label: string; time: string }[] = [
  { id: "beginner", label: "Complete Beginner", time: "6\u20138 hrs/week" },
  { id: "basics", label: "Know Basic Coding/CAD", time: "5\u20137 hrs/week" },
  { id: "projects", label: "Built 1\u20132 Projects", time: "4\u20136 hrs/week" },
];

export const ISRO_RULES_URL = "https://www.isro.gov.in/InternshipAndProjects.html";
export const ISRO_MARKS = "ISRO asks for at least 60% overall or a 6.32 CGPA out of 10.";

export function getGuideBranch(branch: string): GuideBranch | null {
  const code = branchCode(branch);
  if (code === "CSE-DS") return "cse";
  if (code === "ECE") return "ece";
  if (code === "MECH") return "mech";
  return null;
}

export function getGuideYear(year: string): number {
  const number = Number.parseInt(year, 10);
  return number >= 1 && number <= 4 ? number : 2;
}

export function yearLabel(year: number): string {
  return ["1st Year", "2nd Year", "3rd Year", "4th Year"][year - 1] ?? "2nd Year";
}

export interface GuidePlanOptions {
  branch: GuideBranch;
  year: number;
  goal: GuideGoal;
  experience: GuideExperience;
}

export interface GuideMilestone {
  id: string;
  label: string;
}

interface GuideMonth {
  title: string;
  steps: GuideMilestone[];
  tools: string[];
}

export interface GuidePlan {
  id: string;
  options: GuidePlanOptions;
  title: string;
  time: string;
  note: string;
  months: GuideMonth[];
  project: { title: string; description: string };
}

interface BranchTrack {
  titles: Record<GuideGoal, string>;
  basics: Record<GuideExperience, [string, string]>;
  practice: [string, string];
  tools: [string[], string[]];
  share: string;
  project: Record<GuideGoal, { title: string; description: string }>;
}

const TRACKS: Record<GuideBranch, BranchTrack> = {
  cse: {
    titles: { startup: "Satellite Data & Space Software", isro: "Earth Maps & ISRO Projects", hackathon: "Satellite Maps for Hackathons" },
    basics: {
      beginner: ["Learn enough Python to read a file.", "Explore a free satellite map of your city."],
      basics: ["Use Python to clean a small map dataset.", "Plot three points from it on a map."],
      projects: ["Pick one map tool your last project was missing.", "Turn a script you already use into a repeatable tool."],
    },
    practice: ["Compare two satellite images of the same place.", "Put what changed on a simple map."],
    tools: [["Python", "Free Satellite Maps"], ["Python", "Free Satellite Maps"]],
    share: "Share your map on GitHub with a short setup guide.",
    project: {
      startup: { title: "Map how your city has changed", description: "Compare two free satellite images of your city with Python. Make a simple before-and-after map and explain one change you found." },
      isro: { title: "Track a lake from space", description: "Find two public satellite images of a nearby lake. Make a map showing how the water changed and write a few lines on what you can and can't tell from the images." },
      hackathon: { title: "Build a local flood map", description: "Pick one district. Compare public images from before and after a flood and turn your findings into a map a teammate can explain in a minute." },
    },
  },
  ece: {
    titles: { startup: "Electronics for Small Satellites", isro: "Sensors & ISRO Projects", hackathon: "Sensor Builds for Hackathons" },
    basics: {
      beginner: ["Learn how a simple circuit reads a sensor.", "Make an LED blink in a free circuit simulator."],
      basics: ["Read a temperature sensor with an Arduino board.", "Write down how readings change in a warm and a cool room."],
      projects: ["Reuse a circuit you've built and add a sensor.", "Test how often it sends a reading and what happens if it misses one."],
    },
    practice: ["Record a short set of sensor readings.", "Make a chart and explain any readings that look wrong."],
    tools: [["Arduino", "Circuit Simulator"], ["Temperature Sensor", "Spreadsheet"]],
    share: "Post a photo, a wiring sketch and your test results.",
    project: {
      startup: { title: "Build a small temperature logger", description: "Use an Arduino or a free simulator to record temperature once a minute. Share a chart, a wiring sketch and one test you ran." },
      isro: { title: "Check how well a sensor reads", description: "Compare a low-cost temperature sensor with a thermometer. Make a chart of the differences and explain when you would trust each reading." },
      hackathon: { title: "Make a weather station demo", description: "Build or simulate a board that reports temperature. Show the last ten readings on one screen so teammates can demo it easily." },
    },
  },
  mech: {
    titles: { startup: "3D Design for Space Hardware", isro: "Mechanical Design & ISRO Projects", hackathon: "Design & Testing for Hackathons" },
    basics: {
      beginner: ["Draw a simple bracket in a free 3D design tool.", "Make a drawing that shows its dimensions."],
      basics: ["Model two versions of the same small bracket.", "Compare their size, weight and how easy they are to assemble."],
      projects: ["Pick a part you've made and redesign it to be lighter.", "Record what you kept, what changed and why."],
    },
    practice: ["Make a cardboard version or a 3D model of your design.", "Check that it fits, then improve one part."],
    tools: [["FreeCAD", "3D Drawings"], ["Cardboard Mock-up", "Fit Tests"]],
    share: "Share a drawing, two photos and a note on what you tested.",
    project: {
      startup: { title: "Design a lightweight camera holder", description: "Draw two holders for a small camera in FreeCAD. Compare their weight and check the fit using cardboard or a 3D model." },
      isro: { title: "Make a case for a small sensor", description: "Sketch a case that keeps a sensor in place and leaves room for wires. Test a cardboard copy and write down the changes you would make." },
      hackathon: { title: "Build an adjustable camera stand", description: "Make a cardboard or 3D model that holds a small camera at two angles. Take a short video showing how quickly your team can adjust it." },
    },
  },
};

export const GUIDE_STEP_IDS = ["m1-1", "m1-2", "m2-1", "m2-2", "m3-1", "m3-2"] as const;

function finalStep(goal: GuideGoal, year: number): string {
  if (goal === "isro") {
    return year < 3
      ? "Check the internship rules and note when you can apply for a student project."
      : "Check your semester and the centre's rules, then draft an application.";
  }
  if (goal === "hackathon") return "Find teammates and practise a one-minute demo together.";
  return year === 1
    ? "Shortlist beginner-friendly internships and note their requirements."
    : "Shortlist two internships that fit your year and send your project with each application.";
}

function eligibilityNote({ goal, year }: GuidePlanOptions): string {
  if (goal === "isro") {
    return `${ISRO_MARKS} The internship lasts up to 45 days. B.Tech student projects start after semester 6.`;
  }
  if (goal === "hackathon") return "Check who can enter, the team size and the deadline before you sign up.";
  return year === 1
    ? "Some internships start in 2nd year. Use this time to build a small project and find roles open to beginners."
    : `Look for roles open to ${yearLabel(year).toLowerCase()} students. Each company sets its own rules.`;
}

export function buildGuidePlan(options: GuidePlanOptions): GuidePlan {
  const { branch, goal, experience, year } = options;
  const track = TRACKS[branch];
  const researchTask = goal === "isro" ? "ISRO Program Rules" : goal === "hackathon" ? "Team Demo" : "Internship Listings";
  const month = (index: number, title: string, tools: string[], steps: [string, string]): GuideMonth => ({
    title,
    tools,
    steps: steps.map((label, i) => ({ id: GUIDE_STEP_IDS[index * 2 + i], label })),
  });

  return {
    id: `${branch}-${goal}-${experience}-${year}`,
    options,
    title: track.titles[goal],
    time: GUIDE_EXPERIENCE.find((item) => item.id === experience)?.time ?? GUIDE_EXPERIENCE[0].time,
    note: eligibilityNote(options),
    months: [
      month(0, "Basics", track.tools[0], track.basics[experience]),
      month(1, "Hands-On Tools", track.tools[1], track.practice),
      month(2, "Build & Apply", ["GitHub", researchTask], [track.share, finalStep(goal, year)]),
    ],
    project: track.project[goal],
  };
}