import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import SectionHeader from "../../components/common/SectionHeader";
import CyberButton from "../../components/common/CyberButton";

import { interventionsApi } from "../../services/api/interventions.api";

interface ApiIntervention {
  name?: string;
  status?: string;
  fairnessGain?: string;
  accuracyTradeoff?: string;
  processingTime?: string;
}

const mapInterventions = (
  items: ApiIntervention[]
) =>
  items.map((intervention, index) => ({
    id: index + 1,
    name: intervention.name || "Unnamed Protocol",
    status: intervention.status || "STANDBY",
    fairnessGain: intervention.fairnessGain || "+0%",
    accuracyTradeoff:
      intervention.accuracyTradeoff || "0%",
    processingTime: intervention.processingTime || "N/A",
  }));

export default function InterventionsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["interventions"],
    queryFn: interventionsApi.getInterventions,
  });

  const enableMutation = useMutation({
    mutationFn: (name: string) =>
      interventionsApi.enableIntervention("1", name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["interventions"],
      });
    },
  });

  const disableMutation = useMutation({
    mutationFn: (name: string) =>
      interventionsApi.disableIntervention("1", name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["interventions"],
      });
    },
  });

  const interventions = Array.isArray(data)
    ? mapInterventions(data)
    : [];

  return (
    <DashboardLayout>
      <PageContainer>
        <SectionHeader
          title="Fairness Interventions"
          subtitle="Bias mitigation and correction protocols"
        />

        {isLoading ? (
          <div className="bg-surface border border-border p-6 text-xs uppercase tracking-widest text-muted">
            Loading interventions...
          </div>
        ) : isError ? (
          <div className="bg-error/10 border border-error p-6 text-sm text-error">
            Unable to load interventions.
          </div>
        ) : interventions.length === 0 ? (
          <div className="bg-surface border border-border p-6 text-sm text-muted">
            No interventions available.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interventions.map((intervention) => (
              <div
                key={intervention.id}
                className="bg-surface border border-border p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold text-primary">
                    {intervention.name}
                  </h3>

                  <span className="text-xs uppercase tracking-widest text-muted">
                    {intervention.status}
                  </span>
                </div>

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

                <CyberButton
                  className="mt-6 w-full"
                  onClick={() => {
                    if (intervention.status === "ACTIVE") {
                      disableMutation.mutate(intervention.name);
                    } else {
                      enableMutation.mutate(intervention.name);
                    }
                  }}
                  disabled={
                    enableMutation.isPending || disableMutation.isPending
                  }
                >
                  {intervention.status === "ACTIVE"
                    ? "Disable Protocol"
                    : "Activate Protocol"}
                </CyberButton>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
