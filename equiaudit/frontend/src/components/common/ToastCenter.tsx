import { useEffect } from "react";

import { useNotificationStore } from "../../app/store/notification.store";

const severityClasses = {
  info: "border-info/40 bg-info/10 text-info",
  success:
    "border-success/40 bg-success/10 text-success",
  warning:
    "border-warning/40 bg-warning/10 text-warning",
  error: "border-error/40 bg-error/10 text-error",
};

export default function ToastCenter() {
  const items = useNotificationStore(
    (state) => state.items
  );
  const remove = useNotificationStore(
    (state) => state.remove
  );

  const recent = items.slice(0, 4);

  useEffect(() => {
    const timers = recent.map((item) =>
      setTimeout(() => remove(item.id), 5000)
    );
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [recent, remove]);

  return (
    <div className="fixed right-4 top-4 z-[120] w-[340px] max-w-[calc(100vw-2rem)] space-y-2 pointer-events-none">
      {recent.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto border p-3 backdrop-blur-md shadow-lg ${severityClasses[item.severity]}`}
        >
          <p className="text-xs uppercase tracking-widest opacity-90">
            {item.title}
          </p>
          <p className="mt-1 text-sm text-text-primary">
            {item.message}
          </p>
        </div>
      ))}
    </div>
  );
}
