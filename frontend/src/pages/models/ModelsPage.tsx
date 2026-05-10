import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import ModelsTable from "../../components/tables/ModelsTable";
import SectionHeader from "../../components/common/SectionHeader";

import { mockModels } from "../../assets/mock/models";

export default function ModelsPage() {
  return (
    <DashboardLayout>
      <PageContainer>
        <SectionHeader
          title="Model Registry"
          subtitle="Registered AI systems and fairness telemetry"
        />

        <ModelsTable models={mockModels} />
      </PageContainer>
    </DashboardLayout>
  );
}
