import {
  Bell,
  Settings,
  Terminal,
} from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">
          AI Accountability Platform
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-muted hover:text-primary transition-colors">
          <Bell size={20} />
        </button>

        <button className="text-muted hover:text-primary transition-colors">
          <Settings size={20} />
        </button>

        <button className="text-muted hover:text-primary transition-colors">
          <Terminal size={20} />
        </button>

        <div className="w-8 h-8 border border-primary bg-surface-light" />
      </div>
    </header>
  );
}
