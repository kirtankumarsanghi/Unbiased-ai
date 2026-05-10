import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import SectionHeader from "../../components/common/SectionHeader";
import CyberButton from "../../components/common/CyberButton";

import { reportsApi } from "../../services/api/reports.api";

interface ApiReport {
  id: string | number;
  title?: string;
  status?: string;
  generated_at?: string;
}

export default function ReportsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reports"],
    queryFn: reportsApi.listReports,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: reportsApi.generateReport,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });
    },
  });

  const reports = Array.isArray(data) ? data : [];

  const handleDownload = async (reportId: string | number) => {
    const blob = await reportsApi.downloadReport(String(reportId));
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${reportId}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <SectionHeader
          title="Audit Reports"
          subtitle="Exportable fairness reports and compliance summaries"
        />

        <div className="bg-surface border border-border p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-primary">
                Regulatory Export
              </h3>

              <p className="mt-4 text-muted max-w-2xl">
                Generate GDPR Article 22, EU AI Act, and EEOC aligned
                fairness reports.
              </p>
            </div>

            <CyberButton
              className="h-12"
              onClick={() => mutate()}
              disabled={isPending}
            >
              {isPending ? "Generating" : "Generate Report"}
            </CyberButton>
          </div>

          <div className="mt-8">
            {isLoading ? (
              <div className="text-xs uppercase tracking-widest text-muted">
                Loading reports...
              </div>
            ) : isError ? (
              <div className="text-sm text-error">
                Unable to load reports.
              </div>
            ) : reports.length === 0 ? (
              <div className="text-sm text-muted">
                No reports generated yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report: ApiReport) => (
                  <div
                    key={report.id}
                    className="border border-border bg-surface-light p-6"
                  >
                    <h4 className="text-lg font-semibold text-primary">
                      {report.title || "Compliance Report"}
                    </h4>

                    <p className="mt-3 text-xs uppercase tracking-widest text-muted">
                      Status: {report.status || "UNKNOWN"}
                    </p>

                    <p className="mt-3 text-sm text-muted">
                      Generated: {report.generated_at || "Pending"}
                    </p>

                    <CyberButton
                      className="mt-4 h-10"
                      onClick={() => handleDownload(report.id)}
                    >
                      Download
                    </CyberButton>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
