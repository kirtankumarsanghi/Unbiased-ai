import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageContainer from "../../components/layout/PageContainer";
import ModelsTable from "../../components/tables/ModelsTable";
import SectionHeader from "../../components/common/SectionHeader";

import { modelsApi } from "../../services/api/models.api";

import { Model } from "../../types/model.types";

interface ApiModel {
  id: string | number;
  name?: string;
  status?: string;
  biasIndex?: number;
  throughput?: string;
  dataDrift?: string;
}

const mapModels = (items: ApiModel[]): Model[] =>
  items.map((model) => ({
    id: String(model.id),
    name: model.name || "Unnamed Model",
    status: (model.status || "SAFE") as Model["status"],
    biasIndex: Number(model.biasIndex ?? 0),
    throughput: model.throughput || "N/A",
    dataDrift: model.dataDrift || "N/A",
  }));

export default function ModelsPage() {
  const queryClient = useQueryClient();
  const [modelName, setModelName] = useState("");
  const [modelFile, setModelFile] = useState<File | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["models"],
    queryFn: modelsApi.getModels,
  });

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) =>
      modelsApi.uploadModel(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["models"],
      });
      setModelName("");
      setModelFile(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => modelsApi.deleteModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["models"],
      });
    },
  });

  const models = Array.isArray(data) ? mapModels(data) : [];

  return (
    <DashboardLayout>
      <PageContainer>
        <SectionHeader
          title="Model Registry"
          subtitle="Registered AI systems and fairness telemetry"
        />

        <div className="bg-surface border border-border p-6 mb-8">
          <h3 className="text-lg font-semibold text-primary">
            Upload New Model
          </h3>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Model name"
              value={modelName}
              onChange={(event) => setModelName(event.target.value)}
              className="bg-transparent border border-border px-4 py-3 text-sm"
            />

            <input
              type="file"
              onChange={(event) =>
                setModelFile(event.target.files?.[0] || null)
              }
              className="bg-transparent border border-border px-4 py-3 text-sm"
            />

            <button
              className="border border-primary/60 text-primary uppercase tracking-widest text-xs font-semibold bg-primary/5 hover:bg-primary/15 hover:shadow-glow transition-all"
              onClick={() => {
                if (!modelFile) {
                  return;
                }

                const formData = new FormData();
                formData.append("file", modelFile);
                if (modelName.trim()) {
                  formData.append("name", modelName.trim());
                }

                uploadMutation.mutate(formData);
              }}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending
                ? "Uploading"
                : "Upload Model"}
            </button>
          </div>

          {!modelFile && (
            <p className="mt-3 text-xs text-muted">
              Select a model file to upload.
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="bg-surface border border-border p-6 text-xs uppercase tracking-widest text-muted">
            Loading models...
          </div>
        ) : isError ? (
          <div className="bg-error/10 border border-error p-6 text-sm text-error">
            Unable to load models. Check backend connectivity.
          </div>
        ) : models.length === 0 ? (
          <div className="bg-surface border border-border p-6 text-sm text-muted">
            No models available.
          </div>
        ) : (
          <ModelsTable
            models={models}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        )}
      </PageContainer>
    </DashboardLayout>
  );
}
