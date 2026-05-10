import {
  Bell,
  Moon,
  Sun,
  Settings,
  Terminal,
} from "lucide-react";
import { useAuthStore } from "../../app/store/auth.store";
import { useThemeContext } from "../../app/providers/ThemeProvider";
import { useNotificationStore } from "../../app/store/notification.store";

export default function Topbar() {
  const user = useAuthStore((state) => state.user);
  const { theme, toggleTheme } = useThemeContext();
  const toggleCenter = useNotificationStore(
    (state) => state.toggleCenter
  );
  const unread = useNotificationStore((state) =>
    state.items.filter((item) => !item.read).length
  );

  return (
    <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">
          AI Accountability Platform
        </h2>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted mt-1">
          Telemetry Stream Active
        </p>
      </div>

      <div className="flex items-center gap-4">
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

        <button className="text-muted hover:text-primary transition-colors">
          <Settings size={20} />
        </button>

        <button className="text-muted hover:text-primary transition-colors">
          <Terminal size={20} />
        </button>

        <div className="border border-primary/40 bg-primary/10 text-primary text-[10px] uppercase tracking-widest px-2 py-1">
          {user?.role || "ANALYST"}
        </div>
      </div>
    </header>
  );
}
