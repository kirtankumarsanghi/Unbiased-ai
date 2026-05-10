const roleMatrix: Record<string, string[]> = {
  SUPER_ADMIN: ["*"],
  ORG_ADMIN: [
    "/dashboard",
    "/dashboard/models",
    "/dashboard/audits",
    "/dashboard/interventions",
    "/dashboard/reports",
    "/dashboard/alerts",
    "/dashboard/settings",
  ],
  ANALYST: [
    "/dashboard",
    "/dashboard/models",
    "/dashboard/audits",
    "/dashboard/reports",
    "/dashboard/alerts",
  ],
  AUDITOR: [
    "/dashboard",
    "/dashboard/audits",
    "/dashboard/reports",
    "/dashboard/alerts",
  ],
  API_USER: ["/dashboard"],
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
