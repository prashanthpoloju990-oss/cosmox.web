export interface EventItem {
  id: string;
  trackTag: string;
  title: string;
  branches: string;
  dateBadge: string;
  formatPill: "ONLINE LIVE" | "HYDERABAD + STREAM";
  seatsTotal: number;
  seatsFilled: number;
  summary: string;
  image: {
    url: string;
    alt: string;
    schematicOverlay: string;
  };
  duration: string;
  instructor: string;
}

export interface EventJudge {
  name: string;
  role: string;
  expertise: string;
  photo: string;
  featured?: boolean;
}

export interface EventPerk {
  title: string;
  body: string;
  icon: "mentorship" | "certificate" | "fasttrack" | "grants";
}

export interface EventRound {
  name: string;
  window: string;
  detail: string;
  upNext?: boolean;
}

export interface EventDetailInfo {
  heroTag: string;
  headline: string;
  summaryLine: string;
  price: string;
  priceNote: string;
  seatBadge: string;
  facts: {
    date: string;
    location: string;
    teamSize: string;
    eligibility: string;
    deadline: string;
  };
  about: [string, string];
  perks: EventPerk[];
  rounds: EventRound[];
  judges: EventJudge[];
}

export const EVENTS: EventItem[] = [
  {
    id: "evt-01",
    trackTag: "FLIGHT SW // SPRINT 01",
    title: "CubeSat Telemetry Decoder Sprint",
    branches: "CSE / ECE",
    dateBadge: "DEC 06 • 19:00 IST",
    formatPill: "ONLINE LIVE",
    seatsTotal: 50,
    seatsFilled: 42,
    summary:
      "Hands-on Python packet parsing from raw SDR downlinks into a live Grafana dashboard.",
    image: {
      url: "https://images.pexels.com/photos/18471567/pexels-photo-18471567.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "Avionics oscilloscope measuring high frequency signals",
      schematicOverlay: "FREQ 437.450 MHz // AX.25 GFSK",
    },
    duration: "2.5 HOURS",
    instructor: "EX-ISRO TELEMETRY FELLOW",
  },
  {
    id: "evt-02",
    trackTag: "EO-AI // LAB 03",
    title: "Satellite Imagery ML With Bhuvan Data",
    branches: "CSE-DS / AI",
    dateBadge: "DEC 13 • 17:30 IST",
    formatPill: "ONLINE LIVE",
    seatsTotal: 50,
    seatsFilled: 38,
    summary:
      "Crop classification & urban heat island detection using ISRO Bhuvan open multispectral tiles.",
    image: {
      url: "https://images.pexels.com/photos/60132/pexels-photo-60132.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      alt: "Satellite view of Earth coastline and ocean",
      schematicOverlay: "BANDS: NIR • RED • SWIR // NDVI",
    },
    duration: "3.0 HOURS",
    instructor: "EARTH-OBSERVATION ML RESEARCHER",
  },
  {
    id: "evt-03",
    trackTag: "COMMUNITY // MEETUP 02",
    title: "Hyderabad Space-Tech Builder Meetup",
    branches: "ALL BRANCHES",
    dateBadge: "DEC 20 • 11:00 IST",
    formatPill: "HYDERABAD + STREAM",
    seatsTotal: 80,
    seatsFilled: 74,
    summary:
      "Live roadmap reviews, hardware teardown showcases, and national hackathon squad pairing.",
    image: {
      url: "https://images.pexels.com/photos/12467595/pexels-photo-12467595.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      alt: "Space rocket gantry launchpad engineering",
      schematicOverlay: "T-HUB HYD // SQUAD LAB IN-PERSON",
    },
    duration: "FULL DAY",
    instructor: "COSMOX SQUAD LEADS & FOUNDERS",
  },
];

const judge = (
  name: string,
  role: string,
  expertise: string,
  photo: string,
  featured = false,
): EventJudge => ({ name, role, expertise, photo, featured });

