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
  ml: [
    "Pandas: Load & Profile a CSV",
    "Data Cleaning & Missing Values",
    "Exploratory Plots with Matplotlib",
    "Feature Scaling & Encoding",
    "Train/Test Splits Done Right",
    "Linear Regression from Scratch",
    "Logistic Regression Classifier",
    "Confusion Matrix & Metrics",
    "Cross Validation",
    "Decision Trees",
    "Random Forests & Feature Importance",
    "Gradient Boosting Basics",
    "Unsupervised: K-Means",
    "Dimensionality Reduction with PCA",
    "NLP: Bag of Words & TF-IDF",
    "Intro to Neural Networks",
    "Training a CNN on Images",
    "Transfer Learning",
    "Model Serialisation & Inference API",
    "Deploy Your Model",
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

const PHASES = ["Foundations", "Applied", "Advanced"] as const;

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

const RESOURCES: Record<string, { label: string; url: string }[]> = {
  fullstack: [
    { label: "MDN Web Docs", url: "https://developer.mozilla.org" },
    { label: "Full Stack roadmap", url: "https://roadmap.sh/full-stack" },
    { label: "Reference repo", url: "https://github.com" },
  ],
  dsa: [
    { label: "NeetCode patterns", url: "https://neetcode.io" },
    { label: "DSA roadmap", url: "https://roadmap.sh/datastructures-and-algorithms" },
    { label: "Practice set", url: "https://leetcode.com" },
  ],
  ml: [
    { label: "scikit-learn docs", url: "https://scikit-learn.org" },
    { label: "AI/ML roadmap", url: "https://roadmap.sh/ai-data-scientist" },
    { label: "Kaggle datasets", url: "https://kaggle.com" },
  ],
  appdev: [
    { label: "React Native docs", url: "https://reactnative.dev" },
    { label: "Android roadmap", url: "https://roadmap.sh/android" },
    { label: "Reference repo", url: "https://github.com" },
  ],
};

export const CURRENT_DAY = 12;
const MISSED_DAYS = [4, 9];

function statusFor(day: number): DayStatus {
  if (day === CURRENT_DAY) return "in-progress";
  if (day > CURRENT_DAY) return "upcoming";
  if (MISSED_DAYS.includes(day)) return "missed";
  return "completed";
}

export const DEFAULT_TRACK_ID = "fullstack";

const cache = new Map<string, ChallengeDay[]>();

/** 60 mock days generated for one specific track. */
export function buildDaysForTrack(trackIdRaw?: string): ChallengeDay[] {
  const trackId = trackIdRaw && TITLES[trackIdRaw] ? trackIdRaw : DEFAULT_TRACK_ID;
  const cached = cache.get(trackId);
  if (cached) return cached;

  const track = TRACKS.find((t) => t.id === trackId)!;
  const titles = TITLES[trackId]!;

  const days = Array.from({ length: 60 }, (_, i) => {
    const day = i + 1;
    const phase = PHASES[Math.floor(i / 20)]!;
    const base = titles[i % 20]!;
    const title = i < 20 ? base : `${base} · ${phase}`;
    return {
      day,
      title,
      trackId,
      trackLabel: track.label,
      shortTask: `Build and push: ${base.toLowerCase()}. Keep it small, keep it shipped.`,
      detailedTask: `Today you will work through "${title}" end to end as part of the ${track.label} track. Start by scoping the smallest version that still works, then build it in one sitting. Commit at least three times with meaningful messages so your progress is readable. When it runs, write two lines in your README about what broke and how you fixed it — that becomes your LinkedIn post. Do not chase perfection; chase a working artifact you can link to.`,
      learningGoal: GOALS[i % GOALS.length]!,
      estimatedTime: TIMES[i % TIMES.length]!,
      difficulty: DIFFS[i % 3]!,
      resources: RESOURCES[trackId]!,
      status: statusFor(day),
    } satisfies ChallengeDay;
  });

  cache.set(trackId, days);
  return days;
}

export const CHALLENGE_DAYS: ChallengeDay[] = buildDaysForTrack(DEFAULT_TRACK_ID);

export const BADGES: Badge[] = [
  {
    id: "first-proof",
    label: "First Steps",
    icon: "sparkles",
    earned: false,
    description: "Submitted both proofs for your very first day.",
  },
  {
    id: "week-one",
    label: "Week Warrior",
    icon: "flame",
    earned: false,
    description: "Kept a 7-day streak alive.",
  },
  {
    id: "night-owl",
    label: "Night Owl",
    icon: "moon",
    earned: false,
    description: "Shipped proof on 3 different days.",
  },
  {
    id: "consistent",
    label: "Consistency Club",
    icon: "target",
    earned: false,
    description: "Completed 10 days of the challenge.",
  },
  {
    id: "half-way",
    label: "Halfway Hero",
    icon: "trophy",
    earned: false,
    description: "Reached 30 completed days — halfway there.",
  },
  {
    id: "finisher",
    label: "60/60 Finisher",
    icon: "crown",
    earned: false,
    description: "Completed all 60 days of the challenge.",
  },
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
