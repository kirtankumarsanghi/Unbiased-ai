import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import SectionHeader from "../../components/common/SectionHeader";
import CyberButton from "../../components/common/CyberButton";

import { interventions } from "../../assets/mock/interventions";

export default function InterventionsPage() {
  return (
    <DashboardLayout>
      <PageContainer>
        <SectionHeader
          title="Fairness Interventions"
          subtitle="Bias mitigation and correction protocols"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interventions.map((intervention) => (
            <div
              key={intervention.id}
              className="bg-surface border border-border p-6"
            >
              <h3 className="text-xl font-semibold text-primary">
                {intervention.name}
              </h3>

              <div className="mt-6 space-y-3 text-sm">
                <p>
                  Fairness Gain: {" "}
                  <span className="text-primary">
                    {intervention.fairnessGain}
                  </span>
                </p>

                <p>
                  Accuracy Delta: {" "}
                  <span className="text-warning">
                    {intervention.accuracyTradeoff}
                  </span>
                </p>

                <p>
                  Processing Time: {" "}
                  {intervention.processingTime}
                </p>
              </div>

              <CyberButton className="mt-6 w-full">
                Activate Protocol
              </CyberButton>
            </div>
          ))}
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
