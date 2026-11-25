export type OpportunityCategory = "internship" | "hackathon" | "workshop";
export type BranchId = "cse" | "ece" | "mech";

export interface Teammate {
  id: string;
  name: string;
  branch: string;
  year: string;
  skill: string;
  city: string;
}

export interface OpportunityDate {
  label: string;
  /** Days from today, so sample dates always stay in the future. */
  inDays: number;
}

export interface Opportunity {
  id: string;
  category: OpportunityCategory;
  org: string;
  orgKind: string;
  title: string;
  summary: string;
  branches: BranchId[];
  yearRange: [number, number];
  applyTags: [string, string];
  skills: string[];
  location: string;
  closesInDays: number;
  addedDaysAgo: number;
  facts: { label: string; value: string }[];
  whatYouWillDo: string[];
  whoCanApply: string[];
  dates: OpportunityDate[];
  prep: string[];
  action:
    | { kind: "apply"; label: string; url: string }
    | { kind: "teammates"; label: string }
    | { kind: "register"; label: string };
  teammates?: Teammate[];
}

export const CATEGORY_LABEL: Record<OpportunityCategory, string> = {
  internship: "Internship",
  hackathon: "Hackathon",
  workshop: "Workshop",
};

export const BRANCH_LABEL: Record<BranchId, string> = {
  cse: "CSE / Data Science",
  ece: "ECE",
  mech: "Mechanical",
};

