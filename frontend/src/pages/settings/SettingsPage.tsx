import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import SectionHeader from "../../components/common/SectionHeader";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <PageContainer>
        <SectionHeader
          title="Platform Settings"
          subtitle="System preferences and configuration"
        />

        <div className="bg-surface border border-border p-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-primary">
              Audit Frequency
            </h3>

            <p className="mt-2 text-muted">
              Configure automated fairness audits.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary">
              Notification Channels
            </h3>

            <p className="mt-2 text-muted">
              Email, Slack, and webhook integrations.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary">
              Access Control
            </h3>

            <p className="mt-2 text-muted">
              RBAC and organization permissions.
            </p>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
