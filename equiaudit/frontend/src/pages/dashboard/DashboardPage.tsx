import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import KPIGrid from "../../components/dashboard/KPIGrid";
import HeroSection from "../../components/dashboard/HeroSection";
import TerminalLog from "../../components/common/TerminalLog";

import { auditLogs } from "../../assets/mock/auditLogs";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <PageContainer>
        <HeroSection />

        <div className="mt-10">
          <KPIGrid />
        </div>

        <div className="mt-10">
          <TerminalLog logs={auditLogs} />
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
