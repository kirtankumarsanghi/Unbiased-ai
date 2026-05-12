import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileDown, FileJson, CheckCircle2, AlertCircle, Loader2, Zap } from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import CyberButton from "../../components/common/CyberButton";

import { reportsApi } from "../../services/api/reports.api";

interface ApiReport {
  id: string | number;
  title?: string;
  status?: string;
  generated_at?: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } }
};

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

  const handleDownload = async (
    reportId: string | number,
    format: "pdf" | "json" | "txt"
  ) => {
    const blob = await reportsApi.downloadReport(String(reportId), format);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${reportId}.${format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <PageContainer>
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="pb-12">
          {/* Header Section */}
          <motion.div variants={fadeUp} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                    <FileDown className="text-primary w-5 h-5" />
                  </div>
                  <h1 className="text-3xl font-bold text-text-primary tracking-tight">Audit Reports</h1>
                </div>
                <p className="text-muted text-sm md:text-base max-w-2xl">
                  Exportable fairness reports and compliance summaries aligned with global regulations.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-surface-elevated border border-border rounded-xl shadow-premium overflow-hidden">
            <div className="p-6 md:p-8 border-b border-border/50 flex flex-col md:flex-row items-start justify-between gap-6 bg-surface/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Regulatory Export
                </h3>
                <p className="mt-2 text-text-secondary max-w-2xl text-sm">
                  Generate comprehensive GDPR Article 22, EU AI Act, and EEOC aligned fairness reports. Each export is cryptographically signed for compliance tracking.
                </p>
              </div>

              <div className="relative z-10 shrink-0">
                <CyberButton
                  size="lg"
                  onClick={() => mutate()}
                  disabled={isPending}
                  className="w-full sm:w-auto"
                >
                  {isPending ? (
                    <><Loader2 size={16} className="animate-spin mr-2" /> Compiling Data...</>
                  ) : (
                    <><Zap size={16} className="mr-2" /> Generate Report</>
                  )}
                </CyberButton>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-background">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-primary">
                  <Loader2 size={24} className="animate-spin" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Retrieving Records...</span>
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-error">
                  <AlertCircle size={32} className="opacity-80" />
                  <span className="text-sm font-medium">Unable to connect to the reporting registry.</span>
                </div>
              ) : reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted">
                  <FileDown size={32} className="opacity-50" />
                  <span className="text-sm">No compliance reports generated yet.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reports.map((report: ApiReport, index: number) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={report.id}
                      className="border border-border/80 bg-surface/50 p-5 rounded-xl hover:border-primary/30 transition-colors shadow-sm group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-sm font-bold text-text-primary pr-4">
                          {report.title || "Compliance Report"}
                        </h4>
                        <div className={`shrink-0 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold border ${
                          report.status === "READY" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                        }`}>
                          {report.status || "UNKNOWN"}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-6 rounded bg-background border border-border flex items-center justify-center">
                          <CheckCircle2 size={12} className="text-success" />
                        </div>
                        <p className="text-xs text-text-secondary font-mono">
                          {report.generated_at || "Pending"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                        <CyberButton
                          variant="outline"
                          size="sm"
                          className="flex-1 min-w-[120px]"
                          onClick={() => handleDownload(report.id, "pdf")}
                        >
                          <FileDown size={14} /> PDF
                        </CyberButton>
                        <CyberButton
                          variant="secondary"
                          size="sm"
                          className="flex-1 min-w-[120px]"
                          onClick={() => handleDownload(report.id, "json")}
                        >
                          <FileJson size={14} /> JSON
                        </CyberButton>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </PageContainer>
    </DashboardLayout>
  );
}
