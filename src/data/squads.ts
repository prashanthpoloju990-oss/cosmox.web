export type SquadTab = "builder" | "review";

export interface SquadMember {
  id: string;
  name: string;
  initials: string;
  branch: string;
  year: string;
  skills: string;
  tone: "orange" | "cobalt" | "teal";
}

export const SQUAD_MEMBERS: SquadMember[] = [
  {
    id: "prashanth",
    name: "Prashanth",
    initials: "P",
    branch: "CSE / Data Science",
    year: "2nd Year",
    skills: "Python & Satellite Maps",
    tone: "orange",
  },
  {
    id: "ananya",
    name: "Ananya R.",
    initials: "AR",
    branch: "ECE",
    year: "3rd Year",
    skills: "Sensors & Embedded C",
    tone: "cobalt",
  },
  {
    id: "karthik",
    name: "Karthik V.",
    initials: "KV",
    branch: "Mechanical",
    year: "2nd Year",
    skills: "3D CAD & Structures",
    tone: "teal",
  },
];

export const OPEN_SQUAD_ROLE = "Open Seat: Frontend / UI";

export const SQUAD_HEADER = {
  event: "Bharatiya Antariksh Hackathon",
  format: "Team of 4",
  tag: "1 spot open",
};

export interface ProjectReview {
  id: string;
  name: string;
  initials: string;
  branch: string;
  note: string;
  time: string;
  tone: "orange" | "cobalt" | "teal";
}

export const PROJECT_REVIEWS: ProjectReview[] = [
  {
    id: "ananya",
    name: "Ananya R.",
    initials: "AR",
    branch: "ECE • 3rd Year",
    note: "Try adding NDWI water-index thresholding to sharpen flood edges.",
    time: "2H AGO",
    tone: "cobalt",
  },
  {
    id: "karthik",
    name: "Karthik V.",
    initials: "KV",
    branch: "Mechanical • 2nd Year",
    note: "Clean GitHub README—ready for startup internship applications!",
    time: "YESTERDAY",
    tone: "teal",
  },
];

export const PROJECT_PREVIEW = {
  title: "Telangana Flood & Crop Monitor",
  version: "v1.0",
  stack: "Python + Sentinel-2 Data",
  summary: "A before-and-after map of floodwater and farmland using free satellite images.",
  metrics: [
    { label: "Images compared", value: "12" },
    { label: "Districts mapped", value: "04" },
    { label: "Repo", value: "Public" },
  ],
};
