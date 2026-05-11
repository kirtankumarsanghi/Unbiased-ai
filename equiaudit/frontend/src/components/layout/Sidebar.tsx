import { Link, useLocation } from "react-router-dom";
import { NAVIGATION } from "../../constants/navigation";
import { useAuthStore } from "../../app/store/auth.store";
import { useUIStore } from "../../app/store/ui.store";

export default function Sidebar() {
  const location = useLocation();
  const role = useAuthStore(
    (state) => state.user?.role
  );
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  const items = NAVIGATION.filter((item) =>
    item.allowedRoles.includes(role || "")
  );

  return (
    <aside
      className={`w-[280px] min-h-screen bg-surface border-r border-border flex flex-col fixed lg:static z-40 transition-transform duration-200 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="p-8 border-b border-border">
        <h1 className="text-4xl font-bold text-primary">
          Unbiased AI
        </h1>

        <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted">
          Command Center Active
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
            onClick={closeSidebar}
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
