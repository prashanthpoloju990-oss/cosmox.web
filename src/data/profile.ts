import { DEFAULT_SESSION, type StudentSession } from "@/utils/session";

export const AVATARS = ["Sunset explorer", "Blue planet pilot", "Moon rover"] as const;
export type AvatarStyle = 0 | 1 | 2;
export type PortfolioTab = "projects" | "experience" | "notes";
export type BadgeId = "rocket" | "trophy" | "dish" | "star" | "compass" | "shield";
export type CoverStyle = "hub" | "map" | "notebook";

export interface ProfileInfo extends StudentSession {
  university: string;
  bio: string;
  github: string;
  linkedin: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  category: string;
  summary: string;
  cover: CoverStyle;
  demoUrl: string;
  codeUrl: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  year: string;
  summary: string;
  icon: "team" | "club" | "design";
}

export interface NoteEntry {
  id: string;
  title: string;
  category: string;
  paragraphs: string[];
  minutes: number;
}

export interface StudentPortfolio {
  version: 1;
  info: ProfileInfo;
  avatar: AvatarStyle;
  addedProjects: ProjectEntry[];
  addedExperience: ExperienceEntry[];
  addedNotes: NoteEntry[];
  projectLinks: Record<string, string>;
}

export const PROFILE_BRANCHES = ["CSE / Data Science", "ECE / Embedded", "Mechanical / Aero", "Other STEM"];
export const PROFILE_YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export function initialPortfolio(session: StudentSession = DEFAULT_SESSION): StudentPortfolio {
  return {
    version: 1,
    info: {
      name: session.name,
      branch: session.branch,
      year: session.year,
      university: "Malla Reddy University, Hyderabad",
      bio: "Building satellite data apps, web platforms, and learning how software powers space missions.",
      github: "",
      linkedin: "",
    },
    avatar: 0,
    addedProjects: [],
    addedExperience: [],
    addedNotes: [],
    projectLinks: {},
  };
}

export function degreeLabel(branch: string) {
  if (branch.startsWith("CSE")) return "B.Tech CSE (Data Science)";
  if (branch.startsWith("ECE")) return "B.Tech ECE (Embedded)";
  if (branch.startsWith("Mech")) return "B.Tech Mechanical / Aero";
  return branch;
}

export interface MilestoneBadge {
  id: BadgeId;
  title: string;
  unlocked: boolean;
  status: string;
  description: string;
  nextStep: string;
  progress: number;
}

export const BADGES: MilestoneBadge[] = [
  {
    id: "rocket", title: "First Project Shipped", unlocked: true, status: "Unlocked", progress: 100,
    description: "You shared your first working project: the Cosmox Student Space Career Hub. Other students can open the demo and see what you built.",
    nextStep: "Keep a screenshot and a short note about the part you worked on. They make your project easier to explain.",
  },
  {
    id: "trophy", title: "Hackathon Builder", unlocked: true, status: "Unlocked", progress: 100,
    description: "You participated in a national space hackathon. At the Bharatiya Antariksh Hackathon, you helped your team choose a problem and put together a demo.",
    nextStep: "Add the demo and a sentence about your own contribution to your portfolio.",
  },
  {
    id: "dish", title: "Satellite Data Starter", unlocked: true, status: "Unlocked", progress: 100,
    description: "You used free satellite images in the Telangana Flood & Crop Monitor. Your map shows how water and farmland change between two dates.",
    nextStep: "Include the image dates and explain one change you can see on the map.",
  },
  {
    id: "star", title: "5 Hackathons Club", unlocked: false, status: "2/5 Completed", progress: 40,
    description: "You have completed two of the five hackathons for this badge.",
    nextStep: "Finish three more hackathons. For each one, keep the event name, your role and a link to your team's submission.",
  },
  {
    id: "compass", title: "10 Workshops Streak", unlocked: false, status: "4/10 Completed", progress: 40,
    description: "You have taken part in four hands-on workshops. Each workshop is another chance to try a new skill.",
    nextStep: "Complete six more workshops. Save one example of what you made or learned at each session.",
  },
  {
    id: "shield", title: "Track Finisher", unlocked: false, status: "50% Done", progress: 50,
    description: "You have finished half of your starter career track.",
    nextStep: "Share your project on GitHub with a clear README, then shortlist and apply for an internship that fits your year.",
  },
];

