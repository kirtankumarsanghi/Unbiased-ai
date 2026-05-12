import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { NAVIGATION } from "../../constants/navigation";
import { useAuthStore } from "../../app/store/auth.store";
import { useUIStore } from "../../app/store/ui.store";

export default function Sidebar() {
  const location = useLocation();
  const role = useAuthStore((state) => state.user?.role);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  const items = NAVIGATION.filter((item) => item.allowedRoles.includes(role || ""));

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" 
          onClick={closeSidebar}
        />
      )}
      
      <aside
        className={`w-[280px] min-h-screen bg-surface/95 backdrop-blur-xl border-r border-border/60 flex flex-col fixed lg:static z-50 transition-transform duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-8 border-b border-border/40 relative overflow-hidden">
          {/* Subtle cyber background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-text-secondary relative z-10">
            Unbiased AI
          </h1>

          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-text-secondary">
              Command Center
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto relative z-10">
          {items.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 uppercase tracking-widest text-xs font-semibold ${
                  active
                    ? "text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg shadow-[0_0_15px_rgb(var(--color-primary)/0.15)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <span className="relative z-10 flex items-center gap-3">
                  <Icon size={18} className={active ? "text-primary" : "text-muted group-hover:text-text-primary transition-colors"} />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        
        {/* Decorative footer */}
        <div className="p-4 border-t border-border/40 bg-surface/50">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/60">
            <div className="w-8 h-8 rounded bg-surface-elevated border border-border flex items-center justify-center">
              <span className="text-xs font-bold text-primary">v4</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-primary uppercase tracking-widest">System Status</span>
              <span className="text-[10px] text-success font-semibold tracking-wider">OPTIMAL</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
