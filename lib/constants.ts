export const ROLES = ["user", "manager", "admin", "customer"] as const;
export type AppRole = (typeof ROLES)[number];
