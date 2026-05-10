import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import FairnessBarChart from "../../components/charts/FairnessBarChart";
import BiasTrendChart from "../../components/charts/BiasTrendChart";
import SectionHeader from "../../components/common/SectionHeader";

import { auditsApi } from "../../services/api/audits.api";

import { AuditMetric } from "../../types/audit.types";

const trendData = [
  {
    day: "Mon",
    value: 0.91,
  },
  {
    day: "Tue",
    value: 0.89,
  },
  {
    day: "Wed",
    value: 0.88,
  },
  {
    day: "Thu",
    value: 0.85,
  },
  {
    day: "Fri",
    value: 0.83,
  },
];

interface MetricsResponse {
  demographic_parity?: number;
  equalized_odds?: number;
  disparate_impact?: number;
}

const mapMetrics = (data: MetricsResponse | null): AuditMetric[] => {
  if (!data) {
    return [];
  }

  return [
    {
      metric: "Demographic Parity",
      value: Number(data.demographic_parity ?? 0),
    },
    {
      metric: "Equalized Odds",
      value: Number(data.equalized_odds ?? 0),
    },
    {
      metric: "Disparate Impact",
      value: Number(data.disparate_impact ?? 0),
    },
  ];
};

export default function AuditsPage() {
  const [modelId, setModelId] = useState("1");
  const [auditId, setAuditId] = useState<string | null>(null);

  const runMutation = useMutation({
    mutationFn: (id: string) => auditsApi.runAudit(id),
    onSuccess: (response) => {
      const id = String(response?.audit_id || "");
      if (id) {
        setAuditId(id);
      }
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["audit-metrics", auditId],
    queryFn: () => auditsApi.getMetrics(auditId || ""),
    enabled: Boolean(auditId),
  });

  const metrics = mapMetrics(data ?? null);

  return (
    <DashboardLayout>
      <PageContainer>
        <SectionHeader
          title="Audit Monitoring"
          subtitle="Real-time fairness metrics"
        />

        <div className="bg-surface border border-border p-6 mb-8">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[220px]">
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">
                Model ID
              </label>
              <input
                type="text"
                value={modelId}
                onChange={(event) => setModelId(event.target.value)}
                className="w-full bg-transparent border border-border px-4 py-3 text-sm"
              />
            </div>

            <button
              className="border border-primary/60 text-primary uppercase tracking-widest text-xs font-semibold bg-primary/5 hover:bg-primary/15 hover:shadow-glow transition-all h-12 px-6"
              onClick={() => {
                if (!modelId.trim()) {
                  return;
                }
                runMutation.mutate(modelId.trim());
              }}
              disabled={runMutation.isPending}
            >
              {runMutation.isPending ? "Running" : "Run Audit"}
            </button>
          </div>

          {runMutation.isError && (
            <p className="mt-4 text-sm text-error">
              Unable to run audit. Check model ID.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {!auditId ? (
            <div className="bg-surface border border-border p-6 text-sm text-muted h-[400px] flex items-center justify-center">
              Run an audit to load metrics.
            </div>
          ) : isLoading ? (
            <div className="bg-surface border border-border p-6 text-xs uppercase tracking-widest text-muted h-[400px] flex items-center justify-center">
              Loading metrics...
            </div>
          ) : isError ? (
            <div className="bg-error/10 border border-error p-6 text-sm text-error h-[400px] flex items-center justify-center">
              Unable to load metrics.
            </div>
          ) : metrics.length === 0 ? (
            <div className="bg-surface border border-border p-6 text-sm text-muted h-[400px] flex items-center justify-center">
              No metrics available.
            </div>
          ) : (
            <FairnessBarChart data={metrics} />
          )}

          <BiasTrendChart data={trendData} />
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
