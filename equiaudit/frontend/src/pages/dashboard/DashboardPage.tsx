import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import KPIGrid from "../../components/dashboard/KPIGrid";
import HeroSection from "../../components/dashboard/HeroSection";
import TerminalLog from "../../components/common/TerminalLog";
import FairnessBarChart from "../../components/charts/FairnessBarChart";
import BiasTrendChart from "../../components/charts/BiasTrendChart";
import DisparityChart from "../../components/charts/DisparityChart";
import ModelCard from "../../components/dashboard/ModelCard";

import { auditLogsApi } from "../../services/api/auditLogs.api";
import { modelsApi } from "../../services/api/models.api";
import { useNotificationStore } from "../../app/store/notification.store";

import { AuditLog } from "../../types/audit.types";
import { Model } from "../../types/model.types";

const trendData = [
  { day: "Mon", value: 0.91 },
  { day: "Tue", value: 0.9 },
  { day: "Wed", value: 0.88 },
  { day: "Thu", value: 0.86 },
  { day: "Fri", value: 0.84 },
];

const disparityData = [
  { attribute: "Gender", score: 0.79 },
  { attribute: "Age", score: 0.72 },
  { attribute: "Ethnicity", score: 0.76 },
  { attribute: "Region", score: 0.82 },
  { attribute: "Income", score: 0.74 },
];

interface ApiModel {
  id: string | number;
  name?: string;
  status?: string;
  biasIndex?: number;
  throughput?: string;
  dataDrift?: string;
}

const mapModels = (items: ApiModel[]): Model[] =>
  items.map((model) => ({
    id: String(model.id),
    name: model.name || "Unnamed Model",
    status: (model.status || "SAFE") as Model["status"],
    biasIndex: Number(model.biasIndex ?? 0),
    throughput: model.throughput || "N/A",
    dataDrift: model.dataDrift || "N/A",
  }));

export default function DashboardPage() {
  const push = useNotificationStore((state) => state.push);
  const lastCriticalIdRef = useRef<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: auditLogsApi.getAuditLogs,
  });
  const { data: modelsData } = useQuery({
    queryKey: ["dashboard-models"],
    queryFn: modelsApi.getModels,
  });

  const logs = Array.isArray(data) ? (data as AuditLog[]) : [];
  const models = Array.isArray(modelsData)
    ? mapModels(modelsData as ApiModel[])
    : [];

  const fairnessChartData = useMemo(
    () => [
      {
        metric: "Demographic Parity",
        value: 0.92,
      },
      {
        metric: "Equalized Odds",
        value: 0.87,
      },
      {
        metric: "Disparate Impact",
        value: 0.82,
      },
    ],
    []
  );

  useEffect(() => {
    if (isError) {
      push({
        title: "Telemetry Error",
        message:
          "Audit log stream is unavailable. Verify backend service health.",
        severity: "error",
      });
    }
  }, [isError, push]);

  useEffect(() => {
    const criticalLog = logs.find(
      (log) => log.level === "CRITICAL"
    );
    if (
      criticalLog &&
      lastCriticalIdRef.current !== criticalLog.id
    ) {
      lastCriticalIdRef.current = criticalLog.id;
      push({
        title: "Critical Alert",
        message: criticalLog.message,
        severity: "warning",
      });
    }
  }, [logs, push]);

  return (
    <DashboardLayout>
      <PageContainer>
        <HeroSection />

        <div className="mt-10">
          <KPIGrid />
        </div>

        <section className="mt-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <FairnessBarChart data={fairnessChartData} />
          </div>
          <div>
            <DisparityChart data={disparityData} />
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <BiasTrendChart data={trendData} />
          </div>
          <div className="space-y-4">
            <div className="border border-border bg-surface p-4">
              <p className="text-xs uppercase tracking-widest text-muted">
                High-risk inventory
              </p>
            </div>
            {models.slice(0, 2).map((model) => (
              <ModelCard
                key={model.id}
                name={model.name}
                status={model.status}
                metric={model.biasIndex.toFixed(2)}
              />
            ))}
          </div>
        </section>

        <section className="mt-10">
          {isLoading ? (
            <div className="bg-surface border border-border p-6 text-xs uppercase tracking-widest text-muted">
              Loading audit log stream...
            </div>
          ) : isError ? (
            <div className="bg-error/10 border border-error p-6 text-sm text-error">
              Unable to load audit logs.
            </div>
          ) : logs.length === 0 ? (
            <div className="bg-surface border border-border p-6 text-sm text-muted">
              No audit logs available.
            </div>
          ) : (
            <TerminalLog logs={logs} />
          )}
        </section>
      </PageContainer>
    </DashboardLayout>
  );
}
