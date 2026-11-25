import { GUIDE_BRANCHES, ISRO_MARKS, type GuideBranch, type GuideGoal } from "./careerGuide";

export const PROJECT_EXAMPLES: { label: string; branch: GuideBranch; idea: string }[] = [
  { label: "Flood map", branch: "cse", idea: "I want to build a web app that tracks floods in Telangana using free satellite images and Python." },
  { label: "Weather sensor", branch: "ece", idea: "I want to build a small Arduino weather station that records temperature and shows the readings on a chart." },
  { label: "Camera holder", branch: "mech", idea: "I want to design a lightweight camera holder in FreeCAD and test whether a cardboard model fits securely." },
];

export interface ProjectReview {
  strength: string;
  upgrades: [string, string];
  roles: string[];
}

const REVIEWS = {
  flood: {
    strength: "Mapping floods in one place shows you can use real images to explain a problem people care about. A small, working map is stronger than a long feature list.",
    upgrades: [
      "Start with one district and compare two dated images of the same area. Check your result against a public flood map if one is available.",
      "Show the two images side by side. Note where clouds or shadows make your result less certain, and link to your data and code.",
    ],
    roles: ["Satellite Data Intern", "Python Intern", "Space Hackathon: Mapping"],
  },
  maps: {
    strength: "A map that answers one clear question shows you can work with real data and share the result in a way other people can use.",
    upgrades: [
      "Choose one city or lake. Compare two images and mark one change you can explain.",
      "Link to the images, add a screenshot and write a short guide so a classmate can run your code.",
    ],
    roles: ["Satellite Data Intern", "Map Software Intern", "Space Hackathon: Data"],
  },
  sensors: {
    strength: "A small working sensor build shows you can connect parts, collect readings and explain what went wrong during a test.",
    upgrades: [
      "Test the sensor in two different conditions and write down what you changed between tests.",
      "Include a wiring sketch, a chart of the readings and a short clip of the build or simulation working.",
    ],
    roles: ["Electronics Intern", "Hardware Testing Intern", "Space Hackathon: Sensors"],
  },
  design: {
    strength: "A simple part with a clear purpose is easy to show in an interview. A drawing and a fit test show that you can do more than make a nice 3D image.",
    upgrades: [
      "Draw two versions of the part. Compare their size, estimated weight and how they would be made.",
      "Test the fit with a cardboard or 3D model. Take a photo, show what did not fit and explain how you fixed it.",
    ],
    roles: ["Mechanical Design Intern", "Hardware Testing Intern", "Space Hackathon: Design"],
  },
  software: {
    strength: "A small tool that someone else can run gives a reviewer something concrete to try. It shows how you turn an idea into working code.",
    upgrades: [
      "Choose one task your tool should do well. Try it with a real example and one case that should fail.",
      "Share the code, a screenshot of the result and short setup instructions on GitHub.",
    ],
    roles: ["Software Intern", "Python Intern", "Space Hackathon: Software"],
  },
} satisfies Record<string, ProjectReview>;

const BRANCH_START = {
  cse: { skill: "Python for satellite maps", build: "compare two free satellite images of your city", role: "software and satellite data" },
  ece: { skill: "basic circuits and sensor readings", build: "build or simulate a small temperature logger", role: "electronics and testing" },
  mech: { skill: "3D drawing and checking part sizes", build: "design a small camera holder and check its fit", role: "mechanical design and testing" },
} satisfies Record<GuideBranch, { skill: string; build: string; role: string }>;

export function reviewProject(idea: string, branch: GuideBranch): ProjectReview {
  if (/\b(floods?|flooding|inundation)\b/i.test(idea)) return REVIEWS.flood;
  if (/\b(cad|freecad|mechanical|brackets?|mounts?|holders?|3d|solidworks)\b/i.test(idea)) return REVIEWS.design;
  if (/\b(arduino|sensors?|circuits?|esp32|stm32|electronics|boards?)\b/i.test(idea)) return REVIEWS.sensors;
  if (/\b(images?|maps?|mapping|landsat|sentinel|bhuvan|crops?|imagery)\b/i.test(idea)) return REVIEWS.maps;
  if (/\b(app|website|python|code|github|software|script|dashboard)\b/i.test(idea)) return REVIEWS.software;

  const starter = BRANCH_START[branch];
  return {
    strength: "The most useful part of a student project is being able to show what you made and why. Your idea will be easier to review once it has one specific result.",
    upgrades: [
      "Name one person who could use the project and one thing it should help them do.",
      `Pick a two-week test you can finish. For example, ${starter.build}, then document what you learned.`,
    ],
    roles: [`Explore ${starter.role} internships`, "Space Hackathon: First Project"],
  };
}

