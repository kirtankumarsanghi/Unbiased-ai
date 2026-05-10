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
  },

  {
    label: "Models",
    path: "/dashboard/models",
    icon: Brain,
  },

  {
    label: "Audits",
    path: "/dashboard/audits",
    icon: Gauge,
  },

  {
    label: "Interventions",
    path: "/dashboard/interventions",
    icon: Scale,
  },

  {
    label: "Reports",
    path: "/dashboard/reports",
    icon: FileBarChart,
  },

  {
    label: "Alerts",
    path: "/dashboard/alerts",
    icon: Bell,
  },

  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
];