export const SEED_PROJECTS: ProjectEntry[] = [
  {
    id: "cosmox-hub", title: "Cosmox \u2014 Student Space Career Hub", category: "Web App \u2022 React & Supabase",
    summary: "One place to find space internships, plan your next project and meet student builders.",
    cover: "hub", demoUrl: "#/app", codeUrl: "",
  },
  {
    id: "telangana-monitor", title: "Telangana Flood & Crop Monitor", category: "Satellite Data \u2022 Python & Sentinel-2",
    summary: "A before-and-after map of floodwater and farmland using free satellite images.",
    cover: "map", demoUrl: "", codeUrl: "",
  },
];

export const SEED_EXPERIENCE: ExperienceEntry[] = [
  {
    id: "space-hackathon", organization: "Bharatiya Antariksh Hackathon", role: "Team Builder", year: "2026", icon: "team",
    summary: "Brought students from different branches together to build and present a satellite mapping project.",
  },
  {
    id: "university-club", organization: "University Tech Club", role: "Event & Design Coordinator", year: "2026", icon: "club",
    summary: "Designed event posters and helped run beginner-friendly workshops for students on campus.",
  },
  {
    id: "freelance-design", organization: "Independent projects", role: "Freelance Web Designer & Developer", year: "2026", icon: "design",
    summary: "Designed and built responsive websites for small teams, from the first sketch to a working page.",
  },
];

export const SEED_NOTES: NoteEntry[] = [
  {
    id: "learning-maps", title: "How I Started Learning Satellite Maps as a 2nd-Year CSE Student", category: "Learning notes", minutes: 3,
    paragraphs: [
      "I started with a lake I knew near Hyderabad. It was much easier to understand a satellite picture when I could recognise the roads and water in it.",
      "I opened two free Sentinel-2 images from different dates. Before writing any Python, I put them side by side and marked what looked different. Clouds and shadows can look like water, so I left a note wherever I wasn't sure.",
      "My first script only opened the images and drew the same small area from each one. That was enough for a first project. I saved the dates, the data source and a screenshot in the README.",
      "If you're starting out, pick one place and one question. A map you can explain is a better starting point than a big app you can't finish.",
    ],
  },
  {
    id: "free-datasets", title: "5 Free Space Datasets Any Student Can Use Today", category: "Student resources", minutes: 3,
    paragraphs: [
      "You don't need a paid subscription to start a space data project. These five datasets are useful for different kinds of questions.",
      "1. Sentinel-2: compare pictures of farms, forests or lakes in the Copernicus Browser. Pick two cloud-free dates to get started.",
      "2. Landsat: use the long image history in USGS EarthExplorer to see how your city has grown over time.",
      "3. SRTM elevation: turn height measurements into a simple hill map. Compare high and low parts of a familiar district.",
      "4. VIIRS night lights: compare light patterns in two cities. Remember that brightness alone doesn't tell you how many people live there.",
      "5. ESA WorldCover: see which parts of an area are labelled as trees, crops, water or buildings. Compare the labels with places you know.",
      "Start with a small area. Keep the dataset name, date and usage terms beside your results so someone else can repeat your work.",
    ],
  },
];

export const MAP_SOURCE = `# Compare the water signal in matching Sentinel-2 image bands.
# Use cloud-free, aligned green (B03) and near-infrared (B08) images.
import numpy as np
import rasterio

with rasterio.open("green.tif") as green_file:
    green = green_file.read(1, masked=True).astype("float32")
    output = green_file.profile.copy()
with rasterio.open("near_infrared.tif") as nir_file:
    nir = nir_file.read(1, masked=True).astype("float32")

water_index = np.ma.divide(green - nir, green + nir)
output.update(dtype="float32", count=1, nodata=-9999)
with rasterio.open("water_index.tif", "w", **output) as result:
    result.write(water_index.filled(-9999), 1)
`;