export const EVENT_DETAILS: Record<string, EventDetailInfo> = {
  "evt-01": {
    heroTag: "STUDENT SPRINT • ONLINE LIVE • 2.5 HOURS",
    headline: "CubeSat Telemetry Decoder Sprint",
    summaryLine:
      "Decode real satellite packets with Python and put the readings on a live dashboard — in one evening.",
    price: "FREE FOR STUDENTS",
    priceNote: "No hidden charges. Tool kit and recording included.",
    seatBadge: "LIMITED TO 50 SEATS",
    facts: {
      date: "Sat, Dec 6 · 19:00–21:30 IST",
      location: "Online · Zoom + shared repo",
      teamSize: "Solo or pairs (1–2 members)",
      eligibility: "Open to all B.Tech years",
      deadline: "Dec 4, 2026 · 23:59 IST",
    },
    about: [
      "In this sprint you will take a real packet stream recorded from a small satellite and write Python code that reads it, checks it, and turns it into clean numbers on a dashboard. No prior satellite experience is needed — the starter kit includes sample data, a worked example, and a mentor on call for the full 2.5 hours.",
      "This event is built for 1st–4th year CSE and ECE students. You can join alone or with one friend. Everyone leaves with working code, a short written review from a mentor, and a clear next step for your GitHub portfolio.",
    ],
    perks: [
      { title: "Real Mentorship from Space Engineers", body: "A mentor reviews your parser line-by-line and answers questions live.", icon: "mentorship" },
      { title: "Verified Project Certificate", body: "A signed certificate you can add to your resume and LinkedIn.", icon: "certificate" },
      { title: "Internship Fast-Track Interviews", body: "Top sprint results get referred to partner startup hiring rounds.", icon: "fasttrack" },
      { title: "Cash & Hardware Grants", body: "Three SDR starter kits (₹4,500 value each) for the best builds.", icon: "grants" },
    ],
    rounds: [
      { name: "Round 1: Idea & Team Registration", window: "DEC 02 · ONLINE", detail: "Sign up, install the starter kit, and run the example script so your laptop is ready.", upNext: true },
      { name: "Round 2: 2.5-Hour Build Sprint", window: "DEC 06 · 19:00 IST", detail: "Parse the packet stream live, handle bad readings, and ship your dashboard." },
      { name: "Round 3: Live Demo Day & Judging", window: "DEC 06 · 21:00 IST", detail: "Show your dashboard in 3 minutes and get written feedback from the mentors." },
    ],
    judges: [
      judge("Dr. Meera Nair", "Ex-ISRO Scientist", "Ground systems & packet standards", "/images/judges/j1.jpg", true),
      judge("Arjun Kulkarni", "Flight Software Lead • Skyroot", "Python tooling & code reviews", "/images/judges/j2.jpg"),
      judge("Priya Deshmukh", "Avionics Engineer • Dhruva Space", "Embedded data formats", "/images/judges/j4.jpg"),
      judge("Rahul Menon", "Mission Ops Mentor • Digantara", "Ops runbooks & calm debugging", "/images/judges/j6.jpg"),
    ],
  },
  "evt-02": {
    heroTag: "STUDENT LAB • ONLINE LIVE • BHUVAN DATA",
    headline: "Satellite Imagery ML With Bhuvan Data",
    summaryLine:
      "Train a small model on free ISRO Bhuvan satellite tiles to spot crops, water, and city heat.",
    price: "₹199 STUDENT PASS",
    priceNote: "Covers compute credits and the certificate. Refundable if you attend.",
    seatBadge: "LIMITED TO 50 SEATS",
    facts: {
      date: "Sat, Dec 13 · 17:30–20:30 IST",
      location: "Online · Colab notebooks",
      teamSize: "Teams of 2–4 members",
      eligibility: "Open to all B.Tech years",
      deadline: "Dec 10, 2026 · 23:59 IST",
    },
    about: [
      "You will work with real multispectral tiles from ISRO's open Bhuvan portal. Step by step, your team will clean the images, label a small area, and train a beginner-friendly model that separates crops, water, and built-up land — then test it on a second city.",
      "The lab is designed for CSE, Data Science, and AI-curious students from any year, and welcomes mixed teams with ECE or Mechanical friends who want to see how satellite data is used. All code runs in free cloud notebooks, so any laptop works.",
    ],
    perks: [
      { title: "Real Mentorship from Space Engineers", body: "An earth-observation researcher sits with your team during training.", icon: "mentorship" },
      { title: "Verified Project Certificate", body: "A lab-completion certificate naming the datasets and methods you used.", icon: "certificate" },
      { title: "Internship Fast-Track Interviews", body: "Two partner teams shortlist lab winners for data intern interviews.", icon: "fasttrack" },
      { title: "Cash & Hardware Grants", body: "₹10,000 prize pool plus cloud compute credits for follow-up work.", icon: "grants" },
    ],
    rounds: [
      { name: "Round 1: Idea & Team Registration", window: "DEC 09 · ONLINE", detail: "Form your 2–4 member team, pick a study area, and get Bhuvan access working.", upNext: true },
      { name: "Round 2: 3-Hour Model Lab", window: "DEC 13 · 17:30 IST", detail: "Label tiles, train your first model, and compare results across two cities." },
      { name: "Round 3: Live Demo Day & Judging", window: "DEC 13 · 20:00 IST", detail: "Present your map and accuracy numbers; judges pick the top three teams." },
    ],
    judges: [
      judge("Sana Reddy", "Satellite Data Lead • Pixxel", "EO-ML models & data quality", "/images/judges/j5.jpg", true),
      judge("Dr. Meera Nair", "Ex-ISRO Scientist", "Remote sensing workflows", "/images/judges/j1.jpg"),
      judge("Vikram Rao", "Hardware Systems Architect", "Field validation & maps", "/images/judges/j3.jpg"),
      judge("Arjun Kulkarni", "Flight Software Lead • Skyroot", "Notebook pipelines", "/images/judges/j2.jpg"),
    ],
  },
  "evt-03": {
    heroTag: "COMMUNITY MEETUP • HYBRID • HYDERABAD",
    headline: "Hyderabad Space-Tech Builder Meetup",
    summaryLine:
      "A full-day, in-person meetup with roadmap reviews, hardware teardowns, and live squad pairing.",
    price: "FREE FOR STUDENTS",
    priceNote: "Entry with any valid college ID. Lunch and stream access included.",
    seatBadge: "LIMITED TO 80 SEATS",
    facts: {
      date: "Sun, Dec 20 · 11:00–17:00 IST",
      location: "T-Hub, Hyderabad + live stream",
      teamSize: "Individual entry (squads formed on site)",
      eligibility: "Open to all B.Tech years & branches",
      deadline: "Dec 17, 2026 · 23:59 IST",
    },
    about: [
      "This is the easiest way to meet other space-curious students in Hyderabad. The morning has short talks and one-to-one roadmap reviews with working engineers. The afternoon is hands-on: hardware teardown tables, live demos from student teams, and structured squad pairing for the national hackathons coming up in January.",
      "Everyone is welcome — 1st to 4th year, CSE, ECE, Mechanical, Aero, or any STEM branch. You do not need a project to attend; several squads at this meetup are reserved for first-time builders.",
    ],
    perks: [
      { title: "Real Mentorship from Space Engineers", body: "Book a 15-minute roadmap review with an engineer from a space startup.", icon: "mentorship" },
      { title: "Verified Project Certificate", body: "An attendance certificate counting toward the 10-workshops badge.", icon: "certificate" },
      { title: "Internship Fast-Track Interviews", body: "Recruiters from three Hyderabad startups collect resumes on site.", icon: "fasttrack" },
      { title: "Cash & Hardware Grants", body: "Two mini-grants (₹5,000 each) for squads formed at the meetup.", icon: "grants" },
    ],
    rounds: [
      { name: "Round 1: Talks & Roadmap Reviews", window: "DEC 20 · 11:00 IST", detail: "Two short talks, then one-to-one roadmap reviews with engineers.", upNext: true },
      { name: "Round 2: Hardware Teardown Showcase", window: "DEC 20 · 14:00 IST", detail: "Student teams demo and open up their builds at shared workbenches." },
      { name: "Round 3: Squad Pairing & Follow-ups", window: "DEC 20 · 16:30 IST", detail: "Structured matching for January hackathons, plus contact exchange." },
    ],
    judges: [
      judge("Vikram Rao", "Hardware Systems Architect", "Structures, thermal & integration", "/images/judges/j3.jpg", true),
      judge("Sana Reddy", "Satellite Data Lead • Pixxel", "From images to decisions", "/images/judges/j5.jpg"),
      judge("Priya Deshmukh", "Avionics Engineer • Dhruva Space", "Boards, radios & testing", "/images/judges/j4.jpg"),
      judge("Rahul Menon", "Mission Ops Mentor • Digantara", "Building calm, focused teams", "/images/judges/j6.jpg"),
    ],
  },
};
