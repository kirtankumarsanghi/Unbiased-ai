import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import FairnessBarChart from "../../components/charts/FairnessBarChart";
import BiasTrendChart from "../../components/charts/BiasTrendChart";
import SectionHeader from "../../components/common/SectionHeader";

import { fairnessMetrics } from "../../assets/mock/metrics";

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

export default function AuditsPage() {
  return (
    <DashboardLayout>
      <PageContainer>
        <SectionHeader
          title="Audit Monitoring"
          subtitle="Real-time fairness metrics"
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <FairnessBarChart data={fairnessMetrics} />
          <BiasTrendChart data={trendData} />
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
