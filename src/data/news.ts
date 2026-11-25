export type NewsTag = "launches" | "isro" | "startups" | "datasets";
export type NewsFilter = "all" | NewsTag;

export const NEWS_FILTERS: { id: NewsFilter; label: string }[] = [
  { id: "all", label: "All Updates" },
  { id: "launches", label: "Live Launches" },
  { id: "isro", label: "ISRO & India" },
  { id: "startups", label: "Space Startups" },
  { id: "datasets", label: "Free Datasets" },
];

export const TAG_LABEL: Record<NewsTag, string> = {
  launches: "Live Launches",
  isro: "ISRO & India",
  startups: "Space Startups",
  datasets: "Free Datasets",
};

const photo = (path: string, w = 1200, h = 700) =>
  `https://images.pexels.com/photos/${path}?auto=compress&cs=tinysrgb&fit=crop&h=${h}&w=${w}`;

/* ── Launches ─────────────────────────────────────────────── */

export interface Launch {
  id: string;
  short: string;
  title: string;
  agency: string;
  summary: string;
  /** Epoch ms. Set relative to page load so sample launches always count down. */
  launchAt: number;
  tags: NewsTag[];
  image: string;
  imageAlt: string;
  facts: { label: string; value: string }[];
  watchFor: { title: string; body: string }[];
  watchUrl: string;
  watchLabel: string;
}

