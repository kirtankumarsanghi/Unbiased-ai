import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  Brain,
  Gauge,
  Scale,
  FileBarChart,
  Settings,
  Bell,
} from "lucide-react";

const items = [
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

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-[280px] min-h-screen bg-surface border-r border-border hidden lg:flex flex-col">
      <div className="p-8 border-b border-border">
        <h1 className="text-4xl font-bold text-primary">
          EquiAudit
        </h1>

        <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted">
          Precision Audit Active
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 border transition-all duration-200 uppercase tracking-widest text-xs
              
              ${
                active
                  ? "border-primary bg-primary/10 text-primary shadow-glow"
                  : "border-transparent text-muted hover:border-primary/30 hover:text-primary"
              }`}
            >
              <Icon size={18} />

              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
