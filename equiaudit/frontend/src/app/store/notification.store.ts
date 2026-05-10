import { create } from "zustand";

export type NotificationSeverity =
  | "info"
  | "success"
  | "warning"
  | "error";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  createdAt: number;
  read: boolean;
}

interface NotificationState {
  items: AppNotification[];
  isCenterOpen: boolean;
  push: (
    notification: Omit<
      AppNotification,
      "id" | "createdAt" | "read"
    >
  ) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  toggleCenter: () => void;
  closeCenter: () => void;
}

export const useNotificationStore =
  create<NotificationState>((set) => ({
    items: [],
    isCenterOpen: false,
    push: (notification) =>
      set((state) => ({
        items: [
          {
            id: `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}`,
            createdAt: Date.now(),
            read: false,
            ...notification,
          },
          ...state.items,
        ].slice(0, 60),
      })),
    markRead: (id) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id
            ? { ...item, read: true }
            : item
        ),
      })),
    markAllRead: () =>
      set((state) => ({
        items: state.items.map((item) => ({
          ...item,
          read: true,
        })),
      })),
    remove: (id) =>
      set((state) => ({
        items: state.items.filter(
          (item) => item.id !== id
        ),
      })),
    toggleCenter: () =>
      set((state) => ({
        isCenterOpen: !state.isCenterOpen,
      })),
    closeCenter: () => set({ isCenterOpen: false }),
  }));
