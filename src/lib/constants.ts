// AmablexCTF Constants

export const APP_NAME = "AmablexCTF";
export const APP_DESCRIPTION = "Capture The Flag Competition Platform";

export const CATEGORIES = {
  web: { name: "Web", icon: "Globe", color: "category-web" },
  crypto: { name: "Crypto", icon: "Lock", color: "category-crypto" },
  pwn: { name: "Pwn", icon: "Terminal", color: "category-pwn" },
  forensic: { name: "Forensic", icon: "Search", color: "category-forensic" },
  osint: { name: "OSINT", icon: "Eye", color: "category-osint" },
  misc: { name: "Misc", icon: "Puzzle", color: "category-misc" },
} as const;

export const DIFFICULTIES = {
  easy: { name: "Easy", color: "difficulty-easy" },
  medium: { name: "Medium", color: "difficulty-medium" },
  hard: { name: "Hard", color: "difficulty-hard" },
  insane: { name: "Insane", color: "difficulty-insane" },
} as const;

export const FLAG_REGEX = /^AmablexCTF\{[\w\-!@#$%^&*()+=]+\}$/;

export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  CHALLENGES: "/challenges",
  CHALLENGE_DETAIL: "/challenges/:id",
  SCOREBOARD: "/scoreboard",
  TEAMS: "/teams",
  TEAM_DETAIL: "/teams/:id",
  PROFILE: "/profile",
  ADMIN: "/admin",
  ADMIN_CHALLENGES: "/admin/challenges",
  ADMIN_USERS: "/admin/users",
  ADMIN_TEAMS: "/admin/teams",
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_LOGS: "/admin/logs",
} as const;

export type CategorySlug = keyof typeof CATEGORIES;
export type DifficultyLevel = keyof typeof DIFFICULTIES;