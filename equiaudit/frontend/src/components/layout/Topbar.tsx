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
    <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-muted hover:text-primary transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <button
          onClick={toggleSidebar}
          className="hidden lg:inline-flex text-muted hover:text-primary transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
        <div>
        <h2 className="text-xl font-semibold text-primary">
          AI Accountability Platform
        </h2>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted mt-1">
          Telemetry Stream Active
        </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-muted hover:text-primary transition-colors"
          aria-label="Go back"
          title="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          onClick={() => navigate(1)}
          className="text-muted hover:text-primary transition-colors"
          aria-label="Go forward"
          title="Go forward"
        >
          <ArrowRight size={18} />
        </button>

        <button
          onClick={toggleTheme}
          className="text-muted hover:text-primary transition-colors"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        <button
          className="relative text-muted hover:text-primary transition-colors"
          onClick={toggleCenter}
          aria-label="Open notifications"
        >
          <Bell size={20} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-error text-[10px] text-white flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate("/dashboard/settings")}
          className="text-muted hover:text-primary transition-colors"
          aria-label="Open settings"
        >
          <Settings size={20} />
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="text-muted hover:text-primary transition-colors"
          aria-label="Open terminal dashboard"
        >
          <Terminal size={20} />
        </button>

        <button
          onClick={handleLogout}
          className="text-muted hover:text-primary transition-colors"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={20} />
        </button>

        <div className="border border-primary/40 bg-primary/10 text-primary text-[10px] uppercase tracking-widest px-2 py-1">
          {user?.role || "ANALYST"}
        </div>
      </div>
    </header>
  );
}
