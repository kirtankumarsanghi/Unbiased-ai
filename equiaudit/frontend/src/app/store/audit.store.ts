// Audit store logic
import { create } from "zustand";

export interface AuditMetric {
  metric: string;
  value: number;
}

interface AuditState {
  metrics: AuditMetric[];

  setMetrics: (metrics: AuditMetric[]) => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  metrics: [],

  setMetrics: (metrics) =>
    set({
      metrics,
    }),
}));