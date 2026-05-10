// Navigation constants

import {
  Activity,
  Brain,
  Gauge,
  Scale,
  FileBarChart,
  Bell,
  Settings,
} from "lucide-react";

export const NAVIGATION = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: Activity,
    allowedRoles: [
      "SUPER_ADMIN",
      "ORG_ADMIN",
      "ANALYST",
      "AUDITOR",
      "API_USER",
    ],
  },

  {
    label: "Models",
    path: "/dashboard/models",
    icon: Brain,
    allowedRoles: [
      "SUPER_ADMIN",
      "ORG_ADMIN",
      "ANALYST",
    ],
  },

  {
    label: "Audits",
    path: "/dashboard/audits",
    icon: Gauge,
    allowedRoles: [
      "SUPER_ADMIN",
      "ORG_ADMIN",
      "ANALYST",
      "AUDITOR",
    ],
  },

  {
    label: "Interventions",
    path: "/dashboard/interventions",
    icon: Scale,
    allowedRoles: ["SUPER_ADMIN", "ORG_ADMIN"],
  },

  {
    label: "Reports",
    path: "/dashboard/reports",
    icon: FileBarChart,
    allowedRoles: [
      "SUPER_ADMIN",
      "ORG_ADMIN",
      "ANALYST",
      "AUDITOR",
    ],
  },

  {
    label: "Alerts",
    path: "/dashboard/alerts",
    icon: Bell,
    allowedRoles: [
      "SUPER_ADMIN",
      "ORG_ADMIN",
      "ANALYST",
      "AUDITOR",
    ],
  },

  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
    allowedRoles: ["SUPER_ADMIN", "ORG_ADMIN"],
  },
];
