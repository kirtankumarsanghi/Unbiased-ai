import { useQuery } from "@tanstack/react-query";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import KPIGrid from "../../components/dashboard/KPIGrid";
import HeroSection from "../../components/dashboard/HeroSection";
import TerminalLog from "../../components/common/TerminalLog";

import { auditLogsApi } from "../../services/api/auditLogs.api";

import { AuditLog } from "../../types/audit.types";

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: auditLogsApi.getAuditLogs,
  });

  const logs = Array.isArray(data) ? (data as AuditLog[]) : [];

  return (
    <DashboardLayout>
      <PageContainer>
        <HeroSection />

        <div className="mt-10">
          <KPIGrid />
        </div>

        <div className="mt-10">
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
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
