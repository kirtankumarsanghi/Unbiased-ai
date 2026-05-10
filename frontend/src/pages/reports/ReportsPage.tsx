import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import SectionHeader from "../../components/common/SectionHeader";
import CyberButton from "../../components/common/CyberButton";

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <PageContainer>
        <SectionHeader
          title="Audit Reports"
          subtitle="Exportable fairness reports and compliance summaries"
        />

        <div className="bg-surface border border-border p-10">
          <h3 className="text-2xl font-semibold text-primary">
            Regulatory Export
          </h3>

          <p className="mt-4 text-muted max-w-2xl">
            Generate GDPR Article 22, EU AI Act, and EEOC aligned
            fairness reports.
          </p>

          <CyberButton className="mt-8">
            Generate Report
          </CyberButton>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
