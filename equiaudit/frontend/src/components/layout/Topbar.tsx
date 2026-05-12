import {
  ArrowLeft,
  ArrowRight,
  Bell,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Settings,
  Terminal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../app/store/auth.store";
import { useThemeContext } from "../../app/providers/ThemeProvider";
import { useNotificationStore } from "../../app/store/notification.store";
import { useUIStore } from "../../app/store/ui.store";
import { authService } from "../../services/auth/auth.service";

export default function Topbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { theme, toggleTheme } = useThemeContext();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const toggleCenter = useNotificationStore(
    (state) => state.toggleCenter
  );
  const unread = useNotificationStore((state) =>
    state.items.filter((item) => !item.read).length
  );

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Best effort logout; always clear local state.
    } finally {
      clearAuth();
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="h-[72px] relative z-30 border-b border-border/50 bg-surface/70 backdrop-blur-xl flex items-center justify-between px-6 shadow-sm">
      {/* Subtle top gradient highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 -ml-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={toggleSidebar}
            className="hidden lg:inline-flex p-2 -ml-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
        </div>
        
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-text-primary to-muted bg-clip-text text-transparent flex items-center gap-2">
            AI Accountability Platform
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <p className="text-[10px] uppercase tracking-[0.25em] text-primary/80 font-medium">
              Telemetry Stream Active
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        <div className="flex items-center bg-background/40 p-1 rounded-lg border border-border/50">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-300"
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="w-[1px] h-4 bg-border/50 mx-1"></div>

          <button
            onClick={() => navigate(1)}
            className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-300"
            aria-label="Go forward"
            title="Go forward"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 bg-background/40 p-1 rounded-lg border border-border/50 ml-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-300"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="relative p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-300"
            onClick={toggleCenter}
            aria-label="Open notifications"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] px-1 rounded-full bg-primary text-[9px] font-bold text-background flex items-center justify-center shadow-glow">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-300"
            aria-label="Open terminal dashboard"
            title="Terminal Dashboard"
          >
            <Terminal size={18} />
          </button>

          <button
            onClick={() => navigate("/dashboard/settings")}
            className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-300"
            aria-label="Open settings"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>

        <div className="w-[1px] h-6 bg-border/50 mx-2 hidden sm:block"></div>

        <button
          onClick={handleLogout}
          className="p-2 text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all duration-300 mr-2"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={18} />
        </button>

        <div className="group relative border border-primary/30 bg-primary/5 px-3 py-1.5 rounded-md hover:bg-primary/10 transition-all duration-300 cursor-default shadow-[0_0_15px_rgba(0,255,136,0.05)] hover:shadow-[0_0_20px_rgba(0,255,136,0.15)] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
            {user?.role || "ANALYST"}
          </span>
          {/* Subtle decorative corners */}
          <div className="absolute -top-[1px] -left-[1px] w-1 h-1 border-t border-l border-primary"></div>
          <div className="absolute -bottom-[1px] -right-[1px] w-1 h-1 border-b border-r border-primary"></div>
        </div>
      </div>
    </header>
  );
}
