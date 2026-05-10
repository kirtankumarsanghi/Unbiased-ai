import { X } from "lucide-react";

import { useNotificationStore } from "../../app/store/notification.store";

export default function NotificationCenter() {
  const items = useNotificationStore(
    (state) => state.items
  );
  const isOpen = useNotificationStore(
    (state) => state.isCenterOpen
  );
  const close = useNotificationStore(
    (state) => state.closeCenter
  );
  const markAllRead = useNotificationStore(
    (state) => state.markAllRead
  );
  const remove = useNotificationStore(
    (state) => state.remove
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-[2px]">
      <div className="absolute right-0 top-0 h-full w-full max-w-md border-l border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">
            Notification Center
          </h3>
          <button
            onClick={close}
            className="text-muted hover:text-primary transition-colors"
            aria-label="Close notifications"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-widest">
          <span className="text-muted">
            {items.length} events
          </span>
          <button
            onClick={markAllRead}
            className="text-primary hover:text-primary-dark transition-colors"
          >
            Mark all read
          </button>
        </div>

        <div className="mt-4 space-y-3 max-h-[calc(100vh-130px)] overflow-y-auto pr-1">
          {items.length === 0 ? (
            <div className="border border-border p-4 text-sm text-muted">
              No new notifications.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={`border p-4 ${
                  item.read
                    ? "border-border bg-background/30"
                    : "border-primary/40 bg-primary/5"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm text-text-primary">
                      {item.message}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-muted hover:text-error transition-colors"
                    aria-label="Dismiss notification"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
