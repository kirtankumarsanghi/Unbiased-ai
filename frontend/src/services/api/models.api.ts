// Models API methods
import { apiClient } from "./axios";

export const modelsApi = {
  getModels: async () => {
    const response =
      await apiClient.get("/models");

    return response.data;
  },

  getModelById: async (
    id: string
  ) => {
    const response =
      await apiClient.get(
        `/models/${id}`
      );

    return response.data;
  },

  uploadModel: async (
    formData: FormData
  ) => {
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
    const response =
      await apiClient.delete(
        `/models/${id}`
      );

    return response.data;
  },
};