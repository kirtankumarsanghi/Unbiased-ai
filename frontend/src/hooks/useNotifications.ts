// useNotifications hook
import { useState } from "react";

interface Notification {
  id: number;
  type: "success" | "error" | "warning";
  message: string;
}

export function useNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const addNotification = (
    notification: Notification
  ) => {
    setNotifications((prev) => [
      ...prev,
      notification,
    ]);
  };

  const removeNotification = (
    id: number
  ) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  return {
    notifications,

    addNotification,

    removeNotification,
  };
}