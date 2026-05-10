import { useQuery } from "@tanstack/react-query";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import SectionHeader from "../../components/common/SectionHeader";

import { alertsApi } from "../../services/api/alerts.api";

interface ApiAlert {
  severity?: string;
  message?: string;
}

const severityStyles: Record<string, string> = {
  CRITICAL: "bg-error/10 border-error text-error",
  WARNING: "bg-warning/10 border-warning text-warning",
  INFO: "bg-primary/10 border-primary text-primary",
  SYSTEM: "bg-surface-light border-border text-muted",
};

export default function AlertsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["alerts"],
    queryFn: alertsApi.getAlerts,
  });

  const alerts = Array.isArray(data) ? data : [];

  return (
    <DashboardLayout>
      <PageContainer>
        <SectionHeader
          title="System Alerts"
          subtitle="Bias threshold breaches and anomaly detection"
        />

        {isLoading ? (
          <div className="bg-surface border border-border p-6 text-xs uppercase tracking-widest text-muted">
            Loading alerts...
          </div>
        ) : isError ? (
          <div className="bg-error/10 border border-error p-6 text-sm text-error">
            Unable to load alerts.
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-surface border border-border p-6 text-sm text-muted">
            No alerts detected.
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert: ApiAlert, index: number) => {
              const severity = alert.severity || "INFO";

              return (
                <div
                  key={`${severity}-${index}`}
                  className={`border p-6 ${
                    severityStyles[severity] ||
                    "bg-surface border-border text-muted"
                  }`}
                >
                  <h3 className="font-semibold">
                    {severity} ALERT
                  </h3>

                  <p className="mt-2 text-sm">
                    {alert.message || "Alert raised."}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