/** Six sample listings, written for first- and second-year students. */
export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "isro-summer-45",
    category: "internship",
    org: "ISRO Student Scheme",
    orgKind: "Government programme",
    title: "ISRO 45-Day Summer Internship",
    summary: "Work on a guided project with ISRO scientists for six weeks.",
    branches: ["cse", "ece", "mech"],
    yearRange: [2, 4],
    applyTags: ["Who can apply: 2nd–4th Year", "Min. 60% / 6.32 CGPA"],
    skills: ["Python", "C / C++ Basics", "Report Writing"],
    location: "Hyderabad",
    closesInDays: 12,
    addedDaysAgo: 3,
    facts: [
      { label: "Length", value: "45 days" },
      { label: "Support", value: "Certificate + mentor" },
      { label: "Place", value: "ISRO centre, Hyderabad" },
    ],
    whatYouWillDo: [
      "Pick one small project with a scientist who guides you every week.",
      "Learn the tools that team uses, starting from the basics.",
      "Write a short report at the end and present it to your group.",
    ],
    whoCanApply: [
      "Students in 2nd, 3rd or 4th year of B.Tech or B.E.",
      "At least 60% marks, or a CGPA of 6.32 and above.",
      "A signed permission letter (NOC) from your Head of Department.",
    ],
    dates: [
      { label: "Applications close", inDays: 12 },
      { label: "Selected students told", inDays: 28 },
      { label: "Internship starts", inDays: 55 },
    ],
    prep: [
      "Ask your HoD for the permission letter now — it usually takes a week.",
      "Finish one small Python project and put it on GitHub with a clear README.",
      "Write a half-page note on why you want this project, in your own words.",
    ],
    action: {
      kind: "apply",
      label: "Apply on Official Site",
      url: "https://www.isro.gov.in/Careers.html",
    },
  },
  {
    id: "national-space-hackathon",
    category: "hackathon",
    org: "National Space Hackathon",
    orgKind: "National student event",
    title: "National Space Hackathon 2026",
    summary: "Team up and build a space idea in 36 hours, fully online.",
    branches: ["cse", "ece", "mech"],
    yearRange: [1, 4],
    applyTags: ["Team size: 2–4 students", "Location: Online"],
    skills: ["Python", "Basic Electronics", "No Prior Experience Needed"],
    location: "Online",
    closesInDays: 21,
    addedDaysAgo: 1,
    facts: [
      { label: "Length", value: "36 hours" },
      { label: "Prize pool", value: "₹1,00,000" },
      { label: "Place", value: "Online, from your hostel" },
    ],
    whatYouWillDo: [
      "Choose one problem statement, such as mapping floods from satellite pictures.",
      "Build a simple working demo with your team over one weekend.",
      "Show your demo in a five-minute presentation to the judges.",
    ],
    whoCanApply: [
      "Any year, including 1st year — beginners are welcome.",
      "Teams of 2 to 4 students, and they can be from different colleges.",
      "You need a laptop and a steady internet connection.",
    ],
    dates: [
      { label: "Team registration closes", inDays: 21 },
      { label: "Problem statements released", inDays: 25 },
      { label: "Hackathon weekend", inDays: 34 },
    ],
    prep: [
      "Find two teammates — one who codes and one who likes hardware or design.",
      "Try one free satellite image tutorial so the data feels familiar.",
      "Set up a shared GitHub repository before the weekend starts.",
    ],
    action: { kind: "teammates", label: "Find Hackathon Teammates" },
    teammates: [
      {
        id: "t-ananya",
        name: "Ananya R.",
        branch: "CSE / Data Science",
        year: "2nd Year",
        skill: "Python and map data",
        city: "Hyderabad",
      },
      {
        id: "t-farhan",
        name: "Farhan K.",
        branch: "ECE",
        year: "3rd Year",
        skill: "Sensors and small circuits",
        city: "Bengaluru",
      },
      {
        id: "t-meera",
        name: "Meera S.",
        branch: "Mechanical",
        year: "2nd Year",
        skill: "CAD and 3D printing",
        city: "Chennai",
      },
    ],
  },
  {
    id: "cosmox-beginner-sprint",
    category: "workshop",
    org: "Cosmox Live Sprint",
    orgKind: "Cosmox community session",
    title: "Beginner Satellite Coding Workshop",
    summary: "Write your first Python script that tracks a satellite pass.",
    branches: ["cse", "ece", "mech"],
    yearRange: [1, 4],
    applyTags: ["Any year • Beginners welcome", "Location: Online"],
    skills: ["No Prior Experience Needed", "Python Basics"],
    location: "Online",
    closesInDays: 3,
    addedDaysAgo: 2,
    facts: [
      { label: "Length", value: "2 hours, live" },
      { label: "Cost", value: "Free for students" },
      { label: "Place", value: "Online + recording" },
    ],
    whatYouWillDo: [
      "Follow along and write a short Python script, line by line.",
      "Find out when a satellite passes over your own city.",
      "Leave with a small project you can show on your GitHub profile.",
    ],
    whoCanApply: [
      "Any branch and any year — no coding experience needed.",
      "Bring a laptop with Python installed, or use a free online editor.",
      "Seats are limited so everyone gets their questions answered.",
    ],
    dates: [
      { label: "Seat booking closes", inDays: 3 },
      { label: "Live session", inDays: 5 },
      { label: "Recording shared", inDays: 6 },
    ],
    prep: [
      "Install Python, or open a free browser notebook so you are ready.",
      "Keep 20 minutes free afterwards to finish the script yourself.",
      "Write down one question you want answered during the session.",
    ],
    action: { kind: "register", label: "Reserve My Seat" },
  },
  {
    id: "dhruva-electronics",
    category: "internship",
    org: "Dhruva Space",
    orgKind: "Space company",
    title: "Small Satellite Electronics Intern",
    summary: "Build and test simple circuits that go inside small satellites.",
    branches: ["ece"],
    yearRange: [2, 4],
    applyTags: ["Who can apply: 2nd–4th Year", "Min. 60% / 6.32 CGPA"],
    skills: ["Basic Electronics", "Arduino / STM32", "Soldering"],
    location: "Hyderabad",
    closesInDays: 9,
    addedDaysAgo: 5,
    facts: [
      { label: "Length", value: "12 weeks" },
      { label: "Stipend", value: "₹12,000 / month" },
      { label: "Place", value: "Dhruva Space, Hyderabad" },
    ],
    whatYouWillDo: [
      "Read simple circuit diagrams and help build the boards on the bench.",
      "Test power and sensor boards, and write down what you measure.",
      "Help find and fix faults before a board is cleared for use.",
    ],
    whoCanApply: [
      "ECE or EEE students in 2nd year and above.",
      "At least 60% marks, or a CGPA of 6.32 and above.",
      "You should be able to come to the Hyderabad office on working days.",
    ],
    dates: [
      { label: "Applications close", inDays: 9 },
      { label: "Short phone interview", inDays: 16 },
      { label: "Joining date", inDays: 40 },
    ],
    prep: [
      "Build one Arduino or STM32 project and take a short video of it working.",
      "Practise reading a circuit diagram out loud in your own words.",
      "Revise the basics: voltage, current, resistors and reading a multimeter.",
    ],
    action: {
      kind: "apply",
      label: "Apply on Official Site",
      url: "https://dhruvaspace.com/careers/",
    },
  },
  {
    id: "skyroot-hardware",
    category: "internship",
    org: "Skyroot Aerospace",
    orgKind: "Space company",
    title: "Rocket Hardware Intern",
    summary: "Help the workshop team check and test small rocket parts.",
    branches: ["mech", "ece"],
    yearRange: [3, 4],
    applyTags: ["Who can apply: 3rd–4th Year", "Min. 65% / 6.8 CGPA"],
    skills: ["CAD / 3D Design", "Basic Mechanics", "Measuring Tools"],
    location: "Hyderabad",
    closesInDays: 5,
    addedDaysAgo: 7,
    facts: [
      { label: "Length", value: "8 weeks" },
      { label: "Stipend", value: "₹15,000 / month" },
      { label: "Place", value: "Skyroot, Hyderabad" },
    ],
    whatYouWillDo: [
      "Make simple 3D models of parts and check their measurements.",
      "Help set up test stands and note down readings during a test.",
      "Learn the safety rules that every workshop team follows.",
    ],
    whoCanApply: [
      "Mechanical or Aerospace students in 3rd or 4th year.",
      "At least 65% marks, or a CGPA of 6.8 and above.",
      "Comfortable working on-site in a workshop, not only on a laptop.",
    ],
    dates: [
      { label: "Applications close", inDays: 5 },
      { label: "Design task sent out", inDays: 10 },
      { label: "Internship starts", inDays: 32 },
    ],
    prep: [
      "Model one everyday object in free CAD software and export the drawing.",
      "Learn to read a vernier caliper and a micrometer properly.",
      "Put two of your best drawings into a single PDF to share.",
    ],
    action: {
      kind: "apply",
      label: "Apply on Official Site",
      url: "https://skyroot.in/careers/",
    },
  },
  {
    id: "pixxel-earth-images",
    category: "internship",
    org: "Pixxel",
    orgKind: "Space company",
    title: "Earth Images ML Intern",
    summary: "Use satellite pictures to spot farms, water and growing cities.",
    branches: ["cse"],
    yearRange: [3, 4],
    applyTags: ["Who can apply: 3rd–4th Year", "Location: Online"],
    skills: ["Python", "Pandas", "Basic ML"],
    location: "Online",
    closesInDays: 16,
    addedDaysAgo: 4,
    facts: [
      { label: "Length", value: "16 weeks" },
      { label: "Stipend", value: "₹25,000 / month" },
      { label: "Place", value: "Remote, anywhere in India" },
    ],
    whatYouWillDo: [
      "Clean and prepare satellite pictures so a model can learn from them.",
      "Train a simple model that marks farmland, water or buildings.",
      "Show your results in a short weekly note with before-and-after images.",
    ],
    whoCanApply: [
      "CSE, Data Science or AI students in 3rd or 4th year.",
      "You should be comfortable writing basic Python on your own.",
      "A GitHub project matters more than your marks here.",
    ],
    dates: [
      { label: "Applications close", inDays: 16 },
      { label: "Take-home task", inDays: 22 },
      { label: "Internship starts", inDays: 45 },
    ],
    prep: [
      "Build a small GitHub project using free satellite images before applying.",
      "Learn how to open an image in Python and read its pixel values.",
      "Write a clear README so someone else can run your project easily.",
    ],
    action: {
      kind: "apply",
      label: "Apply on Official Site",
      url: "https://www.pixxel.space/careers",
    },
  },
];

/* ── Date helpers ─────────────────────────────────────────── */

const DAY_MS = 86400000;
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

export function dateFromToday(days: number): Date {
  return new Date(TODAY.getTime() + days * DAY_MS);
}

export function formatDate(days: number): string {
  return dateFromToday(days).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function closingLabel(days: number): string {
  if (days <= 0) return "Closes today";
  if (days === 1) return "Closes tomorrow";
  return `Closes in ${days} days`;
}

export function isClosingSoon(days: number): boolean {
  return days <= 7;
}

/** Two listings start saved so the student sees how the saved list works. */
export const SEEDED_SAVED = ["isro-summer-45", "national-space-hackathon"];
