export const ROLES = ["user", "manager", "admin"] as const;
export type AppRole = (typeof ROLES)[number];
