// Models API methods
import { apiClient } from "./axios";
import { isMockEnabled } from "./mock";
import { mockModels } from "../../assets/mock/models";

export const modelsApi = {
  getModels: async () => {
    if (isMockEnabled()) {
      return mockModels;
    }
    const response =
      await apiClient.get("/models");

    return response.data;
  },

  getModelById: async (
    id: string
  ) => {
    if (isMockEnabled()) {
      return mockModels.find((model) => model.id === id) || null;
    }
    const response =
      await apiClient.get(
        `/models/${id}`
      );

    return response.data;
  },

  uploadModel: async (
    formData: FormData
  ) => {
    if (isMockEnabled()) {
      return {
        id: `mock-${Date.now()}`,
        name: formData.get("name") || "Mock Model",
        status: "SAFE",
      };
    }
    const response =
      await apiClient.post(
        "/models/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
  },

  deleteModel: async (
    id: string
  ) => {
    if (isMockEnabled()) {
      return { deleted: true, id };
    }
    const response =
      await apiClient.delete(
        `/models/${id}`
      );

    return response.data;
  },
};