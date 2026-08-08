import type { Badge, ChallengeDay, DayStatus, Student } from "./types";

export const TRACKS = [
  {
    id: "fullstack",
    label: "Full Stack Web Dev",
    blurb: "HTML to deployed APIs in 60 days.",
    day1: "Build a personal profile page with semantic HTML + Flexbox.",
  },
  {
    id: "dsa",
    label: "DSA",
    blurb: "Patterns, not memorisation.",
    day1: "Solve 3 array problems and explain your approach in comments.",
  },
  {
    id: "ml",
    label: "Machine Learning",
    blurb: "From pandas to a deployed model.",
    day1: "Load a CSV with pandas and write 5 insights about it.",
  },
  {
    id: "appdev",
    label: "Mobile / App Dev",
    blurb: "Ship a real app to a real phone.",
    day1: "Set up React Native and render your first custom screen.",
  },
] as const;

const TITLES: Record<string, string[]> = {
  fullstack: [
    "Semantic HTML Profile Page",
    "Flexbox Layout Drills",
    "CSS Grid Dashboard Shell",
    "Responsive Navbar",
    "JavaScript DOM Basics",
    "Fetch & Render an API",
    "Form Validation from Scratch",
    "LocalStorage To-Do App",
    "ES6 Modules Refactor",
    "Intro to React Components",
    "React State & Props",
    "Build a REST API with Express",
    "Express Middleware Deep Dive",
    "MongoDB CRUD Endpoints",
    "JWT Auth Flow",
    "React Router Multi-Page App",
    "Data Fetching with React Query",
    "Tailwind Design System",
    "File Uploads & Storage",
    "Deploy Your Full Stack App",
  ],
  dsa: [
    "Arrays: Two Pointers",
    "Sliding Window Patterns",
    "Hash Maps for O(n) Lookups",
    "Prefix Sums",
    "Strings & Palindromes",
    "Binary Search Basics",
    "Binary Search on Answers",
    "Sorting Algorithms by Hand",
    "Linked List Reversal",
    "Fast & Slow Pointers",
    "Stacks & Monotonic Stacks",
    "Queues & BFS Intuition",
    "Recursion Foundations",
    "Backtracking: N-Queens",
    "Trees: Traversals",
    "BST Operations",
    "Heaps & Top-K",
    "Graphs: DFS & BFS",
    "Dijkstra's Shortest Path",
    "Dynamic Programming Kickoff",
  ],
  appdev: [
    "React Native Setup & First Screen",
    "Styling with Flexbox on Mobile",
    "Navigation Between Screens",
    "Lists & Performance",
    "Forms & Keyboard Handling",
    "Device Storage",
    "Calling APIs on Mobile",
    "Camera & Permissions",
    "Push Notification Basics",
    "Animations with Reanimated",
    "Dark Mode Theming",
    "Offline-First Caching",
    "Gestures & Swipes",
    "Bottom Sheet UI",
    "Auth Screens",
    "Maps & Location",
    "Debugging on a Real Device",
    "App Icons & Splash Screens",
    "Performance Profiling",
    "Ship to TestFlight / Play Console",
  ],
};

const GOALS = [
  "Understand why structure beats styling early on.",
  "Middleware order matters more than you think.",
  "Naming things well is half of debugging.",
  "Small commits make big projects survivable.",
  "Reading docs is a skill you can practise.",
  "Edge cases are where real engineering starts.",
  "Ship something ugly today, refine it tomorrow.",
  "Explaining your code out loud finds your bugs.",
];

const TIMES = ["45 min", "1 hr", "1.5 hrs", "2 hrs"];
const DIFFS = ["Easy", "Medium", "Hard"] as const;

const TRACK_ORDER = ["fullstack", "dsa", "appdev"];

export const CURRENT_DAY = 12;
const MISSED_DAYS = [4, 9];

function statusFor(day: number): DayStatus {
  if (day === CURRENT_DAY) return "in-progress";
  if (day > CURRENT_DAY) return "upcoming";
  if (MISSED_DAYS.includes(day)) return "missed";
  return "completed";
}

export const CHALLENGE_DAYS: ChallengeDay[] = Array.from({ length: 60 }, (_, i) => {
  const day = i + 1;
  const trackId = TRACK_ORDER[Math.floor(i / 20)]!;
  const track = TRACKS.find((t) => t.id === trackId)!;
  const title = TITLES[trackId]![i % 20]!;
  return {
    day,
    title,
    trackId,
    trackLabel: track.label,
    shortTask: `Build and push: ${title.toLowerCase()}. Keep it small, keep it shipped.`,
    detailedTask: `Today you will work through "${title}" end to end. Start by scoping the smallest version that still works, then build it in one sitting. Commit at least three times with meaningful messages so your progress is readable. When it runs, write two lines in your README about what broke and how you fixed it — that becomes your LinkedIn post. Do not chase perfection; chase a working artifact you can link to.`,
    learningGoal: GOALS[i % GOALS.length]!,
    estimatedTime: TIMES[i % TIMES.length]!,
    difficulty: DIFFS[i % 3]!,
    resources: [
      { label: "MDN Web Docs", url: "https://developer.mozilla.org" },
      { label: `${track.label} roadmap`, url: "https://roadmap.sh" },
      { label: "Reference repo", url: "https://github.com" },
    ],
    status: statusFor(day),
  };
});

export const BADGES: Badge[] = [
  { id: "first-proof", label: "First Proof", icon: "sparkles", earned: true },
  { id: "week-one", label: "7-Day Streak", icon: "flame", earned: true },
  { id: "night-owl", label: "Night Owl", icon: "moon", earned: false },
  { id: "half-way", label: "Day 30 Club", icon: "trophy", earned: false },
  { id: "finisher", label: "60/60 Finisher", icon: "crown", earned: false },
];

export const STUDENT: Student = {
  id: "stu_2291",
  name: "Ananya Bhatt",
  college: "VIT Vellore",
  track: "Full Stack Web Dev",
  trackId: "fullstack",
  startDate: "2026-07-27",
  currentDay: CURRENT_DAY,
  currentStreak: 6,
  longestStreak: 8,
  freezesAvailable: 1,
  freezesUsed: 1,
  totalCompleted: 9,
  totalMissed: 2,
  badges: BADGES,
  profileComplete: false,
};
