export type DayStatus = "completed" | "in-progress" | "missed" | "upcoming";

export interface Student {
  id: string;
  name: string;
  college: string;
  track: string;
  trackId: string;
  startDate: string;
  currentDay: number;
  currentStreak: number;
  longestStreak: number;
  freezesAvailable: number;
  freezesUsed: number;
  totalCompleted: number;
  totalMissed: number;
  badges: Badge[];
  profileComplete: boolean;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  avatar?: string;
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  earned: boolean;
  description: string;
}

export interface ResourceLink {
  label: string;
  url: string;
}

export interface ChallengeDay {
  day: number;
  title: string;
  trackId: string;
  trackLabel: string;
  shortTask: string;
  detailedTask: string;
  learningGoal: string;
  estimatedTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  resources: ResourceLink[];
  status: DayStatus;
}

export interface Submission {
  day: number;
  githubUrl: string | null;
  githubSubmittedAt: string | null;
  linkedinUrl: string | null;
  linkedinSubmittedAt: string | null;
  complete: boolean;
}
