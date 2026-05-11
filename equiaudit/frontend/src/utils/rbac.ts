const roleMatrix: Record<string, string[]> = {
  SUPER_ADMIN: ["*"],
  ORG_ADMIN: [
    "/dashboard",
    "/dashboard/models",
    "/dashboard/audits",
    "/dashboard/interventions",
    "/dashboard/reports",
    "/dashboard/alerts",
    "/dashboard/public-intelligence",
    "/dashboard/settings",
  ],
  ANALYST: [
    "/dashboard",
    "/dashboard/models",
    "/dashboard/audits",
    "/dashboard/reports",
    "/dashboard/alerts",
    "/dashboard/public-intelligence",
  ],
  AUDITOR: [
    "/dashboard",
    "/dashboard/audits",
    "/dashboard/reports",
    "/dashboard/alerts",
    "/dashboard/public-intelligence",
  ],
  API_USER: ["/dashboard", "/dashboard/public-intelligence"],
};

export function canAccessRoute(
  role: string | undefined,
  route: string
) {
  if (!role) {
    return false;
  }

  const allowed = roleMatrix[role] || [];
  if (allowed.includes("*")) {
    return true;
  }
  return allowed.includes(route);
}