export const QUICK_QUESTIONS = [
  "How can a CSE student get into ISRO?",
  "What skills do Indian space startups want?",
  "I have zero aerospace background\u2014where do I start?",
  "How do I find teammates for space hackathons?",
] as const;

export interface GuideAnswer {
  branch: GuideBranch;
  title: string;
  summary: string;
  steps: [string, string, string];
  action: { kind: "roadmap"; goal?: GuideGoal } | { kind: "internships" };
  showIsroRules?: boolean;
}

export function answerCareerQuestion(question: string, contextBranch: GuideBranch, year: number): GuideAnswer {
  // An explicitly named branch takes priority over the branch in the profile.
  const branch = /\b(cse|computer science|data science)\b/i.test(question) ? "cse"
    : /\b(ece|eee|electronics)\b/i.test(question) ? "ece"
      : /\b(mechanical|mech)\b/i.test(question) ? "mech" : contextBranch;
  const starter = BRANCH_START[branch];

  if (/\b(isro|cgpa|nrsc)\b/i.test(question)) {
    return {
      branch,
      title: "Start with the student program rules",
      summary: `You don't need to change branches. ${GUIDE_BRANCHES[branch]} students can look for ISRO projects in ${starter.role}.`,
      steps: [
        `${ISRO_MARKS} Read the current rules for Indian students before applying.`,
        year < 3
          ? "Look at internships of up to 45 days now. The B.Tech student project program is for students who have finished semester 6."
          : "For a B.Tech student project, confirm you've finished semester 6. The separate internship scheme lasts up to 45 days.",
        `Build one example you can share: ${starter.build}. Ask your college what paperwork you need.`,
      ],
      action: { kind: "roadmap", goal: "isro" },
      showIsroRules: true,
    };
  }

  if (/\b(hackathons?|teammates?|team|squad|contest)\b/i.test(question)) {
    return {
      branch,
      title: "Build a small team around one idea",
      summary: "Look for people whose skills are different from yours. You don't need everyone to know everything.",
      steps: [
        "Pick an event first. Check the allowed team size, deadline and whether you can mix colleges.",
        `Ask in your college club or a student group. Share one idea, what you can help with (${starter.role}) and when you can meet.`,
        "Try a 30-minute call to agree on one thing to build. Give each person a clear piece and practise the demo together.",
      ],
      action: { kind: "roadmap", goal: "hackathon" },
    };
  }

  if (/\b(startups?|internships?|skills?|recruiters?|hiring|resume|jobs?|portfolio)\b/i.test(question)) {
    return {
      branch,
      title: "Show a small project that works",
      summary: `Space startups hire for different jobs. For ${GUIDE_BRANCHES[branch]}, a good starting point is ${starter.skill}.`,
      steps: [
        "Read two recent job or internship listings. Write down the skills that appear in both.",
        `Use one skill to ${starter.build}. Write down one test you ran and what you found.`,
        "Share a link to the project when you apply. Check the year, skills and location each company asks for.",
      ],
      action: { kind: "internships" },
    };
  }

  const gettingStarted = /\b(start|begin|beginner|background|learn|first|projects?|coding|python|courses?|roadmap|tools?)\b/i.test(question);
  return {
    branch,
    title: gettingStarted ? "Start with what you already study" : "Try one small next step",
    summary: gettingStarted
      ? `You don't need aerospace classes to get started. Try ${starter.skill} and build something you can explain in your own words.`
      : "I don't have a specific answer for that yet. This guide covers getting started, projects, internships, ISRO programs and hackathon teams.",
    steps: [
      `Spend a few short sessions on ${starter.skill}. Use a free tutorial and try each example yourself.`,
      `Set aside two weeks to ${starter.build}. Keep the first version small.`,
      "Show the result to a classmate. Ask them what was easy to understand and improve one thing.",
    ],
    action: { kind: "roadmap" },
  };
}