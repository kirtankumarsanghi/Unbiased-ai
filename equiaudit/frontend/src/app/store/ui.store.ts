// UI store logic
import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  backendReady: boolean;

  toggleSidebar: () => void;

  closeSidebar: () => void;
  setBackendReady: (ready: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  backendReady: true,

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  closeSidebar: () =>
    set({
      sidebarOpen: false,
    }),

  setBackendReady: (backendReady) =>
    set({
      backendReady,
    }),
}));
