import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import SectionHeader from "../../components/common/SectionHeader";

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <PageContainer>
        <SectionHeader
          title="System Alerts"
          subtitle="Bias threshold breaches and anomaly detection"
        />

        <div className="space-y-4">
          <div className="bg-error/10 border border-error p-6">
            <h3 className="text-error font-semibold">CRITICAL ALERT</h3>

            <p className="mt-2">
              RiskEval disparate impact threshold breached.
            </p>
          </div>

          <div className="bg-warning/10 border border-warning p-6">
            <h3 className="text-warning font-semibold">WARNING</h3>

            <p className="mt-2">
              CreditLens fairness drift detected.
            </p>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
