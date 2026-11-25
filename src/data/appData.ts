import { NEXT_LAUNCH } from "./news";

export const FOCUS_TITLE = "Satellite Data & Space Software";

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export const CHECKLIST: ChecklistItem[] = [
  { id: "c1", label: "Learn Python basics for space & map data", done: true },
  { id: "c2", label: "Build a small project tracking satellite passes", done: true },
  { id: "c3", label: "Upload your code to GitHub with a clear README", done: false },
  { id: "c4", label: "Apply for summer space-tech internships", done: false },
];

export interface EventPreview {
  id: string;
  month: string;
  day: string;
  title: string;
  format: "Online" | "Hyderabad";
}

export const EVENTS_PREVIEW: EventPreview[] = [
  { id: "e1", month: "DEC", day: "06", title: "National Space Hackathon", format: "Online" },
  { id: "e2", month: "DEC", day: "18", title: "Beginner Satellite Coding Workshop", format: "Online" },
  { id: "e3", month: "JAN", day: "10", title: "Hyderabad Student Space Meetup", format: "Hyderabad" },
];

export interface InternshipPreview {
  id: string;
  title: string;
  org: string;
  tags: string[];
}

export const INTERNSHIP_PREVIEW: InternshipPreview[] = [
  {
    id: "i1",
    title: "ISRO 45-Day Internship",
    org: "Indian Space Research Organisation",
    tags: ["Min. 60% / 6.32 CGPA", "Open for 2nd & 3rd Year"],
  },
  {
    id: "i2",
    title: "Space Startup Intern Window",
    org: "Skyroot • Dhruva Space • Pixxel",
    tags: ["Open for 2nd & 3rd Year", "Project portfolio"],
  },
];

export const LATEST_UPDATE = {
  image: NEXT_LAUNCH.image,
  alt: NEXT_LAUNCH.imageAlt,
};

/** Same launch as the featured card on the Space News screen, so both countdowns match. */
export const NEXT_LAUNCH_AT = NEXT_LAUNCH.launchAt;