const LOADED_AT = Date.now();
const offset = (days: number, hours: number, minutes: number, seconds: number) =>
  LOADED_AT + (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000;

export const LAUNCHES: Launch[] = [
  {
    id: "pslv-c62",
    short: "ISRO PSLV-C62",
    title: "PSLV-C62 Earth Observation Mission",
    agency: "ISRO • Sriharikota",
    summary: "Carrying an Indian coastal-monitoring satellite into low Earth orbit.",
    launchAt: offset(3, 14, 22, 45),
    tags: ["launches", "isro"],
    image: photo("12467595/pexels-photo-12467595.jpeg", 1100, 900),
    imageAlt: "A rocket standing on its launch pad against a clear blue sky",
    facts: [
      { label: "Rocket", value: "PSLV, ISRO's most-used rocket" },
      { label: "Launch site", value: "Satish Dhawan Space Centre, Sriharikota" },
      { label: "Carrying", value: "A satellite that watches India's coastline" },
      { label: "Going to", value: "About 500 km above Earth" },
    ],
    watchFor: [
      { title: "Liftoff", body: "The rocket rises off the pad. The first 2 minutes are the loudest part." },
      { title: "Stages drop away", body: "Empty fuel sections fall off so the rocket gets lighter and faster." },
      { title: "Satellite released", body: "About 18 minutes in, the satellite separates and starts its own journey." },
    ],
    watchUrl: "https://www.isro.gov.in/",
    watchLabel: "Watch on ISRO's site",
  },
  {
    id: "vikram-1-test",
    short: "Skyroot Vikram-1 Test",
    title: "Vikram-1 Full Rocket Test Flight",
    agency: "Skyroot • Sriharikota",
    summary: "A Hyderabad startup testing its first orbit-class rocket built in India.",
    launchAt: offset(18, 6, 40, 10),
    tags: ["launches", "isro", "startups"],
    image: photo("7327336/pexels-photo-7327336.jpeg", 1100, 900),
    imageAlt: "A rocket climbing into a bright sky, leaving a long trail of smoke",
    facts: [
      { label: "Rocket", value: "Vikram-1, made by Skyroot" },
      { label: "Launch site", value: "Sriharikota, with ISRO's help" },
      { label: "Carrying", value: "Small test satellites from student and startup teams" },
      { label: "Going to", value: "About 500 km above Earth" },
    ],
    watchFor: [
      { title: "3D-printed engines", body: "Parts of the engine are 3D-printed, which saves time and money." },
      { title: "Carbon body", body: "A light carbon-fibre body lets a small rocket carry more." },
      { title: "Test results", body: "Even a partial success teaches the team what to fix next." },
    ],
    watchUrl: "https://skyroot.in/",
    watchLabel: "Visit Skyroot's site",
  },
  {
    id: "starlink-group",
    short: "SpaceX Starlink Group",
    title: "Starlink Internet Satellites Batch",
    agency: "SpaceX • Florida, USA",
    summary: "A reusable rocket placing a batch of internet satellites around Earth.",
    launchAt: offset(6, 2, 15, 30),
    tags: ["launches"],
    image: photo("15061963/pexels-photo-15061963.jpeg", 1100, 900),
    imageAlt: "A rocket launch facility lit up at night in thick fog",
    facts: [
      { label: "Rocket", value: "Falcon 9, a reusable rocket" },
      { label: "Launch site", value: "Cape Canaveral, Florida" },
      { label: "Carrying", value: "Around 20 small internet satellites" },
      { label: "Going to", value: "About 550 km above Earth" },
    ],
    watchFor: [
      { title: "Booster landing", body: "The first stage flies back and lands upright so it can fly again." },
      { title: "Satellite stack", body: "The satellites are packed flat like a deck of cards." },
      { title: "Spreading out", body: "Over weeks they slowly move apart to cover more of the sky." },
    ],
    watchUrl: "https://www.spacex.com/launches/",
    watchLabel: "Watch on SpaceX's site",
  },
];

/* ── Articles ─────────────────────────────────────────────── */

export interface Article {
  id: string;
  category: Exclude<NewsTag, "launches">;
  tags: NewsTag[];
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  readMins: number;
  publishedDaysAgo: number;
  why: { audience: string; text: string };
  body: [string, string, string];
  takeaways: string[];
  links?: { label: string; url: string; note: string }[];
}

export const ARTICLES: Article[] = [
  {
    id: "coastal-satellite",
    category: "isro",
    tags: ["isro", "datasets"],
    title: "ISRO's new satellite will keep watch over India's coastline",
    summary:
      "The satellite flying on PSLV-C62 will photograph beaches, ports and fishing waters every few days, and much of its data will be free to use.",
    image: photo("60132/pexels-photo-60132.jpeg"),
    imageAlt: "A satellite flying high above a coastline, with the sea and land below",
    readMins: 3,
    publishedDaysAgo: 1,
    why: {
      audience: "Good for CSE/Data Science",
      text: "Free satellite images from this mission will be open for student ML projects.",
    },
    body: [
      "India has a coastline of more than 7,500 km. Fishing towns, busy ports and growing cities all depend on it, and the shoreline keeps changing with storms and rising seas. The new satellite on PSLV-C62 is built to photograph these coastal areas again and again, so changes can be spotted early.",
      "The satellite carries cameras that see colours our eyes cannot, such as near-infrared light. That makes it easier to tell healthy mangrove forests from damaged ones, or clean water from polluted water. Pictures of the same place are taken every few days.",
      "ISRO usually shares data from its Earth-watching satellites through its own portals after launch. That means students can download real images of their home state and build projects with them, without paying for anything.",
    ],
    takeaways: [
      "Satellites see extra colours like near-infrared, which helps spot plant health and water quality.",
      "Repeated photos of the same place let you measure change over time.",
      "Free ISRO data is a strong base for a final-year or hackathon project.",
    ],
  },
  {
    id: "hyderabad-startups",
    category: "startups",
    tags: ["startups", "isro"],
    title: "Hyderabad's space startups are opening more student internships",
    summary:
      "Rocket and satellite companies in Hyderabad are growing their teams and taking interns from Mechanical, ECE and CSE branches.",
    image: photo("34007252/pexels-photo-34007252.jpeg"),
    imageAlt: "Two engineers working together on electronics at a workbench",
    readMins: 4,
    publishedDaysAgo: 3,
    why: {
      audience: "Good for Mechanical & ECE",
      text: "Startups care more about what you have built than your marks — a small hardware project can get you noticed.",
    },
    body: [
      "Hyderabad has become one of India's busiest cities for space startups. Companies like Skyroot Aerospace build rockets, while Dhruva Space builds small satellites and the parts that hold them together. Both have grown quickly since India opened space work to private companies.",
      "As these teams grow, they need help with design, testing and software. Many now run internships for students in their 2nd year and above. Mechanical students help with 3D models and testing, ECE students work on circuit boards, and CSE students write the software that controls satellites.",
      "Unlike large companies, startups often look at your projects first. A working Arduino build, a clean 3D model or a GitHub project you can explain clearly can matter as much as your CGPA.",
    ],
    takeaways: [
      "Hyderabad is home to rocket and satellite startups that hire interns.",
      "All three core branches — Mechanical, ECE and CSE — have a place in a space startup.",
      "A small project you can demo is often your strongest application.",
    ],
  },
  {
    id: "bengaluru-ai-images",
    category: "startups",
    tags: ["startups"],
    title: "How Bengaluru startups use AI to read satellite photos",
    summary:
      "Teams in Bengaluru train computer programs to spot farms, water and new buildings in satellite pictures — and they need coders who understand the basics.",
    image: photo("972942/pexels-photo-972942.jpeg"),
    imageAlt: "An aerial photo of farmland meeting the sea, with clear field patterns",
    readMins: 3,
    publishedDaysAgo: 5,
    why: {
      audience: "Good for CSE/Data Science",
      text: "If you know Python and some basic ML, satellite image work is one of the easiest ways into the space industry.",
    },
    body: [
      "A single satellite can take thousands of photos a day — far too many for people to check by hand. Bengaluru startups such as Pixxel are solving this by teaching computers to look at the pictures and pick out useful things, like which fields have healthy crops.",
      "This is the same kind of AI used to recognise faces or objects in phone photos. The program is shown many labelled examples — 'this is a farm', 'this is water' — until it can label new images on its own. The space part is mostly the data, not the code.",
      "For students, this is good news. You do not need a rocket science degree to work here. Python, a few libraries for handling images, and a project that shows you can train a simple model are a strong start.",
    ],
    takeaways: [
      "Satellite image work is mostly regular Python and machine learning.",
      "Labelled examples are how a computer learns to tell farms from water.",
      "A small image-classification project on GitHub is a great portfolio piece.",
    ],
  },
  {
    id: "free-satellite-data",
    category: "datasets",
    tags: ["datasets", "isro"],
    title: "5 free places to get satellite images for your college project",
    summary:
      "You do not need to pay for space data. These free portals, including ISRO's own, let any student download real satellite images today.",
    image: photo("30596893/pexels-photo-30596893.png"),
    imageAlt: "A satellite orbiting above Earth with a deep blue ocean below",
    readMins: 3,
    publishedDaysAgo: 7,
    why: {
      audience: "Good for every branch",
      text: "Real data makes any project stronger — start with one portal and download images of your own city.",
    },
    body: [
      "Many students think satellite data is expensive or only for scientists. In fact, space agencies around the world give a huge amount of it away for free, because they want people to build useful things with it.",
      "India's own portals are a great place to begin. Bhuvan, run by ISRO's remote sensing centre in Hyderabad, has maps and images of the whole country. MOSDAC shares weather and ocean data from Indian satellites. For global images, Europe's Copernicus and NASA's Earthdata are free with a simple sign-up.",
      "Start small. Pick your home city, download two images taken a few years apart, and compare them. Even a simple project like 'how much did my city grow?' teaches you how this data works.",
    ],
    takeaways: [
      "Most satellite data from space agencies is free to download.",
      "Bhuvan and MOSDAC are ISRO's own portals for Indian data.",
      "Comparing two images of one place over time is a perfect first project.",
    ],
    links: [
      { label: "Bhuvan", url: "https://bhuvan.nrsc.gov.in/", note: "ISRO maps and images of India" },
      { label: "MOSDAC", url: "https://www.mosdac.gov.in/", note: "ISRO weather and ocean data" },
      { label: "Copernicus Data Space", url: "https://dataspace.copernicus.eu/", note: "Free European satellite images" },
      { label: "NASA Earthdata", url: "https://www.earthdata.nasa.gov/", note: "NASA's free Earth data" },
      { label: "USGS EarthExplorer", url: "https://earthexplorer.usgs.gov/", note: "Decades of Landsat images" },
    ],
  },
];

/* ── Helpers ──────────────────────────────────────────────── */

export function publishedLabel(daysAgo: number): string {
  const date = new Date(LOADED_AT - daysAgo * 86400000);
  return date
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

export function launchDateLabel(at: number): string {
  return new Date(at).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

export function splitCountdown(remainingMs: number): CountdownParts {
  const total = Math.max(0, Math.floor(remainingMs / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: total === 0,
  };
}

export function launchesSorted(): Launch[] {
  return [...LAUNCHES].sort((a, b) => a.launchAt - b.launchAt);
}

/** The soonest sample launch — shared with the Home dashboard countdown. */
export const NEXT_LAUNCH = launchesSorted()[0];
